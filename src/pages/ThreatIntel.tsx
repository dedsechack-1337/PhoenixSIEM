import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Search, Hash, Link, Mail, Wifi } from "lucide-react";
import { Layout } from "../components/Layout";
import { threatIntel, IOCType, ThreatCategory } from "../data/mockData";
import { format } from "date-fns";

const categoryConfig: Record<ThreatCategory, { label: string; color: string }> = {
  malware: { label: "Malware", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  phishing: { label: "Phishing", color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
  c2: { label: "C2", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  ransomware: { label: "Ransomware", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  botnet: { label: "Botnet", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  apt: { label: "APT", color: "text-red-400 bg-red-500/15 border-red-400/30" },
  exploit: { label: "Exploit", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
};

const iocIcon: Record<IOCType, React.ReactNode> = {
  ip: <Wifi size={12} />,
  domain: <Globe size={12} />,
  md5: <Hash size={12} />,
  sha256: <Hash size={12} />,
  url: <Link size={12} />,
  email: <Mail size={12} />,
};

const confidenceColor = (score: number) => {
  if (score >= 90) return "text-red-400";
  if (score >= 75) return "text-orange-400";
  if (score >= 60) return "text-yellow-400";
  return "text-slate-400";
};

export const ThreatIntel: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<ThreatCategory | "all">("all");
  const [filterType, setFilterType] = useState<IOCType | "all">("all");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  const filtered = threatIntel.filter(ti => {
    const matchSearch = !search ||
      ti.ioc.toLowerCase().includes(search.toLowerCase()) ||
      ti.description.toLowerCase().includes(search.toLowerCase()) ||
      ti.tags.some(t => t.includes(search.toLowerCase()));
    const matchCat = filterCategory === "all" || ti.category === filterCategory;
    const matchType = filterType === "all" || ti.type === filterType;
    const matchActive = filterActive === "all" || (filterActive === "active" ? ti.active : !ti.active);
    return matchSearch && matchCat && matchType && matchActive;
  });

  return (
    <Layout title="Threat Intelligence" subtitle={`${threatIntel.filter(t=>t.active).length} active IOCs · ${threatIntel.length} total`}>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {(["malware","c2","apt","phishing"] as ThreatCategory[]).map(cat => {
          const count = threatIntel.filter(t => t.category === cat).length;
          const cc = categoryConfig[cat];
          return (
            <div key={cat} className={`rounded-xl border p-4 ${cc.color}`} style={{ background: "hsl(222,35%,11%)" }}>
              <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">{cc.label}</p>
              <p className="text-2xl font-bold font-mono">{count}</p>
              <p className="text-[10px] opacity-50 mt-0.5">IOCs tracked</p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search IOCs, descriptions, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono"
            style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
          />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as ThreatCategory | "all")}
          className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
          style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}>
          <option value="all">All Categories</option>
          {Object.keys(categoryConfig).map(c => <option key={c} value={c}>{categoryConfig[c as ThreatCategory].label}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value as IOCType | "all")}
          className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
          style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}>
          <option value="all">All Types</option>
          {(["ip","domain","md5","sha256","url","email"] as IOCType[]).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
        </select>
        <select value={filterActive} onChange={e => setFilterActive(e.target.value as "all"|"active"|"inactive")}
          className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
          style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}>
          <option value="all">All IOCs</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* IOC Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600 border-b" style={{ borderColor: "hsl(222,25%,16%)" }}>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-3">IOC</div>
          <div className="col-span-3">Description</div>
          <div className="col-span-1">Confidence</div>
          <div className="col-span-1">Last Seen</div>
        </div>
        <div className="divide-y divide-white/3">
          {filtered.map((ti, i) => {
            const cc = categoryConfig[ti.category];
            return (
              <motion.div
                key={ti.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/2 transition-colors items-center"
              >
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ti.active ? "bg-red-400 animate-pulse" : "bg-slate-700"}`} />
                    <span className={`text-[10px] font-mono ${ti.active ? "text-red-400" : "text-slate-600"}`}>
                      {ti.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="col-span-1">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded font-mono uppercase">
                    {iocIcon[ti.type]}
                    {ti.type}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${cc.color}`}>{cc.label}</span>
                </div>
                <div className="col-span-3 font-mono text-[11px] text-slate-300 truncate">{ti.ioc}</div>
                <div className="col-span-3 text-xs text-slate-500 truncate">{ti.description}</div>
                <div className="col-span-1">
                  <span className={`font-mono text-sm font-bold ${confidenceColor(ti.confidence)}`}>
                    {ti.confidence}%
                  </span>
                </div>
                <div className="col-span-1 text-[10px] font-mono text-slate-600">
                  {format(ti.lastSeen, "MMM d")}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
