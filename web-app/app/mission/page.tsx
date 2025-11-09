"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";

export default function MissionPage() {
  return (
    <main
      className="min-h-screen bg-[#f3f2ef] text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="fixed top-0 left-0 w-full z-50 bg-[#f3f2ef]/95 backdrop-blur-md">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-20 text-center">
        <h1 className="text-6xl font-bold mb-4">Our Mission</h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto">
          Empower every candidate to walk into an interview confident, prepared,
          and ready to perform — with the power of AI-driven practice.
        </p>
      </section>

      {/* Challenge Section */}
      <section className="px-6 md:px-20 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-black/10 p-10 md:p-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-[#f43e02]">
            The Challenge
          </h2>
          <p className="text-black/80 leading-relaxed text-[15px]">
            Today’s job market is competitive and uneven. In India, only{" "}
            <strong>32%</strong> of job-seekers feel prepared for interviews{" "}
            <a
              href="https://economictimes.indiatimes.com/jobs/hr-policies-trends/just-one-third-of-job-seekers-consider-themselves-prepared-for-interviews-report/articleshow/121361553.cms"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Economic Times, 2025)
            </a>
            . Globally, only <strong>2%–3%</strong> of applicants get an
            interview call{" "}
            <a
              href="https://teamstage.io/job-interview-statistics/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (TeamStage)
            </a>
            , while some reports show 250+ applications for every single job{" "}
            <a
              href="https://resume.io/blog/interview-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Resume.io)
            </a>
            . Recruiters themselves confirm that interview readiness is one of
            the top barriers to hiring success{" "}
            <a
              href="https://recruitcrm.io/blogs/job-interview-statistics/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (RecruitCRM)
            </a>
            .
          </p>
          <p className="text-black/80 leading-relaxed mt-4 text-[15px]">
            A recent study found that <strong>40%</strong> of unemployed
            candidates haven’t had a single interview in a year{" "}
            <a
              href="https://americanstaffing.net/posts/2024/11/20/hopeless-hunting/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (American Staffing Association)
            </a>
            . And even when they do, <strong>20%</strong> reject offers due to a
            poor or stressful interview experience{" "}
            <a
              href="https://www.selectsoftwarereviews.com/blog/recruiting-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Select Software Reviews)
            </a>
            . The problem isn’t talent — it’s the lack of guided, adaptive
            preparation.
          </p>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-black text-white py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "AI-Simulated Interviews",
              desc: "Experience realistic voice-based sessions tailored to your role and target company.",
            },
            {
              title: "Actionable Feedback",
              desc: "Instant AI analysis of your tone, clarity, and technical depth, improving with each attempt.",
            },
            {
              title: "Company-Specific Insights",
              desc: "Understand what recruiters actually evaluate — powered by data from real hiring patterns.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-[#141414] rounded-2xl border border-white/10 p-8 text-center hover:-translate-y-1 transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#E6DCAF]">
                {card.title}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="py-24 px-6 md:px-20 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-semibold text-[#f43e02]">
            Why It Matters
          </h2>
          <p className="text-black/80 text-[15px] leading-relaxed">
            Every interview is a gateway to opportunity. Yet, when only one in
            three candidates feels ready, ambition is held back. Studies show
            that candidates using smart preparation tools report{" "}
            <strong>58% higher confidence</strong> before interviews{" "}
            <a
              href="https://novoresume.com/career-blog/job-interview-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Novorésumé)
            </a>{" "}
            and are <strong>2×</strong> more likely to receive job offers{" "}
            <a
              href="https://qureos.com/career-guide/job-interview-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Qureos)
            </a>
            . With remote interviews now making up <strong>82%</strong> of
            sessions{" "}
            <a
              href="https://www.testgorilla.com/blog/job-interview-statistics/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (TestGorilla)
            </a>
            , adaptability and real-time AI feedback have become essential.
          </p>
        </div>
      </section>

      {/* Promise */}
      <section className="py-20 bg-[#f43e02] text-white text-center px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Our Promise</h2>
          <p className="text-white/90 text-[15px] leading-relaxed">
            • Preparation that feels real — not rehearsed. <br />
            • Built with fairness, privacy, and encryption by design. <br />
            • Designed for every learner — from fresh graduates to senior
            professionals aiming higher. <br />• Always fast, secure, and
            feedback-driven.
          </p>

          <div className="mt-10">
            <Link href="/auth">
              <button className="bg-white text-[#f43e02] font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sources Footer */}
      <footer className="text-center text-sm text-black/60 py-10">
        <p>
          Sources:{" "}
          <a
            href="https://economictimes.indiatimes.com/jobs/hr-policies-trends/just-one-third-of-job-seekers-consider-themselves-prepared-for-interviews-report/articleshow/121361553.cms"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Economic Times (2025)
          </a>
          ,{" "}
          <a
            href="https://teamstage.io/job-interview-statistics/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            TeamStage
          </a>
          ,{" "}
          <a
            href="https://resume.io/blog/interview-statistics"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Resume.io
          </a>
          ,{" "}
          <a
            href="https://recruitcrm.io/blogs/job-interview-statistics/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            RecruitCRM
          </a>
          ,{" "}
          <a
            href="https://americanstaffing.net/posts/2024/11/20/hopeless-hunting/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            American Staffing Association
          </a>
          ,{" "}
          <a
            href="https://www.selectsoftwarereviews.com/blog/recruiting-statistics"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Select Software Reviews
          </a>
          ,{" "}
          <a
            href="https://qureos.com/career-guide/job-interview-statistics"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Qureos
          </a>
          ,{" "}
          <a
            href="https://www.testgorilla.com/blog/job-interview-statistics/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            TestGorilla
          </a>
          ,{" "}
          <a
            href="https://passivesecrets.com/job-interview-statistics/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Passivesecrets
          </a>
          ,{" "}
          <a
            href="https://novoresume.com/career-blog/job-interview-statistics"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Novorésumé
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
