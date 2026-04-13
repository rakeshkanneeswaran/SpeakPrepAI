"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import ErrorModal from "../components/ErrorModal";
import ResumeUploadModal from "../components/ResumeUploadModal";
import CompanyInsightsModal from "../components/CompanyInsightsModal";
import { getPdfContent } from "./action";
import { useRouter } from "next/navigation";
import platformColors from "../utils/colors";
import Link from "next/link";
import Image from "next/image";

type UserProfile = { name?: string; image?: string } | null;

type InterviewCard = {
  title: "Technical Interview" | "HR Interview" | "Company Insights";
  desc: string;
  image: string;
  available: boolean;
};

const INTERVIEW_CARDS: InterviewCard[] = [
  {
    title: "Technical Interview",
    desc: "Sharpen technical skills with AI-guided mock sessions.",
    image: "/images/technical-interview.png",
    available: true,
  },
  {
    title: "HR Interview",
    desc: "Improve clarity, confidence, and behavioral responses.",
    image: "/images/hr-interview.png",
    available: true,
  },
  {
    title: "Company Insights",
    desc: "Get AI-researched summaries about your target company.",
    image: "/images/company-insights.png",
    available: false,
  },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fileToBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  return btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    ),
  );
};

export default function Dashboard() {
  // Layout and modal UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(
    "Technical Interview",
  );
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // Async flow and error state
  const [uploading, setUploading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // User profile and credit state
  const [user, setUser] = useState<UserProfile>(null);
  const [credits, setCredits] = useState<number | null>(null);

  const router = useRouter();

  // Map UI card titles to API interview type values
  const getInterviewType = (cardTitle: string): string => {
    switch (cardTitle) {
      case "Technical Interview":
        return "technical";
      case "HR Interview":
        return "hr";
      case "Technical + HR (Mixed)":
        return "mixed";
      default:
        return "technical";
    }
  };

  // Load the signed-in user details for header/profile and credit display.
  async function loadUser() {
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.name, image: data.image });
        setCredits(data.credits ?? 0);
      }
    } catch (err) {
      console.error("User load failed:", err);
    }
  }

  useEffect(() => {
    void loadUser();
  }, []);

  const handleLaunchInterview = async (
    resumeFile: File,
    jobDescription: string,
  ) => {
    setUploading(true);
    setLoadingStage("Scanning your resume...");

    try {
      await wait(1000);

      const base64 = await fileToBase64(resumeFile);

      setLoadingStage("Extracting resume details...");
      await wait(1000);
      const resumeData = await getPdfContent(base64);

      setLoadingStage("Generating AI interview questions...");
      await wait(1000);

      const interviewType = getInterviewType(
        selectedType || "Technical Interview",
      );

      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          jobDescription,
          interviewType: interviewType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`,
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

      // Preserve selected interview type in URL for the session route.
      router.push(
        `/dashboard/interview/${interviewSessionId}/session?type=${interviewType}`,
      );
    } catch (err) {
      console.error("Interview generation error:", err);
      setUploading(false);
      setLoadingStage(null);

      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to generate interview session. Please try again.",
      );
      setShowErrorModal(true);
    }
  };

  const handleViewInsights = (companyName: string, companyWebsite: string) => {
    setShowCompanyModal(false);
    router.push(
      `/dashboard/company-insight?name=${encodeURIComponent(
        companyName,
      )}&website=${encodeURIComponent(companyWebsite)}`,
    );
  };

  const handleCardClick = (cardTitle: string) => {
    setSelectedType(cardTitle);
    if (cardTitle === "Company Insights") {
      // Don't open modal since it's coming soon
      return;
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Credits display */}
            <div className="px-3 py-1 rounded-lg bg-gray-100 text-sm font-medium">
              Available Credits: {credits ?? "..."}
            </div>

            {/* Start button */}
            <button
              onClick={() => credits && credits > 0 && setShowResumeModal(true)}
              disabled={!credits || credits <= 0}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                credits && credits > 0
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Start Interview
            </button>

            {/* No-credits CTA */}
            {credits === 0 && (
              <Link
                href="/pricing"
                className="text-sm text-red-500 underline"
              >
                Buy Credits
              </Link>
            )}
          </div>

          {/* User avatar */}
          {user && (
            <Link href="/settings">
              <Image
                src={user.image || "/default-avatar.png"}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full border cursor-pointer object-cover hover:opacity-80"
              />
            </Link>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-8 space-y-8 flex flex-col items-center justify-center">
            <div className="text-center mb-8 w-full max-w-4xl">
              <h3 className="text-3xl font-semibold text-gray-800 mb-3">
                {user?.name ? `Hello ${user.name.split(" ")[0]}` : "Welcome"},
                What would you like to do today?
              </h3>

              <p className="text-gray-500 text-lg">
                Choose how you want to prepare or research with SpeakPrep AI.
              </p>
            </div>

            {/* Interview option cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
              {INTERVIEW_CARDS.map((card) => (
                <div
                  key={card.title}
                  onClick={() => card.available && handleCardClick(card.title)}
                  className={`border-2 rounded-2xl p-8 shadow-sm transition-all duration-300 min-h-[380px] flex flex-col justify-between relative ${
                    card.available
                      ? "cursor-pointer transform hover:scale-105 hover:shadow-xl"
                      : "cursor-not-allowed"
                  } ${
                    selectedType === card.title && card.available
                      ? "bg-[#f6f6f4] border-orange-400 shadow-md"
                      : "bg-[#f6f6f4] border-gray-200 hover:border-orange-300"
                  }`}
                  style={{
                    borderColor:
                      selectedType === card.title && card.available
                        ? platformColors.borderColor
                        : platformColors.borderColor,
                  }}
                >
                  {/* Coming soon overlay for disabled cards */}
                  {!card.available && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-2">
                          Coming Soon
                        </div>
                        <p className="text-gray-700 font-medium">
                          Feature in development
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <h3 className="font-bold text-xl mb-4 text-center text-gray-800">
                      {card.title}
                    </h3>
                    <p className="text-base text-gray-600 text-center leading-relaxed mb-6">
                      {card.desc}
                    </p>

                    <div className="w-full h-40 mb-4 flex items-center justify-center rounded-xl p-4">
                      <Image
                        src={card.image}
                        alt={card.title}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <span className="text-orange-500 font-semibold text-sm">
                      Get Started →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional call-to-action section */}
            <div className="text-center mt-8 max-w-2xl">
              <p className="text-gray-500 text-sm">
                Select any option above to get started with your interview
                preparation journey.
              </p>
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
