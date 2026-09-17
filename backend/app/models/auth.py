from pydantic import BaseModel, EmailStr, Field


class StudentRegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, description="Student's full name")
    email: EmailStr = Field(..., description="Student's email address")
    password: str = Field(..., min_length=6, description="Password (minimum 6 characters)")
    department_code: str = Field(..., min_length=1, description="Department code (e.g. CSE, AIDS, ECE)")
    semester: int = Field(..., description="Semester number (allowed: 1, 3, 4, 7)")


class StudentResponse(BaseModel):
    id: str
    name: str
    email: str
    department_code: str
    semester: int


class StudentRegisterResponse(BaseModel):
    message: str
    student: StudentResponse


class StudentLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Student's email address")
    password: str = Field(..., description="Student's password")


class StudentLoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    student: StudentResponse


