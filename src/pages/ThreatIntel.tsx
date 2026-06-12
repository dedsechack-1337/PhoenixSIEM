import { useState } from 'react';
import { Search, Shield, Globe, Hash, Link, Mail, Activity } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { threatIntel, IOCType, ThreatCategory } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<IOCType, typeof Globe> = {
  ip: Globe,
  domain: Globe,
  md5: Hash,
  sha256: Hash,
  url: Link,
  email: Mail,
};

const typeColors: Record<IOCType, string> = {
  ip: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  domain: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  md5: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  sha256: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  url: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  email: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
};

const catColors: Record<ThreatCategory, string> = {
  malware: 'text-red-400',
  phishing: 'text-orange-400',
  c2: 'text-purple-400',
  ransomware: 'text-red-500',
  botnet: 'text-yellow-400',
  apt: 'text-pink-400',
  exploit: 'text-blue-400',
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-red-500' : value >= 70 ? 'bg-orange-500' : 'bg-yellow-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[#1a3050] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono text-[#8ba8c8]">{value}%</span>
    </div>
  );
}

export function ThreatIntel() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<IOCType | 'all'>('all');
  const [filterCat, setFilterCat] = useState<ThreatCategory | 'all'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = threatIntel.filter((t) => {
    const q = query.toLowerCase();
    const matchQ = !q || [t.ioc, t.description, t.source, ...t.tags].some((s) => s.toLowerCase().includes(q));
    const matchType = filterType === 'all' || t.type === filterType;
    const matchCat = filterCat === 'all' || t.category === filterCat;
    const matchActive = filterActive === 'all' || (filterActive === 'active' ? t.active : !t.active);
    return matchQ && matchType && matchCat && matchActive;
  });

  const activeCount = threatIntel.filter((t) => t.active).length;

  return (
    <div className="space-y-5" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total IOCs', value: threatIntel.length, color: 'text-white' },
          { label: 'Active', value: activeCount, color: 'text-red-400' },
          { label: 'Inactive', value: threatIntel.length - activeCount, color: 'text-[#3d5a7a]' },
          { label: 'Avg Confidence', value: `${Math.round(threatIntel.reduce((s, t) => s + t.confidence, 0) / threatIntel.length)}%`, color: 'text-orange-400' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="py-4">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#3d5a7a] mt-1">{s.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="py-3 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3d5a7a]" />
            <input
              type="text"
              placeholder="Search IOCs, descriptions, tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg text-sm text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50"
            />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as IOCType | 'all')} className="bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg px-3 py-2 text-sm text-[#8ba8c8] focus:outline-none">
            <option value="all">All Types</option>
            {(['ip', 'domain', 'md5', 'sha256', 'url', 'email'] as IOCType[]).map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value as ThreatCategory | 'all')} className="bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg px-3 py-2 text-sm text-[#8ba8c8] focus:outline-none">
            <option value="all">All Categories</option>
            {(['malware', 'phishing', 'c2', 'ransomware', 'botnet', 'apt', 'exploit'] as ThreatCategory[]).map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={filterActive} onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')} className="bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg px-3 py-2 text-sm text-[#8ba8c8] focus:outline-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </CardBody>
      </Card>

      {/* IOC Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">IOC Database ({filtered.length})</h3>
            <Shield className="w-4 h-4 text-[#3d5a7a]" />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(30,63,102,0.5)]">
                {['Status', 'Type', 'Indicator', 'Category', 'Confidence', 'Source', 'Last Seen', 'Tags'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-[#3d5a7a] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0a1628]">
              {filtered.map((ioc) => {
                const TypeIcon = typeIcons[ioc.type];
                return (
                  <tr key={ioc.id} className="hover:bg-transparent transition-colors group">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded ${ioc.active ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-[#1a3050]/50 text-[#3d5a7a] border border-[rgba(30,63,102,0.5)]'}`}>
                        <Activity className="w-2.5 h-2.5" />
                        {ioc.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-medium ${typeColors[ioc.type]}`}>
                        <TypeIcon className="w-3 h-3" />
                        {ioc.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-white max-w-xs truncate" title={ioc.ioc}>{ioc.ioc}</div>
                      <div className="text-[10px] text-[#3d5a7a] mt-0.5 max-w-xs truncate">{ioc.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium capitalize ${catColors[ioc.category]}`}>{ioc.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <ConfidenceBar value={ioc.confidence} />
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8ba8c8]">{ioc.source}</td>
                    <td className="px-4 py-3 text-xs text-[#3d5a7a]">{formatDistanceToNow(ioc.lastSeen, { addSuffix: true })}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {ioc.tags.map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-[#1a3050] text-[#3d5a7a]">{tag}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
