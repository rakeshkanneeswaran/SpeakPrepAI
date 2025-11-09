"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import platformColors from "@/app/utils/colors";
import { ArrowLeft, Loader2, Trash2, CheckCircle, Home } from "lucide-react";

export default function InterviewAnalysisPage() {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [analysis, setAnalysis] = useState<string | null>(null);
  const [sessionDate, setSessionDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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

  // Handle interview deletion
  const handleDeleteInterview = async () => {
    try {
      setDeleting(true);
      const response = await fetch("/api/interview/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewSessionId: sessionId }),
      });

      if (response.ok) {
        setDeleteSuccess(true);
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(
          `Failed to delete session: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      alert("Failed to delete interview session. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

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
              onClick={() => router.push("/dashboard")}
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
            {!deleteSuccess && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                title="Delete this interview session"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                <span className="text-sm font-medium">Delete</span>
              </button>
            )}
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {deleteSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center mb-3"
                >
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-semibold text-green-800 mb-2"
                >
                  Interview Deleted Successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-green-600 mb-4"
                >
                  The interview session has been permanently deleted.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoToDashboard}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
                  >
                    <Home size={16} />
                    Go to Dashboard
                  </motion.button>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-green-500 mt-3"
                >
                  Redirecting automatically in 2 seconds...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Content */}
          {!deleteSuccess && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: deleteSuccess ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
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
                      <span className="font-mono text-gray-700">
                        {sessionId}
                      </span>
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl"
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-3"
                >
                  <Trash2 className="h-6 w-6 text-red-500" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-semibold text-gray-800 mb-2"
                >
                  Delete Interview Session?
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600"
                >
                  This action cannot be undone. All analysis data will be
                  permanently deleted.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteInterview}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition flex items-center gap-2"
                >
                  {deleting && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  )}
                  {deleting ? "Deleting..." : "Delete"}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
