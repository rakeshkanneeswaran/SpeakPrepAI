from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
from services.context_store.redis_context_store import redis_context_store_manager
from services.core.llm_client import generate_llm_from_api_key

load_dotenv()


def generate_hr_followup_question(
    session_id: str, user_answer: str, api_key: str
) -> str:
    """
    Generates HR-focused follow-up questions about behavior, mindset, and soft skills.
    """
    session_data = redis_context_store_manager.get_session(session_id)
    if not session_data:
        raise ValueError(f"No session found for ID: {session_id}")

    question_history = session_data.get("question_history", [])
    answer_history = session_data.get("answer_history", [])

    # Append the latest answer
    answer_history.append(user_answer)
    session_data["answer_history"] = answer_history

    # HR-focused system prompt
    system_prompt = SystemMessage(
        content=(
            "You are an HR interviewer focusing on behavioral questions, soft skills, and cultural fit. "
            "Your task is to ask one short, natural follow-up question that explores the candidate's "
            "mindset, values, or behavioral patterns. "
            "Focus on: teamwork, conflict resolution, adaptability, motivation, or communication. "
            "Keep it conversational and answerable in 40 words or less."
        )
    )

    context_summary = "\n".join(
        [
            f"Q{i + 1}: {q}\nA{i + 1}: {a}"
            for i, (q, a) in enumerate(zip(question_history, answer_history))
        ]
    )

    user_prompt = HumanMessage(
        content=f"""
Here is the HR interview so far:

{context_summary}

Candidate's latest answer about their behavior or experience:
{user_answer}

Generate one short, natural HR follow-up question (1-2 sentences).
Focus on understanding their approach, mindset, or lessons learned.
Keep it professional but conversational.
"""
    )

    llm_hr = generate_llm_from_api_key(api_key=api_key)
    response = llm_hr.invoke([system_prompt, user_prompt])
    followup_question = response.content.strip()

    # Store updated history
    question_history.append(followup_question)
    session_data["question_history"] = question_history
    redis_context_store_manager.store_session(session_id, session_data)

    print(f"✅ HR Follow-up question generated: {followup_question}")
    return followup_question


def generate_first_hr_question(session_id: str, api_key: str) -> dict:
    """
    Generates the first HR interview question focusing on behavioral and soft skills.
    The question is phrased in the first person (e.g., "Can you tell me about...").
    """
    session_data = redis_context_store_manager.get_session(session_id)
    if not session_data:
        raise ValueError(f"No session found for ID: {session_id}")

    candidate = session_data.get("candidate_name", "the candidate")
    candidate_details = session_data.get("candidate_details", {})
    job_description = session_data.get("job_description", "a general role")

    skills = ", ".join(candidate_details.get("skills", []))
    experience = candidate_details.get("experience", "relevant experience")
    education = candidate_details.get("education", "educational background")

    # HR-focused system prompt (first-person interviewer)
    system_prompt = SystemMessage(
        content=(
            "You are an HR interviewer conducting a behavioral interview. "
            "Speak naturally in the first person (use 'I', 'me', or 'my' when appropriate). "
            "Start with one open-ended question about the candidate's experience, motivations, or work style. "
            "Focus on soft skills, teamwork, communication, or career goals. "
            "Keep it professional, conversational, and answerable in 40 words or less. "
            "Avoid technical jargon and avoid listing multiple questions."
        )
    )

    user_prompt = HumanMessage(
        content=f"""
Candidate Profile:
- Name: {candidate}
- Skills: {skills}
- Education: {education}
- Experience: {experience}

Job Role: {job_description}

Generate one engaging HR interview starter question.
The question should sound like it’s coming directly from you (the interviewer),
not a system or third party. Keep it warm and natural.
"""
    )

    llm_hr = generate_llm_from_api_key(api_key=api_key)
    response = llm_hr.invoke([system_prompt, user_prompt])
    first_question = response.content.strip()

    # Store in Redis
    session_data["question_history"] = [first_question]
    session_data["answer_history"] = []
    session_data["interview_type"] = "hr"  # Mark as HR interview
    redis_context_store_manager.store_session(session_id, session_data)

    print(f"🎯 First HR question generated: {first_question}")
    return {"status": "success", "question": first_question, "interview_end": False}


def generate_normal_hr_question(session_data: dict, api_key: str) -> str:
    """
    Generates a new HR interview question focusing on different behavioral aspects.
    The question is phrased in the first person (e.g., "Can you tell me about...").
    """
    candidate = session_data.get("candidate_name", "the candidate")
    candidate_details = session_data.get("candidate_details", {})
    job_description = session_data.get("job_description", "a general role")

    skills = ", ".join(candidate_details.get("skills", []))
    experience = candidate_details.get("experience", "professional experience")
    education = candidate_details.get("education", "educational background")

    system_prompt = SystemMessage(
        content=(
            "You are an HR interviewer exploring different behavioral dimensions. "
            "Speak naturally in the first person (use 'I', 'me', or 'my' when appropriate). "
            "Generate one short, conversational HR question about: "
            "teamwork, leadership, problem-solving, adaptability, conflict resolution, "
            "career goals, work ethic, or communication style. "
            "Keep it engaging, professional, and answerable in 40 words or less. "
            "Avoid technical jargon, filler phrases, and do not list multiple questions."
        )
    )

    user_prompt = HumanMessage(
        content=f"""
Candidate Background:
- Skills: {skills}
- Experience: {experience}
- Education: {education}

Job Context: {job_description}

Generate one HR behavioral question phrased in the first person.
The question should explore a new behavioral or soft-skill dimension
different from previous questions.
Keep it warm, human, and inviting.
"""
    )
    llm_hr = generate_llm_from_api_key(api_key=api_key)
    response = llm_hr.invoke([system_prompt, user_prompt])
    question = response.content.strip()

    # Clean up if needed
    if question.lower().startswith(("here's", "question:", "q:", "the question is")):
        question = question.split("\n", 1)[-1].strip().strip('"')

    print(f"🧭 New HR behavioral question: {question}")
    return question


def generate_hr_concluding_message(session_data: dict, api_key: str) -> str:
    """Sends a closing message for HR interviews in first person with a note about the upcoming analysis report."""
    candidate = session_data.get("candidate_name", "the candidate")

    system_prompt = SystemMessage(
        content=(
            "You are wrapping up an HR interview session. "
            "Speak naturally in the first person (using 'I', 'me', or 'my' when appropriate). "
            "Generate a warm, professional, and encouraging concluding message addressed directly to the candidate. "
            "Thank them for their time and insights, mention that you will soon share an analysis report "
            "summarizing their interview performance, and politely encourage them to go through it carefully "
            "for feedback and growth. "
            "Keep the message genuine, confident, and under 2 sentences. "
            "Return only the plain text message — no quotes, markdown, or extra formatting."
        )
    )

    user_prompt = HumanMessage(
        content=f"The candidate's name is {candidate}. End the HR interview gracefully in first person, thank them, tell them you'll share their analysis report soon, and ask them to review it carefully for feedback and growth."
    )

    llm_hr = generate_llm_from_api_key(api_key=api_key)
    response = llm_hr.invoke([system_prompt, user_prompt])
    return response.content.strip()
