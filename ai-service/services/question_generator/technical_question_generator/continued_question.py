from services.context_store.redis_context_store import redis_context_store_manager
from services.question_generator.technical_question_generator.question_models import (
    generate_followup_question,
    generate_normal_question,
    generate_concluding_message,
)


def generate_continued_question(
    session_id: str, user_answer: str, api_key: str
) -> dict:
    """
    Orchestrates the interview flow:
      - Every 2 normal questions → ask a follow-up.
      - After 4 total questions → send a conclusion with interview_end=True.
      - If more than 4 questions → return empty text with interview_end=True.
    """

    session_data = redis_context_store_manager.get_session(session_id)
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
        # If exactly 4 questions → send concluding message and end interview
        if num_questions == 4:
            conclusion = generate_concluding_message(session_data, api_key=api_key)
            session_data["status"] = "completed"
            redis_context_store_manager.store_session(session_id, session_data)
            print("🟢 Interview concluded after 4 questions with concluding message.")
            return {"question": conclusion, "interview_end": True}
        else:
            # If more than 4 questions → return empty text and confirm interview ended
            print("🔴 Interview already completed, returning empty text.")
            return {"question": "", "interview_end": True}

    elif num_questions % 2 == 0 and num_questions > 0:
        # Every 2nd question → follow-up (interview continues)
        print("🔁 Generating follow-up question...")
        next_question = generate_followup_question(
            session_id, user_answer, api_key=api_key
        )

    else:
        # Otherwise → normal topic-changing question (interview continues)
        print("🧠 Generating new normal question...")
        next_question = generate_normal_question(session_data, api_key=api_key)
        question_history.append(next_question)
        session_data["question_history"] = question_history
        redis_context_store_manager.store_session(session_id, session_data)

    print(f"✅ Next question generated: {next_question}")
    return {"question": next_question, "interview_end": interview_end}
