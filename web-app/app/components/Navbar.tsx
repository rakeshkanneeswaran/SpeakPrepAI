"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="w-full grid grid-cols-3 items-center px-8 md:px-20 py-5 border-b-2  border-black/10"
      style={{
        backgroundColor: "#f3f3ef",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-8 text-[15px] font-medium text-black">
        <Link href="/" className="hover:text-[#f43e02] transition-colors">
          Home
        </Link>

        <Link
          href="/pricing"
          className="hover:text-[#f43e02] transition-colors"
        >
          Pricing
        </Link>

        <Link
          href="/mission"
          className="hover:text-[#f43e02] transition-colors"
        >
          About
        </Link>

        <Link href="/team" className="hover:text-[#f43e02] transition-colors">
          Team
        </Link>

        <Link
          href="/privacy"
          className="hover:text-[#f43e02] transition-colors"
        >
          Privacy & Security
        </Link>
      </div>

      {/* Center Logo */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight text-center"
          style={{
            color: "#000",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          SpeakPrep<span style={{ color: "#f43e02" }}>AI</span>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end gap-6">
        <Link
          href="/login"
          className="text-[15px] font-medium hover:text-[#f43e02] transition-colors"
        >
          Login
        </Link>

        <Link href="/early-access">
          <button
            className="text-white text-[15px] font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-transform"
            style={{
              backgroundColor: "#f43e02",
            }}
          >
            Early Access
          </button>
        </Link>
      </div>
    </nav>
  );
}
