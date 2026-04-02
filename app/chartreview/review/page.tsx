"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────── types ─────────────────────────── */

interface RiskFlag {
  issue: string;
  whyItMatters: string;
  suggestedFix: string;
  severity: "critical" | "major" | "minor";
}

interface DocumentationItem {
  item: string;
  present: boolean;
  note: string;
}

interface ChartReviewResult {
  overallGrade: string;
  overallScore: number;
  gradeSummary: string;
  documentationCompleteness: {
    score: number;
    items: DocumentationItem[];
    summary: string;
  };
  riskFlags: RiskFlag[];
  standardOfCare: {
    met: boolean;
    details: string;
    gaps: string[];
  };
  dispositionSafety: {
    safe: boolean;
    concerns: string[];
    summary: string;
  };
  suggestedAdditions: string[];
  cognitiveBiases: {
    detected: string[];
    suggestions: string[];
  };
  billingAlignment: {
    supported: boolean;
    currentLevel: string;
    supportedLevel: string;
    notes: string;
  };
  analysisMode: "ai" | "demo";
}

/* ─────────────────────────── constants ─────────────────────────── */

const chiefComplaints = [
  "Chest Pain",
  "Abdominal Pain",
  "Headache",
  "Shortness of Breath",
  "Back Pain",
  "Syncope / Near-Syncope",
  "Altered Mental Status",
  "Fever",
  "Trauma / Fall",
  "Extremity Pain / Injury",
  "Dizziness / Vertigo",
  "Vaginal Bleeding",
  "Pediatric Fever",
  "Testicular Pain",
  "Laceration / Wound",
  "Other",
];

const facilityTypes = [
  "Academic ED",
  "Community ED",
  "Urgent Care",
  "Critical Access",
  "Freestanding ED",
  "Surgical",
  "Pediatric ED",
];

/* ─────────────────────────── grade color utils ─────────────────────────── */

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "text-[#22c55e]";
    case "B": return "text-[#4ade80]";
    case "C": return "text-[#eab308]";
    case "D": return "text-[#f97316]";
    case "F": return "text-[#ef4444]";
    default: return "text-[#9490b0]";
  }
}

function gradeBg(grade: string): string {
  switch (grade) {
    case "A": return "bg-[#22c55e]/10 border-[#22c55e]/30";
    case "B": return "bg-[#4ade80]/10 border-[#4ade80]/30";
    case "C": return "bg-[#eab308]/10 border-[#eab308]/30";
    case "D": return "bg-[#f97316]/10 border-[#f97316]/30";
    case "F": return "bg-[#ef4444]/10 border-[#ef4444]/30";
    default: return "bg-[#9490b0]/10 border-[#9490b0]/30";
  }
}

