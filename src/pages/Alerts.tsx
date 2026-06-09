import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, User, MessageSquare } from 'lucide-react';
import Card from '../components/ui/Card';
import SeverityBadge from '../components/ui/SeverityBadge';
import Badge from '../components/ui/Badge';
import { alerts, AlertStatus, statusColors } from '../data';

const statusLabels: Record<AlertStatus, string> = {
  open: 'Open',
  acknowledged: 'Acknowledged',
  investigating: 'Investigating',
  resolved: 'Resolved',
  closed: 'Closed',
};

const statusOrder: AlertStatus[] = ['open', 'acknowledged', 'investigating', 'resolved', 'closed'];

export default function Alerts() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [localAlerts, setLocalAlerts] = useState(alerts);

  const filtered = localAlerts.filter(a =>
    statusFilter === 'all' || a.status === statusFilter
  );

  const counts = statusOrder.reduce((acc, s) => {
    acc[s] = localAlerts.filter(a => a.status === s).length;
    return acc;
  }, {} as Record<AlertStatus, number>);

  const updateStatus = (id: string, status: AlertStatus) => {
    setLocalAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const formatTs = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Correlated Alerts</h1>
        <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
          {localAlerts.filter(a => a.status === 'open').length} open • {localAlerts.filter(a => a.status === 'investigating').length} investigating
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          style={{
            background: statusFilter === 'all' ? 'rgba(16,185,129,0.15)' : 'transparent',
            color: statusFilter === 'all' ? '#10b981' : 'hsl(215,15%,50%)',
            border: `1px solid ${statusFilter === 'all' ? 'rgba(16,185,129,0.3)' : 'hsl(222,22%,20%)'}`,
          }}
        >
          All ({localAlerts.length})
        </button>
        {statusOrder.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: statusFilter === s ? `${statusColors[s]}20` : 'transparent',
              color: statusFilter === s ? statusColors[s] : 'hsl(215,15%,50%)',
              border: `1px solid ${statusFilter === s ? `${statusColors[s]}40` : 'hsl(222,22%,20%)'}`,
            }}
          >
            {statusLabels[s]} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map(alert => (
          <Card key={alert.id} className="overflow-hidden">
            {/* Alert row */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:opacity-90"
              style={{ borderLeft: `3px solid ${statusColors[alert.status]}` }}
              onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}
            >
              <SeverityBadge severity={alert.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{alert.title}</span>
                  <Badge color={statusColors[alert.status]}>{statusLabels[alert.status]}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap text-xs" style={{ color: 'hsl(215,15%,45%)' }}>
                  <span className="font-mono" style={{ color: '#a78bfa' }}>{alert.mitreId}</span>
                  <span>•</span>
                  <span>{alert.mitreTactic} → {alert.mitreTechnique}</span>
                  <span>•</span>
                  <span>{alert.events} events</span>
                  <span>•</span>
                  <span>{alert.asset}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 text-xs" style={{ color: 'hsl(215,15%,40%)' }}>
                <div>{formatTs(alert.createdAt)}</div>
                {alert.assignee && (
                  <div className="flex items-center gap-1 mt-1 justify-end" style={{ color: '#10b981' }}>
                    <User size={10} />
                    {alert.assignee}
                  </div>
                )}
              </div>
              {expanded === alert.id ? <ChevronUp size={16} style={{ color: 'hsl(215,15%,40%)', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: 'hsl(215,15%,40%)', flexShrink: 0 }} />}
            </div>

            {/* Expanded detail */}
            {expanded === alert.id && (
              <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid hsl(222,22%,16%)' }}>
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(215,15%,40%)' }}>Description</p>
                    <p className="text-sm" style={{ color: '#cbd5e1' }}>{alert.description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(215,15%,40%)' }}>IOCs Detected</p>
                    <div className="space-y-1">
                      {alert.iocs.map(ioc => (
                        <div key={ioc} className="font-mono text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                          {ioc}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {alert.notes && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(215,15%,40%)' }}>
                      <MessageSquare size={10} className="inline mr-1" />Investigation Notes
                    </p>
                    <div className="text-sm px-3 py-2 rounded-lg" style={{ background: 'hsl(222,40%,9%)', color: '#94a3b8', border: '1px solid hsl(222,22%,16%)' }}>
                      {alert.notes}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs" style={{ color: 'hsl(215,15%,40%)' }}>Change status:</span>
                  {statusOrder.filter(s => s !== alert.status).map(s => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); updateStatus(alert.id, s); }}
                      className="px-3 py-1 rounded text-xs font-medium"
                      style={{ background: `${statusColors[s]}15`, color: statusColors[s], border: `1px solid ${statusColors[s]}30` }}
                    >
                      → {statusLabels[s]}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <button className="flex items-center gap-1.5 px-3 py-1 rounded text-xs" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                    <ExternalLink size={11} /> View in Event Log
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
