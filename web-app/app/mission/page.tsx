"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";

export default function MissionPage() {
  return (
    <main
      className="min-h-screen bg-[#f3f2ef] text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#f3f2ef]/95 backdrop-blur-md">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-20 text-center">
        <h1 className="text-6xl font-bold mb-4">Our Mission</h1>

        {/* ✅ UPDATED LINE */}
        <p className="text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
          To help every candidate walk into an interview calm, prepared, and
          confident — through realistic AI interview practice and post-session
          analysis.
        </p>
      </section>

      {/* Why SpeakPrep Exists */}
      <section className="px-6 md:px-20 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-black/10 p-10 md:p-16 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 text-[#f43e02]">
            Why SpeakPrep Exists
          </h2>

          <p className="text-black/80 leading-relaxed text-[15px] max-w-3xl mx-auto">
            Interviews are stressful. People freeze. Many talented candidates
            get rejected — not because they lack skill, but because they lack
            guided, realistic practice. Nobody teaches communication,
            confidence, tone, or structure. We built SpeakPrep so no one has to
            face interviews unprepared or alone again.
          </p>
        </div>
      </section>

      {/* Fast Stat Highlights */}
      <section className="py-10 px-6 md:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
          {[
            { stat: "32%", label: "Feel interview-ready" },
            { stat: "250+", label: "Applicants per job" },
            { stat: "82%", label: "Interviews now remote" },
          ].map((item) => (
            <div
              key={item.stat}
              className="bg-white border border-black/10 rounded-xl p-8 shadow-sm"
            >
              <p className="text-4xl font-bold text-[#f43e02]">{item.stat}</p>
              <p className="text-black/70 mt-2 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Challenge Section */}
      <section className="px-6 md:px-20 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-black/10 p-10 md:p-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-[#f43e02]">
            The Challenge
          </h2>

          <p className="text-black/80 leading-relaxed text-[15px]">
            The job market has never been more competitive — or more uneven. In
            India, only <strong>32%</strong> of job seekers feel ready to face
            an interview{" "}
            <a
              href="https://economictimes.indiatimes.com/jobs/hr-policies-trends/just-one-third-of-job-seekers-consider-themselves-prepared-for-interviews-report/articleshow/121361553.cms"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Economic Times, 2025)
            </a>
            . Globally, just <strong>2–3%</strong> of applicants even reach the
            interview stage{" "}
            <a
              href="https://teamstage.io/job-interview-statistics/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (TeamStage)
            </a>{" "}
            , and many openings receive over <strong>250</strong> applications{" "}
            <a
              href="https://resume.io/blog/interview-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Resume.io)
            </a>
            .
          </p>

          <p className="text-black/80 leading-relaxed mt-4 text-[15px]">
            Nearly <strong>40%</strong> of unemployed professionals haven’t had
            a single interview in the past year{" "}
            <a
              href="https://americanstaffing.net/posts/2024/11/20/hopeless-hunting/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (American Staffing Association)
            </a>
            . And when they do, <strong>1 in 5</strong> candidates decline
            offers because of stressful interview experiences{" "}
            <a
              href="https://www.selectsoftwarereviews.com/blog/recruiting-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Select Software Reviews)
            </a>
            . This isn’t a talent problem — it’s a preparation gap.
          </p>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-6 md:px-20 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-semibold text-[#f43e02]">
            Why It Matters
          </h2>

          <p className="text-black/80 text-[15px] leading-relaxed">
            Structured practice leads to <strong>58% higher confidence</strong>{" "}
            before interviews{" "}
            <a
              href="https://novoresume.com/career-blog/job-interview-statistics"
              className="text-[#f43e02] underline"
              target="_blank"
            >
              (Novorésumé)
            </a>
            , and candidates who prepare intentionally are{" "}
            <strong>2× more likely</strong> to receive job offers{" "}
            <a
              href="https://qureos.com/career-guide/job-interview-statistics"
              className="text-[#f43e02] underline"
              target="_blank"
            >
              (Qureos)
            </a>
            . With <strong>82%</strong> of interviews now remote{" "}
            <a
              href="https://www.testgorilla.com/blog/job-interview-statistics/"
              className="text-[#f43e02] underline"
              target="_blank"
            >
              (TestGorilla)
            </a>
            , being adaptable, confident, and well-structured isn’t optional —
            it’s essential.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 px-6 md:px-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold mb-4 text-[#f43e02]">
            Our Vision
          </h2>
          <p className="text-black/80 text-[15px] leading-relaxed">
            A world where interview anxiety never decides someone’s future. A
            world where everyone — no matter their background — has access to
            high-quality preparation, guidance, and confidence-building tools.
          </p>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 bg-[#f43e02] text-white text-center px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Our Promise</h2>
          <p className="text-white/90 text-[15px] leading-relaxed space-y-2">
            <br />• Practice that adapts to you — not generic templates.
            <br />• Built for real interviews, not scripted answers.
            <br />• Designed for every learner, from freshers to professionals.
            <br />• Always improving, always fair, always fast.
          </p>

          <div className="mt-10">
            <Link href="/login">
              <button className="bg-white text-[#f43e02] font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-black/60 py-10">
        <p className="max-w-3xl mx-auto leading-relaxed">
          Sources: Economic Times, TeamStage, Resume.io, RecruitCRM, American
          Staffing Association, Select Software Reviews, Qureos, TestGorilla,
          Novorésumé.
        </p>
      </footer>
    </main>
  );
}
