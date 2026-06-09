import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronRight, User, Hash, Shield } from "lucide-react";
import { Layout } from "../components/Layout";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { alerts, Alert, AlertStatus, Severity } from "../data/mockData";
import { format } from "date-fns";

const statusConfig: Record<AlertStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "text-red-400 bg-red-400/10 border-red-400/30" },
  acknowledged: { label: "Acknowledged", color: "text-orange-400 bg-orange-400/10 border-orange-400/30" },
  investigating: { label: "Investigating", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  resolved: { label: "Resolved", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  closed: { label: "Closed", color: "text-slate-400 bg-slate-400/10 border-slate-400/30" },
};

const statusFlow: AlertStatus[] = ["open", "acknowledged", "investigating", "resolved", "closed"];

export const Alerts: React.FC = () => {
  const [alertList, setAlertList] = useState<Alert[]>([...alerts]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AlertStatus | "all">("all");
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [noteInput, setNoteInput] = useState("");

  const advanceStatus = (id: string) => {
    setAlertList(prev => prev.map(a => {
      if (a.id !== id) return a;
      const currentIndex = statusFlow.indexOf(a.status);
      const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)];
      return { ...a, status: nextStatus };
    }));
  };

  const saveNote = (id: string) => {
    if (!noteInput.trim()) return;
    setAlertList(prev => prev.map(a => {
      if (a.id !== id) return a;
      return { ...a, notes: (a.notes ? a.notes + "\n" : "") + noteInput };
    }));
    setNoteInput("");
  };

  const filtered = alertList.filter(a => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchSeverity = filterSeverity === "all" || a.severity === filterSeverity;
    return matchStatus && matchSeverity;
  });

  const counts = {
    open: alertList.filter(a => a.status === "open").length,
    investigating: alertList.filter(a => a.status === "investigating").length,
    acknowledged: alertList.filter(a => a.status === "acknowledged").length,
  };

  return (
    <Layout title="Alerts" subtitle="Correlated detection alerts with MITRE ATT&CK mapping">
      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: "Open", count: counts.open, color: "text-red-400 border-red-400/30 bg-red-400/5" },
          { label: "Investigating", count: counts.investigating, color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" },
          { label: "Acknowledged", count: counts.acknowledged, color: "text-orange-400 border-orange-400/30 bg-orange-400/5" },
        ].map(item => (
          <div key={item.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${item.color}`}>
            <span className="font-bold text-lg leading-none">{item.count}</span>
            <span className="text-slate-400">{item.label}</span>
          </div>
        ))}

        <div className="ml-auto flex gap-2">
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value as Severity | "all")}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
            style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
          >
            <option value="all">All Severities</option>
            {(["critical","high","medium","low"] as Severity[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as AlertStatus | "all")}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
            style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
          >
            <option value="all">All Statuses</option>
            {statusFlow.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        {filtered.map(alert => {
          const sc = statusConfig[alert.status];
          const isExpanded = expandedId === alert.id;
          const canAdvance = alert.status !== "closed";

          return (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border overflow-hidden"
              style={{ background: "hsl(222,35%,11%)", borderColor: alert.severity === "critical" && alert.status === "open" ? "hsla(0,85%,60%,0.3)" : "hsl(222,25%,18%)" }}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                <AlertTriangle
                  size={16}
                  className={alert.severity === "critical" ? "text-red-400 flex-shrink-0" : "text-orange-400 flex-shrink-0"}
                />
                <SeverityBadge severity={alert.severity} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{alert.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-500">{alert.mitreId}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-500">{alert.affectedHost}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] font-mono text-slate-600">{format(alert.timestamp, "MMM d, HH:mm")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border" style={{ background: "hsl(222,35%,9%)" }}>
                    <span className="text-slate-500">{alert.eventCount} events</span>
                  </span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase ${sc.color}`}>
                    {sc.label}
                  </span>
                  {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-600" />}
                </div>
              </div>

              {/* Expanded detail */}
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
                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ background: "hsl(222,35%,9%)" }}>
                      {/* Left: Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Description</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Shield size={10} /> MITRE Tactic</p>
                            <p className="text-xs font-mono text-emerald-400">{alert.mitreTactic}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">MITRE Technique</p>
                            <p className="text-xs font-mono text-emerald-400">{alert.mitreTechnique}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1"><User size={10} /> Assignee</p>
                            <p className="text-xs font-mono text-slate-300">{alert.assignee || "Unassigned"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Hash size={10} /> Alert ID</p>
                            <p className="text-xs font-mono text-slate-500">{alert.id}</p>
                          </div>
                        </div>
                        {alert.notes && (
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Investigation Notes</p>
                            <div className="p-3 rounded-lg text-xs font-mono text-slate-400 leading-relaxed whitespace-pre-wrap" style={{ background: "hsl(222,47%,6%)" }}>
                              {alert.notes}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add investigation note..."
                            value={noteInput}
                            onChange={e => setNoteInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && saveNote(alert.id)}
                            className="flex-1 px-3 py-1.5 rounded-lg text-xs text-slate-300 placeholder-slate-600 outline-none"
                            style={{ background: "hsl(222,47%,6%)", border: "1px solid hsl(222,25%,18%)" }}
                          />
                          <button
                            onClick={() => saveNote(alert.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-400/10 transition-colors border border-emerald-400/20"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>

                      {/* Right: Status workflow */}
                      <div>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-3">Alert Lifecycle</p>
                        <div className="space-y-2">
                          {statusFlow.map((status, idx) => {
                            const currentIdx = statusFlow.indexOf(alert.status);
                            const isPast = idx < currentIdx;
                            const isCurrent = idx === currentIdx;

                            return (
                              <div key={status} className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                  isCurrent ? "border-emerald-400 bg-emerald-400/20" :
                                  isPast ? "border-slate-600 bg-slate-700" :
                                  "border-slate-700 bg-transparent"
                                }`}>
                                  {isPast && <div className="w-2 h-2 rounded-full bg-slate-500" />}
                                  {isCurrent && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                                </div>
                                <span className={`text-xs font-mono capitalize ${isCurrent ? "text-emerald-400" : isPast ? "text-slate-600" : "text-slate-700"}`}>
                                  {status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {canAdvance && (
                          <button
                            onClick={() => advanceStatus(alert.id)}
                            className="mt-4 w-full py-2 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-colors"
                          >
                            Advance → {statusFlow[Math.min(statusFlow.indexOf(alert.status) + 1, statusFlow.length - 1)]}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Layout>
  );
};
