"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import ScoreBadge from "@/components/ScoreBadge";
import FindingsTable from "@/components/FindingsTable";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import type { MeritReport } from "@/lib/analysis";

interface CaseData {
  id: string;
  client_name: string | null;
  case_summary: string;
  incident_date: string | null;
  status: string;
  score: number | null;
  report_json: string | null;
  share_token: string | null;
  created_at: string;
}

interface UploadInfo {
  filename: string;
  mime_type: string;
}

export default function CaseReportPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [report, setReport] = useState<MeritReport | null>(null);
  const [uploads, setUploads] = useState<UploadInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `/api/analyze?id=${caseId}`;
    fetch(url)
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load case");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setCaseData(data.caseData);
          setUploads(data.uploads || []);
          if (data.caseData.report_json) {
            try {
              setReport(JSON.parse(data.caseData.report_json));
            } catch {
              setError("Failed to parse report data");
            }
          }
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [caseId, router]);

  const handleShare = () => {
    if (!caseData?.share_token) return;
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/case/${caseData.share_token}?share=1`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <>
        <Header isLoggedIn />
        <main className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="text-merit-text-muted">Loading report...</div>
        </main>
      </>
    );
  }

  if (error || !caseData) {
    return (
      <>
        <Header isLoggedIn />
        <main className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="text-merit-danger">{error || "Case not found"}</div>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-merit-accent hover:text-merit-accent-hover transition text-sm"
          >
            Back to Dashboard
          </button>
        </main>
      </>
    );
  }

  if (caseData.status === "processing") {
    return (
      <>
        <Header isLoggedIn />
        <main className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-8 h-8 text-merit-accent" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Analysis in Progress</h2>
          <p className="text-merit-text-muted">
            Your case is being analyzed. This page will update when the report is ready.
          </p>
        </main>
      </>
    );
  }

  if (caseData.status === "error") {
    return (
      <>
        <Header isLoggedIn />
        <main className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="text-merit-danger mb-4">
            Analysis failed. Please try submitting the case again.
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-merit-accent hover:text-merit-accent-hover transition text-sm"
          >
            Back to Dashboard
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header isLoggedIn />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-merit-text-muted hover:text-merit-text transition text-sm"
                >
                  Dashboard
                </button>
                <span className="text-merit-text-muted/40">/</span>
                <span className="text-merit-text text-sm">Merit Report</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {caseData.client_name
                  ? `${caseData.client_name} — Merit Report`
                  : "Merit Report"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-merit-text-muted">
                <span>Submitted {new Date(caseData.created_at).toLocaleDateString()}</span>
                {caseData.incident_date && (
                  <span>Incident: {new Date(caseData.incident_date).toLocaleDateString()}</span>
                )}
              </div>
              {report?.analysisMode === "demo" && (
                <div className="mt-3 bg-merit-warning/10 border border-merit-warning/30 text-merit-warning text-sm px-4 py-2 rounded-xl">
                  Demo Mode — Claude CLI not available. Install and configure Claude CLI for live AI analysis.
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              {report && <ScoreBadge score={report.score} size="lg" />}
              <span className="text-merit-text-muted text-xs">Negligence Probability</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Case Summary */}
        <AnimatedSection delay={0.1}>
          <section className="bg-merit-card/50 backdrop-blur-xl border border-merit-border rounded-2xl p-6 mb-6 shadow-lg shadow-black/10">
            <h2 className="text-sm font-medium text-merit-text-muted uppercase tracking-wider mb-3">
              Case Summary
            </h2>
            <p className="text-merit-text leading-relaxed">{caseData.case_summary}</p>
            {uploads.length > 0 && (
              <div className="mt-4 pt-4 border-t border-merit-border">
                <span className="text-xs text-merit-text-muted font-medium uppercase tracking-wider">
                  Uploaded Files
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploads.map((u, i) => (
                    <span
                      key={i}
                      className="bg-merit-bg/80 border border-merit-border rounded-lg px-3 py-1 text-xs text-merit-text-muted"
                    >
                      {u.filename}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </AnimatedSection>

        {report && (
          <>
            {/* AI Summary */}
            <AnimatedSection delay={0.15}>
              <section className="bg-merit-card/50 backdrop-blur-xl border border-merit-border rounded-2xl p-6 mb-6 shadow-lg shadow-black/10">
                <h2 className="text-sm font-medium text-merit-text-muted uppercase tracking-wider mb-3">
                  Analysis Summary
                </h2>
                <p className="text-merit-text leading-relaxed">{report.summary}</p>
              </section>
            </AnimatedSection>

            {/* Findings */}
            <AnimatedSection delay={0.2}>
              <section className="mb-6">
                <h2 className="text-sm font-medium text-merit-text-muted uppercase tracking-wider mb-4">
                  Clinical Findings ({report.findings.length})
                </h2>
                <FindingsTable findings={report.findings} />
              </section>
            </AnimatedSection>

            {/* Strengths & Weaknesses */}
            <AnimatedSection delay={0.25}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.section
                  className="bg-merit-card/50 backdrop-blur-xl border border-merit-border rounded-2xl p-6 shadow-lg shadow-black/10"
                  whileHover={{ borderColor: "rgba(34, 197, 94, 0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-sm font-medium text-merit-success uppercase tracking-wider mb-3">
                    Case Strengths
                  </h2>
                  <ul className="space-y-2">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-merit-text-muted">
                        <svg className="w-4 h-4 text-merit-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </motion.section>

                <motion.section
                  className="bg-merit-card/50 backdrop-blur-xl border border-merit-border rounded-2xl p-6 shadow-lg shadow-black/10"
                  whileHover={{ borderColor: "rgba(234, 179, 8, 0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-sm font-medium text-merit-warning uppercase tracking-wider mb-3">
                    Case Weaknesses
                  </h2>
                  <ul className="space-y-2">
                    {report.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-merit-text-muted">
                        <svg className="w-4 h-4 text-merit-warning mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {w}
                      </li>
                    ))}
                  </ul>
                </motion.section>
              </div>
            </AnimatedSection>

            {/* Recommendations */}
            <AnimatedSection delay={0.3}>
              <section className="bg-merit-card/50 backdrop-blur-xl border border-merit-border rounded-2xl p-6 mb-8 shadow-lg shadow-black/10">
                <h2 className="text-sm font-medium text-merit-accent uppercase tracking-wider mb-3">
                  Recommended Next Steps
                </h2>
                <ol className="space-y-3">
                  {report.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-merit-text-muted">
                      <span className="w-5 h-5 rounded-full bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center text-merit-accent text-xs font-medium flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {r}
                    </li>
                  ))}
                </ol>
              </section>
            </AnimatedSection>

            {/* Case Q&A CTA */}
            <AnimatedSection delay={0.35}>
              <section className="bg-merit-card/50 backdrop-blur-xl border border-merit-accent/30 rounded-2xl p-6 mb-8 shadow-lg shadow-black/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-merit-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1">Ask Questions About This Case</h2>
                    <p className="text-merit-text-muted text-sm mb-4">
                      Dive deeper with an AI medical-legal consultant. Ask about expert witnesses,
                      deposition strategy, defense arguments, additional records to request, and more.
                    </p>
                    <button
                      onClick={() => router.push(`/case/${caseId}/chat`)}
                      className="bg-merit-accent hover:bg-merit-accent-hover text-white px-6 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-merit-accent/20 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      Start Case Q&A
                    </button>
                  </div>
                </div>
              </section>
            </AnimatedSection>

            {/* Actions */}
            <AnimatedSection delay={0.4}>
              <div className="flex items-center gap-4 pb-12">
                <button
                  onClick={handleShare}
                  className="bg-merit-card/50 backdrop-blur-xl border border-merit-border hover:border-merit-border-hover text-merit-text px-6 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  {copied ? "Link Copied!" : "Share with Colleague"}
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-merit-text-muted hover:text-merit-text transition text-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            </AnimatedSection>
          </>
        )}
      </main>
    </>
  );
}
