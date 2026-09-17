from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.roadmap import RecoveryRoadmapResponse

router = APIRouter(prefix="/roadmap", tags=["roadmap"])


@router.get("/recovery", response_model=RecoveryRoadmapResponse, status_code=status.HTTP_200_OK)
def get_recovery_roadmap(current_student: dict = Depends(get_current_student)):
    """
    Generates a personalized, deterministic academic recovery roadmap for the authenticated student.
    Analyzes subjects belonging strictly to the student's department_code and semester.
    Allocates recommended study days across subjects and topic units.
    Sorts roadmap by priority (high -> medium -> low) and subject code.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    student_dept = str(current_student.get("department_code", "")).strip().upper()
    student_sem = current_student.get("semester")

    # 1. Fetch subjects matching student department and semester
    subject_cursor = db.subjects.find({"department_code": student_dept, "semester": student_sem})
    subject_docs = list(subject_cursor)

    # 2. Fetch authenticated student's arrears
    arrear_cursor = db.arrears.find({"student_id": student_obj_id})
    arrear_codes = {doc.get("subject_code", "").strip().upper() for doc in arrear_cursor}

    # 3. Fetch authenticated student's assessments
    assessment_cursor = db.assessments.find({"student_id": student_obj_id})
    assessments_by_subject: dict[str, list[float]] = {}
    for doc in assessment_cursor:
        code = doc.get("subject_code", "").strip().upper()
        pct = doc.get("percentage", 0.0)
        assessments_by_subject.setdefault(code, []).append(pct)

    subject_items = []
    for doc in subject_docs:
        code = doc.get("code", "").strip().upper()
        title = doc.get("title") or doc.get("name", "")
        subj_id = doc["_id"]
        has_arrear = code in arrear_codes

        pct_list = assessments_by_subject.get(code, [])
        assessment_count = len(pct_list)

        if assessment_count > 0:
            average_percentage = round(sum(pct_list) / float(assessment_count), 2)
        else:
            average_percentage = None

        # Determine status and priority according to rules
        if has_arrear:
            status_val = "weak"
            priority_val = "high"
        elif average_percentage is not None and average_percentage < 50:
            status_val = "weak"
            priority_val = "high"
        elif average_percentage is not None and average_percentage < 75:
            status_val = "needs_improvement"
            priority_val = "medium"
        elif average_percentage is not None and average_percentage >= 75:
            status_val = "strong"
            priority_val = "low"
        else:
            status_val = "not_assessed"
            priority_val = "medium"

        # Determine roadmap recommendation and recommended days
        if status_val == "weak" and priority_val == "high":
            recommended_days = 4
            recommendation = "Focus on this subject first"
        elif status_val == "needs_improvement" and priority_val == "medium":
            recommended_days = 3
            recommendation = "Practice and revise this subject"
        elif status_val == "not_assessed":
            recommended_days = 2
            recommendation = "Take an assessment and begin learning"
        elif status_val == "strong" and priority_val == "low":
            recommended_days = 1
            recommendation = "Maintain your current performance"
        else:
            recommended_days = 2
            recommendation = "Practice and revise this subject"

        # Fetch topics for this subject
        topic_cursor = db.topics.find({"subject_id": subj_id}).sort("unit_number", 1)
        topic_docs = list(topic_cursor)

        # Distribute recommended days across topics (up to 4 topics)
        topics_list = []
        for idx in range(4):
            if idx < len(topic_docs):
                t_doc = topic_docs[idx]
                t_unit = t_doc.get("unit_number", idx + 1)
                t_title = t_doc.get("title") or t_doc.get("name") or f"Unit {t_unit}"
                t_desc = t_doc.get("description") or f"Unit {t_unit} concepts and topics for {title}"
            else:
                t_unit = idx + 1
                t_title = f"Unit {t_unit}"
                t_desc = f"Unit {t_unit} topics for {title}"

            t_days = 1 if idx < recommended_days else 0

            topics_list.append({
                "unit_number": t_unit,
                "title": t_title,
                "description": t_desc,
                "recommended_days": t_days,
            })

        subject_items.append({
            "subject_code": code,
            "subject_title": title,
            "status": status_val,
            "priority": priority_val,
            "arrear": has_arrear,
            "average_percentage": average_percentage,
            "recommended_days": recommended_days,
            "recommendation": recommendation,
            "topics": topics_list,
        })

    # Sort roadmap items by priority (high -> medium -> low) then subject_code
    priority_order = {"high": 0, "medium": 1, "low": 2}
    subject_items.sort(key=lambda s: (priority_order.get(s["priority"], 99), s["subject_code"]))

    total_subjects = len(subject_items)
    high_priority = sum(1 for s in subject_items if s["priority"] == "high")
    medium_priority = sum(1 for s in subject_items if s["priority"] == "medium")
    low_priority = sum(1 for s in subject_items if s["priority"] == "low")
    total_days = sum(s["recommended_days"] for s in subject_items)

    student_info = {
        "department_code": student_dept,
        "semester": student_sem,
    }

    summary_info = {
        "total_subjects": total_subjects,
        "high_priority_subjects": high_priority,
        "medium_priority_subjects": medium_priority,
        "low_priority_subjects": low_priority,
        "total_recommended_days": total_days,
    }

    return {
        "student": student_info,
        "summary": summary_info,
        "roadmap": subject_items,
    }