function severityColor(severity: string): { bg: string; text: string; label: string } {
  switch (severity) {
    case "critical": return { bg: "bg-red-500/10 border-red-500/30", text: "text-red-400", label: "CRITICAL" };
    case "major": return { bg: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-400", label: "MAJOR" };
    case "minor": return { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-400", label: "MINOR" };
    default: return { bg: "bg-gray-500/10 border-gray-500/30", text: "text-gray-400", label: severity.toUpperCase() };
  }
}

/* ─────────────────────────── collapsible section ─────────────────────────── */

function ReviewSection({
  title,
  icon,
  accentColor,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      layout
      className={`rounded-2xl border bg-[#15111e]/60 backdrop-blur-xl overflow-hidden ${accentColor} transition-colors duration-300`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 active:bg-[#1c1729] transition-colors touch-manipulation"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-[#e5e2ff] text-left text-base">{title}</span>
          {badge}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#9490b0] text-lg"
        >
          &#x25BC;
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────── main page ─────────────────────────── */

export default function ChartReviewPage() {
  const [chartText, setChartText] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChartReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chartText.trim() || chartText.trim().length < 20) {
      setError("Please paste a chart note with at least 20 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/chartreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chartText: chartText.trim(),
          chiefComplaint: chiefComplaint || undefined,
          facilityType: facilityType || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to process review.");
      }

      const data: ChartReviewResult = await res.json();
      setResult(data);

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      setChartText(text);
    } else if (file.type === "application/pdf") {
      // PDF handling would require server-side extraction
      setError("PDF upload requires processing. Please paste your chart text directly for now.");
    } else {
      setError("Please upload a .txt or .pdf file, or paste your chart text directly.");
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function copySuggestedAdditions() {
    if (!result?.suggestedAdditions.length) return;
    const text = result.suggestedAdditions.join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNewReview() {
    setResult(null);
    setChartText("");
    setChiefComplaint("");
    setFacilityType("");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#0c0a14]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#0c0a14]/90 backdrop-blur-md border-b border-[#2a2440]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/chartreview"
              className="shrink-0 w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center text-white font-bold text-sm"
            >
              CR
            </Link>
            <div>
              <span className="text-[#e5e2ff] font-semibold text-base">ChartReview Pro</span>
              <span className="text-[#9490b0] text-xs block sm:inline sm:ml-2">Review Before You Sign</span>
            </div>
          </div>
          <Link
            href="/chartreview"
            className="text-[#9490b0] hover:text-[#e5e2ff] text-sm transition"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20">
        {/* ── Input Form ── */}
        {!result && (
          <motion.form
            onSubmit={handleSubmit}
            className="pt-6 space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <label className="block text-[#e5e2ff] text-sm font-semibold mb-2">
                Chart Note
              </label>
              <textarea
                value={chartText}
                onChange={(e) => setChartText(e.target.value)}
                placeholder="Paste your chart note here..."
                rows={12}
                className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] placeholder:text-[#9490b0]/50 text-sm leading-relaxed resize-y focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/30 transition touch-manipulation"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#9490b0] text-xs">
                  {chartText.length > 0 ? `${chartText.length.toLocaleString()} characters` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#22c55e] text-xs font-medium hover:text-[#4ade80] transition touch-manipulation"
                >
                  Or upload a file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#e5e2ff] text-sm font-semibold mb-2">
                  Chief Complaint
                  <span className="text-[#9490b0] font-normal ml-1">(optional)</span>
                </label>
                <select
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/30 transition appearance-none touch-manipulation"
                >
                  <option value="">Select chief complaint...</option>
                  {chiefComplaints.map((cc) => (
                    <option key={cc} value={cc}>{cc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#e5e2ff] text-sm font-semibold mb-2">
                  Facility Type
                  <span className="text-[#9490b0] font-normal ml-1">(optional)</span>
                </label>
                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/30 transition appearance-none touch-manipulation"
                >
                  <option value="">Select facility type...</option>
                  {facilityTypes.map((ft) => (
                    <option key={ft} value={ft}>{ft}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || chartText.trim().length < 20}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-[#22c55e]/30 disabled:cursor-not-allowed text-white py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40 touch-manipulation"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Reviewing your chart...
                </span>
              ) : (
                "Review My Chart"
              )}
            </button>

          </motion.form>
        )}

        {/* ── Results ── */}
        {result && (
          <div ref={resultRef} className="pt-6 space-y-4">
            {/* Demo banner */}
            {result.analysisMode === "demo" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#eab308]/10 border border-[#eab308]/30 rounded-xl px-4 py-3 text-[#eab308] text-sm text-center"
              >
                Demo Mode — AI analysis unavailable. Showing sample review.
              </motion.div>
            )}

            {/* Overall Grade */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl border ${gradeBg(result.overallGrade)} p-6 text-center`}
            >
              <div className={`text-6xl font-bold mb-2 ${gradeColor(result.overallGrade)}`}>
                {result.overallGrade}
              </div>
              <div className="text-[#e5e2ff] text-sm font-semibold mb-1">
                Overall Documentation Score: {result.overallScore}/100
              </div>
              <p className="text-[#9490b0] text-sm leading-relaxed max-w-lg mx-auto">
                {result.gradeSummary}
              </p>
            </motion.div>

            {/* Documentation Completeness */}
            <ReviewSection
              title="Documentation Completeness"
              icon={
                <svg className="w-5 h-5 text-[#4f8ff7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              }
              accentColor="border-[#4f8ff7]/30"
              badge={
                <span className="text-[#9490b0] text-xs bg-[#0c0a14] px-2 py-0.5 rounded-full">
                  {result.documentationCompleteness.score}%
                </span>
              }
              defaultOpen={true}
            >
              <p className="text-[#9490b0] text-sm mb-4">{result.documentationCompleteness.summary}</p>
              <div className="space-y-2">
                {result.documentationCompleteness.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 shrink-0 ${item.present ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                      {item.present ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <div>
                      <span className="text-[#e5e2ff] font-medium">{item.item}</span>
                      <span className="text-[#9490b0] ml-2">{item.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ReviewSection>

            {/* Risk Flags */}
            <ReviewSection
              title="Risk Flags"
              icon={
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              }
              accentColor="border-red-500/30"
              badge={
                <span className="text-red-400 text-xs bg-red-500/10 px-2 py-0.5 rounded-full">
                  {result.riskFlags.length} flags
                </span>
              }
              defaultOpen={result.riskFlags.some((f) => f.severity === "critical")}
            >
              {result.riskFlags.length === 0 ? (
                <p className="text-[#22c55e] text-sm">No risk flags identified. Nice work.</p>
              ) : (
                <div className="space-y-4">
                  {result.riskFlags.map((flag, i) => {
                    const sev = severityColor(flag.severity);
                    return (
                      <div key={i} className={`rounded-xl border ${sev.bg} p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text} border`}>
                            {sev.label}
                          </span>
                          <span className="text-[#e5e2ff] text-sm font-semibold">{flag.issue}</span>
                        </div>
                        <p className="text-[#9490b0] text-xs leading-relaxed mb-2">
                          <span className="text-[#e5e2ff] font-medium">Why it matters:</span> {flag.whyItMatters}
                        </p>
                        <div className="bg-[#0c0a14]/60 rounded-lg px-3 py-2">
                          <p className="text-xs text-[#9490b0] mb-1 font-medium">Suggested fix:</p>
                          <p className="text-[#22c55e] text-xs leading-relaxed">{flag.suggestedFix}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ReviewSection>

            {/* Standard of Care */}
            <ReviewSection
              title="Standard of Care"
              icon={
                <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.049 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                </svg>
              }
              accentColor="border-[#22c55e]/30"
              badge={
                <span className={`text-xs px-2 py-0.5 rounded-full ${result.standardOfCare.met ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#ef4444] bg-[#ef4444]/10"}`}>
                  {result.standardOfCare.met ? "MET" : "GAPS FOUND"}
                </span>
              }
            >
              <p className="text-[#9490b0] text-sm mb-3">{result.standardOfCare.details}</p>
              {result.standardOfCare.gaps.length > 0 && (
                <ul className="space-y-2">
                  {result.standardOfCare.gaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[#ef4444] mt-0.5 shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-[#e5e2ff]/90">{gap}</span>
                    </li>
                  ))}
                </ul>
              )}
            </ReviewSection>

            {/* Disposition Safety */}
            <ReviewSection
              title="Disposition Safety"
              icon={
                <svg className="w-5 h-5 text-[#eab308]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              }
              accentColor="border-[#eab308]/30"
              badge={
                <span className={`text-xs px-2 py-0.5 rounded-full ${result.dispositionSafety.safe ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#eab308] bg-[#eab308]/10"}`}>
                  {result.dispositionSafety.safe ? "DEFENSIBLE" : "CONCERNS"}
                </span>
              }
            >
              <p className="text-[#9490b0] text-sm mb-3">{result.dispositionSafety.summary}</p>
              {result.dispositionSafety.concerns.length > 0 && (
                <ul className="space-y-2">
                  {result.dispositionSafety.concerns.map((concern, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[#eab308] mt-0.5 shrink-0">&bull;</span>
                      <span className="text-[#e5e2ff]/90">{concern}</span>
                    </li>
                  ))}
                </ul>
              )}
            </ReviewSection>

            {/* Cognitive Biases */}
            <ReviewSection
              title="Cognitive Bias Check"
              icon={
                <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              }
              accentColor="border-[#f97316]/30"
            >
              {result.cognitiveBiases.detected.length === 0 ? (
                <p className="text-[#22c55e] text-sm">No cognitive biases detected in this chart.</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-[#e5e2ff] text-xs font-semibold mb-2">Detected:</p>
                    <ul className="space-y-2">
                      {result.cognitiveBiases.detected.map((bias, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-[#f97316] mt-0.5 shrink-0">&bull;</span>
                          <span className="text-[#e5e2ff]/90">{bias}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {result.cognitiveBiases.suggestions.length > 0 && (
                    <div>
                      <p className="text-[#e5e2ff] text-xs font-semibold mb-2">Suggestions:</p>
                      <ul className="space-y-2">
                        {result.cognitiveBiases.suggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[#22c55e] mt-0.5 shrink-0">&bull;</span>
                            <span className="text-[#9490b0]">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </ReviewSection>

            {/* Billing Alignment */}
            <ReviewSection
              title="Billing/Coding Alignment"
              icon={
                <svg className="w-5 h-5 text-[#06b6d4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              }
              accentColor="border-[#06b6d4]/30"
              badge={
                <span className={`text-xs px-2 py-0.5 rounded-full ${result.billingAlignment.supported ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#eab308] bg-[#eab308]/10"}`}>
                  {result.billingAlignment.supported ? "ALIGNED" : "MISMATCH"}
                </span>
              }
            >
              <div className="space-y-2 text-sm">
                <div className="flex gap-4">
                  <div>
                    <span className="text-[#9490b0] text-xs">Current Level</span>
                    <p className="text-[#e5e2ff] font-medium">{result.billingAlignment.currentLevel || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[#9490b0] text-xs">Supported Level</span>
                    <p className="text-[#e5e2ff] font-medium">{result.billingAlignment.supportedLevel || "N/A"}</p>
                  </div>
                </div>
                <p className="text-[#9490b0] text-sm leading-relaxed">{result.billingAlignment.notes}</p>
              </div>
            </ReviewSection>

            {/* Suggested Additions */}
            {result.suggestedAdditions.length > 0 && (
              <ReviewSection
                title="Suggested Additions"
                icon={
                  <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                }
                accentColor="border-[#22c55e]/30"
                defaultOpen={true}
              >
                <p className="text-[#9490b0] text-xs mb-3">
                  Copy these directly into your chart before signing.
                </p>
                <div className="space-y-3">
                  {result.suggestedAdditions.map((addition, i) => (
                    <div key={i} className="bg-[#0c0a14]/60 rounded-lg px-3 py-2">
                      <p className="text-[#22c55e] text-sm leading-relaxed">{addition}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={copySuggestedAdditions}
                  className="mt-4 w-full bg-[#22c55e]/10 hover:bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e] py-3 rounded-xl text-sm font-semibold transition-all duration-300 touch-manipulation"
                >
                  {copied ? "Copied to Clipboard" : "Copy All Suggested Additions"}
                </button>
              </ReviewSection>
            )}

            {/* New Review button */}
            <div className="pt-4 pb-8">
              <button
                type="button"
                onClick={handleNewReview}
                className="w-full border border-[#2a2440] hover:border-[#22c55e]/50 text-[#e5e2ff] hover:bg-[#22c55e]/10 py-3 rounded-xl text-sm font-semibold transition-all duration-300 touch-manipulation"
              >
                Review Another Chart
              </button>
              <p className="text-center text-[#9490b0] text-xs pt-4">
                ChartReview Pro by MedMal Review. Not a substitute for clinical judgment.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
