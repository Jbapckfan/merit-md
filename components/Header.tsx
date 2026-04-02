"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const isGateway = pathname === "/";
  const isAttorneySection = pathname?.startsWith("/attorney");
  const isPatientSection = pathname?.startsWith("/patient");
  const isClinicianSection = pathname?.startsWith("/clinician");
  const isChartReviewSection = pathname?.startsWith("/chartreview");

  // Determine brand name based on section
  let brandName = "MedMal Review";
  let brandHref = "/";
  let brandIcon = "M";
  let brandBg = "bg-merit-accent";
  if (isAttorneySection) {
    brandName = "MedMal Review Pro";
    brandHref = "/attorney";
  } else if (isPatientSection) {
    brandName = "MedMal Review Buddy";
    brandHref = "/patient";
  } else if (isClinicianSection) {
    brandName = "MedMal Review Pro";
    brandHref = "/clinician";
  } else if (isChartReviewSection) {
    brandName = "ChartReview Pro";
    brandHref = "/chartreview";
    brandIcon = "CR";
    brandBg = "bg-[#22c55e]";
  }

  // Determine which anchor links to show (section-specific pages)
  const showSectionAnchors = isAttorneySection || isPatientSection || isChartReviewSection;
  const anchorPrefix = isAttorneySection ? "/attorney" : isPatientSection ? "/patient" : isChartReviewSection ? "/chartreview" : "";

  return (
    <header className="border-b border-merit-border bg-merit-bg/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={brandHref} className="flex items-center gap-2.5 group">
          <div className={`w-8 h-8 rounded-lg ${brandBg} flex items-center justify-center text-white font-bold text-sm`}>
            {brandIcon}
          </div>
          <span className="text-merit-text font-semibold text-lg tracking-tight">
            {brandName}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Section-specific anchor links */}
          {showSectionAnchors && (
            <>
              <a
                href={`${anchorPrefix}#how-it-works`}
                className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
              >
                How It Works
              </a>
              <a
                href={`${anchorPrefix}#pricing`}
                className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
              >
                Pricing
              </a>
            </>
          )}

          {/* Gateway: show all three paths */}
          {isGateway && (
            <>
              <Link
                href="/patient"
                className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
              >
                For Patients
              </Link>
              <Link
                href="/attorney"
                className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
              >
                For Attorneys
              </Link>
              <Link
                href="/clinician"
                className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
              >
                For Clinicians
              </Link>
              <Link
                href="/chartreview"
                className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
              >
                ChartReview Pro
              </Link>
            </>
          )}

          {/* Cross-links on non-gateway pages */}
          {!isGateway && (
            <>
              {!isClinicianSection && (
                <Link
                  href="/clinician"
                  className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
                >
                  For Clinicians
                </Link>
              )}
              {!isAttorneySection && (
                <Link
                  href="/attorney"
                  className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
                >
                  For Attorneys
                </Link>
              )}
              {!isPatientSection && (
                <Link
                  href="/patient"
                  className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
                >
                  For Patients
                </Link>
              )}
              {!isChartReviewSection && (
                <Link
                  href="/chartreview"
                  className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
                >
                  ChartReview Pro
                </Link>
              )}
            </>
          )}

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-merit-text-muted hover:text-merit-text transition text-sm"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/new"
                className="bg-merit-accent hover:bg-merit-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                New Case
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-merit-text-muted hover:text-merit-text transition text-sm"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-merit-accent hover:bg-merit-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
