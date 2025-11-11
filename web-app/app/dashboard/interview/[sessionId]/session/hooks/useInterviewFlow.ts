"use client";
import { useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";

export const useInterviewFlow = () => {
    const { sessionId } = useParams();
    const searchParams = useSearchParams();
    const interviewType = searchParams.get("type") || "technical";

    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [interviewEnded, setInterviewEnded] = useState(false);
    const [sessionInitialized, setSessionInitialized] = useState(false);
    const [concludingMessagePlayed, setConcludingMessagePlayed] = useState(false);

    const getInterviewTypeInfo = useCallback(() => {
        switch (interviewType) {
            case "technical":
                return {
                    name: "Technical Interview",
                    icon: "",
                    color: "#3b82f6",
                    description: "Technical Skills Assessment",
                };
            case "hr":
                return {
                    name: "HR Interview",
                    icon: "",
                    color: "#10b981",
                    description: "Behavioral & Soft Skills",
                };
            case "mixed":
                return {
                    name: "Mixed Interview",
                    icon: "",
                    color: "#f59e0b",
                    description: "Technical + HR Combined",
                };
            default:
                return {
                    name: "Technical Interview",
                    icon: "",
                    color: "#3b82f6",
                    description: "Technical Skills Assessment",
                };
        }
    }, [interviewType]);

    const interviewTypeInfo = getInterviewTypeInfo();

    // FIX: Update wait function return type
    const wait = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

    return {
        sessionId: sessionId as string | string[] | undefined,
        interviewType,
        isInterviewStarted,
        setIsInterviewStarted,
        currentQuestion,
        setCurrentQuestion,
        userAnswers,
        setUserAnswers,
        interviewEnded,
        setInterviewEnded,
        sessionInitialized,
        setSessionInitialized,
        concludingMessagePlayed,
        setConcludingMessagePlayed,
        interviewTypeInfo,
        wait,
    };
};