"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [step, setStep] = useState<"name" | "email" | "password">("name");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, startTransition] = useTransition();
  const [shake, setShake] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const router = useRouter();

  function triggerShake(message: string) {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  // Check email availability
  const checkEmail = async (email: string) => {
    if (!email) {
      setEmailAvailable(null);
      return;
    }

    setEmailChecking(true);
    try {
      const response = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setEmailAvailable(!data.exists);
    } catch (err) {
      console.error("Error checking email:", err);
    } finally {
      setEmailChecking(false);
    }
  };

  async function handleNextFromName() {
    if (!formData.name.trim()) {
      triggerShake("Name cannot be empty");
      return;
    }
    setError("");
    setStep("email");
  }

  async function handleNextFromEmail() {
    if (!formData.email.trim()) {
      triggerShake("Username cannot be empty");
      return;
    }

    if (emailAvailable === false) {
      triggerShake("Username already exists. Please use a different username.");
      return;
    }

    if (emailAvailable === null && !emailChecking) {
      await checkEmail(formData.email);
      return;
    }

    setError("");
    setStep("password");
  }

  async function handleSignup() {
    if (!formData.password.trim()) {
      triggerShake("Password cannot be empty");
      return;
    }

    if (formData.password.length < 6) {
      triggerShake("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      triggerShake("Passwords do not match");
      return;
    }

    setError("");
    startTransition(async () => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/onboarding");
      } else {
        triggerShake(data.message || "Registration failed");
        setStep("email");
      }
    });
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Check email availability when email changes
    if (field === "email") {
      setTimeout(() => checkEmail(value), 500);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === "name" && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`space-y-4 ${shake ? "animate-shake" : ""}`}
          >
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02]"
            />
            <button
              onClick={handleNextFromName}
              className="w-full bg-[#f43e02] text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition-transform"
            >
              Next →
            </button>
          </motion.div>
        )}

        {step === "email" && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`space-y-4 ${shake ? "animate-shake" : ""}`}
          >
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your prefered username"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02] pr-10"
              />
              {emailChecking && (
                <div className="absolute right-3 top-3">
                  <div className="w-5 h-5 border-2 border-[#f43e02] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {emailAvailable === true && (
                <Check
                  className="absolute right-3 top-3 text-green-500"
                  size={20}
                />
              )}
              {emailAvailable === false && (
                <X className="absolute right-3 top-3 text-red-500" size={20} />
              )}
            </div>

            {emailAvailable === true && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500 text-sm text-center"
              >
                Email is available!
              </motion.p>
            )}
            {emailAvailable === false && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                Email already exists
              </motion.p>
            )}

            <button
              onClick={handleNextFromEmail}
              disabled={emailChecking}
              className={`w-full text-white font-semibold py-3 rounded-lg transition-transform ${
                emailChecking
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-[#f43e02] hover:scale-[1.02]"
              }`}
            >
              {emailChecking ? "Checking..." : "Next →"}
            </button>
          </motion.div>
        )}

        {step === "password" && (
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`space-y-4 ${shake ? "animate-shake" : ""}`}
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
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

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateFormData("confirmPassword", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className={`w-full text-white font-semibold py-3 rounded-lg transition-transform ${
                loading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-[#f43e02] hover:scale-[1.02]"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
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
