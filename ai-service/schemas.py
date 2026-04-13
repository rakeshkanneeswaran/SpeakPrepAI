from pydantic import BaseModel
from typing import List, Tuple


class AnalysisRequest(BaseModel):
    conversation: List[Tuple[str, str]]


class RegisterSessionRequest(BaseModel):
    session_id: str
    candidate_name: str
    candidate_details: str
    job_description: str


class InterviewRunRequest(BaseModel):
    userAnswer: str | None = None
