"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import ScoreBadge from "@/components/ScoreBadge";
import AnimatedSection from "@/components/AnimatedSection";

interface CaseItem {
  id: string;
  client_name: string | null;
  case_summary: string;
  incident_date: string | null;
  status: string;
  score: number | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.cases) {
          setCases(data.cases);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <Header isLoggedIn />
      <main className="max-w-7xl mx-auto px-6 py-8 bg-merit-bg min-h-[calc(100vh-4rem)]">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-merit-text">Case Dashboard</h1>
              <p className="text-merit-text-muted text-sm mt-1">
                Manage and review your medical malpractice case analyses.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/new"
                className="bg-merit-accent hover:bg-merit-accent-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-merit-accent/20"
              >
                New Case Analysis
              </Link>
              <button
                onClick={handleLogout}
                className="text-merit-text-muted hover:text-merit-text text-sm transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-merit-text-muted">Loading cases...</div>
          </div>
        ) : cases.length === 0 ? (
          <AnimatedSection delay={0.1}>
            <div className="bg-merit-card/50 backdrop-blur-xl border border-merit-border rounded-2xl p-12 text-center shadow-xl shadow-black/20">
              <div className="w-16 h-16 rounded-2xl bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-merit-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2 text-merit-text">No cases yet</h2>
              <p className="text-merit-text-muted mb-6 max-w-sm mx-auto">
                Upload medical records to get your first AI-powered record review.
              </p>
              <Link
                href="/dashboard/new"
                className="inline-block bg-merit-accent hover:bg-merit-accent-hover text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-merit-accent/20"
              >
                Submit Your First Case
              </Link>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.1}>
            <div className="bg-merit-card/50 backdrop-blur-xl border border-merit-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-merit-border">
                    <th className="text-left text-merit-text-muted text-xs font-medium uppercase tracking-wider px-6 py-3">
                      Date
                    </th>
                    <th className="text-left text-merit-text-muted text-xs font-medium uppercase tracking-wider px-6 py-3">
                      Summary
                    </th>
                    <th className="text-left text-merit-text-muted text-xs font-medium uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                      Client
                    </th>
                    <th className="text-center text-merit-text-muted text-xs font-medium uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-center text-merit-text-muted text-xs font-medium uppercase tracking-wider px-6 py-3">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/case/${c.id}`)}
                      className="border-b border-merit-border last:border-b-0 hover:bg-merit-card-hover/50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4 text-sm text-merit-text-muted whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-merit-text max-w-md truncate">
                        {c.case_summary.slice(0, 100)}
                        {c.case_summary.length > 100 ? "..." : ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-merit-text-muted hidden md:table-cell">
                        {c.client_name || "--"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {c.score !== null ? (
                            <ScoreBadge score={c.score} size="sm" />
                          ) : (
                            <span className="text-merit-text-muted text-sm">--</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        )}
      </main>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: "bg-merit-accent/15 text-merit-accent border-merit-accent/30",
    complete: "bg-merit-success/15 text-merit-success border-merit-success/30",
    error: "bg-merit-danger/15 text-merit-danger border-merit-danger/30",
  };

  return (
    <span
      className={`${styles[status] || styles.processing} text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize`}
    >
      {status}
    </span>
  );
}
