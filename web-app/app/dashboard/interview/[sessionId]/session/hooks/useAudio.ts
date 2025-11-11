"use client";
import { useState, useRef, useCallback } from "react";

export const useAudio = () => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isAudioRecording, setIsAudioRecording] = useState(false);
    const [shouldPlayQuestion, setShouldPlayQuestion] = useState(false);
    const [shouldRecordAnswer, setShouldRecordAnswer] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const isPlayingRef = useRef(false);

    const playQuestion = useCallback(async (
        questionText: string,
        interviewEnded: boolean,
        wait: (ms: number) => Promise<void>,
        setConcludingMessagePlayed: (value: boolean) => void,
        setShouldRecordAnswer: (value: boolean) => void,
        setInterviewEnded: (value: boolean) => void // 🆕 Need this to terminate interview
    ) => {
        if (isPlayingRef.current) {
            console.log("🔊 Audio already playing, skipping...");
            return;
        }

        try {
            isPlayingRef.current = true;
            setIsAudioPlaying(true);
            setAudioError(null);
            console.log("🔊 Starting audio playback for:", questionText.substring(0, 50) + "...");

            const response = await fetch("/api/generate-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: questionText }),
            });

            // 🎯 HANDLE TTS RATE LIMIT - TERMINATE INTERVIEW
            if (!response.ok) {
                let errorMessage = "Failed to fetch audio";
                let isRateLimitError = false;

                try {
                    const errorData = await response.json();

                    // Handle rate limit error specifically
                    if (response.status === 429) {
                        errorMessage = "Text-to-speech rate limit reached. You can either:\n\n• Wait until tomorrow (limits reset daily)\n• Upgrade your plan at: https://console.groq.com/settings/billing\n\nFor now, please read the questions on screen.";
                        isRateLimitError = true;
                        setAudioError(errorMessage); // 🎯 This triggers the TTSErrorCard
                        console.log("🎯 TTS Rate limit detected - SHOWING ERROR CARD");

                        // 🚨 TERMINATE THE INTERVIEW IMMEDIATELY
                        setInterviewEnded(true);
                        setConcludingMessagePlayed(false); // Don't show analysis
                        setShouldRecordAnswer(false);
                    } else {
                        // For other errors, just log but don't show error card
                        errorMessage = errorData.error?.message || errorMessage;
                        console.warn("🔊 Audio fetch failed (non-rate-limit):", errorMessage);
                    }
                } catch (parseError) {
                    console.error("Failed to parse error response:", parseError);
                }

                // Clean up
                setIsAudioPlaying(false);
                setShouldPlayQuestion(false);
                isPlayingRef.current = false;

                // 🎯 If rate limit, STOP everything - don't proceed
                if (isRateLimitError) {
                    return; // Interview is terminated, error card will show
                }

                // For non-rate-limit errors, continue silently
                if (interviewEnded) {
                    setConcludingMessagePlayed(true);
                } else {
                    await wait(1000);
                    setShouldRecordAnswer(true);
                }
                return;
            }

            // Success case - process audio normally
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Clean up previous audio if exists
            if (audioElementRef.current) {
                audioElementRef.current.pause();
                URL.revokeObjectURL(audioElementRef.current.src);
                audioElementRef.current = null;
            }

            const audio = new Audio(url);
            audioElementRef.current = audio;

            // Wait for audio to be ready
            await new Promise<void>((resolve, reject) => {
                audio.oncanplaythrough = () => resolve();
                audio.onerror = () => reject(new Error("Audio loading failed"));
                setTimeout(resolve, 500);
            });

            // Play audio
            await audio.play();

            return new Promise<void>((resolve) => {
                let hasResolved = false;

                const cleanup = () => {
                    if (hasResolved) return;
                    hasResolved = true;

                    console.log("🔊 Audio cleanup");
                    if (audioElementRef.current === audio) {
                        audioElementRef.current = null;
                    }
                    URL.revokeObjectURL(url);
                    setIsAudioPlaying(false);
                    setShouldPlayQuestion(false);
                    isPlayingRef.current = false;
                };

                audio.onended = async () => {
                    console.log("🔊 Audio ended normally");
                    cleanup();

                    if (interviewEnded) {
                        console.log("🎯 Concluding message played, moving to analysis");
                        setConcludingMessagePlayed(true);
                        setShouldRecordAnswer(false);
                    } else {
                        await wait(1000);
                        setShouldRecordAnswer(true);
                    }
                    resolve();
                };

                audio.onerror = (e) => {
                    console.error("🔊 Audio element error:", e);
                    cleanup();
                    console.warn("Audio playback failed, continuing with text display");
                    if (interviewEnded) {
                        setConcludingMessagePlayed(true);
                    } else {
                        setShouldRecordAnswer(true);
                    }
                    resolve();
                };

                audio.onpause = () => {
                    if (!audio.ended && !hasResolved) {
                        console.log("🔊 Audio was paused unexpectedly");
                    }
                };
            });
        } catch (err) {
            console.error("[Audio Error]", err);

            // Clean up on error
            setIsAudioPlaying(false);
            setShouldPlayQuestion(false);
            isPlayingRef.current = false;

            // Only handle rate limit errors specifically in the UI
            if ((err as Error).message.includes("rate limit")) {
                // Rate limit error already handled above
            } else {
                // For other errors, just log and continue silently
                console.warn("🔊 Non-critical audio error:", err);
            }

            // Always continue the interview flow for non-rate-limit errors
            if (interviewEnded) {
                setConcludingMessagePlayed(true);
            } else {
                await wait(1000);
                setShouldRecordAnswer(true);
            }
        }
    }, []);

    const clearAudioError = useCallback(() => {
        setAudioError(null);
    }, []);

    const cleanupAudio = useCallback(() => {
        if (audioElementRef.current) {
            audioElementRef.current.pause();
            if (audioElementRef.current.src) {
                URL.revokeObjectURL(audioElementRef.current.src);
            }
            audioElementRef.current = null;
        }
        isPlayingRef.current = false;
        setIsAudioPlaying(false);
        setShouldPlayQuestion(false);
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
        cleanupAudio,
    };
};