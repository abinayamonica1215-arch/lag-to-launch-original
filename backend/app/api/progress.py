from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.progress import (
    ProgressCreateUpdate,
    ProgressItem,
    ProgressListResponse,
    ProgressSummary,
    SubjectProgressResponse,
    ProgressDeleteResponse,
    TopicProgressDetailResponse,
)


router = APIRouter(prefix="/progress", tags=["progress"])


def get_db_and_ensure_index():
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")
    try:
        db.progress.create_index([("student_id", 1), ("topic_id", 1)], unique=True)
    except Exception:
        pass
    return db


@router.post("", response_model=ProgressItem, status_code=status.HTTP_200_OK)
@router.post("/", response_model=ProgressItem, status_code=status.HTTP_200_OK, include_in_schema=False)
def create_or_update_progress(
    payload: ProgressCreateUpdate,
    current_student: dict = Depends(get_current_student)
):
    """
    Creates or updates topic-level learning progress for the authenticated student.
    Validates subject, topic ID format, topic-subject association, and department/semester match.
    Enforces percentage validation (completed=True requires 100%, completed=False requires < 100%).
    Upserts record to prevent duplicates for the same student + topic.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    try:
        topic_obj_id = ObjectId(payload.topic_id.strip())
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid topic_id format: '{payload.topic_id}'"
        )

    code_upper = payload.subject_code.strip().upper()

    # 1. Check subject exists
    subject_doc = db.subjects.find_one({"code": code_upper})
    if not subject_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with code '{code_upper}' not found"
        )

    # 2. Check department and semester match student profile
    subject_dept = str(subject_doc.get("department_code", "")).strip().upper()
    subject_sem = subject_doc.get("semester")
    student_dept = str(current_student.get("department_code", "")).strip().upper()
    student_sem = current_student.get("semester")

    if subject_dept != student_dept or subject_sem != student_sem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Subject '{code_upper}' does not belong to your department ({student_dept}) and semester ({student_sem})."
        )

    # 3. Check topic exists and belongs to subject
    topic_doc = db.topics.find_one({"_id": topic_obj_id})
    if not topic_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic with id '{payload.topic_id}' not found"
        )

    if topic_doc.get("subject_id") != subject_doc["_id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Topic '{payload.topic_id}' does not belong to subject '{code_upper}'."
        )

    # 4. Validate progress percentage vs completed
    if payload.completed and payload.progress_percentage != 100.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="progress_percentage must be 100 when completed is true"
        )

    if not payload.completed and payload.progress_percentage >= 100.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="progress_percentage must be less than 100 when completed is false"
        )

    now = datetime.now(timezone.utc)
    completed_at = now if payload.completed else None

    # 5. Upsert progress record
    existing = db.progress.find_one({"student_id": student_obj_id, "topic_id": topic_obj_id})

    if existing:
        update_doc = {
            "subject_code": code_upper,
            "completed": payload.completed,
            "progress_percentage": payload.progress_percentage,
            "completed_at": completed_at,
            "updated_at": now,
        }
        db.progress.update_one({"_id": existing["_id"]}, {"$set": update_doc})
        prog_id = str(existing["_id"])
    else:
        new_doc = {
            "student_id": student_obj_id,
            "subject_code": code_upper,
            "topic_id": topic_obj_id,
            "completed": payload.completed,
            "progress_percentage": payload.progress_percentage,
            "completed_at": completed_at,
            "created_at": now,
            "updated_at": now,
        }
        try:
            res = db.progress.insert_one(new_doc)
            prog_id = str(res.inserted_id)
        except DuplicateKeyError:
            db.progress.update_one(
                {"student_id": student_obj_id, "topic_id": topic_obj_id},
                {"$set": {
                    "subject_code": code_upper,
                    "completed": payload.completed,
                    "progress_percentage": payload.progress_percentage,
                    "completed_at": completed_at,
                    "updated_at": now,
                }}
            )
            ex = db.progress.find_one({"student_id": student_obj_id, "topic_id": topic_obj_id})
            prog_id = str(ex["_id"])

    return {
        "id": prog_id,
        "subject_code": code_upper,
        "topic_id": str(topic_obj_id),
        "completed": payload.completed,
        "progress_percentage": payload.progress_percentage,
        "completed_at": completed_at,
        "updated_at": now,
    }


@router.get("", response_model=ProgressListResponse, status_code=status.HTTP_200_OK)
@router.get("/", response_model=ProgressListResponse, status_code=status.HTTP_200_OK, include_in_schema=False)
def get_student_progress(current_student: dict = Depends(get_current_student)):
    """
    Retrieves all topic progress records belonging exclusively to the currently authenticated student.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    cursor = db.progress.find({"student_id": student_obj_id})

    progress_list = []
    for doc in cursor:
        progress_list.append({
            "id": str(doc["_id"]),
            "subject_code": doc.get("subject_code", ""),
            "topic_id": str(doc.get("topic_id", "")),
            "completed": doc.get("completed", False),
            "progress_percentage": float(doc.get("progress_percentage", 0.0)),
            "completed_at": doc.get("completed_at"),
            "updated_at": doc.get("updated_at", doc.get("created_at")),
        })

    return {"progress": progress_list}


