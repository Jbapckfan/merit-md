"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────── sample chart note ─────────────────────────── */

const SAMPLE_CHART = `EMERGENCY DEPARTMENT NOTE

Patient: [REDACTED], 52 y/o male
Date: 03/15/2026, 02:47 AM
Chief Complaint: Chest pain

HPI: Patient presents with chest pain that started about 3 hours ago. He says the pain is substernal, pressure-like, radiating to his left arm. He has a history of hypertension and diabetes. He took an aspirin before coming in. He rates the pain 7/10. He has had similar pain before but "not this bad." He denies shortness of breath. He smokes 1 pack/day.

ROS: Chest pain as above. Denies fever, cough, abdominal pain, or leg swelling.

PMH: HTN, DM2, hyperlipidemia
Meds: Lisinopril 20mg, metformin 1000mg BID
Allergies: NKDA

Physical Exam:
VS: BP 158/94, HR 88, RR 18, SpO2 97% on RA, Temp 98.6F
Gen: Alert, oriented, mild distress
CV: Regular rate and rhythm, no murmurs
Lungs: Clear bilaterally
Abd: Soft, non-tender

Results:
Initial troponin: 0.04 (borderline)
ECG: NSR, no acute ST changes
CXR: No acute findings
BMP: Normal

MDM: 52 y/o male with chest pain, HTN, DM. Initial troponin borderline. ECG unremarkable. Will observe and repeat troponin.

Disposition: Discharge home. Follow up with PCP in 2 days. Return if symptoms worsen.

Discharge Instructions: Return to ED if chest pain returns or worsens.`;

/* ─────────────────────────── sample review result ─────────────────────────── */

