from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
from services.context_store.redis_context_store import redis_context_store_manager

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
    Fetches session data from Redis and generates a short, natural follow-up question
    that digs deeper into the candidate's reasoning or experience.
    The follow-up should be conversational, specific, and answerable in 40 words or less.
    """

    # 1️⃣ Fetch session context
    session_data = redis_context_store_manager.get_session(session_id)
    if not session_data:
        raise ValueError(f"No session found for ID: {session_id}")

    question_history = session_data.get("question_history", [])
    answer_history = session_data.get("answer_history", [])

    # 2️⃣ Append the latest answer
    answer_history.append(user_answer)
    session_data["answer_history"] = answer_history

    # 3️⃣ System instruction (improved tone)
    system_prompt = SystemMessage(
        content=(
            "You are a professional interviewer conducting a live interview. "
            "Your task is to ask one short, natural follow-up question based on the candidate’s previous answer. "
            "Keep the tone conversational and focused. Avoid technical jargon unless it’s contextually required. "
            "The question must be specific to the candidate’s answer, not generic. "
            "Avoid repeating any previous questions. "
            "Keep it clear, human, and answerable within 40 words."
        )
    )

    # 4️⃣ Create conversational context
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

Candidate’s latest answer:
{user_answer}

Generate one short, natural follow-up question (1–2 sentences max).
Do not ask the candidate to 'explain more' or 'describe in detail' directly.
Keep it realistic for an interview flow.
"""
    )

    # 5️⃣ Generate question from LLM
    response = llm.invoke([system_prompt, user_prompt])
    followup_question = response.content.strip()

    # 6️⃣ Store updated history
    question_history.append(followup_question)
    session_data["question_history"] = question_history
    redis_context_store_manager.store_session(session_id, session_data)

    print(f"✅ Follow-up question generated: {followup_question}")
    return followup_question


def generate_first_question(session_id: str) -> dict:
    """
    Generates the first interview question using session context (skills, experience, job description).
    The question should be simple, natural, and answerable in under 40 words.
    """

    # 1️⃣ Fetch session context
    session_data = redis_context_store_manager.get_session(session_id)
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

    # 2️⃣ System instruction (tightened tone)
    system_prompt = SystemMessage(
        content=(
            "You are a professional technical interviewer. "
            "Your task is to start the interview with one clear, open-ended question "
            "that feels natural and professional. "
            "Avoid jargon-heavy or essay-style phrasing. "
            "The question should be answerable in 40 words or less. "
            "Keep it focused on the candidate’s background or the job description."
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

Generate one short, realistic first interview question that sets the tone for a conversational interview.
Avoid greetings or introductions.
Limit the question so it can be answered within about 40 words.
"""
    )

    # 4️⃣ Generate question
    response = llm.invoke([system_prompt, user_prompt])
    first_question = response.content.strip()

    # 5️⃣ Store in Redis
    session_data["question_history"] = [first_question]
    session_data["answer_history"] = []
    redis_context_store_manager.store_session(session_id, session_data)

    print(f"🎯 First question generated: {first_question}")
    return {"status": "success", "question": first_question, "interview_end": False}


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
