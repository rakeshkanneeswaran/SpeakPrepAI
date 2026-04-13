import asyncio
import traceback

from fastapi import APIRouter, Depends, HTTPException
from security import verify_token

from schemas import (
    AnalysisRequest,
    RegisterSessionRequest,
    InterviewRunRequest,
)

from config import api_key, logger, interview_engine

from services.analysis_service import AnalysisService
from services.context_store.redis_context_store import redis_context_store_manager
from services.parsers.parse_job_description import summarize_job_description
from services.parsers.parse_resume_details import extract_candidate_details

router = APIRouter(dependencies=[Depends(verify_token)])


# ---------------- ANALYSIS ---------------- #


@router.post("/analyze-responses")
async def analyze_responses(request: AnalysisRequest):
    try:
        loop = asyncio.get_event_loop()

        result = await loop.run_in_executor(
            None,
            lambda: AnalysisService.analyze_conversation_history(
                request.conversation, api_key
            ),
        )

        return result

    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(500, f"Analysis failed: {str(e)}")


# ---------------- SESSION ---------------- #


@router.post("/register-session")
async def register_session(request: RegisterSessionRequest):
    try:
        loop = asyncio.get_event_loop()

        job_task = loop.run_in_executor(
            None, lambda: summarize_job_description(request.job_description, api_key)
        )

        candidate_task = loop.run_in_executor(
            None, lambda: extract_candidate_details(request.candidate_details, api_key)
        )

        job_description, candidate_details = await asyncio.gather(
            job_task, candidate_task
        )

        redis_context_store_manager.create_session(
            request.session_id,
            request.candidate_name,
            candidate_details.model_dump(),
            job_description,
        )

        return {"status": "success", "session_id": request.session_id}

    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(500, f"Session creation failed: {str(e)}")


@router.get("/get-session/{session_id}")
async def get_session(session_id: str):
    try:
        session = redis_context_store_manager.get_session(session_id)

        if not session:
            return {"status": "error", "message": "Session not found"}

        return {"status": "success", "data": session}

    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(500, str(e))


# ---------------- INTERVIEW ---------------- #


@router.post("/interview/run/{session_id}")
async def run_interview(session_id: str, request: InterviewRunRequest):
    try:
        loop = asyncio.get_event_loop()

        result = await loop.run_in_executor(
            None, lambda: interview_engine.run(session_id, request.userAnswer)
        )

        return {
            "status": "success",
            "question": result["question"],
            "interview_end": result["interview_end"],
        }

    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(500, f"Interview failed: {str(e)}")


# ---------------- HEALTH ---------------- #


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/")
async def root():
    return {"message": "Interview AI Engine running 🚀"}
