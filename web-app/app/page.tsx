"use client";
import { useState } from "react";
import axios from "axios";

// ---------- Type Definitions ----------
interface GenerateResponse {
  questions: string[];
}

export default function Home() {
  const [resume, setResume] = useState<string>("");
  const [jobDesc, setJobDesc] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ---------- Submit to Backend ----------
  const handleSubmit = async (): Promise<void> => {
    if (!resume || !jobDesc) {
      setError("Please paste your resume and job description.");
      return;
    }

    setError("");
    setLoading(true);
    setQuestions([]);

    try {
      const response = await axios.post<GenerateResponse>(
        "http://127.0.0.1:8000/generate-questions",
        { resume, job_description: jobDesc }
      );
      setQuestions(response.data.questions);
    } catch {
      setError("Failed to generate questions. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          AI Interview Question Generator 🎯
        </h1>

        {/* Resume Text */}
        <div>
          <label className="font-semibold text-gray-700">
            Paste Your Resume
          </label>
          <textarea
            className="w-full mt-2 border rounded-md p-3 text-sm"
            rows={6}
            placeholder="Paste your resume text here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="font-semibold text-gray-700">
            Paste Job Description
          </label>
          <textarea
            className="w-full mt-2 border rounded-md p-3 text-sm"
            rows={5}
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-md py-3 font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-center font-medium">{error}</p>
        )}

        {/* Generated Questions */}
        {questions.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Generated Questions:
            </h2>
            {questions.map((q, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-md">
                <p className="font-medium text-gray-800">
                  {index + 1}. {q}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
