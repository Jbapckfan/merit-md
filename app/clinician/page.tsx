"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  getComplaintList,
  getClinicianOutput,
  searchComplaints,
  type ClinicianOutput,
} from "@/lib/clinician-mapper";

// ── Data ──

const ALL_COMPLAINTS = getComplaintList();

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

  // Limit displayed items for quick scan — show first 6, expandable to all
  const displayItems = open ? items : items.slice(0, 5);
  const hasMore = items.length > 5;

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
              {displayItems.map((item, i) => (
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
              {hasMore && !open && (
                <li className="text-merit-accent text-sm font-medium">
                  + {items.length - 5} more...
                </li>
              )}
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

// ── Main Page ──

export default function ClinicianPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [output, setOutput] = useState<ClinicianOutput | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => searchComplaints(query), [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectComplaint(slug: string, label: string) {
    setQuery(label);
    setSelectedComplaint(slug);
    setShowDropdown(false);
    const data = getClinicianOutput(slug);
    setOutput(data);
    // Update URL without full navigation for sharability
    window.history.replaceState(null, "", `/clinician/${slug}`);
  }

  function clearSelection() {
    setQuery("");
    setSelectedComplaint(null);
    setOutput(null);
    window.history.replaceState(null, "", "/clinician");
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-merit-bg">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-merit-bg/90 backdrop-blur-md border-b border-merit-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="shrink-0 w-8 h-8 rounded-lg bg-merit-accent flex items-center justify-center text-white font-bold text-sm"
          >
            M
          </Link>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
                if (selectedComplaint) {
                  setSelectedComplaint(null);
                  setOutput(null);
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Chief complaint..."
              className="w-full bg-merit-card border border-merit-border rounded-xl px-4 py-3 text-merit-text placeholder:text-merit-text-muted text-base focus:border-merit-accent focus:ring-1 focus:ring-merit-accent/30 transition touch-manipulation"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {selectedComplaint && (
              <button
                type="button"
                onClick={clearSelection}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-merit-text-muted hover:text-merit-text text-xl leading-none touch-manipulation p-1"
                aria-label="Clear selection"
              >
                &times;
              </button>
            )}

            {/* ── Dropdown ── */}
            <AnimatePresence>
              {showDropdown && !selectedComplaint && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-merit-card border border-merit-border rounded-xl shadow-2xl shadow-black/40 max-h-[60vh] overflow-y-auto z-50"
                >
                  {filtered.length === 0 ? (
                    <div className="px-4 py-3 text-merit-text-muted text-sm">
                      No matching complaints
                    </div>
                  ) : (
                    filtered.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => selectComplaint(c.slug, c.label)}
                        className="w-full text-left px-4 py-3.5 text-merit-text hover:bg-merit-card-hover active:bg-merit-border transition-colors text-base border-b border-merit-border/50 last:border-0 touch-manipulation"
                      >
                        {c.label}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-lg mx-auto px-4 pb-20">
        {!output ? (
          // Empty state
          <div className="pt-16 text-center">
            <div className="text-5xl mb-6 opacity-30">&#x1F50D;</div>
            <h1 className="text-xl font-semibold text-merit-text mb-2">
              Clinician Quick Reference
            </h1>
            <p className="text-merit-text-muted text-sm leading-relaxed max-w-xs mx-auto mb-8">
              Select a chief complaint to see must-document items, red flags,
              dispo traps, return precautions, and litigation risk.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_COMPLAINTS.slice(0, 8).map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => selectComplaint(c.slug, c.label)}
                  className="bg-merit-card border border-merit-border rounded-xl px-3 py-3 text-sm text-merit-text hover:bg-merit-card-hover active:bg-merit-border transition-colors touch-manipulation text-center"
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className="text-merit-text-muted text-xs mt-4">
              {ALL_COMPLAINTS.length} complaints supported &middot; Type to search
            </p>
          </div>
        ) : (
          // Results
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-lg font-semibold text-merit-text">
                {output.complaintLabel}
              </h1>
              <button
                type="button"
                onClick={clearSelection}
                className="text-merit-accent text-sm font-medium touch-manipulation px-2 py-1"
              >
                Change
              </button>
            </div>

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
          </div>
        )}
      </main>
    </div>
  );
}
