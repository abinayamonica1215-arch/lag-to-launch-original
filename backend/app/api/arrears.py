from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.arrears import (
    ArrearCreateRequest,
    ArrearCreateResponse,
    ArrearCompleteResponse,
    ArrearListResponse,
    ArrearDeleteResponse,
    ArrearAnalyzeRequest,
    ArrearAnalyzeResponse,
)

router = APIRouter(prefix="/arrears", tags=["arrears"])


def get_db_and_ensure_index():
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")
    try:
        db.arrears.create_index([("student_id", 1), ("subject_code", 1)], unique=True)
    except Exception:
        pass
    return db


@router.post("", response_model=ArrearCreateResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ArrearCreateResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def add_arrear(payload: ArrearCreateRequest, current_student: dict = Depends(get_current_student)):
    """
    Adds a subject as an arrear for the currently authenticated student.
    Verifies subject existence, department code, and semester matching.
    Prevents adding duplicate arrears for the same student and subject.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    code_upper = payload.subject_code.strip().upper()

    # Find subject in existing subjects collection
    subject_doc = db.subjects.find_one({"code": code_upper})
    if not subject_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with code '{code_upper}' not found"
        )

    # Verify subject department and semester match student profile
    subject_dept = subject_doc.get("department_code", "").strip().upper()
    subject_sem = subject_doc.get("semester")
    student_dept = str(current_student.get("department_code", "")).strip().upper()
    student_sem = current_student.get("semester")

    if subject_dept != student_dept or subject_sem != student_sem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Subject '{code_upper}' does not belong to your department ({student_dept}) and semester ({student_sem})."
        )

    # Check for existing duplicate arrear for this student
    existing_arrear = db.arrears.find_one({"student_id": student_obj_id, "subject_code": code_upper})
    if existing_arrear:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Arrear for subject '{code_upper}' already exists for this student."
        )

    subject_title = subject_doc.get("title") or subject_doc.get("name", "")
    now = datetime.now(timezone.utc)

    arrear_doc = {
        "student_id": student_obj_id,
        "subject_code": code_upper,
        "subject_title": subject_title,
        "department_code": student_dept,
        "semester": student_sem,
        "status": "active",
        "created_at": now,
    }

    try:
        result = db.arrears.insert_one(arrear_doc)
        inserted_id = str(result.inserted_id)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Arrear for subject '{code_upper}' already exists for this student."
        )

    return {
        "message": "Arrear added successfully",
        "arrear": {
            "id": inserted_id,
            "subject_code": code_upper,
            "subject_title": subject_title,
            "department_code": student_dept,
            "semester": student_sem,
            "status": "active",
        },
    }


@router.get("", response_model=ArrearListResponse, status_code=status.HTTP_200_OK)
@router.get("/", response_model=ArrearListResponse, status_code=status.HTTP_200_OK, include_in_schema=False)
def get_student_arrears(current_student: dict = Depends(get_current_student)):
    """
    Retrieves all arrear subjects belonging exclusively to the currently authenticated student.
    Includes status and completion details if available.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    cursor = db.arrears.find({"student_id": student_obj_id})

    arrears_list = []
    active_cnt = 0
    completed_cnt = 0

    for doc in cursor:
        st = doc.get("status", "active")
        if st == "completed":
            completed_cnt += 1
        else:
            active_cnt += 1

        arrears_list.append({
            "id": str(doc["_id"]),
            "subject_code": doc.get("subject_code", ""),
            "subject_title": doc.get("subject_title", ""),
            "department_code": doc.get("department_code", ""),
            "semester": doc.get("semester", 1),
            "status": st,
            "completed_at": doc.get("completed_at"),
            "final_assessment_percentage": doc.get("final_assessment_percentage"),
            "final_assessment_result_id": doc.get("final_assessment_result_id"),
        })

    return {
        "arrears": arrears_list,
        "active_count": active_cnt,
        "completed_count": completed_cnt,
        "total_count": len(arrears_list),
    }


@router.post("/{arrear_id}/complete", response_model=ArrearCompleteResponse, status_code=status.HTTP_200_OK)
def complete_student_arrear(arrear_id: str, current_student: dict = Depends(get_current_student)):
    """
    Marks an active arrear as completed if the student's latest final assessment for the subject is passed (>= 50%).
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    try:
        arr_obj_id = ObjectId(arrear_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid arrear_id format: '{arrear_id}'"
        )

    arrear_doc = db.arrears.find_one({"_id": arr_obj_id})
    if not arrear_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Arrear with id '{arrear_id}' not found"
        )

    if arrear_doc.get("student_id") != student_obj_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Arrear with id '{arrear_id}' not found"
        )

    # Check if already completed
    if arrear_doc.get("status") == "completed":
        return {
            "message": "Arrear is already completed",
            "arrear": {
                "id": str(arr_obj_id),
                "subject_code": arrear_doc.get("subject_code", ""),
                "subject_title": arrear_doc.get("subject_title", ""),
                "department_code": arrear_doc.get("department_code", ""),
                "semester": arrear_doc.get("semester", 1),
                "status": "completed",
                "completed_at": arrear_doc.get("completed_at"),
                "final_assessment_percentage": arrear_doc.get("final_assessment_percentage"),
                "final_assessment_result_id": arrear_doc.get("final_assessment_result_id"),
            }
        }

    code_upper = arrear_doc.get("subject_code", "").strip().upper()

    # Find latest final assessment result for this subject
    latest_result = db.final_assessment_results.find_one(
        {"student_id": student_obj_id, "subject_code": code_upper},
        sort=[("submitted_at", -1)]
    )

    if not latest_result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No final assessment found for subject '{code_upper}'. Complete and pass the final assessment first."
        )

    if not latest_result.get("passed", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Latest final assessment for subject '{code_upper}' was not passed (Score: {latest_result.get('percentage')}%, required: >= 50%). Pass the final assessment to complete this arrear."
        )

    now = datetime.now(timezone.utc)
    update_fields = {
        "status": "completed",
        "completed_at": now,
        "final_assessment_percentage": latest_result.get("percentage"),
        "final_assessment_result_id": str(latest_result["_id"]),
        "updated_at": now,
    }

    db.arrears.update_one({"_id": arr_obj_id}, {"$set": update_fields})

    return {
        "message": "Arrear marked as completed successfully",
        "arrear": {
            "id": str(arr_obj_id),
            "subject_code": code_upper,
            "subject_title": arrear_doc.get("subject_title", ""),
            "department_code": arrear_doc.get("department_code", ""),
            "semester": arrear_doc.get("semester", 1),
            "status": "completed",
            "completed_at": now,
            "final_assessment_percentage": latest_result.get("percentage"),
            "final_assessment_result_id": str(latest_result["_id"]),
        }
    }


@router.delete("/{arrear_id}", response_model=ArrearDeleteResponse, status_code=status.HTTP_200_OK)
def delete_student_arrear(arrear_id: str, current_student: dict = Depends(get_current_student)):
    """
    Deletes an arrear record matching arrear_id belonging to the currently authenticated student.
    Raises 400 for invalid ObjectId format.
    Raises 404 if arrear is not found or belongs to another student.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    try:
        arr_obj_id = ObjectId(arrear_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid arrear_id format: '{arrear_id}'"
        )

    # Search for the arrear record
    arrear_doc = db.arrears.find_one({"_id": arr_obj_id})
    if not arrear_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Arrear with id '{arrear_id}' not found"
        )

    # Check ownership: student can only delete their own arrear
    if arrear_doc.get("student_id") != student_obj_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Arrear with id '{arrear_id}' not found"
        )

    db.arrears.delete_one({"_id": arr_obj_id, "student_id": student_obj_id})

    return {"message": "Arrear deleted successfully"}


