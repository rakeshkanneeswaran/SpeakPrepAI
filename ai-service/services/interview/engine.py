from services.interview.decision_maker import DecisionMaker
from services.interview.evaluator import PromptBuilder
from services.interview.state_manager import StateManager


class InterviewEngine:
    def __init__(self, session_store, llm):
        self.store = session_store
        self.llm = llm

    def run(self, session_id, user_answer=None):

        state = self.store.get_session(session_id)
        if not state:
            raise ValueError(f"No session found for ID: {session_id}")

        # Save user answer
        if user_answer:
            state.setdefault("answers", []).append(user_answer)

        # Decide next step
        decision = DecisionMaker.decide(state, user_answer)

        # Build prompt
        prompt = PromptBuilder.build(state, decision)

        # Call LLM
        question = self.llm.generate(prompt)

        # Update state
        StateManager.update(state, question, decision)

        self.store.store_session(session_id, state)

        return {"question": question, "interview_end": decision["end"]}
