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
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [validatingAPI, setValidatingAPI] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modal, setModal] = useState<any>(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    apiKey: "",
    role: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        body: JSON.stringify({ apiKey: profileForm.apiKey }),
      });

      if (res.ok) {
        setApiStatus("valid");
        setModal({
          type: "success",
          title: "API key works!",
          message: "Your Groq API key is valid and active.",
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f43e02]" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center p-8 bg-gray-50">
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
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
              <h2 className="text-lg font-semibold">{modal.title}</h2>
            </div>

            <p className="text-gray-700 mb-6">{modal.message}</p>
            <button
              onClick={() => setModal(null)}
              className="bg-[#f43e02] text-white px-4 py-2 rounded-lg w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl">
        {/* Header */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[#f43e02] hover:opacity-80 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-600 mb-8">Manage your account</p>

        {/* CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-md space-y-10">
          {/* PROFILE */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User size={20} /> Profile Information
            </h2>

            <div className="flex items-center gap-4">
              <img
                src={userData?.image || "/default-avatar.png"}
                className="w-16 h-16 rounded-full border"
                alt="avatar"
              />
              <div>
                <p className="font-medium">{userData?.email}</p>
                <p className="text-gray-500 text-sm">Signed in with Google</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f43e02]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Role</label>
              <input
                value={profileForm.role}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, role: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f43e02]"
              />
            </div>
          </section>

          {/* API KEY */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Key size={20} /> API Key
            </h2>

            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={profileForm.apiKey}
                onChange={(e) => {
                  setApiStatus("idle");
                  setProfileForm({ ...profileForm, apiKey: e.target.value });
                }}
                className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-[#f43e02]"
                placeholder="Enter your Groq API key"
              />

              <button
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={testAPIKey}
                disabled={!profileForm.apiKey.trim() || validatingAPI}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-40"
              >
                {validatingAPI ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Key size={16} />
                )}
                {validatingAPI ? "Validating..." : "Test API Key"}
              </button>

              {/* Dynamic status chip */}
              {apiStatus === "valid" && (
                <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-lg text-sm">
                  <Check size={14} /> Valid
                </div>
              )}

              {apiStatus === "invalid" && (
                <div className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-lg text-sm">
                  <X size={14} /> Invalid
                </div>
              )}
            </div>
          </section>

          {/* ACCOUNT META */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar size={20} /> Account Details
            </h2>
            <p className="text-gray-700">
              Joined:{" "}
              <span className="font-medium">
                {formatDate(
                  userData?.emailVerified || new Date().toISOString()
                )}
              </span>
            </p>
          </section>

          {/* SAVE */}
          <button
            className="w-full bg-[#f43e02] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40"
            onClick={saveProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
