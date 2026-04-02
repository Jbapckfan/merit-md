"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─────────────────────────── icons ─────────────────────────── */

function ClipboardCheckIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function UserIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function BuildingIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
      />
    </svg>
  );
}

function AcademicIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
      />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

/* ─────────────────────────── data ─────────────────────────── */

const audienceCards = [
  {
    icon: UserIcon,
    iconColor: "text-[#22c55e]",
    iconBg: "bg-[#22c55e]/10 border-[#22c55e]/20",
    title: "Individual Physicians",
    description: "Protect yourself. Catch documentation gaps before they become your legal record. Every chart you sign is a potential exhibit.",
  },
  {
    icon: BuildingIcon,
    iconColor: "text-[#4f8ff7]",
    iconBg: "bg-[#4f8ff7]/10 border-[#4f8ff7]/20",
    title: "Hospital & Clinic Administrators",
    description: "Protect your organization. Reduce malpractice claims and improve documentation quality across your entire physician group.",
  },
  {
    icon: AcademicIcon,
    iconColor: "text-[#a78bfa]",
    iconBg: "bg-[#a78bfa]/10 border-[#a78bfa]/20",
    title: "Residency Programs",
    description: "Teach documentation excellence. Give residents real-time feedback on every chart so they build good habits from day one.",
  },
];

const features = [
  {
    title: "Documentation Completeness",
    description: "MDM strength, pertinent negatives, ROS consistency, exam completeness",
  },
  {
    title: "Standard-of-Care Alignment",
    description: "Are you meeting guidelines for this chief complaint? Risk scores, workup gaps",
  },
  {
    title: "Disposition Safety",
    description: "Is this patient safe to discharge? What are you missing before you let them go?",
  },
  {
    title: "Medicolegal Risk Flags",
    description: "Phrases that hurt you in court, missing defensive documentation, time gaps",
  },
  {
    title: "Return Precaution Quality",
    description: "Specific enough to be legally defensible? Would a jury understand you warned them?",
  },
  {
    title: "Cognitive Bias Detection",
    description: "Anchoring, premature closure, availability bias, diagnosis momentum",
  },
  {
    title: "Billing/Coding Alignment",
    description: "Does your MDM support the level you are billing? Avoid underbilling and audit risk",
  },
];

const steps = [
  {
    number: "1",
    title: "Paste Your Chart Note",
    description: "Copy your note from the EHR, or upload a PDF/text export. Takes 5 seconds.",
  },
  {
    number: "2",
    title: "AI Reviews Your Chart",
    description: "Your note is analyzed against clinical standards, documentation best practices, and medicolegal risk patterns by a panel of AI experts.",
  },
  {
    number: "3",
    title: "Fix Before You Sign",
    description: "Get actionable feedback in 30 seconds. Copy suggested text directly into your EHR. Sign with confidence.",
  },
];

