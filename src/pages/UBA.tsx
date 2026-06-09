import { useState } from 'react';
import { TrendingUp, MapPin } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { ubaEvents, UBAEvent, UBAStatus, UBAType } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const typeConfig: Record<UBAType, { label: string; color: string; icon: string }> = {
  impossible_travel: { label: 'Impossible Travel', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: '✈️' },
  unusual_login_time: { label: 'Unusual Login Time', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', icon: '🕐' },
  excessive_data_access: { label: 'Excessive Data Access', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', icon: '📊' },
  privilege_escalation: { label: 'Privilege Escalation', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: '⬆️' },
  after_hours: { label: 'After-Hours Activity', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: '🌙' },
  lateral_movement: { label: 'Lateral Movement', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30', icon: '↔️' },
  data_staging: { label: 'Data Staging', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', icon: '📦' },
};

const statusConfig: Record<UBAStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  investigating: { label: 'Investigating', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  resolved: { label: 'Resolved', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  false_positive: { label: 'False Positive', color: 'text-[#475569] bg-[#1a3050]/50 border-[#1a3050]' },
};

function RiskScore({ score }: { score: number }) {
  const color = score >= 90 ? 'text-red-400' : score >= 75 ? 'text-orange-400' : score >= 60 ? 'text-yellow-400' : 'text-green-400';
  // bg computed inline in svg
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-12 relative flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#1a3050" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke={score >= 90 ? '#ef4444' : score >= 75 ? '#f97316' : score >= 60 ? '#eab308' : '#22c55e'} strokeWidth="3" strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] font-bold ${color}`}>{score}</span>
        </div>
      </div>
    </div>
  );
}

export function UBA() {
  const [events, setEvents] = useState<UBAEvent[]>(ubaEvents);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<UBAStatus | 'all'>('all');

  const updateStatus = (id: string, status: UBAStatus) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const filtered = filterStatus === 'all' ? events : events.filter((e) => e.status === filterStatus);
  const sorted = [...filtered].sort((a, b) => b.riskScore - a.riskScore);

  // Top risky users
  const userRisks = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.username] = Math.max(acc[e.username] ?? 0, e.riskScore);
    return acc;
  }, {});
  const topUsers = Object.entries(userRisks).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Anomalies Detected', value: events.length, color: 'text-white' },
          { label: 'Open', value: events.filter((e) => e.status === 'open').length, color: 'text-red-400' },
          { label: 'High Risk (>80)', value: events.filter((e) => e.riskScore > 80).length, color: 'text-orange-400' },
          { label: 'Avg Risk Score', value: Math.round(events.reduce((s, e) => s + e.riskScore, 0) / events.length), color: 'text-yellow-400' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="py-4">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#475569] mt-1">{s.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Anomalies List */}
        <div className="xl:col-span-2 space-y-3">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'open', 'investigating', 'resolved', 'false_positive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'bg-[#0d1f35] text-[#94a3b8] border border-[#1a3050] hover:text-white'
                }`}
              >
                {s === 'all' ? 'All' : s === 'false_positive' ? 'False Positive' : statusConfig[s].label}
              </button>
            ))}
          </div>

          {sorted.map((evt) => {
            const { label: typeLabel, color: typeColor, icon } = typeConfig[evt.type];
            const isExp = expanded === evt.id;

            return (
              <Card key={evt.id} className={`${evt.riskScore >= 90 ? 'border-red-500/30' : ''} transition-colors`}>
                <div
                  className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[#0a1628] rounded-xl transition-colors"
                  onClick={() => setExpanded(isExp ? null : evt.id)}
                >
                  <RiskScore score={evt.riskScore} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${typeColor}`}>
                            {icon} {typeLabel}
                          </span>
                          <span className="text-sm font-semibold text-white">{evt.username}</span>
                          <span className="text-[10px] text-[#475569]">{evt.department}</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] mt-1">{evt.description}</p>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-1 rounded border ${statusConfig[evt.status].color} flex-shrink-0`}>
                        {statusConfig[evt.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-mono text-[#475569]">{evt.affectedHost}</span>
                      <span className="text-[#1a3050]">·</span>
                      <span className="text-[10px] text-[#475569]">{formatDistanceToNow(evt.timestamp, { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {isExp && (
                  <div className="border-t border-[#1a3050] px-5 py-4 bg-[#080f1e] rounded-b-xl space-y-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-1">Details</div>
                      <p className="text-xs text-[#94a3b8]">{evt.details}</p>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-2">Update Status</div>
                      <div className="flex gap-2 flex-wrap">
                        {(['open', 'investigating', 'resolved', 'false_positive'] as UBAStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={(e) => { e.stopPropagation(); updateStatus(evt.id, s); }}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-colors ${
                              evt.status === s ? statusConfig[s].color : 'border-[#1a3050] text-[#475569] hover:text-white'
                            }`}
                          >
                            {s === 'false_positive' ? 'False Positive' : statusConfig[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Top Risky Users Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Top Risk Users</h3>
              </div>
            </CardHeader>
            <div className="divide-y divide-[#0a1628]">
              {topUsers.map(([user, score], i) => {
                const scoreColor = score >= 90 ? 'text-red-400' : score >= 75 ? 'text-orange-400' : 'text-yellow-400';
                const bar = score >= 90 ? 'bg-red-500' : score >= 75 ? 'bg-orange-500' : 'bg-yellow-500';
                return (
                  <div key={user} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-[10px] font-mono text-[#475569] w-4">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono text-white">{user}</div>
                      <div className="mt-1 h-1 bg-[#1a3050] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                    <span className={`text-sm font-bold font-mono ${scoreColor}`}>{score}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Anomaly Types</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {Object.entries(typeConfig).map(([type, cfg]) => {
                  const count = events.filter((e) => e.type === type).length;
                  if (count === 0) return null;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-xs text-[#94a3b8]">{cfg.icon} {cfg.label}</span>
                      <span className="text-xs font-mono text-white">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
