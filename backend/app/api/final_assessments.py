from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.final_assessments import (
    FinalAssessmentQuestionResponse,
    FinalAssessmentSubmitRequest,
    FinalAssessmentSubmitResponse,
)

router = APIRouter(prefix="/final-assessments", tags=["final-assessments"])


@router.get("/{subject_code}", response_model=FinalAssessmentQuestionResponse, status_code=status.HTTP_200_OK)
def get_final_assessment_questions(
    subject_code: str,
    current_student: dict = Depends(get_current_student)
):
    """
    Retrieves final assessment questions for a selected subject by subject_code.
    Requires student JWT authentication.
    Does NOT return correct answers or answer keys.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    code_upper = subject_code.strip().upper()

    # Validate subject existence
    subject_doc = db.subjects.find_one({"code": code_upper})
    if not subject_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with code '{code_upper}' not found"
        )

    # Fetch final assessment questions for subject
    cursor = db.final_assessment_questions.find({"subject_code": code_upper})
    question_docs = list(cursor)

    if not question_docs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No final assessment questions found for subject '{code_upper}'"
        )

    questions = []
    for doc in question_docs:
        questions.append({
            "id": str(doc["_id"]),
            "subject_code": code_upper,
            "question": doc.get("question", ""),
            "options": doc.get("options", []),
        })

    return {
        "subject_code": code_upper,
        "questions": questions
    }


@router.post("/submit", response_model=FinalAssessmentSubmitResponse, status_code=status.HTTP_200_OK)
def submit_final_assessment(
    payload: FinalAssessmentSubmitRequest,
    current_student: dict = Depends(get_current_student)
):
    """
    Evaluates and records student's answers for a subject's final assessment.
    Requires student JWT authentication.
    Calculates score, percentage, and passed status (>= 50%).
    Stores attempt in db.final_assessment_results and updates subject progress.
    """
    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    code_upper = payload.subject_code.strip().upper()

    # Validate subject existence
    subject_doc = db.subjects.find_one({"code": code_upper})
    if not subject_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with code '{code_upper}' not found"
        )

    # Fetch final assessment questions
    cursor = db.final_assessment_questions.find({"subject_code": code_upper})
    question_docs = list(cursor)

    if not question_docs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No final assessment questions found for subject '{code_upper}'"
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
                detail=f"Question '{qid}' does not belong to subject '{code_upper}'"
            )

    if len(seen_qids) != len(questions_by_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"All {len(questions_by_id)} final assessment questions must be answered for this subject"
        )

    # Calculate score
    score = 0
    total_questions = len(questions_by_id)
    submitted_answers_data = []

    for ans in payload.answers:
        qid = ans.question_id.strip()
        q_doc = questions_by_id[qid]
        selected_ans = ans.selected_answer.strip()
        correct_ans = str(q_doc.get("correct_answer", "")).strip()

        if selected_ans == correct_ans:
            score += 1

        submitted_answers_data.append({
            "question_id": qid,
            "selected_answer": selected_ans
        })

    percentage = round((score / float(total_questions)) * 100.0, 2)
    passed = (percentage >= 50.0)
    now = datetime.now(timezone.utc)

    # Store result document in db.final_assessment_results
    result_doc = {
        "student_id": student_obj_id,
        "subject_code": code_upper,
        "score": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "passed": passed,
        "submitted_answers": submitted_answers_data,
        "submitted_at": now
    }

    insert_res = db.final_assessment_results.insert_one(result_doc)
    inserted_id = str(insert_res.inserted_id)

    # Update subject-level progress summary in db.subject_progress
    db.subject_progress.update_one(
        {"student_id": student_obj_id, "subject_code": code_upper},
        {
            "$set": {
                "final_assessment_completed": True,
                "final_assessment_score": score,
                "final_assessment_total_questions": total_questions,
                "final_assessment_percentage": percentage,
                "final_assessment_passed": passed,
                "updated_at": now,
            },
            "$setOnInsert": {
                "created_at": now,
            },
        },
        upsert=True
    )

    return {
        "message": "Final assessment submitted successfully",
        "result": {
            "result_id": inserted_id,
            "subject_code": code_upper,
            "score": score,
            "total_questions": total_questions,
            "percentage": percentage,
            "passed": passed,
            "submitted_at": now
        }
    }
