from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_student
from app.models.assessments import (
    AssessmentCreateRequest,
    AssessmentUpdateRequest,
    AssessmentCreateResponse,
    AssessmentUpdateResponse,
    AssessmentListResponse,
    AssessmentDeleteResponse,
)

router = APIRouter(prefix="/assessments", tags=["assessments"])


def get_db_and_ensure_index():
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")
    try:
        db.assessments.create_index(
            [("student_id", 1), ("subject_code", 1), ("assessment_name", 1)],
            unique=True
        )
    except Exception:
        pass
    return db


@router.post("", response_model=AssessmentCreateResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=AssessmentCreateResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_assessment(payload: AssessmentCreateRequest, current_student: dict = Depends(get_current_student)):
    """
    Creates a new assessment record for the authenticated student.
    Validates subject existence, department/semester match, marks, and max marks.
    Calculates percentage on backend: (marks / max_marks) * 100.
    Prevents duplicate assessments with the same student_id + subject_code + assessment_name.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    code_upper = payload.subject_code.strip().upper()

    # Find subject in database
    subject_doc = db.subjects.find_one({"code": code_upper})
    if not subject_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with code '{code_upper}' not found"
        )

    # Verify subject department and semester match authenticated student
    subject_dept = subject_doc.get("department_code", "").strip().upper()
    subject_sem = subject_doc.get("semester")
    student_dept = str(current_student.get("department_code", "")).strip().upper()
    student_sem = current_student.get("semester")

    if subject_dept != student_dept or subject_sem != student_sem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Subject '{code_upper}' does not belong to your department ({student_dept}) and semester ({student_sem})."
        )

    name_trimmed = payload.assessment_name.strip()
    if not name_trimmed:
        raise HTTPException(status_code=400, detail="Assessment name cannot be empty")

    if payload.marks < 0:
        raise HTTPException(status_code=400, detail="Marks cannot be negative")
    if payload.max_marks <= 0:
        raise HTTPException(status_code=400, detail="Max marks must be greater than 0")
    if payload.marks > payload.max_marks:
        raise HTTPException(status_code=400, detail="Marks cannot exceed max_marks")

    # Check for existing duplicate assessment record
    existing = db.assessments.find_one({
        "student_id": student_obj_id,
        "subject_code": code_upper,
        "assessment_name": name_trimmed
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Assessment '{name_trimmed}' already exists for subject '{code_upper}'"
        )

    # Calculate percentage on backend
    percentage = round((payload.marks / payload.max_marks) * 100.0, 2)
    subject_title = subject_doc.get("title") or subject_doc.get("name", "")
    now = datetime.now(timezone.utc)

    doc = {
        "student_id": student_obj_id,
        "subject_code": code_upper,
        "subject_title": subject_title,
        "assessment_name": name_trimmed,
        "marks": payload.marks,
        "max_marks": payload.max_marks,
        "percentage": percentage,
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = db.assessments.insert_one(doc)
        inserted_id = str(result.inserted_id)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Assessment '{name_trimmed}' already exists for subject '{code_upper}'"
        )

    return {
        "message": "Assessment added successfully",
        "assessment": {
            "id": inserted_id,
            "subject_code": code_upper,
            "subject_title": subject_title,
            "assessment_name": name_trimmed,
            "marks": payload.marks,
            "max_marks": payload.max_marks,
            "percentage": percentage,
        },
    }


@router.get("", response_model=AssessmentListResponse, status_code=status.HTTP_200_OK)
@router.get("/", response_model=AssessmentListResponse, status_code=status.HTTP_200_OK, include_in_schema=False)
def get_student_assessments(current_student: dict = Depends(get_current_student)):
    """
    Retrieves all assessment records belonging exclusively to the currently authenticated student.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    cursor = db.assessments.find({"student_id": student_obj_id})

    assessments_list = []
    for doc in cursor:
        assessments_list.append({
            "id": str(doc["_id"]),
            "subject_code": doc.get("subject_code", ""),
            "subject_title": doc.get("subject_title", ""),
            "assessment_name": doc.get("assessment_name", ""),
            "marks": doc.get("marks", 0.0),
            "max_marks": doc.get("max_marks", 100.0),
            "percentage": doc.get("percentage", 0.0),
        })

    return {"assessments": assessments_list}


@router.put("/{assessment_id}", response_model=AssessmentUpdateResponse, status_code=status.HTTP_200_OK)
def update_student_assessment(
    assessment_id: str,
    payload: AssessmentUpdateRequest,
    current_student: dict = Depends(get_current_student)
):
    """
    Updates an assessment record (assessment_name, marks, max_marks) for the authenticated student.
    Recalculates percentage on backend. Prevents modifying student_id, subject_code, or subject_title.
    Only the owner of the assessment can update it.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    try:
        ass_obj_id = ObjectId(assessment_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid assessment_id format: '{assessment_id}'"
        )

    # Search for assessment document
    doc = db.assessments.find_one({"_id": ass_obj_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with id '{assessment_id}' not found"
        )

    # Check ownership
    if doc.get("student_id") != student_obj_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with id '{assessment_id}' not found"
        )

    name_trimmed = payload.assessment_name.strip()
    if not name_trimmed:
        raise HTTPException(status_code=400, detail="Assessment name cannot be empty")

    if payload.marks < 0:
        raise HTTPException(status_code=400, detail="Marks cannot be negative")
    if payload.max_marks <= 0:
        raise HTTPException(status_code=400, detail="Max marks must be greater than 0")
    if payload.marks > payload.max_marks:
        raise HTTPException(status_code=400, detail="Marks cannot exceed max_marks")

    # Check duplicate name conflict if assessment_name changes
    if name_trimmed != doc.get("assessment_name"):
        existing = db.assessments.find_one({
            "student_id": student_obj_id,
            "subject_code": doc.get("subject_code"),
            "assessment_name": name_trimmed
        })
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Assessment '{name_trimmed}' already exists for subject '{doc.get('subject_code')}'"
            )

    percentage = round((payload.marks / payload.max_marks) * 100.0, 2)
    now = datetime.now(timezone.utc)

    update_fields = {
        "assessment_name": name_trimmed,
        "marks": payload.marks,
        "max_marks": payload.max_marks,
        "percentage": percentage,
        "updated_at": now,
    }

    try:
        db.assessments.update_one({"_id": ass_obj_id}, {"$set": update_fields})
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Assessment '{name_trimmed}' already exists for subject '{doc.get('subject_code')}'"
        )

    return {
        "message": "Assessment updated successfully",
        "assessment": {
            "id": str(ass_obj_id),
            "subject_code": doc.get("subject_code", ""),
            "subject_title": doc.get("subject_title", ""),
            "assessment_name": name_trimmed,
            "marks": payload.marks,
            "max_marks": payload.max_marks,
            "percentage": percentage,
        },
    }


@router.delete("/{assessment_id}", response_model=AssessmentDeleteResponse, status_code=status.HTTP_200_OK)
def delete_student_assessment(assessment_id: str, current_student: dict = Depends(get_current_student)):
    """
    Deletes an assessment record matching assessment_id belonging to the authenticated student.
    Raises 400 for invalid ObjectId format.
    Raises 404 if assessment is not found or belongs to another student.
    """
    db = get_db_and_ensure_index()

    student_id_str = current_student.get("id")
    try:
        student_obj_id = ObjectId(student_id_str)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid student_id format in token")

    try:
        ass_obj_id = ObjectId(assessment_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid assessment_id format: '{assessment_id}'"
        )

    doc = db.assessments.find_one({"_id": ass_obj_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with id '{assessment_id}' not found"
        )

    if doc.get("student_id") != student_obj_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with id '{assessment_id}' not found"
        )

    db.assessments.delete_one({"_id": ass_obj_id, "student_id": student_obj_id})

    return {"message": "Assessment deleted successfully"}
