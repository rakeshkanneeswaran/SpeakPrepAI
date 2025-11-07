"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
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
      console.log("Login response data:", data.onboarded);

      if (!res.ok) {
        triggerShake(data.error || "Invalid credentials");
        setStep("email");
        return;
      }

      // If login is successful, check onboarding status
      if (data.onboarded === false) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <div className="space-y-6">
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
              placeholder="Enter your email"
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
              {loading ? "Signing in..." : "Sign In →"}
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
          className="text-red-500 text-sm text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
