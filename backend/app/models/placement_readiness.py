from datetime import datetime
from pydantic import BaseModel, Field


class PlacementReadinessQuestion(BaseModel):
    id: str = Field(..., description="MongoDB ObjectId string for question")
    category: str = Field(..., description="Question category (Aptitude, Communication, Technical)")
    question: str = Field(..., description="Question prompt text")
    options: list[str] = Field(..., description="List of multiple choice options")


class PlacementReadinessQuestionResponse(BaseModel):
    questions: list[PlacementReadinessQuestion]


class PlacementReadinessAnswer(BaseModel):
    question_id: str = Field(..., description="MongoDB ObjectId string for question")
    selected_answer: str = Field(..., description="Option text selected by student")


class PlacementReadinessSubmitRequest(BaseModel):
    answers: list[PlacementReadinessAnswer] = Field(..., description="List of submitted answers")


class PlacementReadinessResult(BaseModel):
    result_id: str
    score: int
    total_questions: int
    percentage: float
    ready: bool
    category_scores: dict[str, float]
    submitted_at: datetime


class PlacementReadinessSubmitResponse(BaseModel):
    message: str
    result: PlacementReadinessResult


class PlacementReadinessListResponse(BaseModel):
    results: list[PlacementReadinessResult]
