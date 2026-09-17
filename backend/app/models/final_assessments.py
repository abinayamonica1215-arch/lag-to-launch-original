from datetime import datetime
from pydantic import BaseModel, Field


class FinalAssessmentQuestion(BaseModel):
    id: str = Field(..., description="MongoDB ObjectId string for question")
    subject_code: str = Field(..., description="Subject code (e.g. CSE101)")
    question: str = Field(..., description="Question prompt text")
    options: list[str] = Field(..., description="List of multiple choice options")


class FinalAssessmentQuestionResponse(BaseModel):
    subject_code: str
    questions: list[FinalAssessmentQuestion]


class FinalAnswerSubmission(BaseModel):
    question_id: str = Field(..., description="MongoDB ObjectId string for question")
    selected_answer: str = Field(..., description="Option text selected by student")


class FinalAssessmentSubmitRequest(BaseModel):
    subject_code: str = Field(..., description="Subject code (e.g. CSE101)")
    answers: list[FinalAnswerSubmission] = Field(..., description="List of submitted answers for all final assessment questions")


class FinalAssessmentResult(BaseModel):
    result_id: str
    subject_code: str
    score: int
    total_questions: int
    percentage: float
    passed: bool
    submitted_at: datetime


class FinalAssessmentSubmitResponse(BaseModel):
    message: str
    result: FinalAssessmentResult
