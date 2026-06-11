import { useState } from 'react';
import { Search, Clock, Terminal, AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { securityEvents } from '../data/mockData';
import { format } from 'date-fns';
import { SeverityBadge } from '../components/ui/SeverityBadge';

const quickFilters = [
  { label: 'Critical Events', query: 'severity:critical' },
  { label: 'SSH Brute Force', query: 'brute force ssh' },
  { label: 'Malware Detected', query: 'malware beacon' },
  { label: 'Data Exfiltration', query: 'exfil 4.2 GB' },
  { label: 'Admin Activity', query: 'admin root SYSTEM' },
  { label: 'External IPs', query: '185.220 91.195 45.33' },
];

export function LogSearch() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(securityEvents.slice(0, 5));

  const doSearch = (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSubmitted(q);
    setTimeout(() => {
      const terms = q.toLowerCase().replace('severity:', '').split(' ').filter(Boolean);
      const res = securityEvents.filter((e) =>
        terms.some((t) =>
          [e.raw, e.description, e.source, e.host, e.severity, e.type, e.user ?? ''].some((f) =>
            f.toLowerCase().includes(t)
          )
        )
      );
      setResults(res.length > 0 ? res : securityEvents.slice(0, 3));
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Search Box */}
      <Card>
        <CardBody>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-[#3d5a7a] font-mono bg-transparent border border-[rgba(30,63,102,0.5)] rounded px-3 py-1.5">
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-orange-400">phoenix-siem</span>
              <span className="text-[#3d5a7a]">~</span>
              <span className="text-green-400">$</span>
              <span className="text-[#3d5a7a] ml-1">search --index all --timerange 24h</span>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d5a7a]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doSearch(query)}
                placeholder='Search raw logs... e.g. "Failed password root" OR host:bastion-01 OR severity:critical'
                className="w-full pl-11 pr-24 py-3.5 bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg text-sm text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50 font-mono"
              />
              <button
                onClick={() => doSearch(query)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded text-sm hover:bg-orange-500/30 transition-colors"
              >
                Search
              </button>
            </div>
            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[10px] text-[#3d5a7a] uppercase tracking-wider">Quick Filters:</span>
              {quickFilters.map((f) => (
                <button
                  key={f.label}
                  onClick={() => { setQuery(f.query); doSearch(f.query); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-transparent border border-[rgba(30,63,102,0.5)] text-[11px] text-[#8ba8c8] hover:text-white hover:border-orange-500/30 transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-sm text-[#3d5a7a] font-mono">Searching event logs...</span>
          </div>
        </div>
      ) : submitted && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Search Results</h3>
                <p className="text-xs text-[#3d5a7a] mt-0.5">
                  Found <span className="text-orange-400 font-mono">{results.length}</span> events matching <span className="font-mono text-white">"{submitted}"</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#3d5a7a]" />
                <span className="text-xs text-[#3d5a7a]">Last 24 hours</span>
              </div>
            </div>
          </CardHeader>
          <div className="divide-y divide-[#0a1628]">
            {results.map((evt) => (
              <div key={evt.id} className="px-5 py-4 hover:bg-transparent transition-colors">
                <div className="flex items-start gap-3">
                  <SeverityBadge severity={evt.severity} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-white">{evt.description}</span>
                      <span className="text-xs text-[#3d5a7a] font-mono flex-shrink-0">{format(evt.timestamp, 'HH:mm:ss')}</span>
                    </div>
                    <div className="mt-1.5 font-mono text-xs text-green-400 bg-transparent border border-[rgba(30,63,102,0.5)] rounded px-3 py-2 break-all">
                      {evt.raw}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[#3d5a7a]">
                      <span className="font-mono">{evt.id}</span>
                      <span>·</span>
                      <span className="font-mono">{evt.host}</span>
                      {evt.user && (<><span>·</span><span>user: {evt.user}</span></>)}
                      <span>·</span>
                      <span className="font-mono">{evt.source}</span>
                      <span>·</span>
                      <span className="font-mono">{evt.ruleId}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!submitted && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-transparent border border-[rgba(30,63,102,0.5)] flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[#3d5a7a]" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-[#8ba8c8]">Enter a search query to investigate logs</div>
            <div className="text-xs text-[#3d5a7a] mt-1">Supports text search, field filters, and boolean operators</div>
          </div>
        </div>
      )}
    </div>
  );
}
