from pydantic import BaseModel, Field


class StudentInfo(BaseModel):
    department_code: str = Field(..., description="Student department code (e.g. CSE)")
    semester: int = Field(..., description="Student current semester (e.g. 4)")


class RoadmapSummary(BaseModel):
    total_subjects: int = Field(..., description="Total subjects analyzed")
    high_priority_subjects: int = Field(..., description="Count of high priority subjects")
    medium_priority_subjects: int = Field(..., description="Count of medium priority subjects")
    low_priority_subjects: int = Field(..., description="Count of low priority subjects")
    total_recommended_days: int = Field(..., description="Sum of recommended study days across all subjects")


class TopicRoadmapItem(BaseModel):
    unit_number: int = Field(..., description="Topic unit number (1 to 4)")
    title: str = Field(..., description="Topic title")
    description: str = Field(..., description="Topic description")
    recommended_days: int = Field(..., description="Recommended days allocated for this topic")


class SubjectRoadmapItem(BaseModel):
    subject_code: str = Field(..., description="Subject code")
    subject_title: str = Field(..., description="Subject title")
    status: str = Field(..., description="Status: weak, needs_improvement, strong, not_assessed")
    priority: str = Field(..., description="Priority: high, medium, low")
    arrear: bool = Field(..., description="Whether subject has active arrear")
    average_percentage: float | None = Field(None, description="Average percentage across assessments (null if none)")
    recommended_days: int = Field(..., description="Total recommended days for this subject")
    recommendation: str = Field(..., description="Actionable study recommendation")
    topics: list[TopicRoadmapItem] = Field(..., description="Topic level breakdown and time allocation")


class RecoveryRoadmapResponse(BaseModel):
    student: StudentInfo
    summary: RoadmapSummary
    roadmap: list[SubjectRoadmapItem]
