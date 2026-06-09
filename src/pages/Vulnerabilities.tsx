import { useState } from 'react';
import { Bug, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';
import SeverityBadge from '../components/ui/SeverityBadge';
import Badge from '../components/ui/Badge';
import { vulnerabilities, VulnStatus } from '../data';

const statusColors: Record<VulnStatus, string> = {
  open: '#ef4444',
  in_progress: '#f97316',
  mitigated: '#eab308',
  patched: '#10b981',
  accepted: '#6b7280',
};

const statusLabels: Record<VulnStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  mitigated: 'Mitigated',
  patched: 'Patched',
  accepted: 'Risk Accepted',
};

const cvssColor = (score: number) => {
  if (score >= 9) return '#ef4444';
  if (score >= 7) return '#f97316';
  if (score >= 4) return '#eab308';
  return '#10b981';
};

export default function Vulnerabilities() {
  const [vulns, setVulns] = useState(vulnerabilities);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<VulnStatus | 'all'>('all');

  const updateStatus = (id: string, status: VulnStatus) => {
    setVulns(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const filtered = vulns.filter(v => filter === 'all' || v.status === filter);

  const stats = {
    critical: vulns.filter(v => v.severity === 'critical' && v.status === 'open').length,
    exploited: vulns.filter(v => v.exploitedInWild).length,
    open: vulns.filter(v => v.status === 'open' || v.status === 'in_progress').length,
    patched: vulns.filter(v => v.status === 'patched').length,
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Vulnerability Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
            {vulns.length} CVEs tracked · {stats.exploited} exploited in the wild
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Critical Open', value: stats.critical, color: '#ef4444', icon: <AlertTriangle size={18} /> },
          { label: 'Exploited in Wild', value: stats.exploited, color: '#f97316', icon: <Bug size={18} /> },
          { label: 'Needs Remediation', value: stats.open, color: '#eab308', icon: <Bug size={18} /> },
          { label: 'Patched / Closed', value: stats.patched, color: '#10b981', icon: <ShieldCheck size={18} /> },
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'open', 'in_progress', 'mitigated', 'patched', 'accepted'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: filter === f ? (f === 'all' ? 'rgba(16,185,129,0.15)' : `${statusColors[f as VulnStatus]}15`) : 'hsl(222,33%,14%)',
              color: filter === f ? (f === 'all' ? '#10b981' : statusColors[f as VulnStatus]) : 'hsl(215,15%,50%)',
              border: `1px solid ${filter === f ? (f === 'all' ? 'rgba(16,185,129,0.3)' : `${statusColors[f as VulnStatus]}40`) : 'hsl(222,22%,20%)'}`,
            }}
          >{f === 'all' ? 'All' : statusLabels[f as VulnStatus]}</button>
        ))}
      </div>

      {/* Vuln list */}
      <div className="space-y-3">
        {filtered.map(vuln => (
          <Card key={vuln.id} className="overflow-hidden">
            <div
              className="p-4 cursor-pointer"
              style={{ borderLeft: `3px solid ${cvssColor(vuln.cvss)}` }}
              onClick={() => setExpanded(expanded === vuln.id ? null : vuln.id)}
            >
              <div className="flex items-start gap-4">
                {/* CVSS Badge */}
                <div
                  className="w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: `${cvssColor(vuln.cvss)}15`, border: `1px solid ${cvssColor(vuln.cvss)}30` }}
                >
                  <span className="font-mono font-bold text-lg leading-none" style={{ color: cvssColor(vuln.cvss) }}>{vuln.cvss}</span>
                  <span className="text-[9px] mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>CVSS</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm" style={{ color: '#a78bfa' }}>{vuln.cve}</span>
                    <SeverityBadge severity={vuln.severity} size="sm" />
                    <Badge color={statusColors[vuln.status]}>{statusLabels[vuln.status]}</Badge>
                    {vuln.exploitedInWild && <Badge color="#ef4444">⚡ Exploited in Wild</Badge>}
                    {vuln.exploitAvailable && <Badge color="#f97316">Exploit Available</Badge>}
                  </div>
                  <p className="font-semibold text-sm mt-1" style={{ color: '#f1f5f9' }}>{vuln.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs flex-wrap" style={{ color: 'hsl(215,15%,45%)' }}>
                    <span>{vuln.affectedSoftware}</span>
                    <span>•</span>
                    <span>Published: {vuln.publishedDate}</span>
                    <span>•</span>
                    <span>Affects: {vuln.affectedAssets.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {expanded === vuln.id && (
                <div className="mt-4 space-y-3 pt-4" style={{ borderTop: '1px solid hsl(222,22%,16%)' }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'hsl(215,15%,40%)' }}>Description</p>
                      <p className="text-sm" style={{ color: '#cbd5e1' }}>{vuln.description}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'hsl(215,15%,40%)' }}>Remediation</p>
                      <p className="text-sm" style={{ color: '#86efac' }}>{vuln.remediation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-xs" style={{ color: 'hsl(215,15%,40%)' }}>Actions:</span>
                    {vuln.status !== 'patched' && (
                      <button
                        onClick={e => { e.stopPropagation(); updateStatus(vuln.id, 'patched'); }}
                        className="px-3 py-1 rounded text-xs font-medium"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                      >✓ Mark Patched</button>
                    )}
                    {vuln.status !== 'mitigated' && (
                      <button
                        onClick={e => { e.stopPropagation(); updateStatus(vuln.id, 'mitigated'); }}
                        className="px-3 py-1 rounded text-xs font-medium"
                        style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)' }}
                      >⚡ Mark Mitigated</button>
                    )}
                    {vuln.status !== 'accepted' && (
                      <button
                        onClick={e => { e.stopPropagation(); updateStatus(vuln.id, 'accepted'); }}
                        className="px-3 py-1 rounded text-xs font-medium"
                        style={{ background: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.3)' }}
                      >Accept Risk</button>
                    )}
                    <button className="flex items-center gap-1 px-3 py-1 rounded text-xs ml-auto" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                      <ExternalLink size={11} /> NVD Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
