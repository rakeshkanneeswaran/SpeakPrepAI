from services.context_store.redis_context_store import redis_context_store_manager
from services.question_generator.hr_question_generator.question_models import (
    generate_hr_followup_question,
    generate_normal_hr_question,
    generate_hr_concluding_message,
)


def generate_continued_hr_question(session_id: str, user_answer: str) -> dict:
    """
    Orchestrates the HR interview flow with behavioral focus.
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

    # HR interview logic - can adjust timing as needed
    if num_questions >= 4:  # HR interviews might be slightly shorter
        conclusion = generate_hr_concluding_message(session_data)
        session_data["status"] = "completed"
        session_data["interview_type"] = "hr"
        redis_context_store_manager.store_session(session_id, session_data)
        print("🟢 HR Interview concluded after 4 questions.")
        return {"question": conclusion, "interview_end": True}

    elif num_questions % 2 == 0 and num_questions > 0:
        # Every 2nd question → HR follow-up
        print("🔁 Generating HR follow-up question...")
        next_question = generate_hr_followup_question(session_id, user_answer)

    else:
        # Otherwise → new HR behavioral question
        print("🧠 Generating new HR behavioral question...")
        next_question = generate_normal_hr_question(session_data)
        question_history.append(next_question)
        session_data["question_history"] = question_history
        session_data["interview_type"] = "hr"
        redis_context_store_manager.store_session(session_id, session_data)

    print(f"✅ Next HR question generated: {next_question}")
    return {"question": next_question, "interview_end": interview_end}
