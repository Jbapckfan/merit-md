"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function NewCasePage() {
  const router = useRouter();
  const [caseSummary, setCaseSummary] = useState("");
  const [clientName, setClientName] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!caseSummary.trim()) {
      setError("Please provide a case summary");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.set("caseSummary", caseSummary);
      if (clientName) formData.set("clientName", clientName);
      if (incidentDate) formData.set("incidentDate", incidentDate);

      if (files) {
        let totalSize = 0;
        for (let i = 0; i < files.length; i++) {
          totalSize += files[i].size;
          formData.append("files", files[i]);
        }
        if (totalSize > 50 * 1024 * 1024) {
          setError("Total file size exceeds 50MB limit");
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/cases", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit case");
        return;
      }

      router.push(`/case/${data.caseId}`);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header isLoggedIn />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">New Case Analysis</h1>
          <p className="text-merit-text-muted text-sm mt-1">
            Upload clinical records and provide case details for AI-powered merit review.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-merit-card border border-merit-border rounded-2xl p-8 space-y-6"
        >
          {error && (
            <div className="bg-merit-danger/10 border border-merit-danger/30 text-merit-danger text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-merit-text mb-1.5">
              Client Name
              <span className="text-merit-text-muted ml-1">(optional)</span>
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-merit-bg border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent transition"
              placeholder="Patient or client name"
            />
          </div>

          <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium text-merit-text mb-1.5">
              Date of Incident
            </label>
            <input
              id="incidentDate"
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full bg-merit-bg border border-merit-border rounded-xl px-4 py-2.5 text-merit-text focus:border-merit-accent transition"
            />
          </div>

          <div>
            <label htmlFor="caseSummary" className="block text-sm font-medium text-merit-text mb-1.5">
              Case Summary
            </label>
            <textarea
              id="caseSummary"
              required
              rows={6}
              value={caseSummary}
              onChange={(e) => setCaseSummary(e.target.value)}
              className="w-full bg-merit-bg border border-merit-border rounded-xl px-4 py-2.5 text-merit-text placeholder:text-merit-text-muted/50 focus:border-merit-accent transition resize-y"
              placeholder="Describe the case: what happened, what injuries resulted, and what you believe went wrong clinically. The more detail, the better the analysis."
            />
          </div>

          <div>
            <label htmlFor="files" className="block text-sm font-medium text-merit-text mb-1.5">
              Medical Records
            </label>
            <p className="text-merit-text-muted text-xs mb-3">
              Upload PDFs, images, or text files. Maximum 50MB total. Multiple files accepted.
            </p>
            <input
              id="files"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif,.webp,.txt"
              onChange={(e) => setFiles(e.target.files)}
              className="w-full text-merit-text-muted text-sm"
            />
            {files && files.length > 0 && (
              <div className="mt-3 space-y-1">
                {Array.from(files).map((f, i) => (
                  <div
                    key={i}
                    className="text-sm text-merit-text-muted flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-merit-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span>{f.name}</span>
                    <span className="text-merit-text-muted/50">
                      ({(f.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-merit-accent hover:bg-merit-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-semibold transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Submit for Analysis"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-merit-text-muted hover:text-merit-text transition text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
