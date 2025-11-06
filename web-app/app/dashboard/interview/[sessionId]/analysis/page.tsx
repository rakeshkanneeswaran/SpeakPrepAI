"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import platformColors from "@/app/utils/colors";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function InterviewAnalysisPage() {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [analysis, setAnalysis] = useState<string | null>(null);
  const [sessionDate, setSessionDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!sessionId) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/interview/get-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interviewSessionId: sessionId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load analysis");

        setAnalysis(data.analysis || "No analysis available.");
        // Format the date when setting it
        if (data.createdAt) {
          setSessionDate(formatDate(data.createdAt));
        } else {
          // Fallback to current date if no date from API
          setSessionDate(formatDate(new Date().toISOString()));
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Analysis fetch error:", err);
        setError(err.message || "Unable to fetch analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [sessionId]);

  return (
    <div
      className="flex flex-col min-h-screen text-gray-800"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      {/* Header - Original top navigation bar */}
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
            Get real interview experience, practice mock sessions, and explore
            AI-powered insights.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition"
        >
          New Interview
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-4xl">
          {/* Page Header */}
          <div className="flex items-center justify-between w-full mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <h1
              className="text-2xl font-bold text-center flex-1"
              style={{ color: "black" }}
            >
              Interview Analysis
            </h1>
            <div className="w-8" /> {/* spacer */}
          </div>

          {/* Analysis Content */}
          <div
            className="w-full rounded-xl shadow-sm p-6 border"
            style={{
              backgroundColor: platformColors.outerMainBackground,
              borderColor: platformColors.borderColor,
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="animate-spin mb-3" size={28} />
                <p className="text-sm">
                  Fetching your AI interview analysis...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">
                <p className="font-medium">{error}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Unique Interview ID:{" "}
                  <span className="font-mono text-gray-700">{sessionId}</span>
                </p>
                {sessionDate && (
                  <p className="text-sm text-gray-500 mb-8">
                    You took this interview on{" "}
                    <span className="text-gray-700 font-medium">
                      {sessionDate}
                    </span>
                    .
                  </p>
                )}

                <div
                  className="rounded-lg prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed tracking-wide p-6"
                  dangerouslySetInnerHTML={{
                    __html:
                      analysis
                        ?.trim()
                        .replace(/^["']|["']$/g, "") // remove leading/trailing quotes
                        .replace(/\\"/g, '"') // fix escaped quotes
                        .replace(/\\n/g, "<br/>") // handle escaped newlines
                        .replace(/\n/g, "<br/>") // normal newlines
                        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // markdown bold
                        .replace(/<strong>/g, "<b>")
                        .replace(/<\/strong>/g, "</b>") ||
                      "<p>No analysis available.</p>",
                  }}
                ></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
