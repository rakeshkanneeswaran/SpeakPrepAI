"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

function RegisterInner() {
  const router = useRouter();

  const [checkingLogin, setCheckingLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  // Check whether the user is already logged in
  useEffect(() => {
    let mounted = true;

    async function checkLogin() {
      try {
        const response = await fetch("/api/check-login");

        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();

          if (data.authenticated) {
            router.push("/dashboard");
            return;
          }
        }

        setCheckingLogin(false);
      } catch (error) {
        console.error("Login check failed:", error);

        if (mounted) {
          setCheckingLogin(false);
        }
      }
    }

    checkLogin();

    return () => {
      mounted = false;
    };
  }, [router]);

  // Handle registration
  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Basic password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // The API has already created the HttpOnly JWT cookie.
      // Send the newly registered user to the dashboard.
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Checking your session...
        </p>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-100 text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 mt-24 mb-16 px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-3xl p-10 md:p-12 w-[400px] md:w-[460px] border border-orange-100"
        >
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#f43e02] mb-3">
              Create your account
            </h2>

            <p className="text-gray-500 mb-8 text-[15px]">
              Get started with SpeakPrepAI
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your name"
                autoComplete="name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#f43e02] focus:ring-1 focus:ring-[#f43e02] transition"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#f43e02] focus:ring-1 focus:ring-[#f43e02] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#f43e02] focus:ring-1 focus:ring-[#f43e02] transition"
              />

              <p className="text-xs text-gray-400 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#f43e02] focus:ring-1 focus:ring-[#f43e02] transition"
              />
            </div>

            {/* Register button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full bg-[#f43e02] text-white py-3 px-4 rounded-lg hover:bg-[#d93602] transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </motion.button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-[#f43e02] font-medium hover:underline"
            >
              Sign in
            </button>
          </div>

          {/* Privacy */}
          <div className="relative my-6">
            <div className="border-t border-gray-200"></div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{" "}
            <a
              href="/privacy"
              className="text-[#f43e02] underline"
            >
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">
            Loading...
          </p>
        </div>
      }
    >
      <RegisterInner />
    </Suspense>
  );
}