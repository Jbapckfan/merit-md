"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ─────────────────────────── data ─────────────────────────── */

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
];

const CONCERN_TYPES = [
  { value: "surgical_complication", label: "Surgical complication" },
  { value: "emergency_room", label: "Emergency room" },
  { value: "misdiagnosis", label: "Misdiagnosis" },
  { value: "medication_error", label: "Medication error" },
  { value: "birth_injury", label: "Birth injury" },
  { value: "hospital_infection", label: "Hospital infection" },
  { value: "other", label: "Other" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function currentYear() {
  return new Date().getFullYear();
}

function yearOptions() {
  const end = currentYear();
  const start = end - 20;
  const years: number[] = [];
  for (let y = end; y >= start; y--) years.push(y);
  return years;
}

const faqs = [
  {
    q: "Is this really free?",
    a: "Yes, completely free. We are compensated by attorneys in our network when they accept a case. You will never be charged anything.",
  },
  {
    q: "What happens after I submit?",
    a: "If an attorney in our network is interested in reviewing your case, they will contact you directly within 5 business days. You are under no obligation to hire them.",
  },
  {
    q: "Is my information private?",
    a: "Yes. Your information is shared only with attorneys in our network who may be able to help with your type of case. We never sell your data or share it with anyone else.",
  },
  {
    q: "Does submitting this form mean I have a case?",
    a: "No. This form does not evaluate your legal rights or the merit of a potential claim. Only a licensed attorney can determine whether you have a viable case.",
  },
  {
    q: "What if I don't hear back?",
    a: "If you do not hear from an attorney within 5 business days, it does not mean you don't have a case. We encourage you to contact a local medical malpractice attorney directly.",
  },
  {
    q: "Does this create an attorney-client relationship?",
    a: "No. Submitting this form does not create an attorney-client relationship. That relationship only begins if you and an attorney mutually agree to work together.",
  },
];

/* ─────────────────────────── helpers ─────────────────────────── */

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] as const },
    },
  },
};

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239490b0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "20px",
} as const;

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

