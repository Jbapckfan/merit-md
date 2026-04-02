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
    title: "Emergency Physicians",
    description: "Review your documentation before you sign. Surfaces completeness considerations, identifies potentially relevant guidelines, and highlights language that may carry medicolegal weight.",
  },
  {
    icon: BuildingIcon,
    iconColor: "text-[#4f8ff7]",
    iconBg: "bg-[#4f8ff7]/10 border-[#4f8ff7]/20",
    title: "Hospitalists & Specialists",
    description: "Retrospective documentation review for any clinical note. Identify areas where additional documentation may strengthen your chart before finalizing.",
  },
  {
    icon: AcademicIcon,
    iconColor: "text-[#4f8ff7]",
    iconBg: "bg-[#4f8ff7]/10 border-[#4f8ff7]/20",
    title: "Group Practices",
    description: "Team-wide documentation review with shared analytics. Track documentation quality trends across your group and identify common improvement areas.",
  },
];

const features = [
  {
    title: "Documentation Completeness",
    description: "Surfaces documentation considerations: MDM strength, pertinent negatives, ROS consistency, exam completeness",
  },
  {
    title: "Guideline Alignment",
    description: "Identifies potentially relevant guidelines for the chief complaint. Risk scores, workup considerations",
  },
  {
    title: "Disposition Documentation",
    description: "Reviews discharge documentation for completeness. Surfaces considerations you may want to address before signing",
  },
  {
    title: "Medicolegal Language Review",
    description: "Highlights language patterns that may carry weight in litigation. Suggests protective phrasing alternatives",
  },
  {
    title: "Return Precaution Quality",
    description: "Reviews specificity of return instructions. Surfaces areas where additional detail may strengthen documentation",
  },
  {
    title: "Cognitive Bias Awareness",
    description: "Identifies documentation patterns that may suggest anchoring, premature closure, or diagnosis momentum",
  },
  {
    title: "Billing/Coding Alignment",
    description: "Reviews whether documentation supports the complexity level. Surfaces potential underbilling or audit considerations",
  },
];

const steps = [
  {
    number: "1",
    title: "Paste Your Chart Note",
    description: "Copy your note from the EHR (de-identified). Takes 5 seconds.",
  },
  {
    number: "2",
    title: "AI Reviews Your Documentation",
    description: "Your note is reviewed for documentation completeness, guideline alignment, and language considerations across 7 categories.",
  },
  {
    number: "3",
    title: "Review Suggestions Before You Sign",
    description: "Get documentation considerations in 30 seconds. Copy suggested additions directly into your EHR. Review and apply at your discretion.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try it out — no signup required",
    trialLabel: "",
    features: [
      "2 chart reviews per month",
      "All 7 review categories",
      "Copy-to-clipboard suggestions",
      "No account needed",
    ],
    highlight: false,
    ctaLabel: "Start Reviewing",
    ctaHref: "/chartreview/review",
  },
  {
    name: "Pro",
    price: "$149",
    period: "/month",
    description: "For individual physicians",
    trialLabel: "14-day free trial",
    features: [
      "Unlimited chart reviews",
      "Documentation score tracking",
      "Shift-end summaries",
      "Export to PDF",
      "All 7 review categories",
    ],
    highlight: true,
    ctaLabel: "Start 14-Day Free Trial",
    ctaHref: "/chartreview/review",
  },
  {
    name: "Group",
    price: "$99",
    period: "/physician/mo",
    description: "5+ physicians",
    trialLabel: "14-day free trial",
    features: [
      "Everything in Pro",
      "Team analytics dashboard",
      "Physician comparison metrics",
      "Admin reporting tools",
      "Priority support",
    ],
    highlight: false,
    ctaLabel: "Start 14-Day Free Trial",
    ctaHref: "/chartreview/review",
  },
];

const testimonials = [
  {
    quote: "It surfaced a documentation gap in my troponin follow-up plan that I would have missed at 3 AM. Having a second set of eyes before I sign is invaluable.",
    author: "Emergency Physician, Texas",
    role: "Level 1 Trauma Center",
  },
  {
    quote: "Our group started using it for pre-sign reviews. The documentation quality conversations have improved across the board.",
    author: "Medical Director, Ohio",
    role: "Community ED, 12 physicians",
  },
];

/* ─────────────────────────── page ─────────────────────────── */

