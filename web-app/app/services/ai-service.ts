import axios from "axios";

interface InterviewQuestionsResponse {
    questions: string[];
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

    static async analyzeConversation({ conversation }: { conversation: string[][] }): Promise<string> {


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
        try {
            const AI_BASE_URL = process.env.AI_BASE_URL;

            if (!AI_BASE_URL) {
                throw new Error("AI_BASE_URL environment variable is not set");
            }

            const response = await axios.post(`${AI_BASE_URL}/register-session`, {
                session_id: session_id,
                candidate_name: "Candidate",
                candidate_details: resumeData,
                job_description: jobDescription
            });

            console.log("Create interview session response:", response.data);

            // Check if the request was successful (status code 200)
            if (response.status == 200) {

                if (!response.data.session_id || response.data.session_id === "") {
                    throw new Error("AI service returned invalid response - no session_id");
                }
                else {
                    return { sessionId: response.data.session_id };
                }


            } else {
                throw new Error(`AI service returned status ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error in createInterviewSession AI call:", error);
            throw error;
        }
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