from pydantic import BaseModel, Field
from dotenv import load_dotenv
from services.core.llm_client import generate_llm_from_api_key

load_dotenv()


# 🧩 Define structured schema
class CandidateDetails(BaseModel):
    """Structured details extracted from a resume."""

    skills: list[str] = Field(
        ..., description="List of key skills mentioned in the resume."
    )
    education: str = Field(
        ..., description="Educational background summary (degree, institution, year)."
    )
    experience: str = Field(
        ..., description="Summary of work experience, roles, and achievements."
    )


# 🚀 Main function
def extract_candidate_details(resume_text: str, api_key: str) -> CandidateDetails:
    """
    Takes long unstructured resume text and returns structured candidate details.
    """
    prompt = (
        "You are a resume parsing assistant. Extract clear, structured information "
        "about the candidate based on the following resume text. "
        "Only include relevant skills, education, and experience.\n\n"
        f"Resume:\n{resume_text}"
    )

    llm = generate_llm_from_api_key(api_key=api_key)
    model_with_structure = llm.with_structured_output(CandidateDetails)
    response = model_with_structure.invoke(prompt)
    return response


# 🧪 Example usage
if __name__ == "__main__":
    resume_text = """
    John Doe is a software engineer with 4 years of experience specializing in backend development.
    Skilled in Python, Django, PostgreSQL, and AWS. Holds a B.Tech in Computer Science from VIT, 2020.
    Worked at TCS and as a freelance backend developer.
    """

    parsed = extract_candidate_details(resume_text)
    print(parsed.model_dump())
