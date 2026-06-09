import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { Layout } from "../components/Layout";
import { mitreTactics } from "../data/mockData";

const heatColor = (hits: number): string => {
  if (hits === 0) return "hsl(222,35%,12%)";
  if (hits <= 3) return "hsl(152,69%,20%)";
  if (hits <= 8) return "hsl(152,69%,32%)";
  if (hits <= 14) return "hsl(45,95%,35%)";
  return "hsl(0,85%,40%)";
};

const heatBorderColor = (hits: number): string => {
  if (hits === 0) return "hsl(222,25%,18%)";
  if (hits <= 3) return "hsl(152,69%,30%)";
  if (hits <= 8) return "hsl(152,69%,40%)";
  if (hits <= 14) return "hsl(45,95%,45%)";
  return "hsl(0,85%,50%)";
};

const heatTextColor = (hits: number): string => {
  if (hits === 0) return "hsl(215,20%,35%)";
  if (hits <= 3) return "hsl(152,69%,60%)";
  if (hits <= 8) return "hsl(152,69%,70%)";
  if (hits <= 14) return "hsl(45,95%,70%)";
  return "hsl(0,85%,70%)";
};

const heatLabel = (hits: number) => {
  if (hits === 0) return "None";
  if (hits <= 3) return "Low";
  if (hits <= 8) return "Medium";
  if (hits <= 14) return "High";
  return "Critical";
};

export const MitreHeatmap: React.FC = () => {
  const [expandedTactic, setExpandedTactic] = useState<string | null>(null);

  const totalHits = mitreTactics.reduce((sum, t) => sum + t.techniques.reduce((s, tech) => s + tech.hits, 0), 0);
  const activeTactics = mitreTactics.filter(t => t.techniques.some(tech => tech.hits > 0)).length;
  const coverageScore = Math.round((activeTactics / mitreTactics.length) * 100);

  return (
    <Layout title="MITRE ATT&CK Heatmap" subtitle="Adversary tactic & technique coverage in your environment">
      {/* Coverage stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border p-4" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Coverage Score</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold font-mono text-emerald-400">{coverageScore}%</p>
            <p className="text-xs text-slate-500 mb-1">of tactics</p>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/5">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${coverageScore}%` }} />
          </div>
        </div>
        <div className="rounded-xl border p-4" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Active Tactics</p>
          <p className="text-3xl font-bold font-mono text-orange-400">{activeTactics} <span className="text-base text-slate-600">/ {mitreTactics.length}</span></p>
          <p className="text-xs text-slate-600 mt-1">Tactics with detections</p>
        </div>
        <div className="rounded-xl border p-4" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Total Technique Hits</p>
          <p className="text-3xl font-bold font-mono text-red-400">{totalHits}</p>
          <p className="text-xs text-slate-600 mt-1">Across {mitreTactics.reduce((s,t)=>s+t.techniques.length,0)} techniques</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs">
        <span className="text-slate-600">Heat scale:</span>
        {[
          { label: "None (0)", color: "hsl(222,35%,18%)" },
          { label: "Low (1-3)", color: "hsl(152,69%,25%)" },
          { label: "Medium (4-8)", color: "hsl(152,69%,38%)" },
          { label: "High (9-14)", color: "hsl(45,95%,42%)" },
          { label: "Critical (15+)", color: "hsl(0,85%,45%)" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: color }} />
            <span className="text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 mb-6">
        {mitreTactics.map(tactic => {
          const totalTacticHits = tactic.techniques.reduce((s, t) => s + t.hits, 0);
          const isExpanded = expandedTactic === tactic.id;

          return (
            <motion.div
              key={tactic.id}
              layout
              className="rounded-xl border cursor-pointer transition-all hover:scale-105"
              style={{
                background: heatColor(totalTacticHits),
                borderColor: heatBorderColor(totalTacticHits),
              }}
              onClick={() => setExpandedTactic(isExpanded ? null : tactic.id)}
            >
              <div className="p-3">
                <p className="text-[9px] font-mono opacity-60 mb-1">{tactic.id}</p>
                <p className="text-[11px] font-semibold leading-tight" style={{ color: heatTextColor(totalTacticHits) }}>
                  {tactic.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-mono font-bold" style={{ color: heatTextColor(totalTacticHits) }}>
                    {totalTacticHits}
                  </span>
                  <span className="text-[9px] opacity-60" style={{ color: heatTextColor(totalTacticHits) }}>
                    {heatLabel(totalTacticHits)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded tactic detail */}
      <AnimatePresence>
        {expandedTactic && (() => {
          const tactic = mitreTactics.find(t => t.id === expandedTactic);
          if (!tactic) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="rounded-xl border p-5"
              style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,22%)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield size={18} className="text-emerald-400" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{tactic.name}</h3>
                  <p className="text-xs font-mono text-slate-500">{tactic.id}</p>
                </div>
              </div>
              <div className="space-y-2">
                {tactic.techniques.map(tech => (
                  <div key={tech.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "hsl(222,25%,16%)" }}>
                    <div className="w-28 flex-shrink-0">
                      <div className="h-1.5 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min((tech.hits / 20) * 100, 100)}%`, background: heatColor(tech.hits) !== "hsl(222,35%,12%)" ? heatColor(tech.hits) : "transparent" }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 flex-shrink-0 w-20">{tech.id}</span>
                    <span className="text-xs text-slate-300 flex-1">{tech.name}</span>
                    <span className={`font-mono text-sm font-bold ${tech.hits === 0 ? "text-slate-700" : tech.hits < 5 ? "text-emerald-400" : tech.hits < 10 ? "text-yellow-400" : "text-red-400"}`}>
                      {tech.hits}
                    </span>
                    <span className="text-[10px] text-slate-600">hits</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </Layout>
  );
};
