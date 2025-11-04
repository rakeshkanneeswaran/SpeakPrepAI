"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import platformColors from "@/app/utils/colors";
import AnalysisResult from "./components/AnalysisResult";
import { PhoneOff } from "lucide-react";
import { useParams } from "next/navigation";

export default function InterviewSession() {
  const router = useRouter();
  const { sessionId } = useParams();

  const questions = useMemo(
    () => [
      "Tell me about yourself.",
      "What are your strengths and weaknesses?",
    ],
    []
  );

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [shouldPlayQuestion, setShouldPlayQuestion] = useState(false);
  const [shouldRecordAnswer, setShouldRecordAnswer] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const saveInterviewAnalysis = async () => {
    if (!sessionId || !analysisResult) return;

    try {
      const response = await fetch("/api/interview/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewSessionId: sessionId,
          analysis: analysisResult,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to save analysis:", data.message);
        alert("Error: Unable to save analysis. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Save analysis error:", error);
      alert("Something went wrong while saving analysis.");
    }
  };

  const analyzeConversation = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);

      const conversationData = {
        conversation: questions.map((question, index) => [
          question,
          userAnswers[index] || "No answer recorded",
        ]),
      };

      const response = await fetch("/api/analyse-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversationData),
      });

      if (!response.ok)
        throw new Error(`Analysis failed: ${response.statusText}`);

      // ✨ Expect plain text
      const text = await response.text();
      setAnalysisResult(text);
    } catch (err) {
      console.error("[Analysis Error]", err);
      setAnalysisError(
        err instanceof Error ? err.message : "Failed to analyze conversation"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (
      isInterviewStarted &&
      currentQuestionIndex >= questions.length &&
      userAnswers.length > 0
    ) {
      analyzeConversation();
    }
  }, [
    isInterviewStarted,
    currentQuestionIndex,
    questions.length,
    userAnswers.length,
  ]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().then(resolve).catch(resolve);
            };
          }
        });
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera access denied:", err);
      setCameraError(
        `Camera error: ${
          err.message || "Please allow camera access to continue."
        }`
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraError(null);
  };

  const playQuestion = useCallback(async (questionText: string) => {
    try {
      setIsAudioPlaying(true);
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: questionText }),
      });

      if (!response.ok) throw new Error("Failed to fetch audio");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (audioElementRef.current) {
        audioElementRef.current.pause();
        URL.revokeObjectURL(audioElementRef.current.src);
      }

      const audio = new Audio(url);
      audioElementRef.current = audio;

      return new Promise<void>((resolve) => {
        audio.onended = async () => {
          URL.revokeObjectURL(url);
          setIsAudioPlaying(false);
          setShouldPlayQuestion(false);
          await wait(1000);
          setShouldRecordAnswer(true);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          setIsAudioPlaying(false);
          resolve();
        };
        audio.play().catch((e) => {
          console.error("Play error:", e);
          setIsAudioPlaying(false);
          resolve();
        });
      });
    } catch (err) {
      console.error("[Audio Error]", err);
      setIsAudioPlaying(false);
      setShouldRecordAnswer(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      const indexSnapshot = currentQuestionIndex;

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processAudio(audioBlob, indexSnapshot);
        setShouldRecordAnswer(false);
        setCurrentQuestionIndex((prev) => prev + 1);
        setShouldPlayQuestion(true);
      };

      recorder.start();
      setIsAudioRecording(true);
      recordingTimerRef.current = setTimeout(() => stopRecording(), 20000);
    } catch (err) {
      console.error("Mic access error:", err);
    }
  }, [currentQuestionIndex]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsAudioRecording(false);
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const processAudio = async (blob: Blob, index: number) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, "answer.webm");

      const res = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const text = data.data;
      setUserAnswers((prev) => {
        const updated = [...prev];
        updated[index] = text;
        return updated;
      });
    } catch (err) {
      console.error("[Transcription Error]", err);
    }
  };

  useEffect(() => {
    const active =
      isInterviewStarted && currentQuestionIndex < questions.length;
    if (active && shouldPlayQuestion)
      playQuestion(questions[currentQuestionIndex]);
    else if (active && shouldRecordAnswer) startRecording();
  }, [
    isInterviewStarted,
    currentQuestionIndex,
    shouldPlayQuestion,
    shouldRecordAnswer,
    playQuestion,
    startRecording,
    questions,
  ]);

  useEffect(() => {
    startCamera();
    return () => {
      stopRecording();
      stopCamera();
    };
  }, [stopRecording]);

  // Create accent colors using the available palette
  const getAccentColor = (
    type: "primary" | "success" | "warning" | "error" = "primary"
  ) => {
    // Using the border color as our primary accent since it's the darkest
    const baseColor = platformColors.borderColor;

    // For different states, we'll use different opacities or create variations
    switch (type) {
      case "success":
        return "#10b981"; // green - keeping for success states
      case "warning":
        return "#f59e0b"; // amber - keeping for warning states
      case "error":
        return "#ef4444"; // red - keeping for error states
      default:
        return baseColor; // Use border color as primary
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      {/* Header */}
      <header
        className="w-full flex items-center justify-between px-6 py-3 border-b shadow-sm"
        style={{
          backgroundColor: platformColors.outerMainBackground,
          borderColor: platformColors.borderColor,
        }}
      >
        {/* Left section: title and session info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-black tracking-tight">
            SpeakPrep AI
            <span className="text-orange-500 font-semibold">
              {" "}
              Mock Interview
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Session ID:{" "}
            <span className="font-mono text-gray-600">{sessionId || "—"}</span>
          </p>
        </div>

        {/* Right section: leave button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
          style={{
            borderColor: platformColors.borderColor,
          }}
        >
          <PhoneOff size={16} strokeWidth={2} />
          Leave
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Left panel: camera */}
        <div
          className="w-1/3 flex flex-col items-center justify-center border-r p-4 justify-between"
          style={{
            backgroundColor: platformColors.outerMainBackground,
            borderColor: platformColors.borderColor,
          }}
        >
          <div
            className="w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center border-2"
            style={{
              backgroundColor: platformColors.mainBackground,
              borderColor: platformColors.borderColor,
            }}
          >
            {cameraError ? (
              <div
                className="flex flex-col items-center justify-center text-center p-4"
                style={{ color: getAccentColor("error") }}
              >
                <p className="mb-2">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-md text-sm font-medium border transition-all"
                  style={{
                    borderColor: platformColors.borderColor,
                    color: platformColors.borderColor,
                    backgroundColor: platformColors.outerMainBackground,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      platformColors.borderColor;
                    e.currentTarget.style.color =
                      platformColors.outerMainBackground;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      platformColors.outerMainBackground;
                    e.currentTarget.style.color = platformColors.borderColor;
                  }}
                >
                  Retry Camera
                </button>
              </div>
            ) : cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <p
                  className="mb-2"
                  style={{ color: platformColors.borderColor }}
                >
                  Connecting to camera...
                </p>
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2"
                  style={{ borderColor: platformColors.borderColor }}
                ></div>
              </div>
            )}
          </div>
          <p
            className="mt-2 text-sm"
            style={{ color: platformColors.borderColor }}
          >
            {cameraError
              ? "Camera error"
              : cameraActive
              ? "Camera active"
              : "Connecting..."}
          </p>

          {/* Camera Controls */}
          <div className="flex gap-3 mt-4">
            {/* 🎥 Start Camera Button */}
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{
                backgroundColor: getAccentColor("success"),
                color: "#fff",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
              Start Camera
            </button>

            {/* 🛑 Stop Camera Button */}
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
              style={{
                backgroundColor: getAccentColor("error"),
                color: "#fff",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="5" width="13" height="14" rx="2" ry="2" />
                <path d="M17 10l4.553-2.276A1 1 0 0122 8.618v6.764a1 1 0 01-1.447.894L17 14" />
                <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" />
              </svg>
              Stop Camera
            </button>
          </div>
        </div>

        {/* Right panel: Interview content */}
        <div
          className="flex-1 p-8 flex flex-col items-center justify-center"
          style={{ backgroundColor: platformColors.mainBackground }}
        >
          {!isInterviewStarted ? (
            <div className="text-center">
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: "black" }}
              >
                Interview Session
              </h2>
              <p className="mb-4" style={{ color: "black" }}>
                Click below to start your interview. Each question will play
                automatically, and your answers will be recorded.
              </p>
              <button
                onClick={() => {
                  setIsInterviewStarted(true);
                  setShouldPlayQuestion(true);
                }}
                className="relative px-6 py-2 rounded-md font-medium border transition-all bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                style={{
                  borderColor: platformColors.borderColor,
                  boxShadow: "0 0 12px rgba(255, 165, 0, 0.5)",
                }}
              >
                <span className="relative z-10">Start Interview</span>

                {/* 🔸 Smooth glowing pulse animation */}
                <span className="absolute inset-0 rounded-md bg-orange-500 opacity-50 blur-md animate-pulse"></span>
              </button>
            </div>
          ) : currentQuestionIndex < questions.length ? (
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              {/* Question Header */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold text-black mb-1">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
                <p className="italic text-lg text-gray-900 leading-relaxed">
                  {questions[currentQuestionIndex]}
                </p>
              </div>

              {/* State Block (Playback / Recording / Preparing) */}
              <div className="flex flex-col items-center justify-center space-y-4 min-h-[150px]">
                {isAudioRecording ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {/* 🔴 Red recording dot */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className="absolute h-10 w-10 rounded-full animate-ping"
                        style={{
                          backgroundColor: getAccentColor("error"),
                          opacity: 0.3,
                        }}
                      ></div>
                      <div
                        className="h-5 w-5 rounded-full shadow-md"
                        style={{ backgroundColor: getAccentColor("error") }}
                      ></div>
                    </div>
                    <p className="text-lg font-semibold text-black">
                      Recording in progress...
                    </p>
                    <p className="text-sm italic text-gray-700">
                      Auto-stops in a few seconds
                    </p>
                  </div>
                ) : isAudioPlaying ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {/* 🔊 Equalizer animation */}
                    <div className="flex items-end justify-center gap-1 h-5">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className="w-1.5 bg-orange-500 rounded-sm animate-bounce"
                          style={{
                            height: `${6 + bar * 3}px`,
                            animationDelay: `${bar * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-lg font-semibold text-black">
                      Playing question...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {/* ⏳ Subtle spinner */}
                    <div className="h-6 w-6 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="text-lg font-semibold text-black">
                      Preparing next step...
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center w-full max-w-4xl">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
                    style={{ borderColor: platformColors.borderColor }}
                  ></div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: platformColors.borderColor }}
                  >
                    Analyzing Your Interview...
                  </h3>
                  <p style={{ color: platformColors.borderColor }}>
                    The AI evaluator is reviewing your answers.
                  </p>
                </div>
              ) : analysisError ? (
                <div className="text-center p-8">
                  <h3
                    className="font-semibold text-xl mb-2"
                    style={{ color: getAccentColor("error") }}
                  >
                    Analysis Error
                  </h3>
                  <p
                    className="mb-4"
                    style={{ color: platformColors.borderColor }}
                  >
                    {analysisError}
                  </p>
                  <button
                    onClick={analyzeConversation}
                    className="px-6 py-2 rounded-md font-medium border transition-all"
                    style={{
                      borderColor: platformColors.borderColor,
                      color: platformColors.borderColor,
                      backgroundColor: platformColors.outerMainBackground,
                    }}
                  >
                    Retry Analysis
                  </button>
                </div>
              ) : analysisResult ? (
                <div className="flex flex-col items-center space-y-6">
                  <AnalysisResult text={analysisResult} />

                  {/* ✅ Save & Return Button */}
                  <button
                    onClick={saveInterviewAnalysis}
                    className="mt-6 flex items-center gap-2 px-6 py-2 rounded-md text-white font-medium bg-orange-500 hover:bg-orange-600 shadow-md transition-all"
                  >
                    Save & Return to Dashboard
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div
        className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2"
        style={{
          borderColor: platformColors.borderColor,
        }}
      >
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: getAccentColor("success") }}
        />
        <span className="text-lg font-semibold">All services are online</span>
      </div>
    </div>
  );
}
