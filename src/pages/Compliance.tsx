import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Layout } from "../components/Layout";
import { complianceChecks, ComplianceStatus } from "../data/mockData";
import { format } from "date-fns";

const frameworks = ["PCI-DSS", "CIS", "HIPAA", "NIST", "SOC2", "ISO27001"];

const statusConfig: Record<ComplianceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pass: { label: "Pass", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25", icon: <CheckCircle size={12} /> },
  fail: { label: "Fail", color: "text-red-400 bg-red-400/10 border-red-400/25", icon: <XCircle size={12} /> },
  warning: { label: "Warning", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/25", icon: <AlertTriangle size={12} /> },
  not_applicable: { label: "N/A", color: "text-slate-400 bg-slate-400/10 border-slate-700", icon: null },
};

const frameworkColors: Record<string, string> = {
  "PCI-DSS": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "CIS": "text-sky-400 bg-sky-400/10 border-sky-400/20",
  "HIPAA": "text-pink-400 bg-pink-400/10 border-pink-400/20",
  "NIST": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "SOC2": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "ISO27001": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

const getFrameworkScore = (fw: string) => {
  const checks = complianceChecks.filter(c => c.framework === fw);
  if (!checks.length) return 0;
  return Math.round(checks.reduce((s, c) => s + c.score, 0) / checks.length);
};

export const Compliance: React.FC = () => {
  const [selectedFw, setSelectedFw] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = complianceChecks.filter(c => selectedFw === "all" || c.framework === selectedFw);

  return (
    <Layout title="Compliance" subtitle="Multi-framework compliance monitoring and gap analysis">
      {/* Framework scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {frameworks.map(fw => {
          const score = getFrameworkScore(fw);
          const checks = complianceChecks.filter(c => c.framework === fw);
          const passes = checks.filter(c => c.status === "pass").length;
          const fails = checks.filter(c => c.status === "fail").length;
          const fc = frameworkColors[fw];

          return (
            <button
              key={fw}
              onClick={() => setSelectedFw(selectedFw === fw ? "all" : fw)}
              className={`rounded-xl border p-4 text-left transition-all hover:scale-105 ${
                selectedFw === fw ? fc : "border-white/8 bg-white/3"
              }`}
            >
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${selectedFw === fw ? "" : "text-slate-500"}`}>{fw}</p>
              <p className={`text-2xl font-bold font-mono mb-1 ${
                score >= 80 ? "text-emerald-400" : score >= 60 ? "text-yellow-400" : "text-red-400"
              }`}>{score}%</p>
              <div className="h-1 rounded-full bg-white/5 mb-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${score}%`,
                    background: score >= 80 ? "hsl(152,69%,46%)" : score >= 60 ? "hsl(45,95%,55%)" : "hsl(0,85%,60%)"
                  }}
                />
              </div>
              <div className="flex gap-2 text-[9px]">
                <span className="text-emerald-400">{passes} pass</span>
                <span className="text-red-400">{fails} fail</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Checks table */}
      <div className="space-y-2">
        {filtered.map(check => {
          const sc = statusConfig[check.status];
          const isExpanded = expandedId === check.id;
          const fc = frameworkColors[check.framework];

          return (
            <motion.div
              key={check.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border overflow-hidden"
              style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : check.id)}
              >
                <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${fc}`}>
                  {check.framework}
                </span>
                <span className="font-mono text-[10px] text-slate-600 flex-shrink-0 w-24">{check.control}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{check.title}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Score bar */}
                  <div className="hidden lg:flex items-center gap-2 w-24">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${check.score}%`,
                          background: check.score >= 80 ? "hsl(152,69%,46%)" : check.score >= 60 ? "hsl(45,95%,55%)" : "hsl(0,85%,60%)"
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{check.score}%</span>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${sc.color}`}>
                    {sc.icon} {sc.label}
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
                      <div>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Description</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{check.description}</p>
                      </div>
                      {check.remediation && (
                        <div>
                          <p className="text-[10px] text-yellow-600 uppercase tracking-widest mb-1">Remediation Steps</p>
                          <p className="text-xs text-yellow-400/80 leading-relaxed">{check.remediation}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                        <CheckSquare size={10} /> Last checked: {format(check.lastChecked, "MMM d, HH:mm")}
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
