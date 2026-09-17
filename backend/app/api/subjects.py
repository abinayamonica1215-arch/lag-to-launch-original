from fastapi import APIRouter, HTTPException
from app.core.database import get_database
from app.models.academic import SubjectListResponse

router = APIRouter(tags=["subjects"])


@router.get("/subjects/{department_code}/{semester}", response_model=SubjectListResponse)
def get_subjects_by_department_and_semester(department_code: str, semester: int):
    """
    Retrieves subjects matching both department code and semester from MongoDB.
    Excludes internal _id and returns formatted subject information.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    dept_code_upper = department_code.strip().upper()

    # Query MongoDB for subjects matching department_code and semester
    cursor = db.subjects.find(
        {"department_code": dept_code_upper, "semester": semester},
        {"_id": 0}
    )

    subject_docs = list(cursor)

    if not subject_docs:
        raise HTTPException(
            status_code=404,
            detail=f"No subjects found for department '{dept_code_upper}' and semester {semester}"
        )

    subjects = []
    for doc in subject_docs:
        name = doc.get("name", "")
        subjects.append({
            "code": doc.get("code"),
            "title": doc.get("title") or name,
            "description": doc.get("description") or f"{name} course for {dept_code_upper} Semester {semester}"
        })

    return {
        "department_code": dept_code_upper,
        "semester": semester,
        "subjects": subjects
    }