const pricingTiers = [
  {
    name: "Individual Physician",
    price: "$99",
    period: "/month",
    description: "Unlimited reviews for a single physician",
    features: [
      "Unlimited chart reviews",
      "Shift-end summary",
      "Documentation score tracking",
      "All 7 review categories",
      "Copy-to-clipboard suggestions",
    ],
    highlight: false,
  },
  {
    name: "Group Practice",
    price: "$79",
    period: "/physician/month",
    description: "5-20 physicians",
    features: [
      "Everything in Individual",
      "Group analytics dashboard",
      "Physician comparison metrics",
      "Admin reporting tools",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Hospital / Health System",
    price: "$59",
    period: "/physician/month",
    description: "20+ physicians",
    features: [
      "Everything in Group",
      "EHR integration support",
      "Custom risk policies",
      "Compliance reporting",
      "Dedicated account manager",
    ],
    highlight: false,
  },
  {
    name: "Residency Program",
    price: "$39",
    period: "/resident/month",
    description: "Educational pricing",
    features: [
      "Everything in Individual",
      "Teaching mode with explanations",
      "Faculty review dashboard",
      "Progress tracking per resident",
      "Bulk onboarding",
    ],
    highlight: false,
  },
];

const testimonials = [
  {
    quote: "I caught a missing troponin follow-up plan on a chest pain discharge. That would have been a lawsuit waiting to happen.",
    author: "Emergency Physician",
    role: "Level 1 Trauma Center",
  },
  {
    quote: "Our group's documentation scores improved 40% in the first month. Risk management noticed before we even told them.",
    author: "Medical Director",
    role: "Community ED, 12 physicians",
  },
];

/* ─────────────────────────── page ─────────────────────────── */

export default function ChartReviewLanding() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* ── Background ── */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.07]"
            style={{
              background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
              animation: "floatOrb1 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(circle, #4f8ff7 0%, transparent 70%)",
              animation: "floatOrb2 25s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-[40%] left-[50%] w-[40vw] h-[40vw] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
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
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-24 pb-16">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* Brand badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] px-4 py-1.5 rounded-full text-sm font-medium mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <ClipboardCheckIcon className="w-4 h-4" />
              ChartReview Pro
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
              Let Us Review{" "}
              <span className="bg-gradient-to-r from-[#22c55e] to-[#4f8ff7] bg-clip-text text-transparent">
                Before You Sign
              </span>
            </h1>
            <p className="text-[#9490b0] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
              Like having risk management, a hospital attorney, and a med-mal defense team
              reviewing every chart — before it becomes your legal record.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chartreview/review"
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40"
              >
                Start Reviewing Charts
              </Link>
              <a
                href="#pricing"
                className="border border-[#2a2440] hover:border-[#22c55e]/50 text-[#e5e2ff] hover:bg-[#22c55e]/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
              >
                View Pricing
              </a>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════ WHO IT'S FOR ══════════════════ */}
        <section className="px-6 py-20">
          <AnimatedSection className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Who It&apos;s For
            </h2>
            <p className="text-[#9490b0] text-center mb-12 max-w-2xl mx-auto">
              Whether you are protecting yourself, your team, or your trainees — ChartReview Pro catches what you miss at 3 AM.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {audienceCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 hover:border-[#3d3660] transition-colors duration-300"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${card.iconBg} border flex items-center justify-center mb-6`}>
                      <Icon className={`${card.iconColor}`} />
                    </div>
                    <h3 className="text-[#e5e2ff] text-xl font-bold mb-3">{card.title}</h3>
                    <p className="text-[#9490b0] text-sm leading-relaxed">{card.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════ WHAT IT CHECKS ══════════════════ */}
        <section className="px-6 py-20 bg-[#15111e]/30">
          <AnimatedSection className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              What It Checks
            </h2>
            <p className="text-[#9490b0] text-center mb-12 max-w-2xl mx-auto">
              Seven dimensions of chart quality, analyzed in 30 seconds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-xl p-6 hover:border-[#22c55e]/30 transition-colors duration-300"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#22c55e] mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-[#e5e2ff] font-semibold mb-1">{feature.title}</h3>
                      <p className="text-[#9490b0] text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════ HOW IT WORKS ══════════════════ */}
        <section id="how-it-works" className="px-6 py-20">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              How It Works
            </h2>
            <p className="text-[#9490b0] text-center mb-12 max-w-2xl mx-auto">
              Three steps. Thirty seconds. Sign with confidence.
            </p>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex gap-6 items-start bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 hover:border-[#3d3660] transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-[#22c55e] font-bold text-xl shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-[#e5e2ff] text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-[#9490b0] text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════ PRICING ══════════════════ */}
        <section id="pricing" className="px-6 py-20 bg-[#15111e]/30">
          <AnimatedSection className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Pricing
            </h2>
            <p className="text-[#9490b0] text-center mb-12 max-w-2xl mx-auto">
              All plans include unlimited chart reviews, shift-end summaries, and documentation score tracking.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingTiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`bg-[#15111e]/60 backdrop-blur-xl border rounded-2xl p-6 flex flex-col ${
                    tier.highlight
                      ? "border-[#22c55e]/50 shadow-lg shadow-[#22c55e]/10"
                      : "border-[#2a2440]"
                  }`}
                >
                  {tier.highlight && (
                    <div className="text-[#22c55e] text-xs font-bold uppercase tracking-wider mb-3">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-[#e5e2ff] font-bold text-lg mb-1">{tier.name}</h3>
                  <p className="text-[#9490b0] text-xs mb-4">{tier.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-[#e5e2ff]">{tier.price}</span>
                    <span className="text-[#9490b0] text-sm">{tier.period}</span>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-[#9490b0]">
                        <CheckCircleIcon className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/chartreview/review"
                    className={`block text-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      tier.highlight
                        ? "bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-[#22c55e]/20"
                        : "border border-[#2a2440] hover:border-[#22c55e]/50 text-[#e5e2ff] hover:bg-[#22c55e]/10"
                    }`}
                  >
                    Start Free Trial
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════ TRUST ══════════════════ */}
        <section className="px-6 py-20">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Built by Physicians, for Physicians
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheckIcon className="w-6 h-6 text-[#22c55e]" />
                </div>
                <p className="text-[#e5e2ff] text-sm leading-relaxed">
                  Built by a board-certified ER physician who has reviewed thousands of charts and testified as an expert witness.
                </p>
              </div>
              <div className="bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#4f8ff7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <p className="text-[#e5e2ff] text-sm leading-relaxed">
                  Your chart data is analyzed privately — never stored beyond your session, never shared, never used for training.
                </p>
              </div>
              <div className="bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-[#e5e2ff] text-sm leading-relaxed">
                  Reduces malpractice exposure by catching documentation gaps before they become legal records.
                </p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-6 text-left"
                >
                  <p className="text-[#e5e2ff] text-sm leading-relaxed mb-4 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-[#e5e2ff] text-sm font-semibold">{t.author}</p>
                    <p className="text-[#9490b0] text-xs">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════ CTA ══════════════════ */}
        <section className="px-6 py-20 bg-[#15111e]/30">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Signing Blind
            </h2>
            <p className="text-[#9490b0] text-lg mb-8 max-w-xl mx-auto">
              Every chart you sign without review is a risk you are choosing to take. Start reviewing in 30 seconds.
            </p>
            <Link
              href="/chartreview/review"
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40"
            >
              Review Your First Chart Free
            </Link>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
