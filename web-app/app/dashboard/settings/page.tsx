"use client";

import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Eye,
  EyeOff,
  Save,
  Key,
  Calendar,
  CheckCircle,
  XCircle,
  TestTube,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import platformColors from "@/app/utils/colors";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserSettings {
  id: string;
  userId: string;
  platformedManagedAPIKey: boolean;
  apiChoice: string;
  apiKey: string | null;
  role: string | null;
  availableCredits: number;
  createdAt: string;
  updatedAt: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validatingApi, setValidatingApi] = useState(false);
  const [apiValidationStatus, setApiValidationStatus] = useState<
    "idle" | "valid" | "invalid"
  >("idle");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    apiKey: "",
    role: "",
  });

  const [originalApiKey, setOriginalApiKey] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Fetch user data and settings
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setUserSettings(data.settings);

        // Initialize form data with fetched user data
        setProfileForm({
          name: data.user.name || "",
          email: data.user.email,
          apiKey: data.settings?.apiKey || "",
          role: data.settings?.role || "",
        });
        setOriginalApiKey(data.settings?.apiKey || "");
      } else {
        showModalMessage("error", "Error", "Failed to load user data");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      showModalMessage("error", "Error", "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const showModalMessage = (
    type: "success" | "error",
    title: string,
    message: string
  ) => {
    setModalContent({ type, title, message });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const validateApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey.trim()) {
      return false;
    }

    try {
      setValidatingApi(true);
      const response = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: apiKey,
        }),
      });

      const data = await response.json();
      return response.ok;
    } catch (error) {
      return false;
    } finally {
      setValidatingApi(false);
    }
  };

  const handleProfileSave = async () => {
    // Check if API key has changed
    const apiKeyChanged = profileForm.apiKey !== originalApiKey;

    if (apiKeyChanged) {
      // Validate the new API key before saving
      setSaving(true);
      const isValid = await validateApiKey(profileForm.apiKey);

      if (!isValid) {
        showModalMessage(
          "error",
          "Invalid API Key",
          "The API key you entered is invalid. Please check your API key and try again."
        );
        setSaving(false);
        return;
      }
    }

    try {
      setSaving(true);
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        showModalMessage("success", "Success", "Profile updated successfully");
        fetchUserData(); // Refresh data
        setOriginalApiKey(profileForm.apiKey); // Update original API key
      } else {
        const error = await response.json();
        showModalMessage(
          "error",
          "Error",
          error.message || "Failed to update profile"
        );
      }
    } catch (error) {
      showModalMessage("error", "Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleTestApiKey = async () => {
    if (!profileForm.apiKey.trim()) {
      showModalMessage("error", "Error", "Please enter an API key first");
      return;
    }

    try {
      setValidatingApi(true);
      setApiValidationStatus("idle");

      const response = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: profileForm.apiKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setApiValidationStatus("valid");
        showModalMessage(
          "success",
          "API Key Valid",
          "Your API key is valid and working!"
        );
      } else {
        setApiValidationStatus("invalid");
        showModalMessage(
          "error",
          "Invalid API Key",
          data.error?.message ||
            "The API key you entered is invalid. Please check your API key and try again."
        );
      }
    } catch (error) {
      setApiValidationStatus("invalid");
      showModalMessage(
        "error",
        "Validation Failed",
        "Failed to validate API key. Please check your connection and try again."
      );
    } finally {
      setValidatingApi(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showModalMessage("error", "Error", "New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showModalMessage(
        "error",
        "Error",
        "Password must be at least 6 characters long"
      );
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        showModalMessage("success", "Success", "Password changed successfully");
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        showModalMessage(
          "error",
          "Error",
          error.message || "Failed to change password"
        );
      }
    } catch (error) {
      showModalMessage("error", "Error", "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: platformColors.mainBackground }}
      >
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-orange-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      {/* Modal */}
      {showModal && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border"
            style={{
              borderColor: platformColors.borderColor,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-full ${
                  modalContent.type === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {modalContent.type === "success" ? (
                  <CheckCircle size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {modalContent.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">{modalContent.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className={`px-4 py-2 rounded-lg font-medium ${
                  modalContent.type === "success"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } transition-colors`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition mb-3"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {[
                { id: "profile", name: "Profile & API", icon: User },
                { id: "security", name: "Security", icon: Shield },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div
            className="flex-1 rounded-xl shadow-sm border p-8"
            style={{
              backgroundColor: platformColors.outerMainBackground,
              borderColor: platformColors.borderColor,
            }}
          >
            {/* Profile Tab */}
            {activeTab === "profile" && userData && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile & API Settings
                </h2>

                {/* Profile Info */}
                <div
                  className="border rounded-lg p-6"
                  style={{
                    borderColor: platformColors.borderColor,
                    backgroundColor: platformColors.mainBackground,
                  }}
                >
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <User size={18} />
                    Account Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        style={{ borderColor: platformColors.borderColor }}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed"
                        style={{ borderColor: platformColors.borderColor }}
                        placeholder="you@email.com"
                        readOnly
                        disabled
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={profileForm.role}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        style={{ borderColor: platformColors.borderColor }}
                        placeholder="e.g. Software Engineer, Student"
                      />
                    </div>
                  </div>
                </div>

                {/* API Key */}
                <div
                  className="border rounded-lg p-6"
                  style={{
                    borderColor: platformColors.borderColor,
                    backgroundColor: platformColors.mainBackground,
                  }}
                >
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Key size={18} />
                    Groq API Configuration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Provider
                      </label>
                      <div
                        className="px-3 py-2 border rounded-lg text-gray-700"
                        style={{
                          backgroundColor: platformColors.mainBackground,
                          borderColor: platformColors.borderColor,
                        }}
                      >
                        Groq API
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Currently supporting Groq API only
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={profileForm.apiKey}
                          onChange={(e) => {
                            setProfileForm({
                              ...profileForm,
                              apiKey: e.target.value,
                            });
                            setApiValidationStatus("idle");
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 pr-10"
                          style={{ borderColor: platformColors.borderColor }}
                          placeholder="Enter your Groq API key"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                        >
                          {showApiKey ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      <button
                        onClick={handleTestApiKey}
                        disabled={validatingApi || !profileForm.apiKey.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TestTube size={14} />
                        {validatingApi ? "Validating..." : "Test API Key"}
                      </button>
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                        style={{ borderColor: platformColors.borderColor }}
                      >
                        <Key size={14} />
                        Get API Key
                      </a>

                      {/* API Validation Status */}
                      {apiValidationStatus !== "idle" && (
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                            apiValidationStatus === "valid"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {apiValidationStatus === "valid" ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span>API Key Valid</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span>API Key Invalid</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Metadata */}
                {userData && (
                  <div
                    className="border rounded-lg p-6"
                    style={{
                      borderColor: platformColors.borderColor,
                      backgroundColor: platformColors.mainBackground,
                    }}
                  >
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Calendar size={18} />
                      Account Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Account Created</p>
                        <p className="font-medium">
                          {formatDate(userData.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Updated</p>
                        <p className="font-medium">
                          {formatDate(userData.updatedAt)}
                        </p>
                      </div>
                      {userSettings && (
                        <>
                          <div>
                            <p className="text-gray-600">Settings Created</p>
                            <p className="font-medium">
                              {formatDate(userSettings.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Settings Updated</p>
                            <p className="font-medium">
                              {formatDate(userSettings.updatedAt)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Security Settings
                </h2>

                <div
                  className="border rounded-lg p-6 max-w-md"
                  style={{
                    borderColor: platformColors.borderColor,
                    backgroundColor: platformColors.mainBackground,
                  }}
                >
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 pr-10"
                        style={{ borderColor: platformColors.borderColor }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                      >
                        {showOldPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 pr-10"
                        style={{ borderColor: platformColors.borderColor }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        style={{ borderColor: platformColors.borderColor }}
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={saving}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
