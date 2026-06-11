import type { Severity } from '../../data/mockData';

const config: Record<Severity, { label: string; cls: string }> = {
  critical: { label: 'CRITICAL', cls: 'badge-critical' },
  high:     { label: 'HIGH',     cls: 'badge-high' },
  medium:   { label: 'MEDIUM',   cls: 'badge-medium' },
  low:      { label: 'LOW',      cls: 'badge-low' },
  info:     { label: 'INFO',     cls: 'badge-info' },
};

export function SeverityBadge({ severity, className = '' }: { severity: Severity; className?: string }) {
  const { label, cls } = config[severity];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-widest ${cls} ${className}`}>
      {label}
    </span>
  );
}
