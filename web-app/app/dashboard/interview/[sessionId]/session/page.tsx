"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import platformColors from "@/app/utils/colors";
import AnalysisResult from "./components/AnalysisResult";
import { PhoneOff } from "lucide-react";
import { useParams } from "next/navigation";

export default function InterviewSession() {
  const router = useRouter();
  const { sessionId } = useParams();
  const searchParams = useSearchParams();

  // Get interview type from URL parameters
  const interviewType = searchParams.get("type") || "technical";

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [shouldPlayQuestion, setShouldPlayQuestion] = useState(false);
  const [shouldRecordAnswer, setShouldRecordAnswer] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [concludingMessagePlayed, setConcludingMessagePlayed] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Check interview status on component mount
  const checkInterviewStatus = useCallback(async () => {
    if (!sessionId) return;

    try {
      setIsCheckingStatus(true);
      const response = await fetch("/api/interview/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewSessionId: sessionId }),
      });

      console.log("Interview status response:", response);

      if (!response.ok) throw new Error("Failed to check interview status");

      const data = await response.json();

      console.log("Interview status data:", data);

      if (data.interviewActive.interviewOpen === false) {
        setInterviewCompleted(true);
        // If interview is already completed, we can fetch the analysis directly
        await fetchExistingAnalysis();
      }
    } catch (error) {
      console.error("Failed to check interview status:", error);
      // If there's an error checking status, we'll still allow the interview to proceed
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
        if (data.analysis) {
          setAnalysisResult(data.analysis);
        }
      }
    } catch (error) {
      console.error("Failed to fetch existing analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get interview type display info
  const getInterviewTypeInfo = () => {
    switch (interviewType) {
      case "technical":
        return {
          name: "Technical Interview",
          icon: "🧠",
          color: "#3b82f6", // Blue
          description: "Technical Skills Assessment",
        };
      case "hr":
        return {
          name: "HR Interview",
          icon: "💼",
          color: "#10b981", // Green
          description: "Behavioral & Soft Skills",
        };
      case "mixed":
        return {
          name: "Mixed Interview",
          icon: "🎯",
          color: "#f59e0b", // Amber
          description: "Technical + HR Combined",
        };
      default:
        return {
          name: "Technical Interview",
          icon: "🧠",
          color: "#3b82f6",
          description: "Technical Skills Assessment",
        };
    }
  };

  const interviewTypeInfo = getInterviewTypeInfo();

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const initializeInterview = async () => {
    try {
      // Choose the correct endpoint based on interview type
      const endpoint =
        interviewType === "hr"
          ? "/api/interview/question/generate-first-hr-question"
          : "/api/interview/question/generate-first-question";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewSessionId: sessionId }),
      });

      if (!response.ok) throw new Error("Failed to initialize interview");

      const data = await response.json();

      console.log("First question data:", data);

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

  // Get next question after user answers
  const getNextQuestion = async (userAnswer: string) => {
    try {
      // Choose the correct endpoint based on interview type
      const endpoint =
        interviewType === "hr"
          ? "/api/interview/question/generate-continued-hr-question"
          : "/api/interview/question/generate-continued-question";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_answer: userAnswer,
          interviewSessionId: sessionId,
        }),
      });

      if (!response.ok) throw new Error("Failed to get next question");

      const data = await response.json();

      if (data.status === "success") {
        if (data.interview_end) {
          // Set interview as ended but don't trigger analysis yet
          setInterviewEnded(true);
          setCurrentQuestion(data.question); // This is the concluding message
          setShouldPlayQuestion(true); // Play the concluding message
        } else {
          setCurrentQuestion(data.question);
          setShouldPlayQuestion(true);
        }
      }
    } catch (error) {
      console.error("Failed to get next question:", error);
      setAnalysisError("Failed to get next question. Please try again.");
    }
  };

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

      // Create conversation history from questions and answers
      const conversationData = {
        conversation: userAnswers.map((answer, index) => [
          `Question ${index + 1}`,
          answer || "No answer recorded",
        ]),
      };

      const data = {
        conversation: conversationData.conversation,
        sessionId,
        interviewType, // Pass interview type for context-aware analysis
      };

      const response = await fetch("/api/analyse-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error(`Analysis failed: ${response.statusText}`);

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

  // Handle analysis only after concluding message is played
  useEffect(() => {
    if (concludingMessagePlayed && userAnswers.length > 0) {
      analyzeConversation();
    }
  }, [concludingMessagePlayed, userAnswers.length]);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const playQuestion = useCallback(
    async (questionText: string) => {
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

            // If this was a concluding message, mark it as played
            if (interviewEnded) {
              setConcludingMessagePlayed(true);
            } else {
              await wait(1000);
              setShouldRecordAnswer(true);
            }
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            setIsAudioPlaying(false);
            // Even if audio fails, if it's a concluding message, mark it as played
            if (interviewEnded) {
              setConcludingMessagePlayed(true);
            }
            resolve();
          };
          audio.play().catch((e) => {
            console.error("Play error:", e);
            setIsAudioPlaying(false);
            // Even if audio fails, if it's a concluding message, mark it as played
            if (interviewEnded) {
              setConcludingMessagePlayed(true);
            }
            resolve();
          });
        });
      } catch (err) {
        console.error("[Audio Error]", err);
        setIsAudioPlaying(false);
        setShouldRecordAnswer(false);
        // Even if audio fails, if it's a concluding message, mark it as played
        if (interviewEnded) {
          setConcludingMessagePlayed(true);
        }
      }
    },
    [interviewEnded]
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processAudio(audioBlob);
        setShouldRecordAnswer(false);
      };

      recorder.start();
      setIsAudioRecording(true);
      recordingTimerRef.current = setTimeout(() => stopRecording(), 20000);
    } catch (err) {
      console.error("Mic access error:", err);
    }
  }, []);

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

  const processAudio = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, "answer.webm");

      const res = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const answerText = data.data;

      // Save answer and get next question
      setUserAnswers((prev) => [...prev, answerText]);
      await getNextQuestion(answerText);
    } catch (err) {
      console.error("[Transcription Error]", err);
    }
  };

  // Handle question playback when shouldPlayQuestion changes
  useEffect(() => {
    if (shouldPlayQuestion && currentQuestion) {
      playQuestion(currentQuestion);
    }
  }, [shouldPlayQuestion, currentQuestion, playQuestion]);

  // Handle recording when shouldRecordAnswer changes
  useEffect(() => {
    if (shouldRecordAnswer && !interviewEnded) {
      startRecording();
    }
  }, [shouldRecordAnswer, interviewEnded, startRecording]);

  // Initialize interview when started
  useEffect(() => {
    if (isInterviewStarted && !sessionInitialized && !interviewCompleted) {
      initializeInterview();
    }
  }, [
    isInterviewStarted,
    sessionInitialized,
    interviewType,
    interviewCompleted,
  ]);

  // Check interview status on component mount
  useEffect(() => {
    checkInterviewStatus();
  }, [checkInterviewStatus]);

  // Camera setup
  useEffect(() => {
    if (!interviewCompleted) {
      startCamera();
    }
    return () => {
      stopRecording();
      stopCamera();
    };
  }, [stopRecording, interviewCompleted]);

  const getAccentColor = (
    type: "primary" | "success" | "warning" | "error" = "primary"
  ) => {
    const baseColor = platformColors.borderColor;
    switch (type) {
      case "success":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return baseColor;
    }
  };

  // Show loading while checking status
  if (isCheckingStatus) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: platformColors.mainBackground }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: platformColors.borderColor }}
          ></div>
          <h2 className="text-xl font-semibold text-black mb-2">
            Checking Interview Status...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your interview session.
          </p>
        </div>
      </div>
    );
  }

  // Show completed interview message if interview is already completed
  if (interviewCompleted && !isInterviewStarted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: platformColors.mainBackground }}
      >
        <div className="text-center max-w-md p-8 rounded-lg border shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">
            Interview Already Completed
          </h2>
          <p className="text-gray-600 mb-6">
            This interview session has already been completed. You can view the
            analysis results on your dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Go to Dashboard
            </button>
            {analysisResult && (
              <button
                onClick={() => setIsInterviewStarted(true)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                View Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-4">
          {/* Interview Type Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full border font-medium"
            style={{
              backgroundColor: `${interviewTypeInfo.color}15`,
              borderColor: interviewTypeInfo.color,
              color: interviewTypeInfo.color,
            }}
          >
            <span className="text-lg">{interviewTypeInfo.icon}</span>
            <span className="text-sm font-semibold">
              {interviewTypeInfo.name}
            </span>
          </div>

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
              <span className="font-mono text-gray-600">
                {sessionId || "—"}
              </span>
              {" • "}
              <span className="text-gray-600">
                {interviewTypeInfo.description}
              </span>
              {interviewCompleted && (
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  Completed
                </span>
              )}
            </p>
          </div>
        </div>

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

      {/* Rest of your component remains the same */}
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
                {interviewTypeInfo.name}
              </h2>
              <p className="mb-4" style={{ color: "black" }}>
                Click below to start your {interviewTypeInfo.name.toLowerCase()}
                . Each question will play automatically, and your answers will
                be recorded.
              </p>
              <button
                onClick={() => {
                  setIsInterviewStarted(true);
                }}
                className="relative px-6 py-2 rounded-md font-medium border transition-all bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                style={{
                  borderColor: platformColors.borderColor,
                  boxShadow: "0 0 12px rgba(255, 165, 0, 0.5)",
                }}
              >
                <span className="relative z-10">Start Interview</span>
                <span className="absolute inset-0 rounded-md bg-orange-500 opacity-50 blur-md animate-pulse"></span>
              </button>
            </div>
          ) : !concludingMessagePlayed ? (
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              {/* Question Header */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold text-black mb-1">
                  {interviewEnded
                    ? "Interview Complete"
                    : `Question ${userAnswers.length + 1}`}
                </h3>
                <p className="italic text-lg text-gray-900 leading-relaxed">
                  {currentQuestion}
                </p>
              </div>

              {/* State Block (Playback / Recording / Preparing) */}
              <div className="flex flex-col items-center justify-center space-y-4 min-h-[150px]">
                {isAudioRecording ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
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
                      {interviewEnded
                        ? "Playing concluding message..."
                        : "Playing question..."}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="h-6 w-6 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="text-lg font-semibold text-black">
                      {interviewEnded
                        ? "Preparing final message..."
                        : "Preparing next step..."}
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
                    The AI evaluator is reviewing your{" "}
                    {interviewType === "technical"
                      ? "technical"
                      : interviewType === "hr"
                      ? "behavioral"
                      : "technical and behavioral"}{" "}
                    answers.
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

                  <button
                    onClick={saveInterviewAnalysis}
                    className="mt-6 flex items-center gap-2 px-6 py-2 rounded-md text-white font-medium bg-orange-500 hover:bg-orange-600 shadow-md transition-all"
                  >
                    Return to Dashboard
                  </button>
                </div>
              ) : (
                <div className="text-center p-8">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    Interview Completed
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Thank you for completing the{" "}
                    {interviewTypeInfo.name.toLowerCase()}!
                  </p>
                  <p className="text-sm text-gray-500">
                    Your analysis is being prepared...
                  </p>
                </div>
              )}
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
