import type { Finding } from "@/lib/analysis";

interface FindingsTableProps {
  findings: Finding[];
}

export default function FindingsTable({ findings }: FindingsTableProps) {
  const severityBadge = (severity: Finding["severity"]) => {
    const classes = {
      critical: "bg-merit-danger/15 text-merit-danger border-merit-danger/30",
      major: "bg-merit-warning/15 text-merit-warning border-merit-warning/30",
      minor: "bg-merit-accent/15 text-merit-accent border-merit-accent/30",
    };
    return (
      <span
        className={`${classes[severity]} text-xs font-medium px-2 py-0.5 rounded-full border uppercase tracking-wider`}
      >
        {severity}
      </span>
    );
  };

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      "missed diagnosis": "Missed Dx",
      "delayed treatment": "Delayed Tx",
      "documentation gap": "Doc Gap",
      "protocol violation": "Protocol",
      "EMTALA issue": "EMTALA",
    };
    return labels[cat] || cat;
  };

  if (findings.length === 0) {
    return (
      <div className="text-center py-8 text-merit-text-muted">
        No findings identified in the clinical records.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {findings.map((finding, i) => (
        <div
          key={i}
          className="bg-merit-card border border-merit-border rounded-xl p-5 hover:border-merit-border-hover transition"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-merit-text-muted text-sm font-mono">#{i + 1}</span>
              <span className="text-merit-text-muted text-xs font-medium uppercase tracking-wider bg-merit-bg px-2 py-0.5 rounded">
                {categoryLabel(finding.category)}
              </span>
              {severityBadge(finding.severity)}
            </div>
          </div>

          <h4 className="text-merit-text font-medium mb-2">{finding.description}</h4>

          <div className="space-y-3 mt-4">
            <div>
              <span className="text-merit-text-muted text-xs font-medium uppercase tracking-wider block mb-1">
                Evidence
              </span>
              <p className="text-merit-text-muted text-sm leading-relaxed bg-merit-bg rounded-lg p-3 border-l-2 border-merit-accent/40">
                {finding.evidence}
              </p>
            </div>

            <div>
              <span className="text-merit-text-muted text-xs font-medium uppercase tracking-wider block mb-1">
                Standard of Care
              </span>
              <p className="text-merit-text-muted text-sm leading-relaxed bg-merit-bg rounded-lg p-3 border-l-2 border-merit-success/40">
                {finding.shouldHaveDone}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
