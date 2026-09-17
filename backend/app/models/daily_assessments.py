from datetime import datetime
from pydantic import BaseModel, Field


class DailyQuestion(BaseModel):
    id: str = Field(..., description="MongoDB ObjectId string for question")
    topic_id: str = Field(..., description="MongoDB ObjectId string for topic")
    question: str = Field(..., description="Question prompt text")
    options: list[str] = Field(..., description="List of multiple choice options")


class DailyAssessmentQuestionResponse(BaseModel):
    topic_id: str
    questions: list[DailyQuestion]


class AnswerSubmission(BaseModel):
    question_id: str = Field(..., description="MongoDB ObjectId string for question")
    selected_answer: str = Field(..., description="Option text selected by student")


class DailyAssessmentSubmitRequest(BaseModel):
    topic_id: str = Field(..., description="MongoDB ObjectId string for topic")
    answers: list[AnswerSubmission] = Field(..., description="List of submitted answers for all topic questions")


class DailyAssessmentResult(BaseModel):
    result_id: str
    topic_id: str
    score: int
    total_questions: int
    percentage: float
    submitted_at: datetime


class DailyAssessmentSubmitResponse(BaseModel):
    message: str
    result: DailyAssessmentResult
