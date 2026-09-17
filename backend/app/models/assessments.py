from pydantic import BaseModel, Field, model_validator


class AssessmentCreateRequest(BaseModel):
    subject_code: str = Field(..., min_length=1, description="Subject code (e.g. CSE401)")
    assessment_name: str = Field(..., min_length=1, description="Assessment name (e.g. Internal Assessment 1)")
    marks: float = Field(..., ge=0, description="Obtained marks (must be >= 0)")
    max_marks: float = Field(..., gt=0, description="Maximum marks (must be > 0)")

    @model_validator(mode="after")
    def validate_assessment_fields(self):
        if not self.assessment_name.strip():
            raise ValueError("assessment_name cannot be empty or whitespace")
        if self.marks > self.max_marks:
            raise ValueError("marks cannot exceed max_marks")
        return self


class AssessmentUpdateRequest(BaseModel):
    assessment_name: str = Field(..., min_length=1, description="Updated assessment name")
    marks: float = Field(..., ge=0, description="Updated marks (must be >= 0)")
    max_marks: float = Field(..., gt=0, description="Updated maximum marks (must be > 0)")

    @model_validator(mode="after")
    def validate_assessment_fields(self):
        if not self.assessment_name.strip():
            raise ValueError("assessment_name cannot be empty or whitespace")
        if self.marks > self.max_marks:
            raise ValueError("marks cannot exceed max_marks")
        return self


class AssessmentItem(BaseModel):
    id: str
    subject_code: str
    subject_title: str
    assessment_name: str
    marks: float
    max_marks: float
    percentage: float


class AssessmentCreateResponse(BaseModel):
    message: str
    assessment: AssessmentItem


class AssessmentUpdateResponse(BaseModel):
    message: str
    assessment: AssessmentItem


class AssessmentListResponse(BaseModel):
    assessments: list[AssessmentItem]


class AssessmentDeleteResponse(BaseModel):
    message: str