const SAMPLE_RESULT = {
  overallGrade: "C",
  overallScore: 58,
  gradeSummary: "This chart has several documentation areas that may benefit from additional detail. The borderline troponin without a documented repeat result and plan, combined with limited risk stratification documentation, are the primary considerations.",
  documentationCompleteness: {
    score: 55,
    items: [
      { item: "Chief Complaint", present: true, note: "Documented" },
      { item: "HPI — Onset/Duration", present: true, note: "Approximately 3 hours ago" },
      { item: "HPI — Quality/Character", present: true, note: "Substernal, pressure-like" },
      { item: "HPI — Radiation", present: true, note: "Left arm" },
      { item: "HPI — Severity", present: true, note: "7/10" },
      { item: "HPI — Pertinent Negatives", present: false, note: "Missing: nausea/vomiting, diaphoresis, jaw pain, exertional component not documented" },
      { item: "HPI — Prior Episodes Workup", present: false, note: "Patient reports prior similar pain — no documentation of previous workup or cardiac history" },
      { item: "ROS — Completeness", present: false, note: "Minimal ROS. Missing neurological, musculoskeletal, and relevant GI (nausea/vomiting) review" },
      { item: "Physical Exam — Completeness", present: false, note: "No extremity exam (edema, pulses), no skin exam (diaphoresis)" },
      { item: "Risk Stratification", present: false, note: "No HEART score, TIMI score, or other risk stratification documented" },
      { item: "Serial Troponin Plan", present: false, note: "Borderline initial troponin with no documented repeat or observation period" },
      { item: "MDM — Data Review", present: true, note: "Labs and ECG referenced" },
      { item: "MDM — Risk Discussion", present: false, note: "No documentation of risk assessment or differential diagnosis reasoning" },
      { item: "Discharge Criteria", present: false, note: "No documentation of why patient is safe for discharge with borderline troponin" },
    ],
    summary: "Key documentation elements are missing, particularly around risk stratification, serial troponin management, and the clinical reasoning supporting discharge with a borderline troponin result.",
  },
  riskFlags: [
    {
      issue: "Borderline troponin without documented repeat",
      whyItMatters: "A borderline troponin (0.04) in a chest pain patient with cardiac risk factors (HTN, DM, smoking, hyperlipidemia) typically warrants serial troponins. The chart does not document a repeat troponin result or a clinical reason for not obtaining one.",
      suggestedFix: "Document: 'Repeat troponin at [time] was [result]' or 'Serial troponins not obtained because [clinical reasoning].' If the patient refused observation, document the refusal conversation and risks discussed.",
      severity: "critical" as const,
    },
    {
      issue: "No risk stratification score documented",
      whyItMatters: "For chest pain presentations with cardiac risk factors, documenting a validated risk score (HEART, TIMI, etc.) supports the clinical decision-making and provides a framework for disposition. This is increasingly considered standard documentation practice.",
      suggestedFix: "Add: 'HEART score calculated: H=[x] E=[x] A=[x] R=[x] T=[x], Total=[x], suggesting [low/moderate/high] risk for MACE at 6 weeks.'",
      severity: "critical" as const,
    },
    {
      issue: "Discharge disposition documentation gap",
      whyItMatters: "The chart documents discharge of a patient with borderline troponin and multiple cardiac risk factors without documenting the clinical reasoning for why discharge is appropriate. If this patient returns with an MI, the lack of documented reasoning may be difficult to defend.",
      suggestedFix: "Add: 'Patient meets discharge criteria based on [negative serial troponins / low HEART score / symptom resolution / other reasoning]. Risks of discharge vs. admission discussed. Patient understands return precautions.'",
      severity: "critical" as const,
    },
    {
      issue: "Missing pertinent negatives in HPI",
      whyItMatters: "For chest pain, pertinent negatives (nausea, vomiting, diaphoresis, jaw pain, pleuritic component, positional component, exertional vs. rest) help narrow the differential and demonstrate thorough evaluation.",
      suggestedFix: "Add: 'Patient denies nausea, vomiting, diaphoresis, jaw pain. Pain is not positional or pleuritic. Pain occurred at rest.'",
      severity: "major" as const,
    },
    {
      issue: "Vague return precautions",
      whyItMatters: "Return precautions that only say 'return if symptoms worsen' may not adequately inform the patient. Specific, actionable return precautions are considered stronger documentation.",
      suggestedFix: "Consider: 'Return to ED immediately if: chest pain returns or worsens, new shortness of breath, lightheadedness or syncope, pain radiating to jaw or arm, diaphoresis, or any new concerning symptoms. Call 911 if symptoms are severe.'",
      severity: "major" as const,
    },
  ],
  standardOfCare: {
    met: false,
    details: "For a 52-year-old male with substernal chest pain, cardiac risk factors, and a borderline troponin, current guidelines generally recommend serial troponin testing and formal risk stratification. The documentation does not reflect these elements.",
    gaps: [
      "No serial troponin documented (ACC/AHA guidelines recommend serial testing with borderline initial result)",
      "No HEART score or equivalent risk stratification documented",
      "No documentation of observation period or clinical reassessment",
      "Prior cardiac history not explored despite patient reporting similar previous episodes",
    ],
  },
  dispositionSafety: {
    safe: false,
    concerns: [
      "Borderline troponin without documented repeat or clinical reasoning for single-draw approach",
      "Multiple cardiac risk factors (HTN, DM, smoking, hyperlipidemia, age >50, male) without risk score documentation",
      "Patient reports prior similar episodes — no documentation of previous cardiac workup",
      "2 AM presentation may suggest nocturnal or rest angina — not addressed in documentation",
    ],
    summary: "The disposition documentation could be strengthened. The clinical reasoning for discharging a patient with this risk profile and borderline troponin is not documented.",
  },
  suggestedAdditions: [
    "Patient denies nausea, vomiting, diaphoresis, jaw pain, syncope, or near-syncope. Pain is not positional, pleuritic, or reproducible with palpation. Pain occurred at rest while sleeping.",
    "HEART score: H=1 (slightly suspicious), E=1 (nonspecific repolarization), A=2 (>65 or 3+ risk factors), R=2 (HTN, DM, hyperlipidemia, smoking), T=1 (1-3x normal). Total = 7. This suggests moderate-to-high risk for MACE at 6 weeks.",
    "Repeat troponin at [TIME]: [RESULT]. Delta troponin: [CHANGE].",
    "Discussed with patient the risks of discharge including the possibility of acute coronary syndrome. Patient understands the importance of follow-up within 24-48 hours and immediate return for recurrent or worsening symptoms. Patient verbalizes understanding and agrees with plan.",
    "Return to ED immediately for: recurrent chest pain, shortness of breath, lightheadedness, syncope, diaphoresis, pain radiating to jaw or arms, or any new symptoms that concern you. Call 911 for severe symptoms — do not drive yourself.",
  ],
  cognitiveBiases: {
    detected: [
      "Potential anchoring on initial negative ECG — normal ECG does not exclude ACS, particularly with borderline troponin",
      "Possible premature closure — discharge plan documented before serial troponins or risk stratification completed",
    ],
    suggestions: [
      "Consider documenting differential diagnosis explicitly to demonstrate broad diagnostic thinking",
      "Document why ACS is being deprioritized if that is the clinical assessment, including specific supporting evidence",
    ],
  },
  billingAlignment: {
    supported: false,
    currentLevel: "Not specified",
    supportedLevel: "E/M 99284 (moderate complexity)",
    notes: "The documentation supports moderate MDM complexity given the borderline troponin and multiple risk factors. However, the MDM section lacks the depth typically expected for high-complexity billing (99285). Adding explicit risk stratification, differential diagnosis discussion, and serial troponin results would support higher complexity billing.",
  },
  analysisMode: "demo" as const,
};

/* ─────────────────────────── grade utilities ─────────────────────────── */

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

/* ─────────────────────────── demo page ─────────────────────────── */

