import dotenv
from services.core.llm_client import llm

dotenv.load_dotenv()


class AnalysisService:
    """
    Service: Analyze an interview transcript (Q&A pairs) and provide
    short, structured, human-readable feedback written directly to the candidate.
    """

    @staticmethod
    def analyze_conversation_history(conversation: list[tuple[str, str]]) -> str:
        """
        conversation: list of (ai_question, human_answer)

        Returns:
            A concise, plain-text feedback report written in the second person ("you").
        """

        # 🧩 Build readable conversation context
        qa_context = "\n".join(
            [
                f"Q: {q}\nA: {a if a.strip() else '(No answer given)'}\n"
                for q, a in conversation
            ]
        )

        # 🧠 Interview analysis prompt
        prompt = f"""
You are an experienced interview coach providing direct, personal feedback
to a candidate after an interview. You are supportive but honest, and you
speak in second person ("you") to make the feedback feel individualized.

Below is the transcript of the interview between an AI interviewer and the candidate:

{qa_context}

Write a clear, professional **Interview Feedback Report** addressed directly to the candidate.
Follow this exact structure:

1. Overall Impression:
   - Briefly summarize how you performed overall — tone, confidence, and clarity.

2. Technical Skills:
   - Comment on how well you demonstrated technical accuracy, reasoning, and examples.

3. Communication and Soft Skills:
   - Reflect on your ability to express ideas clearly and stay structured.

4. Relevance to the Role:
   - Mention how well your answers matched what the role expects.

5. Suggestions for Improvement:
   - Offer 2–3 actionable points for improvement.

6. Final Recommendation:
   - Use one of these phrases: “Strong Yes”, “Yes”, “Maybe”, or “No”.
   - End with a short sentence of advice or encouragement.

Rules:
- Address the candidate directly ("you").
- Use short, professional bullet points (`-`) under each heading.
- Keep the tone constructive and encouraging, not robotic.
- Output plain text only (no Markdown, JSON, or XML).
- Keep the total response under 150 words.
"""

        try:
            # 🔹 Invoke LLM
            response = llm.invoke(prompt)

            # 🧹 Extract text safely
            if hasattr(response, "content"):
                response_text = response.content
            else:
                response_text = str(response)

            response_text = response_text.strip()

            # 🧽 Remove extra wrapping quotes if needed
            if response_text.startswith('"') and response_text.endswith('"'):
                response_text = response_text[1:-1].strip()

            return response_text

        except Exception as e:
            return f"[Error] Failed to analyze interview conversation: {str(e)}"
