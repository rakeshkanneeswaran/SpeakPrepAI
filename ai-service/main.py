import dotenv

dotenv.load_dotenv()

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple, Optional
from services.analysis_service import AnalysisService
from services.context_store.redis_context_store import redis_context_store_manager
from services.parsers.parse_job_description import summarize_job_description
from services.parsers.parse_resume_details import extract_candidate_details
from services.question_generator.technical_question_generator.question_models import (
    generate_first_question,
)
from services.question_generator.technical_question_generator.continued_question import (
    generate_continued_question,
)
from services.question_generator.hr_question_generator.question_models import (
    generate_first_hr_question,
)
from services.question_generator.hr_question_generator.continued_question import (
    generate_continued_hr_question,
)
from fastapi import Request
import traceback
import logging

# Set up logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

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


# Dependency to extract API key from headers
async def get_api_key(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is required")

    try:
        # Extract Bearer token
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=401,
                detail="Invalid authorization format. Expected 'Bearer <token>'",
            )

        api_key = authorization.replace("Bearer ", "").strip()

        if not api_key:
            raise HTTPException(status_code=401, detail="API key is empty")

        # Basic validation for Groq API key format
        if not api_key.startswith("gsk_"):
            raise HTTPException(status_code=401, detail="Invalid API key format")

        return api_key

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting API key: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authorization header")


@app.post("/analyze-responses")
async def analyze_responses(
    request: AnalysisRequest, api_key: str = Depends(get_api_key)
):
    try:
        print("Received analyze responses request:")
        print(f"API Key: {api_key[:10]}...")
        print(request.conversation)
        result = AnalysisService.analyze_conversation_history(
            request.conversation, api_key
        )
        return result
    except Exception as e:
        logger.error(f"Error in analyze-responses: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while analyzing responses: {str(e)}",
        )


@app.post("/register-session")
async def register_session(
    request: RegisterSessionRequest, api_key: str = Depends(get_api_key)
):
    try:
        print("Received register session request:")
        print(f"API Key: {api_key[:10]}...")
        print(request.session_id, request.candidate_name)

        # Parse and structure the inputs with API key
        job_description = summarize_job_description(request.job_description, api_key)
        candidate_details = extract_candidate_details(
            request.candidate_details, api_key
        )

        # Convert Pydantic models to dict before storing
        job_description = job_description
        candidate_details_dict = candidate_details.model_dump()

        redis_context_store_manager.create_session(
            request.session_id,
            request.candidate_name,
            candidate_details_dict,
            job_description,
        )

        return {
            "status": "success",
            "message": f"Session {request.session_id} registered.",
            "session_id": request.session_id,
        }

    except Exception as e:
        logger.error(f"Error in register-session: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while registering session: {str(e)}",
        )


@app.post("/get-session/{session_id}")
async def get_session_data(session_id: str, api_key: str = Depends(get_api_key)):
    try:
        print("Received get session request:")
        print(f"API Key: {api_key[:10]}...")
        print(session_id)
        session_data = redis_context_store_manager.get_session(session_id)
        if not session_data:
            return {
                "status": "error",
                "message": f"No session found for ID: {session_id}",
            }
        return {"status": "success", "data": session_data}

    except Exception as e:
        logger.error(f"Error in get-session: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving session: {str(e)}",
        )


@app.post("/generate-first-question/{session_id}")
async def generate_first_question_endpoint(
    session_id: str, api_key: str = Depends(get_api_key)
):
    try:
        print("Received generate first question request:")
        print(f"API Key: {api_key[:10]}...")
        print(session_id)
        response = generate_first_question(session_id, api_key)
        return response

    except Exception as e:
        logger.error(f"Error in generate-first-question: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while generating first question: {str(e)}",
        )


@app.post("/generate-continued-question/{session_id}")
async def generate_continued_question_endpoint(
    session_id: str, request: Request, api_key: str = Depends(get_api_key)
):
    try:
        body = await request.json()
        user_answer = body.get("user_answer", "")

        print("Received generate continued question request:")
        print(f"API Key: {api_key[:10]}...")
        print(session_id, user_answer)

        result = generate_continued_question(session_id, user_answer, api_key)

        return {
            "status": "success",
            "question": result["question"],
            "interview_end": result["interview_end"],
        }

    except Exception as e:
        logger.error(f"Error in generate-continued-question: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while generating continued question: {str(e)}",
        )


@app.post("/health")
async def health_check():
    try:
        return {"status": "healthy"}
    except Exception as e:
        logger.error(f"Error in health-check: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


@app.post("/generate-first-hr-question/{session_id}")
async def generate_first_hr_question_endpoint(
    session_id: str, api_key: str = Depends(get_api_key)
):
    try:
        print("Received generate first HR question request:")
        print(f"API Key: {api_key[:10]}...")
        print(session_id)
        response = generate_first_hr_question(session_id, api_key)
        return response

    except Exception as e:
        logger.error(f"Error in generate-first-hr-question: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while generating first HR question: {str(e)}",
        )


@app.post("/generate-continued-hr-question/{session_id}")
async def generate_continued_hr_question_endpoint(
    session_id: str, request: Request, api_key: str = Depends(get_api_key)
):
    try:
        body = await request.json()
        user_answer = body.get("user_answer", "")

        print("Received generate continued HR question request:")
        print(f"API Key: {api_key[:10]}...")
        print(session_id, user_answer)

        result = generate_continued_hr_question(session_id, user_answer, api_key)

        return {
            "status": "success",
            "question": result["question"],
            "interview_end": result["interview_end"],
        }

    except Exception as e:
        logger.error(f"Error in generate-continued-hr-question: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while generating continued HR question: {str(e)}",
        )


@app.get("/")
async def root():
    try:
        return {"message": "Interview AI API is running ✅"}
    except Exception as e:
        logger.error(f"Error in root endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Root endpoint failed: {str(e)}")
