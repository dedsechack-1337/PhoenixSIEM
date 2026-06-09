import { useState } from 'react';
import { Search, Clock, FileText, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import SeverityBadge from '../components/ui/SeverityBadge';
import { securityEvents } from '../data';

const savedSearches = [
  { label: 'Critical events last hour', query: 'severity:critical' },
  { label: 'SQL injection attempts', query: 'sql injection' },
  { label: 'Failed auth events', query: 'failed authentication' },
  { label: 'Lateral movement', query: 'lateral movement' },
  { label: 'Data exfil events', query: 'exfil' },
  { label: 'Ransomware indicators', query: 'ransomware' },
];

const sourceSuggestions = ['ext-fw-01', 'auth-srv-01', 'edr-agent', 'ndr-01', 'dlp-01', 'waf-01', 'ids-01'];

export default function LogSearch() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(false);

  const runSearch = (q: string) => {
    setQuery(q);
    setLoading(true);
    setTimeout(() => {
      setSubmitted(q);
      setLoading(false);
    }, 600);
  };

  const results = submitted
    ? securityEvents.filter(e =>
        e.description.toLowerCase().includes(submitted.toLowerCase()) ||
        e.type.toLowerCase().includes(submitted.toLowerCase()) ||
        e.sourceIp.includes(submitted) ||
        e.severity === submitted.replace('severity:', '').trim() ||
        e.rule.toLowerCase().includes(submitted.toLowerCase()) ||
        e.source.includes(submitted)
      )
    : [];

  const formatTs = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Log Search</h1>
        <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>Search raw event logs across all sources</p>
      </div>

      {/* Search bar */}
      <Card className="p-4 space-y-3">
        <div className="flex gap-3">
          <div
            className="flex items-center gap-3 flex-1 px-4 py-3 rounded-lg"
            style={{ background: 'hsl(222,47%,5%)', border: '1px solid hsl(222,25%,22%)' }}
          >
            <Search size={16} style={{ color: '#10b981', flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runSearch(query)}
              placeholder='Search events... (e.g., "sql injection", "brute force", "192.168", severity:critical)'
              className="flex-1 bg-transparent outline-none text-sm font-mono"
              style={{ color: '#f1f5f9' }}
            />
          </div>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'hsl(222,33%,14%)', border: '1px solid hsl(222,22%,20%)', color: '#cbd5e1' }}
          >
            {['15m','1h','6h','24h','7d','30d'].map(t => <option key={t} value={t}>Last {t}</option>)}
          </select>
          <button
            onClick={() => runSearch(query)}
            className="px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)', color: '#fff' }}
          >
            <Zap size={14} />
            Search
          </button>
        </div>

        {/* Saved searches */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: 'hsl(215,15%,40%)' }}>
            <Clock size={11} className="inline mr-1" />Quick:
          </span>
          {savedSearches.map(s => (
            <button
              key={s.label}
              onClick={() => runSearch(s.query)}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,20%)', color: 'hsl(215,20%,60%)' }}
            >{s.label}</button>
          ))}
        </div>
      </Card>

      {/* Source pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs" style={{ color: 'hsl(215,15%,40%)' }}>Sources:</span>
        {sourceSuggestions.map(s => (
          <button
            key={s}
            onClick={() => runSearch(s)}
            className="text-xs px-2.5 py-1 rounded font-mono"
            style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}
          >{s}</button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <Card className="p-8 text-center">
          <div className="font-mono text-sm" style={{ color: '#10b981' }}>
            <div>Searching {securityEvents.length} events across last {timeRange}...</div>
            <div className="mt-2 text-xs" style={{ color: 'hsl(215,15%,40%)' }}>Parsing indexes · Applying filters · Aggregating results</div>
          </div>
        </Card>
      )}

      {!loading && submitted && (
        <>
          <div className="flex items-center gap-3">
            <FileText size={14} style={{ color: '#10b981' }} />
            <span className="text-sm font-mono" style={{ color: '#10b981' }}>
              {results.length} results for <span style={{ color: '#f1f5f9' }}>"{submitted}"</span>
            </span>
            <span className="text-xs" style={{ color: 'hsl(215,15%,40%)' }}>· {timeRange} window</span>
          </div>

          <Card className="overflow-hidden">
            <div
              className="grid text-[10px] font-semibold uppercase tracking-wider px-4 py-2.5"
              style={{ gridTemplateColumns: '150px 100px 150px 1fr 120px 100px', background: 'hsl(222,40%,9%)', borderBottom: '1px solid hsl(222,22%,16%)', color: 'hsl(215,15%,40%)' }}
            >
              <span>TIMESTAMP</span>
              <span>SEVERITY</span>
              <span>TYPE</span>
              <span>DESCRIPTION</span>
              <span>SOURCE IP</span>
              <span>SOURCE</span>
            </div>
            {results.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'hsl(215,15%,40%)' }}>
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                No events match your query
              </div>
            ) : results.map((evt, idx) => (
              <div
                key={evt.id}
                className="grid items-center px-4 py-3 text-xs border-b hover:opacity-90"
                style={{
                  gridTemplateColumns: '150px 100px 150px 1fr 120px 100px',
                  borderColor: 'hsl(222,22%,13%)',
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}
              >
                <span className="font-mono text-[10px]" style={{ color: 'hsl(215,15%,45%)' }}>{formatTs(evt.timestamp)}</span>
                <SeverityBadge severity={evt.severity} size="sm" />
                <span style={{ color: '#cbd5e1' }}>{evt.type}</span>
                <span className="truncate pr-4" style={{ color: 'hsl(215,20%,60%)' }}>{evt.description}</span>
                <span className="font-mono" style={{ color: '#38bdf8' }}>{evt.sourceIp}</span>
                <span className="font-mono text-[10px]" style={{ color: 'hsl(215,15%,40%)' }}>{evt.source}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {!loading && !submitted && (
        <Card className="p-12 text-center">
          <Search size={40} className="mx-auto mb-4 opacity-20" style={{ color: '#10b981' }} />
          <p className="font-medium" style={{ color: 'hsl(215,20%,60%)' }}>Enter a search query or click a quick search above</p>
          <p className="text-xs mt-1" style={{ color: 'hsl(215,15%,40%)' }}>Supports keyword, IP, severity, and rule ID searches</p>
        </Card>
      )}
    </div>
  );
}
