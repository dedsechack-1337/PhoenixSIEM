import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Terminal, Clock, ChevronRight } from "lucide-react";
import { Layout } from "../components/Layout";
import { securityEvents } from "../data/mockData";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { format } from "date-fns";

const EXAMPLE_QUERIES = [
  'source:"Suricata IDS" severity:critical',
  'host:workstation-14 type:malware',
  'sourceIp:185.220.101.45',
  'mitre:T1486 OR mitre:T1490',
  'user:jsmith lateral_movement',
  'brute_force last:1h',
];

export const LogSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(securityEvents.slice(0, 5));
  const [searched, setSearched] = useState(false);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const handleSearch = () => {
    if (!query.trim()) {
      setResults(securityEvents);
      setSearched(true);
      return;
    }
    const q = query.toLowerCase();
    const filtered = securityEvents.filter(e =>
      e.rawLog.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.host.toLowerCase().includes(q) ||
      e.sourceIp.includes(q) ||
      e.source.toLowerCase().includes(q) ||
      (e.user?.toLowerCase().includes(q) ?? false) ||
      (e.mitreTechnique?.toLowerCase().includes(q) ?? false) ||
      e.type.includes(q) ||
      e.severity.includes(q)
    );
    setResults(filtered);
    setSearched(true);
  };

  return (
    <Layout title="Log Search" subtitle="Raw log investigation across all event sources">
      <div className="max-w-5xl">
        {/* Search bar */}
        <div className="rounded-xl border p-4 mb-5" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Terminal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                placeholder='Search logs... e.g. source:"Suricata" severity:critical host:web-prod-01'
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono"
                style={{ background: "hsl(222,47%,6%)", border: "1px solid hsl(222,25%,18%)" }}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-emerald-900 bg-emerald-400 hover:bg-emerald-300 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Example queries */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest flex items-center">Examples:</span>
            {EXAMPLE_QUERIES.map(q => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 px-2 py-0.5 rounded border border-white/8 hover:border-emerald-400/30 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {searched && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Search size={14} className="text-slate-500" />
                <span className="text-sm text-slate-400">
                  Found <span className="text-emerald-400 font-mono font-bold">{results.length}</span> matching log entries
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-600 font-mono">
                <Clock size={12} />
                Scanned 4,821 events in 0.042s
              </div>
            </div>

            <div className="space-y-2">
              {results.map((evt, i) => (
                <motion.div
                  key={evt.id + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl border overflow-hidden cursor-pointer"
                  style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}
                  onClick={() => setSelectedLog(selectedLog === evt.id ? null : evt.id)}
                >
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/2 transition-colors">
                    <SeverityBadge severity={evt.severity} size="sm" />
                    <span className="font-mono text-[10px] text-slate-600 flex-shrink-0">
                      {format(evt.timestamp, "yyyy-MM-dd HH:mm:ss")}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">[{evt.source}]</span>
                    <span className="text-xs text-slate-300 flex-1 truncate">{evt.description}</span>
                    <ChevronRight size={12} className={`flex-shrink-0 text-slate-600 transition-transform ${selectedLog === evt.id ? "rotate-90" : ""}`} />
                  </div>

                  {selectedLog === evt.id && (
                    <div className="border-t px-4 py-4" style={{ borderColor: "hsl(222,25%,16%)", background: "hsl(222,35%,9%)" }}>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        {[
                          { label: "Host", value: evt.host },
                          { label: "Source IP", value: evt.sourceIp },
                          { label: "Dest IP", value: evt.destIp || "—" },
                          { label: "User", value: evt.user || "—" },
                          { label: "Rule ID", value: evt.ruleId },
                          { label: "Event Type", value: evt.type },
                          { label: "MITRE Tactic", value: evt.mitreTactic || "—" },
                          { label: "MITRE Technique", value: evt.mitreTechnique || "—" },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">{label}</p>
                            <p className="text-[11px] font-mono text-slate-300 truncate">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Terminal size={10} /> Raw Log
                        </p>
                        <pre className="text-[11px] font-mono text-emerald-400/80 p-3 rounded-lg overflow-x-auto" style={{ background: "hsl(222,47%,6%)" }}>
                          {evt.rawLog}
                        </pre>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!searched && (
          <div className="text-center py-20">
            <Terminal size={40} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Enter a search query to investigate logs</p>
            <p className="text-slate-700 text-xs mt-1 font-mono">Supports full-text search across 4,821 events</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
