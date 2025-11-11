"use client";
import { useState, useRef, useCallback } from "react";

export const useAudio = () => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isAudioRecording, setIsAudioRecording] = useState(false);
    const [shouldPlayQuestion, setShouldPlayQuestion] = useState(false);
    const [shouldRecordAnswer, setShouldRecordAnswer] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    const audioElementRef = useRef<HTMLAudioElement | null>(null);

    const playQuestion = useCallback(async (
        questionText: string,
        interviewEnded: boolean,
        wait: (ms: number) => Promise<void>,
        setConcludingMessagePlayed: (value: boolean) => void,
        setShouldRecordAnswer: (value: boolean) => void
    ) => {
        try {
            setIsAudioPlaying(true);
            setAudioError(null);
            console.log("🔊 Starting audio playback for question");

            const response = await fetch("/api/generate-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: questionText }),
            });

            // Handle errors
            if (!response.ok) {
                let errorMessage = "Failed to fetch audio";

                try {
                    const errorData = await response.json();

                    // Handle rate limit error specifically
                    if (response.status === 429) {
                        errorMessage = "Text-to-speech rate limit reached. You can either:\n\n• Wait until tomorrow (limits reset daily)\n• Upgrade your plan at: https://console.groq.com/settings/billing\n\nFor now, please read the questions on screen.";
                        setAudioError(errorMessage);
                        console.log("🎯 TTS Rate limit detected, setting error state");

                        // CRITICAL FIX: Always set shouldPlayQuestion to false
                        setIsAudioPlaying(false);
                        setShouldPlayQuestion(false);

                        if (interviewEnded) {
                            setConcludingMessagePlayed(true);
                        } else {
                            await wait(1000);
                            setShouldRecordAnswer(true);
                        }
                        return;
                    }

                    errorMessage = errorData.error?.message || errorMessage;
                } catch (parseError) {
                    console.error("Failed to parse error response:", parseError);
                }

                setAudioError(errorMessage);

                // CRITICAL FIX: Always set shouldPlayQuestion to false on error
                setIsAudioPlaying(false);
                setShouldPlayQuestion(false);

                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audioElementRef.current) {
                audioElementRef.current.pause();
                URL.revokeObjectURL(audioElementRef.current.src);
            }

            const audio = new Audio(url);
            audioElementRef.current = audio;

            return new Promise<void>((resolve) => {
                let hasResolved = false; // Prevent multiple resolutions

                const cleanup = () => {
                    if (hasResolved) return;
                    hasResolved = true;

                    URL.revokeObjectURL(url);
                    setIsAudioPlaying(false);
                    setShouldPlayQuestion(false); // CRITICAL: Always set to false
                    console.log("🔊 Audio cleanup complete, shouldPlayQuestion set to false");
                };

                audio.onended = async () => {
                    console.log("🔊 Audio ended normally");
                    cleanup();

                    if (interviewEnded) {
                        setConcludingMessagePlayed(true);
                    } else {
                        await wait(1000);
                        setShouldRecordAnswer(true);
                    }
                    resolve();
                };

                audio.onerror = () => {
                    console.error("🔊 Audio element error");
                    cleanup();
                    setAudioError("Failed to play audio. Please check your audio settings.");
                    if (interviewEnded) {
                        setConcludingMessagePlayed(true);
                    }
                    resolve();
                };

                audio.play().catch((e) => {
                    console.error("🔊 Audio play error:", e);
                    cleanup();
                    setAudioError("Failed to play audio. Please check your audio settings.");
                    if (interviewEnded) {
                        setConcludingMessagePlayed(true);
                    }
                    resolve();
                });
            });
        } catch (err) {
            console.error("[Audio Error]", err);

            // CRITICAL FIX: Always clean up on any error
            setIsAudioPlaying(false);
            setShouldPlayQuestion(false);

            if ((err as Error).message.includes("rate limit")) {
                if (interviewEnded) {
                    setConcludingMessagePlayed(true);
                } else {
                    await wait(1000);
                    setShouldRecordAnswer(true);
                }
            } else {
                if (interviewEnded) {
                    setConcludingMessagePlayed(true);
                } else {
                    await wait(1000);
                    setShouldRecordAnswer(true);
                }
            }
        }
    }, []);

    const clearAudioError = useCallback(() => {
        setAudioError(null);
    }, []);

    return {
        isAudioPlaying,
        isAudioRecording,
        setIsAudioRecording,
        shouldPlayQuestion,
        setShouldPlayQuestion,
        shouldRecordAnswer,
        setShouldRecordAnswer,
        playQuestion,
        audioError,
        clearAudioError,
    };
};