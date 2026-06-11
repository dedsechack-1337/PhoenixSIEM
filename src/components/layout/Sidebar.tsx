import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShieldAlert, Bell, Monitor, Globe, Search,
  FolderSearch, Grid3X3, Bug, CheckSquare, UserCheck, ChevronRight,
  Zap, BrainCircuit, Download, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navGroups = [
  {
    label: 'Core',
    items: [
      { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/events',      icon: ShieldAlert,     label: 'Security Events' },
      { to: '/alerts',      icon: Bell,            label: 'Alerts' },
      { to: '/assets',      icon: Monitor,         label: 'Assets' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/threat-intel', icon: Globe,    label: 'Threat Intel' },
      { to: '/mitre',        icon: Grid3X3,  label: 'MITRE ATT&CK' },
      { to: '/search',       icon: Search,   label: 'Log Search' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { to: '/fim',             icon: FolderSearch, label: 'File Integrity' },
      { to: '/vulnerabilities', icon: Bug,          label: 'Vulnerabilities' },
      { to: '/compliance',      icon: CheckSquare,  label: 'Compliance' },
      { to: '/uba',             icon: UserCheck,    label: 'User Behavior' },
    ],
  },
  {
    label: 'AI & Operations',
    items: [
      { to: '/ai-analysis',   icon: BrainCircuit, label: 'AI Analysis',    badge: 'NEW' },
      { to: '/notifications', icon: Bell,         label: 'Notifications' },
      { to: '/export',        icon: Download,     label: 'Export Reports' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar-3d fixed inset-y-0 left-0 z-40 w-64 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(30,63,102,0.4)' }}>
        <div className="relative w-10 h-10 flex-shrink-0">
          <div className="absolute inset-0 rounded-full blur-md" style={{ background: 'rgba(255,107,26,0.3)' }} />
          <img
            src="phoenix-logo.png"
            alt="PhoenixSIEM"
            className="relative w-10 h-10 object-contain"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,26,0.7)) drop-shadow(0 0 16px rgba(255,107,26,0.4))' }}
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight" style={{ color: '#f0f6ff' }}>PhoenixSIEM</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wide"
              style={{ background: 'rgba(255,107,26,0.15)', border: '1px solid rgba(255,107,26,0.4)', color: '#ff8c3a',
                boxShadow: '0 0 8px rgba(255,107,26,0.2)' }}>
              <Zap className="w-2.5 h-2.5" />AI
            </span>
          </div>
          <div className="text-[10px] font-mono mt-0.5" style={{ color: '#3d5a7a' }}>v4.8.1 — Enterprise</div>
        </div>
      </div>

      {/* Live status */}
      <div className="flex items-center gap-2.5 px-5 py-3" style={{ borderBottom: '1px solid rgba(30,63,102,0.3)', background: 'rgba(0,255,136,0.02)' }}>
        <div className="live-dot flex-shrink-0" />
        <span className="text-[11px] font-mono font-semibold tracking-wider" style={{ color: '#00ff88' }}>MONITORING ACTIVE</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="px-5 mb-2">
              <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#3d5a7a' }}>{group.label}</span>
            </div>
            <ul className="space-y-0.5 px-3">
              {group.items.map(({ to, icon: Icon, label, badge }) => {
                const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
                return (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                        isActive ? 'nav-item-active' : ''
                      }`}
                      style={!isActive ? { color: '#8ba8c8' } : {}}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? '' : 'opacity-60 group-hover:opacity-100'}`}
                        style={{ color: isActive ? '#ff8c3a' : undefined }} />
                      <span className="text-sm font-medium">{label}</span>
                      {badge && !isActive && (
                        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(255,107,26,0.15)', border: '1px solid rgba(255,107,26,0.4)',
                            color: '#ff8c3a', boxShadow: '0 0 6px rgba(255,107,26,0.2)' }}>
                          {badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: 'rgba(255,140,58,0.5)' }} />}
                      {/* Active left glow line */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                          style={{ background: 'linear-gradient(180deg,#ff8c3a,#ff6b1a)', boxShadow: '0 0 6px rgba(255,107,26,0.6)' }} />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      {user && (
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(30,63,102,0.4)', background: 'rgba(1,4,9,0.4)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(255,107,26,0.3),rgba(200,60,0,0.2))',
                border: '1px solid rgba(255,107,26,0.4)', boxShadow: '0 0 8px rgba(255,107,26,0.2)' }}>
              <span className="text-xs font-bold" style={{ color: '#ff8c3a' }}>{user.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: '#f0f6ff' }}>{user.username}</div>
              <div className="text-[10px] truncate" style={{ color: '#3d5a7a' }}>{user.role}</div>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: '#3d5a7a' }}
              title="Logout"
              onMouseEnter={e => (e.currentTarget.style.color = '#ff2040')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3d5a7a')}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
