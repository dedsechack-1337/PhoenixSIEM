import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShieldAlert, Bell, Monitor, Globe, Search,
  FolderSearch, Grid3X3, Bug, CheckSquare, UserCheck, ChevronRight,
  Flame, Zap, BrainCircuit, Download
} from 'lucide-react';

const navGroups = [
  {
    label: 'Core',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/events', icon: ShieldAlert, label: 'Security Events' },
      { to: '/alerts', icon: Bell, label: 'Alerts' },
      { to: '/assets', icon: Monitor, label: 'Assets' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/threat-intel', icon: Globe, label: 'Threat Intel' },
      { to: '/mitre', icon: Grid3X3, label: 'MITRE ATT&CK' },
      { to: '/search', icon: Search, label: 'Log Search' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { to: '/fim', icon: FolderSearch, label: 'File Integrity' },
      { to: '/vulnerabilities', icon: Bug, label: 'Vulnerabilities' },
      { to: '/compliance', icon: CheckSquare, label: 'Compliance' },
      { to: '/uba', icon: UserCheck, label: 'User Behavior' },
    ],
  },
  {
    label: 'AI & Operations',
    items: [
      { to: '/ai-analysis', icon: BrainCircuit, label: 'AI Analysis', badge: 'NEW' },
      { to: '/notifications', icon: Bell, label: 'Notifications' },
      { to: '/export', icon: Download, label: 'Export Reports' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#080f1e] border-r border-[#1a3050]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1a3050]">
        <div className="relative flex items-center justify-center w-10 h-10">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 opacity-20 blur-sm" />
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-red-600/30 border border-orange-500/40">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold text-base tracking-tight">PhoenixSIEM</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/40">
              <Zap className="w-2.5 h-2.5 text-orange-400" />
              <span className="text-[9px] font-semibold text-orange-400 tracking-wide">AI</span>
            </span>
          </div>
          <div className="text-[10px] text-[#475569] font-mono mt-0.5">v4.8.1 — Enterprise</div>
        </div>
      </div>

      {/* Live status */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1a3050]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
        </span>
        <span className="text-[11px] text-green-400 font-mono">MONITORING ACTIVE</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <div className="px-5 mb-2">
              <span className="text-[10px] font-semibold tracking-widest text-[#475569] uppercase">{group.label}</span>
            </div>
            <ul className="space-y-0.5 px-3">
              {group.items.map(({ to, icon: Icon, label, badge }) => {
                const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
                return (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                        isActive
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25'
                          : 'text-[#94a3b8] hover:bg-[#0d1f35] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-orange-400' : 'text-[#475569] group-hover:text-[#94a3b8]'}`} />
                      <span className="text-sm font-medium">{label}</span>
                      {badge && !isActive && (
                        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-400 tracking-wide">{badge}</span>
                      )}
                      {isActive && <ChevronRight className="w-3 h-3 ml-auto text-orange-400/60" />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#1a3050]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-600/30 border border-orange-500/40 flex items-center justify-center">
            <span className="text-xs font-bold text-orange-400">A1</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">analyst1</div>
            <div className="text-[10px] text-[#475569] truncate">SOC Analyst L2</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
