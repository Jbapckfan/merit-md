"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";

/* ─────────────────────────── helpers ─────────────────────────── */

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
    },
  },
};

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ─────────────────────────── data ─────────────────────────── */

const findings = [
  {
    title: "Missing Serial Troponins",
    front: "Chest pain workups without serial troponin monitoring",
    back: "Standard of care requires serial troponin measurements at 0, 3, and 6 hours. A single troponin cannot rule out NSTEMI. Missing follow-ups are a leading cause of missed MI claims.",
  },
  {
    title: "Sepsis Screening Gaps",
    front: "Inadequate sepsis screening and documentation",
    back: "Failure to calculate qSOFA/SOFA scores, delayed lactate draws, or incomplete sepsis bundle documentation. These gaps account for 30% of ED malpractice claims.",
  },
  {
    title: "EMTALA Violations",
    front: "Transfer protocol violations under EMTALA",
    back: "Improper patient transfers without stabilization, missing physician certifications, or inadequate receiving facility acceptance. Violations carry penalties up to $100,000 per incident.",
  },
  {
    title: "Stroke Protocol Delays",
    front: "Delayed stroke protocol activation",
    back: "Door-to-CT times exceeding 25 minutes, delayed tPA administration beyond the 4.5-hour window, or failure to activate the stroke team. Time-sensitive lapses with devastating outcomes.",
  },
  {
    title: "Undocumented Critical Care",
    front: "Under-documented critical care decision-making",
    back: "Missing medical decision-making documentation for high-acuity patients. Without clear documentation of risk assessment and clinical reasoning, defense becomes nearly impossible.",
  },
  {
    title: "Weak Return Precautions",
    front: "Insufficient discharge instructions and return precautions",
    back: "Generic or templated discharge instructions without specific return criteria. Patients who bounce back with adverse outcomes and vague prior instructions create strong plaintiff cases.",
  },
];

const useCases = {
  plaintiff: {
    title: "Plaintiff Firms",
    headline: "Screen cases faster. Win the right ones.",
    description:
      "Stop burning retainer hours on cases that lack clinical merit. MedMal Review Pro gives you an ER-grade assessment within minutes so you can focus resources on cases with the highest probability of success.",
    features: [
      "Instant negligence probability scoring",
      "Standard-of-care deviation mapping",
      "Evidence-grade clinical citations",
      "Expert witness preparation summaries",
      "Case strength ranking across your portfolio",
    ],
  },
  defense: {
    title: "Defense Firms",
    headline: "Know your exposure before the deposition.",
    description:
      "Understand the clinical vulnerabilities in your client's care before the plaintiff's expert does. MedMal Review Pro identifies the exact deviations they'll target so you can build a proactive defense strategy.",
    features: [
      "Vulnerability assessment of medical records",
      "Counter-argument generation for each finding",
      "Protocol compliance verification",
      "Timeline reconstruction with gap analysis",
      "Defense strategy recommendation engine",
    ],
  },
  hospital: {
    title: "Hospital Risk Management",
    headline: "Catch issues before they become lawsuits.",
    description:
      "Proactively audit patient encounters for documentation gaps, protocol deviations, and risk factors. MedMal Review Pro helps risk management teams identify and remediate issues before they escalate to litigation.",
    features: [
      "Batch analysis of patient encounters",
      "Real-time documentation quality scoring",
      "Protocol adherence dashboards",
      "Trending risk factor identification",
      "Integration with incident reporting systems",
    ],
  },
};

