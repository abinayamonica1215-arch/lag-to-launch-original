from fastapi import APIRouter, HTTPException
from app.core.database import get_database
from app.models.academic import DepartmentListResponse

router = APIRouter(tags=["departments"])


@router.get("/departments", response_model=DepartmentListResponse)
def get_departments():
    """
    Retrieves all departments from MongoDB.
    Returns code, name, and description while omitting internal _id.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    # Fetch departments excluding MongoDB _id field
    cursor = db.departments.find({}, {"_id": 0})
    
    departments = []
    for doc in cursor:
        departments.append({
            "code": doc.get("code"),
            "name": doc.get("name"),
            "description": doc.get("description") or f"Department of {doc.get('name', '')}"
        })

    return {"departments": departments}
