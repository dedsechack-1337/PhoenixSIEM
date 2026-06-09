import { useState } from 'react';
import { FolderSearch, CheckCircle, XCircle, AlertTriangle, Plus, Minus, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { fimEvents, FIMEvent, FIMChangeType } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const changeTypeConfig: Record<FIMChangeType, { icon: typeof Plus; color: string; label: string }> = {
  created: { icon: Plus, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: 'Created' },
  modified: { icon: Edit, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', label: 'Modified' },
  deleted: { icon: Trash2, color: 'text-red-400 bg-red-500/10 border-red-500/30', label: 'Deleted' },
  permission_changed: { icon: AlertTriangle, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', label: 'Perm Changed' },
  owner_changed: { icon: AlertTriangle, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', label: 'Owner Changed' },
};

export function FIM() {
  const [events, setEvents] = useState<FIMEvent[]>(fimEvents);
  const [expanded, setExpanded] = useState<string | null>(null);

  const acknowledge = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, acknowledged: true } : e)));
  };

  const whitelist = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, whitelisted: true, acknowledged: true } : e)));
  };

  const unacknowledged = events.filter((e) => !e.acknowledged).length;
  const critical = events.filter((e) => e.severity === 'critical').length;
  const whitelisted = events.filter((e) => e.whitelisted).length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, color: 'text-white' },
          { label: 'Unacknowledged', value: unacknowledged, color: 'text-red-400' },
          { label: 'Critical Changes', value: critical, color: 'text-orange-400' },
          { label: 'Whitelisted', value: whitelisted, color: 'text-green-400' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="py-4">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#475569] mt-1">{s.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Critical Paths Banner */}
      <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">Critical Path Monitoring</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['/etc/passwd', '/etc/sudoers', '/etc/ssh/sshd_config', '/root/.ssh/', 'C:\\Windows\\System32\\', 'C:\\Users\\*\\Startup\\'].map((p) => (
            <span key={p} className="font-mono text-[11px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-300">{p}</span>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">File Integrity Events</h3>
              <p className="text-xs text-[#475569] mt-0.5">Real-time file system change detection</p>
            </div>
            <FolderSearch className="w-4 h-4 text-[#475569]" />
          </div>
        </CardHeader>
        <div className="divide-y divide-[#0a1628]">
          {events.map((evt) => {
            const { icon: ChangeIcon, color, label } = changeTypeConfig[evt.changeType];
            const isExpanded = expanded === evt.id;

            return (
              <div key={evt.id} className={`transition-colors ${evt.whitelisted ? 'opacity-50' : ''}`}>
                <div
                  className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-[#0a1628]"
                  onClick={() => setExpanded(isExpanded ? null : evt.id)}
                >
                  <SeverityBadge severity={evt.severity} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-xs text-white">{evt.path}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-medium ${color}`}>
                            <ChangeIcon className="w-3 h-3" />
                            {label}
                          </span>
                          <span className="text-[10px] font-mono text-[#94a3b8]">{evt.host}</span>
                          <span className="text-[#1a3050]">·</span>
                          <span className="text-[10px] text-[#475569]">user: {evt.user}</span>
                          <span className="text-[#1a3050]">·</span>
                          <span className="text-[10px] text-[#475569]">{formatDistanceToNow(evt.timestamp, { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {evt.whitelisted ? (
                          <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded font-mono">WHITELISTED</span>
                        ) : evt.acknowledged ? (
                          <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded font-mono">ACK</span>
                        ) : (
                          <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded font-mono animate-pulse">NEW</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-[#080f1e] border-t border-[#1a3050] px-5 py-4 space-y-3">
                    {/* Hash Diff */}
                    {(evt.hashOld || evt.hashNew) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {evt.hashOld && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Minus className="w-3 h-3 text-red-400" />
                              <span className="text-[10px] uppercase text-[#475569] tracking-wider">MD5 Before</span>
                            </div>
                            <div className="font-mono text-xs text-red-300 bg-red-500/5 border border-red-500/20 rounded px-3 py-2 break-all">{evt.hashOld}</div>
                          </div>
                        )}
                        {evt.hashNew && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Plus className="w-3 h-3 text-green-400" />
                              <span className="text-[10px] uppercase text-[#475569] tracking-wider">MD5 After</span>
                            </div>
                            <div className="font-mono text-xs text-green-300 bg-green-500/5 border border-green-500/20 rounded px-3 py-2 break-all">{evt.hashNew}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {!evt.whitelisted && (
                      <div className="flex gap-2">
                        {!evt.acknowledged && (
                          <button
                            onClick={(e) => { e.stopPropagation(); acknowledge(evt.id); }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Acknowledge
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); whitelist(evt.id); }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs hover:bg-green-500/20 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Whitelist Path
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