const faqs = [
  {
    q: "Is this HIPAA compliant?",
    a: "Yes. MedMal Review Pro is fully HIPAA compliant. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We process records on secure, isolated infrastructure and never share patient data. We execute Business Associate Agreements (BAAs) with all clients.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Our AI is built on emergency medicine protocols and trained by board-certified ER physicians. While no AI replaces a physician's judgment, our system identifies standard-of-care deviations with high precision. Every finding includes clinical citations so you can verify the reasoning independently.",
  },
  {
    q: "Can I use this for defense cases?",
    a: "Absolutely. Defense firms use MedMal Review Pro to understand their client's exposure before depositions. The same clinical analysis that identifies negligence for plaintiffs also reveals where the care met or exceeded standards, giving defense teams a clear picture of strengths and vulnerabilities.",
  },
  {
    q: "What types of cases can you analyze?",
    a: "MedMal Review Pro specializes in emergency medicine, critical care, and hospital-based cases including: missed diagnoses (MI, stroke, sepsis, PE), treatment delays, medication errors, monitoring failures, documentation gaps, EMTALA violations, and discharge/follow-up issues.",
  },
  {
    q: "Do I still need an expert witness?",
    a: "For litigation, yes. MedMal Review Pro is a screening and analysis tool, not a replacement for expert testimony. However, our Physician Review tier includes a signed attestation letter from a board-certified ER physician and can serve as a foundation for your expert's review, saving significant preparation time.",
  },
  {
    q: "How long does analysis take?",
    a: "AI-only analysis (Quick Screen and Full Analysis tiers) typically completes in 5-15 minutes depending on record volume. The Physician Review tier includes a board-certified ER physician review and is delivered within 24 hours.",
  },
];

const pricingTiers = [
  {
    name: "Quick Screen",
    price: "$149",
    unit: "/case",
    description: "Fast AI triage for case viability",
    features: [
      "AI-powered merit screening",
      "Negligence probability score",
      "Top 3 findings summary",
      "Go/no-go recommendation",
    ],
    cta: "Start Screening",
    href: "/signup",
    highlight: false,
    badge: null,
  },
  {
    name: "Full Analysis",
    price: "$399",
    unit: "/case",
    description: "Comprehensive clinical deep-dive",
    features: [
      "Everything in Quick Screen",
      "Full structured merit report",
      "All deviations with citations",
      "Evidence grading per finding",
      "Shareable report link",
      "Expert witness prep brief",
    ],
    cta: "Get Full Analysis",
    href: "/signup",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Physician Review",
    price: "$1,499",
    unit: "/case",
    description: "AI + board-certified ER physician",
    features: [
      "Everything in Full Analysis",
      "Board-certified ER physician review",
      "Signed physician attestation letter",
      "30-minute phone consultation",
      "Expert witness referral",
      "Priority 24-hour turnaround",
    ],
    cta: "Request Review",
    href: "/signup",
    highlight: false,
    badge: "Expert",
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    description: "For firms and hospitals at scale",
    features: [
      "Unlimited case analyses",
      "Custom AI model tuning",
      "API access & integrations",
      "Dedicated account manager",
      "SLA guarantees",
      "Batch processing",
    ],
    cta: "Contact Sales",
    href: "mailto:contact@medmalreview.com",
    highlight: false,
    badge: null,
  },
];

/* ─────────────────────────── components ─────────────────────────── */

