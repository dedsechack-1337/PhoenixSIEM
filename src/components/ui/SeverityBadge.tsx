import React from "react";
import { Severity } from "../../data/mockData";

const config: Record<Severity, { label: string; className: string }> = {
  critical: { label: "CRITICAL", className: "bg-red-500/15 text-red-400 border border-red-500/30" },
  high: { label: "HIGH", className: "bg-orange-500/15 text-orange-400 border border-orange-500/30" },
  medium: { label: "MEDIUM", className: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" },
  low: { label: "LOW", className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  info: { label: "INFO", className: "bg-sky-500/15 text-sky-400 border border-sky-500/30" },
};

interface Props {
  severity: Severity;
  size?: "sm" | "md";
}

export const SeverityBadge: React.FC<Props> = ({ severity, size = "md" }) => {
  const { label, className } = config[severity];
  return (
    <span
      className={`inline-flex items-center rounded font-mono font-semibold tracking-wider ${className} ${
        size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"
      }`}
    >
      {label}
    </span>
  );
};