export default function ChartReviewDemoPage() {
  const [copied, setCopied] = useState(false);
  const result = SAMPLE_RESULT;

  function copySuggestedAdditions() {
    const text = result.suggestedAdditions.join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <span className="text-[#eab308] text-xs block sm:inline sm:ml-2">Sample Review</span>
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
        {/* ── Demo banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-[#eab308]/10 border border-[#eab308]/30 rounded-xl px-4 py-3 text-center"
        >
          <p className="text-[#eab308] text-sm font-medium">
            Sample Review — This is a fictional chart note with intentional documentation gaps
          </p>
          <p className="text-[#9490b0] text-xs mt-1">
            All patient details are entirely fabricated for demonstration purposes.
          </p>
        </motion.div>

        {/* ── Sample chart note (collapsed) ── */}
        <div className="mt-4">
          <ReviewSection
            title="Sample Chart Note (Fictional)"
            icon={
              <svg className="w-5 h-5 text-[#9490b0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            }
            accentColor="border-[#2a2440]"
            defaultOpen={false}
          >
            <pre className="text-[#9490b0] text-xs leading-relaxed whitespace-pre-wrap font-mono">
              {SAMPLE_CHART}
            </pre>
          </ReviewSection>
        </div>

        {/* ── Review Results ── */}
        <div className="mt-4 space-y-4">
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

          {/* Documentation Considerations */}
          <ReviewSection
            title="Documentation Considerations"
            icon={
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            }
            accentColor="border-red-500/30"
            badge={
              <span className="text-red-400 text-xs bg-red-500/10 px-2 py-0.5 rounded-full">
                {result.riskFlags.length} items
              </span>
            }
            defaultOpen={true}
          >
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
                      <p className="text-xs text-[#9490b0] mb-1 font-medium">Suggested addition:</p>
                      <p className="text-[#22c55e] text-xs leading-relaxed">{flag.suggestedFix}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ReviewSection>

          {/* Guideline Alignment */}
          <ReviewSection
            title="Guideline Alignment"
            icon={
              <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.049 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
              </svg>
            }
            accentColor="border-[#22c55e]/30"
            badge={
              <span className="text-[#ef4444] text-xs bg-[#ef4444]/10 px-2 py-0.5 rounded-full">
                CONSIDERATIONS
              </span>
            }
          >
            <p className="text-[#9490b0] text-sm mb-3">{result.standardOfCare.details}</p>
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
          </ReviewSection>

          {/* Disposition Documentation */}
          <ReviewSection
            title="Disposition Documentation"
            icon={
              <svg className="w-5 h-5 text-[#eab308]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
              </svg>
            }
            accentColor="border-[#eab308]/30"
            badge={
              <span className="text-[#eab308] text-xs bg-[#eab308]/10 px-2 py-0.5 rounded-full">
                CONSIDERATIONS
              </span>
            }
          >
            <p className="text-[#9490b0] text-sm mb-3">{result.dispositionSafety.summary}</p>
            <ul className="space-y-2">
              {result.dispositionSafety.concerns.map((concern, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-[#eab308] mt-0.5 shrink-0">&bull;</span>
                  <span className="text-[#e5e2ff]/90">{concern}</span>
                </li>
              ))}
            </ul>
          </ReviewSection>

          {/* Cognitive Bias Awareness */}
          <ReviewSection
            title="Cognitive Bias Awareness"
            icon={
              <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            }
            accentColor="border-[#f97316]/30"
          >
            <div className="space-y-3">
              <div>
                <p className="text-[#e5e2ff] text-xs font-semibold mb-2">Patterns identified:</p>
                <ul className="space-y-2">
                  {result.cognitiveBiases.detected.map((bias, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[#f97316] mt-0.5 shrink-0">&bull;</span>
                      <span className="text-[#e5e2ff]/90">{bias}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
            </div>
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
              <span className="text-[#eab308] text-xs bg-[#eab308]/10 px-2 py-0.5 rounded-full">
                MISMATCH
              </span>
            }
          >
            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <div>
                  <span className="text-[#9490b0] text-xs">Current Level</span>
                  <p className="text-[#e5e2ff] font-medium">{result.billingAlignment.currentLevel}</p>
                </div>
                <div>
                  <span className="text-[#9490b0] text-xs">Supported Level</span>
                  <p className="text-[#e5e2ff] font-medium">{result.billingAlignment.supportedLevel}</p>
                </div>
              </div>
              <p className="text-[#9490b0] text-sm leading-relaxed">{result.billingAlignment.notes}</p>
            </div>
          </ReviewSection>

          {/* Suggested Additions */}
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
              Review these suggestions and add to your chart at your discretion before signing.
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
        </div>

        {/* ── CTA ── */}
        <div className="mt-8 mb-12">
          <div className="bg-[#15111e]/60 border border-[#22c55e]/30 rounded-2xl p-8 text-center">
            <h2 className="text-[#e5e2ff] text-2xl font-bold mb-3">
              Try it with your own chart
            </h2>
            <p className="text-[#9490b0] text-sm mb-6 max-w-md mx-auto">
              Paste any chart note and get a comprehensive documentation review in 30 seconds. 2 free reviews per month, no signup required.
            </p>
            <Link
              href="/chartreview/review"
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40"
            >
              Review Your Own Chart
            </Link>
          </div>
        </div>

        <p className="text-center text-[#9490b0] text-xs pb-8">
          ChartReview Pro by MedMal Review. For licensed healthcare professionals only. Does not replace clinical judgment.
        </p>
      </main>
    </div>
  );
}
