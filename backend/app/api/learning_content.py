from fastapi import APIRouter, HTTPException
from app.core.database import get_database
from app.models.academic import LearningContentResponse

router = APIRouter(tags=["learning-content"])


@router.get("/learning-content/{subject_code}", response_model=LearningContentResponse)
def get_learning_content_by_subject(subject_code: str):
    """
    Retrieves learning content (topics) for a given subject code from MongoDB.
    Topics are ordered by unit_number ascending.
    Converts topic MongoDB _id to string in the returned items.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    code_upper = subject_code.strip().upper()

    # Find the subject by code
    subject_doc = db.subjects.find_one({"code": code_upper})
    if not subject_doc:
        raise HTTPException(
            status_code=404,
            detail=f"Subject with code '{code_upper}' not found"
        )

    subject_id = subject_doc["_id"]
    subject_title = subject_doc.get("title") or subject_doc.get("name", "")

    # Fetch topics matching subject_id, sorted by unit_number ascending
    topic_docs = list(db.topics.find({"subject_id": subject_id}).sort("unit_number", 1))

    if not topic_docs:
        raise HTTPException(
            status_code=404,
            detail=f"No learning content found for subject '{code_upper}'"
        )

    topics = []
    for doc in topic_docs:
        unit_number = doc.get("unit_number")
        title = doc.get("title") or doc.get("name") or f"Unit {unit_number}"
        description = doc.get("description") or f"{title} topics and concepts for {subject_title}"
        topics.append({
            "id": str(doc["_id"]),
            "unit_number": unit_number,
            "title": title,
            "description": description
        })

    return {
        "subject_code": code_upper,
        "subject_title": subject_title,
        "topics": topics
    }
