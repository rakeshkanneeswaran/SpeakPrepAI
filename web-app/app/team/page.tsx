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
          We are a small, focused team obsessed with learning through practice.
          We do not believe in test prep that feels robotic. We build tools that
          mirror how people think, speak, and adapt in the real world.
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
              Rakesh Kanneeswaran
            </h2>
            <p className="text-white/80 text-[15px] leading-relaxed">
              I have sat on both sides of the interview table — anxious,
              curious, and often wishing I had a way to{" "}
              <em>practice for the real thing</em>. SpeakPrep AI was born from
              that feeling. A space where you can actually speak, learn, and
              improve without fear of judgment.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed">
              With experience building AI products at leading companies like{" "}
              <span className="text-[#E6DCAF]">Samsung</span> and fast-growing
              startups like{" "}
              <span className="text-[#E6DCAF]">Optimeleon AI</span>, I have seen
              how transformative AI can be when applied to real-world
              challenges.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed">
              Every part of this platform — from voice-powered sessions to
              AI-driven feedback — reflects the belief that preparation should
              not be theoretical. It should <em>feel</em> real.
            </p>
            <p className="text-[#E6DCAF]/90 text-[14px] italic">
              We are not just building software. We are helping people walk into
              opportunities with confidence.
            </p>
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
                Built AI systems for conversion optimization, helping companies
                achieve 10-20% conversion lifts through automated variant
                testing and real-time optimization.
              </p>
              <div className="text-white/60 text-xs">
                Developed web scraping, background job processing, and real-time
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
                Integrated Stable Diffusion XL with Fooocus to enable
                high-quality, precise image editing through natural language
                prompts and region-specific controls.
              </p>
              <div className="text-white/60 text-xs">
                Specialized in AI-powered image generation and web-based
                interface development.
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
            SpeakPrep AI is built for anyone who has ever felt unprepared before
            an interview — not because they lacked skill, but because they
            lacked a chance to <em>practice properly</em>. We exist to make that
            preparation accessible, fast, and human.
          </p>
          <p className="text-white/70 text-[14px] italic">
            Our mission is simple — help you sound like yourself, only more
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
