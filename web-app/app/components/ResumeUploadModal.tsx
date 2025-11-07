"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import platformColors from "../utils/colors";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (resumeFile: File, jobDescription: string) => void;
  selectedType: string | null;
  uploading?: boolean;
  loadingStage?: string | null;
}

const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onLaunch,
  selectedType,
  uploading = false,
  loadingStage = null,
}) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [dataUsageConsent, setDataUsageConsent] = useState(false);
  const [shake, setShake] = useState(false);

  const allConsentsGiven = privacyConsent && dataUsageConsent;

  const triggerShake = (message: string) => {
    alert(message); // You can replace this with a proper error state
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = () => {
    if (!resumeFile || !jobDesc.trim()) {
      triggerShake("Please upload a resume and enter the job description.");
      return;
    }

    if (!allConsentsGiven) {
      triggerShake(
        "Please agree to all privacy and terms conditions to proceed."
      );
      return;
    }

    onLaunch(resumeFile, jobDesc);
  };

  const handleClose = () => {
    setResumeFile(null);
    setJobDesc("");
    setPrivacyConsent(false);
    setDataUsageConsent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-orange-100"
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                Start {selectedType}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-gray-500 mb-6 text-sm"
              >
                Upload your resume and job description to begin your
                personalized interview session
              </motion.p>

              <div className="space-y-6">
                {/* Resume Upload */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${shake ? "animate-shake" : ""}`}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (PDF)
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    disabled={uploading}
                  />
                </motion.div>

                {/* Job Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`${shake ? "animate-shake" : ""}`}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    placeholder="Paste job description here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    disabled={uploading}
                  ></motion.textarea>
                </motion.div>

                {/* Privacy and Terms Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t border-gray-200"
                >
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Privacy & Terms
                  </h3>

                  <div className="space-y-4">
                    {/* Data Usage Consent */}
                    <motion.div
                      className="flex items-start space-x-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <input
                        type="checkbox"
                        id="dataUsageConsent"
                        checked={dataUsageConsent}
                        onChange={(e) => setDataUsageConsent(e.target.checked)}
                        disabled={uploading}
                        className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded transition-colors"
                      />
                      <label
                        htmlFor="dataUsageConsent"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        <span className="font-medium">
                          I understand that my resume data will be processed by
                          AI systems
                        </span>{" "}
                        to generate personalized interview questions and improve
                        the interview experience.
                      </label>
                    </motion.div>

                    {/* Privacy Policy Consent */}
                    <motion.div
                      className="flex items-start space-x-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <input
                        type="checkbox"
                        id="privacyConsent"
                        checked={privacyConsent}
                        onChange={(e) => setPrivacyConsent(e.target.checked)}
                        disabled={uploading}
                        className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded transition-colors"
                      />
                      <label
                        htmlFor="privacyConsent"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        <span className="font-medium">
                          I agree to the Privacy Policy
                        </span>{" "}
                        and understand how my personal data will be handled,
                        stored, and protected.
                      </label>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  disabled={uploading}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={
                    !uploading && allConsentsGiven ? { scale: 1.05 } : {}
                  }
                  whileTap={
                    !uploading && allConsentsGiven ? { scale: 0.95 } : {}
                  }
                  onClick={handleSubmit}
                  disabled={uploading || !allConsentsGiven}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    uploading || !allConsentsGiven
                      ? "bg-orange-300 cursor-not-allowed text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {uploading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </motion.span>
                  ) : (
                    "Launch Interview →"
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {uploading && loadingStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-[999]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center space-y-6 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
              />

              <div className="space-y-2">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold text-gray-800"
                >
                  {loadingStage}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-500 max-w-md leading-relaxed"
                >
                  Please wait while SpeakPrep AI analyzes your resume and
                  prepares personalized interview questions...
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex space-x-1"
              >
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    className="w-2 h-2 bg-orange-500 rounded-full"
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResumeUploadModal;