function FlipCard({
  title,
  front,
  back,
  index,
}: {
  title: string;
  front: string;
  back: string;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <AnimatedSection delay={index * 0.1}>
      <div
        className="group relative h-56 cursor-pointer [perspective:1000px]"
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl [backface-visibility:hidden]
                     bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] p-6
                     flex flex-col justify-between
                     shadow-lg shadow-black/20"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#ef4444]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">{title}</h3>
            <p className="text-[#9490b0] text-sm leading-relaxed">{front}</p>
          </div>
          <p className="text-[#4f8ff7] text-xs font-medium mt-2">Hover to see details</p>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-2xl [backface-visibility:hidden]
                     bg-[#15111e]/90 backdrop-blur-xl border border-[#4f8ff7]/30 p-6
                     flex flex-col justify-center
                     shadow-lg shadow-[#4f8ff7]/10"
          animate={{ rotateY: flipped ? 0 : -180 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="text-[#4f8ff7] font-semibold text-sm uppercase tracking-wider mb-3">
            {title}
          </h3>
          <p className="text-[#e5e2ff] text-sm leading-relaxed">{back}</p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function PricingCard({
  tier,
  index,
}: {
  tier: (typeof pricingTiers)[number];
  index: number;
}) {
  const isEnterprise = tier.name === "Enterprise";

  return (
    <AnimatedSection delay={index * 0.1}>
      <motion.div
        className={`relative rounded-2xl p-8 h-full flex flex-col
          ${
            tier.highlight
              ? "bg-[#15111e]/80 backdrop-blur-xl border-2 border-[#4f8ff7] shadow-xl shadow-[#4f8ff7]/10"
              : tier.badge === "Expert"
              ? "bg-[#15111e]/80 backdrop-blur-xl border border-[#eab308]/30 shadow-lg shadow-[#eab308]/5"
              : "bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] shadow-lg shadow-black/20"
          }`}
        whileHover={{
          y: -8,
          boxShadow: tier.highlight
            ? "0 25px 60px rgba(79,143,247,0.2)"
            : tier.badge === "Expert"
            ? "0 25px 60px rgba(234,179,8,0.15)"
            : "0 25px 60px rgba(0,0,0,0.3)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {tier.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                tier.highlight
                  ? "bg-[#4f8ff7] text-white"
                  : "bg-[#eab308] text-black"
              }`}
            >
              {tier.badge}
            </span>
          </div>
        )}

        <h3 className="text-[#9490b0] text-sm font-medium uppercase tracking-wider mb-2">
          {tier.name}
        </h3>
        <div className="mb-1">
          <span className="text-4xl font-bold text-[#e5e2ff]">{tier.price}</span>
          {tier.unit && <span className="text-[#9490b0] ml-1">{tier.unit}</span>}
        </div>
        <p className="text-[#9490b0] text-xs mb-6">{tier.description}</p>

        <ul className="space-y-3 mb-8 flex-1">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-[#9490b0]">
              <CheckIcon
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  tier.badge === "Expert" ? "text-[#eab308]" : "text-[#4f8ff7]"
                }`}
              />
              {f}
            </li>
          ))}
        </ul>

        {isEnterprise ? (
          <a
            href={tier.href}
            className="block text-center text-[#4f8ff7] border border-[#4f8ff7]/30 hover:bg-[#4f8ff7]/10 px-6 py-2.5 rounded-xl text-sm font-medium transition"
          >
            {tier.cta}
          </a>
        ) : tier.highlight ? (
          <Link
            href={tier.href}
            className="block text-center bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-[#4f8ff7]/20"
          >
            {tier.cta}
          </Link>
        ) : tier.badge === "Expert" ? (
          <Link
            href={tier.href}
            className="block text-center bg-[#eab308] hover:bg-[#facc15] text-black px-6 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            {tier.cta}
          </Link>
        ) : (
          <Link
            href={tier.href}
            className="block text-center text-[#4f8ff7] border border-[#4f8ff7]/30 hover:bg-[#4f8ff7]/10 px-6 py-2.5 rounded-xl text-sm font-medium transition"
          >
            {tier.cta}
          </Link>
        )}
      </motion.div>
    </AnimatedSection>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <AnimatedSection delay={index * 0.08}>
      <div className="border border-[#2a2440] rounded-2xl overflow-hidden bg-[#15111e]/60 backdrop-blur-sm">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1c1729]/50 transition"
        >
          <span className="text-[#e5e2ff] font-medium pr-4">{q}</span>
          <motion.svg
            className="w-5 h-5 text-[#4f8ff7] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 text-[#9490b0] text-sm leading-relaxed border-t border-[#2a2440] pt-4">
                {a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
}

/* ─────────────────────────── main page ─────────────────────────── */

export default function AttorneyLandingPage() {
  const [activeTab, setActiveTab] = useState<"plaintiff" | "defense" | "hospital">("plaintiff");
  const heroRef = useRef<HTMLDivElement>(null);

  const heroWords = [
    "Screen",
    "Cases",
    "in",
    "Minutes.",
    "Analyze",
    "Them",
    "in",
    "Depth.",
  ];

  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* ── Animated Gradient Mesh Background (persists behind hero) ── */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Gradient orbs */}
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
          {/* Noise grain overlay */}
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
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0; }
            100% { transform: scale(0.8); opacity: 0; }
          }
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            50% { transform: translateY(-80px) translateX(20px); opacity: 0.3; }
          }
        `}</style>

        {/* ══════════════════ 1. HERO ══════════════════ */}
        <section className="relative min-h-[90vh] flex items-center" ref={heroRef}>
          {/* Floating pulse particles behind hero */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#4f8ff7]/40"
                style={{
                  left: `${15 + i * 14}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animation: `float-particle ${6 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`,
                }}
              />
            ))}
            {/* Pulse rings */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#4f8ff7]/10"
              style={{ animation: "pulse-ring 4s ease-out infinite" }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#4f8ff7]/5"
              style={{ animation: "pulse-ring 4s ease-out 1s infinite" }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-36">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block mb-8"
              >
                <span className="text-[#4f8ff7] text-sm font-medium tracking-wider uppercase bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  MedMal Review Pro &mdash; For Attorneys
                </span>
              </motion.div>

              {/* Staggered hero text */}
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-1"
                variants={stagger.container}
                initial="hidden"
                animate="show"
              >
                {heroWords.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={stagger.item}
                    className={
                      word === "Minutes." || word === "Depth."
                        ? "bg-gradient-to-r from-[#4f8ff7] to-[#a78bfa] bg-clip-text text-transparent"
                        : ""
                    }
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="text-[#9490b0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                Two tools, one platform. Quick-screen prospective cases for merit,
                or run a comprehensive medical-legal deep dive on active cases.
              </motion.p>

              {/* Two use-case cards inline */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="bg-[#15111e]/60 backdrop-blur-xl border border-[#2a2440] rounded-xl p-5 text-left">
                  <div className="text-[#4f8ff7] text-xs font-bold uppercase tracking-wider mb-2">Case Screening</div>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    Is this case worth your time? Get an AI merit assessment with negligence scoring in minutes.
                  </p>
                </div>
                <div className="bg-[#15111e]/60 backdrop-blur-xl border border-[#4f8ff7]/30 rounded-xl p-5 text-left">
                  <div className="text-[#a78bfa] text-xs font-bold uppercase tracking-wider mb-2">Deep Dive Analysis</div>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    Full medical-legal workup -- deviations, causation, defense vulnerabilities, expert witness prep, and state law.
                  </p>
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <Link
                  href="/signup"
                  className="relative w-full sm:w-auto group"
                >
                  <span className="absolute inset-0 rounded-xl bg-[#4f8ff7] blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                  <span className="relative block bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white px-8 py-3.5 rounded-xl text-base font-semibold transition shadow-lg shadow-[#4f8ff7]/20 hover:shadow-[#4f8ff7]/40">
                    Start Your First Free Analysis
                  </span>
                </Link>
                <a
                  href="#deep-dive"
                  className="w-full sm:w-auto text-[#9490b0] hover:text-[#e5e2ff] border border-[#2a2440] hover:border-[#3d3660] px-8 py-3.5 rounded-xl text-base font-medium transition text-center backdrop-blur-sm"
                >
                  Explore Deep Dive
                </a>
              </motion.div>

              {/* Trust bar */}
              <motion.div
                className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-[#9490b0] text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                {["HIPAA Compliant", "Built by ER Physicians", "Results in Minutes"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </div>
                  )
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════ 2. SOCIAL PROOF BAR ══════════════════ */}
        <section className="py-16 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#e5e2ff]">
                    <CountUp target={2847} suffix="+" />
                  </div>
                  <p className="text-[#9490b0] text-sm mt-1">Cases Analyzed</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#e5e2ff]">
                    <CountUp target={340} suffix="+" />
                  </div>
                  <p className="text-[#9490b0] text-sm mt-1">Law Firms Trust Us</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#e5e2ff]">
                    <CountUp target={94} suffix="%" />
                  </div>
                  <p className="text-[#9490b0] text-sm mt-1">Accuracy Rate</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#e5e2ff]">
                    <CountUp target={8} suffix=" min" />
                  </div>
                  <p className="text-[#9490b0] text-sm mt-1">Avg. Analysis Time</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════ 3. HOW IT WORKS ══════════════════ */}
        <section id="how-it-works" className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Three Steps to a Merit Decision
              </h2>
              <p className="text-[#9490b0] text-lg max-w-xl mx-auto">
                From upload to actionable intelligence in minutes, not weeks.
              </p>
            </AnimatedSection>

            {/* Timeline */}
            <div className="relative">
              {/* Horizontal connector line (desktop) */}
              <div className="hidden md:block absolute top-[3.5rem] left-[16.67%] right-[16.67%] h-px">
                <AnimatedSection>
                  <div className="h-full w-full bg-gradient-to-r from-[#4f8ff7]/0 via-[#4f8ff7]/40 to-[#4f8ff7]/0" />
                </AnimatedSection>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {[
                  {
                    step: 1,
                    title: "Upload the Records",
                    desc: "Upload medical records as PDF, images, or text. Our secure platform accepts clinical charts, lab results, nursing notes, and discharge summaries.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    ),
                  },
                  {
                    step: 2,
                    title: "AI Clinical Analysis",
                    desc: "Our AI performs a thorough clinical review -- checking for standard-of-care deviations, missing documentation, protocol violations, and red flags.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-1.394 1.394a.75.75 0 00-.22.53v.272c0 .414.336.75.75.75h1.908a2.25 2.25 0 001.591-.659L9.5 15m5.5-.5l1.394 1.394a.75.75 0 01.22.53v.272c0 .414-.336.75-.75.75h-1.908a2.25 2.25 0 01-1.591-.659L10.5 15"
                      />
                    ),
                  },
                  {
                    step: 3,
                    title: "Get Your Merit Report",
                    desc: "Receive a structured report with a negligence probability score, key findings, evidence citations, and recommended next steps for your case.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    ),
                  },
                ].map((s, i) => (
                  <AnimatedSection key={s.step} delay={i * 0.15}>
                    <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 hover:border-[#3d3660] transition-all duration-300 group text-center relative">
                      {/* Step circle */}
                      <div className="w-14 h-14 rounded-2xl bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#4f8ff7]/15 group-hover:scale-110 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-[#4f8ff7]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {s.icon}
                        </svg>
                      </div>
                      <div className="text-[#4f8ff7]/40 text-xs font-bold uppercase tracking-widest mb-3">
                        Step {s.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-[#e5e2ff]">
                        {s.title}
                      </h3>
                      <p className="text-[#9490b0] leading-relaxed text-sm">
                        {s.desc}
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ 4. WHAT WE CATCH ══════════════════ */}
        <section className="py-20 md:py-28 border-t border-[#2a2440]/50 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#15111e]/30 via-transparent to-[#15111e]/30 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What We Catch That Others Miss
              </h2>
              <p className="text-[#9490b0] text-lg max-w-xl mx-auto">
                Our AI is trained on emergency medicine protocols, not generic
                medical knowledge. Hover a card to see details.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {findings.map((f, i) => (
                <FlipCard key={f.title} {...f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ 4.5 DEEP DIVE ══════════════════ */}
        <section id="deep-dive" className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <span className="text-[#a78bfa] text-sm font-medium tracking-wider uppercase bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-4 py-1.5 rounded-full backdrop-blur-sm inline-block mb-6">
                Deep Dive Analysis
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Full Medical-Legal Workup
              </h2>
              <p className="text-[#9490b0] text-lg max-w-2xl mx-auto">
                Go beyond screening. Our Deep Dive delivers a comprehensive analysis
                package that arms you for every phase of litigation.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Standard-of-Care Deviation Analysis",
                  desc: "Comprehensive identification of every point where care diverged from accepted medical standards, with clinical citations and evidence grading.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  ),
                  color: "#ef4444",
                },
                {
                  title: "Causation Pathway Mapping",
                  desc: "Trace the chain from deviation to injury. Visual causation maps linking each standard-of-care breach to patient outcomes.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  ),
                  color: "#4f8ff7",
                },
                {
                  title: "Defense Vulnerability Assessment",
                  desc: "Anticipate the defense strategy. Identify documentation strengths, protocol compliance gaps, and areas where the defense will focus.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  ),
                  color: "#22c55e",
                },
                {
                  title: "Expert Witness Recommendations",
                  desc: "Specific specialty and qualification recommendations for expert witnesses based on the clinical issues in your case.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                  ),
                  color: "#a78bfa",
                },
                {
                  title: "State-Specific Legal Framework",
                  desc: "Damage caps, statute of limitations, certificate of merit requirements, and expert qualification rules for your jurisdiction.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  ),
                  color: "#eab308",
                },
                {
                  title: "Deposition Prep & Post-Analysis Q&A",
                  desc: "Suggested deposition questions based on findings, plus interactive follow-up -- ask the AI anything about your case after the report.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  ),
                  color: "#4f8ff7",
                },
              ].map((feature, i) => (
                <AnimatedSection key={feature.title} delay={i * 0.08}>
                  <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-7 h-full hover:border-[#3d3660] transition-all duration-300 group">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{
                        backgroundColor: `${feature.color}10`,
                        borderWidth: 1,
                        borderColor: `${feature.color}30`,
                      }}
                    >
                      <svg
                        className="w-6 h-6"
                        style={{ color: feature.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {feature.icon}
                      </svg>
                    </div>
                    <h3 className="text-[#e5e2ff] font-semibold text-base mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#9490b0] text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ 5. USE CASES ══════════════════ */}
        <section className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for Every Side of the Case
              </h2>
              <p className="text-[#9490b0] text-lg max-w-xl mx-auto">
                Whether you represent patients, providers, or institutions.
              </p>
            </AnimatedSection>

            {/* Tabs */}
            <AnimatedSection className="mb-10">
              <div className="flex justify-center">
                <div className="inline-flex bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-1.5">
                  {(["plaintiff", "defense", "hospital"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeTab === tab
                          ? "text-white"
                          : "text-[#9490b0] hover:text-[#e5e2ff]"
                      }`}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-[#4f8ff7] rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{useCases[tab].title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-[#e5e2ff]">
                        {useCases[activeTab].headline}
                      </h3>
                      <p className="text-[#9490b0] leading-relaxed mb-6">
                        {useCases[activeTab].description}
                      </p>
                      <Link
                        href="/signup"
                        className="inline-block bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
                      >
                        Get Started
                      </Link>
                    </div>
                    <ul className="space-y-3">
                      {useCases[activeTab].features.map((f, i) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.4 }}
                          className="flex items-start gap-3 text-sm text-[#9490b0]"
                        >
                          <CheckIcon className="w-4 h-4 text-[#4f8ff7] mt-0.5 flex-shrink-0" />
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ══════════════════ 6. PRICING ══════════════════ */}
        <section id="pricing" className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-[#9490b0] text-lg max-w-xl mx-auto">
                One bad case can cost your firm more than a year of MedMal Review Pro.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {pricingTiers.map((tier, i) => (
                <PricingCard key={tier.name} tier={tier} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ 7. TRUST / SECURITY ══════════════════ */}
        <section className="py-20 md:py-28 border-t border-[#2a2440]/50 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#15111e]/30 via-transparent to-[#15111e]/30 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 relative">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Firms Trust MedMal Review Pro
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* HIPAA */}
              <AnimatedSection delay={0}>
                <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 text-center h-full hover:border-[#3d3660] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">HIPAA Compliant</h3>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    AES-256 encryption at rest, TLS 1.3 in transit. Full audit
                    trails and BAA agreements. Your data never leaves our secure
                    infrastructure.
                  </p>
                </div>
              </AnimatedSection>

              {/* Local Processing */}
              <AnimatedSection delay={0.1}>
                <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 text-center h-full hover:border-[#3d3660] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#4f8ff7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008V18zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008V18zm0-6h.008v.008h-.008v-.008z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">
                    Isolated Processing
                  </h3>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    Records are processed in isolated, ephemeral environments.
                    Data is purged after analysis. No third-party model providers
                    ever see your documents.
                  </p>
                </div>
              </AnimatedSection>

              {/* Built by ER Physician */}
              <AnimatedSection delay={0.2}>
                <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 text-center h-full hover:border-[#3d3660] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">
                    Built by an ER Physician
                  </h3>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    20+ years of emergency medicine experience. Thousands of
                    cases reviewed. Board-certified, actively practicing, and
                    deeply familiar with malpractice standards.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ══════════════════ 8. FAQ ══════════════════ */}
        <section className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-3xl mx-auto px-6">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </AnimatedSection>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={faq.q} {...faq} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ 8.5. GATEWAY BANNER ══════════════════ */}
        <section className="py-12 border-t border-[#2a2440]/50">
          <div className="max-w-4xl mx-auto px-6">
            <AnimatedSection>
              <div className="bg-gradient-to-r from-[#4f8ff7]/5 to-[#a78bfa]/5 border border-[#4f8ff7]/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-[#e5e2ff] text-xl font-semibold mb-2">
                    Not an attorney?
                  </h3>
                  <p className="text-[#9490b0] text-sm max-w-md">
                    We also offer tools for patients and clinicians. Visit our main page to find the right experience.
                  </p>
                </div>
                <Link
                  href="/"
                  className="flex-shrink-0 bg-[#15111e] border border-[#4f8ff7]/30 hover:bg-[#4f8ff7]/10 text-[#4f8ff7] px-6 py-3 rounded-xl text-sm font-semibold transition whitespace-nowrap"
                >
                  View All Products
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════ 9. CTA ══════════════════ */}
        <section className="py-24 md:py-32 border-t border-[#2a2440]/50 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4f8ff7]/10 via-[#a78bfa]/10 to-[#4f8ff7]/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a14] via-transparent to-[#0c0a14]" />

          {/* Glowing orbs */}
          <div
            className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.08]"
            style={{
              background: "radial-gradient(circle, #4f8ff7 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Stop Guessing.{" "}
                <span className="bg-gradient-to-r from-[#4f8ff7] to-[#a78bfa] bg-clip-text text-transparent">
                  Start Knowing.
                </span>
              </h2>
              <p className="text-[#9490b0] text-lg mb-10 max-w-xl mx-auto">
                Every week you spend on a meritless case is a week you could have
                spent winning a strong one. Let MedMal Review Pro tell you the difference.
              </p>
              <Link href="/signup" className="relative inline-block group">
                <span className="absolute inset-0 rounded-xl bg-[#4f8ff7] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <span className="relative inline-block bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white px-10 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-[#4f8ff7]/20 hover:shadow-[#4f8ff7]/40">
                  Start Your First Free Analysis
                </span>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* ══════════════════ 10. FOOTER ══════════════════ */}
      <Footer />
    </>
  );
}
