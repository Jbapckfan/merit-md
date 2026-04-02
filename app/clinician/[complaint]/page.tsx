"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  getClinicianOutput,
  getComplaintList,
  type ClinicianOutput,
} from "@/lib/clinician-mapper";

// ── Card Component ──

function ClinicianCard({
  title,
  items,
  icon,
  accentColor,
  defaultOpen,
}: {
  title: string;
  items: string[];
  icon: string;
  accentColor: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <motion.div
      layout
      className={`rounded-2xl border bg-merit-card overflow-hidden ${accentColor}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 active:bg-merit-card-hover transition-colors touch-manipulation"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-hidden>
            {icon}
          </span>
          <span className="font-semibold text-merit-text text-left text-base">
            {title}
          </span>
          <span className="text-merit-text-muted text-xs bg-merit-bg px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-merit-text-muted text-lg"
        >
          &#x25BC;
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="px-5 pb-4 space-y-2.5">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm text-merit-text/90 leading-relaxed"
                >
                  <span className="text-merit-text-muted mt-0.5 shrink-0">
                    &bull;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Risk Badge ──

function RiskBadge({ level, reason }: { level: string; reason: string }) {
  const colorMap: Record<string, { bg: string; text: string; ring: string; label: string }> = {
    high: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      ring: "ring-red-500/30",
      label: "HIGH RISK",
    },
    medium: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      ring: "ring-yellow-500/30",
      label: "MEDIUM RISK",
    },
    low: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      ring: "ring-green-500/30",
      label: "LOW RISK",
    },
  };

  const c = colorMap[level] ?? colorMap.medium;

  return (
    <motion.div
      className={`rounded-2xl border border-merit-border ${c.bg} px-5 py-4`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" role="img" aria-hidden>
          &#x26A0;&#xFE0F;
        </span>
        <span className="font-semibold text-merit-text text-base">
          Litigation Risk
        </span>
        <span
          className={`${c.bg} ${c.text} ring-1 ${c.ring} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}
        >
          {c.label}
        </span>
      </div>
      <p className="text-sm text-merit-text/80 leading-relaxed pl-9">
        {reason}
      </p>
    </motion.div>
  );
}

// ── Not Found State ──

function ComplaintNotFound({ slug }: { slug: string }) {
  const complaints = getComplaintList();
  return (
    <div className="min-h-screen bg-merit-bg">
      <header className="sticky top-0 z-50 bg-merit-bg/90 backdrop-blur-md border-b border-merit-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/clinician"
            className="shrink-0 w-8 h-8 rounded-lg bg-merit-accent flex items-center justify-center text-white font-bold text-sm"
          >
            M
          </Link>
          <span className="text-merit-text font-medium">Clinician Tool</span>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 pt-16 text-center">
        <div className="text-5xl mb-6 opacity-30">&#x2753;</div>
        <h1 className="text-xl font-semibold text-merit-text mb-2">
          Complaint Not Found
        </h1>
        <p className="text-merit-text-muted text-sm mb-8">
          &ldquo;{slug.replace(/-/g, " ")}&rdquo; is not in the knowledge base yet.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {complaints.map((c) => (
            <Link
              key={c.slug}
              href={`/clinician/${c.slug}`}
              className="bg-merit-card border border-merit-border rounded-xl px-3 py-3 text-sm text-merit-text hover:bg-merit-card-hover active:bg-merit-border transition-colors touch-manipulation text-center"
            >
              {c.label}
            </Link>
          ))}
        </div>
        <Link
          href="/clinician"
          className="text-merit-accent text-sm font-medium"
        >
          Back to search
        </Link>
      </main>
    </div>
  );
}

// ── Page ──

export default function ComplaintPage() {
  const params = useParams();
  const slug = typeof params.complaint === "string"
    ? params.complaint
    : Array.isArray(params.complaint)
      ? params.complaint[0]
      : "";

  const [output, setOutput] = useState<ClinicianOutput | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const data = getClinicianOutput(slug);
    if (data) {
      setOutput(data);
    } else {
      setNotFound(true);
    }
  }, [slug]);

  if (notFound) {
    return <ComplaintNotFound slug={slug} />;
  }

  if (!output) {
    return (
      <div className="min-h-screen bg-merit-bg flex items-center justify-center">
        <div className="text-merit-text-muted text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-merit-bg">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-merit-bg/90 backdrop-blur-md border-b border-merit-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/clinician"
            className="shrink-0 w-8 h-8 rounded-lg bg-merit-accent flex items-center justify-center text-white font-bold text-sm"
          >
            M
          </Link>
          <div className="flex-1 flex items-center justify-between">
            <span className="text-merit-text font-medium text-base">
              {output.complaintLabel}
            </span>
            <Link
              href="/clinician"
              className="text-merit-accent text-sm font-medium touch-manipulation px-2 py-1"
            >
              Change
            </Link>
          </div>
        </div>
      </header>

      {/* ── Cards ── */}
      <main className="max-w-lg mx-auto px-4 pb-20 pt-4 space-y-3">
        <ClinicianCard
          title="Must-Document"
          items={output.mustDocument.items}
          icon="&#x1F4CB;"
          accentColor="border-merit-accent/30"
          defaultOpen={true}
        />

        <ClinicianCard
          title="Red Flags"
          items={output.redFlags.items}
          icon="&#x1F6A9;"
          accentColor="border-red-500/30"
        />

        <ClinicianCard
          title="Dispo Traps"
          items={output.dispoTraps.items}
          icon="&#x26D4;"
          accentColor="border-yellow-500/30"
        />

        <ClinicianCard
          title="Return Precautions"
          items={output.returnPrecautions.items}
          icon="&#x21A9;&#xFE0F;"
          accentColor="border-green-500/30"
        />

        <RiskBadge
          level={output.riskScore.level}
          reason={output.riskScore.reason}
        />

        <p className="text-center text-merit-text-muted text-xs pt-4 pb-2">
          Data sourced from Merit-MD clinical knowledge base.
          <br />
          Not a substitute for clinical judgment.
        </p>
      </main>
    </div>
  );
}
