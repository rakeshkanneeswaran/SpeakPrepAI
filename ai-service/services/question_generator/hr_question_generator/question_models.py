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
    Keeps the tone personal, conversational, and directly addressed to the candidate.
    """

    # 🔹 Fetch session
    session_data = redis_context_store_manager.get_session(session_id)
    if not session_data:
        raise ValueError(f"No session found for ID: {session_id}")

    candidate = session_data.get("candidate_name", "the candidate")
    question_history = session_data.get("question_history", [])
    answer_history = session_data.get("answer_history", [])

    # 🧩 Append the latest answer
    answer_history.append(user_answer)
    session_data["answer_history"] = answer_history

    # 🧠 Tone setup
    system_prompt = SystemMessage(
        content=(
            "You're an HR interviewer having a thoughtful, friendly chat with the candidate. "
            "Speak naturally in the first person (using 'I', 'me', or 'my' when appropriate). "
            "Address the candidate directly in the **second person** — using 'you' — and mention their name casually if it fits. "
            "Your goal is to ask **one short, natural follow-up question** based on their latest answer, showing genuine curiosity. "
            "Focus on soft skills such as teamwork, adaptability, motivation, conflict resolution, or communication. "
            "The question should sound engaged and human — like you're reacting to what they just said — not like a list of scripted prompts. "
            "Avoid formal or robotic phrasing, and do not repeat earlier questions. "
            "Keep it conversational and answerable in under 40 words."
        )
    )

    # 🗂️ Build conversation context
    context_summary = "\n".join(
        [
            f"Q{i + 1}: {q}\nA{i + 1}: {a}"
            for i, (q, a) in enumerate(zip(question_history, answer_history))
        ]
    )

    # 🗣️ Prompt for follow-up generation
    user_prompt = HumanMessage(
        content=f"""
Here’s the HR interview so far:

{context_summary}

The candidate’s name is {candidate}.
Their most recent answer was:
"{user_answer}"

Generate one short, natural **follow-up question** that directly relates to what {candidate} said.
Speak in the second person (“you”), as if continuing the same chat.
If it fits naturally, mention {candidate}’s name in the question.
Example tone:
"Rakesh, that’s really interesting — how do you usually stay motivated in situations like that?"
Keep it warm, conversational, and under 40 words.
"""
    )

    # ⚙️ Generate response
    llm_hr = generate_llm_from_api_key(api_key=api_key)
    response = llm_hr.invoke([system_prompt, user_prompt])
    followup_question = response.content.strip()

    # 🧽 Cleanup for extra formatting
    if followup_question.lower().startswith(
        ("here's", "question:", "q:", "the question is")
    ):
        followup_question = followup_question.split("\n", 1)[-1].strip().strip('"')

    # 💾 Update session
    question_history.append(followup_question)
    session_data["question_history"] = question_history
    redis_context_store_manager.store_session(session_id, session_data)

    print(f"✅ HR Follow-up question generated: {followup_question}")
    return followup_question


def generate_first_hr_question(session_id: str, api_key: str) -> dict:
    """
    Generates the first HR interview question focusing on behavioral and soft skills.
    The tone should be warm, conversational, and personal — as if the interviewer
    is genuinely interested in getting to know the candidate.
    """

    # 🔹 Fetch session context
    session_data = redis_context_store_manager.get_session(session_id)
    if not session_data:
        raise ValueError(f"No session found for ID: {session_id}")

    candidate = session_data.get("candidate_name", "the candidate")
    candidate_details = session_data.get("candidate_details", {})
    job_description = session_data.get("job_description", "a general role")

    skills = ", ".join(candidate_details.get("skills", []))
    experience = candidate_details.get("experience", "relevant experience")
    education = candidate_details.get("education", "educational background")

    # 🧠 HR-style system prompt — friendly, direct, and second-person focused
    system_prompt = SystemMessage(
        content=(
            "You’re an HR interviewer beginning a relaxed, friendly conversation. "
            "Speak naturally in the first person (using 'I', 'me', or 'my' when it feels right). "
            "Address the candidate directly in the **second person** — using 'you' — to make the tone warm and conversational. "
            "If it feels natural, mention the candidate’s name casually in your greeting or question. "
            "You can start with something like: 'Hi Rakesh, hope you’re doing well' or 'It’s great to have you here, Rakesh.' "
            "Ask just **one clear, open-ended question** that helps you learn more about the candidate’s mindset, motivation, or work style. "
            "Avoid robotic or formal phrasing — sound human and curious. "
            "Do not include multiple questions. Keep it short, natural, and answerable in under 40 words."
        )
    )

    # 🗣️ Context for the model
    user_prompt = HumanMessage(
        content=f"""
Candidate Profile:
- Name: {candidate}
- Skills: {skills}
- Education: {education}
- Experience: {experience}

Job Role: {job_description}

