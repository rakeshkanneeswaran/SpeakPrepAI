import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeakPrep AI | Smart Interview Practice with Real-Time Feedback",
  description:
    "SpeakPrep AI helps you master interviews through realistic AI-driven conversations. Practice HR and technical interviews, receive instant personalized feedback, and improve your communication, confidence, and problem-solving skills — all in one platform.",
  keywords: [
    "AI interview preparation",
    "mock interview tool",
    "interview practice platform",
    "HR interview simulator",
    "technical interview questions",
    "AI-powered feedback",
    "real-time interview analysis",
    "communication skills training",
    "behavioral interview prep",
    "software engineering interview practice",
    "job interview practice AI",
    "interview simulation app",
    "interview coaching online",
    "AI mock interviews",
    "career preparation tool",
    "interview confidence builder",
  ],
  authors: [{ name: "SpeakPrep AI Team" }],
  openGraph: {
    title: "SpeakPrep AI — Real Conversations. Smarter Interview Prep.",
    description:
      "Experience realistic AI mock interviews with instant feedback and performance insights. SpeakPrep AI helps you sound natural, confident, and ready for any interview.",
    url: "https://speakprep.ai",
    siteName: "SpeakPrep AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeakPrep AI | Practice Smarter Interviews",
    description:
      "AI interview prep platform that helps you improve through real conversations and personalized insights.",
    creator: "@speakprepai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
