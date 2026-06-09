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
  { label: 'Total Events (24h)', value: '3,847', change: '+12%', icon: ShieldAlert, color: 'blue', sub: 'vs yesterday' },
  { label: 'Active Alerts', value: '23', change: '+5', icon: Bell, color: 'red', sub: 'require attention' },
  { label: 'Online Assets', value: '11/12', change: '91.7%', icon: Monitor, color: 'green', sub: 'uptime' },
  { label: 'Threat Intel IOCs', value: '12', change: '10 active', icon: Globe, color: 'orange', sub: 'indicators tracked' },
];

const colorMap: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  red: 'text-red-400 bg-red-500/15 border-red-500/30',
  green: 'text-green-400 bg-green-500/15 border-green-500/30',
  orange: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
};

export function Dashboard() {
  const recentEvents = securityEvents.slice(0, 8);
  const openAlerts = alerts.filter(a => a.status === 'open' || a.status === 'acknowledged').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* AI Banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-500/30 bg-orange-500/5">
        <Flame className="w-5 h-5 text-orange-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm text-orange-300 font-medium">AI Threat Analysis Active — </span>
          <span className="text-sm text-[#94a3b8]">PhoenixSIEM AI detected 3 new correlated attack patterns in the last hour. Cobalt Strike C2 campaign targeting Finance workstations with 97% confidence.</span>
        </div>
        <span className="text-xs font-mono text-orange-400/60 flex-shrink-0">just now</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="hover:border-orange-500/30 transition-colors">
              <CardBody className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg border ${colorMap[card.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-white">{card.value}</div>
                  <div className="text-xs text-[#475569] mt-0.5">{card.label}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-[11px] text-green-400 font-mono">{card.change}</span>
                    <span className="text-[11px] text-[#475569]">{card.sub}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Timeline */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Event Timeline</h3>
                <p className="text-xs text-[#475569] mt-0.5">Total vs Critical events — last 24 hours</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
                </span>
                <span className="text-[11px] text-orange-400 font-mono">LIVE</span>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" />
                <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#0d1f35', border: '1px solid #1a3050', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="total" name="Total" stroke="#3b82f6" strokeWidth={2} fill="url(#totalGrad)" />
                <Area type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" strokeWidth={2} fill="url(#criticalGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Severity Donut */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-white">Severity Distribution</h3>
            <p className="text-xs text-[#475569] mt-0.5">Active alerts by severity</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={severityDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {severityDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0d1f35', border: '1px solid #1a3050', borderRadius: 8, fontSize: 12 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Recent Events</h3>
                <p className="text-xs text-[#475569] mt-0.5">Latest security events</p>
              </div>
              <Activity className="w-4 h-4 text-[#475569]" />
            </div>
          </CardHeader>
          <div className="divide-y divide-[#1a3050]">
            {recentEvents.map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[#0a1628] transition-colors">
                <SeverityBadge severity={evt.severity} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white truncate">{evt.description}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-[#475569]">{evt.host}</span>
                    <span className="text-[#1a3050]">·</span>
                    <span className="text-[10px] text-[#475569]">{formatDistanceToNow(evt.timestamp, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
                <p className="text-xs text-[#475569] mt-0.5">Open & acknowledged alerts</p>
              </div>
              <Bell className="w-4 h-4 text-[#475569]" />
            </div>
          </CardHeader>
          <div className="divide-y divide-[#1a3050]">
            {openAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[#0a1628] transition-colors">
                <SeverityBadge severity={alert.severity} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white truncate">{alert.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      alert.status === 'open' ? 'bg-red-500/20 text-red-400' :
                      alert.status === 'acknowledged' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>{alert.status.toUpperCase()}</span>
                    <span className="text-[10px] font-mono text-[#475569]">{alert.mitreId}</span>
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
