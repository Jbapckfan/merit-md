"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firmName, setFirmName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", email, password, firmName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-merit-bg">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-merit-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-merit-text mb-2">Create Your Account</h1>
            <p className="text-merit-text-muted">
              Start analyzing cases with AI-powered clinical review.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-merit-card/50 backdrop-blur-xl border border-merit-border rounded-2xl p-8 space-y-5 shadow-xl shadow-black/20"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-merit-danger/10 border border-merit-danger/30 text-merit-danger text-sm p-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="firmName" className="block text-sm font-medium text-merit-text mb-1.5">
                Firm Name
                <span className="text-merit-text-muted ml-1">(optional)</span>
              </label>
              <input
                id="firmName"
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full bg-merit-bg/80 border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent focus:ring-1 focus:ring-merit-accent/30 transition"
                placeholder="Smith & Associates, LLP"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-merit-text mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-merit-bg/80 border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent focus:ring-1 focus:ring-merit-accent/30 transition"
                placeholder="you@yourfirm.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-merit-text mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-merit-bg/80 border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent focus:ring-1 focus:ring-merit-accent/30 transition"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-merit-accent hover:bg-merit-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold transition shadow-lg shadow-merit-accent/20"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-merit-text-muted text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-merit-accent hover:text-merit-accent-hover transition">
                Log in
              </Link>
            </p>
          </form>

          <p className="text-center text-merit-text-muted/60 text-xs mt-6 max-w-sm mx-auto">
            By creating an account, you agree to our Terms of Service and Privacy
            Policy. Your data is processed securely and never stored, shared, or sold.
          </p>
        </motion.div>
      </main>
    </>
  );
}
