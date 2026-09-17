from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException
from app.core.database import get_database
from app.models.academic import VideoListResponse

router = APIRouter(tags=["videos"])


@router.get("/videos/{topic_id}", response_model=VideoListResponse)
def get_videos_by_topic(topic_id: str):
    """
    Retrieves videos/resources for a selected topic by topic_id from MongoDB.
    Validates topic_id as a valid MongoDB ObjectId.
    Returns HTTP 400 for invalid ObjectId strings.
    Returns HTTP 200 with an empty array if no videos exist for a valid topic_id.
    Excludes internal _id fields.
    """
    try:
        topic_obj_id = ObjectId(topic_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid topic_id format: '{topic_id}'. Must be a valid 24-character hexadecimal string."
        )

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    # Query MongoDB videos collection for matching topic_id
    cursor = db.videos.find({"topic_id": topic_obj_id}, {"_id": 0})

    videos = []
    for doc in cursor:
        videos.append({
            "title": doc.get("title", ""),
            "youtube_url": doc.get("youtube_url", ""),
            "youtube_id": doc.get("youtube_id", ""),
            "duration": doc.get("duration", "")
        })

    return {
        "topic_id": str(topic_id),
        "videos": videos
    }
