import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Shield, LayoutDashboard, Bell, Monitor,
  Globe, Search, FileText, Map, Bug, CheckSquare, Users,
  ChevronRight, Activity, Lock
} from "lucide-react";
import { LiveDot } from "./ui/LiveDot";

const navGroups = [
  {
    label: "Core",
    items: [
      { path: "/", label: "Dashboard", icon: LayoutDashboard },
      { path: "/events", label: "Security Events", icon: Activity, badge: "LIVE" },
      { path: "/alerts", label: "Alerts", icon: Bell, badge: "8" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { path: "/threat-intel", label: "Threat Intel", icon: Globe },
      { path: "/mitre", label: "MITRE ATT&CK", icon: Map },
      { path: "/uba", label: "User Behavior", icon: Users },
    ],
  },
  {
    label: "Detection",
    items: [
      { path: "/fim", label: "File Integrity", icon: FileText },
      { path: "/search", label: "Log Search", icon: Search },
    ],
  },
  {
    label: "Management",
    items: [
      { path: "/assets", label: "Assets", icon: Monitor },
      { path: "/vulnerabilities", label: "Vulnerabilities", icon: Bug },
      { path: "/compliance", label: "Compliance", icon: CheckSquare },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col border-r transition-all duration-300 ${
          collapsed ? "w-0 lg:w-16 overflow-hidden" : "w-64"
        }`}
        style={{ background: "hsl(222,42%,7%)", borderColor: "hsl(222,25%,15%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b flex-shrink-0" style={{ borderColor: "hsl(222,25%,15%)" }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Shield size={16} className="text-emerald-400" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-100 tracking-wide">SENTINEL</p>
              <p className="text-[9px] text-emerald-400/80 font-mono tracking-widest uppercase">SIEM v4.7</p>
            </div>
          )}
        </div>

        {/* Live status */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "hsl(152,69%,46%,0.08)", border: "1px solid hsl(152,69%,46%,0.2)" }}>
            <LiveDot />
            <span className="text-xs text-emerald-400 font-mono">SOC ACTIVE</span>
            <span className="ml-auto text-[10px] text-emerald-400/60 font-mono">24/7</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-1">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ path, label, icon: Icon, badge }) => {
                  const isActive = location.pathname === path;
                  return (
                    <NavLink
                      key={path}
                      to={path}
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 group relative ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : "text-slate-400 hover:bg-white/4 hover:text-slate-200"
                      }`}
                    >
                      <Icon size={16} className={`flex-shrink-0 ${isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate font-medium">{label}</span>
                          {badge === "LIVE" && (
                            <span className="text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                              LIVE
                            </span>
                          )}
                          {badge && badge !== "LIVE" && (
                            <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-400/10 border border-orange-400/30 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                              {badge}
                            </span>
                          )}
                          {isActive && <ChevronRight size={12} className="text-emerald-400/50 flex-shrink-0" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-3 border-t flex-shrink-0" style={{ borderColor: "hsl(222,25%,15%)" }}>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Lock size={12} className="text-emerald-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-300 truncate">SOC Analyst</p>
                <p className="text-[10px] text-slate-600 truncate">Level 2 · admin@sentinel.io</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
