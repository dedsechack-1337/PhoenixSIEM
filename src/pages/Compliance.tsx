import { Card, CardHeader } from '../components/ui/Card';
import { complianceChecks, Framework, CheckStatus } from '../data/mockData';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const frameworks: Framework[] = ['PCI-DSS', 'CIS', 'HIPAA', 'NIST', 'SOC2', 'ISO27001'];

const frameworkInfo: Record<Framework, { description: string; color: string }> = {
  'PCI-DSS': { description: 'Payment Card Industry Data Security Standard', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  'CIS': { description: 'Center for Internet Security Controls', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  'HIPAA': { description: 'Health Insurance Portability & Accountability Act', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  'NIST': { description: 'NIST Cybersecurity Framework', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  'SOC2': { description: 'Service Organization Control 2', color: 'text-green-400 border-green-500/30 bg-green-500/10' },
  'ISO27001': { description: 'ISO/IEC 27001 Information Security', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
};

const statusConfig: Record<CheckStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  pass: { icon: CheckCircle, color: 'text-green-400', label: 'Pass' },
  fail: { icon: XCircle, color: 'text-red-400', label: 'Fail' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', label: 'Warning' },
};

function frameworkScore(fw: Framework) {
  const checks = complianceChecks.filter((c) => c.framework === fw);
  const pass = checks.filter((c) => c.status === 'pass').length;
  return { total: checks.length, pass, pct: Math.round((pass / checks.length) * 100) };
}

export function Compliance() {
  const [activeFramework, setActiveFramework] = useState<Framework | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = activeFramework === 'all' ? complianceChecks : complianceChecks.filter((c) => c.framework === activeFramework);

  const overallPass = complianceChecks.filter((c) => c.status === 'pass').length;
  const overallPct = Math.round((overallPass / complianceChecks.length) * 100);

  return (
    <div className="space-y-5" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Overall Score */}
      <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[rgba(30,63,102,0.5)] bg-transparent">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a3050" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={overallPct >= 80 ? '#22c55e' : overallPct >= 60 ? '#eab308' : '#ef4444'}
              strokeWidth="3"
              strokeDasharray={`${overallPct} ${100 - overallPct}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{overallPct}%</span>
          </div>
        </div>
        <div>
          <div className="text-base font-semibold text-white">Overall Compliance Score</div>
          <div className="text-xs text-[#8ba8c8] mt-0.5">{overallPass}/{complianceChecks.length} controls passing across all frameworks</div>
        </div>
      </div>

      {/* Framework Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {frameworks.map((fw) => {
          const { total, pass, pct } = frameworkScore(fw);
          const { color } = frameworkInfo[fw];
          return (
            <button
              key={fw}
              onClick={() => setActiveFramework(activeFramework === fw ? 'all' : fw)}
              className={`rounded-xl border p-4 text-left transition-all ${
                activeFramework === fw ? color : 'border-[rgba(30,63,102,0.5)] bg-transparent hover:border-orange-500/30'
              }`}
            >
              <div className="text-sm font-bold text-white">{fw}</div>
              <div className="text-xl font-bold mt-1 text-white">{pct}%</div>
              <div className="text-[10px] text-[#3d5a7a] mt-1">{pass}/{total} passing</div>
              <div className="mt-2 h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Compliance Controls ({filtered.length})
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-1 rounded font-mono">
                ✓ {filtered.filter((c) => c.status === 'pass').length} Pass
              </span>
              <span className="text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded font-mono">
                ⚠ {filtered.filter((c) => c.status === 'warning').length} Warning
              </span>
              <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-1 rounded font-mono">
                ✗ {filtered.filter((c) => c.status === 'fail').length} Fail
              </span>
            </div>
          </div>
        </CardHeader>
        <div className="divide-y divide-[#0a1628]">
          {filtered.map((check) => {
            const { icon: StatusIcon, color, label } = statusConfig[check.status];
            const isExp = expanded === check.id;
            return (
              <div key={check.id}>
                <div
                  className="flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-transparent transition-colors"
                  onClick={() => setExpanded(isExp ? null : check.id)}
                >
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${frameworkInfo[check.framework].color}`}>{check.framework}</span>
                      <span className="text-[10px] font-mono text-[#3d5a7a]">{check.control}</span>
                      <span className="text-sm text-white">{check.title}</span>
                    </div>
                    <div className="text-[10px] text-[#3d5a7a] mt-0.5">{check.description}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-mono ${color}`}>{label}</span>
                    <span className="text-[10px] text-[#3d5a7a]">{formatDistanceToNow(check.lastChecked, { addSuffix: true })}</span>
                    {isExp ? <ChevronUp className="w-3.5 h-3.5 text-[#3d5a7a]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#3d5a7a]" />}
                  </div>
                </div>
                {isExp && check.remediation && (
                  <div className="bg-transparent border-t border-[rgba(30,63,102,0.5)] px-6 py-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#3d5a7a] mb-1">Remediation Steps</div>
                    <p className="text-xs text-[#8ba8c8]">{check.remediation}</p>
                    {check.affectedHosts.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] text-[#3d5a7a]">Affected:</span>
                        {check.affectedHosts.map((h) => (
                          <span key={h} className="font-mono text-[10px] text-orange-300 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
