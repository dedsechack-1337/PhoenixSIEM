import { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { threatIntel, ThreatCategory } from '../data';

const categoryColors: Record<ThreatCategory, string> = {
  malware: '#ef4444',
  phishing: '#f97316',
  c2: '#a78bfa',
  ransomware: '#ec4899',
  botnet: '#eab308',
  apt: '#ef4444',
  exploit: '#38bdf8',
};

const typeColors: Record<string, string> = {
  ip: '#38bdf8', domain: '#a78bfa', md5: '#10b981', sha256: '#10b981', url: '#f97316', email: '#eab308',
};

export default function ThreatIntel() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<ThreatCategory | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = threatIntel.filter(t => {
    if (search && !t.ioc.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== 'all' && t.category !== catFilter) return false;
    if (activeFilter === 'active' && !t.active) return false;
    if (activeFilter === 'inactive' && t.active) return false;
    return true;
  });

  const activeCount = threatIntel.filter(t => t.active).length;
  const categories = ['all', 'malware', 'phishing', 'c2', 'ransomware', 'botnet', 'apt', 'exploit'] as const;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Threat Intelligence</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
            {activeCount} active IOCs · {threatIntel.length - activeCount} inactive
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <AlertTriangle size={14} />
          {activeCount} Actionable Indicators
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-7 gap-3">
        {(['malware', 'phishing', 'c2', 'ransomware', 'botnet', 'apt', 'exploit'] as ThreatCategory[]).map(cat => {
          const count = threatIntel.filter(t => t.category === cat && t.active).length;
          return (
            <Card key={cat} className="p-3 text-center cursor-pointer" hover onClick={() => setCatFilter(cat === catFilter ? 'all' : cat)}>
              <div className="text-lg font-bold font-mono" style={{ color: categoryColors[cat] }}>{count}</div>
              <div className="text-[10px] uppercase font-medium mt-1" style={{ color: 'hsl(215,15%,45%)' }}>{cat}</div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-lg" style={{ background: 'hsl(222,33%,14%)', border: '1px solid hsl(222,22%,20%)' }}>
          <Search size={14} style={{ color: 'hsl(215,15%,45%)' }} />
          <input
            type="text"
            placeholder="Search IOC, description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm"
            style={{ color: '#f1f5f9' }}
          />
        </div>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'hsl(222,33%,14%)', border: '1px solid hsl(222,22%,20%)', color: '#cbd5e1' }}
        >
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.toUpperCase()}</option>)}
        </select>
        {(['all', 'active', 'inactive'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize"
            style={{
              background: activeFilter === f ? 'rgba(16,185,129,0.15)' : 'hsl(222,33%,14%)',
              border: `1px solid ${activeFilter === f ? 'rgba(16,185,129,0.3)' : 'hsl(222,22%,20%)'}`,
              color: activeFilter === f ? '#10b981' : 'hsl(215,15%,50%)',
            }}
          >{f}</button>
        ))}
        <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
          {filtered.length} IOCs
        </span>
      </div>

      {/* IOC Table */}
      <Card className="overflow-hidden">
        <div
          className="grid text-[10px] font-semibold uppercase tracking-wider px-4 py-2.5"
          style={{ gridTemplateColumns: '80px 280px 90px 100px 110px 80px 1fr', background: 'hsl(222,40%,9%)', borderBottom: '1px solid hsl(222,22%,16%)', color: 'hsl(215,15%,40%)' }}
        >
          <span>TYPE</span>
          <span>INDICATOR</span>
          <span>CATEGORY</span>
          <span>CONFIDENCE</span>
          <span>LAST SEEN</span>
          <span>STATUS</span>
          <span>DESCRIPTION</span>
        </div>
        {filtered.map((ioc, idx) => (
          <div
            key={ioc.id}
            className="grid items-center px-4 py-3 text-xs border-b hover:opacity-90"
            style={{
              gridTemplateColumns: '80px 280px 90px 100px 110px 80px 1fr',
              borderColor: 'hsl(222,22%,13%)',
              background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
            }}
          >
            <Badge color={typeColors[ioc.type] || '#94a3b8'} className="text-[10px] w-fit uppercase">{ioc.type}</Badge>
            <span className="font-mono truncate pr-4" style={{ color: '#38bdf8', fontSize: 11 }}>{ioc.ioc}</span>
            <Badge color={categoryColors[ioc.category]} className="text-[10px] w-fit">{ioc.category}</Badge>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222,22%,20%)' }}>
                <div className="h-full rounded-full" style={{ width: `${ioc.confidence}%`, background: ioc.confidence >= 90 ? '#ef4444' : ioc.confidence >= 70 ? '#f97316' : '#eab308' }} />
              </div>
              <span className="font-mono w-6 text-right" style={{ color: '#f1f5f9' }}>{ioc.confidence}%</span>
            </div>
            <span style={{ color: 'hsl(215,15%,45%)' }}>{ioc.lastSeen}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: ioc.active ? '#ef4444' : '#6b7280' }} />
              <span style={{ color: ioc.active ? '#ef4444' : '#6b7280' }}>{ioc.active ? 'Active' : 'Inactive'}</span>
            </div>
            <span className="truncate" style={{ color: 'hsl(215,20%,55%)' }}>{ioc.description}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
