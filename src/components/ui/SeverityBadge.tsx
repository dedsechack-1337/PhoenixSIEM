import type { Severity } from '../../data/mockData';

const config: Record<Severity, { label: string; classes: string }> = {
  critical: { label: 'CRITICAL', classes: 'bg-red-500/20 text-red-400 border border-red-500/40' },
  high:     { label: 'HIGH',     classes: 'bg-orange-500/20 text-orange-400 border border-orange-500/40' },
  medium:   { label: 'MEDIUM',   classes: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' },
  low:      { label: 'LOW',      classes: 'bg-green-500/20 text-green-400 border border-green-500/40' },
  info:     { label: 'INFO',     classes: 'bg-blue-500/20 text-blue-400 border border-blue-500/40' },
};

export function SeverityBadge({ severity, className = '' }: { severity: Severity; className?: string }) {
  const { label, classes } = config[severity];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider ${classes} ${className}`}>
      {label}
    </span>
  );
}
