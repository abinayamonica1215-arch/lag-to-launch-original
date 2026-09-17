from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.placement_roadmap import (
    PlacementRoadmapItem,
    PlacementRoadmapResponse,
    PlacementRoadmapListResponse,
)

router = APIRouter(prefix="/placement-roadmap", tags=["placement-roadmap"])

# Predefined focus areas & recommended actions for backend deterministic logic
CATEGORY_PREPARATION_DETAILS = {
    "Aptitude": {
        "focus_areas": [
            "Quantitative aptitude",
            "Logical reasoning",
            "Problem solving"
        ],
        "recommendations": {
            "high": "Focus heavily on basic quantitative aptitude formulas, logical reasoning puzzles, and time-management practice problems.",
            "medium": "Practice speed math and timed aptitude problem sets to improve problem-solving consistency."
        }
    },
    "Communication": {
        "focus_areas": [
            "Professional communication",
            "Grammar and vocabulary",
            "Interview communication"
        ],
        "recommendations": {
            "high": "Work on core grammar rules, professional vocabulary, and basic spoken interview response frameworks.",
            "medium": "Refine interview communication fluency, situational responses, and professional body language."
        }
    },
    "Technical": {
        "focus_areas": [
            "Programming fundamentals",
            "Data structures and algorithms",
            "Core CS concepts"
        ],
        "recommendations": {
            "high": "Strengthen technical fundamentals before attempting another placement readiness assessment.",
            "medium": "Practice intermediate data structures and algorithms, system basics, and mock coding problems."
        }
    }
}


def evaluate_priority(percentage: float) -> str:
    """
    Determines priority band based on category percentage score:
    >= 70.0: 'satisfactory'
    50.0 - 69.99: 'medium'
    < 50.0: 'high'
    """
    if percentage >= 70.0:
        return "satisfactory"
    elif percentage >= 50.0:
        return "medium"
    else:
        return "high"


@router.get("", response_model=PlacementRoadmapResponse, status_code=status.HTTP_200_OK)
@router.get("/", response_model=PlacementRoadmapResponse, status_code=status.HTTP_200_OK, include_in_schema=False)
def generate_placement_roadmap(current_student: dict = Depends(get_current_student)):
    """
    Generates a placement preparation roadmap based on student's LATEST placement readiness assessment.
    Requires student JWT authentication.
    Returns HTTP 404 if no readiness assessment exists.
    Saves generated snapshot to db.placement_roadmaps.
    """
    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    # Fetch latest placement readiness result
    latest_result = db.placement_readiness_results.find_one(
        {"student_id": student_obj_id},
        sort=[("submitted_at", -1)]
    )

    if not latest_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No placement readiness assessment result found. Please complete a placement readiness assessment first."
        )

    source_result_id = str(latest_result["_id"])
    source_percentage = float(latest_result.get("percentage", 0.0))
    result_ready = bool(latest_result.get("ready", False))
    category_scores = latest_result.get("category_scores", {})

    high_items: list[dict] = []
    medium_items: list[dict] = []

    for category, pct in category_scores.items():
        pct_val = float(pct)
        priority = evaluate_priority(pct_val)
        if priority == "satisfactory":
            continue

        cat_details = CATEGORY_PREPARATION_DETAILS.get(category, {
            "focus_areas": [f"{category} concepts"],
            "recommendations": {
                "high": f"Focus heavily on strengthening core {category} fundamentals.",
                "medium": f"Practice intermediate {category} practice sets."
            }
        })
        focus_areas = cat_details["focus_areas"]
        recommended_action = cat_details["recommendations"].get(
            priority,
            f"Improve performance in {category}."
        )

        item = {
            "category": category,
            "current_percentage": round(pct_val, 2),
            "priority": priority,
            "focus_areas": focus_areas,
            "recommended_action": recommended_action
        }

        if priority == "high":
            high_items.append(item)
        elif priority == "medium":
            medium_items.append(item)

    # Sort roadmap items: high priority first, then medium priority
    roadmap_list = high_items + medium_items

    # If result_ready is True or no weak/medium categories exist
    if result_ready or not roadmap_list:
        ready_flag = True
        roadmap_list = []
        message = "Placement readiness indicates satisfactory preparation across the assessed categories."
    else:
        ready_flag = False
        message = f"Placement preparation roadmap generated based on your latest readiness assessment score of {source_percentage}%."

    now = datetime.now(timezone.utc)

    # Store snapshot in db.placement_roadmaps
    roadmap_doc = {
        "student_id": student_obj_id,
        "source_result_id": latest_result["_id"],
        "source_percentage": source_percentage,
        "ready": ready_flag,
        "message": message,
        "roadmap": roadmap_list,
        "created_at": now
    }

    insert_res = db.placement_roadmaps.insert_one(roadmap_doc)
    inserted_id = str(insert_res.inserted_id)

    return {
        "roadmap_id": inserted_id,
        "source_result_id": source_result_id,
        "source_percentage": source_percentage,
        "ready": ready_flag,
        "message": message,
        "roadmap": roadmap_list,
        "created_at": now
    }


@router.get("/history", response_model=PlacementRoadmapListResponse, status_code=status.HTTP_200_OK)
def get_placement_roadmap_history(current_student: dict = Depends(get_current_student)):
    """
    Retrieves historical placement roadmap snapshots for the authenticated student sorted newest first.
    Does not expose other students' data.
    """
    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    cursor = db.placement_roadmaps.find({"student_id": student_obj_id}).sort("created_at", -1)
    docs = list(cursor)

    roadmaps = []
    for doc in docs:
        roadmaps.append({
            "roadmap_id": str(doc["_id"]),
            "source_result_id": str(doc.get("source_result_id", "")),
            "source_percentage": float(doc.get("source_percentage", 0.0)),
            "ready": bool(doc.get("ready", False)),
            "message": doc.get("message", ""),
            "roadmap": doc.get("roadmap", []),
            "created_at": doc.get("created_at", datetime.now(timezone.utc)),
        })

    return {"roadmaps": roadmaps}
