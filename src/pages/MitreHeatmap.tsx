import { useState } from 'react';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { mitreTactics } from '../data/mockData';

function getTotalHits(tactic: typeof mitreTactics[0]) {
  return tactic.techniques.reduce((sum, t) => sum + t.hits, 0);
}

function heatColor(hits: number): string {
  if (hits === 0) return 'bg-transparent border-[rgba(30,63,102,0.5)] text-[#3d5a7a]';
  if (hits <= 5) return 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400';
  if (hits <= 10) return 'bg-orange-900/40 border-orange-600/50 text-orange-400';
  return 'bg-red-900/40 border-red-600/50 text-red-400';
}

function heatLabel(hits: number): string {
  if (hits === 0) return 'None';
  if (hits <= 5) return 'Low';
  if (hits <= 10) return 'Medium';
  return 'High';
}

function heatBarColor(hits: number): string {
  if (hits === 0) return 'bg-[#1a3050]';
  if (hits <= 5) return 'bg-yellow-500';
  if (hits <= 10) return 'bg-orange-500';
  return 'bg-red-500';
}

export function MitreHeatmap() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalHits = mitreTactics.reduce((sum, t) => sum + getTotalHits(t), 0);
  const coveredTactics = mitreTactics.filter((t) => getTotalHits(t) > 0).length;
  const coverageScore = Math.round((coveredTactics / mitreTactics.length) * 100);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tactics Monitored', value: `${coveredTactics}/${mitreTactics.length}`, color: 'text-orange-400' },
          { label: 'Coverage Score', value: `${coverageScore}%`, color: coverageScore >= 80 ? 'text-green-400' : 'text-yellow-400' },
          { label: 'Total Technique Hits', value: totalHits, color: 'text-white' },
          { label: 'High Activity Tactics', value: mitreTactics.filter((t) => getTotalHits(t) > 10).length, color: 'text-red-400' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="py-4">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#3d5a7a] mt-1">{s.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs">
        <span className="text-[#3d5a7a]">Frequency:</span>
        {[
          { label: 'None', cls: 'bg-transparent' },
          { label: 'Low (1–5)', cls: 'bg-yellow-500/50' },
          { label: 'Medium (6–10)', cls: 'bg-orange-500/50' },
          { label: 'High (11+)', cls: 'bg-red-500/50' },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${cls}`} />
            <span className="text-[#8ba8c8]">{label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {mitreTactics.map((tactic) => {
          const hits = getTotalHits(tactic);
          const isExpanded = expanded === tactic.id;
          return (
            <div
              key={tactic.id}
              className={`rounded-xl border cursor-pointer transition-all duration-200 ${heatColor(hits)} ${isExpanded ? 'md:col-span-2' : ''}`}
              onClick={() => setExpanded(isExpanded ? null : tactic.id)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-mono text-[#3d5a7a] mb-1">{tactic.id}</div>
                    <div className="text-sm font-semibold text-white">{tactic.name}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Activity className="w-3 h-3 opacity-60" />
                      <span className="text-xs font-mono font-semibold">{hits} hits</span>
                      <span className="text-[10px] opacity-60">— {heatLabel(hits)}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 opacity-60 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 opacity-60 flex-shrink-0 mt-1" />}
                </div>

                {/* Mini heat bar */}
                <div className="mt-3 h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${heatBarColor(hits)} transition-all`}
                    style={{ width: hits > 0 ? `${Math.min((hits / 20) * 100, 100)}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Expanded techniques */}
              {isExpanded && (
                <div className="border-t border-white/10 px-4 pb-4">
                  <div className="text-[10px] uppercase tracking-wider text-[#3d5a7a] mt-3 mb-2">Techniques Detected</div>
                  <div className="space-y-2">
                    {tactic.techniques.map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] text-orange-400">{tech.id}</span>
                          <span className="text-xs text-[#8ba8c8] ml-2">{tech.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-12 h-1 bg-black/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${heatBarColor(tech.hits)}`}
                              style={{ width: `${Math.min((tech.hits / 20) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-white w-4 text-right">{tech.hits}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
