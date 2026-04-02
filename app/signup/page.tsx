"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

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
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-merit-text-muted">
              Start analyzing cases with AI-powered clinical review.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-merit-card border border-merit-border rounded-2xl p-8 space-y-5"
          >
            {error && (
              <div className="bg-merit-danger/10 border border-merit-danger/30 text-merit-danger text-sm p-3 rounded-xl">
                {error}
              </div>
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
                className="w-full bg-merit-bg border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent transition"
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
                className="w-full bg-merit-bg border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent transition"
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
                className="w-full bg-merit-bg border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent transition"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-merit-accent hover:bg-merit-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold transition"
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
            Policy. All data is handled in accordance with HIPAA requirements.
          </p>
        </div>
      </main>
    </>
  );
}
