import dotenv

dotenv.load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple
from services.analysis_service import AnalysisService
from services.question_service import QuestionService
from agents.context_store import create_session, get_session
from agents.parse_job_description import summarize_job_description
from agents.parse_resume_details import extract_candidate_details
from agents.graph import generate_first_question
from agents.continued_question import generate_continued_question
from fastapi import Request

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


class RegisterSessionRequest(BaseModel):
    session_id: str
    candidate_name: str
    candidate_details: str
    job_description: str


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


@app.post("/register-session")
async def register_session(request: RegisterSessionRequest):
    print("Received register session request:")
    print(request.session_id, request.candidate_name)

    # Parse and structure the inputs
    job_description = summarize_job_description(request.job_description)
    candidate_details = extract_candidate_details(request.candidate_details)

    # Convert Pydantic models to dict before storing
    job_description = job_description
    candidate_details_dict = candidate_details.model_dump()

    create_session(
        request.session_id,
        request.candidate_name,
        candidate_details_dict,
        job_description,
    )

    return {"status": "success", "message": f"Session {request.session_id} registered."}


@app.post("/get-session/{session_id}")
async def get_session_data(session_id: str):
    print("Received get session request:")
    print(session_id)
    session_data = get_session(session_id)
    if not session_data:
        return {"status": "error", "message": f"No session found for ID: {session_id}"}
    return {"status": "success", "data": session_data}


@app.post("/generate-first-question/{session_id}")
async def generate_first_question_endpoint(session_id: str):
    print("Received generate first question request:")
    print(session_id)
    response = generate_first_question(session_id)
    return response


@app.post("/generate-continued-question/{session_id}")
async def generate_continued_question_endpoint(session_id: str, request: Request):
    body = await request.json()
    user_answer = body.get("user_answer", "")

    print("Received generate continued question request:")
    print(session_id, user_answer)

    result = generate_continued_question(session_id, user_answer)

    return {
        "status": "success",
        "question": result["question"],
        "interview_end": result["interview_end"],
    }


@app.post("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/")
async def root():
    return {"message": "Interview AI API is running ✅"}
