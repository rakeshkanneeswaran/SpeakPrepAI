"use client";

import { useState, useEffect } from "react";
import { Menu, X, Settings, LogOut, HelpCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import platformColors from "../utils/colors";


export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [interviews, setInterviews] = useState<
    { sessionId: string; createdAt: string }[]
  >([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const handleLogout = async () => {
  try {
    setLoggingOut(true);

    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    router.push("/login");
    router.refresh();
  } catch (err) {
    console.error("Logout error:", err);
    setLoggingOut(false);
  }
};
  // ✅ Fetch past interviews
  useEffect(() => {
    async function fetchInterviews() {
      try {
        const res = await fetch("/api/dashboard/interviews");
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

  // ✅ Handle interview deletion
  const handleDeleteInterview = async (sessionId: string) => {
    try {
      setDeletingSession(sessionId);
      const response = await fetch("/api/interview/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewSessionId: sessionId }),
      });

      if (response.ok) {
        // Remove from local state
        setInterviews((prev) =>
          prev.filter((interview) => interview.sessionId !== sessionId)
        );
        setShowDeleteConfirm(null);
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
      setDeletingSession(null);
    }
  };

  // ✅ Navigate to analysis page
  const handleViewAnalysis = (sessionId: string) => {
    router.push(`/dashboard/interview/${sessionId}/analysis`);
  };

  // ✅ Navigate to settings page
  const handleSettingsClick = () => {
    router.push("/dashboard/settings");
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } shadow-md transition-all duration-300 flex flex-col`}
      style={{
        backgroundColor: platformColors.outerMainBackground,
        borderRight: `1px solid ${platformColors.borderColor}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderColor: platformColors.borderColor }}
      >
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-3 flex-1 overflow-y-auto">
        {/* Recent Sessions */}
        <div>
          {sidebarOpen && (
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
              Recent Sessions
            </h3>
          )}
          {loadingInterviews ? (
            <p className="text-xs text-gray-400 italic">
              {sidebarOpen && "Loading..."}
            </p>
          ) : interviews.length === 0 ? (
            <p className="text-xs text-gray-400 italic">
              {sidebarOpen && "No sessions yet"}
            </p>
          ) : (
            <div className="space-y-1">
              {interviews.slice(0, 8).map((interview) => (
                <div
                  key={interview.sessionId}
                  className="group flex items-center justify-between hover:bg-gray-100 rounded-md transition"
                >
                  <button
                    onClick={() => handleViewAnalysis(interview.sessionId)}
                    className="flex-1 text-left px-2 py-1 rounded-md text-sm text-gray-700 truncate"
                    title={interview.sessionId}
                  >
                    {sidebarOpen
                      ? `Session ${interview.sessionId.slice(-5)}`
                      : "•"}
                  </button>

                  {sidebarOpen && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(interview.sessionId);
                        }}
                        disabled={deletingSession === interview.sessionId}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete session"
                      >
                        {deletingSession === interview.sessionId ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Delete Interview Session?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. The interview analysis will be
                permanently deleted.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteInterview(showDeleteConfirm)}
                  disabled={deletingSession === showDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition"
                >
                  {deletingSession === showDeleteConfirm
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div
        className="p-4 border-t"
        style={{ borderColor: platformColors.borderColor }}
      >
        {sidebarOpen && (
          <>
            {/* ✅ FAQs Link */}
            <button
              onClick={() => router.push("/faqs")}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition mb-3"
            >
              <HelpCircle size={16} />
              FAQs
            </button>

            {/* ✅ Settings Link - Updated to use the handler */}
            <button
              onClick={handleSettingsClick}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition mb-3 w-full"
            >
              <Settings size={16} />
              Settings
            </button>

            {/* Logout - Use the SAFE version */}
            <button
              onClick={handleLogout} // Use the safe version that waits for API
              disabled={loggingOut}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition mt-3 w-full"
            >
              <LogOut size={16} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
