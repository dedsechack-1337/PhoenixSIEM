import { useState, useEffect, useRef } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import SeverityBadge from '../components/ui/SeverityBadge';
import { securityEvents, Severity } from '../data';

const eventTypes = ['All Types', 'Intrusion Attempt', 'Brute Force', 'Malware Detected', 'Port Scan', 'Data Exfiltration', 'Privilege Escalation', 'Lateral Movement', 'C2 Communication', 'Ransomware Activity', 'Phishing', 'Vulnerability Exploit', 'Policy Violation', 'Authentication'];
const severities: (Severity | 'all')[] = ['all', 'critical', 'high', 'medium', 'low', 'info'];
const sources = ['All Sources', 'ext-fw-01', 'auth-srv-01', 'edr-agent', 'ndr-01', 'dlp-01', 'waf-01', 'ids-01', 'email-gw-01', 'siem-core', 'proxy-01'];

const sevColor: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#10b981', info: '#38bdf8',
};

export default function Events() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sevFilter, setSevFilter] = useState<'all' | Severity>('all');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [liveCount, setLiveCount] = useState(securityEvents.length);
  const [paused, setPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setLiveCount(c => Math.min(c + 1, 999)), 8000);
    return () => clearInterval(id);
  }, [paused]);

  const filtered = securityEvents.filter(e => {
    if (search && !e.description.toLowerCase().includes(search.toLowerCase()) && !e.sourceIp.includes(search) && !e.type.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'All Types' && e.type !== typeFilter) return false;
    if (sevFilter !== 'all' && e.severity !== sevFilter) return false;
    if (sourceFilter !== 'All Sources' && e.source !== sourceFilter) return false;
    return true;
  });

  const formatTs = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Security Events</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
            Live event feed • {liveCount} total events ingested
          </p>
        </div>
        <button
          onClick={() => setPaused(p => !p)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            background: paused ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
            color: paused ? '#ef4444' : '#10b981',
            border: `1px solid ${paused ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          }}
        >
          <RefreshCw size={14} className={paused ? '' : 'animate-spin'} style={{ animationDuration: '3s' }} />
          {paused ? 'Paused' : 'Live Feed'}
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-lg" style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,18%)' }}>
            <Search size={14} style={{ color: 'hsl(215,15%,45%)' }} />
            <input
              type="text"
              placeholder="Search events, IPs, descriptions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent flex-1 outline-none text-sm"
              style={{ color: '#f1f5f9' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: 'hsl(215,15%,45%)' }} />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,18%)', color: '#cbd5e1' }}
          >
            {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={sevFilter}
            onChange={e => setSevFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,18%)', color: '#cbd5e1' }}
          >
            {severities.map(s => <option key={s} value={s}>{s === 'all' ? 'All Severities' : s.toUpperCase()}</option>)}
          </select>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,18%)', color: '#cbd5e1' }}
          >
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
            {filtered.length} results
          </span>
        </div>
      </Card>

      {/* Event Ticker Feed */}
      <Card className="overflow-hidden">
        {/* Table header */}
        <div
          className="grid text-[10px] font-semibold uppercase tracking-wider px-4 py-2.5"
          style={{ gridTemplateColumns: '140px 120px 160px 1fr 130px 100px', background: 'hsl(222,40%,9%)', borderBottom: '1px solid hsl(222,22%,16%)', color: 'hsl(215,15%,40%)' }}
        >
          <span>TIMESTAMP</span>
          <span>SEVERITY</span>
          <span>TYPE</span>
          <span>DESCRIPTION</span>
          <span>SOURCE IP</span>
          <span>RULE ID</span>
        </div>

        {/* Events */}
        <div ref={tickerRef} className="custom-scroll overflow-y-auto" style={{ maxHeight: '65vh' }}>
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'hsl(215,15%,40%)' }}>
              No events match your filters
            </div>
          ) : (
            filtered.map((evt, idx) => (
              <div
                key={evt.id}
                className="grid items-center px-4 py-3 text-xs border-b cursor-pointer transition-colors hover:opacity-90"
                style={{
                  gridTemplateColumns: '140px 120px 160px 1fr 130px 100px',
                  borderColor: 'hsl(222,22%,13%)',
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  borderLeft: `2px solid ${sevColor[evt.severity]}30`,
                }}
              >
                <span className="font-mono" style={{ color: 'hsl(215,15%,45%)' }}>{formatTs(evt.timestamp)}</span>
                <SeverityBadge severity={evt.severity} size="sm" />
                <span className="font-medium" style={{ color: '#cbd5e1' }}>{evt.type}</span>
                <span className="truncate pr-4" style={{ color: 'hsl(215,20%,60%)' }}>{evt.description}</span>
                <span className="font-mono" style={{ color: '#38bdf8' }}>{evt.sourceIp}</span>
                <span className="font-mono text-[10px]" style={{ color: 'hsl(215,15%,38%)' }}>{evt.rule}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3">
        {(['critical', 'high', 'medium', 'low', 'info'] as Severity[]).map(sev => {
          const count = securityEvents.filter(e => e.severity === sev).length;
          return (
            <Card key={sev} className="p-3 flex items-center justify-between cursor-pointer" hover onClick={() => setSevFilter(sev)}>
              <span className="text-xs font-mono uppercase" style={{ color: sevColor[sev] }}>{sev}</span>
              <span className="text-lg font-bold font-mono" style={{ color: sevColor[sev] }}>{count}</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
