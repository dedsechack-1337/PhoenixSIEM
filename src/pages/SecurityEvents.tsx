import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronRight, Terminal } from "lucide-react";
import { Layout } from "../components/Layout";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { LiveDot } from "../components/ui/LiveDot";
import { securityEvents, Severity, EventType, SecurityEvent } from "../data/mockData";
import { format } from "date-fns";

const severityOptions: Severity[] = ["critical", "high", "medium", "low", "info"];
const typeOptions: EventType[] = [
  "intrusion", "malware", "brute_force", "port_scan", "data_exfiltration",
  "privilege_escalation", "lateral_movement", "phishing", "ransomware",
  "c2_communication", "policy_violation", "authentication", "network_anomaly", "vulnerability_exploit"
];

const typeLabel: Record<EventType, string> = {
  intrusion: "Intrusion",
  malware: "Malware",
  brute_force: "Brute Force",
  port_scan: "Port Scan",
  data_exfiltration: "Data Exfil",
  privilege_escalation: "Priv Escalation",
  lateral_movement: "Lateral Movement",
  phishing: "Phishing",
  ransomware: "Ransomware",
  c2_communication: "C2 Comms",
  policy_violation: "Policy Violation",
  authentication: "Authentication",
  network_anomaly: "Network Anomaly",
  vulnerability_exploit: "Vuln Exploit",
};

const typeColor: Record<EventType, string> = {
  intrusion: "text-red-400 bg-red-400/10 border-red-400/20",
  malware: "text-red-400 bg-red-400/10 border-red-400/20",
  brute_force: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  port_scan: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  data_exfiltration: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  privilege_escalation: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  lateral_movement: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  phishing: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  ransomware: "text-red-400 bg-red-400/10 border-red-400/20",
  c2_communication: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  policy_violation: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  authentication: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  network_anomaly: "text-teal-400 bg-teal-400/10 border-teal-400/20",
  vulnerability_exploit: "text-red-400 bg-red-400/10 border-red-400/20",
};

export const SecurityEvents: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | "all">("all");
  const [selectedType, setSelectedType] = useState<EventType | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [liveEvents, setLiveEvents] = useState<SecurityEvent[]>([...securityEvents]);


  // Simulate live events
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = { ...securityEvents[Math.floor(Math.random() * securityEvents.length)] };
      randomEvent.id = `live-${Date.now()}`;
      randomEvent.timestamp = new Date();
      setLiveEvents(prev => [randomEvent, ...prev].slice(0, 60));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = liveEvents.filter(evt => {
    const matchSearch = !search ||
      evt.description.toLowerCase().includes(search.toLowerCase()) ||
      evt.host.toLowerCase().includes(search.toLowerCase()) ||
      evt.sourceIp.includes(search) ||
      (evt.user?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchSeverity = selectedSeverity === "all" || evt.severity === selectedSeverity;
    const matchType = selectedType === "all" || evt.type === selectedType;
    return matchSearch && matchSeverity && matchType;
  });

  return (
    <Layout title="Security Events" subtitle={`Live feed · ${liveEvents.length} events loaded`}>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search events, IPs, hosts, users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono"
            style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
          />
        </div>

        <select
          value={selectedSeverity}
          onChange={e => setSelectedSeverity(e.target.value as Severity | "all")}
          className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
          style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
        >
          <option value="all">All Severities</option>
          {severityOptions.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as EventType | "all")}
          className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
          style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
        >
          <option value="all">All Types</option>
          {typeOptions.map(t => <option key={t} value={t}>{typeLabel[t]}</option>)}
        </select>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono" style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}>
          <LiveDot size="sm" />
          <span className="text-emerald-400">{filtered.length} events</span>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600 border-b" style={{ borderColor: "hsl(222,25%,16%)" }}>
          <div className="col-span-1">Severity</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-3">Host / Source IP</div>
          <div className="col-span-4">Description</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          <AnimatePresence initial={false}>
            {filtered.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, backgroundColor: "hsl(152,69%,46%,0.1)" }}
                animate={{ opacity: 1, backgroundColor: "transparent" }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="grid grid-cols-12 gap-2 px-4 py-2.5 cursor-pointer hover:bg-white/2 transition-colors items-center"
                  onClick={() => setExpandedId(expandedId === evt.id ? null : evt.id)}
                  style={{ borderBottom: "1px solid hsl(222,25%,14%)" }}
                >
                  <div className="col-span-1">
                    <SeverityBadge severity={evt.severity} size="sm" />
                  </div>
                  <div className="col-span-2 font-mono text-[11px] text-slate-500">
                    {format(evt.timestamp, "HH:mm:ss")}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${typeColor[evt.type]}`}>
                      {typeLabel[evt.type]}
                    </span>
                  </div>
                  <div className="col-span-3 font-mono text-[11px]">
                    <div className="text-slate-300 truncate">{evt.host}</div>
                    <div className="text-slate-600">{evt.sourceIp}</div>
                  </div>
                  <div className="col-span-3 text-xs text-slate-400 truncate">{evt.description}</div>
                  <div className="col-span-1 flex justify-end">
                    {expandedId === evt.id ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-600" />}
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {expandedId === evt.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 border-t" style={{ background: "hsl(222,35%,9%)", borderColor: "hsl(222,25%,16%)" }}>
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Rule ID</p>
                          <p className="text-xs font-mono text-slate-300">{evt.ruleId}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Destination IP</p>
                          <p className="text-xs font-mono text-slate-300">{evt.destIp || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">User</p>
                          <p className="text-xs font-mono text-slate-300">{evt.user || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">MITRE</p>
                          <p className="text-xs font-mono text-emerald-400">{evt.mitreTechnique || "—"}</p>
                        </div>
                        <div className="col-span-2 lg:col-span-4">
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Terminal size={10} /> Raw Log</p>
                          <pre className="text-[11px] font-mono text-slate-400 p-2 rounded overflow-x-auto" style={{ background: "hsl(222,47%,6%)" }}>
                            {evt.rawLog}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};
