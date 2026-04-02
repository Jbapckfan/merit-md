interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const color =
    score <= 3
      ? "text-merit-success border-merit-success/30 bg-merit-success/10"
      : score <= 6
        ? "text-merit-warning border-merit-warning/30 bg-merit-warning/10"
        : "text-merit-danger border-merit-danger/30 bg-merit-danger/10";

  const label =
    score <= 3
      ? "Low Risk"
      : score <= 6
        ? "Moderate Risk"
        : "High Risk";

  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
  };

  const labelSize = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`${sizeClasses[size]} ${color} rounded-full border-2 flex items-center justify-center font-bold`}
      >
        {score}
      </div>
      <span className={`${labelSize[size]} ${color} font-medium px-2 py-0.5 rounded-full border`}>
        {label}
      </span>
    </div>
  );
}
