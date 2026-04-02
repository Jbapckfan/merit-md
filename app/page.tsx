import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          {/* Background gradient effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-merit-accent/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-merit-accent/3 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-36">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="text-merit-accent text-sm font-medium tracking-wider uppercase bg-merit-accent/10 border border-merit-accent/20 px-4 py-1.5 rounded-full">
                  AI-Powered Clinical Analysis
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                Stop Wasting{" "}
                <span className="text-merit-accent">$500/hr</span> on Cases
                That Go Nowhere
              </h1>

              <p className="text-merit-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                Merit-MD gives your firm an instant, ER-grade clinical merit
                review — before you spend a dime on expert witnesses.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto bg-merit-accent hover:bg-merit-accent-hover text-white px-8 py-3.5 rounded-xl text-base font-semibold transition shadow-lg shadow-merit-accent/20 hover:shadow-merit-accent/30"
                >
                  Start Your First Scan
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto text-merit-text-muted hover:text-merit-text border border-merit-border hover:border-merit-border-hover px-8 py-3.5 rounded-xl text-base font-medium transition text-center"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust bar */}
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-merit-text-muted text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-merit-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-merit-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Built by ER Physicians</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-merit-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Results in Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="py-20 md:py-28 border-t border-merit-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Three Steps to a Merit Decision
              </h2>
              <p className="text-merit-text-muted text-lg max-w-xl mx-auto">
                From upload to actionable intelligence in minutes, not weeks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-merit-card border border-merit-border rounded-2xl p-8 hover:border-merit-border-hover transition group">
                <div className="w-12 h-12 rounded-xl bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center text-merit-accent font-bold text-lg mb-6 group-hover:bg-merit-accent/15 transition">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload the Records</h3>
                <p className="text-merit-text-muted leading-relaxed">
                  Upload medical records as PDF, images, or text. Our secure
                  platform accepts clinical charts, lab results, nursing notes,
                  and discharge summaries.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-merit-card border border-merit-border rounded-2xl p-8 hover:border-merit-border-hover transition group">
                <div className="w-12 h-12 rounded-xl bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center text-merit-accent font-bold text-lg mb-6 group-hover:bg-merit-accent/15 transition">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Clinical Analysis</h3>
                <p className="text-merit-text-muted leading-relaxed">
                  Our AI performs a thorough clinical review — checking for
                  standard-of-care deviations, missing documentation, protocol
                  violations, and red flags.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-merit-card border border-merit-border rounded-2xl p-8 hover:border-merit-border-hover transition group">
                <div className="w-12 h-12 rounded-xl bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center text-merit-accent font-bold text-lg mb-6 group-hover:bg-merit-accent/15 transition">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Your Merit Report</h3>
                <p className="text-merit-text-muted leading-relaxed">
                  Receive a structured report with a negligence probability
                  score, key findings, evidence citations, and recommended next
                  steps for your case.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── What We Catch ── */}
        <section className="py-20 md:py-28 border-t border-merit-border bg-merit-card/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What We Catch That Others Miss
              </h2>
              <p className="text-merit-text-muted text-lg max-w-xl mx-auto">
                Our AI is trained on emergency medicine protocols, not generic medical knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                "Missing serial troponins in chest pain workups",
                "Inadequate sepsis screening documentation",
                "EMTALA transfer violations",
                "Delayed stroke protocol activation",
                "Under-documented critical care decision-making",
                "Weak return precautions",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-merit-card border border-merit-border rounded-xl p-4 hover:border-merit-border-hover transition"
                >
                  <svg
                    className="w-5 h-5 text-merit-danger mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-merit-text text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-20 md:py-28 border-t border-merit-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-merit-text-muted text-lg max-w-xl mx-auto">
                One bad case can cost your firm more than a year of Merit-MD.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Single Scan */}
              <div className="bg-merit-card border border-merit-border rounded-2xl p-8 hover:border-merit-border-hover transition">
                <h3 className="text-merit-text-muted text-sm font-medium uppercase tracking-wider mb-2">
                  Single Scan
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-merit-text">$499</span>
                  <span className="text-merit-text-muted ml-1">/case</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Full clinical merit analysis",
                    "Structured findings report",
                    "Negligence probability score",
                    "Shareable report link",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-merit-text-muted">
                      <svg className="w-4 h-4 text-merit-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block text-center text-merit-accent border border-merit-accent/30 hover:bg-merit-accent/10 px-6 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  Get Started
                </Link>
              </div>

              {/* Monthly */}
              <div className="bg-merit-card border-2 border-merit-accent rounded-2xl p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-merit-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-merit-text-muted text-sm font-medium uppercase tracking-wider mb-2">
                  Monthly
                </h3>
                <div className="mb-1">
                  <span className="text-4xl font-bold text-merit-text">$2,499</span>
                  <span className="text-merit-text-muted ml-1">/mo</span>
                </div>
                <p className="text-merit-text-muted text-xs mb-6">10 scans included</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Single Scan",
                    "10 case analyses per month",
                    "Priority processing",
                    "Case comparison tools",
                    "Team access (up to 5 users)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-merit-text-muted">
                      <svg className="w-4 h-4 text-merit-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block text-center bg-merit-accent hover:bg-merit-accent-hover text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-merit-accent/20"
                >
                  Start Free Trial
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-merit-card border border-merit-border rounded-2xl p-8 hover:border-merit-border-hover transition">
                <h3 className="text-merit-text-muted text-sm font-medium uppercase tracking-wider mb-2">
                  Enterprise
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-merit-text">Custom</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited case analyses",
                    "Custom AI model tuning",
                    "API access for case management",
                    "Dedicated account manager",
                    "SLA guarantees",
                    "Custom integrations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-merit-text-muted">
                      <svg className="w-4 h-4 text-merit-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:contact@merit-md.com"
                  className="block text-center text-merit-accent border border-merit-accent/30 hover:bg-merit-accent/10 px-6 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  Contact Sales
                </a>
              </div>

              {/* Physician Review */}
              <div className="bg-gradient-to-b from-merit-card to-merit-bg border border-amber-500/30 rounded-2xl p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                    Expert Review
                  </span>
                </div>
                <h3 className="text-merit-text-muted text-sm font-medium uppercase tracking-wider mb-2">
                  Physician Review
                </h3>
                <div className="mb-1">
                  <span className="text-4xl font-bold text-merit-text">$1,499</span>
                  <span className="text-merit-text-muted text-sm ml-1">per case</span>
                </div>
                <p className="text-merit-text-muted text-xs mb-6">AI analysis + board-certified ER physician review</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Full AI merit analysis",
                    "Board-certified ER physician review",
                    "Signed physician attestation letter",
                    "Phone consultation (30 min)",
                    "Expert witness referral if case proceeds",
                    "Priority 24-hour turnaround",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-merit-text-muted">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block text-center bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  Request Physician Review
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Section ── */}
        <section className="py-20 md:py-28 border-t border-merit-border bg-merit-card/30">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Firms Trust Merit-MD
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Built by an ER Physician",
                  desc: "With 20+ years of clinical experience in emergency medicine, our founding physician has reviewed thousands of cases and knows exactly what constitutes a deviation from standard of care.",
                },
                {
                  title: "Specialized AI, Not Generic",
                  desc: "Powered by AI trained on emergency medicine protocols, not generic medical knowledge. We understand the nuances of sepsis bundles, stroke protocols, and EMTALA requirements.",
                },
                {
                  title: "HIPAA-Compliant from Day One",
                  desc: "Your records never leave our secure servers. All data is encrypted at rest and in transit. We maintain full audit trails and BAA agreements for covered entities.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-merit-card border border-merit-border rounded-2xl p-8 hover:border-merit-border-hover transition"
                >
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-merit-text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 md:py-28 border-t border-merit-border">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Guessing. Start Knowing.
            </h2>
            <p className="text-merit-text-muted text-lg mb-8 max-w-xl mx-auto">
              Every week you spend on a meritless case is a week you could have
              spent winning a strong one. Let Merit-MD tell you the difference.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-merit-accent hover:bg-merit-accent-hover text-white px-10 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-merit-accent/20 hover:shadow-merit-accent/30"
            >
              Get Your First Merit Report
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
