import { useLocation } from 'react-router-dom';
import { Bell, Settings, HelpCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export function TopBar() {
  const location = useLocation();
  const info = titles[location.pathname] || { title: 'PhoenixSIEM', subtitle: '' };
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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

        {/* Action buttons */}
        {[
          { Icon: RefreshCw, title: 'Refresh', onClick: () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 900); }, extra: refreshing ? 'animate-spin' : '' },
          { Icon: HelpCircle, title: 'Help' },
        ].map(({ Icon, title, onClick, extra }) => (
          <button key={title} onClick={onClick} title={title}
            className={`p-2 rounded-lg transition-all ${extra}`}
            style={{ color: '#3d5a7a', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f0f6ff'; e.currentTarget.style.background = 'rgba(22,45,74,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#3d5a7a'; e.currentTarget.style.background = 'transparent'; }}>
            <Icon className="w-4 h-4" />
          </button>
        ))}

        {/* Notification bell with HDR dot */}
        <button className="relative p-2 rounded-lg transition-all" title="Alerts"
          style={{ color: '#3d5a7a' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f0f6ff'; e.currentTarget.style.background = 'rgba(22,45,74,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#3d5a7a'; e.currentTarget.style.background = 'transparent'; }}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#ff2040', boxShadow: '0 0 6px rgba(255,32,64,0.8), 0 0 12px rgba(255,32,64,0.4)' }} />
        </button>

        <button className="p-2 rounded-lg transition-all" title="Settings"
          style={{ color: '#3d5a7a' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f0f6ff'; e.currentTarget.style.background = 'rgba(22,45,74,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#3d5a7a'; e.currentTarget.style.background = 'transparent'; }}>
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
