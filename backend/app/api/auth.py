from datetime import datetime, timezone
import bcrypt
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import create_access_token, get_current_student
from app.models.auth import (
    StudentRegisterRequest,
    StudentRegisterResponse,
    StudentLoginRequest,
    StudentLoginResponse,
    StudentResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])

ALLOWED_SEMESTERS = {1, 3, 4, 7}


@router.post("/register", response_model=StudentRegisterResponse, status_code=status.HTTP_201_CREATED)
def register_student(payload: StudentRegisterRequest):
    """
    Registers a new student account.
    Validates name, email format, password, department code, and prototype semester.
    Hashes password using bcrypt.
    Ensures email uniqueness across the students collection.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    # Ensure unique index on email
    try:
        db.students.create_index("email", unique=True)
    except Exception:
        pass

    name = payload.name.strip()
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name field cannot be empty or whitespace."
        )

    email_lower = payload.email.strip().lower()
    dept_code_upper = payload.department_code.strip().upper()

    # Validate prototype semester
    if payload.semester not in ALLOWED_SEMESTERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid semester '{payload.semester}'. Allowed prototype semesters are: 1, 3, 4, 7."
        )

    # Validate department exists in database
    dept = db.departments.find_one({"code": dept_code_upper})
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Department with code '{dept_code_upper}' does not exist."
        )

    # Check duplicate email
    existing_student = db.students.find_one({"email": email_lower})
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Email '{email_lower}' is already registered."
        )

    # Hash password securely with bcrypt
    password_bytes = payload.password.encode("utf-8")
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password_bytes, salt).decode("utf-8")

    now = datetime.now(timezone.utc)
    student_doc = {
        "name": name,
        "email": email_lower,
        "password_hash": password_hash,
        "department_code": dept_code_upper,
        "semester": payload.semester,
        "created_at": now,
    }

    try:
        result = db.students.insert_one(student_doc)
        student_id = str(result.inserted_id)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Email '{email_lower}' is already registered."
        )

    return {
        "message": "Registration successful",
        "student": {
            "id": student_id,
            "name": name,
            "email": email_lower,
            "department_code": dept_code_upper,
            "semester": payload.semester,
        },
    }


@router.post("/login", response_model=StudentLoginResponse, status_code=status.HTTP_200_OK)
def login_student(payload: StudentLoginRequest):
    """
    Authenticates a registered student account.
    Verifies email and password using bcrypt.
    Generates and returns a JWT access token upon successful login.
    Returns HTTP 401 Unauthorized with a generic message for invalid credentials.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    email_lower = payload.email.strip().lower()

    # Find student by email
    student_doc = db.students.find_one({"email": email_lower})
    if not student_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    stored_hash = student_doc.get("password_hash", "")
    password_bytes = payload.password.encode("utf-8")
    hash_bytes = stored_hash.encode("utf-8")

    # Verify password hash using bcrypt
    try:
        is_valid = bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception:
        is_valid = False

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    student_id = str(student_doc["_id"])
    email = student_doc.get("email", "")

    # Create JWT access token containing student_id and email
    token_payload = {"student_id": student_id, "email": email}
    access_token = create_access_token(data=token_payload)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "student": {
            "id": student_id,
            "name": student_doc.get("name", ""),
            "email": email,
            "department_code": student_doc.get("department_code", ""),
            "semester": student_doc.get("semester", 1),
        },
    }


@router.get("/me", response_model=StudentResponse, status_code=status.HTTP_200_OK)
def get_me(current_student: dict = Depends(get_current_student)):
    """
    Protected endpoint retrieving details of the currently authenticated student.
    Requires Bearer token authorization header.
    Never returns password or password_hash.
    """
    return current_student


