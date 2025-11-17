"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

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

  const [validatingApi, setValidatingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<
    "idle" | "valid" | "invalid" | "terms_required"
  >("idle");

  const router = useRouter();

  // ===========================
  // Validate API KEY
  // ===========================
  async function validateApiKey(key: string) {
    setValidatingApi(true);
    setApiStatus("idle");
    setError("");

    try {
      const res = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await res.json();

      if (res.ok) {
        setApiStatus("valid");
        return true;
      } else if (data.error?.code === "model_terms_required") {
        setApiStatus("terms_required");
        setError("TTS terms acceptance required");
        return false;
      } else {
        setApiStatus("invalid");
        setError(data.error?.message || "Invalid API key");
        return false;
      }
    } catch (err) {
      setApiStatus("invalid");
      setError("Failed to validate API key");
      return false;
    } finally {
      setValidatingApi(false);
    }
  }

  // ===========================
  // Navigation Logic
  // ===========================
  function goBack() {
    if (step === "profession") setStep("apiKey");
    else if (step === "role") setStep("profession");
    else if (step === "experience") setStep("role");
    else if (step === "privacy") setStep("experience");
  }

  async function nextStep() {
    setError("");

    if (step === "apiKey") {
      if (!apiKey.trim()) {
        setError("Please enter your Groq API key");
        return;
      }

      const isValid = await validateApiKey(apiKey);
      if (!isValid) return;

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

  // ===========================
  // SUBMIT FINAL
  // ===========================
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

  // ===========================
  // UI
  // ===========================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 relative">
      {/* TOP NAVIGATION (HOME + SIGN OUT) */}
      <div className="absolute top-4 right-4 flex items-center gap-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-orange-100">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-700 hover:text-[#f43e02] transition font-medium"
        >
          Home
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-red-500 hover:text-red-600 transition font-medium"
        >
          Sign Out
        </button>
      </div>

      {/* MAIN CARD */}
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

        {/* Steps */}
        <AnimatePresence mode="wait">
          {/* STEP 1 — API KEY */}
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

              {/* Groq Logo */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 text-gray-700">
                  {/* svg omitted for brevity, keep your original */}
                </div>
              </div>

              {/* API Input */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter your Groq API key (sk-...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f43e02]"
                />

                {/* Validation UI */}
                {apiKey && (
                  <div className="flex items-center gap-2 text-sm">
                    {validatingApi && (
                      <>
                        <div className="w-4 h-4 border-2 border-[#f43e02] border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-600">
                          Validating API key...
                        </span>
                      </>
                    )}
                    {apiStatus === "valid" && (
                      <>
                        <CheckCircle className="text-green-500" size={16} />
                        <span className="text-green-600">
                          API key is valid!
                        </span>
                      </>
                    )}
                    {apiStatus === "invalid" && (
                      <>
                        <XCircle className="text-red-500" size={16} />
                        <span className="text-red-600">Invalid API key</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Continue button */}
              <button
                onClick={nextStep}
                disabled={validatingApi || apiStatus === "invalid"}
                className={`w-full text-white font-semibold py-3 rounded-lg transition-transform ${
                  validatingApi || apiStatus === "invalid"
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-[#f43e02] hover:scale-[1.02]"
                }`}
              >
                {validatingApi ? "Validating..." : "Continue →"}
              </button>
            </motion.div>
          )}

          {/* Remaining steps unchanged — keep your original EXACT code */}
          {/* ✔ profession */}
          {/* ✔ role */}
          {/* ✔ experience */}
          {/* ✔ privacy */}
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
