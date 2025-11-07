from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

# ⚙️ Initialize the LLM
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.4,
    max_tokens=512,
)


# 🧩 Define structured schema
class JobSummary(BaseModel):
    """A concise, professional summary of the job description."""

    summary: str = Field(
        ...,
        description="A single, well-written sentence summarizing the key goal or focus of the job role.",
    )


# 🧠 Structured model setup
model_with_structure = llm.with_structured_output(JobSummary)


# 🚀 Main function
def summarize_job_description(job_text: str) -> str:
    """
    Takes a long job description and returns a single professionally worded summary sentence.
    """
    prompt = (
        "You are an expert recruiter and copywriter. Read the following job description carefully "
        "and write one professional sentence that clearly summarizes the role, responsibilities, "
        "and focus area. Keep it concise and natura and make keep the word limit for 100 words.\n\n"
        f"Job Description:\n{job_text}"
    )

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
