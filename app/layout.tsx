import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedMal Review Pro | AI-Powered Medical Chart Analysis",
  description:
    "AI-powered medical chart analysis for attorneys, hospitals, and clinicians. Screen malpractice cases in minutes with clinical-grade AI built by ER physicians.",
  keywords: [
    "medical malpractice",
    "case assessment",
    "clinical review",
    "AI analysis",
    "legal tech",
    "merit review",
    "medical chart analysis",
    "MedMal Review",
  ],
  openGraph: {
    title: "MedMal Review Pro | AI-Powered Medical Chart Analysis",
    description:
      "Stop wasting $500/hr on cases that go nowhere. Get an instant clinical merit review before you spend a dime on expert witnesses.",
    type: "website",
    siteName: "MedMal Review Pro",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-merit-bg text-merit-text font-sans">
        {children}
      </body>
    </html>
  );
}
