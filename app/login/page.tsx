"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-merit-text mb-2">Welcome Back</h1>
            <p className="text-merit-text-muted">
              Log in to access your case dashboard.
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-merit-bg/80 border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent focus:ring-1 focus:ring-merit-accent/30 transition"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-merit-accent hover:bg-merit-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold transition shadow-lg shadow-merit-accent/20"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-merit-text-muted text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-merit-accent hover:text-merit-accent-hover transition">
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>
      </main>
    </>
  );
}
