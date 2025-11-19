"use client";

import Navbar from "../components/Navbar";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#f3f3ef] text-black">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <section className="px-6 md:px-20 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#f43e02]">Privacy Policy</h1>

          <p className="text-lg text-gray-700 leading-relaxed">
            At <strong>SpeakPrep AI</strong> (“we”, “our”, “us”), we are
            committed to protecting your personal information and being
            transparent about how it is used. This Privacy Policy explains the
            data we collect, why we collect it, and how it is handled.
          </p>

          <h2 className="text-3xl font-semibold mt-10">
            Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Name and email when you register.</li>
            <li>
              Resume and job description uploads for generating interview
              questions.
            </li>
            <li>
              Interview responses, transcripts, and analysis generated during
              your sessions.
            </li>
            <li>
              Technical details such as device, browser, and IP for security.
            </li>
          </ul>

          <h2 className="text-3xl font-semibold mt-10">
            How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>
              To personalize interview questions based on your resume & job
              role.
            </li>
            <li>
              To provide voice-based interviews and AI-driven post-analysis.
            </li>
            <li>
              To improve features, user experience, and platform reliability.
            </li>
            <li>To maintain security and prevent abuse of the service.</li>
          </ul>

          <h2 className="text-3xl font-semibold mt-10">
            Data Storage & Security
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We take data security seriously. Your interview responses and audio
            are processed securely and <strong>never stored permanently</strong>
            beyond what is required for generating your analysis.
          </p>

          <h2 className="text-3xl font-semibold mt-10">Third-Party Services</h2>
          <p className="text-gray-700 leading-relaxed">
            We may use trusted third-party AI providers such as Groq to process
            your interview content. All partners follow strong data protection
            and security guidelines.
          </p>

          <h2 className="text-3xl font-semibold mt-10">Cookies & Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies for login sessions, user preferences, and analytics.
          </p>

          <h2 className="text-3xl font-semibold mt-10">Your Rights</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Request a copy of your stored data.</li>
            <li>Request deletion of your account.</li>
            <li>Opt out of non-essential cookies.</li>
          </ul>

          <h2 className="text-3xl font-semibold mt-10">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For privacy-related questions or concerns, reach us at:
            <br />
            <strong>speakprepai.com</strong>
          </p>

          <p className="text-gray-500 text-sm mt-12">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </main>
  );
}
