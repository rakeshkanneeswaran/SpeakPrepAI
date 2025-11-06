from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
from agents.context_store import get_session, store_session
from agents.graph import generate_followup_question


load_dotenv()

# Base LLM (reuse)
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.6,
    max_tokens=300,
    timeout=30,
)


def generate_normal_question(session_data: dict) -> str:
    """Generates a new, topic-shifting interview question (non-follow-up)."""
    candidate = session_data.get("candidate_name", "the candidate")
    candidate_details = session_data.get("candidate_details", {})
    job_description = session_data.get(
        "job_description", "a general software engineering role"
    )

    skills = ", ".join(candidate_details.get("skills", []))
    experience = candidate_details.get("experience", "relevant experience")
    education = candidate_details.get("education", "technical education")

    system_prompt = SystemMessage(
        content=(
            "You are an expert interviewer. "
            "Your task is to write *only* the next question — concise, clear, and phrased naturally as if spoken by an interviewer. "
            "Do not include explanations, introductions, or context before or after the question. "
            "Each question must start directly, e.g., 'Can you explain...', 'How would you...', or 'Tell me about...'. "
            "Focus on a different topic from earlier questions but stay relevant to the candidate’s skills and the job description."
        )
    )

    user_prompt = HumanMessage(
        content=f"""
Candidate Summary:
- Name: {candidate}
- Skills: {skills}
- Education: {education}
- Experience: {experience}

Job Description Summary:
{job_description}

Now generate **only one** new question that shifts the topic.
Output strictly the question sentence, with no extra text or explanation.
"""
    )

    response = llm.invoke([system_prompt, user_prompt])
    question = response.content.strip()

    # 🧹 Optional: Remove model's "Here's" prefix if it still appears
    if question.lower().startswith("here's"):
        question = question.split("\n", 1)[-1].strip().strip('"')

    return question


def generate_concluding_message(session_data: dict) -> str:
    """Sends a closing message after the final question."""
    candidate = session_data.get("candidate_name", "the candidate")

    system_prompt = SystemMessage(
        content=(
            "You are wrapping up a professional interview session. "
            "Generate a polite, encouraging, and natural concluding message thanking the candidate. "
            "Keep it under 2 sentences. "
            "Return ONLY the plain text message without any quotes, formatting, or additional text."
        )
    )

    user_prompt = HumanMessage(
        content=f"The candidate's name is {candidate}. End the session gracefully."
    )

    response = llm.invoke([system_prompt, user_prompt])
    return response.content.strip()


def generate_continued_question(session_id: str, user_answer: str) -> str:
    """
    Orchestrates the interview flow:
      - Every 2 normal questions → ask a follow-up.
      - After 8 total questions → send a conclusion.
      - Otherwise → continue normally.
    """

    session_data = get_session(session_id)
    if not session_data:
        raise ValueError(f"No session found for ID: {session_id}")

    # Update answer history
    answer_history = session_data.get("answer_history", [])
    question_history = session_data.get("question_history", [])
    answer_history.append(user_answer)
    session_data["answer_history"] = answer_history

    num_questions = len(question_history)

    interview_end = False

    # 🎯 Logic branching
    if num_questions >= 8:
        # End the interview
        conclusion = generate_concluding_message(session_data)
        session_data["status"] = "completed"
        store_session(session_id, session_data)
        print("🟢 Interview concluded.")
        interview_end = True
        next_question = conclusion
        return {"question": next_question, "interview_end": interview_end}

    elif num_questions % 3 == 0 and num_questions > 0:
        # Every 3rd turn → follow-up question
        print("🔁 Generating follow-up question...")
        interview_end = False
        next_question = generate_followup_question(session_id, user_answer)

    else:
        # Otherwise → normal topic-changing question
        print("🧠 Generating new normal question...")
        next_question = generate_normal_question(session_data)
        question_history.append(next_question)
        session_data["question_history"] = question_history
        interview_end = False

        store_session(session_id, session_data)

    print(f"✅ Next question generated: {next_question}")
    return {"question": next_question, "interview_end": interview_end}
