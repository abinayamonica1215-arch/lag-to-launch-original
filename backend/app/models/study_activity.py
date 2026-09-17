from datetime import datetime
from pydantic import BaseModel, Field


class StudyActivityCreateRequest(BaseModel):
    topic_id: str = Field(..., min_length=1, description="MongoDB ObjectId string for topic")
    study_minutes: int = Field(..., ge=0, description="Duration studied in minutes")
    studied: bool = Field(True, description="Whether student studied on this date")


class StudyActivityItem(BaseModel):
    id: str
    topic_id: str
    subject_code: str
    activity_date: str
    studied: bool
    study_minutes: int
    created_at: datetime
    updated_at: datetime


class StudyActivityListResponse(BaseModel):
    activities: list[StudyActivityItem]
    total_days: int
    total_minutes: int
    current_streak: int
    longest_streak: int


class TopicStudyActivityResponse(BaseModel):
    topic_id: str
    subject_code: str
    activities: list[StudyActivityItem]
    total_minutes: int
