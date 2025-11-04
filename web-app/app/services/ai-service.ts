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
}
