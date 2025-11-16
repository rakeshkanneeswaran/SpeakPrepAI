"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [step, setStep] = useState<"name" | "username" | "password">("name");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, startTransition] = useTransition();
  const [shake, setShake] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const router = useRouter();

  function triggerShake(message: string) {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  // Check username availability
  const checkUsername = async (username: string) => {
    if (!username) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    try {
      const response = await fetch("/api/check-email", {
        // ❗ still called check-email but you're actually checking username
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username }),
      });

      const data = await response.json();
      setUsernameAvailable(!data.exists);
    } catch (err) {
      console.error("Error checking username:", err);
    } finally {
      setUsernameChecking(false);
    }
  };

  async function handleNextFromName() {
    if (!formData.name.trim()) {
      triggerShake("Name cannot be empty");
      return;
    }
    setError("");
    setStep("username");
  }

  async function handleNextFromUsername() {
    if (!formData.username.trim()) {
      triggerShake("Username cannot be empty");
      return;
    }

    // ❗ Block "@" anywhere
    if (formData.username.includes("@")) {
      triggerShake("Username cannot contain '@'");
      return;
    }

    if (usernameAvailable === false) {
      triggerShake("Username already exists. Please choose another.");
      return;
    }

    if (usernameAvailable === null && !usernameChecking) {
      await checkUsername(formData.username);
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
          email: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/onboarding");
      } else {
        triggerShake(data.message || "Registration failed");
        setStep("username");
      }
    });
  }

  const updateFormData = (field: string, value: string) => {
    // ❗ Prevent typing '@'
    if (field === "username" && value.includes("@")) return;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "username") {
      setTimeout(() => checkUsername(value), 500);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* STEP 1: NAME */}
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

        {/* STEP 2: USERNAME */}
        {step === "username" && (
          <motion.div
            key="username"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`space-y-4 ${shake ? "animate-shake" : ""}`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => updateFormData("username", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f43e02] pr-10"
              />

              {usernameChecking && (
                <div className="absolute right-3 top-3">
                  <div className="w-5 h-5 border-2 border-[#f43e02] border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {usernameAvailable === true && (
                <Check
                  className="absolute right-3 top-3 text-green-500"
                  size={20}
                />
              )}
              {usernameAvailable === false && (
                <X className="absolute right-3 top-3 text-red-500" size={20} />
              )}
            </div>

            {usernameAvailable === true && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500 text-sm text-center"
              >
                Username is available!
              </motion.p>
            )}
            {usernameAvailable === false && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                Username already exists
              </motion.p>
            )}

            <button
              onClick={handleNextFromUsername}
              disabled={usernameChecking}
              className={`w-full text-white font-semibold py-3 rounded-lg transition-transform ${
                usernameChecking
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-[#f43e02] hover:scale-[1.02]"
              }`}
            >
              {usernameChecking ? "Checking..." : "Next →"}
            </button>
          </motion.div>
        )}

        {/* STEP 3: PASSWORD */}
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
