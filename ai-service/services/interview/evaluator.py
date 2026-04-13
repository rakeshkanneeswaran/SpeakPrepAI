class PromptBuilder:
    @staticmethod
    def build(state, decision):

        history = state.get("history", [])
        candidate = state.get("candidate")

        if decision["type"] == "start":
            return f"""
You are a senior backend engineer interviewing {candidate}.

Ask a real technical question based on:
- microservices
- PostgreSQL
- backend systems

Make it practical and realistic.
"""

        if decision["type"] == "followup":
            return f"""
Conversation:
{history}

Ask a follow-up question based on the last answer.
Focus on depth, not theory.
"""

        if decision["type"] == "new_topic":
            return f"""
Conversation:
{history}

Switch to a new backend topic:
- system design
- scaling
- database

Ask one clear practical question.
"""

        if decision["type"] == "end":
            return f"""
End the interview professionally.
Mention feedback will be shown.
"""
