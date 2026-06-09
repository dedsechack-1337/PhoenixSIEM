import { useState } from 'react';
import { Users, MapPin, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import SeverityBadge from '../components/ui/SeverityBadge';
import Badge from '../components/ui/Badge';
import { ubaEvents, UBAType, UBAStatus } from '../data';

const typeConfig: Record<UBAType, { label: string; color: string; icon: any }> = {
  impossible_travel:     { label: 'Impossible Travel',    color: '#ef4444', icon: MapPin },
  unusual_login_time:    { label: 'Unusual Login Time',   color: '#f97316', icon: Clock },
  excessive_data_access: { label: 'Excessive Data Access', color: '#eab308', icon: TrendingUp },
  privilege_escalation:  { label: 'Privilege Escalation', color: '#a78bfa', icon: AlertTriangle },
  lateral_movement:      { label: 'Lateral Movement',     color: '#ec4899', icon: Users },
  after_hours:           { label: 'After-Hours Activity', color: '#38bdf8', icon: Clock },
  data_staging:          { label: 'Data Staging',         color: '#f97316', icon: TrendingUp },
};

const statusColors: Record<UBAStatus, string> = {
  open: '#ef4444', investigating: '#f97316', resolved: '#10b981', false_positive: '#6b7280',
};

const riskColor = (score: number) => {
  if (score >= 90) return '#ef4444';
  if (score >= 70) return '#f97316';
  if (score >= 50) return '#eab308';
  return '#10b981';
};

// Top risky users from UBA events
const userRisk = () => {
  const map: Record<string, { user: string; dept: string; score: number; events: number }> = {};
  ubaEvents.forEach(e => {
    if (!map[e.userId]) map[e.userId] = { user: e.user, dept: e.department, score: 0, events: 0 };
    map[e.userId].score = Math.max(map[e.userId].score, e.riskScore);
    map[e.userId].events++;
  });
  return Object.values(map).sort((a, b) => b.score - a.score);
};

export default function UBA() {
  const [events, setEvents] = useState(ubaEvents);
  const [typeFilter, setTypeFilter] = useState<UBAType | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const riskyUsers = userRisk();

  const updateStatus = (id: string, status: UBAStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const filtered = events.filter(e => typeFilter === 'all' || e.type === typeFilter);

  const formatTs = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>User Behavior Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
          {events.filter(e => e.status === 'open').length} open anomalies · {events.filter(e => e.riskScore >= 90).length} critical risk users
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main anomalies panel */}
        <div className="col-span-2 space-y-4">
          {/* Type filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter('all')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: typeFilter === 'all' ? 'rgba(16,185,129,0.15)' : 'hsl(222,33%,14%)',
                color: typeFilter === 'all' ? '#10b981' : 'hsl(215,15%,50%)',
                border: `1px solid ${typeFilter === 'all' ? 'rgba(16,185,129,0.3)' : 'hsl(222,22%,20%)'}`,
              }}
            >All Types</button>
            {Object.entries(typeConfig).map(([key, cfg]) => {
              const count = events.filter(e => e.type === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setTypeFilter(key as UBAType)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: typeFilter === key ? `${cfg.color}15` : 'hsl(222,33%,14%)',
                    color: typeFilter === key ? cfg.color : 'hsl(215,15%,50%)',
                    border: `1px solid ${typeFilter === key ? `${cfg.color}40` : 'hsl(222,22%,20%)'}`,
                  }}
                >
                  {cfg.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Anomaly list */}
          <div className="space-y-3">
            {filtered.map(evt => {
              const cfg = typeConfig[evt.type];
              const TypeIcon = cfg.icon;
              const isExp = expanded === evt.id;
              return (
                <Card key={evt.id} className="overflow-hidden">
                  <div
                    className="p-4 cursor-pointer"
                    style={{ borderLeft: `3px solid ${cfg.color}` }}
                    onClick={() => setExpanded(isExp ? null : evt.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cfg.color}15` }}>
                        <TypeIcon size={16} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <SeverityBadge severity={evt.severity} size="sm" />
                          <Badge color={cfg.color} className="text-[10px]">{cfg.label}</Badge>
                          <Badge color={statusColors[evt.status]} className="text-[10px]">{evt.status.replace('_', ' ')}</Badge>
                        </div>
                        <div className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{evt.description}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs flex-wrap" style={{ color: 'hsl(215,15%,45%)' }}>
                          <span style={{ color: '#38bdf8' }}>{evt.user}</span>
                          <span>•</span>
                          <span>{evt.department}</span>
                          <span>•</span>
                          <span>{formatTs(evt.timestamp)}</span>
                          {evt.sourceIp && <><span>•</span><span className="font-mono">{evt.sourceIp}</span></>}
                          {evt.location && <><span>•</span><span>{evt.location}</span></>}
                        </div>

                        {isExp && (
                          <div className="mt-3 space-y-3" onClick={e => e.stopPropagation()}>
                            <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,16%)', color: '#94a3b8' }}>
                              {evt.details}
                            </div>
                            {evt.previousLocation && (
                              <div className="flex items-center gap-2 text-xs">
                                <span style={{ color: 'hsl(215,15%,45%)' }}>Travel:</span>
                                <span style={{ color: '#10b981' }}>{evt.previousLocation}</span>
                                <span style={{ color: 'hsl(215,15%,45%)' }}>→</span>
                                <span style={{ color: '#ef4444' }}>{evt.location}</span>
                                {evt.timeBetween && <Badge color="#ef4444">in {evt.timeBetween}</Badge>}
                              </div>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs" style={{ color: 'hsl(215,15%,40%)' }}>Actions:</span>
                              {(['investigating', 'resolved', 'false_positive'] as UBAStatus[]).filter(s => s !== evt.status).map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateStatus(evt.id, s)}
                                  className="px-2.5 py-1 rounded text-xs"
                                  style={{ background: `${statusColors[s]}15`, color: statusColors[s], border: `1px solid ${statusColors[s]}30` }}
                                >→ {s.replace('_', ' ')}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Risk score */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ border: `2px solid ${riskColor(evt.riskScore)}`, background: `${riskColor(evt.riskScore)}10` }}
                        >
                          <span className="font-mono font-bold text-sm" style={{ color: riskColor(evt.riskScore) }}>{evt.riskScore}</span>
                        </div>
                        <span className="text-[9px]" style={{ color: 'hsl(215,15%,40%)' }}>RISK</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Top Risky Users sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
              <TrendingUp size={14} style={{ color: '#ef4444' }} />
              Top Risky Users
            </h3>
            <div className="space-y-3">
              {riskyUsers.slice(0, 8).map((user, i) => (
                <div key={user.user} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0"
                    style={{ background: i < 3 ? `${riskColor(user.score)}15` : 'hsl(222,22%,20%)', color: i < 3 ? riskColor(user.score) : 'hsl(215,15%,45%)' }}
                  >#{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: '#f1f5f9' }}>{user.user}</div>
                    <div className="text-[10px]" style={{ color: 'hsl(215,15%,40%)' }}>{user.dept} · {user.events} anomal{user.events !== 1 ? 'ies' : 'y'}</div>
                    <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'hsl(222,22%,20%)' }}>
                      <div className="h-full rounded-full" style={{ width: `${user.score}%`, background: riskColor(user.score) }} />
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm flex-shrink-0" style={{ color: riskColor(user.score) }}>{user.score}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Anomaly type breakdown */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3" style={{ color: '#f1f5f9' }}>Anomaly Types</h3>
            <div className="space-y-2">
              {Object.entries(typeConfig).map(([key, cfg]) => {
                const count = events.filter(e => e.type === key).length;
                return (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                    <span className="flex-1" style={{ color: 'hsl(215,20%,60%)' }}>{cfg.label}</span>
                    <span className="font-mono font-bold" style={{ color: cfg.color }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
