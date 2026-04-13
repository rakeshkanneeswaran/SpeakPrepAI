"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="w-full flex flex-col md:grid md:grid-cols-3 items-center px-6 md:px-20 py-4 border-b-2 border-black/10 relative"
      style={{
        backgroundColor: "#f3f3ef",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* MOBILE HEADER */}
      <div className="flex md:hidden w-full justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-black hover:text-[#f43e02] transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-center"
          style={{
            color: "#000",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          SpeakPrep<span style={{ color: "#f43e02" }}>AI</span>
        </Link>

        <Link
          href="/login"
          className="text-[15px] font-medium hover:text-[#f43e02] transition-colors text-black"
        >
          Login
        </Link>
      </div>

      {/* DESKTOP LEFT MENU */}
      <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-black flex-wrap">
        <Link href="/" className="hover:text-[#f43e02] transition-colors">
          Home
        </Link>

        <Link
          href="/pricing"
          className="hover:text-[#f43e02] transition-colors"
        >
          Pricing
        </Link>

        <Link href="/team" className="hover:text-[#f43e02] transition-colors">
          Founder
        </Link>

        {/* MORE DROPDOWN */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="flex items-center gap-1 hover:text-[#f43e02] transition-colors whitespace-nowrap"
          >
            More <ChevronDown size={16} />
          </button>

          {isMoreOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2 text-black">
                {/* Product section */}

                <Link
                  href="/privacy"
                  className="block px-4 py-2 text-sm hover:text-[#f43e02] hover:bg-orange-50 transition-colors"
                  onClick={() => setIsMoreOpen(false)}
                >
                  Privacy & Security
                </Link>

                <Link
                  href="/faqs"
                  className="block px-4 py-2 text-sm hover:text-[#f43e02] hover:bg-orange-50 transition-colors"
                  onClick={() => setIsMoreOpen(false)}
                >
                  FAQs
                </Link>

                {/* Divider */}
                <div className="my-2 border-t border-gray-200" />

                <Link
                  href="/terms-and-conditions"
                  className="block px-4 py-2 text-sm hover:text-[#f43e02] hover:bg-orange-50 transition-colors"
                  onClick={() => setIsMoreOpen(false)}
                >
                  Terms & Conditions
                </Link>

                <Link
                  href="/refund-policy"
                  className="block px-4 py-2 text-sm hover:text-[#f43e02] hover:bg-orange-50 transition-colors"
                  onClick={() => setIsMoreOpen(false)}
                >
                  Refund Policy
                </Link>

                <Link
                  href="/contact-us"
                  className="block px-4 py-2 text-sm hover:text-[#f43e02] hover:bg-orange-50 transition-colors"
                  onClick={() => setIsMoreOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP CENTER LOGO */}
      <div className="hidden md:flex justify-center">
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: "#000", fontFamily: "Montserrat, sans-serif" }}
        >
          SpeakPrep<span style={{ color: "#f43e02" }}>AI</span>
        </Link>
      </div>

      {/* DESKTOP RIGHT SIDE */}
      <div className="hidden md:flex items-center justify-end gap-6">
        <Link
          href="/login"
          className="text-[15px] hover:text-[#f43e02] transition-colors"
        >
          Login
        </Link>

        <Link href="/login">
          <button
            className="text-white text-[15px] font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-transform"
            style={{ backgroundColor: "#f43e02" }}
          >
            Create Account
          </button>
        </Link>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div
          className="md:hidden w-full bg-white border-t border-gray-200 mt-4 py-4 rounded-lg shadow-lg z-50"
          ref={menuRef}
        >
          <div className="flex flex-col space-y-4 px-4 text-black font-medium">
            <Link
              href="/team"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b hover:text-[#f43e02]"
            >
              Founder
            </Link>

            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b hover:text-[#f43e02]"
            >
              Home
            </Link>

            <Link
              href="/pricing"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b hover:text-[#f43e02]"
            >
              Pricing
            </Link>

            <Link
              href="/privacy"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b hover:text-[#f43e02]"
            >
              Privacy & Security
            </Link>

            <Link
              href="/faqs"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b hover:text-[#f43e02]"
            >
              FAQs
            </Link>

            {/* LEGAL SECTION MOBILE */}
            <div className="border-t pt-4">
              <Link
                href="/privacy-policy"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:text-[#f43e02]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:text-[#f43e02]"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/refund-policy"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:text-[#f43e02]"
              >
                Refund Policy
              </Link>
              <Link
                href="/contact-us"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:text-[#f43e02]"
              >
                Contact Us
              </Link>
            </div>

            <div className="pt-4 border-t">
              <Link href="/login">
                <button
                  className="w-full text-white text-[15px] font-semibold px-5 py-3 rounded-full hover:scale-105 transition-transform"
                  style={{ backgroundColor: "#f43e02" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
