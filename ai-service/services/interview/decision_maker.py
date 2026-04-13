class DecisionMaker:
    MAX_QUESTIONS = 5
    MAX_DEPTH = 2

    @staticmethod
    def decide(state, user_answer):

        q_count = state.get("question_count", 0)
        depth = state.get("depth", 0)

        # End interview
        if q_count >= DecisionMaker.MAX_QUESTIONS:
            return {"type": "end", "end": True}

        # First question
        if q_count == 0:
            return {"type": "start", "end": False}

        # Weak answer heuristic
        is_weak = len(user_answer.split()) < 10 if user_answer else False

        if is_weak or depth < DecisionMaker.MAX_DEPTH:
            return {"type": "followup", "end": False}

        return {"type": "new_topic", "end": False}
