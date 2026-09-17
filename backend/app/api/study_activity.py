from datetime import datetime, timezone, timedelta
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.study_activity import (
    StudyActivityCreateRequest,
    StudyActivityItem,
    StudyActivityListResponse,
    TopicStudyActivityResponse,
)

router = APIRouter(prefix="/study-activity", tags=["study-activity"])


def get_db_and_ensure_index():
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")
    try:
        db.study_activity.create_index(
            [("student_id", 1), ("topic_id", 1), ("activity_date", 1)],
            unique=True
        )
    except Exception:
        pass
    return db


def calculate_streaks(study_dates: set[str], today_str: str) -> tuple[int, int]:
    """
    Calculates current_streak and longest_streak based on dates where studied=True.
    current_streak: consecutive days ending today (0 if no activity today).
    longest_streak: maximum consecutive days in the student's history.
    """
    if not study_dates:
        return 0, 0

    sorted_dates = sorted([datetime.strptime(d, "%Y-%m-%d").date() for d in study_dates])

    # Calculate longest streak
    longest = 0
    curr_len = 0
    prev_date = None
    for d in sorted_dates:
        if prev_date is None:
            curr_len = 1
        elif d == prev_date + timedelta(days=1):
            curr_len += 1
        else:
            curr_len = 1
        if curr_len > longest:
            longest = curr_len
        prev_date = d

    # Calculate current streak ending today
    today = datetime.strptime(today_str, "%Y-%m-%d").date()
    date_set = set(sorted_dates)
    current = 0
    check_date = today
    while check_date in date_set:
        current += 1
        check_date -= timedelta(days=1)

    return current, longest


@router.post("", response_model=StudyActivityItem, status_code=status.HTTP_200_OK)
@router.post("/", response_model=StudyActivityItem, status_code=status.HTTP_200_OK, include_in_schema=False)
def record_study_activity(
    payload: StudyActivityCreateRequest,
    current_student: dict = Depends(get_current_student)
):
    """
    Records or updates today's study activity for the authenticated student for a specific topic.
    Prevents duplicate entries for the same student, topic, and server date.
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

    # Validate topic existence
    topic_doc = db.topics.find_one({"_id": topic_obj_id})
    if not topic_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic with id '{payload.topic_id}' not found"
        )

    # Fetch subject code
    subject_code = ""
    if "subject_id" in topic_doc:
        subj_doc = db.subjects.find_one({"_id": topic_doc["subject_id"]})
        if subj_doc:
            subject_code = subj_doc.get("code", "")

    now = datetime.now(timezone.utc)
    today_str = now.strftime("%Y-%m-%d")

    filter_doc = {
        "student_id": student_obj_id,
        "topic_id": topic_obj_id,
        "activity_date": today_str,
    }

    update_doc = {
        "$set": {
            "subject_code": subject_code,
            "studied": payload.studied,
            "study_minutes": payload.study_minutes,
            "updated_at": now,
        },
        "$setOnInsert": {
            "created_at": now,
        }
    }

    db.study_activity.update_one(filter_doc, update_doc, upsert=True)
    saved_doc = db.study_activity.find_one(filter_doc)

    return {
        "id": str(saved_doc["_id"]),
        "topic_id": str(saved_doc.get("topic_id", "")),
        "subject_code": saved_doc.get("subject_code", ""),
        "activity_date": saved_doc.get("activity_date", today_str),
        "studied": saved_doc.get("studied", True),
        "study_minutes": saved_doc.get("study_minutes", 0),
        "created_at": saved_doc.get("created_at", now),
        "updated_at": saved_doc.get("updated_at", now),
    }


@router.get("", response_model=StudyActivityListResponse, status_code=status.HTTP_200_OK)
@router.get("/", response_model=StudyActivityListResponse, status_code=status.HTTP_200_OK, include_in_schema=False)
def get_student_study_activities(current_student: dict = Depends(get_current_student)):
    """
    Retrieves the authenticated student's study activity history.
    Calculates total days, total study minutes, current streak, and longest streak.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    cursor = db.study_activity.find({"student_id": student_obj_id}).sort([("activity_date", -1), ("updated_at", -1)])
    docs = list(cursor)

    activities = []
    distinct_dates = set()
    study_dates_true = set()
    total_minutes = 0

    for doc in docs:
        act_date = doc.get("activity_date", "")
        if act_date:
            distinct_dates.add(act_date)
            if doc.get("studied"):
                study_dates_true.add(act_date)

        total_minutes += doc.get("study_minutes", 0)

        activities.append({
            "id": str(doc["_id"]),
            "topic_id": str(doc.get("topic_id", "")),
            "subject_code": doc.get("subject_code", ""),
            "activity_date": act_date,
            "studied": doc.get("studied", True),
            "study_minutes": doc.get("study_minutes", 0),
            "created_at": doc.get("created_at", datetime.now(timezone.utc)),
            "updated_at": doc.get("updated_at", doc.get("created_at", datetime.now(timezone.utc))),
        })

    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    current_streak, longest_streak = calculate_streaks(study_dates_true, today_str)

    return {
        "activities": activities,
        "total_days": len(distinct_dates),
        "total_minutes": total_minutes,
        "current_streak": current_streak,
        "longest_streak": longest_streak,
    }


@router.get("/topic/{topic_id}", response_model=TopicStudyActivityResponse, status_code=status.HTTP_200_OK)
def get_topic_study_activities(
    topic_id: str,
    current_student: dict = Depends(get_current_student)
):
    """
    Retrieves the authenticated student's study activity history for a specific topic.
    Raises 400 for invalid topic_id.
    Raises 404 if no activity exists for this topic.
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

    cursor = db.study_activity.find({
        "student_id": student_obj_id,
        "topic_id": topic_obj_id
    }).sort([("activity_date", -1), ("updated_at", -1)])
    docs = list(cursor)

    if not docs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No study activity found for topic '{topic_id}'"
        )

    activities = []
    total_minutes = 0
    subject_code = docs[0].get("subject_code", "")

    for doc in docs:
        total_minutes += doc.get("study_minutes", 0)
        activities.append({
            "id": str(doc["_id"]),
            "topic_id": str(doc.get("topic_id", "")),
            "subject_code": doc.get("subject_code", ""),
            "activity_date": doc.get("activity_date", ""),
            "studied": doc.get("studied", True),
            "study_minutes": doc.get("study_minutes", 0),
            "created_at": doc.get("created_at", datetime.now(timezone.utc)),
            "updated_at": doc.get("updated_at", doc.get("created_at", datetime.now(timezone.utc))),
        })

    return {
        "topic_id": str(topic_obj_id),
        "subject_code": subject_code,
        "activities": activities,
        "total_minutes": total_minutes,
    }
