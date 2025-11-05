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
          Meet the Team Behind SpeakPrep AI
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          We’re a small, focused team obsessed with learning through practice.
          We don’t believe in test prep that feels robotic. We build tools that
          mirror how people think, speak, and adapt in the real world.
        </p>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-6 md:px-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Founder Image */}
          <div className="flex-shrink-0">
            <img
              src="/founder.jpeg"
              alt="Rakesh Kanneeswaran"
              className="w-64 h-64 rounded-2xl object-cover border border-[#E6DCAF]/40 shadow-[0_0_20px_rgba(230,220,175,0.15)]"
            />
          </div>

          {/* Founder Story */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-semibold text-[#E6DCAF]">
              Rakesh Kanneeswaran
            </h2>
            <p className="text-white/80 text-[15px] leading-relaxed">
              I’ve sat on both sides of the interview table — anxious, curious,
              and often wishing I had a way to{" "}
              <em>practice for the real thing</em>. SpeakPrep AI was born from
              that feeling. A space where you can actually speak, learn, and
              improve without fear of judgment.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed">
              Every part of this platform — from voice-powered sessions to
              AI-driven feedback — reflects the belief that preparation
              shouldn’t be theoretical. It should <em>feel</em> real.
            </p>
            <p className="text-[#E6DCAF]/90 text-[14px] italic">
              “We’re not just building software. We’re helping people walk into
              opportunities with confidence.”
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-[#141414] py-24 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-semibold text-[#E6DCAF]">
            What Drives Us
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-[15px] leading-relaxed">
            SpeakPrep AI is built for anyone who’s ever felt unprepared before
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
        © {year} SpeakPrep AI · Built with purpose by Rakesh Kanneeswaran.
      </footer>
    </main>
  );
}
