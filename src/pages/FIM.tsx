import { useState } from 'react';
import { FileCheck, CheckCircle, ShieldOff } from 'lucide-react';
import Card from '../components/ui/Card';
import SeverityBadge from '../components/ui/SeverityBadge';
import Badge from '../components/ui/Badge';
import { fimEvents, FIMAction } from '../data';

const actionColors: Record<FIMAction, string> = {
  modified: '#f97316',
  created: '#10b981',
  deleted: '#ef4444',
  permission_changed: '#eab308',
  owner_changed: '#a78bfa',
};

export default function FIM() {
  const [events, setEvents] = useState(fimEvents);
  const [filter, setFilter] = useState<FIMAction | 'all'>('all');

  const acknowledge = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, acknowledged: true } : e));
  };

  const whitelist = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, whitelisted: true, acknowledged: true } : e));
  };

  const filtered = events.filter(e => filter === 'all' || e.action === filter);

  const counts = {
    total: events.length,
    critical: events.filter(e => e.severity === 'critical').length,
    unacked: events.filter(e => !e.acknowledged).length,
    whitelisted: events.filter(e => e.whitelisted).length,
  };

  const formatTs = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>File Integrity Monitoring</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
            Real-time detection of unauthorized file system changes
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <FileCheck size={14} />
          {counts.unacked} Unacknowledged
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Changes', value: counts.total, color: '#38bdf8' },
          { label: 'Critical Changes', value: counts.critical, color: '#ef4444' },
          { label: 'Needs Review', value: counts.unacked, color: '#f97316' },
          { label: 'Whitelisted', value: counts.whitelisted, color: '#10b981' },
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <span className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
            <span className="text-xs" style={{ color: 'hsl(215,15%,45%)' }}>{s.label}</span>
          </Card>
        ))}
      </div>

      {/* Action filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'modified', 'created', 'deleted', 'permission_changed', 'owner_changed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: filter === f ? (f === 'all' ? 'rgba(16,185,129,0.15)' : `${actionColors[f]}15`) : 'hsl(222,33%,14%)',
              color: filter === f ? (f === 'all' ? '#10b981' : actionColors[f]) : 'hsl(215,15%,50%)',
              border: `1px solid ${filter === f ? (f === 'all' ? 'rgba(16,185,129,0.3)' : `${actionColors[f]}40`) : 'hsl(222,22%,20%)'}`,
            }}
          >{f === 'all' ? 'All Actions' : f.replace('_', ' ')}</button>
        ))}
      </div>

      {/* FIM Events */}
      <div className="space-y-3">
        {filtered.map(evt => (
          <Card
            key={evt.id}
            className={`overflow-hidden ${evt.whitelisted ? 'opacity-50' : ''}`}
          >
            <div className="p-4 space-y-3" style={{ borderLeft: `3px solid ${actionColors[evt.action]}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <SeverityBadge severity={evt.severity} size="sm" />
                  <Badge color={actionColors[evt.action]} className="text-[10px] capitalize flex-shrink-0">
                    {evt.action.replace('_', ' ')}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-semibold truncate" style={{ color: '#f1f5f9' }}>{evt.path}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs flex-wrap" style={{ color: 'hsl(215,15%,45%)' }}>
                      <span>Host: <strong style={{ color: '#38bdf8' }}>{evt.host}</strong></span>
                      <span>User: <strong style={{ color: '#a78bfa' }}>{evt.user}</strong></span>
                      <span>{formatTs(evt.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {evt.whitelisted ? (
                    <Badge color="#6b7280">Whitelisted</Badge>
                  ) : evt.acknowledged ? (
                    <Badge color="#10b981">Acknowledged</Badge>
                  ) : (
                    <>
                      <button
                        onClick={() => acknowledge(evt.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
                      >
                        <CheckCircle size={12} /> Acknowledge
                      </button>
                      <button
                        onClick={() => whitelist(evt.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs"
                        style={{ background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.3)', color: '#9ca3af' }}
                      >
                        <ShieldOff size={12} /> Whitelist
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Hash diff */}
              {(evt.oldHash || evt.newHash) && (
                <div className="grid grid-cols-2 gap-3">
                  {evt.oldHash && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'hsl(215,15%,40%)' }}>Previous MD5</div>
                      <div className="font-mono text-xs px-2 py-1.5 rounded" style={{ background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.15)' }}>
                        {evt.oldHash}
                      </div>
                    </div>
                  )}
                  {evt.newHash && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'hsl(215,15%,40%)' }}>Current MD5</div>
                      <div className="font-mono text-xs px-2 py-1.5 rounded" style={{ background: 'rgba(16,185,129,0.08)', color: '#86efac', border: '1px solid rgba(16,185,129,0.15)' }}>
                        {evt.newHash}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Permissions */}
              {(evt.oldPermissions || evt.newPermissions) && (
                <div className="flex items-center gap-4 text-xs font-mono">
                  {evt.oldPermissions && (
                    <div><span style={{ color: 'hsl(215,15%,40%)' }}>Before: </span><span style={{ color: '#fca5a5' }}>{evt.oldPermissions}</span></div>
                  )}
                  {evt.newPermissions && (
                    <div><span style={{ color: 'hsl(215,15%,40%)' }}>After: </span><span style={{ color: '#86efac' }}>{evt.newPermissions}</span></div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
