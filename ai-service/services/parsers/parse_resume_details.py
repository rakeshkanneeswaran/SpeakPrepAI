from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv
from services.core.llm_client import generate_llm_from_api_key
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)
import groq

load_dotenv()


class CandidateDetails(BaseModel):
    """Structured details extracted from a resume."""

    skills: List[str] = Field(
        ...,
        description="List of technical skills, programming languages, tools, and technologies.",
    )
    education: str = Field(
        ...,
        description="Educational qualifications including degree, institution, location, and timeline.",
    )
    experience: str = Field(
        ...,
        description="Work experience including company names, positions, locations, and duration.",
    )


# 🚀 Main function with retry logic
@retry(
    stop=stop_after_attempt(2),  # Try 2 times total (1 initial + 1 retry)
    wait=wait_exponential(
        multiplier=1, min=2, max=10
    ),  # Wait 2s, then 4s between retries
    retry=retry_if_exception_type((groq.BadRequestError, ValueError)),
)
def extract_candidate_details_with_retry(
    resume_text: str, api_key: str
) -> CandidateDetails:
    """
    Takes long unstructured resume text and returns structured candidate details with retry logic.
    """
    prompt = (
        "You are a resume parsing assistant. Extract clear, structured information "
        "about the candidate based on the following resume text. "
        "Focus on extracting:\n"
        "- SKILLS: List of technical skills, programming languages, tools\n"
        "- EDUCATION: Degree, institution, location, timeline/status\n"
        "- EXPERIENCE: Company, position, location, duration\n\n"
        "Return the information in the exact structured format required.\n\n"
        f"Resume Text:\n{resume_text}"
    )

    llm = generate_llm_from_api_key(api_key=api_key)
    model_with_structure = llm.with_structured_output(CandidateDetails)

    response = model_with_structure.invoke(prompt)

    # Basic validation to trigger retry if extraction seems failed
    if not response.skills or len(response.skills) == 0:
        raise ValueError("No skills extracted - triggering retry")

    return response


def extract_candidate_details(resume_text: str, api_key: str) -> CandidateDetails:
    """
    Main function that combines retry logic with fallback extraction.
    """
    try:
        # First try with retry logic
        response = extract_candidate_details_with_retry(resume_text, api_key)
        return response
    except Exception as e:
        print(f"All retries failed: {e}")
        # Fallback: try without structured output
        llm = generate_llm_from_api_key(api_key=api_key)
        return fallback_extraction(resume_text, llm)


def fallback_extraction(resume_text: str, llm) -> CandidateDetails:
    """Fallback method if structured output fails"""
    fallback_prompt = (
        "Extract from the resume and return ONLY in this exact format:\n\n"
        "SKILLS: comma,separated,list,of,technical,skills\n"
        "EDUCATION: single line education summary\n"
        "EXPERIENCE: single line experience summary\n\n"
        "Do not include any other text or explanations.\n\n"
        f"Resume: {resume_text}"
    )

    response = llm.invoke(fallback_prompt)
    # Parse the response manually
    return parse_manual_response(response.content)


def parse_manual_response(response_text: str) -> CandidateDetails:
    """Parse the fallback LLM response into structured format"""
    try:
        skills = []
        education = "Extracted from resume"
        experience = "Extracted from resume"

        lines = response_text.strip().split("\n")

        for line in lines:
            if line.startswith("SKILLS:"):
                skills_str = line.replace("SKILLS:", "").strip()
                skills = [
                    skill.strip() for skill in skills_str.split(",") if skill.strip()
                ]
            elif line.startswith("EDUCATION:"):
                education = line.replace("EDUCATION:", "").strip()
            elif line.startswith("EXPERIENCE:"):
                experience = line.replace("EXPERIENCE:", "").strip()

        return CandidateDetails(
            skills=skills if skills else ["Skills extraction failed"],
            education=education,
            experience=experience,
        )
    except Exception as e:
        print(f"Manual parsing also failed: {e}")
        # Ultimate fallback
        return CandidateDetails(
            skills=["Extraction failed"],
            education="Extraction failed",
            experience="Extraction failed",
        )
