from pydantic import BaseModel
from typing import List, Literal


class InterviewQuestion(BaseModel):
    type: Literal["technical", "behavioral"]
    question: str


class InterviewQuestionsOutput(BaseModel):
    questions: List[InterviewQuestion]


class CategoryFeedback(BaseModel):
    rating: Literal["excellent", "good", "average", "poor"]
    explanation: str  # detailed reasoning + strengths + improvements


class InterviewAnalysis(BaseModel):
    technical_skills: CategoryFeedback
    communication: CategoryFeedback
    relevance: CategoryFeedback
    score_out_of_10: float
    hiring_recommendation: Literal["Strong Yes", "Yes", "Neutral", "No"]
    summary_feedback: str
