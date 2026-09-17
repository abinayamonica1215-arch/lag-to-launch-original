from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.daily_assessments import (
    DailyAssessmentQuestionResponse,
    DailyAssessmentSubmitRequest,
    DailyAssessmentSubmitResponse,
)

router = APIRouter(prefix="/daily-assessments", tags=["daily-assessments"])


@router.get("/{topic_id}", response_model=DailyAssessmentQuestionResponse, status_code=status.HTTP_200_OK)
def get_daily_assessment_questions(
    topic_id: str,
    current_student: dict = Depends(get_current_student)
):
    """
    Retrieves daily assessment questions for a selected topic by topic_id.
    Requires student JWT authentication.
    Does NOT return correct answers or answer keys.
    """
    try:
        topic_obj_id = ObjectId(topic_id.strip())
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid topic_id format: '{topic_id}'"
        )

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    # Fetch daily questions for topic
    cursor = db.daily_questions.find({"topic_id": topic_obj_id})
    question_docs = list(cursor)

    if not question_docs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No daily questions found for topic '{topic_id}'"
        )

    questions = []
    for doc in question_docs:
        questions.append({
            "id": str(doc["_id"]),
            "topic_id": str(doc.get("topic_id", topic_obj_id)),
            "question": doc.get("question", ""),
            "options": doc.get("options", []),
        })

    return {
        "topic_id": str(topic_obj_id),
        "questions": questions
    }


@router.post("/submit", response_model=DailyAssessmentSubmitResponse, status_code=status.HTTP_200_OK)
def submit_daily_assessment(
    payload: DailyAssessmentSubmitRequest,
    current_student: dict = Depends(get_current_student)
):
    """
    Evaluates and records student's answers for a topic's daily assessment.
    Requires student JWT authentication.
    Calculates score and percentage, stores attempt in db.daily_assessment_results, and returns calculated results.
    """
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

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    # Fetch topic questions
    cursor = db.daily_questions.find({"topic_id": topic_obj_id})
    question_docs = list(cursor)

    if not question_docs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No daily questions found for topic '{payload.topic_id}'"
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
                detail=f"Question '{qid}' does not belong to topic '{payload.topic_id}'"
            )

    if len(seen_qids) != len(questions_by_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"All {len(questions_by_id)} questions must be answered for this topic assessment"
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
    now = datetime.now(timezone.utc)

    # Save attempt in db.daily_assessment_results
    result_doc = {
        "student_id": student_obj_id,
        "topic_id": topic_obj_id,
        "score": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "submitted_answers": submitted_answers_data,
        "submitted_at": now
    }

    insert_res = db.daily_assessment_results.insert_one(result_doc)
    inserted_id = str(insert_res.inserted_id)

    # 6. Update/Upsert student's topic progress in db.progress
    topic_doc = db.topics.find_one({"_id": topic_obj_id})
    subject_code = ""
    if topic_doc and "subject_id" in topic_doc:
        subj_doc = db.subjects.find_one({"_id": topic_doc["subject_id"]})
        if subj_doc:
            subject_code = subj_doc.get("code", "")

    prog_update = {
        "subject_code": subject_code,
        "completed": True,
        "progress_percentage": percentage,
        "latest_score": score,
        "total_questions": total_questions,
        "latest_percentage": percentage,
        "assessment_completed": True,
        "completed_at": now,
        "updated_at": now,
    }

    db.progress.update_one(
        {"student_id": student_obj_id, "topic_id": topic_obj_id},
        {"$set": prog_update, "$setOnInsert": {"created_at": now}},
        upsert=True,
    )

    return {
        "message": "Daily assessment submitted successfully",
        "result": {
            "result_id": inserted_id,
            "topic_id": str(topic_obj_id),
            "score": score,
            "total_questions": total_questions,
            "percentage": percentage,
            "submitted_at": now
        }
    }