Generate the **first HR interview question** as if you’re personally starting a warm, conversational chat with {candidate}.
Speak directly to them using the second person ("you") — make it sound like a real exchange, not a script.
You can open with a short friendly line, then move into your question.
Example tone:
"Hi {candidate}, I’m glad you’re here today. Can you tell me about a time when you felt most engaged at work?"
Keep it friendly, simple, and answerable in less than 40 words.
"""
    )

    # ⚙️ Generate question
    llm_hr = generate_llm_from_api_key(api_key=api_key)
    response = llm_hr.invoke([system_prompt, user_prompt])
    first_question = response.content.strip()

    # 💾 Store in Redis
    session_data["question_history"] = [first_question]
    session_data["answer_history"] = []
    session_data["interview_type"] = "hr"
    redis_context_store_manager.store_session(session_id, session_data)

    print(f"🎯 First HR question generated: {first_question}")
    return {"status": "success", "question": first_question, "interview_end": False}


def generate_normal_hr_question(session_data: dict, api_key: str) -> str:
    """
    Generates a new HR interview question focusing on different behavioral aspects.
    The question should sound natural, human, and conversational — as if
    the interviewer is continuing a real chat with the candidate.
    """

    candidate = session_data.get("candidate_name", "the candidate")
    candidate_details = session_data.get("candidate_details", {})
    job_description = session_data.get("job_description", "a general role")

    skills = ", ".join(candidate_details.get("skills", []))
    experience = candidate_details.get("experience", "professional experience")
    education = candidate_details.get("education", "educational background")

    # 🧠 Tone + intent setup
    system_prompt = SystemMessage(
        content=(
            "You're an HR interviewer continuing a friendly, thoughtful conversation. "
            "Speak naturally in the first person (using 'I', 'me', or 'my' when it fits). "
            "Address the candidate directly in the **second person** — using 'you' — and mention their name naturally if it feels right. "
            "Your goal is to explore a new behavioral or soft-skill dimension — such as teamwork, leadership, communication, "
            "adaptability, problem-solving, handling feedback, or motivation. "
            "Ask **one** clear, open-ended question that sounds genuine and conversational. "
            "Avoid robotic phrasing, filler like 'Can you elaborate,' and technical or formal language. "
            "Keep it human, short, and answerable in 40 words or fewer."
        )
    )

    # 🗣️ Candidate context
    user_prompt = HumanMessage(
        content=f"""
Candidate Name: {candidate}
Skills: {skills}
Experience: {experience}
Education: {education}
Job Context: {job_description}

Generate one new HR question that sounds like you're continuing the conversation with {candidate}.
Use their name naturally, speak directly to them using 'you', and explore a different soft-skill area than before.
Example tone:
"Rakesh, I’m curious — how do you usually handle situations where your team disagrees with your approach?"
Keep it short, inviting, and conversational — something an actual HR interviewer would ask mid-chat.
"""
    )

    # ⚙️ Generate question
    llm_hr = generate_llm_from_api_key(api_key=api_key)
    response = llm_hr.invoke([system_prompt, user_prompt])
    question = response.content.strip()

    # 🧹 Cleanup for consistency
    if question.lower().startswith(("here's", "question:", "q:", "the question is")):
        question = question.split("\n", 1)[-1].strip().strip('"')

    print(f"🧭 New HR behavioral question: {question}")
    return question


def generate_hr_concluding_message(session_data: dict, api_key: str) -> str:
    """
    Sends a warm, human closing message for HR interviews — written in first person,
    directly addressing the candidate and mentioning the upcoming analysis report.
    """

    candidate = session_data.get("candidate_name", "the candidate")

    # 🧠 System prompt for natural tone and empathy
    system_prompt = SystemMessage(
        content=(
            "You're wrapping up an HR interview with warmth and professionalism. "
            "Speak naturally in the first person (using 'I', 'me', or 'my' when appropriate). "
            "Address the candidate directly in the **second person** — using 'you' — and mention their name casually if it feels natural. "
            "Thank them sincerely for their time, insight, and openness during the chat. "
            "Tell them that their **interview analysis report will appear on-screen next**, and gently encourage them to review it for feedback and improvement. "
            "Keep the tone conversational, supportive, and confident — like a real person wrapping up a great conversation, not a scripted line. "
            "Limit the response to **two short sentences**. "
            "Return only plain text (no quotes, markdown, or extra formatting)."
        )
    )

    # 💬 Context for the model
    user_prompt = HumanMessage(
        content=f"""
The candidate's name is {candidate}.
End the HR interview gracefully in first person.
Thank {candidate} for their time and insights,
mention that you'll share an analysis report which will appear on their screen next,
and encourage them to review it for feedback and growth.
Keep it short, conversational, and natural — like a real HR interviewer speaking.
Example tone:
"Rakesh, it was great hearing your thoughts today. I’ll share your analysis report next — take a look through it to see where you did well and what you can improve."
"""
    )

    # ⚙️ Generate the closing message
    llm_hr = generate_llm_from_api_key(api_key=api_key)
    response = llm_hr.invoke([system_prompt, user_prompt])
    conclusion = response.content.strip()

    # 🧹 Cleanup
    if conclusion.lower().startswith(
        ("here's", "message:", "response:", "the message is")
    ):
        conclusion = conclusion.split("\n", 1)[-1].strip().strip('"')

    print(f"🎬 HR Concluding message generated: {conclusion}")
    return conclusion
