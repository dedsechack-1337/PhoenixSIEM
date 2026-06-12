import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, HelpCircle, RefreshCw, X, AlertTriangle, ShieldAlert, LogOut, User as UserIcon, Palette, Database } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { alerts } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/':               { title: 'Security Dashboard',        subtitle: 'Real-time threat monitoring & analytics' },
  '/events':         { title: 'Security Events',           subtitle: 'Live event feed — 40+ monitored types' },
  '/alerts':         { title: 'Alert Management',          subtitle: 'Correlated alerts with MITRE ATT&CK mapping' },
  '/assets':         { title: 'Asset Inventory',           subtitle: 'Endpoint & network device management' },
  '/threat-intel':   { title: 'Threat Intelligence',       subtitle: 'IOC database & threat feed management' },
  '/search':         { title: 'Log Search',                subtitle: 'Raw log investigation & forensic search' },
  '/fim':            { title: 'File Integrity Monitoring', subtitle: 'Real-time file change detection' },
  '/mitre':          { title: 'MITRE ATT&CK Heatmap',     subtitle: 'Technique coverage & detection mapping' },
  '/vulnerabilities':{ title: 'Vulnerability Management',  subtitle: 'CVE tracking & patch management' },
  '/compliance':     { title: 'Compliance Center',         subtitle: 'PCI-DSS, HIPAA, NIST, SOC2, ISO27001' },
  '/uba':            { title: 'User Behavior Analytics',   subtitle: 'AI-powered anomaly & insider threat detection' },
  '/ai-analysis':    { title: 'Phoenix AI Analysis',       subtitle: 'Claude-powered threat analysis with live SIEM context' },
  '/notifications':  { title: 'Alert Notifications',       subtitle: 'Email & Slack channel management' },
  '/export':         { title: 'Export Reports',            subtitle: 'Download SIEM data as CSV or HTML' },
};

const btnStyle: React.CSSProperties = { color: '#3d5a7a', background: 'transparent' };
const onEnter = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = '#f0f6ff'; e.currentTarget.style.background = 'rgba(22,45,74,0.5)'; };
const onLeave = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = '#3d5a7a'; e.currentTarget.style.background = 'transparent'; };

