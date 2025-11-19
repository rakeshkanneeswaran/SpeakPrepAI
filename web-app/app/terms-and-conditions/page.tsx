"use client";

import Navbar from "../components/Navbar";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-[#f3f3ef] text-black">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <section className="px-6 md:px-20 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#f43e02]">
            Terms & Conditions
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to <strong>SpeakPrep AI</strong>. By accessing or using our
            platform, you agree to the following Terms & Conditions. Please read
            them carefully as they outline your rights, responsibilities, and
            usage guidelines.
          </p>

          {/* Section: Service Usage */}
          <h2 className="text-3xl font-semibold mt-10">
            1. Use of Our Service
          </h2>
          <p className="text-gray-700 leading-relaxed">
            SpeakPrep AI is an AI-powered mock interview simulator designed for
            educational and preparation purposes. Users agree not to misuse,
            copy, resell, or exploit the service in ways not intended.
          </p>

          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-3">
            <li>You must be at least 16 years old to use the service.</li>
            <li>
              You are responsible for the accuracy of the resume and data you
              upload.
            </li>
            <li>
              You may not attempt to reverse engineer or disrupt the platform.
            </li>
          </ul>

          {/* Section: Accounts */}
          <h2 className="text-3xl font-semibold mt-10">
            2. Account Responsibility
          </h2>
          <p className="text-gray-700 leading-relaxed">
            You are responsible for maintaining the confidentiality of your
            account and ensuring your login is not shared with unauthorized
            users.
          </p>

          {/* Section: Payments */}
          <h2 className="text-3xl font-semibold mt-10">
            3. Payments & Credits
          </h2>
          <p className="text-gray-700 leading-relaxed">
            SpeakPrep AI may offer free and paid features. Paid plans, credit
            bundles, or subscriptions are subject to applicable pricing and
            billing terms displayed at the time of purchase.
          </p>

          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-3">
            <li>
              No refunds are available once credits or paid features are used.
            </li>
            <li>
              For unused credits or payment disputes, refer to our Refund
              Policy.
            </li>
          </ul>

          {/* Section: AI Content */}
          <h2 className="text-3xl font-semibold mt-10">
            4. AI-Generated Content
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-3">
            <li>
              All interview questions, transcripts, and analysis are
              AI-generated.
            </li>
            <li>
              Users understand that AI-generated responses may contain errors or
              inconsistencies.
            </li>
            <li>
              SpeakPrep AI is not liable for decisions made based on the AI’s
              output.
            </li>
          </ul>

          {/* Section: Prohibited Uses */}
          <h2 className="text-3xl font-semibold mt-10">5. Prohibited Use</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Using the platform for illegal or harmful activities.</li>
            <li>Uploading abusive, harmful, or misleading content.</li>
            <li>
              Attempting to overload, hack, or compromise the system in any way.
            </li>
          </ul>

          {/* Section: Data & Privacy */}
          <h2 className="text-3xl font-semibold mt-10">
            6. Privacy & Data Protection
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By using SpeakPrep AI, you also agree to our{" "}
            <a href="/privacy-policy" className="text-[#f43e02] underline">
              Privacy Policy
            </a>
            , which outlines how your data is collected and used.
          </p>

          {/* Section: Termination */}
          <h2 className="text-3xl font-semibold mt-10">7. Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            We may suspend or terminate accounts that violate these terms or
            engage in misuse of the platform.
          </p>

          {/* Section: Changes */}
          <h2 className="text-3xl font-semibold mt-10">8. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update these Terms from time to time. Continued use of the
            platform after updates constitutes acceptance of the revised terms.
          </p>

          {/* Section: Contact */}
          <h2 className="text-3xl font-semibold mt-10">9. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about these Terms, reach us at:
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
