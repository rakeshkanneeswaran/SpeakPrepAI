class StateManager:
    @staticmethod
    def update(state, question, decision):

        state.setdefault("history", []).append(question)
        state["question_count"] = state.get("question_count", 0) + 1

        if decision["type"] == "followup":
            state["depth"] = state.get("depth", 0) + 1
        else:
            state["depth"] = 0
