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
          Meet the Team Behind SpeakPrep AI
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          We're a small, focused team that believes great learning happens
          through real practice — not theory. Our goal is simple: make interview
          prep feel as natural as the conversations it's preparing you for.
        </p>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-6 md:px-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Founder Image */}
          <div className="flex-shrink-0">
            <img
              src="/founder.png"
              alt="Rakesh Kanneeswaran"
              className="w-64 h-80 rounded-2xl object-cover border border-[#E6DCAF]/40 shadow-[0_0_20px_rgba(230,220,175,0.15)]"
            />
          </div>

          {/* Founder Story */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-semibold text-[#E6DCAF]">
              Rakesh Maravar
            </h2>
            <p className="text-white/80 text-[15px] leading-relaxed">
              I've been on both sides of the interview table — nervous, curious,
              and often wishing for a space to <em>practice the real thing</em>.
              SpeakPrep AI started as that idea: a way to build confidence
              before it's showtime.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed">
              I've worked on AI products at{" "}
              <span className="text-[#E6DCAF]">Samsung</span> and fast-moving
              startups like{" "}
              <span className="text-[#E6DCAF]">Optimeleon AI</span>, where I saw
              how machine learning can shape real human outcomes. Those lessons
              live inside every part of SpeakPrep — from how it listens to how
              it gives feedback.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed">
              Everything here — the coaching engine, the analytics, the voice
              system — is built on one belief: good preparation should feel
              real, not rehearsed.
            </p>
            <p className="text-[#E6DCAF]/90 text-[14px] italic">
              We're not just writing code. We're helping people show up as their
              best selves when it matters most.
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
                Feel free to reach out — I'm always happy to chat about AI,
                interviews, or your career journey!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Experience Section */}
      <section className="py-24 px-6 md:px-20 bg-[#141414]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold text-[#E6DCAF] text-center mb-16">
            Building AI That Matters
          </h2>

          {/* Experience Highlights */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Optimeleon AI */}
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#E6DCAF]/20">
              <h3 className="text-xl font-semibold text-white mb-2">
                Optimeleon AI
              </h3>
              <p className="text-[#E6DCAF] text-sm mb-4">
                Software Engineer · €1.5M Pre-seed
              </p>
              <p className="text-white/70 text-sm mb-4">
                Built optimization systems that helped clients achieve 10–20%
                higher conversions using automated testing and adaptive AI
                insights.
              </p>
              <div className="text-white/60 text-xs">
                Focused on backend architecture, data pipelines, and real-time
                analytics dashboards.
              </div>
            </div>

            {/* Samsung */}
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#E6DCAF]/20">
              <h3 className="text-xl font-semibold text-white mb-2">Samsung</h3>
              <p className="text-[#E6DCAF] text-sm mb-4">
                Software Engineer Intern
              </p>
              <p className="text-white/70 text-sm mb-4">
                Integrated Stable Diffusion XL with Fooocus to power precise,
                AI-driven image editing through natural language prompts and
                targeted controls.
              </p>
              <div className="text-white/60 text-xs">
                Specialized in generative AI, fine-tuning models, and building
                web-based tools for creative automation.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-semibold text-[#E6DCAF]">
            What Drives Us
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-[15px] leading-relaxed">
            SpeakPrep AI exists for anyone who's ever felt capable but caught
            off-guard in an interview — not because they weren't skilled, but
            because they didn't get to <em>practice properly</em>. We're here to
            change that.
          </p>
          <p className="text-white/70 text-[14px] italic">
            Our mission is simple: help you sound like yourself — only more
            confident.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-white/60 py-10 bg-[#0c0c0c] border-t border-white/10">
        © {year} SpeakPrep AI
      </footer>
    </main>
  );
}
