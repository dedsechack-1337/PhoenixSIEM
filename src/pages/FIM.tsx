import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, CheckCircle, ShieldOff } from "lucide-react";
import { Layout } from "../components/Layout";
import { fimEvents, FIMEvent, FIMAction } from "../data/mockData";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { format } from "date-fns";

const actionConfig: Record<FIMAction, { label: string; color: string; icon: string }> = {
  created: { label: "Created", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: "+" },
  modified: { label: "Modified", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: "~" },
  deleted: { label: "Deleted", color: "text-red-400 bg-red-400/10 border-red-400/20", icon: "−" },
  permission_changed: { label: "Perm Changed", color: "text-orange-400 bg-orange-400/10 border-orange-400/20", icon: "🔒" },
  owner_changed: { label: "Owner Changed", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: "👤" },
};

export const FIM: React.FC = () => {
  const [events, setEvents] = useState<FIMEvent[]>([...fimEvents]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<FIMAction | "all">("all");
  const [showAcked, setShowAcked] = useState(true);

  const acknowledge = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, acknowledged: true } : e));
  };

  const whitelist = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, whitelisted: true, acknowledged: true } : e));
  };

  const filtered = events.filter(e => {
    const matchAction = filterAction === "all" || e.action === filterAction;
    const matchAcked = showAcked || !e.acknowledged;
    return matchAction && matchAcked;
  });

  const unacked = events.filter(e => !e.acknowledged).length;

  return (
    <Layout title="File Integrity Monitoring" subtitle="Real-time detection of unauthorized file system changes">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Unacknowledged", value: unacked, color: "text-red-400", border: "border-red-400/20", bg: "bg-red-400/5" },
          { label: "Modified", value: events.filter(e => e.action === "modified").length, color: "text-yellow-400", border: "border-yellow-400/20", bg: "bg-yellow-400/5" },
          { label: "Deleted", value: events.filter(e => e.action === "deleted").length, color: "text-red-400", border: "border-red-400/20", bg: "bg-red-400/5" },
          { label: "Whitelisted", value: events.filter(e => e.whitelisted).length, color: "text-slate-400", border: "border-slate-700", bg: "bg-slate-800/50" },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border p-4 ${stat.border} ${stat.bg}`}>
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-5">
        <select
          value={filterAction}
          onChange={e => setFilterAction(e.target.value as FIMAction | "all")}
          className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
          style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
        >
          <option value="all">All Actions</option>
          {(Object.keys(actionConfig) as FIMAction[]).map(a => (
            <option key={a} value={a}>{actionConfig[a].label}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400">
          <input
            type="checkbox"
            checked={showAcked}
            onChange={e => setShowAcked(e.target.checked)}
            className="w-4 h-4 rounded accent-emerald-400"
          />
          Show acknowledged
        </label>
        <div className="ml-auto text-xs font-mono text-slate-600 flex items-center">
          {filtered.length} events shown
        </div>
      </div>

      {/* Events */}
      <div className="space-y-2">
        {filtered.map(evt => {
          const ac = actionConfig[evt.action];
          const isExpanded = expandedId === evt.id;

          return (
            <motion.div
              key={evt.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border overflow-hidden ${evt.whitelisted ? "opacity-50" : ""}`}
              style={{
                background: "hsl(222,35%,11%)",
                borderColor: evt.acknowledged ? "hsl(222,25%,18%)" : evt.severity === "critical" ? "hsla(0,85%,60%,0.3)" : "hsl(222,25%,22%)"
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : evt.id)}
              >
                {!evt.acknowledged && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                )}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${ac.color}`}>
                  {ac.icon} {ac.label}
                </span>
                <SeverityBadge severity={evt.severity} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-slate-200 truncate">{evt.filePath}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-600">{evt.host}</span>
                    <span className="text-[10px] text-slate-700">·</span>
                    <span className="text-[10px] text-slate-600">user: {evt.user}</span>
                    <span className="text-[10px] text-slate-700">·</span>
                    <span className="text-[10px] font-mono text-slate-700">{format(evt.timestamp, "HH:mm:ss")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {evt.whitelisted && (
                    <span className="text-[10px] text-slate-600 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">whitelisted</span>
                  )}
                  {evt.acknowledged && !evt.whitelisted && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-900/30 border border-emerald-800 px-2 py-0.5 rounded">acked</span>
                  )}
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
                    <div className="p-4 space-y-3" style={{ background: "hsl(222,35%,9%)" }}>
                      <div>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Description</p>
                        <p className="text-xs text-slate-400">{evt.description}</p>
                      </div>

                      {/* Hash diff */}
                      {(evt.oldHash || evt.newHash) && (
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Hash Comparison</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-[9px] text-red-500 mb-1">OLD HASH (MD5)</p>
                              <div className="p-2 rounded font-mono text-[11px] text-red-400/80" style={{ background: "hsl(222,47%,6%)" }}>
                                {evt.oldHash || <span className="text-slate-700">—</span>}
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] text-emerald-500 mb-1">NEW HASH (MD5)</p>
                              <div className="p-2 rounded font-mono text-[11px] text-emerald-400/80" style={{ background: "hsl(222,47%,6%)" }}>
                                {evt.newHash || <span className="text-slate-700">—</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Permission diff */}
                      {(evt.oldPermissions || evt.newPermissions) && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[9px] text-red-500 mb-1">OLD PERMISSIONS</p>
                            <div className="p-2 rounded font-mono text-[11px] text-red-400" style={{ background: "hsl(222,47%,6%)" }}>
                              {evt.oldPermissions}
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] text-emerald-500 mb-1">NEW PERMISSIONS</p>
                            <div className="p-2 rounded font-mono text-[11px] text-emerald-400" style={{ background: "hsl(222,47%,6%)" }}>
                              {evt.newPermissions}
                            </div>
                          </div>
                        </div>
                      )}

                      {(evt.oldOwner || evt.newOwner) && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[9px] text-red-500 mb-1">OLD OWNER</p>
                            <div className="p-2 rounded font-mono text-[11px] text-red-400" style={{ background: "hsl(222,47%,6%)" }}>{evt.oldOwner}</div>
                          </div>
                          <div>
                            <p className="text-[9px] text-emerald-500 mb-1">NEW OWNER</p>
                            <div className="p-2 rounded font-mono text-[11px] text-emerald-400" style={{ background: "hsl(222,47%,6%)" }}>{evt.newOwner}</div>
                          </div>
                        </div>
                      )}

                      {!evt.acknowledged && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => acknowledge(evt.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-colors"
                          >
                            <CheckCircle size={12} /> Acknowledge
                          </button>
                          <button
                            onClick={() => whitelist(evt.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700 hover:bg-white/5 transition-colors"
                          >
                            <ShieldOff size={12} /> Whitelist Path
                          </button>
                        </div>
                      )}
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