@router.get("/summary", response_model=ProgressSummary, status_code=status.HTTP_200_OK)
def get_progress_summary(current_student: dict = Depends(get_current_student)):
    """
    Computes an overall learning progress summary for the authenticated student based on database state.
    Calculates total subjects, total topics, completed topics, pending topics, overall progress percentage,
    and number of completed subjects (where all subject topics are marked completed=true).
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    student_dept = str(current_student.get("department_code", "")).strip().upper()
    student_sem = current_student.get("semester")

    # 1. Fetch subjects for student's department and semester
    subject_cursor = db.subjects.find({"department_code": student_dept, "semester": student_sem})
    subject_docs = list(subject_cursor)
    total_subjects = len(subject_docs)
    subject_ids = [s["_id"] for s in subject_docs]

    # 2. Fetch all topics for these subjects
    topic_cursor = db.topics.find({"subject_id": {"$in": subject_ids}})
    topic_docs = list(topic_cursor)
    total_topics = len(topic_docs)

    subject_topics_map: dict[ObjectId, list[ObjectId]] = {}
    for t in topic_docs:
        subject_topics_map.setdefault(t["subject_id"], []).append(t["_id"])

    topic_ids = [t["_id"] for t in topic_docs]

    # 3. Fetch student's completed topic progress records
    completed_cursor = db.progress.find({
        "student_id": student_obj_id,
        "topic_id": {"$in": topic_ids},
        "completed": True,
    })
    completed_topic_ids = {doc["topic_id"] for doc in completed_cursor}

    completed_topics = len(completed_topic_ids)
    pending_topics = total_topics - completed_topics

    if total_topics > 0:
        overall_percentage = round((completed_topics / float(total_topics)) * 100.0, 2)
    else:
        overall_percentage = 0.0

    # 4. Calculate subjects_completed (all topics completed)
    subjects_completed = 0
    for s_id, t_ids in subject_topics_map.items():
        if len(t_ids) > 0 and all(tid in completed_topic_ids for tid in t_ids):
            subjects_completed += 1

    return {
        "total_subjects": total_subjects,
        "total_topics": total_topics,
        "completed_topics": completed_topics,
        "pending_topics": pending_topics,
        "overall_progress_percentage": overall_percentage,
        "subjects_completed": subjects_completed,
    }


@router.get("/topic/{topic_id}", response_model=TopicProgressDetailResponse, status_code=status.HTTP_200_OK)
def get_topic_progress(topic_id: str, current_student: dict = Depends(get_current_student)):
    """
    Retrieves topic-level progress and latest daily assessment score for the authenticated student.
    Raises 400 for invalid topic_id format.
    Raises 404 if no progress record exists for this topic for the authenticated student.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    try:
        topic_obj_id = ObjectId(topic_id.strip())
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid topic_id format: '{topic_id}'"
        )

    doc = db.progress.find_one({"student_id": student_obj_id, "topic_id": topic_obj_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No progress found for topic '{topic_id}'"
        )

    return {
        "id": str(doc["_id"]),
        "subject_code": doc.get("subject_code", ""),
        "topic_id": str(doc.get("topic_id", "")),
        "completed": doc.get("completed", False),
        "progress_percentage": float(doc.get("progress_percentage", 0.0)),
        "latest_score": doc.get("latest_score"),
        "total_questions": doc.get("total_questions"),
        "latest_percentage": doc.get("latest_percentage"),
        "assessment_completed": doc.get("assessment_completed", doc.get("completed", False)),
        "completed_at": doc.get("completed_at"),
        "updated_at": doc.get("updated_at", doc.get("created_at")),
    }


@router.get("/subject/{subject_code}", response_model=SubjectProgressResponse, status_code=status.HTTP_200_OK)
def get_subject_progress(subject_code: str, current_student: dict = Depends(get_current_student)):
    """
    Retrieves topic-level progress for a single subject for the authenticated student.
    Validates that subject exists and belongs to the student's department and semester.
    Unstarted topics default to completed=false and progress_percentage=0.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    student_dept = str(current_student.get("department_code", "")).strip().upper()
    student_sem = current_student.get("semester")

    code_upper = subject_code.strip().upper()

    # Find subject
    subject_doc = db.subjects.find_one({"code": code_upper})
    if not subject_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with code '{code_upper}' not found"
        )

    # Check department and semester
    subject_dept = str(subject_doc.get("department_code", "")).strip().upper()
    subject_sem = subject_doc.get("semester")

    if subject_dept != student_dept or subject_sem != student_sem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Subject '{code_upper}' does not belong to your department ({student_dept}) and semester ({student_sem})."
        )

    subject_title = subject_doc.get("title") or subject_doc.get("name", "")

    # Fetch topics for subject
    topic_cursor = db.topics.find({"subject_id": subject_doc["_id"]}).sort("unit_number", 1)
    topic_docs = list(topic_cursor)
    total_topics = len(topic_docs)
    topic_ids = [t["_id"] for t in topic_docs]

    # Fetch student's progress for these topics
    progress_cursor = db.progress.find({
        "student_id": student_obj_id,
        "topic_id": {"$in": topic_ids},
    })
    progress_map = {doc["topic_id"]: doc for doc in progress_cursor}

    completed_topics = 0
    topics_list = []
    for t in topic_docs:
        tid = t["_id"]
        p_doc = progress_map.get(tid)
        if p_doc:
            is_comp = p_doc.get("completed", False)
            pct = float(p_doc.get("progress_percentage", 0.0))
            l_score = p_doc.get("latest_score")
            tot_q = p_doc.get("total_questions")
            l_pct = p_doc.get("latest_percentage")
            ass_comp = p_doc.get("assessment_completed", is_comp)
        else:
            is_comp = False
            pct = 0.0
            l_score = None
            tot_q = None
            l_pct = None
            ass_comp = False

        if is_comp:
            completed_topics += 1

        topics_list.append({
            "topic_id": str(tid),
            "unit_number": t.get("unit_number", 1),
            "title": t.get("title") or t.get("name", ""),
            "completed": is_comp,
            "progress_percentage": pct,
            "latest_score": l_score,
            "total_questions": tot_q,
            "latest_percentage": l_pct,
            "assessment_completed": ass_comp,
        })

    if total_topics > 0:
        subj_pct = round((completed_topics / float(total_topics)) * 100.0, 2)
    else:
        subj_pct = 0.0

    # Fetch subject-level final assessment progress
    subj_prog_doc = db.subject_progress.find_one({"student_id": student_obj_id, "subject_code": code_upper})
    fa_comp = False
    fa_score = None
    fa_pct = None
    fa_passed = False

    if subj_prog_doc:
        fa_comp = subj_prog_doc.get("final_assessment_completed", False)
        fa_score = subj_prog_doc.get("final_assessment_score")
        fa_pct = subj_prog_doc.get("final_assessment_percentage")
        fa_passed = subj_prog_doc.get("final_assessment_passed", False)

    return {
        "subject_code": code_upper,
        "subject_title": subject_title,
        "total_topics": total_topics,
        "completed_topics": completed_topics,
        "progress_percentage": subj_pct,
        "topics": topics_list,
        "final_assessment_completed": fa_comp,
        "final_assessment_score": fa_score,
        "final_assessment_percentage": fa_pct,
        "final_assessment_passed": fa_passed,
    }




@router.delete("/{progress_id}", response_model=ProgressDeleteResponse, status_code=status.HTTP_200_OK)
def delete_student_progress(progress_id: str, current_student: dict = Depends(get_current_student)):
    """
    Deletes a progress record matching progress_id owned by the authenticated student.
    Raises 400 for invalid ObjectId. Raises 404 for missing or unauthorized deletion.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    try:
        prog_obj_id = ObjectId(progress_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid progress_id format: '{progress_id}'"
        )

    doc = db.progress.find_one({"_id": prog_obj_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progress record with id '{progress_id}' not found"
        )

    if doc.get("student_id") != student_obj_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progress record with id '{progress_id}' not found"
        )

    db.progress.delete_one({"_id": prog_obj_id, "student_id": student_obj_id})

    return {"message": "Progress record deleted successfully"}
