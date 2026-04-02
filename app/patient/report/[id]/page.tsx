"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ConsumerReport, ConsumerFinding } from "@/lib/consumer-analysis";

interface PatientCaseData {
  id: string;
  email: string;
  description: string;
  incident_date: string | null;
  facility: string | null;
  outcome_type: string | null;
  tier: string;
  status: string;
  analysis: string | null;
  score: number | null;
  created_at: string;
}

interface UploadInfo {
  filename: string;
  mime_type: string;
}

function VerdictBadge({ verdict, label }: { verdict: ConsumerReport["verdict"]; label: string }) {
  const config = {
    potential_issues: {
      bg: "bg-[#eab308]/10",
      border: "border-[#eab308]/30",
      text: "text-[#eab308]",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      ),
    },
    unclear: {
      bg: "bg-[#4f8ff7]/10",
      border: "border-[#4f8ff7]/30",
      text: "text-[#4f8ff7]",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      ),
    },
    care_appears_appropriate: {
      bg: "bg-[#22c55e]/10",
      border: "border-[#22c55e]/30",
      text: "text-[#22c55e]",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const c = config[verdict];

  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-2xl p-6 md:p-8 text-center`}>
      <div className={`${c.text} flex justify-center mb-4`}>{c.icon}</div>
      <h2 className={`${c.text} text-2xl md:text-3xl font-bold`}>{label}</h2>
    </div>
  );
}

function SeverityDot({ severity }: { severity: ConsumerFinding["severity"] }) {
  const colors = {
    serious: "bg-[#ef4444]",
    moderate: "bg-[#eab308]",
    minor: "bg-[#4f8ff7]",
  };
  const labels = {
    serious: "Serious",
    moderate: "Moderate",
    minor: "Minor",
  };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${colors[severity]}`} />
      <span className="text-[#9490b0] text-xs font-medium uppercase tracking-wider">
        {labels[severity]}
      </span>
    </span>
  );
}