@router.post("/analyze", response_model=ArrearAnalyzeResponse, status_code=status.HTTP_200_OK)
def analyze_arrears(payload: ArrearAnalyzeRequest, current_student: dict = Depends(get_current_student)):
    """
    Generates a personalized, deterministic day-by-day study roadmap for the submitted arrears.
    Uses real topic data from MongoDB.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    student_dept = str(current_student.get("department_code", "")).strip().upper()
    student_sem = current_student.get("semester")
    
    selected_subjects = payload.selectedSubjects
    if not selected_subjects:
        raise HTTPException(status_code=400, detail="No selected subjects provided.")

    arrear_id = "arr_" + str(int(datetime.now(timezone.utc).timestamp() * 1000))
    subject_diagnoses = []
    
    # Roadmap properties
    total_weeks = 3
    days_per_week = len(payload.availableDays) if payload.availableDays else 6
    if days_per_week == 0:
        days_per_week = 6
    total_days = total_weeks * days_per_week
    
    day_duration = payload.studyAvailability if payload.studyAvailability else "2-3 hours"

    for subj_title_or_code in selected_subjects:
        # Query db.subjects matching the subject title or code
        subj_query = {
            "$or": [
                {"code": {"$regex": f"^{subj_title_or_code}$", "$options": "i"}},
                {"title": {"$regex": f"^{subj_title_or_code}$", "$options": "i"}},
                {"name": {"$regex": f"^{subj_title_or_code}$", "$options": "i"}}
            ]
        }
        subject_doc = db.subjects.find_one(subj_query)
        
        real_topics = []
        if subject_doc:
            subj_id = subject_doc["_id"]
            topic_cursor = db.topics.find({"subject_id": subj_id}).sort("unit_number", 1)
            for t in topic_cursor:
                title = t.get("title") or t.get("name") or f"Unit {t.get('unit_number', 1)}"
                real_topics.append(title)
        
        if not real_topics:
            real_topics = ["Introduction & Concepts", "Core Theories", "Problem Solving", "Exam Practice"]
            
        weak_areas = payload.perSubjectWeakAreas.get(subj_title_or_code, [])
        if not weak_areas:
            weak_areas = ["Core Concepts", "Problem Solving"]
            
        weeks_data = []
        local_day_counter = 1
        
        for w in range(1, total_weeks + 1):
            days_data = []
            for d in range(1, days_per_week + 1):
                # Distribute topics
                topic_idx = (w - 1) * days_per_week + (d - 1)
                
                # Prioritize weak areas in the first few days
                day_topics = []
                if topic_idx < len(weak_areas):
                    day_topics = [weak_areas[topic_idx]]
                else:
                    real_idx = (topic_idx - len(weak_areas)) % len(real_topics)
                    day_topics = [real_topics[real_idx]]
                
                day_type = "learning"
                if d == days_per_week:
                    day_type = "assessment"
                elif d == days_per_week - 1:
                    day_type = "practice"
                
                days_data.append({
                    "id": f"w{w}d{d}_{subj_title_or_code}",
                    "dayNumber": local_day_counter,
                    "title": f"Day {local_day_counter}: {day_topics[0]}",
                    "duration": day_duration,
                    "type": day_type,
                    "completed": False,
                    "topics": day_topics
                })
                local_day_counter += 1
                
            weeks_data.append({
                "id": f"w{w}_{subj_title_or_code}",
                "weekNumber": w,
                "title": f"Week {w} Study Plan",
                "description": f"Focusing on {subj_title_or_code} mastery.",
                "progressPercent": 0,
                "days": days_data
            })
            
        subject_diagnoses.append({
            "subject": subj_title_or_code,
            "weakAreas": weak_areas,
            "summary": f"Diagnostic analysis for {subj_title_or_code}. Preparation level is {payload.preparationLevel or 'Basic'}.",
            "weeks": weeks_data
        })
        
    primary_subject = selected_subjects[0]
    primary_diagnosis = subject_diagnoses[0]
    
    analysis = {
        "arrearId": arrear_id,
        "subject": primary_subject,
        "selectedSubjects": selected_subjects,
        "semester": payload.arrearSemester,
        "attempts": payload.attempts,
        "preparationLevel": payload.preparationLevel,
        "recommendedDailyHours": day_duration,
        "keyFocusAreas": primary_diagnosis["weakAreas"],
        "summary": f"Structured multi-subject preparation plan generated for {len(selected_subjects)} arrear subject(s).",
        "subjectDiagnoses": subject_diagnoses
    }
    
    roadmap = {
        "id": "rdm_" + str(int(datetime.now(timezone.utc).timestamp() * 1000)),
        "subject": primary_subject,
        "selectedSubjects": selected_subjects,
        "totalWeeks": total_weeks,
        "totalDays": total_days,
        "completedDays": 0,
        "currentDay": 1,
        "weeks": primary_diagnosis["weeks"],
        "subjectDiagnoses": subject_diagnoses
    }
    
    return {
        "success": True,
        "arrearId": arrear_id,
        "analysis": analysis,
        "roadmap": roadmap
    }

