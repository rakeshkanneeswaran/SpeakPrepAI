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

// ✅ Global SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://www.speakprepai.com"), // <-- ✅ use your actual domain
  title: {
    default: "SpeakPrep AI | Smart Interview Practice with Real-Time Feedback",
    template: "%s | SpeakPrep AI", // <-- automatically adds your brand to all subpages
  },
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
    "AI speaking practice",
    "AI voice interview tool",
  ],
  authors: [{ name: "SpeakPrep AI Team" }],
  creator: "SpeakPrep AI",
  publisher: "SpeakPrep AI",
  openGraph: {
    title: "SpeakPrep AI — Real Conversations. Smarter Interview Prep.",
    description:
      "Experience realistic AI mock interviews with instant feedback and performance insights. SpeakPrep AI helps you sound natural, confident, and ready for any interview.",
    url: "https://www.speakprepai.com",
    siteName: "SpeakPrep AI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/web-app/public/logo.png",
        width: 1200,
        height: 630,
        alt: "SpeakPrep AI – AI-powered interview preparation platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeakPrep AI | Practice Smarter Interviews",
    description:
      "AI interview prep platform that helps you improve through real conversations and personalized insights.",
    creator: "@speakprepai",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.speakprepai.com",
  },
  category: "Interview Preparation",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Add structured data for better Google understanding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SpeakPrep AI",
              url: "https://www.speakprepai.com",
              applicationCategory:
                "Education, Career, AI Interview Preparation",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "AI-powered interview preparation tool providing realistic mock interviews and personalized feedback.",
              creator: {
                "@type": "Organization",
                name: "SpeakPrep AI",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
