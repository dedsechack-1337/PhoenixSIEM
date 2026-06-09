import { useLocation } from 'react-router-dom';
import { Bell, Settings, HelpCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react'; // eslint-disable-line

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Security Dashboard', subtitle: 'Real-time threat monitoring & event analytics' },
  '/events': { title: 'Security Events', subtitle: 'Live event feed — 40+ monitored event types' },
  '/alerts': { title: 'Alert Management', subtitle: 'Correlated alerts with MITRE ATT&CK mapping' },
  '/assets': { title: 'Asset Inventory', subtitle: 'Endpoint & network device management' },
  '/threat-intel': { title: 'Threat Intelligence', subtitle: 'IOC database & threat feed management' },
  '/search': { title: 'Log Search', subtitle: 'Raw log investigation & forensic search' },
  '/fim': { title: 'File Integrity Monitoring', subtitle: 'Real-time file change detection & alerting' },
  '/mitre': { title: 'MITRE ATT&CK Heatmap', subtitle: 'Technique coverage & detection mapping' },
  '/vulnerabilities': { title: 'Vulnerability Management', subtitle: 'CVE tracking, CVSS scoring & patch management' },
  '/compliance': { title: 'Compliance Center', subtitle: 'PCI-DSS, HIPAA, NIST, SOC2, ISO27001 tracking' },
  '/uba': { title: 'User Behavior Analytics', subtitle: 'AI-powered anomaly detection & insider threat' },
};

export function TopBar() {
  const location = useLocation();
  const info = titles[location.pathname] || { title: 'PhoenixSIEM', subtitle: '' };
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="fixed top-0 left-64 right-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[#080f1e]/90 backdrop-blur border-b border-[#1a3050]">
      <div>
        <h1 className="text-base font-semibold text-white">{info.title}</h1>
        <p className="text-xs text-[#475569]">{info.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Clock */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-mono text-[#94a3b8]">{timeStr} UTC</span>
          <span className="text-[10px] text-[#475569]">{dateStr}</span>
        </div>

        <div className="w-px h-8 bg-[#1a3050]" />

        {/* Actions */}
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-lg text-[#475569] hover:text-white hover:bg-[#0d1f35] transition-all ${refreshing ? 'animate-spin text-orange-400' : ''}`}
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg text-[#475569] hover:text-white hover:bg-[#0d1f35] transition-all" title="Help">
          <HelpCircle className="w-4 h-4" />
        </button>
        <button className="relative p-2 rounded-lg text-[#475569] hover:text-white hover:bg-[#0d1f35] transition-all" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
        </button>
        <button className="p-2 rounded-lg text-[#475569] hover:text-white hover:bg-[#0d1f35] transition-all" title="Settings">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
