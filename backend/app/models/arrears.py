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


class ArrearAnalyzeRequest(BaseModel):
    studentName: str | None = None
    email: str | None = None
    department: str | None = None
    batch: str | None = None
    arrearSemester: str | None = None
    selectedSubjects: list[str] = Field(default_factory=list)
    attempts: str | None = None
    preparationLevel: str | None = None
    perSubjectWeakAreas: dict[str, list[str]] = Field(default_factory=dict)
    studyAvailability: str | None = None
    preferredStudyTime: str | None = None
    availableDays: list[str] = Field(default_factory=list)
    preparationStatus: str | None = None
    targetExamDate: str | None = None


class RoadmapDay(BaseModel):
    id: str
    dayNumber: int
    title: str
    duration: str
    type: str
    completed: bool = False
    topics: list[str]


class RoadmapWeek(BaseModel):
    id: str
    weekNumber: int
    title: str
    description: str
    progressPercent: int = 0
    days: list[RoadmapDay]


class SubjectDiagnosis(BaseModel):
    subject: str
    weakAreas: list[str]
    summary: str
    weeks: list[RoadmapWeek]


class ArrearAnalysis(BaseModel):
    arrearId: str
    subject: str
    selectedSubjects: list[str]
    semester: str | None = None
    attempts: str | None = None
    preparationLevel: str | None = None
    recommendedDailyHours: str | None = None
    keyFocusAreas: list[str]
    summary: str
    subjectDiagnoses: list[SubjectDiagnosis]


class ArrearRoadmap(BaseModel):
    id: str
    subject: str
    selectedSubjects: list[str]
    totalWeeks: int
    totalDays: int
    completedDays: int = 0
    currentDay: int = 1
    weeks: list[RoadmapWeek]
    subjectDiagnoses: list[SubjectDiagnosis]


class ArrearAnalyzeResponse(BaseModel):
    success: bool = True
    arrearId: str
    analysis: ArrearAnalysis
    roadmap: ArrearRoadmap
