import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-[#e5e2ff] mb-8">Security &amp; Data Protection</h1>

        <div className="prose prose-invert space-y-6 text-[#9490b0] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Data Protection</h2>
            <p>
              We implement security controls aligned with healthcare data protection standards.
              We do not store, share, or sell your information. Administrative, physical, and
              technical safeguards are in place to protect the confidentiality, integrity, and
              availability of any data you provide.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Encryption</h2>
            <p>
              All data is encrypted at rest using AES-256 and in transit using TLS 1.3.
              Medical records are processed in isolated, ephemeral compute environments
              that are destroyed after each analysis session.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Agreements</h2>
            <p>
              For enterprise and institutional clients, we can execute data processing agreements
              tailored to your organization&apos;s requirements. Contact us to discuss your needs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Access Controls</h2>
            <p>
              Access to patient data is restricted on a need-to-know basis. All access is
              logged and auditable. Multi-factor authentication is enforced for all
              administrative access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Incident Response</h2>
            <p>
              We maintain a documented incident response plan. In the unlikely event of a
              data breach, affected parties will be notified within the timeframes required
              by applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Contact</h2>
            <p>
              For security inquiries or to report a vulnerability, contact{" "}
              <a href="mailto:security@medmalreview.com" className="text-[#4f8ff7] hover:underline">
                security@medmalreview.com
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