export default function PatientIntakePage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [incidentMonth, setIncidentMonth] = useState("");
  const [incidentYear, setIncidentYear] = useState("");
  const [concernType, setConcernType] = useState("");
  const [description, setDescription] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!state) {
      setError("Please select the state where treatment occurred.");
      return;
    }
    if (!concernType) {
      setError("Please select the type of concern.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe what happened.");
      return;
    }
    if (description.length > 500) {
      setError("Description must be 500 characters or fewer.");
      return;
    }
    if (!consent) {
      setError("Please acknowledge the disclaimer before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const incidentDate =
        incidentMonth && incidentYear
          ? `${incidentYear}-${String(MONTHS.indexOf(incidentMonth) + 1).padStart(2, "0")}`
          : undefined;

      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          state,
          incidentDate,
          concernType,
          description: description.trim(),
          consent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const heroWords = [
    "Concerned",
    "About",
    "Your",
    "Medical",
    "Care?",
  ];

  /* ── Thank You State ── */
  if (submitted) {
    return (
      <>
        <Header />
        <main className="overflow-hidden">
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div
              className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.05]"
              style={{
                background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
              }}
            />
          </div>

          <section className="min-h-screen flex items-center justify-center px-6">
            <motion.div
              className="max-w-xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="w-20 h-20 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#e5e2ff]">
                Thank You
              </h1>

              <p className="text-[#9490b0] text-lg leading-relaxed mb-6">
                Your information has been submitted. If an attorney in our
                network is interested in reviewing your case, they will contact
                you within 5 business days.
              </p>

              <div className="bg-[#15111e]/80 border border-[#2a2440] rounded-2xl p-6 mb-8">
                <p className="text-[#9490b0] text-sm leading-relaxed">
                  If you do not hear back, it does not mean you don&apos;t have a
                  case. We encourage you to contact a local medical malpractice
                  attorney directly. Many offer free initial consultations.
                </p>
              </div>

              <Link
                href="/"
                className="text-[#4f8ff7] hover:text-[#6ba1ff] text-sm font-medium transition"
              >
                Return to Home
              </Link>
            </motion.div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Main Intake Page ── */
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* ── Subtle Background ── */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(circle, #d97706 0%, transparent 70%)",
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
        <section className="relative flex items-center pt-24 pb-8 md:pt-32 md:pb-12">
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block mb-8"
              >
                <span className="text-[#d97706] text-sm font-medium tracking-wider uppercase bg-[#d97706]/10 border border-[#d97706]/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  Free Service
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-1"
                variants={stagger.container}
                initial="hidden"
                animate="show"
              >
                {heroWords.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={stagger.item}
                    className={
                      word === "Medical" || word === "Care?"
                        ? "bg-gradient-to-r from-[#d97706] to-[#f59e0b] bg-clip-text text-transparent"
                        : ""
                    }
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                className="text-[#9490b0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                If you believe you or a loved one received substandard medical
                care, we can connect you with a vetted malpractice attorney in
                your area &mdash; at no cost to you.
              </motion.p>

              <motion.p
                className="text-[#9490b0]/80 text-sm max-w-xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                We don&apos;t evaluate your case. We don&apos;t give legal
                advice. We collect basic information and connect you with
                attorneys who specialize in your type of case.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <a href="#intake-form" className="relative w-full sm:w-auto group">
                  <span className="absolute inset-0 rounded-xl bg-[#d97706] blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                  <span className="relative block bg-[#d97706] hover:bg-[#f59e0b] text-white px-8 py-3.5 rounded-xl text-base font-semibold transition shadow-lg shadow-[#d97706]/20 hover:shadow-[#d97706]/40">
                    Request Attorney Review
                  </span>
                </a>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto text-[#9490b0] hover:text-[#e5e2ff] border border-[#2a2440] hover:border-[#3d3660] px-8 py-3.5 rounded-xl text-base font-medium transition text-center backdrop-blur-sm"
                >
                  How It Works
                </a>
              </motion.div>

              <motion.div
                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-[#9490b0] text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                {[
                  "100% Free",
                  "No Obligation",
                  "Confidential",
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

        {/* ══════════════════ HOW IT WORKS ══════════════════ */}
        <section id="how-it-works" className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-[#9490b0] text-lg max-w-xl mx-auto">
                Three simple steps. No cost, no obligation, no legal jargon.
              </p>
            </AnimatedSection>

            <div className="relative">
              <div className="hidden md:block absolute top-[3.5rem] left-[16.67%] right-[16.67%] h-px">
                <AnimatedSection>
                  <div className="h-full w-full bg-gradient-to-r from-[#d97706]/0 via-[#d97706]/40 to-[#d97706]/0" />
                </AnimatedSection>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {[
                  {
                    step: 1,
                    title: "Tell Us What Happened",
                    desc: "Fill out a short form describing your experience. We only ask for the basics -- your name, where it happened, and a brief description.",
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
                    title: "We Find the Right Attorney",
                    desc: "We match your situation with a vetted malpractice attorney in your state who specializes in your type of case.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    ),
                  },
                  {
                    step: 3,
                    title: "Attorney Contacts You",
                    desc: "If an attorney is interested in reviewing your case, they will reach out to you directly. No obligation, no pressure.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    ),
                  },
                ].map((s, i) => (
                  <AnimatedSection key={s.step} delay={i * 0.15}>
                    <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 hover:border-[#3d3660] transition-all duration-300 group text-center relative">
                      <div className="w-14 h-14 rounded-2xl bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#d97706]/15 group-hover:scale-110 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-[#d97706]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {s.icon}
                        </svg>
                      </div>
                      <div className="text-[#d97706]/40 text-xs font-bold uppercase tracking-widest mb-3">
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

        {/* ══════════════════ FREE SERVICE NOTICE ══════════════════ */}
        <section className="py-12 border-t border-[#2a2440]/50">
          <div className="max-w-3xl mx-auto px-6">
            <AnimatedSection>
              <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-[#e5e2ff] text-xl font-bold mb-2">
                  This Service is Free
                </h3>
                <p className="text-[#9490b0] text-sm leading-relaxed max-w-lg mx-auto">
                  We are compensated by attorneys in our network, not by you.
                  You will never be asked to pay for this service.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════ INTAKE FORM ══════════════════ */}
        <section id="intake-form" className="py-20 md:py-28 border-t border-[#2a2440]/50">
          <div className="max-w-2xl mx-auto px-6">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Request an Attorney Review
                </h2>
                <p className="text-[#9490b0] text-lg max-w-lg mx-auto">
                  Fill out the form below and we will work to connect you with
                  an attorney who can help.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                    First name <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm placeholder-[#9490b0]/50 focus:border-[#d97706] focus:outline-none transition"
                    placeholder="Your first name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                    Email address <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm placeholder-[#9490b0]/50 focus:border-[#d97706] focus:outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                    Phone number{" "}
                    <span className="text-[#9490b0] font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm placeholder-[#9490b0]/50 focus:border-[#d97706] focus:outline-none transition"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                    State where treatment occurred{" "}
                    <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm focus:border-[#d97706] focus:outline-none transition appearance-none"
                    style={selectArrowStyle}
                  >
                    <option value="">Select a state...</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Approximate Date */}
                <div>
                  <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                    Approximate date of incident
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={incidentMonth}
                      onChange={(e) => setIncidentMonth(e.target.value)}
                      className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm focus:border-[#d97706] focus:outline-none transition appearance-none"
                      style={selectArrowStyle}
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={incidentYear}
                      onChange={(e) => setIncidentYear(e.target.value)}
                      className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm focus:border-[#d97706] focus:outline-none transition appearance-none"
                      style={selectArrowStyle}
                    >
                      <option value="">Year</option>
                      {yearOptions().map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type of Concern */}
                <div>
                  <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                    Type of concern <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={concernType}
                    onChange={(e) => setConcernType(e.target.value)}
                    className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm focus:border-[#d97706] focus:outline-none transition appearance-none"
                    style={selectArrowStyle}
                  >
                    <option value="">Select a concern type...</option>
                    {CONCERN_TYPES.map((ct) => (
                      <option key={ct.value} value={ct.value}>
                        {ct.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                    Brief description <span className="text-[#ef4444]">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                    rows={4}
                    maxLength={500}
                    className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm placeholder-[#9490b0]/50 focus:border-[#d97706] focus:outline-none transition resize-none"
                    placeholder="In a few sentences, describe what happened"
                  />
                  <p className="text-[#9490b0]/60 text-xs mt-1 text-right">
                    {description.length}/500
                  </p>
                </div>

                {/* Consent */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#2a2440] bg-[#15111e] text-[#d97706] focus:ring-[#d97706] focus:ring-offset-0 cursor-pointer"
                  />
                  <label
                    htmlFor="consent"
                    className="text-[#9490b0] text-sm leading-relaxed cursor-pointer"
                  >
                    I understand this form does not create an attorney-client
                    relationship and does not evaluate my legal rights.
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm px-4 py-3 rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="relative w-full group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 rounded-xl bg-[#d97706] blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                    <span className="relative block bg-[#d97706] hover:bg-[#f59e0b] text-white px-8 py-4 rounded-xl text-base font-semibold transition shadow-lg shadow-[#d97706]/20 text-center">
                      {submitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Request Attorney Review"
                      )}
                    </span>
                  </button>
                  <p className="text-center text-[#9490b0] text-xs mt-3">
                    Your information is confidential and will only be shared
                    with attorneys who may be able to help.
                  </p>
                </div>
              </form>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════ TRUST SIGNALS ══════════════════ */}
        <section className="py-20 md:py-28 border-t border-[#2a2440]/50 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#15111e]/30 via-transparent to-[#15111e]/30 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 relative">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why People Trust Us
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <AnimatedSection delay={0}>
                <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 text-center h-full hover:border-[#3d3660] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">
                    Completely Free
                  </h3>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    You will never be asked to pay. Attorneys in our network
                    compensate us when they accept a case. The service costs
                    you nothing.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 text-center h-full hover:border-[#3d3660] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">
                    Vetted Attorneys
                  </h3>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    We only work with experienced medical malpractice attorneys
                    who specialize in your type of case and are licensed in
                    your state.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="bg-[#15111e]/80 backdrop-blur-xl border border-[#2a2440] rounded-2xl p-8 text-center h-full hover:border-[#3d3660] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#4f8ff7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-[#e5e2ff] font-semibold text-lg mb-2">
                    Confidential
                  </h3>
                  <p className="text-[#9490b0] text-sm leading-relaxed">
                    Your information is private. We only share it with
                    attorneys who may be able to help with your specific
                    situation. We never sell your data.
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#d97706]/10 via-[#4f8ff7]/5 to-[#d97706]/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a14] via-transparent to-[#0c0a14]" />

          <div
            className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.08]"
            style={{
              background: "radial-gradient(circle, #d97706 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                You Deserve{" "}
                <span className="bg-gradient-to-r from-[#d97706] to-[#f59e0b] bg-clip-text text-transparent">
                  Answers.
                </span>
              </h2>
              <p className="text-[#9490b0] text-lg mb-10 max-w-xl mx-auto">
                If something went wrong with your medical care, you have the
                right to find out. Let us connect you with someone who can help
                &mdash; at no cost.
              </p>
              <a href="#intake-form" className="relative inline-block group">
                <span className="absolute inset-0 rounded-xl bg-[#d97706] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <span className="relative inline-block bg-[#d97706] hover:bg-[#f59e0b] text-white px-10 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-[#d97706]/20 hover:shadow-[#d97706]/40">
                  Request Attorney Review &mdash; Free
                </span>
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════ FOR ATTORNEYS BANNER ══════════════════ */}
        <section className="py-12 border-t border-[#2a2440]/50">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#9490b0] text-sm">
              Are you an attorney?{" "}
              <Link href="/attorney" className="text-[#4f8ff7] hover:text-[#6ba1ff] font-medium transition">
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
