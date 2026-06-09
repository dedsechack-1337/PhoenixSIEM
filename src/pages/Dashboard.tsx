import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Activity, AlertTriangle, Server, Database, TrendingUp, Clock, Eye
} from 'lucide-react';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import SeverityBadge from '../components/ui/SeverityBadge';
import {
  securityEvents, alerts, assets, threatIntel,
  timelineData, getSeverityDistribution
} from '../data';

const openAlerts = alerts.filter(a => a.status === 'open' || a.status === 'investigating').length;
const onlineAssets = assets.filter(a => a.status === 'online').length;
const activeIOCs = threatIntel.filter(t => t.active).length;
const criticalEvents = securityEvents.filter(e => e.severity === 'critical').length;

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return value > 0 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {value}
    </text>
  ) : null;
};

export default function Dashboard() {
  const [ticker, setTicker] = useState(0);
  const recentEvents = securityEvents.slice(0, 8 + ticker % 3);
  const sevDist = getSeverityDistribution();

  useEffect(() => {
    const id = setInterval(() => setTicker(t => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Security Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
            Real-time security monitoring • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
          <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#10b981' }} />
          LIVE
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Events (24h)"
          value={securityEvents.length.toLocaleString()}
          icon={<Activity size={20} />}
          color="#38bdf8"
          delta="12% from yesterday"
          deltaUp={true}
        />
        <StatCard
          title="Active Alerts"
          value={openAlerts}
          icon={<AlertTriangle size={20} />}
          color="#ef4444"
          delta="3 new in last hour"
          deltaUp={false}
        />
        <StatCard
          title="Online Assets"
          value={`${onlineAssets}/${assets.length}`}
          icon={<Server size={20} />}
          color="#10b981"
          subtitle="2 warning, 1 offline"
        />
        <StatCard
          title="Threat Intel IOCs"
          value={activeIOCs}
          icon={<Database size={20} />}
          color="#a78bfa"
          delta="2 new today"
          deltaUp={false}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <TrendingUp size={18} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono" style={{ color: '#ef4444' }}>{criticalEvents}</p>
            <p className="text-xs" style={{ color: 'hsl(215,15%,45%)' }}>Critical Events Today</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <Clock size={18} style={{ color: '#10b981' }} />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono" style={{ color: '#10b981' }}>4.2m</p>
            <p className="text-xs" style={{ color: 'hsl(215,15%,45%)' }}>Avg. Detection Time (MTTD)</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.15)' }}>
            <Eye size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono" style={{ color: '#38bdf8' }}>99.8%</p>
            <p className="text-xs" style={{ color: 'hsl(215,15%,45%)' }}>Sensor Coverage</p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Timeline Chart */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold" style={{ color: '#f1f5f9' }}>Event Timeline</h2>
              <p className="text-xs" style={{ color: 'hsl(215,15%,45%)' }}>Total vs Critical events over 24h</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: '#38bdf8' }} />
                <span style={{ color: 'hsl(215,20%,60%)' }}>Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: '#ef4444' }} />
                <span style={{ color: 'hsl(215,20%,60%)' }}>Critical</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215,15%,40%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,40%)' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(222,35%,12%)', border: '1px solid hsl(222,25%,20%)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#f1f5f9' }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="total" stroke="#38bdf8" fill="url(#totalGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#critGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Severity Donut */}
        <Card className="p-5">
          <h2 className="font-semibold mb-1" style={{ color: '#f1f5f9' }}>Severity Distribution</h2>
          <p className="text-xs mb-3" style={{ color: 'hsl(215,15%,45%)' }}>Events by severity level</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={sevDist}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {sevDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {sevDist.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.fill }} />
                  <span style={{ color: 'hsl(215,20%,60%)' }}>{s.name}</span>
                </div>
                <span className="font-mono font-semibold" style={{ color: '#f1f5f9' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: '#f1f5f9' }}>Recent Events</h2>
          <span className="text-xs font-mono" style={{ color: '#10b981' }}>AUTO-REFRESHING</span>
        </div>
        <div className="space-y-2">
          {recentEvents.map(evt => (
            <div
              key={evt.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs"
              style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,16%)' }}
            >
              <SeverityBadge severity={evt.severity} size="sm" />
              <span className="font-mono" style={{ color: 'hsl(215,15%,45%)', flexShrink: 0 }}>
                {formatTime(evt.timestamp)}
              </span>
              <span className="font-medium" style={{ color: '#cbd5e1', flexShrink: 0 }}>{evt.type}</span>
              <span className="flex-1 truncate" style={{ color: 'hsl(215,15%,45%)' }}>{evt.description}</span>
              <span className="font-mono text-[10px]" style={{ color: 'hsl(215,15%,38%)', flexShrink: 0 }}>{evt.sourceIp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
