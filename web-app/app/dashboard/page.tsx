"use client";

import { useState } from "react";
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

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleLaunch = async () => {
    if (!resumeFile || !jobDesc) {
      alert("Please upload a resume and enter the job description.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDesc", jobDesc);
      formData.append("type", selectedType || "");

      const arrayBuffer = await resumeFile.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const response = await getPdfContent(base64);
      alert(`Upload success! Extracted text length: ${response.length}`);
    } catch (err) {
      console.error(err);
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between p-4 border-b">
            <h1
              className={`text-xl font-bold transition-opacity duration-200 ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              Final Round AI
            </h1>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="p-4 space-y-3">
            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
              <Briefcase className="w-5 h-5" />
              {sidebarOpen && <span>Interview Copilot</span>}
            </div>
            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
              <User className="w-5 h-5" />
              {sidebarOpen && <span>Mock Interview</span>}
            </div>
            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
              <Rocket className="w-5 h-5" />
              {sidebarOpen && <span>Job Hunter</span>}
            </div>

            <div className="border-t my-3" />

            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
              <Download className="w-5 h-5" />
              {sidebarOpen && <span>Download for Mac/PC</span>}
            </div>

            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Settings</span>}
            </div>
          </nav>
        </div>

        <div className="p-4 border-t">
          <p className={`text-sm ${!sidebarOpen && "hidden"}`}>
            Rakesh Kanneeswaran
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-6 bg-white shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold">Interview Copilot</h2>
            <p className="text-gray-500 text-sm mt-1">
              Get real-time AI help during your interviews, completely invisible
              to interviewers.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition"
          >
            Start Interview with Copilot
          </button>
        </header>

        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-center gap-3">
            <p className="text-gray-700 font-medium">My Role is</p>
            <select className="border p-2 rounded-md">
              <option>Software Engineer</option>
              <option>Data Scientist</option>
              <option>Product Manager</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["General Interview", "Coding Copilot", "Phone Interview"].map(
              (type) => (
                <div
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer ${
                    selectedType === type
                      ? "bg-orange-50 border-orange-400"
                      : "bg-white"
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-2">{type}</h3>
                  <p className="text-sm text-gray-600">
                    {type === "General Interview"
                      ? "A reliable choice that works well in nearly all scenarios."
                      : type === "Coding Copilot"
                      ? "Reads your screen code and helps during live coding rounds."
                      : "Listens to your audio and suggests live answers on the fly."}
                  </p>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Start Your Next Interview
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Resume <span className="text-gray-400">(Upload PDF)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full border rounded-md p-2 text-sm"
                  onChange={(e) =>
                    setResumeFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Job Description
                </label>
                <textarea
                  className="w-full border rounded-md p-2 text-sm"
                  rows={4}
                  placeholder="Paste job description here..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Interview Type
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedType || "Select interview type above"}
                  className="w-full border rounded-md p-2 text-sm bg-gray-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLaunch}
                  disabled={uploading}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Launch"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
