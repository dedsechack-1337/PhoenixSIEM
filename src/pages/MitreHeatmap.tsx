import { useState } from 'react';
import { ChevronDown, ChevronUp, Target } from 'lucide-react';
import Card from '../components/ui/Card';
import { mitreTactics } from '../data';

const getHeatColor = (hits: number): string => {
  if (hits === 0) return 'hsl(222,33%,14%)';
  if (hits <= 2) return 'rgba(16,185,129,0.2)';
  if (hits <= 4) return 'rgba(234,179,8,0.3)';
  if (hits <= 6) return 'rgba(249,115,22,0.35)';
  return 'rgba(239,68,68,0.4)';
};

const getTextColor = (hits: number): string => {
  if (hits === 0) return 'hsl(215,15%,35%)';
  if (hits <= 2) return '#10b981';
  if (hits <= 4) return '#eab308';
  if (hits <= 6) return '#f97316';
  return '#ef4444';
};

const totalHits = mitreTactics.reduce((sum, t) => sum + t.techniques.reduce((s, tech) => s + tech.hits, 0), 0);
const tacticsCovered = mitreTactics.filter(t => t.techniques.some(tech => tech.hits > 0)).length;
const coverageScore = Math.round((tacticsCovered / mitreTactics.length) * 100);

export default function MitreHeatmap() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>MITRE ATT&CK Heatmap</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
            Technique coverage across {mitreTactics.length} tactics · {totalHits} total detections
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono" style={{ color: '#10b981' }}>{coverageScore}%</div>
          <div className="text-xs" style={{ color: 'hsl(215,15%,45%)' }}>Coverage Score</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs">
        <span style={{ color: 'hsl(215,15%,45%)' }}>Frequency:</span>
        {[
          { label: 'None', color: 'hsl(222,33%,14%)', text: 'hsl(215,15%,35%)' },
          { label: 'Low (1-2)', color: 'rgba(16,185,129,0.2)', text: '#10b981' },
          { label: 'Medium (3-4)', color: 'rgba(234,179,8,0.3)', text: '#eab308' },
          { label: 'High (5-6)', color: 'rgba(249,115,22,0.35)', text: '#f97316' },
          { label: 'Critical (7+)', color: 'rgba(239,68,68,0.4)', text: '#ef4444' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ background: l.color, border: `1px solid ${l.text}30` }} />
            <span style={{ color: 'hsl(215,20%,55%)' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {mitreTactics.map(tactic => {
          const tacticHits = tactic.techniques.reduce((sum, t) => sum + t.hits, 0);
          const isExpanded = expanded === tactic.id;
          return (
            <Card
              key={tactic.id}
              className="overflow-hidden cursor-pointer"
              onClick={() => setExpanded(isExpanded ? null : tactic.id)}
            >
              {/* Tactic header */}
              <div
                className="p-3"
                style={{
                  background: getHeatColor(tacticHits),
                  borderBottom: isExpanded ? '1px solid hsl(222,22%,18%)' : 'none',
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'hsl(215,15%,40%)' }}>
                      {tactic.id}
                    </div>
                    <div className="text-xs font-semibold leading-tight" style={{ color: '#f1f5f9' }}>{tactic.name}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xl font-bold font-mono" style={{ color: getTextColor(tacticHits) }}>{tacticHits}</span>
                    {isExpanded ? <ChevronUp size={12} style={{ color: 'hsl(215,15%,40%)' }} /> : <ChevronDown size={12} style={{ color: 'hsl(215,15%,40%)' }} />}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tactic.techniques.map(tech => (
                    <div
                      key={tech.id}
                      className="w-3 h-3 rounded-sm"
                      title={`${tech.id}: ${tech.name} (${tech.hits} hits)`}
                      style={{ background: getHeatColor(tech.hits), border: `1px solid ${getTextColor(tech.hits)}40` }}
                    />
                  ))}
                </div>
              </div>

              {/* Expanded techniques */}
              {isExpanded && (
                <div className="p-3 space-y-2">
                  {tactic.techniques.map(tech => (
                    <div key={tech.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] flex-shrink-0" style={{ color: '#a78bfa' }}>{tech.id}</span>
                        <span className="truncate" style={{ color: 'hsl(215,20%,60%)' }}>{tech.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222,22%,20%)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(tech.hits / 10 * 100, 100)}%`,
                              background: getTextColor(tech.hits),
                            }}
                          />
                        </div>
                        <span className="font-mono w-4 text-right font-bold" style={{ color: getTextColor(tech.hits) }}>{tech.hits}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Target size={16} style={{ color: '#10b981' }} />
          <h3 className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>Coverage Summary</h3>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold font-mono" style={{ color: '#10b981' }}>{tacticsCovered}/{mitreTactics.length}</div>
            <div className="text-xs mt-1" style={{ color: 'hsl(215,15%,45%)' }}>Tactics Detected</div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono" style={{ color: '#38bdf8' }}>
              {mitreTactics.reduce((sum, t) => sum + t.techniques.filter(tech => tech.hits > 0).length, 0)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'hsl(215,15%,45%)' }}>Techniques Detected</div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono" style={{ color: '#ef4444' }}>
              {mitreTactics.reduce((sum, t) => sum + t.techniques.filter(tech => tech.hits >= 7).length, 0)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'hsl(215,15%,45%)' }}>Critical Frequency</div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono" style={{ color: '#a78bfa' }}>{totalHits}</div>
            <div className="text-xs mt-1" style={{ color: 'hsl(215,15%,45%)' }}>Total Detections</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
