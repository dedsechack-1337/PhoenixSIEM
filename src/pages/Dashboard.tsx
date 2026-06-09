import React from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Activity, AlertTriangle, Monitor, Globe, Shield, Zap } from "lucide-react";
import { Layout } from "../components/Layout";
import { StatCard } from "../components/ui/StatCard";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { LiveDot } from "../components/ui/LiveDot";
import {
  dashboardStats, timelineData, securityEvents,
  alerts
} from "../data/mockData";
import { format } from "date-fns";

const SEVERITY_PIE = [
  { name: "Critical", value: dashboardStats.criticalEvents, color: "hsl(0,85%,60%)" },
  { name: "High", value: dashboardStats.highEvents, color: "hsl(25,95%,55%)" },
  { name: "Medium", value: dashboardStats.mediumEvents, color: "hsl(45,95%,55%)" },
  { name: "Low/Info", value: dashboardStats.lowEvents, color: "hsl(152,69%,46%)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border p-3 text-xs font-mono" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,22%)" }}>
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const recentEvents = securityEvents.slice(0, 8);
  const openAlerts = alerts.filter(a => ["open", "investigating"].includes(a.status)).slice(0, 5);

  return (
    <Layout title="Security Operations Center" subtitle="Real-time threat monitoring dashboard">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Events (24h)"
          value={dashboardStats.totalEvents}
          icon={Activity}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          accentColor="from-emerald-500/8 to-transparent"
          trend={{ value: 12, label: "vs yesterday" }}
          delay={0}
        />
        <StatCard
          title="Active Alerts"
          value={dashboardStats.activeAlerts}
          icon={AlertTriangle}
          iconColor="text-red-400"
          iconBg="bg-red-500/10 border-red-500/20"
          accentColor="from-red-500/8 to-transparent"
          trend={{ value: 8, label: "vs last hour" }}
          delay={0.05}
        />
        <StatCard
          title="Online Assets"
          value={dashboardStats.onlineAssets}
          subtitle={`of ${dashboardStats.onlineAssets + 4} total assets`}
          icon={Monitor}
          iconColor="text-sky-400"
          iconBg="bg-sky-500/10 border-sky-500/20"
          accentColor="from-sky-500/8 to-transparent"
          delay={0.1}
        />
        <StatCard
          title="Threat Intel IOCs"
          value={dashboardStats.threatIntelCount}
          subtitle="Active indicators"
          icon={Globe}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10 border-purple-500/20"
          accentColor="from-purple-500/8 to-transparent"
          delay={0.15}
        />
      </div>

      {/* Severity count row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Critical", count: dashboardStats.criticalEvents, color: "text-red-400", bg: "bg-red-400/5", bar: "bg-red-400", border: "border-red-400/15" },
          { label: "High", count: dashboardStats.highEvents, color: "text-orange-400", bg: "bg-orange-400/5", bar: "bg-orange-400", border: "border-orange-400/15" },
          { label: "Medium", count: dashboardStats.mediumEvents, color: "text-yellow-400", bg: "bg-yellow-400/5", bar: "bg-yellow-400", border: "border-yellow-400/15" },
          { label: "Low / Info", count: dashboardStats.lowEvents, color: "text-emerald-400", bg: "bg-emerald-400/5", bar: "bg-emerald-400", border: "border-emerald-400/15" },
        ].map(({ label, count, color, bg, bar, border }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className={`rounded-xl border px-4 py-3 ${bg} ${border}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</span>
              <span className={`font-mono text-lg font-bold ${color}`}>{count}</span>
            </div>
            <div className="h-1 rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(count / securityEvents.length) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`h-full rounded-full ${bar}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 rounded-xl border p-5" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Event Timeline (24h)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Total vs Critical event frequency</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Total
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Critical
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152,69%,46%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(152,69%,46%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0,85%,60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0,85%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,25%,16%)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(215,20%,45%)", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fill: "hsl(215,20%,45%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" name="Total" stroke="hsl(152,69%,46%)" strokeWidth={2} fill="url(#totalGrad)" />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="hsl(0,85%,60%)" strokeWidth={2} fill="url(#criticalGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Donut */}
        <div className="rounded-xl border p-5" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Severity Distribution</h3>
          <p className="text-xs text-slate-500 mb-3">Event breakdown by severity</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={SEVERITY_PIE}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {SEVERITY_PIE.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,22%)", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "hsl(210,40%,80%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {SEVERITY_PIE.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="font-mono text-slate-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Events */}
        <div className="rounded-xl border p-5" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-200">Recent Events</h3>
              <LiveDot size="sm" />
            </div>
            <span className="text-xs text-emerald-400 font-mono">LIVE</span>
          </div>
          <div className="space-y-2">
            {recentEvents.map((evt, i) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 py-2 border-b last:border-0"
                style={{ borderColor: "hsl(222,25%,16%)" }}
              >
                <SeverityBadge severity={evt.severity} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 truncate">{evt.description}</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">{evt.host} · {evt.source}</p>
                </div>
                <span className="text-[10px] text-slate-600 font-mono flex-shrink-0">
                  {format(evt.timestamp, "HH:mm")}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="rounded-xl border p-5" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Active Alerts</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "hsla(0,85%,60%,0.1)", color: "hsl(0,85%,60%)", border: "1px solid hsla(0,85%,60%,0.3)" }}>
              {openAlerts.length} OPEN
            </span>
          </div>
          <div className="space-y-2">
            {openAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 py-2.5 px-3 rounded-lg cursor-pointer hover:bg-white/3 transition-colors"
                style={{ background: "hsl(222,35%,9%)" }}
              >
                <div className="flex-shrink-0 pt-0.5">
                  {alert.severity === "critical" ? (
                    <Zap size={14} className="text-red-400" />
                  ) : (
                    <Shield size={14} className="text-orange-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">{alert.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <SeverityBadge severity={alert.severity} size="sm" />
                    <span className="text-[10px] text-slate-500 font-mono">{alert.mitreId}</span>
                  </div>
                </div>
                <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase ${
                  alert.status === "investigating"
                    ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30"
                    : "text-orange-400 bg-orange-400/10 border border-orange-400/30"
                }`}>
                  {alert.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
