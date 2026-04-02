"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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

const pricingTiers = [
  {
    name: "Quick Check",
    price: "$49",
    description: "AI reviews your records and gives you a plain-language answer",
    features: [
      "AI-powered record review",
      "Plain-language assessment",
      "Clear recommendation",
      "Results in minutes",
    ],
    cta: "Check Your Case",
    highlight: false,
    badge: null,
  },
  {
    name: "Full Assessment",
    price: "$149",
    description: 'Detailed analysis + "questions to ask a lawyer" guide',
    features: [
      "Everything in Quick Check",
      "Detailed issue breakdown",
      "Questions to ask a lawyer",
      "What-to-do-next guide",
      "Keep your report forever",
    ],
    cta: "Get Full Assessment",
    highlight: true,
    badge: "Best Value",
  },
  {
    name: "Attorney Match",
    price: "$249",
    description: "Full assessment + matched with a vetted attorney in your area",
    features: [
      "Everything in Full Assessment",
      "Matched with a malpractice attorney",
      "Attorney reviews your report",
      "Free initial consultation",
      "No obligation to hire",
    ],
    cta: "Get Matched",
    highlight: false,
    badge: "Full Service",
  },
];

const faqs = [
  {
    q: "Is my information private?",
    a: "Yes, completely. Your records are analyzed by AI only -- no human sees them unless you specifically choose the physician review option. All data is encrypted and we never share your information with anyone without your permission.",
  },
  {
    q: "How does this work?",
    a: "You upload your medical records (discharge papers, doctor's notes, test results) and tell us what happened in your own words. Our AI -- built by an ER doctor with 20+ years of experience -- reviews everything and tells you whether the care you received falls below what it should have been.",
  },
  {
    q: "Will this tell me if I have a case?",
    a: "We give you an honest, plain-language assessment of whether there are potential issues with the care you received. If we find problems, we explain exactly what they are and give you specific questions to ask an attorney. Only a lawyer can tell you definitively if you have a legal case.",
  },
  {
    q: "What if you don't find any issues?",
    a: "We tell you honestly. Not every bad outcome means bad care was given. If your records show the medical team did what they were supposed to, we will tell you that clearly. We would rather save you $300-500 on a lawyer consultation than give you false hope.",
  },
  {
    q: "Do I need all my medical records?",
    a: "The more records you have, the better our analysis. But even discharge papers or a summary from your visit can give us enough to work with. You can always upload additional records later for a more complete picture.",
  },
  {
    q: "How is this different from talking to a lawyer?",
    a: "Most malpractice attorneys charge $300-500 just for an initial consultation, and many won't even look at your case without records already reviewed. We give you a clinical pre-screening for $49 so you know whether it's worth pursuing before spending money on legal fees.",
  },
];

/* ─────────────────────────── components ─────────────────────────── */

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

