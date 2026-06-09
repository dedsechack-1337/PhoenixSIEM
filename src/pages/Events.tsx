import { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { securityEvents, Severity, EventType } from '../data/mockData';
import { formatDistanceToNow, format } from 'date-fns';

const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];
const eventTypes: EventType[] = ['intrusion', 'malware', 'brute_force', 'port_scan', 'data_exfil', 'policy', 'auth', 'anomaly'];

const typeColors: Record<EventType, string> = {
  intrusion: 'text-red-400 bg-red-500/10 border-red-500/30',
  malware: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  brute_force: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  port_scan: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  data_exfil: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  policy: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  auth: 'text-green-400 bg-green-500/10 border-green-500/30',
  anomaly: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
};

const typeLabels: Record<EventType, string> = {
  intrusion: 'Intrusion',
  malware: 'Malware',
  brute_force: 'Brute Force',
  port_scan: 'Port Scan',
  data_exfil: 'Data Exfil',
  policy: 'Policy',
  auth: 'Authentication',
  anomaly: 'Anomaly',
};

export function Events() {
  const [query, setQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return securityEvents.filter((e) => {
      const matchQuery = query === '' || [e.description, e.source, e.host, e.ruleId, e.raw].some(
        (f) => f?.toLowerCase().includes(query.toLowerCase())
      );
      const matchSev = filterSeverity === 'all' || e.severity === filterSeverity;
      const matchType = filterType === 'all' || e.type === filterType;
      return matchQuery && matchSev && matchType;
    });
  }, [query, filterSeverity, filterType]);

  return (
    <div className="space-y-5">
      {/* Ticker */}
      <div className="overflow-hidden rounded-lg border border-[#1a3050] bg-[#080f1e] py-2">
        <div className="flex gap-8 animate-none" style={{ whiteSpace: 'nowrap' }}>
          <div className="flex gap-8 px-4">
            {securityEvents.slice(0, 10).map((e) => (
              <span key={e.id} className="inline-flex items-center gap-2 text-xs font-mono">
                <span className={`${e.severity === 'critical' ? 'text-red-400' : e.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'}`}>
                  ●
                </span>
                <span className="text-[#94a3b8]">{e.description.slice(0, 60)}…</span>
                <span className="text-[#475569]">{e.host}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="flex flex-wrap gap-3 items-center py-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" />
            <input
              type="text"
              placeholder="Search events, IPs, hosts, rules..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#050d1a] border border-[#1a3050] rounded-lg text-sm text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#475569]" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as Severity | 'all')}
              className="bg-[#050d1a] border border-[#1a3050] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-orange-500/50"
            >
              <option value="all">All Severities</option>
              {severities.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EventType | 'all')}
              className="bg-[#050d1a] border border-[#1a3050] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-orange-500/50"
            >
              <option value="all">All Types</option>
              {eventTypes.map((t) => <option key={t} value={t}>{typeLabels[t]}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-[#475569] font-mono">{filtered.length} events</span>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-xs text-orange-400 hover:bg-orange-500/20 transition-colors">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Security Events Feed</h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
              </span>
              <span className="text-[11px] text-orange-400 font-mono">LIVE</span>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a3050]">
                {['Severity', 'Type', 'Description', 'Source IP', 'Host', 'Rule', 'Time'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-[#475569] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0a1628]">
              {filtered.map((evt) => (
                <>
                  <tr
                    key={evt.id}
                    className="hover:bg-[#0a1628] cursor-pointer transition-colors"
                    onClick={() => setExpandedId(expandedId === evt.id ? null : evt.id)}
                  >
                    <td className="px-4 py-3"><SeverityBadge severity={evt.severity} /></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-medium ${typeColors[evt.type]}`}>
                        {typeLabels[evt.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="text-xs text-white truncate">{evt.description}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#94a3b8]">{evt.source}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#94a3b8]">{evt.host}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#475569]">{evt.ruleId}</td>
                    <td className="px-4 py-3 text-xs text-[#475569] whitespace-nowrap">
                      {formatDistanceToNow(evt.timestamp, { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronDown className={`w-3.5 h-3.5 text-[#475569] transition-transform ${expandedId === evt.id ? 'rotate-180' : ''}`} />
                    </td>
                  </tr>
                  {expandedId === evt.id && (
                    <tr key={`${evt.id}-detail`} className="bg-[#080f1e]">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div><div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Event ID</div><div className="text-xs font-mono text-[#94a3b8]">{evt.id}</div></div>
                          <div><div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Timestamp</div><div className="text-xs font-mono text-[#94a3b8]">{format(evt.timestamp, 'yyyy-MM-dd HH:mm:ss')}</div></div>
                          <div><div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">User</div><div className="text-xs font-mono text-[#94a3b8]">{evt.user || 'N/A'}</div></div>
                          <div><div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Destination</div><div className="text-xs font-mono text-[#94a3b8]">{evt.destination || 'N/A'}</div></div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Raw Log</div>
                          <div className="font-mono text-xs text-green-400 bg-[#050d1a] border border-[#1a3050] rounded px-4 py-3 break-all">{evt.raw}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-[#475569] text-sm">No events match your filters</div>
          )}
        </div>
      </Card>
    </div>
  );
}