export default function ChartReviewLanding() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* ── Subtle Background ── */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, #4f8ff7 0%, transparent 70%)",
            }}
          />
        </div>

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
              AI-powered retrospective documentation review that surfaces considerations,
              identifies potentially relevant guidelines, and suggests language improvements
              — before you finalize your chart.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chartreview/review"
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40"
              >
                Try It Free — No Signup
              </Link>
              <Link
                href="/chartreview/demo"
                className="border border-[#2a2440] hover:border-[#22c55e]/50 text-[#e5e2ff] hover:bg-[#22c55e]/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
              >
                See a Sample Review
              </Link>
            </div>
            <p className="text-[#9490b0] text-sm mt-4">
              2 free reviews per month. No account required.
            </p>
          </motion.div>
        </section>

        {/* ══════════════════ WHO IT'S FOR ══════════════════ */}
        <section className="px-6 py-20">
          <AnimatedSection className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Who It&apos;s For
            </h2>
            <p className="text-[#9490b0] text-center mb-12 max-w-2xl mx-auto">
              For licensed healthcare professionals looking to strengthen their documentation before signing.
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
            <p className="text-[#9490b0] text-center mb-4 max-w-2xl mx-auto">
              Start free. Upgrade when you are ready for unlimited reviews.
            </p>
            <p className="text-[#22c55e] text-sm text-center mb-12">
              14-day free trial on all paid plans. Cancel anytime.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                  <p className="text-[#9490b0] text-xs mb-2">{tier.description}</p>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-[#e5e2ff]">{tier.price}</span>
                    <span className="text-[#9490b0] text-sm">{tier.period}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-[#22c55e] text-xs font-semibold bg-[#22c55e]/10 border border-[#22c55e]/20 px-2.5 py-1 rounded-full">
                      {tier.trialLabel}
                    </span>
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
                    href={tier.ctaHref}
                    className={`block text-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      tier.highlight
                        ? "bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-[#22c55e]/20"
                        : "border border-[#2a2440] hover:border-[#22c55e]/50 text-[#e5e2ff] hover:bg-[#22c55e]/10"
                    }`}
                  >
                    {tier.ctaLabel}
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
                <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-[#e5e2ff] text-sm leading-relaxed">
                  Surfaces documentation considerations before you finalize your chart. Does not replace clinical judgment.
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
              Review Before You Sign
            </h2>
            <p className="text-[#9490b0] text-lg mb-8 max-w-xl mx-auto">
              Paste your chart note and get a comprehensive documentation review in 30 seconds. Free to try, no account required.
            </p>
            <Link
              href="/chartreview/review"
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40"
            >
              Try Your First Review Free
            </Link>
          </AnimatedSection>
        </section>

        {/* ══════════════════ DISCLAIMER ══════════════════ */}
        <section className="px-6 py-12 border-t border-[#2a2440]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#15111e]/60 border border-[#2a2440] rounded-2xl p-6 space-y-3">
              <h3 className="text-[#e5e2ff] font-semibold text-sm">Important Disclaimers</h3>
              <ul className="space-y-2 text-[#9490b0] text-xs leading-relaxed">
                <li>
                  <span className="text-[#e5e2ff] font-medium">For licensed healthcare professionals only.</span>{" "}
                  ChartReview Pro is intended for use by licensed physicians, nurse practitioners, and physician assistants as a retrospective documentation review tool.
                </li>
                <li>
                  <span className="text-[#e5e2ff] font-medium">Retrospective documentation review only.</span>{" "}
                  This tool is designed for pre-sign chart review. It is not intended for emergency, time-critical, or point-of-care clinical decision-making.
                </li>
                <li>
                  <span className="text-[#e5e2ff] font-medium">Does not replace clinical judgment.</span>{" "}
                  All suggestions are informational. Clinical decisions remain the sole responsibility of the treating provider. This tool does not provide medical advice, diagnosis, or treatment recommendations.
                </li>
                <li>
                  <span className="text-[#e5e2ff] font-medium">Not a legal service.</span>{" "}
                  ChartReview Pro does not provide legal advice. Medicolegal language suggestions are educational in nature and should not be construed as legal counsel.
                </li>
                <li>
                  <span className="text-[#e5e2ff] font-medium">Privacy.</span>{" "}
                  Chart data is processed in real-time and is not stored beyond your session. We do not use your data for model training. De-identify all notes before submitting.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
