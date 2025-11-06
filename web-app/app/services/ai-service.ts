import axios from "axios";

interface InterviewQuestionsResponse {
    questions: string[];
}

interface AIAnalysisResponse {
    technical_skills: { rating: string; explanation: string };
    communication: { rating: string; explanation: string };
    relevance: { rating: string; explanation: string };
    score_out_of_10: number;
    hiring_recommendation: string;
    summary_feedback: string;
}

interface RegisterSessionResponse {
    status: "success" | "error";
    message: string;
}

export default class AIService {

    static async getInterviewQuestions({ jobDescription, resumeData }: { jobDescription: string, resumeData: string }): Promise<InterviewQuestionsResponse> {
        try {
            const AI_BASE_URL = process.env.AI_BASE_URL
            const response = await axios.post(`${AI_BASE_URL}/generate-questions`, {
                job_description: jobDescription,
                resume: resumeData
            });
            const questions: string[] = response.data.questions;
            return { questions };
        } catch (error) {
            console.error("Error fetching interview questions:", error);
            throw error;
        }
    }

    static async analyzeConversation({ conversation }: { conversation: string[][] }): Promise<AIAnalysisResponse> {


        const AI_BASE_URL = process.env.AI_BASE_URL
        const response = await axios.post(`${AI_BASE_URL}/analyze-responses`, {
            conversation: conversation
        });
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
        console.error("Error analyzing conversation:", error);
        throw error;
    }

    static async createInterviewSession({
        jobDescription,
        resumeData,
        session_id
    }: {
        jobDescription: string,
        resumeData: string,
        session_id: string
    }): Promise<{ sessionId: string }> {
        const AI_BASE_URL = process.env.AI_BASE_URL;

        const response = await axios.post(`${AI_BASE_URL}/register-session`, {
            session_id: session_id,
            candidate_name: "Candidate", // You need to provide a candidate name
            candidate_details: resumeData, // Use resumeData as candidate_details
            job_description: jobDescription
        });

        // Fix the response check - axios uses status codes, not status property
        if (response.status !== 200) {
            throw new Error(`Failed to register session: ${response.statusText}`);
        }

        // Also check the response data structure
        if (response.data.status !== "success") {
            throw new Error(response.data.message || "Unknown error");
        }

        return { sessionId: session_id };
    }

    static async getFirstQuestion(sessionId: string): Promise<{ status: string; question: string; interview_end: boolean }> {
        const AI_BASE_URL = process.env.AI_BASE_URL;
        const response = await axios.post(`${AI_BASE_URL}/generate-first-question/${sessionId}`);
        const { status, question, interview_end } = response.data;
        console.log("First question response:", response.data);
        return { status, question, interview_end };
    }

    static async getContinuedQuestion(sessionId: string, userAnswer: string): Promise<{ status: string; question: string; interview_end: boolean }> {
        const AI_BASE_URL = process.env.AI_BASE_URL;
        const response = await axios.post(`${AI_BASE_URL}/generate-continued-question/${sessionId}`, {
            user_answer: userAnswer
        });

        const { status, question, interview_end } = response.data;
        return { status, question, interview_end };
    }
}