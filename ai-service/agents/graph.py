from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv
import os
from agents.context_store import get_session, store_session

load_dotenv()

# LLM setup
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.5,
    max_tokens=300,
    timeout=30,
)


def generate_followup_question(session_id: str, user_answer: str) -> str:
    """
    Fetches session data from Redis, uses context + user answer
    to generate a relevant follow-up interview question.
    """

    # 1️⃣ Fetch session context
    session_data = get_session(session_id)
    if not session_data:
        raise ValueError(f"No session found for ID: {session_id}")

    question_history = session_data.get("question_history", [])
    answer_history = session_data.get("answer_history", [])

    # 2️⃣ Append the new answer to history
    answer_history.append(user_answer)
    session_data["answer_history"] = answer_history

    # 3️⃣ Prepare system + user prompt for the LLM
    system_prompt = SystemMessage(
        content=(
            "You are an experienced technical interviewer. "
            "Based on the candidate’s previous answers, "
            "generate one thoughtful follow-up question that digs deeper into their experience or reasoning. "
            "Be concise and professional. Avoid repeating past questions."
        )
    )

    # 4️⃣ Create full context for the model
    context_summary = "\n".join(
        [
            f"Q{i + 1}: {q}\nA{i + 1}: {a}"
            for i, (q, a) in enumerate(zip(question_history, answer_history))
        ]
    )

    user_prompt = HumanMessage(
        content=f"""
Here is the interview so far:

{context_summary}

Candidate's latest answer:
{user_answer}

Generate the next follow-up question (1 sentence only).
"""
    )

    # 5️⃣ Call the LLM
    response = llm.invoke([system_prompt, user_prompt])
    followup_question = response.content.strip()

    # 6️⃣ Store back into Redis
    question_history.append(followup_question)
    session_data["question_history"] = question_history
    store_session(session_id, session_data)

    print(f"✅ Follow-up question generated: {followup_question}")
    return followup_question


def generate_first_question(session_id: str) -> str:
    """
    Generates the first interview question using session context (skills, experience, job description).
    Stores it in Redis for continuity.
    """

    # 1️⃣ Fetch session context
    session_data = get_session(session_id)
    if not session_data:
        raise ValueError(f"No session found for ID: {session_id}")

    candidate = session_data.get("candidate_name", "the candidate")
    candidate_details = session_data.get("candidate_details", {})
    job_description = session_data.get(
        "job_description", "a general software engineering role"
    )

    skills = ", ".join(candidate_details.get("skills", []))
    experience = candidate_details.get(
        "experience", "some experience in relevant domains"
    )
    education = candidate_details.get("education", "relevant academic background")

    # 2️⃣ System instruction
    system_prompt = SystemMessage(
        content=(
            "You are a professional technical interviewer. "
            "Your job is to start the interview with one strong, open-ended question "
            "based on the candidate’s background and the job description. "
            "The tone should be conversational but professional."
        )
    )

    # 3️⃣ User context
    user_prompt = HumanMessage(
        content=f"""
Candidate Summary:
- Name: {candidate}
- Skills: {skills}
- Education: {education}
- Experience: {experience}

Job Description Summary:
{job_description}

Generate the first interview question (1–2 sentences max).
Do not include introductions like 'Hi' or 'Let's start the interview.'
"""
    )

    # 4️⃣ Generate question
    response = llm.invoke([system_prompt, user_prompt])
    first_question = response.content.strip()

    # 5️⃣ Save in Redis for continuity
    session_data["question_history"] = [first_question]
    session_data["answer_history"] = []
    store_session(session_id, session_data)

    print(f"🎯 First question generated: {first_question}")
    return {"status": "success", "question": first_question, "interview_end": False}
