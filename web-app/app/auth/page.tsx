"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [step, setStep] = useState<"email" | "password" | "signup">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  // password rules
  const rules = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const isStrongPassword =
    rules.length && rules.upper && rules.lower && rules.number;

  async function handleNext() {
    if (!email.trim()) {
      triggerShake("Email cannot be empty");
      return;
    }
    setError("");
    const res = await fetch("/api/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setStep(data.exists ? "password" : "signup");
  }

  async function handleAuth() {
    if (step === "password" && !password.trim()) {
      triggerShake("Password cannot be empty");
      return;
    }
    if (step === "signup") {
      if (!name.trim() || !password.trim()) {
        triggerShake("All fields are required");
        return;
      }
      if (!isStrongPassword) {
        triggerShake("Password does not meet requirements");
        return;
      }
    }

    setError("");
    startTransition(async () => {
      const endpoint = step === "password" ? "/api/login" : "/api/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      const onboarded = data.onboarded;
      if (res.ok) {
        router.push(onboarded ? "/dashboard" : "/onboarding");
      } else {
        triggerShake(data.error || "Something went wrong");
        setStep("email");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-[380px]"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          {step === "email"
            ? "Welcome"
            : step === "password"
            ? "Enter your password"
            : "Create your account"}
        </h2>
        <p className="text-gray-500 text-center mb-6">
          {step === "email"
            ? "Enter your email to continue"
            : step === "password"
            ? "Welcome back!"
            : "Fill in your details to sign up"}
        </p>

        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className={shake ? "animate-shake" : ""}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleNext}
                className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition"
              >
                Next →
              </button>
            </motion.div>
          )}

          {(step === "password" || step === "signup") && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className={shake ? "animate-shake" : ""}
            >
              {step === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              )}

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    step === "signup"
                      ? "Create a password"
                      : "Enter your password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {step === "signup" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm space-y-1 mb-4"
                >
                  {[
                    { rule: rules.length, label: "At least 6 characters" },
                    {
                      rule: rules.upper,
                      label: "At least one uppercase letter",
                    },
                    {
                      rule: rules.lower,
                      label: "At least one lowercase letter",
                    },
                    { rule: rules.number, label: "At least one number" },
                  ].map((r) => (
                    <motion.div
                      key={r.label}
                      className="flex items-center space-x-2"
                      animate={{ opacity: r.rule ? 1 : 0.6 }}
                    >
                      {r.rule ? (
                        <CheckCircle className="text-green-500" size={16} />
                      ) : (
                        <XCircle className="text-gray-400" size={16} />
                      )}
                      <span
                        className={r.rule ? "text-green-600" : "text-gray-500"}
                      >
                        {r.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <button
                onClick={handleAuth}
                disabled={loading}
                className={`w-full text-white font-semibold py-3 rounded-lg transition ${
                  loading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {step === "signup" ? "Create account →" : "Continue →"}
              </button>
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