export default function PatientLandingPage() {
  const heroWords = [
    "Think",
    "You",
    "Received",
    "the",
    "Wrong",
    "Care?",
  ];

  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* ── Background ── */}
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
        `}</style>

        {/* ══════════════════ HERO ══════════════════ */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block mb-8"
              >
                <span className="text-[#22c55e] text-sm font-medium tracking-wider uppercase bg-[#22c55e]/10 border border-[#22c55e]/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  For Patients
                </span>
              </motion.div>

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
                      word === "Wrong" || word === "Care?"
                        ? "bg-gradient-to-r from-[#4f8ff7] to-[#a78bfa] bg-clip-text text-transparent"
                        : ""
                    }
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                className="text-[#9490b0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                Upload your medical records. Our AI -- built by an ER physician
                -- will tell you in minutes if your case is worth pursuing. No
                legal jargon, no runaround.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Link href="/patient/upload" className="relative w-full sm:w-auto group">
                  <span className="absolute inset-0 rounded-xl bg-[#4f8ff7] blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                  <span className="relative block bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white px-8 py-3.5 rounded-xl text-base font-semibold transition shadow-lg shadow-[#4f8ff7]/20 hover:shadow-[#4f8ff7]/40">
                    Check Your Case -- $49
                  </span>
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto text-[#9490b0] hover:text-[#e5e2ff] border border-[#2a2440] hover:border-[#3d3660] px-8 py-3.5 rounded-xl text-base font-medium transition text-center backdrop-blur-sm"
                >
                  See How It Works
                </a>
              </motion.div>

              <motion.div
                className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-[#9490b0] text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                {[
                  "Built by a Board-Certified ER Physician",
                  "No Human Sees Your Records",
                  "Honest Answers, Even if We Don't Think You Have a Case",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════ SOCIAL PROOF ══════════════════ */}
        <section className="py-16 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#e5e2ff]">
                    <CountUp target={12400} suffix="+" />
                  </div>
                  <p className="text-[#9490b0] text-sm mt-1">Patients Helped</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#e5e2ff]">
                    <CountUp target={89} suffix="%" />
                  </div>
                  <p className="text-[#9490b0] text-sm mt-1">Would Recommend</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#e5e2ff]">
                    <CountUp target={5} suffix=" min" />
                  </div>
                  <p className="text-[#9490b0] text-sm mt-1">Avg. Results Time</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#e5e2ff]">
                    $<CountUp target={450} suffix="" />
                  </div>
                  <p className="text-[#9490b0] text-sm mt-1">Avg. Saved vs. Lawyer Consult</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════ HOW IT WORKS ══════════════════ */}
        <section id="how-it-works" className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-[#9490b0] text-lg max-w-xl mx-auto">
                Three simple steps. No appointments, no waiting rooms, no legal
                jargon.
              </p>
            </AnimatedSection>

            <div className="relative">
              <div className="hidden md:block absolute top-[3.5rem] left-[16.67%] right-[16.67%] h-px">
                <AnimatedSection>
                  <div className="h-full w-full bg-gradient-to-r from-[#4f8ff7]/0 via-[#4f8ff7]/40 to-[#4f8ff7]/0" />
                </AnimatedSection>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {[
                  {
                    step: 1,
                    title: "Tell Us What Happened",
                    desc: "Describe your experience in your own words and upload any records you have -- discharge papers, doctor's notes, test results, even photos of paperwork.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    ),
                  },
                  {
                    step: 2,
                    title: "AI Reviews Your Records",
                    desc: "Our AI -- built by a board-certified ER physician -- analyzes your records against established medical standards to find potential issues.",
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
                    title: "Get a Clear Answer",
                    desc: "Receive a plain-language report explaining what we found, what it means, and exactly what to do next -- including specific questions to ask a lawyer.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    ),
                  },
                ].map((s, i) => (
                  <AnimatedSection key={s.step} delay={i * 0.15}>
                    <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 hover:border-[#3d3660] transition-all duration-300 group text-center relative">
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

        {/* ══════════════════ PRICING ══════════════════ */}
        <section id="pricing" className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Know Before You Spend
              </h2>
              <p className="text-[#9490b0] text-lg max-w-xl mx-auto">
                A lawyer consultation costs $300-500. Know if it's worth it first.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingTiers.map((tier, i) => (
                <AnimatedSection key={tier.name} delay={i * 0.1}>
                  <motion.div
                    className={`relative rounded-2xl p-8 h-full flex flex-col
                      ${
                        tier.highlight
                          ? "bg-[#15111e]/80 backdrop-blur-xl border-2 border-[#4f8ff7] shadow-xl shadow-[#4f8ff7]/10"
                          : tier.badge === "Full Service"
                          ? "bg-[#15111e]/80 backdrop-blur-xl border border-[#a78bfa]/30 shadow-lg shadow-[#a78bfa]/5"
                          : "bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] shadow-lg shadow-black/20"
                      }`}
                    whileHover={{
                      y: -8,
                      boxShadow: tier.highlight
                        ? "0 25px 60px rgba(79,143,247,0.2)"
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
                              : "bg-[#a78bfa] text-white"
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
                    </div>
                    <p className="text-[#9490b0] text-xs mb-6">{tier.description}</p>

                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-[#9490b0]">
                          <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4f8ff7]" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/patient/upload"
                      className={`block text-center px-6 py-2.5 rounded-xl text-sm font-semibold transition ${
                        tier.highlight
                          ? "bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white shadow-lg shadow-[#4f8ff7]/20"
                          : "text-[#4f8ff7] border border-[#4f8ff7]/30 hover:bg-[#4f8ff7]/10"
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ TRUST SIGNALS ══════════════════ */}
        <section className="py-20 md:py-28 border-t border-[#2a2440]/50 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#15111e]/30 via-transparent to-[#15111e]/30 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 relative">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Patients Trust Us
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <AnimatedSection delay={0}>
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
                    Our AI is built by a board-certified emergency medicine
                    physician with 20+ years of experience. It knows what good
                    care looks like -- and what doesn't.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
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
                  <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">
                    Completely Private
                  </h3>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    Your records are analyzed by AI only. No human sees your
                    medical information unless you specifically choose to share
                    it. Everything is encrypted.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 text-center h-full hover:border-[#3d3660] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#4f8ff7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">
                    Honest Answers
                  </h3>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    We tell you the truth, even when the answer is that your
                    care was appropriate. We'd rather save you money than give
                    you false hope.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ══════════════════ FAQ ══════════════════ */}
        <section className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-3xl mx-auto px-6">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Common Questions
              </h2>
            </AnimatedSection>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={faq.q} {...faq} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ CTA ══════════════════ */}
        <section className="py-24 md:py-32 border-t border-[#2a2440]/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4f8ff7]/10 via-[#a78bfa]/10 to-[#4f8ff7]/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a14] via-transparent to-[#0c0a14]" />

          <div
            className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.08]"
            style={{
              background: "radial-gradient(circle, #4f8ff7 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                You Deserve{" "}
                <span className="bg-gradient-to-r from-[#4f8ff7] to-[#a78bfa] bg-clip-text text-transparent">
                  Answers.
                </span>
              </h2>
              <p className="text-[#9490b0] text-lg mb-10 max-w-xl mx-auto">
                Don't spend months wondering. Don't spend hundreds on a lawyer
                just to find out. Get a clear, honest answer in minutes.
              </p>
              <Link href="/patient/upload" className="relative inline-block group">
                <span className="absolute inset-0 rounded-xl bg-[#4f8ff7] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <span className="relative inline-block bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white px-10 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-[#4f8ff7]/20 hover:shadow-[#4f8ff7]/40">
                  Check Your Case -- $49
                </span>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════ FOR ATTORNEYS BANNER ══════════════════ */}
        <section className="py-12 border-t border-[#2a2440]/50">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#9490b0] text-sm">
              Are you an attorney?{" "}
              <Link href="/" className="text-[#4f8ff7] hover:text-[#6ba1ff] font-medium transition">
                Visit our law firm portal
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
