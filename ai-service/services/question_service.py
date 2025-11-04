import dotenv

dotenv.load_dotenv()

from services.models.types import InterviewQuestionsOutput
from langchain_core.prompts import ChatPromptTemplate
from services.config import llm


promptTemplate = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Generate 5 verbal, conversational interview questions. "
            "Use only the information from the Resume and Job Description. ",
        ),
        (
            "human",
            "Resume: {resume}\n\nJob Description: {job_description}\n\nGenerate 5 interview questions.",
        ),
    ]
)


class QuestionService:
    @staticmethod
    def generate_interview_questions(
        resume: str, job_description: str
    ) -> InterviewQuestionsOutput:
        model_with_structure = llm.with_structured_output(InterviewQuestionsOutput)
        prompt = promptTemplate.invoke(
            {
                "resume": resume,
                "job_description": job_description,
            }
        )

        print(f"Prompt: {prompt}")
        response: InterviewQuestionsOutput = model_with_structure.invoke(prompt)
        question_list = response.questions
        questions = []
        for q in question_list:
            questions.append(f"{q.question}")

        return questions
