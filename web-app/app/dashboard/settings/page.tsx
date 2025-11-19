/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  User,
  Key,
  Calendar,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Check,
  X,
  Trash2,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import platformColors from "@/app/utils/colors";
import Image from "next/image";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [validatingAPI, setValidatingAPI] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );

  const [modal, setModal] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    apiKey: "",
    role: "",
  });

  const [userData, setUserData] = useState<any>(null);
  const [userSettings, setUserSettings] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/settings");
      const data = await res.json();

      setUserData(data.user);
      setUserSettings(data.settings);

      setProfileForm({
        name: data.user.name || "",
        apiKey: data.settings.apiKey || "",
        role: data.settings.role || "",
      });
    } catch (e) {
      setModal({
        type: "error",
        title: "Error loading",
        message: "Failed to fetch your settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const testAPIKey = async () => {
    if (!profileForm.apiKey.trim()) return;

    setValidatingAPI(true);
    setApiStatus("idle");

    try {
      const res = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: profileForm.apiKey }),
      });

      if (res.ok) {
        setApiStatus("valid");
        setModal({
          type: "success",
          title: "API key works!",
          message: "Your Groq API key is valid.",
        });
      } else {
        setApiStatus("invalid");
        const err = await res.json();
        setModal({
          type: "error",
          title: "Invalid API Key",
          message: err.error?.message || "Please check your API key.",
        });
      }
    } finally {
      setValidatingAPI(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setModal({
        type: "success",
        title: "Profile Updated",
        message: "Your changes have been saved.",
      });
    } catch (e: any) {
      setModal({
        type: "error",
        title: "Save Failed",
        message: e.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete account");
      }

      await signOut({ callbackUrl: "/login" });
    } catch (e: any) {
      setModal({
        type: "error",
        title: "Delete Failed",
        message: e.message,
      });
    }
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: platformColors.mainBackground }}
      >
        <Loader2 className="animate-spin text-[#f43e02]" size={36} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center p-8"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      {/* Success/Error Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                {modal.type === "success" ? (
                  <div className="bg-green-100 text-green-600 p-2 rounded-full">
                    <CheckCircle size={22} />
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-600 p-2 rounded-full">
                    <XCircle size={22} />
                  </div>
                )}
                <h2 className="text-lg font-semibold text-gray-800">
                  {modal.title}
                </h2>
              </div>

              <p className="text-gray-700 mb-6">{modal.message}</p>
              <button
                onClick={() => setModal(null)}
                className="bg-[#f43e02] text-white px-4 py-3 rounded-lg w-full font-semibold hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4"
            >
              <h2 className="text-xl font-bold text-red-600 mb-3">
                Delete Account?
              </h2>

              <p className="text-gray-700 mb-6">
                Your entire data — interviews, settings, profile — will be
                permanently deleted. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteAccount}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-[1.02]"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[#f43e02] hover:opacity-80 mb-6 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Dashboard</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold mb-1 text-gray-800">Settings</h1>
          <p className="text-gray-600 mb-8">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-md space-y-10 border border-gray-200"
        >
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <User size={20} className="text-[#f43e02]" /> Profile Information
            </h2>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Image
                src={userData?.image || "/default-avatar.png"}
                alt="profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-2 border-orange-200 object-cover"
              />

              <div>
                <p className="font-medium text-gray-800">{userData?.email}</p>
                <p className="text-gray-500 text-sm">
                  Signed in with your provider (e.g., Google, LinkedIn)
                </p>
              </div>
            </div>

            {/* Non-editable Name Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <input
                  value={profileForm.name}
                  readOnly
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed pr-10"
                  placeholder="Your name from Google"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <Info size={18} />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <Info size={14} />
                We use the name from your Sign-in provider (e.g., Google,
                LinkedIn)
              </p>
            </div>

            {/* Editable Role Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Role
              </label>
              <input
                value={profileForm.role}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, role: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f43e02] focus:border-transparent transition-all"
                placeholder="Enter your role (e.g., Software Engineer)"
              />
              <p className="text-sm text-gray-500 mt-2">
                This helps us personalize your interview experience
              </p>
            </div>
          </motion.section>

          {/* API Key Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Key size={20} className="text-[#f43e02]" /> API Key
            </h2>

            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={profileForm.apiKey}
                onChange={(e) => {
                  setApiStatus("idle");
                  setProfileForm({ ...profileForm, apiKey: e.target.value });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-[#f43e02] focus:border-transparent transition-all"
                placeholder="Enter your Groq API key (sk-...)"
              />

              <button
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-all"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={testAPIKey}
                disabled={!profileForm.apiKey.trim() || validatingAPI}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-40 transition-all hover:scale-[1.02] font-semibold"
              >
                {validatingAPI ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Key size={16} />
                )}
                {validatingAPI ? "Validating..." : "Test API Key"}
              </button>

              {apiStatus === "valid" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  <Check size={14} /> Valid
                </motion.div>
              )}

              {apiStatus === "invalid" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  <X size={14} /> Invalid
                </motion.div>
              )}
            </div>
          </motion.section>

          {/* Account Details */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Calendar size={20} className="text-[#f43e02]" /> Account Details
            </h2>
            <p className="text-gray-700">
              Joined:{" "}
              <span className="font-medium">
                {formatDate(
                  userData?.emailVerified || new Date().toISOString()
                )}
              </span>
            </p>
          </motion.section>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full bg-[#f43e02] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40 transition-all hover:scale-[1.02]"
            onClick={saveProfile}
            disabled={saving}
          >
            {saving ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </motion.button>

          {/* Delete Account Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={18} /> Delete Account
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
