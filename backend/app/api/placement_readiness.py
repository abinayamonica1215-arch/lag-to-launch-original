from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.placement_readiness import (
    PlacementReadinessQuestionResponse,
    PlacementReadinessSubmitRequest,
    PlacementReadinessSubmitResponse,
    PlacementReadinessListResponse,
)

router = APIRouter(prefix="/placement-readiness", tags=["placement-readiness"])

# Configurable prototype threshold for placement readiness
READINESS_THRESHOLD_PERCENTAGE = 60.0


def check_arrears_eligibility(db, student_obj_id: ObjectId):
    """
    Checks if student has ZERO active arrears.
    Raises HTTP 400 Bad Request if student has any active arrears.
    """
    cursor = db.arrears.find({"student_id": student_obj_id})
    active_arrears = [doc for doc in cursor if doc.get("status") != "completed"]
    if active_arrears:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You are not eligible for placement readiness assessment. Clear all active arrears first ({len(active_arrears)} active arrear(s) remaining)."
        )


@router.get("", response_model=PlacementReadinessQuestionResponse, status_code=status.HTTP_200_OK)
@router.get("/", response_model=PlacementReadinessQuestionResponse, status_code=status.HTTP_200_OK, include_in_schema=False)
def get_placement_readiness_questions(current_student: dict = Depends(get_current_student)):
    """
    Retrieves placement readiness assessment questions across categories (Aptitude, Communication, Technical).
    Requires student JWT authentication and ZERO active arrears.
    Does NOT return correct answers or answer keys.
    """
    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    # Check arrear eligibility
    check_arrears_eligibility(db, student_obj_id)

    # Fetch questions
    cursor = db.placement_readiness_questions.find({})
    question_docs = list(cursor)

    if not question_docs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No placement readiness questions found."
        )

    questions = []
    for doc in question_docs:
        questions.append({
            "id": str(doc["_id"]),
            "category": doc.get("category", "General"),
            "question": doc.get("question", ""),
            "options": doc.get("options", []),
        })

    return {"questions": questions}


@router.post("/submit", response_model=PlacementReadinessSubmitResponse, status_code=status.HTTP_200_OK)
def submit_placement_readiness(
    payload: PlacementReadinessSubmitRequest,
    current_student: dict = Depends(get_current_student)
):
    """
    Evaluates and records student's answers for placement readiness assessment.
    Requires student JWT authentication and ZERO active arrears.
    Calculates overall score, category percentages, and ready status (>= 60%).
    Stores attempt in db.placement_readiness_results.
    """
    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    # Check arrear eligibility
    check_arrears_eligibility(db, student_obj_id)

    # Fetch questions
    cursor = db.placement_readiness_questions.find({})
    question_docs = list(cursor)

    if not question_docs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No placement readiness questions found."
        )

    questions_by_id = {str(doc["_id"]): doc for doc in question_docs}

    # Validate submitted answers
    seen_qids = set()
    for ans in payload.answers:
        qid = ans.question_id.strip()
        if qid in seen_qids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Duplicate answer submitted for question_id '{qid}'"
            )
        seen_qids.add(qid)
        if qid not in questions_by_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question '{qid}' does not belong to placement readiness assessment"
            )

    if len(seen_qids) != len(questions_by_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"All {len(questions_by_id)} placement readiness questions must be answered"
        )

    # Calculate score & category scores
    score = 0
    total_questions = len(questions_by_id)
    cat_totals: dict[str, int] = {}
    cat_correct: dict[str, int] = {}
    submitted_answers_data = []

    for ans in payload.answers:
        qid = ans.question_id.strip()
        q_doc = questions_by_id[qid]
        cat = q_doc.get("category", "General")
        cat_totals[cat] = cat_totals.get(cat, 0) + 1

        selected_ans = ans.selected_answer.strip()
        correct_ans = str(q_doc.get("correct_answer", "")).strip()

        if selected_ans == correct_ans:
            score += 1
            cat_correct[cat] = cat_correct.get(cat, 0) + 1

        submitted_answers_data.append({
            "question_id": qid,
            "selected_answer": selected_ans
        })

    percentage = round((score / float(total_questions)) * 100.0, 2)
    ready = (percentage >= READINESS_THRESHOLD_PERCENTAGE)

    category_scores = {
        cat: round((cat_correct.get(cat, 0) / float(cat_totals[cat])) * 100.0, 2)
        for cat in cat_totals
    }

    now = datetime.now(timezone.utc)

    # Store result in db.placement_readiness_results
    result_doc = {
        "student_id": student_obj_id,
        "score": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "ready": ready,
        "category_scores": category_scores,
        "submitted_answers": submitted_answers_data,
        "submitted_at": now
    }

    insert_res = db.placement_readiness_results.insert_one(result_doc)
    inserted_id = str(insert_res.inserted_id)

    return {
        "message": "Placement readiness assessment submitted successfully",
        "result": {
            "result_id": inserted_id,
            "score": score,
            "total_questions": total_questions,
            "percentage": percentage,
            "ready": ready,
            "category_scores": category_scores,
            "submitted_at": now
        }
    }


@router.get("/results", response_model=PlacementReadinessListResponse, status_code=status.HTTP_200_OK)
def get_placement_readiness_results(current_student: dict = Depends(get_current_student)):
    """
    Retrieves historical placement readiness results for the authenticated student.
    """
    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    cursor = db.placement_readiness_results.find({"student_id": student_obj_id}).sort("submitted_at", -1)
    docs = list(cursor)

    results = []
    for doc in docs:
        results.append({
            "result_id": str(doc["_id"]),
            "score": doc.get("score", 0),
            "total_questions": doc.get("total_questions", 0),
            "percentage": float(doc.get("percentage", 0.0)),
            "ready": doc.get("ready", False),
            "category_scores": doc.get("category_scores", {}),
            "submitted_at": doc.get("submitted_at", datetime.now(timezone.utc)),
        })

    return {"results": results}
