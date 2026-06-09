import { Severity, severityConfig } from '../../data';

interface Props {
  severity: Severity;
  size?: 'sm' | 'md';
}

export default function SeverityBadge({ severity, size = 'md' }: Props) {
  const cfg = severityConfig[severity];
  const px = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={`${px} rounded font-mono font-semibold tracking-wider inline-flex items-center gap-1`}
      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}
