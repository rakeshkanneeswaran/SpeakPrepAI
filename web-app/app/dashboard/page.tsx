"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Settings,
  Download,
  Briefcase,
  Rocket,
} from "lucide-react";
import { getPdfContent } from "./action";
import { useInterviewStore } from "../store/useInterviewStore";
import { useRouter } from "next/navigation";
import platformColors from "../utils/colors";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  const { setInterviewData } = useInterviewStore();
  const router = useRouter();

  // 🧩 Past interviews state
  const [interviews, setInterviews] = useState<
    { sessionId: string; createdAt: string }[]
  >([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const res = await fetch("/api/dashboard/interviews", { method: "GET" });
        const data = await res.json();
        if (data.interviews) setInterviews(data.interviews);
      } catch (err) {
        console.error("Failed to load interviews:", err);
      } finally {
        setLoadingInterviews(false);
      }
    }
    fetchInterviews();
  }, []);

  const handleLaunch = async () => {
    if (!resumeFile || !jobDesc) {
      alert("Please upload a resume and enter the job description.");
      return;
    }

    setUploading(true);
    setLoadingStage("Scanning your resume...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const arrayBuffer = await resumeFile.arrayBuffer();
      setLoadingStage("Analyzing job description...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      setLoadingStage("Accessing the web for company insights...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const resumeData = await getPdfContent(base64);

      setLoadingStage("Generating final AI analysis...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          jobDescription: jobDesc,
        }),
      }).then((res) => res.json());

      setInterviewData(response.questions);
      const sessionId = response.interviewSessionId;
      setUploading(false);
      setLoadingStage(null);
      router.push(`/dashboard/interview/${sessionId}/introduction`);
    } catch (err) {
      console.error(err);
      alert("Failed to upload resume or generate questions.");
      setUploading(false);
    }
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
          <h1 className="text-2xl font-bold">SpeakPrep AI</h1>
          <p className="text-gray-500 text-sm mb-1">
            Get real interview experience, practice with mock sessions, and get
            AI help with company research.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition"
        >
          Start Interview
        </button>
      </header>

      {/* Body (Sidebar + Main Content) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } shadow-md transition-all duration-300 flex flex-col justify-between`}
          style={{
            backgroundColor: platformColors.outerMainBackground,
            borderRight: `1px solid ${platformColors.borderColor}`,
          }}
        >
          <div>
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: platformColors.borderColor }}
            >
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            <nav className="p-4 space-y-3">
              <SidebarItem
                icon={<Briefcase />}
                label="Interview Copilot"
                open={sidebarOpen}
              />
              <SidebarItem
                icon={<User />}
                label="Mock Interview"
                open={sidebarOpen}
              />
              <SidebarItem
                icon={<Rocket />}
                label="Job Hunter"
                open={sidebarOpen}
              />

              <div
                className="border-t my-3"
                style={{ borderColor: platformColors.borderColor }}
              />

              <SidebarItem
                icon={<Download />}
                label="Download for Mac/PC"
                open={sidebarOpen}
              />
              <SidebarItem
                icon={<Settings />}
                label="Settings"
                open={sidebarOpen}
              />
            </nav>
          </div>

          <div
            className="p-4 border-t"
            style={{ borderColor: platformColors.borderColor }}
          >
            <p className={`text-sm ${!sidebarOpen && "hidden"}`}>
              Rakesh Kanneeswaran
            </p>
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 flex flex-col">
          {/* Central Section */}
          <div className="flex-1 p-8 space-y-8 flex flex-col items-center">
            {/* Top prompt like Zapier */}
            <div className="text-center mb-6 w-full max-w-3xl">
              <h2 className="text-4xl font-semibold text-gray-800 mb-2">
                What would you like to do today?
              </h2>
              <p className="text-gray-500 text-sm">
                Choose an option below to start preparing, researching, or
                practicing with AI.
              </p>
            </div>

            {/* Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              {[
                {
                  title: "Technical Interview",
                  desc: "Sharpen your problem-solving and technical communication with tailored AI-guided practice.",
                },
                {
                  title: "HR Interview",
                  desc: "Practice behavioral and situational questions to improve clarity, confidence, and storytelling.",
                },
                {
                  title: "Company Insights",
                  desc: "Get AI-researched summaries about the company, role, and potential interview focus areas.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  onClick={() => setSelectedType(card.title)}
                  className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer text-left ${
                    selectedType === card.title
                      ? "bg-orange-50 border-orange-400"
                      : "bg-white"
                  }`}
                  style={{ borderColor: platformColors.borderColor }}
                >
                  <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Past Interviews */}
          <div
            className="p-8 border-t"
            style={{
              backgroundColor: platformColors.outerMainBackground,
              borderColor: platformColors.borderColor,
            }}
          >
            <h3 className="text-lg font-semibold mb-4">
              Your Past Interview Sessions
            </h3>

            {loadingInterviews ? (
              <p className="text-gray-500 text-sm">Loading interviews...</p>
            ) : interviews.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No interviews found. Start one to see it listed here.
              </p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {interviews.map((interview) => (
                  <div
                    key={interview.sessionId}
                    className="rounded-lg p-4 hover:shadow-sm transition cursor-pointer"
                    style={{
                      backgroundColor: platformColors.mainBackground,
                      border: `1px solid ${platformColors.borderColor}`,
                    }}
                    onClick={() =>
                      router.push(
                        `/dashboard/interview/${interview.sessionId}/introduction`
                      )
                    }
                  >
                    <h4 className="font-medium text-gray-800">Session ID:</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {interview.sessionId}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(interview.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      {uploading && loadingStage && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-[999] transition-all duration-500">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-800">{loadingStage}</p>
            <p className="text-sm text-gray-500 animate-pulse">
              Please wait while SpeakPrep AI prepares your interview data...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar item helper
function SidebarItem({
  icon,
  label,
  open,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  return (
    <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
      <div className="w-5 h-5">{icon}</div>
      {open && <span>{label}</span>}
    </div>
  );
}
