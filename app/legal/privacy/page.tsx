import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-[#e5e2ff] mb-8">Privacy Policy</h1>

        <div className="prose prose-invert space-y-6 text-[#9490b0] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Your Privacy Matters</h2>
            <p>
              MedMal Review is committed to protecting your privacy and the confidentiality
              of your medical information. This policy explains how we collect, use, and
              safeguard your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Data Collection</h2>
            <p>
              We collect only the information necessary to provide our services: medical records
              you upload, account information, and usage analytics. We do not sell your data
              to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Medical Records</h2>
            <p>
              Uploaded medical records are processed by AI in isolated, ephemeral environments.
              Records are encrypted at rest (AES-256) and in transit (TLS 1.3). No human reviews
              your records unless you explicitly opt into physician review services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Data Retention</h2>
            <p>
              Analysis data is purged after your session unless you choose to save a report.
              Saved reports are retained for as long as your account is active. You may request
              deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Third Parties</h2>
            <p>
              We do not share your medical records or personal information with third parties
              without your explicit consent. Our AI models are self-hosted and do not transmit
              your data to external model providers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#e5e2ff] mb-3">Contact</h2>
            <p>
              For privacy inquiries, contact our privacy team at{" "}
              <a href="mailto:privacy@medmalreview.com" className="text-[#4f8ff7] hover:underline">
                privacy@medmalreview.com
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
