/* eslint-disable react/no-unescaped-entities */
"use client";

import Navbar from "../components/Navbar";

export default function TeamPage() {
  const year = new Date().getFullYear();

  return (
    <main
      className="min-h-screen bg-[#0c0c0c] text-white"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#0c0c0c]/90 backdrop-blur-sm border-b border-white/10">
        <Navbar />
      </div>

      {/* Hero */}
      <section className="pt-40 pb-16 text-center px-6 md:px-20">
        <h1 className="text-6xl font-bold text-[#E6DCAF] mb-4">
          The Team Behind SpeakPrep AI
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          We're a focused team of engineers and dreamers passionate about making
          interview preparation feel natural, effective, and empowering. At
          SpeakPrep AI, we blend cutting-edge AI with real human communication
          insight to help people express their best selves.
        </p>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-6 md:px-20 bg-[#111] border-t border-[#E6DCAF]/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Founder Image */}
          <div className="flex-shrink-0">
            <img
              src="/founder.png"
              alt="Rakesh Kanneeswaran, Founder of SpeakPrep AI"
              className="w-64 h-80 rounded-2xl object-cover border border-[#E6DCAF]/40 shadow-[0_0_20px_rgba(230,220,175,0.15)]"
            />
          </div>

          {/* Founder Story */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-semibold text-[#E6DCAF]">
              Meet the Founder — Rakesh Kanneeswaran
            </h2>
            <p className="text-white/80 text-[15px] leading-relaxed">
              Rakesh is the founder and creator of <strong>SpeakPrep AI</strong>
              . A software engineer and AI enthusiast, he built this platform to
              help candidates overcome interview anxiety through realistic
              practice and actionable feedback. His goal is simple — make AI a
              tool for human confidence, not just automation.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed">
              Before founding SpeakPrep AI, Rakesh worked with global technology
              teams at <span className="text-[#E6DCAF]">Samsung</span> and
              contributed to fast-paced AI startups like{" "}
              <span className="text-[#E6DCAF]">Optimeleon AI</span>, building
              systems that applied AI to solve real human problems. His
              experiences there shaped his belief that learning through
              simulation is the key to confidence.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed">
              What began as a simple mock interview project now powers a
              full-fledged AI-driven learning platform — trusted by
              professionals to speak, respond, and grow smarter with every
              session.
            </p>
            <p className="text-[#E6DCAF]/90 text-[14px] italic">
              “We're not building an app — we're building confidence, one
              interview at a time.”
            </p>

            {/* LinkedIn Link */}
            <div className="pt-4">
              <a
                href="https://www.linkedin.com/in/rakeshkanneeswaran/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E6DCAF] text-[#0c0c0c] rounded-lg hover:bg-[#E6DCAF]/90 transition-colors font-medium text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect with Rakesh on LinkedIn
              </a>
              <p className="text-white/60 text-xs mt-2">
                Feel free to reach out — Rakesh is always happy to chat about
                AI, interviews, or building confidence through technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Philosophy */}
      <section className="py-24 px-6 md:px-20 bg-[#141414] border-t border-[#E6DCAF]/10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-semibold text-[#E6DCAF]">
            Our Philosophy
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-[15px] leading-relaxed">
            At SpeakPrep AI, we believe that technology should empower, not
            intimidate. Every feature we build focuses on helping users speak
            more confidently, think clearly under pressure, and reflect the best
            version of themselves during interviews.
          </p>
          <p className="text-white/70 text-[14px] italic">
            Real conversations build real confidence — and that's what drives us
            every single day.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-white/60 py-10 bg-[#0c0c0c] border-t border-white/10">
        © {year} SpeakPrep AI. All rights reserved.
      </footer>
    </main>
  );
}