export default function PatientReportPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<PatientCaseData | null>(null);
  const [report, setReport] = useState<ConsumerReport | null>(null);
  const [uploads, setUploads] = useState<UploadInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/patient?id=${caseId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Report not found");
        return res.json();
      })
      .then((data) => {
        setCaseData(data.patientCase);
        setUploads(data.uploads || []);
        if (data.patientCase.analysis) {
          try {
            setReport(JSON.parse(data.patientCase.analysis));
          } catch {
            setError("Failed to load report data");
          }
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-8 h-8 text-[#4f8ff7]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-[#9490b0]">Loading your report...</p>
        </main>
      </>
    );
  }

  if (error || !caseData) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-[#ef4444] mb-4">{error || "Report not found"}</div>
          <Link href="/patient" className="text-[#4f8ff7] hover:text-[#6ba1ff] text-sm transition">
            Back to Home
          </Link>
        </main>
      </>
    );
  }

  if (caseData.status === "processing") {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-8 h-8 text-[#4f8ff7]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Analyzing Your Records</h2>
          <p className="text-[#9490b0]">
            Your case is being reviewed. This usually takes just a few minutes.
          </p>
        </main>
      </>
    );
  }

  if (caseData.status === "error") {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-[#ef4444] mb-4">
            We had trouble analyzing your records. Please try again.
          </div>
          <Link href="/patient/upload" className="text-[#4f8ff7] hover:text-[#6ba1ff] text-sm transition">
            Try Again
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-8 md:py-12">
        {/* Demo mode banner */}
        {report?.analysisMode === "demo" && (
          <AnimatedSection>
            <div className="bg-[#eab308]/10 border border-[#eab308]/30 text-[#eab308] text-sm px-4 py-3 rounded-xl mb-6">
              Demo Mode -- This is a sample report showing the type of analysis you would receive. AI analysis is not currently available.
            </div>
          </AnimatedSection>
        )}

        {/* Verdict */}
        {report && (
          <AnimatedSection>
            <VerdictBadge verdict={report.verdict} label={report.verdictLabel} />
          </AnimatedSection>
        )}

        {/* What you told us */}
        <AnimatedSection delay={0.1}>
          <section className="bg-[#15111e]/80 border border-[#2a2440] rounded-2xl p-6 mt-6">
            <h3 className="text-[#9490b0] text-xs font-medium uppercase tracking-wider mb-3">
              What You Told Us
            </h3>
            <p className="text-[#e5e2ff] text-sm leading-relaxed">{caseData.description}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-[#9490b0]">
              {caseData.facility && (
                <span>Facility: {caseData.facility}</span>
              )}
              {caseData.incident_date && (
                <span>Date: {new Date(caseData.incident_date).toLocaleDateString()}</span>
              )}
              {uploads.length > 0 && (
                <span>{uploads.length} file{uploads.length !== 1 ? "s" : ""} uploaded</span>
              )}
            </div>
          </section>
        </AnimatedSection>

        {report && (
          <>
            {/* What We Found */}
            {report.whatWeFound.length > 0 && (
              <AnimatedSection delay={0.2}>
                <section className="mt-6">
                  <h3 className="text-[#e5e2ff] text-lg font-semibold mb-4">
                    What We Found
                  </h3>
                  <div className="space-y-4">
                    {report.whatWeFound.map((finding, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                        className="bg-[#15111e]/80 border border-[#2a2440] rounded-2xl p-6"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="text-[#e5e2ff] font-medium text-sm leading-relaxed flex-1">
                            {finding.issue}
                          </h4>
                          <SeverityDot severity={finding.severity} />
                        </div>
                        <p className="text-[#9490b0] text-sm leading-relaxed">
                          {finding.explanation}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </AnimatedSection>
            )}

            {/* What This Means */}
            <AnimatedSection delay={0.3}>
              <section className="bg-[#15111e]/80 border border-[#2a2440] rounded-2xl p-6 mt-6">
                <h3 className="text-[#e5e2ff] text-lg font-semibold mb-3">
                  What This Means
                </h3>
                {report.whatThisMeans.split("\n").map((paragraph, i) => (
                  <p key={i} className="text-[#9490b0] text-sm leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            </AnimatedSection>

            {/* What You Should Do */}
            {report.whatYouShouldDo.length > 0 && (
              <AnimatedSection delay={0.4}>
                <section className="bg-[#15111e]/80 border border-[#4f8ff7]/20 rounded-2xl p-6 mt-6">
                  <h3 className="text-[#4f8ff7] text-lg font-semibold mb-4">
                    What You Should Do Next
                  </h3>
                  <ol className="space-y-3">
                    {report.whatYouShouldDo.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#9490b0]">
                        <span className="w-6 h-6 rounded-full bg-[#4f8ff7]/10 border border-[#4f8ff7]/20 flex items-center justify-center text-[#4f8ff7] text-xs font-semibold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              </AnimatedSection>
            )}

            {/* Questions for a Lawyer */}
            {report.questionsForLawyer.length > 0 && (
              <AnimatedSection delay={0.5}>
                <section className="bg-[#15111e]/80 border border-[#a78bfa]/20 rounded-2xl p-6 mt-6">
                  <h3 className="text-[#a78bfa] text-lg font-semibold mb-4">
                    Questions to Ask a Lawyer
                  </h3>
                  <p className="text-[#9490b0] text-xs mb-4">
                    These questions are tailored to your specific situation. Bring
                    this list to your attorney consultation.
                  </p>
                  <ul className="space-y-3">
                    {report.questionsForLawyer.map((q, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#e5e2ff]">
                        <svg className="w-4 h-4 text-[#a78bfa] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="leading-relaxed">{q}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </AnimatedSection>
            )}

            {/* Find an Attorney CTA */}
            <AnimatedSection delay={0.6}>
              <section className="bg-gradient-to-r from-[#4f8ff7]/10 to-[#a78bfa]/10 border border-[#4f8ff7]/20 rounded-2xl p-6 md:p-8 mt-6 text-center">
                <h3 className="text-[#e5e2ff] text-xl font-bold mb-2">
                  Ready to Talk to a Lawyer?
                </h3>
                <p className="text-[#9490b0] text-sm mb-6 max-w-md mx-auto">
                  Upgrade to Attorney Match and we will connect you with a vetted
                  malpractice attorney in your area who can review your case.
                </p>
                <button className="bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white px-8 py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-[#4f8ff7]/20">
                  Find an Attorney -- $249
                </button>
                <p className="text-[#9490b0] text-xs mt-3">
                  Includes full detailed assessment + attorney matching
                </p>
              </section>
            </AnimatedSection>

            {/* Upgrade options */}
            {caseData.tier === "quick" && (
              <AnimatedSection delay={0.7}>
                <section className="bg-[#15111e]/80 border border-[#2a2440] rounded-2xl p-6 mt-6">
                  <h3 className="text-[#e5e2ff] text-lg font-semibold mb-3">
                    Want More Detail?
                  </h3>
                  <p className="text-[#9490b0] text-sm mb-4">
                    Upgrade your report for a deeper analysis with more specific
                    findings and a comprehensive guide for next steps.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-[#15111e] border border-[#4f8ff7]/30 hover:bg-[#4f8ff7]/10 text-[#4f8ff7] px-4 py-2.5 rounded-xl text-sm font-medium transition text-center">
                      Full Assessment -- $100 more
                    </button>
                    <button className="flex-1 bg-[#15111e] border border-[#a78bfa]/30 hover:bg-[#a78bfa]/10 text-[#a78bfa] px-4 py-2.5 rounded-xl text-sm font-medium transition text-center">
                      Attorney Match -- $200 more
                    </button>
                  </div>
                </section>
              </AnimatedSection>
            )}
          </>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-center gap-4 mt-8 pb-12">
          <Link
            href="/patient"
            className="text-[#9490b0] hover:text-[#e5e2ff] transition text-sm"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
