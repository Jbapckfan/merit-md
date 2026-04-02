import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merit-MD | AI-Powered Medical Malpractice Case Assessment",
  description:
    "Instantly assess the merit of medical malpractice cases with AI-driven clinical analysis. Built by physicians, for attorneys.",
  keywords: [
    "medical malpractice",
    "case assessment",
    "clinical review",
    "AI analysis",
    "legal tech",
    "merit review",
  ],
  openGraph: {
    title: "Merit-MD | AI-Powered Medical Malpractice Case Assessment",
    description:
      "Stop wasting $500/hr on cases that go nowhere. Get an instant clinical merit review before you spend a dime on expert witnesses.",
    type: "website",
    siteName: "Merit-MD",
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
