import dotenv

dotenv.load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple
from services.analysis_service import AnalysisService
from services.question_service import QuestionService

app = FastAPI(
    title="Interview AI API",
    description="APIs for generating interview questions and evaluating candidate responses",
    version="1.0.0",
)

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to ["http://localhost:3000"] later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------- Request Schemas -----------
class GenerateQuestionsRequest(BaseModel):
    resume: str
    job_description: str


class AnalysisRequest(BaseModel):
    conversation: List[Tuple[str, str]]  # (AI question, Human answer)


# ----------- Endpoints -----------
@app.post("/generate-questions")
async def generate_questions(request: GenerateQuestionsRequest):
    print("Received generate questions request:")
    # print(request.resume, request.job_description)
    result = QuestionService.generate_interview_questions(
        request.resume, request.job_description
    )
    print("Generated questions:", result)
    return {"questions": result}


@app.post("/analyze-responses")
async def analyze_responses(request: AnalysisRequest):
    print("Received analyze responses request:")
    print(request.conversation)
    result = AnalysisService.analyze_conversation_history(request.conversation)
    return result


@app.get("/")
async def root():
    return {"message": "Interview AI API is running ✅"}
