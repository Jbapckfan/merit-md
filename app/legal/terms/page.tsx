import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-[#e5e2ff] mb-8">Terms of Service</h1>

        <div className="prose prose-invert space-y-6 text-[#9490b0] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">1. Overview</h2>
            <p>
              MedMal Review provides AI-powered medical chart analysis tools for patients, attorneys,
              and clinicians. By using our services, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">2. Not Medical or Legal Advice</h2>
            <p>
              MedMal Review is a screening and analysis tool. Our reports are not a substitute for
              professional medical judgment or legal counsel. Always consult a qualified physician
              or attorney before making decisions based on our analysis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">3. Data Handling</h2>
            <p>
              All uploaded medical records are processed securely and encrypted at rest (AES-256)
              and in transit (TLS 1.3). Records are analyzed in isolated environments and are not
              stored beyond the session unless you explicitly choose to save your report.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">4. Acceptable Use</h2>
            <p>
              You agree to use MedMal Review only for lawful purposes and in accordance with
              applicable healthcare privacy regulations. You must have proper authorization
              to upload any medical records you submit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">5. Limitation of Liability</h2>
            <p>
              MedMal Review is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable
              for decisions made based on our analysis. Our maximum liability is limited to the
              amount you paid for the specific service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">6. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:contact@medmalreview.com" className="text-[#4f8ff7] hover:underline">
                contact@medmalreview.com
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
