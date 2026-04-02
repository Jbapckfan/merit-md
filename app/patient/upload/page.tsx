"use client";

import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const outcomeOptions = [
  { value: "", label: "Select what happened..." },
  { value: "ongoing_issues", label: "I have ongoing health issues" },
  { value: "permanent_injury", label: "I suffered a permanent injury" },
  { value: "loved_one_died", label: "A loved one passed away" },
  { value: "unexpected_surgery", label: "I needed unexpected surgery" },
  { value: "wrong_medication", label: "I was given the wrong medication" },
  { value: "misdiagnosis", label: "I was misdiagnosed" },
  { value: "delayed_treatment", label: "My treatment was delayed" },
  { value: "other", label: "Other" },
];

export default function PatientUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [facility, setFacility] = useState("");
  const [outcomeType, setOutcomeType] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Please describe what happened to you.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address so we can send your report.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("email", email);
      if (incidentDate) formData.append("incidentDate", incidentDate);
      if (facility) formData.append("facility", facility);
      if (outcomeType) formData.append("outcomeType", outcomeType);
      formData.append("tier", "quick");

      for (const file of files) {
        formData.append("files", file);
      }

      const res = await fetch("/api/patient", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push(`/patient/report/${data.caseId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(circle, #4f8ff7 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Tell Us What Happened
              </h1>
              <p className="text-[#9490b0] text-lg max-w-lg mx-auto">
                The more detail you provide, the better we can help. Everything
                you share is private and encrypted.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                  What happened to you? <span className="text-[#ef4444]">*</span>
                </label>
                <p className="text-[#9490b0] text-xs mb-2">
                  Describe your experience in your own words. What brought you to
                  the hospital? What happened during your visit? What went wrong?
                </p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm placeholder-[#9490b0]/50 focus:border-[#4f8ff7] transition resize-none"
                  placeholder="I went to the ER with severe chest pain. The doctor only ran one blood test and sent me home after 2 hours. The next day I had a heart attack..."
                />
              </div>

              {/* When */}
              <div>
                <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                  When did this happen?
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm focus:border-[#4f8ff7] transition"
                />
              </div>

              {/* Where */}
              <div>
                <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                  Where were you treated?
                </label>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm placeholder-[#9490b0]/50 focus:border-[#4f8ff7] transition"
                  placeholder="Hospital or clinic name"
                />
              </div>

              {/* Outcome */}
              <div>
                <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                  What was the outcome?
                </label>
                <select
                  value={outcomeType}
                  onChange={(e) => setOutcomeType(e.target.value)}
                  className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm focus:border-[#4f8ff7] transition appearance-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239490b0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "20px",
                  }}
                >
                  {outcomeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                  Upload your records
                </label>
                <p className="text-[#9490b0] text-xs mb-3">
                  Discharge papers, doctor's notes, test results, or even photos
                  of paperwork. PDF, images, or text files accepted.
                </p>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    dragActive
                      ? "border-[#4f8ff7] bg-[#4f8ff7]/5"
                      : "border-[#2a2440] hover:border-[#3d3660] bg-[#15111e]/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.tiff,.webp,.txt"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                  <svg
                    className="w-10 h-10 text-[#9490b0] mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p className="text-[#9490b0] text-sm mb-1">
                    Drag files here or click to browse
                  </p>
                  <p className="text-[#9490b0]/60 text-xs">
                    PDF, JPG, PNG, TIFF, TXT (max 50MB total)
                  </p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-[#15111e] border border-[#2a2440] rounded-lg px-4 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <svg
                            className="w-4 h-4 text-[#4f8ff7] flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-[#e5e2ff] text-sm truncate">
                            {file.name}
                          </span>
                          <span className="text-[#9490b0] text-xs flex-shrink-0">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-[#9490b0] hover:text-[#ef4444] transition ml-2 flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <p className="text-[#9490b0] text-xs">
                      {files.length} file{files.length !== 1 ? "s" : ""} ({totalSizeMB} MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#e5e2ff] text-sm font-medium mb-2">
                  Your email address <span className="text-[#ef4444]">*</span>
                </label>
                <p className="text-[#9490b0] text-xs mb-2">
                  We will send your report here. We will never spam you.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#15111e] border border-[#2a2440] rounded-xl px-4 py-3 text-[#e5e2ff] text-sm placeholder-[#9490b0]/50 focus:border-[#4f8ff7] transition"
                  placeholder="your@email.com"
                />
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="relative w-full group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 rounded-xl bg-[#4f8ff7] blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                  <span className="relative block bg-[#4f8ff7] hover:bg-[#6ba1ff] text-white px-8 py-4 rounded-xl text-base font-semibold transition shadow-lg shadow-[#4f8ff7]/20 text-center">
                    {submitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Analyzing Your Records...
                      </span>
                    ) : (
                      "Pay $49 & Check My Case"
                    )}
                  </span>
                </button>
                <p className="text-center text-[#9490b0] text-xs mt-3">
                  Your information is encrypted and private. No human sees your
                  records unless you choose physician review.
                </p>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </main>
    </>
  );
}
