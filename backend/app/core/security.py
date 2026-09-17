import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from dotenv import load_dotenv
import jwt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import get_database

# Load environment variables from .env
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

JWT_SECRET = os.getenv("JWT_SECRET", "default_lagto_launch_secret_key_32_bytes_long")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

security_scheme = HTTPBearer(auto_error=False)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Creates a JWT access token containing student_id, email, and expiration time.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str) -> dict:
    """
    Decodes and verifies a JWT access token.
    Raises HTTPException(401) for expired or invalid tokens.
    Returns the token payload dictionary.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        student_id = payload.get("student_id")
        email = payload.get("email")
        if not student_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials: Token payload incomplete",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials: Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_student(credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)) -> dict:
    """
    FastAPI dependency to extract and verify JWT access token from Authorization Bearer header.
    Retrieves the matching student document from MongoDB and returns safe fields (omitting password_hash).
    Raises HTTP 401 Unauthorized if missing, invalid, or expired.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated: Authorization token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = verify_access_token(token)
    student_id = payload.get("student_id")

    try:
        obj_id = ObjectId(student_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials: Invalid student_id format",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    student_doc = db.students.find_one({"_id": obj_id}, {"password_hash": 0})
    if not student_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student account not found or deactivated",
        )

    return {
        "id": str(student_doc["_id"]),
        "name": student_doc.get("name", ""),
        "email": student_doc.get("email", ""),
        "department_code": student_doc.get("department_code", ""),
        "semester": student_doc.get("semester", 1),
    }
