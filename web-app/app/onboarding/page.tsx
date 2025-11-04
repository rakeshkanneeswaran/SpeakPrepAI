"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState<"apiChoice" | "apiKey" | "role" | "privacy">(
    "apiChoice"
  );
  const [apiChoice, setApiChoice] = useState<"managed" | "own" | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [role, setRole] = useState<
    "professional" | "student" | "enterprise" | null
  >(null);
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  function goBack() {
    if (step === "apiKey") {
      setStep("apiChoice");
    } else if (step === "role") {
      // Always go back to apiChoice from role
      setStep("apiChoice");
    } else if (step === "privacy") {
      setStep("role");
    }
  }

  function nextStep() {
    setError(""); // Clear any previous errors

    if (step === "apiChoice") {
      if (!apiChoice) {
        setError("Please select an option");
        return;
      }

      if (apiChoice === "own") {
        setStep("apiKey");
      } else if (apiChoice === "managed") {
        // Skip apiKey step for managed option
        setStep("role");
      }
    } else if (step === "apiKey") {
      if (!apiKey.trim()) {
        setError("Please enter your Groq API key");
        return;
      }
      setStep("role");
    } else if (step === "role") {
      if (!role) {
        setError("Please select your role");
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
            apiChoice,
            apiKey: apiChoice === "own" ? apiKey : null,
            role,
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

  // Handle API choice selection separately
  function handleApiChoice(choice: "managed" | "own") {
    setApiChoice(choice);
    setError(""); // Clear errors when making a selection

    if (choice === "managed") {
      // For managed, skip API key step and go directly to role
      setStep("role");
    } else {
      // For own API key, go to API key input step
      setStep("apiKey");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {step === "privacy"
            ? "Your Privacy Matters"
            : "Let's get you started"}
        </h2>

        <AnimatePresence mode="wait">
          {step === "apiChoice" && (
            <motion.div
              key="apiChoice"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
            >
              <p className="text-gray-500 text-center mb-6">
                Would you like to use your own Groq API key or let us manage it
                for you?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleApiChoice("own")}
                  className={`border rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 ${
                    apiChoice === "own"
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEX0PgH////0KQD0NgD0OwD0PgH0PgH0PgH0PgH0PQD5oY/949z2bU381cz1UCP+9PD4inP7xLm2DhjzAAAACnRSTlPq////99D/5O/+3D3dAAAAAJNJREFUKJGl0cEOAiEMBFCmDbgBCsv//6w2UbdWy8W5kZcdSjflI0xOqYQ5dpgc8tjgqBwiyRkin9jUAhQhCVqEVIEVIA8AdliL1B7YScMetVQzm0jnT+SOd6b/kueF3WNf0p5eXxObOzXafT3VrU+HGvwbaZnSL2wQsyKHgDk5HDiD9envtKUeaykh+vyD+RYm3wEr3BD41wmXmAAAAABJRU5ErkJggg=="
                      alt="Groq logo"
                      width={24}
                      height={24}
                    />
                    <span>Use my own Groq API Key</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center px-2">
                    If you run out of credits, the application will stop working
                    until you refill your balance.
                  </p>
                </button>

                <button
                  onClick={() => handleApiChoice("managed")}
                  className={`border rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 ${
                    apiChoice === "managed"
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  Let the platform manage it
                </button>
              </div>
            </motion.div>
          )}

          {step === "apiKey" && (
            <motion.div
              key="apiKey"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <p className="text-gray-500 text-center mb-6">
                Please enter your Groq API key below.
              </p>
              <input
                type="text"
                placeholder="sk-xxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="flex justify-between gap-3">
                <button
                  onClick={goBack}
                  className="w-1/2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="w-1/2 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition"
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
            >
              <p className="text-gray-500 text-center mb-6">
                How are you planning to use the platform?
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {["professional", "student", "enterprise"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r as any)}
                    className={`border rounded-lg py-3 capitalize hover:bg-gray-50 ${
                      role === r ? "border-orange-500" : "border-gray-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={goBack}
                  className="w-1/2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!role || loading}
                  className={`w-1/2 text-white font-semibold py-3 rounded-lg transition ${
                    !role || loading
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
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
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-gray-600 mb-6 leading-relaxed">
                We respect your privacy. None of your personal data or usage
                information is sold, shared with advertisers, or used to make
                money from you. Your data is stored securely and only used to
                enhance your experience within this platform.
              </p>
              <div className="flex justify-between gap-3">
                <button
                  onClick={goBack}
                  className="w-1/2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-1/2 text-white font-semibold py-3 rounded-lg transition ${
                    loading
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
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
            className="text-red-500 text-sm mt-3 text-center"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
