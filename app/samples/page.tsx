import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

/* ─────────────────────────── sample data ─────────────────────────── */

const samples = [
  {
    title: "ED Chest Pain — Missed STEMI",
    filename: "sample-report-ed-chest-pain.pdf",
    description:
      "52-year-old male with substernal pressure, 4+ cardiac risk factors. Single troponin drawn (borderline), no serial troponins despite 4-hour stay. Discharged with MSK diagnosis. Returned 14 hours later with STEMI and permanent cardiac damage.",
    score: "8/10",
    issueCount: 10,
    topIssues: [
      "Failure to obtain serial troponins",
      "No HEART score or risk stratification",
      "Premature diagnostic closure / anchoring bias",
    ],
  },
  {
    title: "Sepsis — Delayed Antibiotic Administration",
    filename: "sample-report-sepsis-delayed-abx.pdf",
    description:
      "Elderly female from assisted living with textbook sepsis presentation — fever, hypotension, tachycardia, altered mental status. 3.5-hour door-to-antibiotic delay. Progressed to septic shock, ARDS, 12 ICU days, 6 days on ventilator.",
    score: "7/10",
    issueCount: 7,
    topIssues: [
      "3.5-hour delay to antibiotics (SSC: 1 hour)",
      "Failure to escalate despite worsening vitals",
      "Inadequate fluid resuscitation volume",
    ],
  },
  {
    title: "Missed Cauda Equina Syndrome",
    filename: "sample-report-cauda-equina.pdf",
    description:
      "45-year-old male with bilateral neurological deficits — bilateral positive SLR, bilateral motor weakness, bilateral sensory loss. Physician documented findings then wrote 'no red flags.' No imaging ordered. Returned 36 hours later with complete CES and permanent bowel/bladder dysfunction.",
    score: "8/10",
    issueCount: 7,
    topIssues: [
      "Bilateral red flags documented but dismissed",
      "No emergent imaging obtained",
      "Failure to perform rectal exam / saddle assessment",
    ],
  },
];

/* ─────────────────────────── page ─────────────────────────── */

export default function SamplesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-merit-bg">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
          {/* Page header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-merit-text mb-4">
              Sample Reports
            </h1>
            <p className="text-merit-text-muted text-lg max-w-3xl leading-relaxed">
              Download de-identified sample reports to see exactly what a MedMal Review Pro
              analysis delivers. Each report includes issue identification, severity scoring,
              defense considerations, expert witness recommendations, and suggested deposition questions.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#1c1729] border border-merit-border rounded-xl px-6 py-4 mb-10">
            <p className="text-merit-text-muted text-sm leading-relaxed">
              <span className="text-merit-text font-semibold">Note:</span>{" "}
              These reports are generated from fictional, de-identified chart data created
              for demonstration purposes. No real patient information is included. All cases
              are composites designed to illustrate common emergency medicine malpractice patterns.
            </p>
          </div>

          {/* Sample cards */}
          <div className="space-y-6">
            {samples.map((sample) => (
              <div
                key={sample.filename}
                className="bg-merit-card border border-merit-border rounded-xl p-6 md:p-8
                           hover:border-merit-border-hover transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-xl font-bold text-merit-text">
                        {sample.title}
                      </h2>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold
                          ${
                            parseInt(sample.score) >= 8
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : parseInt(sample.score) >= 6
                              ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                              : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                          }`}
                      >
                        {sample.score}
                      </span>
                    </div>

                    <p className="text-merit-text-muted text-sm leading-relaxed mb-4">
                      {sample.description}
                    </p>

                    {/* Top issues */}
                    <div className="mb-4">
                      <p className="text-merit-text text-xs font-semibold uppercase tracking-wider mb-2">
                        Key Issues ({sample.issueCount} total)
                      </p>
                      <ul className="space-y-1">
                        {sample.topIssues.map((issue) => (
                          <li
                            key={issue}
                            className="text-merit-text-muted text-sm flex items-start gap-2"
                          >
                            <svg
                              className="w-4 h-4 text-merit-danger mt-0.5 shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                              />
                            </svg>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right: download */}
                  <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <a
                      href={`/samples/${sample.filename}`}
                      download
                      className="inline-flex items-center gap-2 bg-merit-accent hover:bg-merit-accent-hover
                                 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      Download PDF
                    </a>
                    <span className="text-merit-text-muted text-xs">
                      PDF &middot; {sample.issueCount} issues identified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-merit-text-muted text-sm mb-4">
              Ready to analyze your own case?
            </p>
            <Link
              href="/attorney"
              className="inline-flex items-center gap-2 bg-merit-accent hover:bg-merit-accent-hover
                         text-white px-6 py-3 rounded-xl text-sm font-semibold transition
                         shadow-lg shadow-merit-accent/20 hover:shadow-merit-accent/40"
            >
              Start Analysis
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
