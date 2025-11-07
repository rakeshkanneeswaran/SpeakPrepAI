"use client";

import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import ErrorModal from "../components/ErrorModal";
import ResumeUploadModal from "../components/ResumeUploadModal";
import CompanyInsightsModal from "../components/CompanyInsightsModal";
import { getPdfContent } from "./action";
import { useRouter } from "next/navigation";
import platformColors from "../utils/colors";
import Link from "next/link";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLaunchInterview = async (
    resumeFile: File,
    jobDescription: string
  ) => {
    setUploading(true);
    setLoadingStage("Scanning your resume...");

    try {
      await new Promise((r) => setTimeout(r, 1000));

      const arrayBuffer = await resumeFile.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      setLoadingStage("Extracting resume details...");
      await new Promise((r) => setTimeout(r, 1000));
      const resumeData = await getPdfContent(base64);
      console.log("Resume Data:", resumeData);

      setLoadingStage("Generating AI interview questions...");
      await new Promise((r) => setTimeout(r, 1000));

      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          jobDescription,
          interviewType:
            selectedType === "Technical Interview"
              ? "technical"
              : selectedType === "HR Interview"
              ? "hr"
              : "mixed",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const responseData = await response.json();

      if (!responseData.interviewSessionId) {
        throw new Error("No interview session ID returned from server");
      }

      const interviewSessionId = responseData.interviewSessionId;

      setUploading(false);
      setLoadingStage(null);
      setShowResumeModal(false);

      router.push(`/dashboard/interview/${interviewSessionId}/session`);
    } catch (err) {
      console.error("Interview generation error:", err);
      setUploading(false);
      setLoadingStage(null);

      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to generate interview session. Please try again."
      );
      setShowErrorModal(true);
    }
  };

  const handleViewInsights = (companyName: string, companyWebsite: string) => {
    setShowCompanyModal(false);
    router.push(
      `/dashboard/company-insight?name=${encodeURIComponent(
        companyName
      )}&website=${encodeURIComponent(companyWebsite)}`
    );
  };

  const handleCardClick = (cardTitle: string) => {
    setSelectedType(cardTitle);
    if (cardTitle === "Company Insights") {
      setShowCompanyModal(true);
    } else {
      setShowResumeModal(true);
    }
  };

  const handleRetry = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div
      className="flex flex-col min-h-screen text-gray-800"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      {/* Header */}
      <header
        className="w-full flex justify-between items-center px-8 py-3 shadow-sm"
        style={{
          backgroundColor: platformColors.outerMainBackground,
          borderBottom: `1px solid ${platformColors.borderColor}`,
        }}
      >
        <div className="flex flex-col">
          <Link
            href="/"
            className="text-2xl font-bold"
            style={{
              color: "#000",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            SpeakPrep<span style={{ color: "#f43e02" }}>AI</span>
          </Link>
          <p className="text-gray-500 text-sm mb-1">
            Get real interview experience, practice mock sessions, and explore
            AI-powered insights.
          </p>
        </div>
        <button
          onClick={() => setShowResumeModal(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition"
        >
          Start Interview
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-8 space-y-8 flex flex-col items-center">
            <div className="text-center mb-6 w-full max-w-3xl">
              <h2 className="text-4xl font-semibold text-gray-800 mb-2">
                What would you like to do today?
              </h2>
              <p className="text-gray-500 text-sm">
                Choose how you want to prepare or research with SpeakPrep AI.
              </p>
            </div>

            {/* Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl">
              {[
                {
                  title: "Technical Interview",
                  desc: "Sharpen technical skills with AI-guided mock sessions.",
                },
                {
                  title: "HR Interview",
                  desc: "Improve clarity, confidence, and behavioral responses.",
                },
                {
                  title: "Technical + HR (Mixed)",
                  desc: "Practice both technical and HR-style questions together.",
                },
                {
                  title: "Company Insights",
                  desc: "Get AI-researched summaries about your target company.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  onClick={() => handleCardClick(card.title)}
                  className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer ${
                    selectedType === card.title
                      ? "bg-orange-50 border-orange-400"
                      : "bg-white"
                  }`}
                  style={{ borderColor: platformColors.borderColor }}
                >
                  <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ResumeUploadModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        onLaunch={handleLaunchInterview}
        selectedType={selectedType}
        uploading={uploading}
        loadingStage={loadingStage}
      />

      <CompanyInsightsModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onViewInsights={handleViewInsights}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        onRetry={handleRetry}
        message={errorMessage}
      />
    </div>
  );
}
