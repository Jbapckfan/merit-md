"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─────────────────────────── icons ─────────────────────────── */

function ShieldHeartIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function ScalesIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z"
      />
    </svg>
  );
}

function StethoscopeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

/* ─────────────────────────── card data ─────────────────────────── */

const cards = [
  {
    icon: ShieldHeartIcon,
    iconColor: "text-[#22c55e]",
    iconBg: "bg-[#22c55e]/10 border-[#22c55e]/20",
    glowColor: "rgba(34, 197, 94, 0.15)",
    headline: "Review Your Care",
    description:
      "Upload your medical records and find out in minutes if you received appropriate care. Plain-language answers, no legal jargon.",
    priceTag: "Starting at $49",
    buttonText: "Check My Case",
    href: "/patient",
    brand: "MedMal Review Buddy",
    subOptions: null,
  },
  {
    icon: ScalesIcon,
    iconColor: "text-[#4f8ff7]",
    iconBg: "bg-[#4f8ff7]/10 border-[#4f8ff7]/20",
    glowColor: "rgba(79, 143, 247, 0.15)",
    headline: "Screen & Analyze Cases",
    description: null,
    priceTag: "From $149/scan",
    buttonText: "Start Analysis",
    href: "/attorney",
    brand: "MedMal Review Pro",
    subOptions: [
      {
        title: "Case Screening",
        desc: "Quickly assess if a prospective case has merit before investing time and money. AI-powered standard-of-care deviation analysis.",
      },
      {
        title: "Deep Dive Analysis",
        desc: "Already have a case? Get comprehensive medical-legal analysis -- standard of care deviations, causation mapping, defense vulnerabilities, expert witness recommendations, and state-specific law.",
      },
    ],
  },
  {
    icon: StethoscopeIcon,
    iconColor: "text-[#a78bfa]",
    iconBg: "bg-[#a78bfa]/10 border-[#a78bfa]/20",
    glowColor: "rgba(167, 139, 250, 0.15)",
    headline: "Protect Your Practice",
    description:
      "Real-time chart review for your shift. Complaint-specific red flags, must-document items, dispo traps, and return precautions -- in 10 seconds.",
    priceTag: "Free",
    buttonText: "Open Clinical Tool",
    href: "/clinician",
    brand: "MedMal Review Pro",
    subOptions: null,
  },
];

const trustBadges = [
  "HIPAA Compliant",
  "Built by ER Physicians",
  "Board-Certified Review Available",
];

/* ─────────────────────────── main page ─────────────────────────── */

export default function GatewayPage() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* ── Animated Gradient Mesh Background ── */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.07]"
            style={{
              background: "radial-gradient(circle, #4f8ff7 0%, transparent 70%)",
              animation: "floatOrb1 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(circle, #6ba1ff 0%, transparent 70%)",
              animation: "floatOrb2 25s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-[40%] left-[50%] w-[40vw] h-[40vw] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, #9490b0 0%, transparent 70%)",
              animation: "floatOrb3 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundSize: "128px 128px",
            }}
          />
        </div>

        {/* ── CSS Animations ── */}
        <style jsx global>{`
          @keyframes floatOrb1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(5%, 8%) scale(1.05); }
            66% { transform: translate(-3%, -5%) scale(0.95); }
          }
          @keyframes floatOrb2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-4%, -6%) scale(1.1); }
            66% { transform: translate(6%, 3%) scale(0.9); }
          }
          @keyframes floatOrb3 {
            0%, 100% { transform: translate(-50%, 0) scale(1); }
            50% { transform: translate(-50%, -8%) scale(1.15); }
          }
        `}</style>

        {/* ══════════════════ HERO ══════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12">
          {/* Headline */}
          <motion.div
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
              AI-Powered Medical{" "}
              <span className="bg-gradient-to-r from-[#4f8ff7] to-[#a78bfa] bg-clip-text text-transparent">
                Chart Intelligence
              </span>
            </h1>
            <p className="text-[#9490b0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Built by emergency physicians. Trusted by attorneys. Used by clinicians.
            </p>
          </motion.div>

          {/* ── Three Cards ── */}
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.headline}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.15,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  whileHover={{
                    y: -8,
                    boxShadow: `0 25px 60px ${card.glowColor}`,
                  }}
                  className="relative group bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 flex flex-col
                             hover:border-[#3d3660] transition-colors duration-300"
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${card.iconBg} border flex items-center justify-center mb-6`}
                  >
                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>

                  {/* Headline */}
                  <h2 className="text-[#e5e2ff] text-2xl font-bold mb-3">
                    {card.headline}
                  </h2>

                  {/* Description or sub-options */}
                  {card.description ? (
                    <p className="text-[#9490b0] text-sm leading-relaxed mb-4 flex-1">
                      {card.description}
                    </p>
                  ) : card.subOptions ? (
                    <div className="space-y-4 mb-4 flex-1">
                      {card.subOptions.map((opt) => (
                        <div key={opt.title}>
                          <h3 className="text-[#e5e2ff] text-sm font-semibold mb-1">
                            {opt.title}
                          </h3>
                          <p className="text-[#9490b0] text-xs leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Price tag */}
                  <div className="mb-5">
                    <span className="text-[#e5e2ff] text-sm font-semibold bg-[#1c1729] border border-[#2a2440] px-3 py-1 rounded-full">
                      {card.priceTag}
                    </span>
                  </div>

                  {/* Brand label */}
                  <p className="text-[#9490b0]/60 text-xs uppercase tracking-wider font-medium mb-4">
                    {card.brand}
                  </p>

                  {/* CTA button */}
                  <Link
                    href={card.href}
                    className={`block text-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                      ${
                        i === 1
                          ? "bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white shadow-lg shadow-[#4f8ff7]/20 hover:shadow-[#4f8ff7]/40"
                          : "border border-[#2a2440] hover:border-[#4f8ff7]/50 text-[#e5e2ff] hover:bg-[#4f8ff7]/10"
                      }`}
                  >
                    {card.buttonText}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── Stats Bar ── */}
          <AnimatedSection className="w-full max-w-5xl mx-auto mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#e5e2ff]">
                  <CountUp target={2800} suffix="+" />
                </div>
                <p className="text-[#9490b0] text-xs mt-1">Cases Analyzed</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#e5e2ff]">
                  <CountUp target={340} suffix="+" />
                </div>
                <p className="text-[#9490b0] text-xs mt-1">Law Firms</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#e5e2ff]">
                  <CountUp target={50} />
                  <span className="text-lg font-semibold">-State</span>
                </div>
                <p className="text-[#9490b0] text-xs mt-1">Law Database</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#e5e2ff]">
                  <CountUp target={18} />
                </div>
                <p className="text-[#9490b0] text-xs mt-1">Clinical Categories</p>
              </div>
            </div>
          </AnimatedSection>

          {/* ── Trust Badges ── */}
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-[#9490b0] text-sm">
              {trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#22c55e]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
