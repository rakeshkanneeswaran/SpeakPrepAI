"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState<
    "apiKey" | "profession" | "role" | "experience" | "privacy"
  >("apiKey");
  const [apiKey, setApiKey] = useState("");
  const [profession, setProfession] = useState<
    "professional" | "student" | "enterprise" | "hiring-manager" | null
  >(null);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState<
    "0-2" | "2-5" | "5-10" | "10+" | null
  >(null);
  const [age, setAge] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  function goBack() {
    if (step === "profession") {
      setStep("apiKey");
    } else if (step === "role") {
      setStep("profession");
    } else if (step === "experience") {
      setStep("role");
    } else if (step === "privacy") {
      setStep("experience");
    }
  }

  function nextStep() {
    setError("");

    if (step === "apiKey") {
      if (!apiKey.trim()) {
        setError("Please enter your Groq API key");
        return;
      }
      setStep("profession");
    } else if (step === "profession") {
      if (!profession) {
        setError("Please select your profession");
        return;
      }
      setStep("role");
    } else if (step === "role") {
      if (!role.trim()) {
        setError("Please enter your role");
        return;
      }
      setStep("experience");
    } else if (step === "experience") {
      if (!experience) {
        setError("Please select your experience level");
        return;
      }
      if (
        !age.trim() ||
        isNaN(Number(age)) ||
        Number(age) < 16 ||
        Number(age) > 100
      ) {
        setError("Please enter a valid age between 16 and 100");
        return;
      }
      setStep("privacy");
    }
  }

  async function handleSubmit() {
    setError("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey,
            profession,
            role,
            experience,
            age: Number(age),
            agreedToTerms,
          }),
        });

        if (res.ok) {
          router.push("/dashboard");
        } else {
          const data = await res.json();
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-[#f43e02]">
          {step === "privacy"
            ? "Privacy & Terms"
            : "Let's personalize your experience"}
        </h2>

        <AnimatePresence mode="wait">
          {step === "apiKey" && (
            <motion.div
              key="apiKey"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="space-y-6"
            >
              <p className="text-gray-500 text-center mb-2">
                To get started, you will need a free Groq API key
              </p>

              <div className="flex items-center justify-center mb-4">
                <div className="w-32 text-gray-700">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1981.58 562.32"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1378.01.31h-.04c-109.6 0-198.78 89.18-198.78 198.78s89.18 198.78 198.78 198.78 198.78-89.18 198.78-198.81C1576.56 89.66 1487.4.5 1378.01.31m93.33 198.78c0 51.49-41.88 93.36-93.36 93.36s-93.36-41.88-93.36-93.36 41.88-93.36 93.36-93.36 93.36 41.87 93.36 93.36M908.86 180.75c.43-11.74 1.43-23.13 3.67-34.68l.05-.23c2.83-13.62 7.15-26.73 12.81-38.99 11.8-25.1 29.21-47.21 50.41-64.03 20.78-16.39 45.11-28.6 70.38-35.33 12.4-3.45 25.23-5.67 38.18-6.6 28.63-2.05 56.94 1.15 83.9 11.24 9.98 3.74 19.95 8.47 29.26 13.87l15.78 9.17-50.61 88.04-15.8-8.8c-10.95-6.1-22.78-9.84-35.16-11.11-12.97-1.17-26.36 0-38.93 3.43-11.9 3.18-23.24 8.94-32.86 16.64-9 7.25-16.26 16.51-20.96 26.71-5.08 11.01-6.98 23.13-6.98 35.17v199.17H908.85V180.75ZM873.03 187.44c-1.25-50.37-21.77-97.51-57.79-132.72C779.25 19.54 731.74.1 681.47 0h-1.63C574.85 0 488.97 85.15 488.05 190.59c-.45 51.35 19.07 99.82 54.95 136.49 35.9 36.68 83.86 57.12 135.2 57.57h58.51V282.78h-55.55c-24.09.33-46.84-8.87-64.06-25.73-17.24-16.87-26.88-39.48-27.14-63.68-.55-49.87 39.38-90.9 89.04-91.5h2.39c49.58 0 90.14 40.58 90.42 90.37v177.83c0 49.22-40.06 89.74-89.31 90.37-23.59-.18-45.76-9.55-62.43-26.43l-12.93-13.07-.05.05-51.98 91.8c34.69 31.66 79.12 49.17 126.28 49.52h2.59c50.55-.72 97.97-20.94 133.54-56.97 35.54-36.02 55.27-83.78 55.53-134.6V187.46H873v-.02ZM1790.21.29c-51.34 0-99.58 20.01-135.85 56.38-36.21 36.3-56.11 84.53-56.01 135.76 0 105.86 86.07 191.97 191.87 191.97h54.41V282.67h-54.41c-49.74 0-90.19-40.48-90.19-90.24s40.45-90.24 90.19-90.24c22.6 0 44.23 8.44 60.92 23.76 16.11 14.8 28.77 34.62 28.77 56.46v367.66h101.67V192.43c0-105.94-85.85-192.14-191.37-192.14M165.98 342.21H0L272.4 1.5l-68.75 220.11H369.6L97.23 562.32z"></path>
                  </svg>
                </div>
              </div>

              <input
                type="text"
                placeholder="Enter your Groq API key (sk-...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02]"
              />

              <p className="text-xs text-gray-500 text-center">
                Get your free API key from{" "}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f43e02] hover:underline"
                >
                  console.groq.com/keys
                </a>
              </p>

              <button
                onClick={nextStep}
                className="w-full bg-[#f43e02] text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition-transform"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {step === "profession" && (
            <motion.div
              key="profession"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <p className="text-gray-500 text-center mb-2">
                What best describes you?
              </p>

              <div className="grid gap-3">
                {[
                  { value: "professional", label: "Working Professional" },
                  { value: "student", label: "Student" },
                  { value: "enterprise", label: "Enterprise User" },
                  { value: "hiring-manager", label: "Hiring Manager" },
                ].map((prof) => (
                  <button
                    key={prof.value}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setProfession(prof.value as any)}
                    className={`border rounded-lg py-3 px-4 text-left hover:bg-gray-50 transition-colors ${
                      profession === prof.value
                        ? "border-[#f43e02] bg-orange-50"
                        : "border-gray-300"
                    }`}
                  >
                    {prof.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={goBack}
                  className="w-1/2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="w-1/2 bg-[#f43e02] text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition-transform"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {step === "role" && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <p className="text-gray-500 text-center mb-2">
                What is your current role?
              </p>

              <input
                type="text"
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02]"
              />

              <div className="flex justify-between gap-3">
                <button
                  onClick={goBack}
                  className="w-1/2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="w-1/2 bg-[#f43e02] text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition-transform"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {step === "experience" && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <p className="text-gray-500 text-center mb-2">
                How many years of professional experience do you have?
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "0-2", label: "0-2 years" },
                  { value: "2-5", label: "2-5 years" },
                  { value: "5-10", label: "5-10 years" },
                  { value: "10+", label: "10+ years" },
                ].map((exp) => (
                  <button
                    key={exp.value}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setExperience(exp.value as any)}
                    className={`border rounded-lg py-3 px-4 text-center hover:bg-gray-50 transition-colors ${
                      experience === exp.value
                        ? "border-[#f43e02] bg-orange-50"
                        : "border-gray-300"
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Your Age
                </label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="16"
                  max="100"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02]"
                />
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={goBack}
                  className="w-1/2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="w-1/2 bg-[#f43e02] text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition-transform"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {step === "privacy" && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <p className="text-gray-600 leading-relaxed text-sm">
                We respect your privacy. Your data will only be used to generate
                personalized interview questions and improve your experience.
                None of your personal information is sold, shared with
                advertisers, or used for any purpose other than providing you
                with AI-powered interview practice.
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 text-[#f43e02] focus:ring-[#f43e02]"
                  />
                  <span className="text-sm text-gray-700">
                    I understand that my data will be processed by AI to
                    generate interview questions and improve my experience. I
                    agree to the terms of service and privacy policy.
                  </span>
                </label>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={goBack}
                  className="w-1/2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!agreedToTerms || loading}
                  className={`w-1/2 text-white font-semibold py-3 rounded-lg transition-transform ${
                    !agreedToTerms || loading
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-[#f43e02] hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "Setting up..." : "Complete Setup"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-4 text-center"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
