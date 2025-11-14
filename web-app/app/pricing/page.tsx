"use client";

import { Check } from "lucide-react";
import Navbar from "../components/Navbar";

export default function PricingPage() {
  return (
    <main
      className="min-h-screen bg-[#f3f3ef] text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Navbar />

      {/* HEADER */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-20 py-12 md:py-16 lg:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4">
          Simple, Transparent Pricing
        </h1>

        <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto px-4">
          SpeakPrep AI is currently <strong>completely free</strong> — you only
          need your own
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f43e02] font-semibold hover:underline ml-1"
          >
            Groq API key
          </a>
          to power the interviews.
        </p>

        {/* WHY API KEY (NEW SECTION) */}
        <p className="text-sm text-black/60 mt-4 max-w-xl mx-auto px-4">
          You use your own API key so SpeakPrep can stay free for everyone while
          maintaining fast, high-quality AI responses.
        </p>

        <div className="mt-6">
          <a href="/auth">
            <button
              style={{ backgroundColor: "#f43e02" }}
              className="text-white text-lg px-6 py-3 rounded-md shadow-md hover:scale-105 transition-transform"
            >
              Get Started Free
            </button>
          </a>
        </div>
      </section>

      {/* MAIN PRICING CARD */}
      <section className="flex justify-center px-4 sm:px-6">
        <div className="bg-white border border-black rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm hover:-translate-y-1 transition w-full max-w-2xl lg:max-w-4xl">
          {/* PLAN HEADER */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Free Tier
          </h2>

          <p className="text-black/70 text-base sm:text-lg mb-6 md:mb-8 max-w-3xl">
            Use SpeakPrep AI at no cost by connecting your free
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f43e02] font-semibold hover:underline ml-1"
            >
              Groq API key
            </a>
            . Practice real interviews with resume-based questions and
            AI-powered feedback.
          </p>

          {/* FEATURE LIST */}
          <ul className="space-y-4 sm:space-y-5 text-sm sm:text-base text-black/80 mb-8 md:mb-10">
            {[
              "Connect your own free Groq API key",
              "Daily usage resets every 24 hours",
              "Instant voice analysis and feedback",
              "Resume + job description tailored questions",
              "Access to HR, behavioral, and technical interview types",
              "Voice-based practice with real-time coaching",
              "Session history and answer review",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-start sm:items-center gap-3 sm:gap-4"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#f43e02] flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                  <Check
                    size={14}
                    color="#f43e02"
                    strokeWidth={3}
                    className="sm:w-4 sm:h-4"
                  />
                </div>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>

          {/* COMPARISON TABLE — NEW */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-10">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
              What’s Included
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm sm:text-base text-black/70">
              <p className="flex items-center gap-2">
                <Check color="#f43e02" size={18} /> AI Mock Interviews
              </p>
              <p className="flex items-center gap-2">
                <Check color="#f43e02" size={18} /> Voice Feedback
              </p>
              <p className="flex items-center gap-2">
                <Check color="#f43e02" size={18} /> Resume-Based Questions
              </p>
              <p className="flex items-center gap-2">
                <Check color="#f43e02" size={18} /> HR + Technical
              </p>
              <p className="flex items-center gap-2">
                <Check color="#f43e02" size={18} /> Daily Limits
              </p>
              <p className="flex items-center gap-2">
                <Check color="#f43e02" size={18} /> Free Forever (Beta)
              </p>
            </div>
          </div>

          {/* GROQ CTA */}
          <div className="bg-gray-50 rounded-lg p-6 sm:p-8 border border-gray-200 mb-6 md:mb-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-28 sm:w-32 text-gray-700 opacity-80">
                {/* Groq Logo */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1981.58 562.32"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1378.01.31h-.04c-109.6 0-198.78 89.18-198.78 198.78s89.18 198.78 198.78 198.78 198.78-89.18 198.78-198.81C1576.56 89.66 1487.4.5 1378.01.31m93.33 198.78c0 51.49-41.88 93.36-93.36 93.36s-93.36-41.88-93.36-93.36 41.88-93.36 93.36-93.36 93.36 41.87 93.36 93.36M908.86 180.75c.43-11.74 1.43-23.13 3.67-34.68l.05-.23c2.83-13.62 7.15-26.73 12.81-38.99 11.8-25.1 29.21-47.21 50.41-64.03 20.78-16.39 45.11-28.6 70.38-35.33 12.4-3.45 25.23-5.67 38.18-6.6 28.63-2.05 56.94 1.15 83.9 11.24 9.98 3.74 19.95 8.47 29.26 13.87l15.78 9.17-50.61 88.04-15.8-8.8c-10.95-6.1-22.78-9.84-35.16-11.11-12.97-1.17-26.36 0-38.93 3.43-11.9 3.18-23.24 8.94-32.86 16.64-9 7.25-16.26 16.51-20.96 26.71-5.08 11.01-6.98 23.13-6.98 35.17v199.17H908.85V180.75ZM873.03 187.44c-1.25-50.37-21.77-97.51-57.79-132.72C779.25 19.54 731.74.1 681.47 0h-1.63C574.85 0 488.97 85.15 488.05 190.59c-.45 51.35 19.07 99.82 54.95 136.49 35.9 36.68 83.86 57.12 135.2 57.57h58.51V282.78h-55.55c-24.09.33-46.84-8.87-64.06-25.73-17.24-16.87-26.88-39.48-27.14-63.68-.55-49.87 39.38-90.9 89.04-91.5h2.39c49.58 0 90.14 40.58 90.42 90.37v177.83c0 49.22-40.06 89.74-89.31 90.37-23.59-.18-45.76-9.55-62.43-26.43l-12.93-13.07-.05.05-51.98 91.8c34.69 31.66 79.12 49.17 126.28 49.52h2.59c50.55-.72 97.97-20.94 133.54-56.97 35.54-36.02 55.27-83.78 55.53-134.6V187.46H873v-.02ZM1790.21.29c-51.34 0-99.58 20.01-135.85 56.38-36.21 36.3-56.11 84.53-56.01 135.76 0 105.86 86.07 191.97 191.87 191.97h54.41V282.67h-54.41c-49.74 0-90.19-40.48-90.19-90.24s40.45-90.24 90.19-90.24c22.6 0 44.23 8.44 60.92 23.76 16.11 14.8 28.77 34.62 28.77 56.46v367.66h101.67V192.43c0-105.94-85.85-192.14-191.37-192.14M165.98 342.21H0L272.4 1.5l-68.75 220.11H369.6L97.23 562.32z"></path>
                </svg>
              </div>
            </div>

            <p className="text-center text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Get your free Groq API key to power SpeakPrep AI
            </p>

            <div className="text-center">
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="text-white text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 rounded-md font-semibold hover:scale-105 transition-transform w-full sm:w-auto"
                  style={{ backgroundColor: "#f43e02" }}
                >
                  Get Your Free Groq API Key
                </button>
              </a>
            </div>
          </div>

          {/* PRICE */}
          <div className="text-center border-t pt-6 md:pt-8">
            <p className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3">$0</p>
          </div>
        </div>
      </section>

      {/* PRO FEATURES COMING SOON (NEW) */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-20 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Coming Soon</h2>
        <p className="text-black/70 max-w-2xl mx-auto mb-8">
          We’re working on a Pro plan with advanced features to take your
          interview prep to the next level.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto text-black/80 text-sm sm:text-base">
          <p className="flex items-center gap-2 justify-center">
            <Check color="#f43e02" size={18} /> Unlimited interview sessions
          </p>
          <p className="flex items-center gap-2 justify-center">
            <Check color="#f43e02" size={18} /> Deep communication analytics
          </p>
          <p className="flex items-center gap-2 justify-center">
            <Check color="#f43e02" size={18} /> AI-powered answer rewriting
          </p>
          <p className="flex items-center gap-2 justify-center">
            <Check color="#f43e02" size={18} /> Behavioral pattern analysis
          </p>
          <p className="flex items-center gap-2 justify-center">
            <Check color="#f43e02" size={18} /> Industry-specific interview sets
          </p>
          <p className="flex items-center gap-2 justify-center">
            <Check color="#f43e02" size={18} /> Advanced scoring reports
          </p>
        </div>
      </section>
    </main>
  );
}
