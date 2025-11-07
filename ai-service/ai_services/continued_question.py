from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
from ai_services.context_store import get_session, store_session
from ai_services.graph import generate_followup_question


load_dotenv()

# Base LLM (reuse)
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.6,
    max_tokens=300,
    timeout=30,
)


def generate_normal_question(session_data: dict) -> str:
    """
    Generates a new, topic-shifting interview question (non-follow-up).
    The question should sound conversational, professional, and answerable in about 40 words or less.
    It should shift topics naturally while staying relevant to the candidate’s background and the job role.
    """

    candidate = session_data.get("candidate_name", "the candidate")
    candidate_details = session_data.get("candidate_details", {})
    job_description = session_data.get(
        "job_description", "a general software engineering role"
    )

    skills = ", ".join(candidate_details.get("skills", []))
    experience = candidate_details.get("experience", "relevant experience")
    education = candidate_details.get("education", "technical education")

    # 1️⃣ System instruction with clear tone control
    system_prompt = SystemMessage(
        content=(
            "You are a professional interviewer conducting a real conversation. "
            "Generate one short, natural interview question that shifts to a different relevant topic "
            "based on the candidate’s background or the job description. "
            "The question must be conversational and answerable in under 40 words. "
            "Avoid complex phrasing, heavy vocabulary, or multi-part questions. "
            "Do not add explanations, introductions, or context. "
            "Start directly with the question — examples include: 'Can you explain...', 'How would you...', or 'Tell me about...'."
        )
    )

    # 2️⃣ Candidate context
    user_prompt = HumanMessage(
        content=f"""
Candidate Summary:
- Name: {candidate}
- Skills: {skills}
- Education: {education}
- Experience: {experience}

Job Description Summary:
{job_description}

Generate **one** new short question that changes the topic naturally.
Avoid repeating earlier technical areas.
Keep it simple, clear, and answerable in 40 words or fewer.
Only output the question.
"""
    )

    # 3️⃣ Generate question
    response = llm.invoke([system_prompt, user_prompt])
    question = response.content.strip()

    # 4️⃣ Clean up (for safety against model intros)
    if question.lower().startswith(("here's", "question:", "q:", "the question is")):
        question = question.split("\n", 1)[-1].strip().strip('"')

    print(f"🧭 New topic-shifting question: {question}")
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


def generate_continued_question(session_id: str, user_answer: str) -> dict:
    """
    Orchestrates the interview flow:
      - Every 2 normal questions → ask a follow-up.
      - After 4 total questions → send a conclusion.
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
    if num_questions >= 4:
        # End the interview early after 4 questions
        conclusion = generate_concluding_message(session_data)
        session_data["status"] = "completed"
        store_session(session_id, session_data)
        print("🟢 Interview concluded after 4 questions.")
        return {"question": conclusion, "interview_end": True}

    elif num_questions % 2 == 0 and num_questions > 0:
        # Every 2nd question → follow-up
        print("🔁 Generating follow-up question...")
        next_question = generate_followup_question(session_id, user_answer)

    else:
        # Otherwise → normal topic-changing question
        print("🧠 Generating new normal question...")
        next_question = generate_normal_question(session_data)
        question_history.append(next_question)
        session_data["question_history"] = question_history
        store_session(session_id, session_data)

    print(f"✅ Next question generated: {next_question}")
    return {"question": next_question, "interview_end": interview_end}
