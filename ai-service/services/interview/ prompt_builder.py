class PromptBuilder:
    @staticmethod
    def build(state, decision):
        prompt_type = decision["type"]

        if prompt_type == "start":
            return PromptBuilder.build_start_prompt(state)

        elif prompt_type == "followup":
            return PromptBuilder.build_followup_prompt(state)

        elif prompt_type == "new_topic":
            return PromptBuilder.build_new_topic_prompt(state)

        elif prompt_type == "end":
            return PromptBuilder.build_end_prompt(state)

        else:
            raise ValueError(f"Unknown prompt type: {prompt_type}")

    @staticmethod
    def build_start_prompt(state):
        candidate = state.get("candidate_name", "candidate")
        details = state.get("candidate_details", {})
        job_desc = state.get("job_description", "")

        skills = ", ".join(details.get("skills", []))
        experience = details.get("experience", "")

        return f"""
You are a senior backend engineer conducting a REAL interview.

STRICT RULES:
- Ask ONLY ONE question
- DO NOT explain anything
- DO NOT give multiple parts
- DO NOT use bullet points or numbering
- DO NOT say "Sure" or "Here’s a question"
- Keep it under 30 words

Candidate: {candidate}
Skills: {skills}
Experience: {experience}

Job Description:
{job_desc}

Ask the FIRST practical technical question based on their experience.
"""

    @staticmethod
    def build_followup_prompt(state):
        history = state.get("history", [])
        last_answer = state.get("answers", [])[-1] if state.get("answers") else ""

        return f"""
You are conducting a REAL technical interview.

Conversation:
{history}

Candidate answer:
{last_answer}

STRICT RULES:
- Ask ONLY ONE follow-up question
- DO NOT explain
- DO NOT list points
- Keep it under 30 words
- Focus on implementation or decisions

Ask naturally like a human interviewer.
"""

    @staticmethod
    def build_new_topic_prompt(state):
        history = state.get("history", [])
        job_desc = state.get("job_description", "")

        return f"""
You are a senior backend interviewer.

Conversation:
{history}

Job Description:
{job_desc}

STRICT RULES:
- Ask ONLY ONE question
- No explanations
- No lists
- Keep it under 30 words

Switch topic and ask a practical real-world question.
"""

    @staticmethod
    def build_end_prompt(state):
        candidate = state.get("candidate_name", "candidate")

        return f"""
End the interview.

Say:
"Thanks {candidate}, that's all from my side. You’ll now see your feedback."

Keep it short and natural.
"""
