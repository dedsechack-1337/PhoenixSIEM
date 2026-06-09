import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Shield, Bell, Server, Database,
  Search, FileCheck, Grid, Bug, CheckSquare, Users,
  Activity, Lock
} from 'lucide-react';

const navGroups = [
  {
    label: 'Core',
    items: [
      { path: '/',        icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/events',  icon: Activity,        label: 'Security Events' },
      { path: '/alerts',  icon: Bell,            label: 'Alerts',          badge: 5 },
      { path: '/assets',  icon: Server,          label: 'Assets' },
      { path: '/threat-intel', icon: Database,   label: 'Threat Intel' },
      { path: '/search',  icon: Search,          label: 'Log Search' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { path: '/fim',           icon: FileCheck,  label: 'File Integrity' },
      { path: '/mitre',         icon: Grid,       label: 'MITRE ATT&CK' },
      { path: '/vulnerabilities', icon: Bug,      label: 'Vulnerabilities' },
      { path: '/compliance',    icon: CheckSquare, label: 'Compliance' },
      { path: '/uba',           icon: Users,      label: 'User Behavior' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{ background: 'hsl(222, 40%, 9%)', borderRight: '1px solid hsl(222, 25%, 17%)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid hsl(222, 25%, 17%)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)' }}>
          <Shield size={16} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-sm tracking-wide" style={{ color: '#f1f5f9' }}>SENTINEL</div>
          <div className="text-[10px] font-mono" style={{ color: '#10b981' }}>SIEM v2.4.1</div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-5 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid hsl(222, 25%, 17%)', background: 'rgba(16,185,129,0.05)' }}>
        <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#10b981' }} />
        <span className="text-[11px] font-mono" style={{ color: '#10b981' }}>LIVE MONITORING ACTIVE</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scroll space-y-5">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2" style={{ color: 'hsl(215,15%,38%)' }}>
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium relative group`}
                    style={{
                      background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                      color: isActive ? '#10b981' : 'hsl(215,20%,60%)',
                      border: isActive ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                    }}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r" style={{ background: '#10b981' }} />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid hsl(222, 25%, 17%)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <Lock size={12} style={{ color: '#10b981' }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#f1f5f9' }}>SOC Analyst</p>
            <p className="text-[10px]" style={{ color: 'hsl(215,15%,40%)' }}>Tier 2 • Read/Write</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
