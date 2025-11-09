from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
from services.context_store.redis_context_store import redis_context_store_manager
from services.core.llm_client import generate_llm_from_api_key

load_dotenv()


def generate_followup_question(session_id: str, user_answer: str, api_key: str) -> str:
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
            "You're having a friendly, realistic interview chat with the candidate. "
            "Speak like a thoughtful professional — relaxed, conversational, but insightful. "
            "You can use their first name naturally in your follow-up "
            "Ask one short question that builds naturally on their last answer. "
            "Avoid robotic phrasing, flattery, or filler words. "
            "Keep it simple, human, and easy to answer in a few sentences."
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
Candidate name: {session_data.get("candidate_name", "the candidate")}

Conversation so far:
{context_summary}

Their latest answer:
{user_answer}

Write one short, natural follow-up question that feels like part of a friendly conversation.
Don't use heavy words like 'elaborate' or 'detailed explanation'.
Ask something you'd say in person.
"""
    )

    llm = generate_llm_from_api_key(api_key=api_key)
    response = llm.invoke([system_prompt, user_prompt])
    followup_question = response.content.strip()

    # 6️⃣ Store updated history
    question_history.append(followup_question)
    session_data["question_history"] = question_history
    redis_context_store_manager.store_session(session_id, session_data)

    print(f"✅ Follow-up question generated: {followup_question}")
    return followup_question


def generate_first_question(session_id: str, api_key: str) -> dict:
    """
    Generates the first interview question using session context (skills, experience, job description).
    Starts with a friendly, human greeting before asking the first relevant question.
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

    # 2️⃣ System instruction (human + friendly tone)
    system_prompt = SystemMessage(
        content=(
            "You are a friendly and professional interviewer starting a conversation with the candidate. "
            "Begin with a warm, natural greeting — something like 'Hope you're doing great' or 'Glad to have you here today.' "
            "Then smoothly transition into the first question with 'Let's start with...' or a similar phrase. "
            "Ask one clear, simple, open-ended question based on the candidate’s background or the job description. "
            "The question should feel conversational, not robotic, and be answerable in under 40 words. "
            "Avoid jargon-heavy, complex, or essay-like phrasing."
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

Write a friendly first interview line that:
1. Starts with a short, warm greeting (1 sentence max, e.g., 'Hey Rakesh, hope you're doing great!').
2. Transitions naturally into the first question (e.g., 'Let's start with...').
3. Keeps tone conversational and professional.
4. Keeps the question answerable in about 40 words or less.
Return only the full combined message (greeting + question).
"""
    )

    llm = generate_llm_from_api_key(api_key=api_key)
    response = llm.invoke([system_prompt, user_prompt])
    first_question = response.content.strip()

    # 5️⃣ Store in Redis
    session_data["question_history"] = [first_question]
    session_data["answer_history"] = []
    redis_context_store_manager.store_session(session_id, session_data)

    print(f"🎯 First question generated: {first_question}")
    return {"status": "success", "question": first_question, "interview_end": False}


def generate_normal_question(session_data: dict, api_key: str) -> str:
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
            "You're continuing a relaxed, intelligent interview chat. "
            "You’re curious and conversational — not formal or scripted. "
            "Ask one clear, friendly question that smoothly changes the topic while staying relevant. "
            "Base your question on the candidate’s background or the job description. "
            "Mention the candidate’s name if it feels natural. "
            "The question must be conversational and answerable in under 40 words. "
            "Avoid complex phrasing, heavy vocabulary, rhetorical language, or multi-part questions. "
            "Sound human, curious, and genuinely engaged — like you’re having a natural conversation, not reading a script."
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

    llm = generate_llm_from_api_key(api_key=api_key)
    response = llm.invoke([system_prompt, user_prompt])
    question = response.content.strip()

    # 4️⃣ Clean up (for safety against model intros)
    if question.lower().startswith(("here's", "question:", "q:", "the question is")):
        question = question.split("\n", 1)[-1].strip().strip('"')

    print(f"🧭 New topic-shifting question: {question}")
    return question


def generate_concluding_message(session_data: dict, api_key: str) -> str:
    """
    Sends a friendly, natural closing message after the final interview question.
    The tone should be warm, conversational, and written in first person,
    mentioning that the analysis report will appear on screen right after the interview.
    """
    candidate = session_data.get("candidate_name", "the candidate")

    system_prompt = SystemMessage(
        content=(
            "You are wrapping up a friendly and professional interview conversation. "
            "Speak in the first person (using 'I' or 'me' naturally). "
            "Keep your tone relaxed, genuine, and encouraging — like a real interviewer who enjoyed the chat. "
            "Address the candidate by name if it fits naturally. "
            "Thank them sincerely for their time and insights. "
            "Mention that their analysis report will now appear on the screen, summarizing their performance and key takeaways. "
            "Encourage them to review it carefully for insights and improvement. "
            "You can end with a short positive line like 'Good luck ahead!' or 'Glad we connected today.' "
            "Keep the message under 2 sentences. "
            "Return ONLY the plain text message — no quotes, emojis, or extra formatting."
        )
    )

    user_prompt = HumanMessage(
        content=f"""
The candidate's name is {candidate}.
End the interview naturally and warmly in first person.
Let them know that their analysis report will now appear on their screen for review.
"""
    )

    llm = generate_llm_from_api_key(api_key=api_key)
    response = llm.invoke([system_prompt, user_prompt])
    return response.content.strip()
