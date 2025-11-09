import dotenv
from services.core.llm_client import generate_llm_from_api_key

dotenv.load_dotenv()


class AnalysisService:
    """
    Service: Analyze an interview transcript (Q&A pairs) and provide short,
    structured, human-readable feedback written directly to the candidate.
    """

    @staticmethod
    def analyze_conversation_history(
        conversation: list[tuple[str, str]],
        api_key: str,
        candidate_name: str = "Candidate",
    ) -> str:
        """
        conversation: list of (ai_question, human_answer)
        candidate_name: Name of the candidate for personalized greeting
        Returns: A concise, plain-text feedback report written in the second person ("you").
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
You are an experienced interview coach providing direct, personal feedback to a candidate after an interview. 
You are supportive but honest, and you speak in second person ("you") to make the feedback feel individualized.

Below is the transcript of the interview between an AI interviewer and the candidate:
{qa_context}

Write a clear, professional **Interview Feedback Report** addressed directly to the candidate.

Follow this exact structure:

Dear {candidate_name},

1. Overall Impression:
- Focus on what you did well in terms of tone, confidence, and clarity.
- Mention specific positive aspects of your performance.

2. Technical Skills:
- Highlight the technical knowledge and examples you provided effectively.
- Note areas where you demonstrated strong reasoning and expertise.

3. Communication and Soft Skills:
- Emphasize your strengths in expressing ideas and structured communication.
- Mention specific instances where your communication was effective.

4. Relevance to the Role:
- Describe how your answers aligned well with role requirements.
- Note the relevant experience and skills you demonstrated.

5. Areas for Growth:
- Provide 2–3 constructive, actionable suggestions for improvement.
- Frame these as opportunities for development rather than weaknesses.
- Be specific about what they can work on.

6. Final Recommendation:
- Use one of these phrases: "Strong Yes", "Yes", "Maybe", or "No".
- End with an encouraging sentence that acknowledges their strengths.

Rules:
- Always address the candidate as "you" and use "Dear {candidate_name}" at the start.
- Keep each section focused on either strengths OR areas for improvement - don't mix them.
- Under "Areas for Growth", only mention improvement opportunities - no positive comments.
- In sections 1-4, focus exclusively on what they did well and their strengths.
- Use short, professional bullet points (-) under each heading.
- Keep the tone constructive, encouraging, and professional.
- Output plain text only (no Markdown, JSON, or XML).
- Keep the total response under 150 words.
- Base all feedback specifically on what was said in the conversation above.
"""

        try:
            llm = generate_llm_from_api_key(api_key=api_key)
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
