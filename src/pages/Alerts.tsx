import { useState } from 'react';
import { Bell, ChevronDown, ChevronUp, User, MessageSquare, CheckCircle, Clock, AlertCircle, XCircle, Search } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { alerts, Alert, AlertStatus } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<AlertStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  open: { label: 'Open', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: AlertCircle },
  acknowledged: { label: 'Acknowledged', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', icon: Bell },
  investigating: { label: 'Investigating', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: Search },
  resolved: { label: 'Resolved', color: 'text-green-400 bg-green-500/10 border-green-500/30', icon: CheckCircle },
  closed: { label: 'Closed', color: 'text-[#475569] bg-[#1a3050]/50 border-[#1a3050]', icon: XCircle },
};

export function Alerts() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);
  const [filterStatus, setFilterStatus] = useState<AlertStatus | 'all'>('all');
  const [newNote, setNewNote] = useState<Record<string, string>>({});

  const filtered = filterStatus === 'all' ? localAlerts : localAlerts.filter((a) => a.status === filterStatus);

  const updateStatus = (id: string, status: AlertStatus) => {
    setLocalAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const addNote = (id: string) => {
    const note = newNote[id]?.trim();
    if (!note) return;
    setLocalAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, notes: [...a.notes, note] } : a)));
    setNewNote((prev) => ({ ...prev, [id]: '' }));
  };

  const counts = {
    open: localAlerts.filter((a) => a.status === 'open').length,
    investigating: localAlerts.filter((a) => a.status === 'investigating').length,
    resolved: localAlerts.filter((a) => a.status === 'resolved').length,
    closed: localAlerts.filter((a) => a.status === 'closed').length,
  };

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open', count: counts.open, color: 'text-red-400' },
          { label: 'Investigating', count: counts.investigating, color: 'text-blue-400' },
          { label: 'Resolved', count: counts.resolved, color: 'text-green-400' },
          { label: 'Closed', count: counts.closed, color: 'text-[#475569]' },
        ].map((item) => (
          <Card key={item.label} className="hover:border-orange-500/30 transition-colors">
            <CardBody className="py-4">
              <div className={`text-3xl font-bold ${item.color}`}>{item.count}</div>
              <div className="text-xs text-[#475569] mt-1">{item.label} Alerts</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'open', 'acknowledged', 'investigating', 'resolved', 'closed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === s
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'bg-[#0d1f35] text-[#94a3b8] border border-[#1a3050] hover:text-white'
            }`}
          >
            {s === 'all' ? 'All Alerts' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const StatusIcon = statusConfig[alert.status].icon;
          const isOpen = expandedId === alert.id;

          return (
            <Card key={alert.id} className={`transition-colors ${alert.severity === 'critical' && alert.status === 'open' ? 'border-red-500/30' : ''}`}>
              <div
                className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[#0a1628] transition-colors rounded-t-xl"
                onClick={() => setExpandedId(isOpen ? null : alert.id)}
              >
                <SeverityBadge severity={alert.severity} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                      <p className="text-xs text-[#94a3b8] mt-1 line-clamp-1">{alert.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-mono font-medium ${statusConfig[alert.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[alert.status].label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">{alert.mitreId}</span>
                    <span className="text-[10px] text-[#475569]">{alert.mitre}</span>
                    <span className="text-[#1a3050]">·</span>
                    <span className="text-[10px] text-[#475569] font-mono">{alert.eventCount} events</span>
                    {alert.assignee && (
                      <>
                        <span className="text-[#1a3050]">·</span>
                        <span className="flex items-center gap-1 text-[10px] text-[#475569]">
                          <User className="w-3 h-3" /> {alert.assignee}
                        </span>
                      </>
                    )}
                    <span className="text-[#1a3050]">·</span>
                    <span className="text-[10px] text-[#475569]">{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#475569] ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 text-[#475569] ml-auto" />}
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-[#1a3050] px-5 py-4 bg-[#080f1e] rounded-b-xl space-y-4">
                  {/* Hosts */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-2">Affected Hosts</div>
                    <div className="flex gap-2 flex-wrap">
                      {alert.affectedHosts.map((h) => (
                        <span key={h} className="font-mono text-xs text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">{h}</span>
                      ))}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-2">Update Status</div>
                    <div className="flex gap-2 flex-wrap">
                      {(['open', 'acknowledged', 'investigating', 'resolved', 'closed'] as AlertStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={(e) => { e.stopPropagation(); updateStatus(alert.id, s); }}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-colors ${
                            alert.status === s
                              ? statusConfig[s].color
                              : 'border-[#1a3050] text-[#475569] hover:text-white hover:border-[#1a3050]'
                          }`}
                        >
                          {statusConfig[s].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" /> Investigation Notes
                    </div>
                    {alert.notes.length > 0 ? (
                      <div className="space-y-2 mb-3">
                        {alert.notes.map((note, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Clock className="w-3 h-3 text-[#475569] mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-[#94a3b8]">{note}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-[#475569] mb-3">No notes yet</div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add investigation note..."
                        value={newNote[alert.id] || ''}
                        onChange={(e) => setNewNote((prev) => ({ ...prev, [alert.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && addNote(alert.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-3 py-2 bg-[#050d1a] border border-[#1a3050] rounded-lg text-xs text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50"
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); addNote(alert.id); }}
                        className="px-3 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30 transition-colors"
                      >
                        Add
                      </button>
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
