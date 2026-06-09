import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, ChevronDown, ChevronRight, Zap, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { Layout } from "../components/Layout";
import { vulnerabilities, Vulnerability, VulnStatus } from "../data/mockData";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { format } from "date-fns";

const statusConfig: Record<VulnStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "text-red-400 bg-red-400/10 border-red-400/30" },
  in_progress: { label: "In Progress", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  patched: { label: "Patched", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  mitigated: { label: "Mitigated", color: "text-sky-400 bg-sky-400/10 border-sky-400/30" },
  accepted_risk: { label: "Accepted Risk", color: "text-slate-400 bg-slate-400/10 border-slate-400/30" },
};

const cvssColor = (score: number) => {
  if (score >= 9) return "text-red-400";
  if (score >= 7) return "text-orange-400";
  if (score >= 4) return "text-yellow-400";
  return "text-emerald-400";
};

export const Vulnerabilities: React.FC = () => {
  const [vulnList, setVulnList] = useState<Vulnerability[]>([...vulnerabilities]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<VulnStatus | "all">("all");

  const setStatus = (id: string, status: VulnStatus) => {
    setVulnList(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const filtered = vulnList.filter(v => filterStatus === "all" || v.status === filterStatus);

  const stats = {
    open: vulnList.filter(v => v.status === "open").length,
    critical: vulnList.filter(v => v.severity === "critical").length,
    exploitInWild: vulnList.filter(v => v.exploitInWild).length,
    patched: vulnList.filter(v => v.status === "patched").length,
  };

  return (
    <Layout title="Vulnerability Management" subtitle="CVE tracking, CVSS scoring, and patch management">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Open", value: stats.open, color: "text-red-400", bg: "bg-red-400/5 border-red-400/20" },
          { label: "Critical CVEs", value: stats.critical, color: "text-red-400", bg: "bg-red-500/8 border-red-400/20" },
          { label: "Exploited in Wild", value: stats.exploitInWild, color: "text-orange-400", bg: "bg-orange-400/5 border-orange-400/20" },
          { label: "Patched", value: stats.patched, color: "text-emerald-400", bg: "bg-emerald-400/5 border-emerald-400/20" },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg}`}>
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-5">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as VulnStatus | "all")}
          className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
          style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}>
          <option value="all">All Statuses</option>
          {(Object.keys(statusConfig) as VulnStatus[]).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
        </select>
        <div className="text-xs text-slate-600 font-mono flex items-center ml-auto">{filtered.length} vulnerabilities</div>
      </div>

      {/* Vuln List */}
      <div className="space-y-2">
        {filtered.sort((a, b) => b.cvssScore - a.cvssScore).map(vuln => {
          const sc = statusConfig[vuln.status];
          const isExpanded = expandedId === vuln.id;

          return (
            <motion.div
              key={vuln.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border overflow-hidden"
              style={{
                background: "hsl(222,35%,11%)",
                borderColor: vuln.exploitInWild && vuln.status === "open" ? "hsla(0,85%,60%,0.25)" : "hsl(222,25%,18%)"
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : vuln.id)}
              >
                {vuln.exploitInWild && <Zap size={14} className="text-red-400 flex-shrink-0" />}
                <SeverityBadge severity={vuln.severity} size="sm" />
                <div className="font-mono text-lg font-bold flex-shrink-0 w-14">
                  <span className={cvssColor(vuln.cvssScore)}>{vuln.cvssScore}</span>
                </div>
                <div className="flex-shrink-0 font-mono text-xs text-slate-500 w-28">{vuln.cveId}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{vuln.title}</p>
                  <p className="text-[10px] text-slate-600 truncate">{vuln.affectedSoftware}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {vuln.exploitAvailable && (
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded">PoC</span>
                  )}
                  {vuln.exploitInWild && (
                    <span className="text-[10px] font-mono text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded">In Wild</span>
                  )}
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sc.color}`}>{sc.label}</span>
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
                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ background: "hsl(222,35%,9%)" }}>
                      <div className="lg:col-span-2 space-y-3">
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Description</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{vuln.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Affected Assets</p>
                            <div className="flex flex-wrap gap-1">
                              {vuln.affectedAssets.map(a => (
                                <span key={a} className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded">{a}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Published</p>
                            <p className="text-xs font-mono text-slate-400">{format(vuln.publishedDate, "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        {vuln.patchNotes && (
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Patch Notes</p>
                            <div className="p-2 rounded text-xs font-mono text-emerald-400/80" style={{ background: "hsl(222,47%,6%)" }}>
                              {vuln.patchNotes}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-3">Actions</p>
                        <div className="space-y-2">
                          {vuln.patchAvailable && (
                            <button
                              onClick={() => setStatus(vuln.id, "patched")}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-colors"
                            >
                              <CheckCircle size={13} /> Mark as Patched
                            </button>
                          )}
                          <button
                            onClick={() => setStatus(vuln.id, "mitigated")}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-sky-400 border border-sky-400/30 hover:bg-sky-400/10 transition-colors"
                          >
                            <Shield size={13} /> Apply Mitigation
                          </button>
                          <button
                            onClick={() => setStatus(vuln.id, "in_progress")}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/10 transition-colors"
                          >
                            <AlertTriangle size={13} /> Mark In Progress
                          </button>
                          <button
                            onClick={() => setStatus(vuln.id, "accepted_risk")}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 border border-slate-700 hover:bg-white/5 transition-colors"
                          >
                            <Bug size={13} /> Accept Risk
                          </button>
                        </div>

                        {/* CVSS Visual */}
                        <div className="mt-4 p-3 rounded-lg" style={{ background: "hsl(222,47%,6%)" }}>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">CVSS Score</p>
                          <div className="flex items-center gap-2">
                            <p className={`text-3xl font-bold font-mono ${cvssColor(vuln.cvssScore)}`}>{vuln.cvssScore}</p>
                            <div className="flex-1">
                              <div className="h-2 rounded-full bg-white/5">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${(vuln.cvssScore / 10) * 100}%`,
                                    background: vuln.cvssScore >= 9 ? "hsl(0,85%,55%)" : vuln.cvssScore >= 7 ? "hsl(25,95%,55%)" : "hsl(45,95%,55%)"
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-600 mt-1">/ 10.0</p>
                            </div>
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
    </Layout>
  );
};
