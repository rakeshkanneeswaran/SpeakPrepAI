"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useInterviewFlow } from "../hooks/useInterviewFlow";
import { useCamera } from "../hooks/useCamera";
import { useAudio } from "../hooks/useAudio";

export const useInterviewSession = () => {
    const {
        sessionId,
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
    } = useInterviewFlow();

    const {
        cameraError,
        cameraActive,
        videoRef,
        startCamera,
        stopCamera,
    } = useCamera();

    const {
        isAudioPlaying,
        isAudioRecording,
        setIsAudioRecording,
        shouldPlayQuestion,
        setShouldPlayQuestion,
        shouldRecordAnswer,
        setShouldRecordAnswer,
        playQuestion,
        audioError, // Add this
        clearAudioError, // Add this
    } = useAudio();

    // Additional state
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);
    const [interviewCompleted, setInterviewCompleted] = useState(false);
    const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);

    // Timer state
    const [recordingTimeRemaining, setRecordingTimeRemaining] = useState(0);
    const [maxRecordingTime, setMaxRecordingTime] = useState(20);
    const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Timer functions
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }, []);

    const stopCountdownTimer = useCallback(() => {
        console.log("🕒 Stopping countdown timer");
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        setRecordingTimeRemaining(0);
    }, []);

    // MOVE processAudio HERE - BEFORE startRecording
    const processAudio = async (blob: Blob) => {
        try {
            console.log("🔊 Processing audio...");
            const formData = new FormData();
            formData.append("file", blob, "answer.webm");

            const res = await fetch("/api/transcribe-audio", { method: "POST", body: formData });
            const data = await res.json();
            const answerText = data.data;

            // Save answer and get next question
            setUserAnswers((prev) => [...prev, answerText]);
            await getNextQuestion(answerText);
        } catch (err) {
            console.error("[Transcription Error]", err);
        }
    };

    const stopRecording = useCallback(() => {
        console.log("🎤 Stopping recording manually");
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsAudioRecording(false);
        }
        if (recordingTimerRef.current) {
            clearTimeout(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
        stopCountdownTimer();
    }, [stopCountdownTimer, setIsAudioRecording]);

    const startCountdownTimer = useCallback(() => {
        // Clear any existing timer first
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }

        console.log("🕒 Starting countdown timer with", maxRecordingTime, "seconds");
        setRecordingTimeRemaining(maxRecordingTime);

        countdownTimerRef.current = setInterval(() => {
            setRecordingTimeRemaining((prev) => {
                if (prev <= 1) {
                    console.log("🕒 Timer finished");
                    if (countdownTimerRef.current) {
                        clearInterval(countdownTimerRef.current);
                        countdownTimerRef.current = null;
                    }
                    // Stop recording when timer reaches 0
                    stopRecording();
                    return 0;
                }
                console.log("🕒 Timer tick:", prev - 1);
                return prev - 1;
            });
        }, 1000);
    }, [maxRecordingTime, stopRecording]);

    const startRecording = useCallback(async () => {
        // Prevent multiple recordings
        if (isRecordingInProgress) {
            console.log("🎤 Recording already in progress, skipping...");
            return;
        }

        try {
            console.log("🎤 Starting recording...");
            setIsRecordingInProgress(true); // Set flag immediately

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];

            recorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                console.log("🎤 Recording stopped");
                stream.getTracks().forEach((t) => t.stop());
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/webm",
                });
                await processAudio(audioBlob);
                setShouldRecordAnswer(false);
                setIsRecordingInProgress(false); // Reset flag
                stopCountdownTimer();
            };

            recorder.start();
            setIsAudioRecording(true);

            // Start the countdown timer
            startCountdownTimer();

            // Safety timeout - stop recording after max time
            recordingTimerRef.current = setTimeout(() => {
                console.log("⏰ Recording timeout reached");
                stopRecording();
            }, maxRecordingTime * 1000);

        } catch (err) {
            console.error("🎤 Mic access error:", err);
            setIsRecordingInProgress(false); // Reset flag on error
            stopCountdownTimer();
        }
    }, [startCountdownTimer, stopCountdownTimer, processAudio, maxRecordingTime, setIsAudioRecording, stopRecording, isRecordingInProgress]); // Add isRecordingInProgress to dependencies

    // API functions
    const checkInterviewStatus = useCallback(async () => {
        if (!sessionId) return;
        try {
            setIsCheckingStatus(true);
            const response = await fetch("/api/interview/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ interviewSessionId: sessionId }),
            });

            if (!response.ok) throw new Error("Failed to check interview status");
            const data = await response.json();

            if (data.interviewActive.interviewOpen === false) {
                setInterviewCompleted(true);
                await fetchExistingAnalysis();
            }
        } catch (error) {
            console.error("Failed to check interview status:", error);
        } finally {
            setIsCheckingStatus(false);
        }
    }, [sessionId]);

    const fetchExistingAnalysis = async () => {
        try {
            setIsAnalyzing(true);
            const response = await fetch("/api/interview/get-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ interviewSessionId: sessionId }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.analysis) setAnalysisResult(data.analysis);
            }
        } catch (error) {
            console.error("Failed to fetch existing analysis:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const initializeInterview = async () => {
        try {
            const endpoint = interviewType === "hr"
                ? "/api/interview/question/generate-first-hr-question"
                : "/api/interview/question/generate-first-question";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ interviewSessionId: sessionId }),
            });

            if (!response.ok) throw new Error("Failed to initialize interview");
            const data = await response.json();

            if (data.status === "success") {
                setCurrentQuestion(data.question);
                setSessionInitialized(true);
                setShouldPlayQuestion(true);
            }
        } catch (error) {
            console.error("Failed to initialize interview:", error);
            setAnalysisError("Failed to start interview. Please try again.");
        }
    };

    const getNextQuestion = async (userAnswer: string) => {
        try {
            const endpoint = interviewType === "hr"
                ? "/api/interview/question/generate-continued-hr-question"
                : "/api/interview/question/generate-continued-question";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_answer: userAnswer, interviewSessionId: sessionId }),
            });

            if (!response.ok) throw new Error("Failed to get next question");
            const data = await response.json();

            if (data.status === "success") {
                if (data.interview_end) {
                    // 🎯 INTERVIEW ENDED - Set states to prevent recording
                    setInterviewEnded(true);
                    setCurrentQuestion(data.question);
                    setShouldPlayQuestion(true);

                    // 🚫 CRITICAL: Prevent recording after concluding message
                    setShouldRecordAnswer(false);
                } else {
                    // Interview continues
                    setCurrentQuestion(data.question);
                    setShouldPlayQuestion(true);
                }
            }
        } catch (error) {
            console.error("Failed to get next question:", error);
            setAnalysisError("Failed to get next question. Please try again.");
        }
    };

    const analyzeConversation = async () => {
        try {
            setIsAnalyzing(true);
            setAnalysisError(null);

            const data = {
                conversation: userAnswers.map((answer, index) => [
                    `Question ${index + 1}`,
                    answer || "No answer recorded",
                ]),
                sessionId,
                interviewType,
            };

            const response = await fetch("/api/analyse-conversation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error(`Analysis failed: ${response.statusText}`);
            const text = await response.text();
            setAnalysisResult(text);
        } catch (err) {
            console.error("[Analysis Error]", err);
            setAnalysisError(err instanceof Error ? err.message : "Failed to analyze conversation");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Effects
    // In your useInterviewSession.ts, update the audio effect:
    // In the useEffect that plays audio:
    useEffect(() => {
        if (shouldPlayQuestion && currentQuestion) {
            console.log("🔊 Playing question:", currentQuestion.substring(0, 50) + "...");

            const playAudio = async () => {
                await playQuestion(
                    currentQuestion,
                    interviewEnded,
                    wait,
                    setConcludingMessagePlayed,
                    setShouldRecordAnswer,
                    setInterviewEnded // 🆕 Pass this to terminate interview on rate limit
                );
            };

            playAudio();
        }
    }, [shouldPlayQuestion, currentQuestion, playQuestion, interviewEnded, wait, setConcludingMessagePlayed, setShouldRecordAnswer, setInterviewEnded]);

    useEffect(() => {
        if (shouldRecordAnswer && !interviewEnded && !isRecordingInProgress && !concludingMessagePlayed) {
            console.log("🎤 Should record answer triggered");
            startRecording();
        }
    }, [shouldRecordAnswer, interviewEnded, startRecording, isRecordingInProgress, concludingMessagePlayed]);

    useEffect(() => {
        if (isInterviewStarted && !sessionInitialized && !interviewCompleted) {
            console.log("🚀 Initializing interview...");
            initializeInterview();
        }
    }, [isInterviewStarted, sessionInitialized, interviewCompleted, interviewType, sessionId]);

    useEffect(() => {
        checkInterviewStatus();
    }, [checkInterviewStatus]);

    useEffect(() => {
        if (!interviewCompleted) {
            console.log("📷 Starting camera...");
            startCamera();
        }
        return () => {
            console.log("🧹 Cleaning up interview session...");
            stopRecording();
            stopCamera();
            stopCountdownTimer();
        };
    }, [interviewCompleted, startCamera, stopCamera, stopRecording, stopCountdownTimer]);

    useEffect(() => {
        if (concludingMessagePlayed && userAnswers.length > 0) {
            console.log("📊 Analyzing conversation...");
            analyzeConversation();
        }
    }, [concludingMessagePlayed, userAnswers.length]);

    return {
        // State
        sessionId,
        interviewType,
        isInterviewStarted,
        setIsInterviewStarted,
        currentQuestion,
        userAnswers,
        interviewEnded,
        concludingMessagePlayed,
        isAudioPlaying,
        isAudioRecording,
        cameraError,
        cameraActive,
        analysisResult,
        isAnalyzing,
        analysisError,
        isCheckingStatus,
        interviewCompleted,
        recordingTimeRemaining,
        interviewTypeInfo,
        audioError,
        clearAudioError,

        // Refs
        videoRef,

        // Functions
        startCamera,
        stopCamera,
        formatTime,
        getNextQuestion,
        analyzeConversation,
        stopRecording,
        processAudio,
        stopCountdownTimer, // ADD THIS
    };
};