"use client";

import Navbar from "../components/Navbar";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-[#f3f3ef] text-black">
      <Navbar />

      <section className="px-6 md:px-20 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#f43e02]">
            Refund & Cancellation Policy
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed">
            At <strong>SpeakPrep AI</strong>, we want every user to feel
            confident and satisfied with their purchase. If for any reason you
            are unhappy with your experience, we offer a simple,
            no-questions-asked refund process.
          </p>

          {/* How Refund Works */}
          <h2 className="text-3xl font-semibold mt-10">How Refunds Work</h2>

          <p className="text-gray-700 leading-relaxed mt-3">
            To request a refund, simply email us at:
            <br />
            <strong>speakprepai@gmail.com</strong>
          </p>

          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-3">
            <li>No reason is required to request a refund.</li>
            <li>
              If you choose to share a reason, it is only used to help us
              improve the product — it will <strong>not</strong> impact your
              refund approval.
            </li>
            <li>Refunds are processed back to your original payment method.</li>
          </ul>

          {/* Refund Limitations */}
          <h2 className="text-3xl font-semibold mt-10">Eligibility</h2>

          <p className="text-gray-700 leading-relaxed mt-3">
            We issue refunds for unused credits or unused paid services.
          </p>

          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-3">
            <li>
              <strong>Used credits cannot be refunded</strong>, as the service
              has already been consumed.
            </li>
            <li>
              Refunds can be requested within <strong>7 days</strong> of
              purchase for unused credits.
            </li>
          </ul>

          {/* Cancellation */}
          <h2 className="text-3xl font-semibold mt-10">Cancellation</h2>

          <p className="text-gray-700 leading-relaxed mt-3">
            You may cancel your account or stop using the service at any time.
            Cancellation does not automatically initiate a refund — please email
            us if you need one.
          </p>

          {/* Contact */}
          <h2 className="text-3xl font-semibold mt-10">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For refund or cancellation requests, contact us at:
            <br />
            <strong>speakprepai@gmail.com</strong>
          </p>

          <p className="text-gray-500 text-sm mt-12">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </main>
  );
}
