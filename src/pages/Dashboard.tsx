import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ShieldAlert, Bell, Monitor, Globe, TrendingUp, Activity, Flame } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { timelineData, severityDist, securityEvents, alerts } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const statCards = [
  { label: 'Total Events (24h)', value: '3,847', change: '+12%', icon: ShieldAlert, color: '#00b4ff', glow: 'rgba(0,180,255,0.3)', bg: 'rgba(0,180,255,0.08)', border: 'rgba(0,180,255,0.25)', sub: 'vs yesterday' },
  { label: 'Active Alerts',      value: '23',    change: '+5',    icon: Bell,        color: '#ff2040', glow: 'rgba(255,32,64,0.3)',  bg: 'rgba(255,32,64,0.08)',  border: 'rgba(255,32,64,0.25)',  sub: 'require attention' },
  { label: 'Online Assets',      value: '11/12', change: '91.7%', icon: Monitor,     color: '#00ff88', glow: 'rgba(0,255,136,0.3)', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', sub: 'uptime' },
  { label: 'Threat Intel IOCs',  value: '12',    change: '10 active', icon: Globe,  color: '#ff8c3a', glow: 'rgba(255,140,58,0.3)', bg: 'rgba(255,140,58,0.08)', border: 'rgba(255,140,58,0.25)', sub: 'indicators tracked' },
];

const T = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <span style={{ color: 'var(--text-secondary)', ...style }}>{children}</span>
);

export function Dashboard() {
  const recentEvents = securityEvents.slice(0, 8);
  const openAlerts = alerts.filter(a => a.status === 'open' || a.status === 'acknowledged').slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* AI Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
        background: 'rgba(255,107,26,0.05)', border: '1px solid rgba(255,107,26,0.2)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 0 24px rgba(255,107,26,0.06)' }}>
        <Flame style={{ width: 18, height: 18, color: '#ff8c3a', flexShrink: 0,
          filter: 'drop-shadow(0 0 6px rgba(255,107,26,0.6))' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, color: '#ffb366', fontWeight: 600 }}>AI Threat Analysis Active — </span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>PhoenixSIEM AI detected 3 new correlated attack patterns in the last hour. Cobalt Strike C2 campaign targeting Finance workstations with 97% confidence.</span>
        </div>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,140,58,0.5)', flexShrink: 0 }}>just now</span>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ padding: 10, borderRadius: 10, background: card.bg, border: `1px solid ${card.border}`,
                  boxShadow: `0 0 12px ${card.glow}`, flexShrink: 0 }}>
                  <Icon style={{ width: 18, height: 18, color: card.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="hdr-number" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{card.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <TrendingUp style={{ width: 11, height: 11, color: '#00ff88' }} />
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#00ff88' }}>{card.change}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{card.sub}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 20 }}>
        {/* Timeline */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Event Timeline</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>Total vs Critical events — last 24 hours</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff88',
                  boxShadow: '0 0 6px rgba(0,255,136,0.8)', display: 'inline-block' }} className="animate-glow" />
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#00ff88', fontWeight: 700 }}>LIVE</span>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00b4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2040" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ff2040" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,45,74,0.6)" />
                <XAxis dataKey="hour" tick={{ fill: '#3d5a7a', fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: '#3d5a7a', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#08142a', border: '1px solid rgba(30,63,102,0.6)', borderRadius: 8, fontSize: 12, color: '#f0f6ff' }} labelStyle={{ color: '#8ba8c8' }} />
                <Area type="monotone" dataKey="total"    name="Total"    stroke="#00b4ff" strokeWidth={2} fill="url(#totalGrad)" />
                <Area type="monotone" dataKey="critical" name="Critical" stroke="#ff2040" strokeWidth={2} fill="url(#criticalGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Severity Donut */}
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Severity Distribution</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>Active alerts by severity</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={severityDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {severityDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#08142a', border: '1px solid rgba(30,63,102,0.6)', borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#8ba8c8', fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20 }}>
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Recent Events</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>Latest security events</p>
              </div>
              <Activity style={{ width: 15, height: 15, color: 'var(--text-muted)' }} />
            </div>
          </CardHeader>
          <div>
            {recentEvents.map((evt) => (
              <div key={evt.id} className="table-row-3d" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 20px' }}>
                <SeverityBadge severity={evt.severity} className="flex-shrink-0" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.description}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{evt.host}</span>
                    <span style={{ color: 'var(--text-muted)' }}>·</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatDistanceToNow(evt.timestamp, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Active Alerts</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>Open & acknowledged</p>
              </div>
              <Bell style={{ width: 15, height: 15, color: 'var(--text-muted)' }} />
            </div>
          </CardHeader>
          <div>
            {openAlerts.map((alert) => (
              <div key={alert.id} className="table-row-3d" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 20px' }}>
                <SeverityBadge severity={alert.severity} className="flex-shrink-0" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.title}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', padding: '1px 6px', borderRadius: 4,
                      background: alert.status === 'open' ? 'rgba(255,32,64,0.12)' : alert.status === 'acknowledged' ? 'rgba(255,215,0,0.12)' : 'rgba(0,180,255,0.12)',
                      color: alert.status === 'open' ? '#ff2040' : alert.status === 'acknowledged' ? '#ffd700' : '#00b4ff',
                      border: `1px solid ${alert.status === 'open' ? 'rgba(255,32,64,0.3)' : alert.status === 'acknowledged' ? 'rgba(255,215,0,0.3)' : 'rgba(0,180,255,0.3)'}`,
                    }}>{alert.status.toUpperCase()}</span>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{alert.mitreId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
