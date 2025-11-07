from pydantic import BaseModel, Field
from dotenv import load_dotenv
from services.core.llm_client import generate_llm_from_api_key

load_dotenv()


# 🧩 Define structured schema
class JobSummary(BaseModel):
    """A concise, professional summary of the job description."""

    summary: str = Field(
        ...,
        description="A single, well-written sentence summarizing the key goal or focus of the job role.",
    )


# 🚀 Main function
def summarize_job_description(job_text: str, api_key: str) -> str:
    """
    Takes a long job description and returns a single professionally worded summary sentence.
    """
    prompt = (
        "You are an expert recruiter and copywriter. Read the following job description carefully "
        "and write one professional sentence that clearly summarizes the role, responsibilities, "
        "and focus area. Keep it concise and natura and make keep the word limit for 100 words.\n\n"
        f"Job Description:\n{job_text}"
    )

    llm = generate_llm_from_api_key(api_key=api_key)
    model_with_structure = llm.with_structured_output(JobSummary)
    response = model_with_structure.invoke(prompt)
    data = response.model_dump()
    return data["summary"]


# # 🧪 Example usage
# if __name__ == "__main__":
#     job_text = """
#     We are looking for a Senior Backend Engineer to design and develop scalable APIs for our
#     fintech platform. The ideal candidate should have strong experience with Python, FastAPI,
#     and AWS. You’ll work closely with frontend and product teams to build reliable systems
#     and optimize performance for millions of users.
#     """

#     summary = summarize_job_description(job_text)
#     print(summary)
