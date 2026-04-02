"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header className="border-b border-merit-border bg-merit-bg/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-merit-accent flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="text-merit-text font-semibold text-lg tracking-tight">
            Merit-MD
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isLanding && (
            <>
              <a
                href="#how-it-works"
                className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-merit-text-muted hover:text-merit-text transition text-sm hidden sm:block"
              >
                Pricing
              </a>
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
