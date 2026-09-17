from fastapi import APIRouter, HTTPException
from app.core.database import get_database
from app.models.academic import TopicListResponse

router = APIRouter(tags=["topics"])


@router.get("/topics/{subject_code}", response_model=TopicListResponse)
def get_topics_by_subject(subject_code: str):
    """
    Retrieves all topics for a given subject code from MongoDB.
    Topics are ordered by unit_number ascending.
    Excludes internal _id fields.
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
    topic_docs = list(db.topics.find({"subject_id": subject_id}, {"_id": 0}).sort("unit_number", 1))

    if not topic_docs:
        raise HTTPException(
            status_code=404,
            detail=f"No topics found for subject '{code_upper}'"
        )

    topics = []
    for doc in topic_docs:
        unit_number = doc.get("unit_number")
        title = doc.get("title") or doc.get("name") or f"Unit {unit_number}"
        description = doc.get("description") or f"{title} topics and concepts for {subject_title}"
        topics.append({
            "unit_number": unit_number,
            "title": title,
            "description": description
        })

    return {
        "subject_code": code_upper,
        "subject_title": subject_title,
        "topics": topics
    }
