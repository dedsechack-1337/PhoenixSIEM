import { useState } from 'react';
import { Shield, Wrench, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { vulnerabilities, Vulnerability, VulnStatus } from '../data/mockData';

function CvssBar({ score }: { score: number }) {
  const color = score >= 9 ? 'bg-red-500' : score >= 7 ? 'bg-orange-500' : score >= 4 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-[#1a3050] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(score / 10) * 100}%` }} />
      </div>
      <span className={`text-sm font-bold font-mono ${color.replace('bg-', 'text-')}`}>{score.toFixed(1)}</span>
    </div>
  );
}

const statusConfig: Record<VulnStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  open: { label: 'Open', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: AlertCircle },
  patched: { label: 'Patched', color: 'text-green-400 bg-green-500/10 border-green-500/30', icon: CheckCircle },
  mitigated: { label: 'Mitigated', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', icon: Shield },
  accepted: { label: 'Risk Accepted', color: 'text-[#475569] bg-[#1a3050]/50 border-[#1a3050]', icon: CheckCircle },
};

export function Vulnerabilities() {
  const [vulns, setVulns] = useState<Vulnerability[]>(vulnerabilities);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<VulnStatus | 'all'>('all');

  const updateStatus = (id: string, status: VulnStatus) => {
    setVulns((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
  };

  const filtered = filter === 'all' ? vulns : vulns.filter((v) => v.status === filter);

  const open = vulns.filter((v) => v.status === 'open').length;
  const exploitable = vulns.filter((v) => v.exploitAvailable && v.status === 'open').length;
  const avgCvss = (vulns.filter((v) => v.status === 'open').reduce((s, v) => s + v.cvss, 0) / (open || 1)).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total CVEs', value: vulns.length, color: 'text-white' },
          { label: 'Open', value: open, color: 'text-red-400' },
          { label: 'Exploitable & Open', value: exploitable, color: 'text-orange-400' },
          { label: 'Avg CVSS (Open)', value: avgCvss, color: 'text-yellow-400' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="py-4">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#475569] mt-1">{s.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'open', 'patched', 'mitigated', 'accepted'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'bg-[#0d1f35] text-[#94a3b8] border border-[#1a3050] hover:text-white'
            }`}
          >
            {s === 'all' ? 'All' : statusConfig[s].label}
          </button>
        ))}
      </div>

      {/* Vuln Cards */}
      <div className="space-y-3">
        {filtered.map((vuln) => {
          const { icon: StatusIcon, color, label } = statusConfig[vuln.status];
          const isExp = expanded === vuln.id;

          return (
            <Card key={vuln.id} className={`${vuln.severity === 'critical' && vuln.status === 'open' ? 'border-red-500/30' : ''} transition-colors`}>
              <div
                className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[#0a1628] rounded-xl transition-colors"
                onClick={() => setExpanded(isExp ? null : vuln.id)}
              >
                <SeverityBadge severity={vuln.severity} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">{vuln.cve}</span>
                        <h4 className="text-sm font-semibold text-white">{vuln.title}</h4>
                        {vuln.exploitAvailable && (
                          <span className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded">EXPLOIT AVAILABLE</span>
                        )}
                      </div>
                      <p className="text-xs text-[#94a3b8] mt-1">{vuln.affectedProduct}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <CvssBar score={vuln.cvss} />
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-mono ${color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] text-[#475569]">Affected: {vuln.affectedHosts.join(', ')}</span>
                  </div>
                </div>
              </div>

              {isExp && (
                <div className="border-t border-[#1a3050] px-5 py-4 bg-[#080f1e] rounded-b-xl space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-1">Description</div>
                    <p className="text-xs text-[#94a3b8]">{vuln.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#475569]" />
                    <a
                      href={`https://nvd.nist.gov/vuln/detail/${vuln.cve}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline font-mono"
                      onClick={(e) => e.stopPropagation()}
                    >
                      NVD: {vuln.cve}
                    </a>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-2">Remediation Actions</div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(vuln.id, 'patched'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-colors ${vuln.status === 'patched' ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'border-[#1a3050] text-[#94a3b8] hover:border-green-500/30 hover:text-green-400'}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Patched
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(vuln.id, 'mitigated'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-colors ${vuln.status === 'mitigated' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'border-[#1a3050] text-[#94a3b8] hover:border-yellow-500/30 hover:text-yellow-400'}`}
                      >
                        <Wrench className="w-3.5 h-3.5" /> Mitigate
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(vuln.id, 'accepted'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-colors ${vuln.status === 'accepted' ? 'bg-[#1a3050] border-[#1a3050] text-[#475569]' : 'border-[#1a3050] text-[#94a3b8] hover:text-[#475569]'}`}
                      >
                        Accept Risk
                      </button>
                      {vuln.status !== 'open' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(vuln.id, 'open'); }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1a3050] text-xs text-[#475569] hover:text-red-400 transition-colors"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