const panelStyle: React.CSSProperties = {
  position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 360,
  background: 'linear-gradient(150deg, rgba(10,22,44,0.99) 0%, rgba(5,12,26,0.99) 100%)',
  border: '1px solid rgba(30,63,102,0.6)', borderRadius: 12,
  boxShadow: '0 12px 40px rgba(1,4,9,0.8), inset 0 1px 0 rgba(255,255,255,0.04)',
  zIndex: 100, overflow: 'hidden',
};

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const info = titles[location.pathname] || { title: 'PhoenixSIEM', subtitle: '' };
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close panels on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setShowSettings(false);
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setShowHelp(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 6);
  const unreadCount = criticalAlerts.filter(a => !readIds.has(a.id)).length;

  const markAllRead = () => setReadIds(new Set(criticalAlerts.map(a => a.id)));

  return (
    <header className="topbar-3d fixed top-0 left-64 right-0 z-30 flex items-center justify-between px-6 py-3.5">
      {/* Page title */}
      <div>
        <h1 className="text-base font-bold tracking-tight" style={{ color: '#f0f6ff', lineHeight: 1.3 }}>{info.title}</h1>
        <p className="text-xs mt-1" style={{ color: '#3d5a7a', lineHeight: 1.4 }}>{info.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Clock */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-mono font-semibold" style={{ color: '#8ba8c8', lineHeight: 1.3 }}>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
          </span>
          <span className="text-[10px] font-mono mt-0.5" style={{ color: '#3d5a7a', lineHeight: 1.3 }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="w-px h-8" style={{ background: 'rgba(30,63,102,0.6)' }} />

        {/* Refresh */}
        <button onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 900); }} title="Refresh"
          className={`p-2 rounded-lg transition-all ${refreshing ? 'animate-spin' : ''}`}
          style={btnStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Help */}
        <div ref={helpRef} style={{ position: 'relative' }}>
          <button onClick={() => { setShowHelp(v => !v); setShowNotifs(false); setShowSettings(false); }} title="Help"
            className="p-2 rounded-lg transition-all" style={btnStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <HelpCircle className="w-4 h-4" />
          </button>
          {showHelp && (
            <div style={{ ...panelStyle, width: 300 }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(30,63,102,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>Help & Resources</span>
                <button onClick={() => setShowHelp(false)} style={{ background: 'none', border: 'none', color: '#3d5a7a', cursor: 'pointer' }}><X size={14} /></button>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Documentation', desc: 'Platform guides & API reference' },
                  { label: 'Keyboard Shortcuts', desc: 'Speed up your workflow' },
                  { label: 'Contact SOC Support', desc: '24/7 enterprise support line' },
                  { label: 'Report an Issue', desc: 'Send feedback to the dev team' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(30,63,102,0.4)', background: 'rgba(8,20,42,0.6)' }}>
                    <div style={{ fontSize: 12.5, color: '#f0f6ff', fontWeight: 600, lineHeight: 1.4 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#3d5a7a', marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: '#3d5a7a', textAlign: 'center', marginTop: 4, fontFamily: 'monospace' }}>PhoenixSIEM v6.5.7</div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button onClick={() => { setShowNotifs(v => !v); setShowHelp(false); setShowSettings(false); }}
            className="relative p-2 rounded-lg transition-all" title="Alerts"
            style={btnStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center rounded-full"
                style={{ minWidth: 14, height: 14, padding: '0 3px', fontSize: 9, fontWeight: 700, fontFamily: 'monospace',
                  background: '#ff2040', color: '#fff', boxShadow: '0 0 8px rgba(255,32,64,0.7)' }}>
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div style={panelStyle}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(30,63,102,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>Notifications</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={markAllRead} style={{ fontSize: 11, color: '#ff8c3a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>
                  <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', color: '#3d5a7a', cursor: 'pointer' }}><X size={14} /></button>
                </div>
              </div>
              <div style={{ maxHeight: 360, overflowY: 'auto' }} className="custom-scrollbar">
                {criticalAlerts.map(a => {
                  const unread = !readIds.has(a.id);
                  return (
                    <div key={a.id} onClick={() => setReadIds(prev => new Set(prev).add(a.id))}
                      style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(22,45,74,0.35)',
                        background: unread ? 'rgba(255,107,26,0.04)' : 'transparent', cursor: 'pointer' }}>
                      <div style={{ flexShrink: 0, marginTop: 2 }}>
                        {a.severity === 'critical'
                          ? <ShieldAlert size={15} color="#ff2040" />
                          : <AlertTriangle size={15} color="#ff8c3a" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: '#f0f6ff', lineHeight: 1.4, fontWeight: unread ? 600 : 400 }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: '#3d5a7a', marginTop: 3, lineHeight: 1.4 }}>
                          {a.mitreId} · {formatDistanceToNow(a.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                      {unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff8c3a', flexShrink: 0, marginTop: 5, boxShadow: '0 0 6px rgba(255,140,58,0.7)' }} />}
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(30,63,102,0.5)' }}>
                <button onClick={() => { setShowNotifs(false); navigate('/alerts'); }}
                  style={{ width: '100%', textAlign: 'center', fontSize: 12, color: '#ff8c3a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  View all alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div ref={settingsRef} style={{ position: 'relative' }}>
          <button onClick={() => { setShowSettings(v => !v); setShowHelp(false); setShowNotifs(false); }}
            className="p-2 rounded-lg transition-all" title="Settings"
            style={btnStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <Settings className="w-4 h-4" />
          </button>
          {showSettings && (
            <div style={panelStyle}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(30,63,102,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>Settings</span>
                <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#3d5a7a', cursor: 'pointer' }}><X size={14} /></button>
              </div>

              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid rgba(30,63,102,0.4)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg,rgba(255,107,26,0.3),rgba(200,60,0,0.2))', border: '1px solid rgba(255,107,26,0.4)' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ff8c3a' }}>{user.avatar}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff', lineHeight: 1.3 }}>{user.username}</div>
                    <div style={{ fontSize: 11, color: '#3d5a7a', lineHeight: 1.3, marginTop: 2 }}>{user.email}</div>
                  </div>
                </div>
              )}

              <div style={{ padding: 8 }}>
                {[
                  { Icon: UserIcon, label: 'Account Profile', desc: user?.role },
                  { Icon: Palette, label: 'Appearance', desc: 'HDR Dark · Phoenix Theme' },
                  { Icon: Database, label: 'Data & Retention', desc: '90-day log retention' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,107,26,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <item.Icon size={16} color="#7a9bbf" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: '#f0f6ff', fontWeight: 500, lineHeight: 1.4 }}>{item.label}</div>
                      {item.desc && <div style={{ fontSize: 11, color: '#3d5a7a', lineHeight: 1.4 }}>{item.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '8px 8px 12px' }}>
                <button onClick={() => { logout(); navigate('/login'); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 8,
                    background: 'rgba(255,32,64,0.06)', border: '1px solid rgba(255,32,64,0.25)', color: '#ff5070', cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
