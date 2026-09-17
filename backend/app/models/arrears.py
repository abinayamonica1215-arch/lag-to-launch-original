from datetime import datetime
from pydantic import BaseModel, Field


class ArrearCreateRequest(BaseModel):
    subject_code: str = Field(..., min_length=1, description="Subject code to add as an arrear (e.g. CSE401)")


class ArrearItem(BaseModel):
    id: str
    subject_code: str
    subject_title: str
    department_code: str
    semester: int
    status: str = "active"
    completed_at: datetime | None = None
    final_assessment_percentage: float | None = None
    final_assessment_result_id: str | None = None


class ArrearCreateResponse(BaseModel):
    message: str
    arrear: ArrearItem


class ArrearCompleteResponse(BaseModel):
    message: str
    arrear: ArrearItem


class ArrearListResponse(BaseModel):
    arrears: list[ArrearItem]
    active_count: int | None = None
    completed_count: int | None = None
    total_count: int | None = None


class ArrearDeleteResponse(BaseModel):
    message: str

