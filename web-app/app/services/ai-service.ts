import axios from "axios";

interface InterviewQuestionsResponse {
    questions: string[];
}

import { UserService } from "./user-service";

export default class AIService {

    static async getInterviewQuestions({ jobDescription, resumeData, userId }: { jobDescription: string, resumeData: string, userId: string }): Promise<InterviewQuestionsResponse> {
        try {
            // Fetch user settings to get API key
            const userSettings = await UserService.getUserSettings(userId);

            if (!userSettings || !userSettings.apiKey) {
                throw new Error("User API key not found");
            }
            const AI_BASE_URL = process.env.AI_BASE_URL
            const response = await axios.post(`${AI_BASE_URL}/generate-questions`, {
                job_description: jobDescription,
                resume: resumeData
            }, {
                headers: {
                    'Authorization': `Bearer ${userSettings.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            const questions: string[] = response.data.questions;
            return { questions };
        } catch (error) {
            console.error("Error fetching interview questions:", error);
            throw error;
        }
    }

    static async analyzeConversation({ conversation, userId }: { conversation: string[][], userId: string }): Promise<string> {
        try {
            const userSettings = await UserService.getUserSettings(userId);

            if (!userSettings || !userSettings.apiKey) {
                throw new Error("User API key not found");
            }
            const AI_BASE_URL = process.env.AI_BASE_URL
            const response = await axios.post(`${AI_BASE_URL}/analyze-responses`, {
                conversation: conversation
            }, {
                headers: {
                    'Authorization': `Bearer ${userSettings.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error analyzing conversation:", error);
            throw error;
        }
    }

    static async createInterviewSession({
        jobDescription,
        resumeData,
        session_id,
        userId
    }: {
        jobDescription: string,
        resumeData: string,
        session_id: string,
        userId: string
    }): Promise<{ sessionId: string }> {
        try {
            const userSettings = await UserService.getUserSettings(userId);

            if (!userSettings || !userSettings.apiKey) {
                throw new Error("User API key not found");
            }
            const AI_BASE_URL = process.env.AI_BASE_URL;

            if (!AI_BASE_URL) {
                throw new Error("AI_BASE_URL environment variable is not set");
            }

            const response = await axios.post(`${AI_BASE_URL}/register-session`, {
                session_id: session_id,
                candidate_name: "Candidate",
                candidate_details: resumeData,
                job_description: jobDescription
            }, {
                headers: {
                    'Authorization': `Bearer ${userSettings.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Create interview session response:", response.data);

            if (response.status == 200) {
                if (!response.data.session_id || response.data.session_id === "") {
                    throw new Error("AI service returned invalid response - no session_id");
                } else {
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

    static async getFirstQuestion(sessionId: string, userId: string): Promise<{ status: string; question: string; interview_end: boolean }> {
        const userSettings = await UserService.getUserSettings(userId);
        const AI_BASE_URL = process.env.AI_BASE_URL;

        const response = await axios.post(`${AI_BASE_URL}/generate-first-question/${sessionId}`, {}, {
            headers: {
                'Authorization': `Bearer ${userSettings.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const { status, question, interview_end } = response.data;
        console.log("First question response:", response.data);
        return { status, question, interview_end };
    }

    static async getContinuedQuestion(sessionId: string, userAnswer: string, userId: string): Promise<{ status: string; question: string; interview_end: boolean }> {
        const userSettings = await UserService.getUserSettings(userId);
        const AI_BASE_URL = process.env.AI_BASE_URL;

        const response = await axios.post(`${AI_BASE_URL}/generate-continued-question/${sessionId}`, {
            user_answer: userAnswer
        }, {
            headers: {
                'Authorization': `Bearer ${userSettings.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const { status, question, interview_end } = response.data;
        return { status, question, interview_end };
    }

    static async getFirstHRQuestion(sessionId: string, userId: string): Promise<{ status: string; question: string; interview_end: boolean }> {
        const userSettings = await UserService.getUserSettings(userId);
        const AI_BASE_URL = process.env.AI_BASE_URL;

        const response = await axios.post(`${AI_BASE_URL}/generate-first-hr-question/${sessionId}`, {}, {
            headers: {
                'Authorization': `Bearer ${userSettings.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const { status, question, interview_end } = response.data;
        console.log("First HR question response:", response.data);
        return { status, question, interview_end };
    }

    static async getContinuedHRQuestion(sessionId: string, userAnswer: string, userId: string): Promise<{ status: string; question: string; interview_end: boolean }> {
        const userSettings = await UserService.getUserSettings(userId);
        const AI_BASE_URL = process.env.AI_BASE_URL;

        const response = await axios.post(`${AI_BASE_URL}/generate-continued-hr-question/${sessionId}`, {
            user_answer: userAnswer
        }, {
            headers: {
                'Authorization': `Bearer ${userSettings.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const { status, question, interview_end } = response.data;
        console.log("Continued HR question response:", response.data);
        return { status, question, interview_end };
    }
}