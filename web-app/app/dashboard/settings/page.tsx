/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  ArrowLeft,
  Trash2,
  Info,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import platformColors from "@/app/utils/colors";
import Image from "next/image";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/settings");
      const data = await res.json();

      setUserData(data.user);
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
      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                {modal.type === "success" ? (
                  <CheckCircle className="text-green-600" />
                ) : (
                  <XCircle className="text-red-600" />
                )}
                <h2 className="text-lg font-semibold">{modal.title}</h2>
              </div>

              <p className="mb-6">{modal.message}</p>

              <button
                onClick={() => setModal(null)}
                className="bg-[#f43e02] text-white px-4 py-3 rounded-lg w-full"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl">
        {/* Back */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[#f43e02] mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Account</h1>
        <p className="text-gray-600 mb-8">Manage your account settings</p>

        <div className="bg-white p-8 rounded-2xl shadow-md space-y-10">
          {/* Profile */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User size={20} /> Profile
            </h2>

            <div className="flex items-center gap-4">
              <Image
                src={userData?.image || "/default-avatar.png"}
                alt="profile"
                width={64}
                height={64}
                className="rounded-full"
              />

              <div>
                <p>{userData?.email}</p>
                <p className="text-sm text-gray-500">Signed in via provider</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                value={userData?.name || ""}
                disabled
                className="w-full p-3 bg-gray-100 rounded-lg"
              />
            </div>
          </section>

          {/* Account Details */}
          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar size={20} /> Account Details
            </h2>

            <p className="mt-2">
              Joined:{" "}
              {formatDate(userData?.emailVerified || new Date().toISOString())}
            </p>
          </section>

          {/* Actions */}
          <section className="space-y-4">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full bg-gray-800 text-white py-3 rounded-lg"
            >
              Sign Out
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
