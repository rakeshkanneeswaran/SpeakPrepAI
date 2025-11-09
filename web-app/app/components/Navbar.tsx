"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="w-full flex flex-col md:grid md:grid-cols-3 items-center px-6 md:px-20 py-4 border-b-2 border-black/10 relative"
      style={{
        backgroundColor: "#f3f3ef",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Mobile Menu Button */}
      <div className="flex md:hidden w-full justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-black hover:text-[#f43e02] transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Logo */}
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

        {/* Mobile Login Button */}
        <Link
          href="/auth"
          className="text-[15px] font-medium hover:text-[#f43e02] transition-colors text-black"
        >
          Login
        </Link>
      </div>

      {/* Desktop Left Section */}
      <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-black flex-wrap">
        <Link
          href="/"
          className="hover:text-[#f43e02] transition-colors whitespace-nowrap"
        >
          Home
        </Link>

        <Link
          href="/pricing"
          className="hover:text-[#f43e02] transition-colors whitespace-nowrap"
        >
          Pricing
        </Link>

        <Link
          href="/mission"
          className="hover:text-[#f43e02] transition-colors whitespace-nowrap"
        >
          About
        </Link>

        <Link
          href="/team"
          className="hover:text-[#f43e02] transition-colors whitespace-nowrap"
        >
          Founder
        </Link>

        {/* More Dropdown for Desktop */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="flex items-center gap-1 hover:text-[#f43e02] transition-colors whitespace-nowrap"
          >
            More <ChevronDown size={16} />
          </button>

          {isMoreOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <Link
                  href="/infrastructure"
                  className="block px-4 py-2 text-sm hover:text-[#f43e02] hover:bg-orange-50 transition-colors text-black"
                  onClick={() => setIsMoreOpen(false)}
                >
                  Infrastructure
                </Link>
                <Link
                  href="/privacy"
                  className="block px-4 py-2 text-sm hover:text-[#f43e02] hover:bg-orange-50 transition-colors text-black"
                  onClick={() => setIsMoreOpen(false)}
                >
                  Privacy & Security
                </Link>
                <Link
                  href="/faqs"
                  className="block px-4 py-2 text-sm hover:text-[#f43e02] hover:bg-orange-50 transition-colors text-black"
                  onClick={() => setIsMoreOpen(false)}
                >
                  FAQs
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Center Logo */}
      <div className="hidden md:flex justify-center">
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight text-center whitespace-nowrap"
          style={{
            color: "#000",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          SpeakPrep<span style={{ color: "#f43e02" }}>AI</span>
        </Link>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center justify-end gap-6">
        <Link
          href="/auth"
          className="text-[15px] font-medium hover:text-[#f43e02] transition-colors whitespace-nowrap"
        >
          Login
        </Link>

        <Link href="/auth">
          <button
            className="text-white text-[15px] font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-transform whitespace-nowrap"
            style={{
              backgroundColor: "#f43e02",
            }}
          >
            Create Account
          </button>
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          className="md:hidden w-full bg-white border-t border-gray-200 mt-4 py-4 rounded-lg shadow-lg z-50 relative"
          ref={menuRef}
        >
          <div className="flex flex-col space-y-4 px-4">
            <Link
              href="/team"
              className="hover:text-[#f43e02] transition-colors py-2 border-b border-gray-100 text-black font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Founder
            </Link>
            <Link
              href="/"
              className="hover:text-[#f43e02] transition-colors py-2 border-b border-gray-100 text-black font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/pricing"
              className="hover:text-[#f43e02] transition-colors py-2 border-b border-gray-100 text-black font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>

            <Link
              href="/mission"
              className="hover:text-[#f43e02] transition-colors py-2 border-b border-gray-100 text-black font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/infrastructure"
              className="hover:text-[#f43e02] transition-colors py-2 border-b border-gray-100 text-black font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Infrastructure
            </Link>

            <Link
              href="/privacy"
              className="hover:text-[#f43e02] transition-colors py-2 border-b border-gray-100 text-black font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Privacy & Security
            </Link>

            <Link
              href="/faqs"
              className="hover:text-[#f43e02] transition-colors py-2 border-b border-gray-100 text-black font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQs
            </Link>

            <div className="pt-4 border-t border-gray-200">
              <Link href="/auth">
                <button
                  className="w-full text-white text-[15px] font-semibold px-5 py-3 rounded-full hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: "#f43e02",
                  }}
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
