/* eslint-disable react/no-unescaped-entities */
"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";

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
        <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          We're a small but passionate group of builders who believe that
          interview preparation should feel natural, empowering, and accessible
          — not overwhelming. Our mission is simple: help people speak with
          clarity, confidence, and purpose.
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
              Meet the Founder —{" "}
              <span className="underline underline-offset-4 decoration-[#E6DCAF]/70">
                Rakesh Kanneeswaran
              </span>
            </h2>

            <p className="text-white/80 text-[15px] leading-relaxed">
              Rakesh is the creator of <strong>SpeakPrep AI</strong>, a platform
              built from a deeply personal struggle: freezing in interviews,
              forgetting answers, and losing confidence despite knowing the
              skills. He realized millions face the same challenge — not due to
              lack of knowledge, but lack of structured, real-time practice.
            </p>

            <p className="text-white/80 text-[15px] leading-relaxed">
              With engineering experience at{" "}
              <span className="text-[#E6DCAF]">Samsung</span> and contributions
              to fast-moving AI startups like{" "}
              <span className="text-[#E6DCAF]">Optimeleon AI</span>, Rakesh
              learned first-hand how AI can elevate human ability — not replace
              it. That philosophy is now the foundation of SpeakPrep: AI as a
              tool for confidence, communication, and growth.
            </p>

            <p className="text-white/80 text-[15px] leading-relaxed">
              What began as a small project to help friends practice interviews
              has evolved into a fully realized platform, empowering candidates
              to speak more clearly, structure answers better, and express their
              best selves in every interview.
            </p>

            <p className="text-[#E6DCAF]/90 text-[14px] italic">
              “We're not just building an app — we're building confidence, one
              conversation at a time.”
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
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect with Rakesh on LinkedIn
              </a>

              <p className="text-white/60 text-xs mt-2">
                Rakesh loves connecting with students, engineers, and builders —
                feel free to say hi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6 md:px-20 bg-[#141414] border-t border-[#E6DCAF]/10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-semibold text-[#E6DCAF]">
            Our Philosophy
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-[15px] leading-relaxed">
            We believe meaningful confidence is built, not wished for. Every
            feature we design focuses on helping users communicate better, think
            clearly under pressure, and become the strongest version of
            themselves — whether it’s their first interview or their fiftieth.
          </p>
          <p className="text-white/70 text-[14px] italic">
            Real conversations build real confidence — and that drives us every
            day.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 px-6 md:px-20 bg-[#0f0f0f] border-t border-[#E6DCAF]/10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-semibold text-[#E6DCAF]">
            Our Approach
          </h2>

          <div className="space-y-6 text-white/80 text-[15px] leading-relaxed max-w-3xl mx-auto">
            <p>
              • AI meets human communication science — every feature is built to
              reflect how real conversations actually work.
            </p>
            <p>
              • Fast iterations, constant refinement — we ship improvements
              weekly based on how real candidates use the platform.
            </p>
            <p>
              • Accessibility first — interview skills shouldn’t be a privilege
              only some people can afford.
            </p>
            <p>
              • Built with empathy — because behind every interview is a person
              chasing an opportunity that could change their life.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-[#0c0c0c]">
        <Link href="/auth">
          <button className="bg-[#E6DCAF] text-[#0c0c0c] font-semibold text-lg px-10 py-4 rounded-full hover:scale-105 transition-transform">
            Start Your Interview Practice
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-white/60 py-10 bg-[#0c0c0c] border-t border-white/10">
        © {year} SpeakPrep AI. All rights reserved.
      </footer>
    </main>
  );
}
