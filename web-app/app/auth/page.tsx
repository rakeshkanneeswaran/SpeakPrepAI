"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function AuthPage() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, startTransition] = useTransition();
  const [shake, setShake] = useState(false);
  const router = useRouter();

  function triggerShake(message: string) {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleNext() {
    if (!email.trim()) {
      triggerShake("Email cannot be empty");
      return;
    }
    setError("");
    setStep("password");
  }

  async function handleLogin() {
    if (!password.trim()) {
      triggerShake("Password cannot be empty");
      return;
    }

    setError("");
    startTransition(async () => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        triggerShake(data.error || "Invalid credentials");
        setStep("email");
      }
    });
  }

  return (
    <main
      className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-100 text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Sticky Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
        <Navbar />
      </div>

      {/* Centered Auth Card */}
      <div className="flex flex-col items-center justify-center flex-1 mt-24 mb-16">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-3xl p-10 md:p-12 w-[400px] md:w-[460px] text-center border border-orange-100"
        >
          <h2 className="text-3xl font-bold text-[#f43e02] mb-3">
            {step === "email" ? "Welcome Back" : "Enter Your Password"}
          </h2>
          <p className="text-gray-500 mb-8 text-[15px]">
            {step === "email"
              ? "Access is invite-only. Enter your email to continue."
              : "Sign in to your SpeakPrep AI dashboard."}
          </p>

          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`space-y-4 ${shake ? "animate-shake" : ""}`}
              >
                <input
                  type="email"
                  placeholder="Enter your invite email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02]"
                />
                <button
                  onClick={handleNext}
                  className="w-full bg-[#f43e02] text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition-transform"
                >
                  Next →
                </button>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`space-y-5 ${shake ? "animate-shake" : ""}`}
              >
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className={`w-full text-white font-semibold py-3 rounded-lg transition-transform ${
                    loading
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-[#f43e02] hover:scale-[1.02]"
                  }`}
                >
                  Continue →
                </button>

                <p className="text-sm text-center text-gray-500 mt-4">
                  <button
                    onClick={() => alert("Password reset feature coming soon.")}
                    className="text-[#f43e02] hover:underline"
                  >
                    Forgot password?
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-4"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Early Access Section */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-gray-600 text-sm">
            Don’t have an invite yet? Early access is limited.
          </p>
          <button
            onClick={() => alert("Request received! We’ll contact you soon.")}
            className="bg-[#f43e02] text-white font-semibold px-8 py-3 rounded-full hover:scale-105 transition-transform"
          >
            Request Early Access
          </button>
        </div>
      </div>
    </main>
  );
}
