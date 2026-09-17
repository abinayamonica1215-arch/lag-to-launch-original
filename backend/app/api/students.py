from fastapi import APIRouter, Depends, status
from app.core.security import get_current_student
from app.models.auth import StudentResponse

router = APIRouter(tags=["students"])


@router.get("/students/me", response_model=StudentResponse, status_code=status.HTTP_200_OK)
def get_student_profile(current_student: dict = Depends(get_current_student)):
    """
    Retrieves the profile of the currently authenticated student.
    Identifies student from verified JWT token.
    Returns: id, name, email, department_code, semester.
    Never returns password or password_hash.
    """
    return current_student
