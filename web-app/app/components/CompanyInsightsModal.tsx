"use client";

import { useState } from "react";
import platformColors from "../utils/colors";

interface CompanyInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInsights: (companyName: string, companyWebsite: string) => void;
}

const CompanyInsightsModal: React.FC<CompanyInsightsModalProps> = ({
  isOpen,
  onClose,
  onViewInsights,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const handleSubmit = () => {
    if (!companyName.trim()) {
      alert("Please enter a company name.");
      return;
    }
    onViewInsights(companyName, companyWebsite);
  };

  const handleClose = () => {
    setCompanyName("");
    setCompanyWebsite("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
        style={{ borderColor: platformColors.borderColor }}
      >
        <h2 className="text-xl font-semibold mb-4">Enter Company Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Website (optional)
            </label>
            <input
              type="text"
              placeholder="https://company.com"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 shadow-sm"
          >
            View Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyInsightsModal;
