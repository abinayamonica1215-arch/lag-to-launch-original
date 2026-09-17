from datetime import datetime
from pydantic import BaseModel, Field, model_validator


class ProgressCreateUpdate(BaseModel):
    subject_code: str = Field(..., min_length=1, description="Subject code (e.g. CSE401)")
    topic_id: str = Field(..., min_length=1, description="Valid topic ObjectId string")
    completed: bool = Field(..., description="Topic completion status")
    progress_percentage: float = Field(..., ge=0.0, le=100.0, description="Progress percentage (0 to 100)")

    @model_validator(mode="after")
    def validate_progress(self):
        if not self.subject_code.strip():
            raise ValueError("subject_code cannot be empty or whitespace")
        if not self.topic_id.strip():
            raise ValueError("topic_id cannot be empty or whitespace")
        if self.completed and self.progress_percentage != 100.0:
            raise ValueError("progress_percentage must be 100 when completed is true")
        if not self.completed and self.progress_percentage >= 100.0:
            raise ValueError("progress_percentage must be less than 100 when completed is false")
        return self


class ProgressItem(BaseModel):
    id: str
    subject_code: str
    topic_id: str
    completed: bool
    progress_percentage: float
    completed_at: datetime | None = None
    updated_at: datetime


class ProgressListResponse(BaseModel):
    progress: list[ProgressItem]


class ProgressSummary(BaseModel):
    total_subjects: int
    total_topics: int
    completed_topics: int
    pending_topics: int
    overall_progress_percentage: float
    subjects_completed: int


class TopicProgressDetailResponse(BaseModel):
    id: str
    subject_code: str
    topic_id: str
    completed: bool
    progress_percentage: float
    latest_score: int | None = None
    total_questions: int | None = None
    latest_percentage: float | None = None
    assessment_completed: bool = False
    completed_at: datetime | None = None
    updated_at: datetime


class SubjectTopicProgress(BaseModel):
    topic_id: str
    unit_number: int
    title: str
    completed: bool
    progress_percentage: float
    latest_score: int | None = None
    total_questions: int | None = None
    latest_percentage: float | None = None
    assessment_completed: bool = False


class SubjectProgressResponse(BaseModel):
    subject_code: str
    subject_title: str
    total_topics: int
    completed_topics: int
    progress_percentage: float
    topics: list[SubjectTopicProgress]
    final_assessment_completed: bool = False
    final_assessment_score: int | None = None
    final_assessment_percentage: float | None = None
    final_assessment_passed: bool = False


class ProgressDeleteResponse(BaseModel):
    message: str


