import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-merit-border bg-merit-bg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-merit-accent flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="text-merit-text font-semibold text-lg">MedMal Review Pro</span>
            </div>
            <p className="text-merit-text-muted text-sm max-w-md leading-relaxed">
              AI-powered clinical merit review for medical malpractice cases.
              Built by physicians, for attorneys. MedMal Review Buddy is our consumer service.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-merit-text font-medium text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-merit-text-muted hover:text-merit-text text-sm transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-merit-text-muted hover:text-merit-text text-sm transition">
                  Pricing
                </a>
              </li>
              <li>
                <Link href="/signup" className="text-merit-text-muted hover:text-merit-text text-sm transition">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/patient" className="text-merit-text-muted hover:text-merit-text text-sm transition">
                  For Patients
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-merit-text font-medium text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-merit-text-muted text-sm cursor-default">Terms of Service</span>
              </li>
              <li>
                <span className="text-merit-text-muted text-sm cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-merit-text-muted text-sm cursor-default">HIPAA Compliance</span>
              </li>
              <li>
                <a href="mailto:contact@medmalreview.com" className="text-merit-text-muted hover:text-merit-text text-sm transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-merit-border mt-10 pt-6 text-center">
          <p className="text-merit-text-muted text-xs">
            &copy; 2026 MedMal Review Pro. Built by physicians, for attorneys.
          </p>
        </div>
      </div>
    </footer>
  );
}
