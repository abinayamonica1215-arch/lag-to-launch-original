from pydantic import BaseModel, Field


class SubjectAnalysisItem(BaseModel):
    subject_code: str = Field(..., description="Subject code (e.g. CSE401)")
    subject_title: str = Field(..., description="Subject title or name")
    semester: int = Field(..., description="Semester number")
    arrear: bool = Field(..., description="Whether the student has an active arrear in this subject")
    average_percentage: float | None = Field(None, description="Average assessment percentage (null if not assessed)")
    assessment_count: int = Field(..., description="Number of assessments recorded for this subject")
    status: str = Field(..., description="Performance status: weak, needs_improvement, strong, not_assessed")
    priority: str = Field(..., description="Priority level: high, medium, low")


class AnalysisSummary(BaseModel):
    total_subjects: int = Field(..., description="Total subjects in department and semester")
    subjects_with_arrears: int = Field(..., description="Total subjects with active arrears")
    subjects_assessed: int = Field(..., description="Total subjects with at least one assessment")
    weak_subjects: int = Field(..., description="Total subjects categorized as weak")
    needs_improvement_subjects: int = Field(..., description="Total subjects categorized as needs_improvement")
    strong_subjects: int = Field(..., description="Total subjects categorized as strong")
    not_assessed_subjects: int = Field(..., description="Total subjects not yet assessed")


class WeakAreaAnalysisResponse(BaseModel):
    summary: AnalysisSummary
    subjects: list[SubjectAnalysisItem]
