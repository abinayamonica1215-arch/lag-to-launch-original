from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.analysis import WeakAreaAnalysisResponse, QuizFeedbackRequest
from app.services.ai_service import QuizAIAnalysis, AIServiceError, analyze_quiz_performance

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/weak-areas", response_model=WeakAreaAnalysisResponse, status_code=status.HTTP_200_OK)
def get_weak_area_analysis(current_student: dict = Depends(get_current_student)):
    """
    Analyzes the authenticated student's arrears and assessment results using deterministic, rule-based logic.
    Only analyzes subjects belonging to the authenticated student's department_code and semester.
    Returns summary statistics and per-subject breakdown with status and priority.
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

    # 1. Fetch subjects belonging to authenticated student's department and semester
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

    # 4. Perform analysis per subject
    subject_items = []
    for doc in subject_docs:
        code = doc.get("code", "").strip().upper()
        title = doc.get("title") or doc.get("name", "")
        has_arrear = code in arrear_codes

        pct_list = assessments_by_subject.get(code, [])
        assessment_count = len(pct_list)

        if assessment_count > 0:
            average_percentage = round(sum(pct_list) / float(assessment_count), 2)
        else:
            average_percentage = None

        # Status determination rules
        if has_arrear:
            status_val = "weak"
        elif average_percentage is not None and average_percentage < 50:
            status_val = "weak"
        elif average_percentage is not None and average_percentage < 75:
            status_val = "needs_improvement"
        elif average_percentage is not None and average_percentage >= 75:
            status_val = "strong"
        else:
            status_val = "not_assessed"

        # Priority determination rules
        if has_arrear:
            priority_val = "high"
        elif average_percentage is not None and average_percentage < 50:
            priority_val = "high"
        elif average_percentage is not None and average_percentage < 75:
            priority_val = "medium"
        elif average_percentage is not None and average_percentage >= 75:
            priority_val = "low"
        else:
            priority_val = "medium"

        subject_items.append({
            "subject_code": code,
            "subject_title": title,
            "semester": student_sem,
            "arrear": has_arrear,
            "average_percentage": average_percentage,
            "assessment_count": assessment_count,
            "status": status_val,
            "priority": priority_val,
        })

    # 5. Compute summary statistics
    total_subjects = len(subject_items)
    subjects_with_arrears = sum(1 for item in subject_items if item["arrear"])
    subjects_assessed = sum(1 for item in subject_items if item["assessment_count"] > 0)
    weak_subjects = sum(1 for item in subject_items if item["status"] == "weak")
    needs_improvement_subjects = sum(1 for item in subject_items if item["status"] == "needs_improvement")
    strong_subjects = sum(1 for item in subject_items if item["status"] == "strong")
    not_assessed_subjects = sum(1 for item in subject_items if item["status"] == "not_assessed")

    summary = {
        "total_subjects": total_subjects,
        "subjects_with_arrears": subjects_with_arrears,
        "subjects_assessed": subjects_assessed,
        "weak_subjects": weak_subjects,
        "needs_improvement_subjects": needs_improvement_subjects,
        "strong_subjects": strong_subjects,
        "not_assessed_subjects": not_assessed_subjects,
    }

    return {
        "summary": summary,
        "subjects": subject_items,
    }


@router.post("/quiz-feedback", response_model=QuizAIAnalysis, status_code=status.HTTP_200_OK)
def get_quiz_ai_feedback(
    payload: QuizFeedbackRequest,
    current_student: dict = Depends(get_current_student),
):
    """
    Generates AI-powered feedback for a completed quiz assessment using Google Gemini.
    Accepts student quiz performance data and returns structured feedback.
    Requires student authentication.
    """
    try:
        correct_dicts = [q.model_dump() for q in payload.correct_questions]
        wrong_dicts = [q.model_dump() for q in payload.wrong_questions]

        analysis = analyze_quiz_performance(
            subject=payload.subject,
            assessment_type=payload.assessment_type,
            score=payload.score,
            total=payload.total,
            percentage=payload.percentage,
            correct_questions=correct_dicts,
            wrong_questions=wrong_dicts,
        )
        return analysis
    except AIServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating AI quiz feedback."
        ) from exc
