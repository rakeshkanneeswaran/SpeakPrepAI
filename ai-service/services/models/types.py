from pydantic import BaseModel
from typing import List, Literal


class InterviewQuestion(BaseModel):
    type: Literal["technical", "behavioral"]
    question: str


class InterviewQuestionsOutput(BaseModel):
    questions: List[InterviewQuestion]
