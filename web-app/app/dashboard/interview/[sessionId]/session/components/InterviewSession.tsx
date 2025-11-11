"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import platformColors from "@/app/utils/colors";
import { useInterviewSession } from "./useInterviewSession";
import InterviewHeader from "../components/InterviewHeader";
import CameraPanel from "../components/CameraPanel";
import InterviewContent from "../components/InterviewContent";
import AnalysisView from "../components/AnalysisView";
import LoadingState from "./LoadingState";
import CompletedInterview from "./CompletedInterview";
import TTSErrorCard from "./TTSErrorCard";

export default function InterviewSession() {
  const router = useRouter();
  const {
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
    stopCountdownTimer,

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
  } = useInterviewSession();

  // Helper functions for styling
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

  const getTimerColor = () => {
    if (recordingTimeRemaining > 10) return getAccentColor("success");
    if (recordingTimeRemaining > 5) return getAccentColor("warning");
    return getAccentColor("error");
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

  // In your InterviewSession component
  useEffect(() => {
    if (!interviewCompleted) {
      console.log("📷 Starting camera...");
      startCamera();
    }
    return () => {
      console.log("🧹 Cleaning up interview session...");
      stopRecording();
      stopCamera(); // Ensure this is called
      stopCountdownTimer();
    };
  }, [
    interviewCompleted,
    startCamera,
    stopCamera,
    stopRecording,
    stopCountdownTimer,
  ]);

  // Show loading while checking status
  if (isCheckingStatus) {
    return <LoadingState />;
  }

  // Show completed interview message if interview is already completed
  if (interviewCompleted && !isInterviewStarted) {
    return (
      <CompletedInterview
        sessionId={sessionId}
        analysisResult={analysisResult}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      {audioError && (
        <TTSErrorCard
          error={audioError}
          onClose={clearAudioError}
          sessionId={sessionId}
        />
      )}
      {/* Header */}
      <InterviewHeader
        interviewTypeInfo={interviewTypeInfo}
        sessionId={sessionId}
        interviewCompleted={interviewCompleted}
      />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Left panel: camera */}
        <CameraPanel
          cameraError={cameraError}
          cameraActive={cameraActive}
          videoRef={videoRef}
          startCamera={startCamera}
          stopCamera={stopCamera}
          getAccentColor={getAccentColor}
        />

        {/* Right panel: Interview content */}
        <div
          className="flex-1 p-8 flex flex-col items-center justify-center"
          style={{ backgroundColor: platformColors.mainBackground }}
        >
          {!concludingMessagePlayed ? (
            <InterviewContent
              isInterviewStarted={isInterviewStarted}
              interviewTypeInfo={interviewTypeInfo}
              setIsInterviewStarted={setIsInterviewStarted}
              currentQuestion={currentQuestion}
              userAnswers={userAnswers}
              interviewEnded={interviewEnded}
              concludingMessagePlayed={concludingMessagePlayed}
              isAudioPlaying={isAudioPlaying}
              isAudioRecording={isAudioRecording}
              recordingTimeRemaining={recordingTimeRemaining}
              getTimerColor={getTimerColor}
              formatTime={formatTime}
              getAccentColor={getAccentColor}
            />
          ) : (
            <AnalysisView
              isAnalyzing={isAnalyzing}
              analysisError={analysisError}
              analysisResult={analysisResult}
              interviewType={interviewType}
              saveInterviewAnalysis={saveInterviewAnalysis}
              analyzeConversation={analyzeConversation}
              getAccentColor={getAccentColor}
              interviewTypeInfo={interviewTypeInfo}
            />
          )}
        </div>
      </div>

      {/* Online Status Indicator */}
      <div
        className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2"
        style={{ borderColor: platformColors.borderColor }}
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
