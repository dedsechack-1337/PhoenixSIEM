import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin, Clock, ChevronDown, ChevronRight, AlertTriangle, TrendingUp } from "lucide-react";
import { Layout } from "../components/Layout";
import { ubaEvents, UBAEvent, UBAType } from "../data/mockData";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { format } from "date-fns";

const anomalyConfig: Record<UBAType, { label: string; color: string; icon: React.ReactNode }> = {
  impossible_travel: { label: "Impossible Travel", color: "text-red-400 bg-red-400/10 border-red-400/20", icon: <MapPin size={11} /> },
  privilege_escalation: { label: "Priv Escalation", color: "text-orange-400 bg-orange-400/10 border-orange-400/20", icon: <TrendingUp size={11} /> },
  data_staging: { label: "Data Staging", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: <AlertTriangle size={11} /> },
  lateral_movement: { label: "Lateral Movement", color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: <Users size={11} /> },
  after_hours_activity: { label: "After Hours", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: <Clock size={11} /> },
  unusual_login_time: { label: "Unusual Login", color: "text-sky-400 bg-sky-400/10 border-sky-400/20", icon: <Clock size={11} /> },
  credential_sharing: { label: "Credential Sharing", color: "text-orange-400 bg-orange-400/10 border-orange-400/20", icon: <Users size={11} /> },
  excessive_data_access: { label: "Excessive Access", color: "text-red-400 bg-red-400/10 border-red-400/20", icon: <AlertTriangle size={11} /> },
};

const statusConfig = {
  open: "text-red-400 bg-red-400/10 border-red-400/30",
  investigating: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  resolved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  false_positive: "text-slate-400 bg-slate-400/10 border-slate-700",
};

const riskColor = (score: number) => {
  if (score >= 90) return "text-red-400";
  if (score >= 75) return "text-orange-400";
  if (score >= 60) return "text-yellow-400";
  return "text-emerald-400";
};

const riskBarColor = (score: number) => {
  if (score >= 90) return "bg-red-400";
  if (score >= 75) return "bg-orange-400";
  if (score >= 60) return "bg-yellow-400";
  return "bg-emerald-400";
};

export const UBA: React.FC = () => {
  const [events, setEvents] = useState<UBAEvent[]>([...ubaEvents]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const setStatus = (id: string, status: UBAEvent["status"]) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  // Top risky users (unique)
  const userRisk = ubaEvents.reduce<Record<string, { username: string; dept: string; score: number }>>(
    (acc, e) => {
      if (!acc[e.userId] || e.riskScore > acc[e.userId].score) {
        acc[e.userId] = { username: e.username, dept: e.department, score: e.riskScore };
      }
      return acc;
    },
    {}
  );
  const topUsers = Object.values(userRisk).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <Layout title="User Behavior Analytics" subtitle="Anomaly detection and insider threat monitoring">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Main anomaly list */}
        <div className="lg:col-span-3 space-y-2">
          {events.sort((a, b) => b.riskScore - a.riskScore).map(evt => {
            const ac = anomalyConfig[evt.anomalyType];
            const isExpanded = expandedId === evt.id;

            return (
              <motion.div
                key={evt.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border overflow-hidden"
                style={{
                  background: "hsl(222,35%,11%)",
                  borderColor: evt.riskScore >= 90 && evt.status === "open" ? "hsla(0,85%,60%,0.25)" : "hsl(222,25%,18%)"
                }}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/2 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                >
                  <div className="flex-shrink-0 w-12 text-center">
                    <span className={`text-lg font-bold font-mono ${riskColor(evt.riskScore)}`}>{evt.riskScore}</span>
                    <p className="text-[9px] text-slate-700">risk</p>
                  </div>
                  <SeverityBadge severity={evt.severity} size="sm" />
                  <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${ac.color} flex-shrink-0`}>
                    {ac.icon} {ac.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{evt.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-500">{evt.username}</span>
                      <span className="text-slate-700 text-[10px]">·</span>
                      <span className="text-[10px] text-slate-600">{evt.department}</span>
                      <span className="text-slate-700 text-[10px]">·</span>
                      <span className="text-[10px] font-mono text-slate-700">{format(evt.timestamp, "HH:mm")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusConfig[evt.status]}`}>
                      {evt.status.replace("_", " ")}
                    </span>
                    {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-600" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t"
                      style={{ borderColor: "hsl(222,25%,16%)" }}
                    >
                      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ background: "hsl(222,35%,9%)" }}>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Anomaly Details</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{evt.details}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">User ID</p>
                              <p className="text-xs font-mono text-slate-300">{evt.userId}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Source IP</p>
                              <p className="text-xs font-mono text-slate-300">{evt.sourceIp}</p>
                            </div>
                            {evt.location && (
                              <div>
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Location</p>
                                <p className="text-xs font-mono text-red-400 flex items-center gap-1">
                                  <MapPin size={10} /> {evt.location}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-3">Investigation</p>
                          <div className="space-y-2">
                            {(["investigating", "resolved", "false_positive"] as UBAEvent["status"][]).map(s => (
                              <button
                                key={s}
                                onClick={() => setStatus(evt.id, s)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                  evt.status === s
                                    ? statusConfig[s]
                                    : "text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300"
                                }`}
                              >
                                {s === "investigating" ? "🔍 Mark Investigating" : s === "resolved" ? "✅ Mark Resolved" : "🚫 False Positive"}
                              </button>
                            ))}
                          </div>
                          {/* Risk bar */}
                          <div className="mt-4 p-3 rounded-lg" style={{ background: "hsl(222,47%,6%)" }}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[10px] text-slate-600 uppercase tracking-widest">Risk Score</p>
                              <p className={`text-lg font-bold font-mono ${riskColor(evt.riskScore)}`}>{evt.riskScore}</p>
                            </div>
                            <div className="h-2 rounded-full bg-white/5">
                              <div className={`h-full rounded-full ${riskBarColor(evt.riskScore)}`} style={{ width: `${evt.riskScore}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar: Top risky users */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border p-4 sticky top-4" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400" />
              Top Risky Users
            </h3>
            <div className="space-y-3">
              {topUsers.map((user, i) => (
                <div key={user.username} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 ${
                    i === 0 ? "bg-red-400/20 text-red-400" :
                    i === 1 ? "bg-orange-400/20 text-orange-400" :
                    "bg-slate-700 text-slate-400"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-slate-300 truncate">{user.username}</p>
                    <p className="text-[10px] text-slate-600 truncate">{user.dept}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className={`text-sm font-bold font-mono ${riskColor(user.score)}`}>{user.score}</p>
                    <div className="w-12 h-1 rounded-full bg-white/5 mt-0.5">
                      <div className={`h-full rounded-full ${riskBarColor(user.score)}`} style={{ width: `${user.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary stats */}
            <div className="mt-5 pt-4 border-t space-y-2" style={{ borderColor: "hsl(222,25%,16%)" }}>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Open anomalies</span>
                <span className="font-mono text-red-400">{events.filter(e => e.status === "open").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Investigating</span>
                <span className="font-mono text-yellow-400">{events.filter(e => e.status === "investigating").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Resolved today</span>
                <span className="font-mono text-emerald-400">{events.filter(e => e.status === "resolved").length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
