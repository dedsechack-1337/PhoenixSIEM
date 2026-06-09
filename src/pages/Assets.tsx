import { useState } from 'react';
import { Server, Monitor, Network, Plus, X, Check, Copy } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { assets } from '../data';

const osColors: Record<string, string> = {
  Windows: '#38bdf8', Linux: '#10b981', macOS: '#a78bfa', 'Network OS': '#f97316', Android: '#eab308', iOS: '#f472b6',
};

const typeIcons: Record<string, any> = {
  workstation: Monitor, server: Server, network: Network, mobile: Monitor, cloud: Server,
};

const riskColor = (score: number) => {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f97316';
  if (score >= 40) return '#eab308';
  return '#10b981';
};

const installScripts: Record<string, (hostname: string) => string> = {
  Windows: (h) => `# Sentinel Agent Install — Windows PowerShell\n# Run as Administrator\n\n$AgentUrl = "https://packages.sentinel.io/windows/sentinel-agent-4.7.2.msi"\n$ApiKey = "sk-sentinel-XXXX-YYYY-ZZZZ-DEMO"\n$ServerUrl = "https://siem.corp.local:55000"\n$Hostname = "${h}"\n\nWrite-Host "[*] Downloading Sentinel Agent..." -ForegroundColor Cyan\nInvoke-WebRequest -Uri $AgentUrl -OutFile "$env:TEMP\\sentinel-agent.msi"\n\nWrite-Host "[*] Installing agent..." -ForegroundColor Cyan\nmsiexec /i "$env:TEMP\\sentinel-agent.msi" /quiet \`\n  SENTINEL_SERVER="$ServerUrl" \`\n  SENTINEL_KEY="$ApiKey" \`\n  SENTINEL_AGENT_NAME="$Hostname"\n\nWrite-Host "[+] Starting Sentinel service..." -ForegroundColor Green\nStart-Service SentinelAgent\nSet-Service SentinelAgent -StartupType Automatic\n\nWrite-Host "[✓] Agent enrolled successfully!" -ForegroundColor Green`,

  Linux: (h) => `#!/bin/bash\n# Sentinel Agent Install — Linux\n# Run as root\n\nAPI_KEY="sk-sentinel-XXXX-YYYY-ZZZZ-DEMO"\nSERVER_URL="https://siem.corp.local:55000"\nHOSTNAME_OVERRIDE="${h}"\n\necho "[*] Detecting OS..."\nif command -v apt &>/dev/null; then\n  PKG_MGR="apt"\nelif command -v yum &>/dev/null; then\n  PKG_MGR="yum"\nfi\n\necho "[*] Adding Sentinel repository..."\ncurl -s https://packages.sentinel.io/GPG-KEY | apt-key add -\necho "deb https://packages.sentinel.io/apt stable main" >> /etc/apt/sources.list\n$PKG_MGR update -y\n$PKG_MGR install -y sentinel-agent\n\necho "[*] Configuring agent..."\ncat > /etc/sentinel/agent.conf << EOF\nserver: $SERVER_URL\nkey: $API_KEY\nhostname: $HOSTNAME_OVERRIDE\nEOF\n\nsystemctl enable sentinel-agent && systemctl start sentinel-agent\necho "[✓] Agent enrolled: $HOSTNAME_OVERRIDE"`,

  macOS: (h) => `#!/bin/bash\n# Sentinel Agent Install — macOS\n# Run with sudo\n\nAPI_KEY="sk-sentinel-XXXX-YYYY-ZZZZ-DEMO"\nSERVER_URL="https://siem.corp.local:55000"\nHOSTNAME_OVERRIDE="${h}"\n\necho "[*] Downloading Sentinel Agent for macOS..."\ncurl -o /tmp/sentinel-agent.pkg \\\n  "https://packages.sentinel.io/macos/sentinel-agent-4.7.2.pkg"\n\necho "[*] Installing package..."\ninstaller -pkg /tmp/sentinel-agent.pkg -target /\n\necho "[*] Writing configuration..."\nmkdir -p /Library/Application\\ Support/Sentinel\ncat > /Library/Application\\ Support/Sentinel/agent.conf << EOF\nserver: $SERVER_URL\nkey: $API_KEY\nhostname: $HOSTNAME_OVERRIDE\nEOF\n\nlaunchctl load /Library/LaunchDaemons/io.sentinel.agent.plist\necho "[✓] Sentinel agent running on $HOSTNAME_OVERRIDE"`,
};

export default function Assets() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardOS, setWizardOS] = useState('Windows');
  const [wizardHost, setWizardHost] = useState('new-endpoint-01');
  const [copied, setCopied] = useState(false);

  const filtered = assets.filter(a => {
    if (search && !a.hostname.toLowerCase().includes(search.toLowerCase()) && !a.ip.includes(search) && !a.department.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    return true;
  });

  const handleCopy = () => {
    const script = installScripts[wizardOS]?.(wizardHost) || '';
    navigator.clipboard.writeText(script).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor: Record<string, string> = { online: '#10b981', offline: '#6b7280', warning: '#f97316' };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Asset Inventory</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
            {assets.filter(a => a.status === 'online').length} online · {assets.filter(a => a.status === 'warning').length} warning · {assets.filter(a => a.status === 'offline').length} offline
          </p>
        </div>
        <button
          onClick={() => { setShowWizard(true); setWizardStep(1); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)', color: '#fff' }}
        >
          <Plus size={16} /> Add Endpoint
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search hostname, IP, department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none flex-1 min-w-48"
          style={{ background: 'hsl(222,33%,14%)', border: '1px solid hsl(222,22%,20%)', color: '#f1f5f9' }}
        />
        {['all', 'workstation', 'server', 'network', 'mobile'].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize"
            style={{
              background: typeFilter === t ? 'rgba(16,185,129,0.15)' : 'hsl(222,33%,14%)',
              color: typeFilter === t ? '#10b981' : 'hsl(215,15%,50%)',
              border: `1px solid ${typeFilter === t ? 'rgba(16,185,129,0.3)' : 'hsl(222,22%,20%)'}`,
            }}
          >{t === 'all' ? 'All Types' : t}</button>
        ))}
      </div>

      {/* Asset Table */}
      <Card className="overflow-hidden">
        <div
          className="grid text-[10px] font-semibold uppercase tracking-wider px-4 py-2.5"
          style={{ gridTemplateColumns: '40px 150px 120px 100px 100px 100px 100px 100px 1fr', background: 'hsl(222,40%,9%)', borderBottom: '1px solid hsl(222,22%,16%)', color: 'hsl(215,15%,40%)' }}
        >
          <span />
          <span>HOSTNAME</span>
          <span>IP ADDRESS</span>
          <span>OS</span>
          <span>TYPE</span>
          <span>STATUS</span>
          <span>RISK SCORE</span>
          <span>AGENT VER</span>
          <span>TAGS</span>
        </div>
        {filtered.map((asset, idx) => {
          const Icon = typeIcons[asset.type] || Server;
          return (
            <div
              key={asset.id}
              className="grid items-center px-4 py-3 text-xs border-b hover:opacity-90"
              style={{
                gridTemplateColumns: '40px 150px 120px 100px 100px 100px 100px 100px 1fr',
                borderColor: 'hsl(222,22%,13%)',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}
            >
              <Icon size={14} style={{ color: osColors[asset.os] || '#94a3b8' }} />
              <span className="font-mono font-semibold" style={{ color: '#f1f5f9' }}>{asset.hostname}</span>
              <span className="font-mono" style={{ color: '#38bdf8' }}>{asset.ip}</span>
              <span style={{ color: osColors[asset.os] || '#94a3b8' }}>{asset.os}</span>
              <span className="capitalize" style={{ color: 'hsl(215,20%,60%)' }}>{asset.type}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor[asset.status] }} />
                <span className="capitalize" style={{ color: statusColor[asset.status] }}>{asset.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222,22%,20%)' }}>
                  <div className="h-full rounded-full" style={{ width: `${asset.riskScore}%`, background: riskColor(asset.riskScore) }} />
                </div>
                <span className="font-mono font-bold w-6 text-right" style={{ color: riskColor(asset.riskScore), fontSize: 11 }}>{asset.riskScore}</span>
              </div>
              <span className="font-mono text-[10px]" style={{ color: 'hsl(215,15%,40%)' }}>{asset.agentVersion}</span>
              <div className="flex gap-1 flex-wrap">
                {asset.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} color="#a78bfa" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            </div>
          );
        })}
      </Card>

      {/* Add Endpoint Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <Card className="w-full max-w-2xl mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid hsl(222,22%,18%)' }}>
              <div>
                <h2 className="font-bold" style={{ color: '#f1f5f9' }}>Add New Endpoint</h2>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>Step {wizardStep} of 3</p>
              </div>
              <button onClick={() => setShowWizard(false)}>
                <X size={18} style={{ color: 'hsl(215,15%,50%)' }} />
              </button>
            </div>

            {/* Step progress */}
            <div className="px-5 py-3 flex gap-2" style={{ borderBottom: '1px solid hsl(222,22%,16%)' }}>
              {[1,2,3].map(s => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: wizardStep >= s ? '#10b981' : 'hsl(222,22%,20%)', color: wizardStep >= s ? '#fff' : 'hsl(215,15%,45%)' }}
                  >{s}</div>
                  <span className="text-xs" style={{ color: wizardStep >= s ? '#10b981' : 'hsl(215,15%,40%)' }}>
                    {s === 1 ? 'Configure' : s === 2 ? 'Install Script' : 'Verify'}
                  </span>
                  {s < 3 && <div className="flex-1 h-0.5 rounded" style={{ background: wizardStep > s ? '#10b981' : 'hsl(222,22%,20%)' }} />}
                </div>
              ))}
            </div>

            <div className="p-5">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'hsl(215,15%,45%)' }}>Hostname</label>
                    <input
                      type="text"
                      value={wizardHost}
                      onChange={e => setWizardHost(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono"
                      style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,20%)', color: '#f1f5f9' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'hsl(215,15%,45%)' }}>Operating System</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Windows', 'Linux', 'macOS'].map(os => (
                        <button
                          key={os}
                          onClick={() => setWizardOS(os)}
                          className="py-3 rounded-lg text-sm font-medium"
                          style={{
                            background: wizardOS === os ? 'rgba(16,185,129,0.15)' : 'hsl(222,40%,9%)',
                            border: `1px solid ${wizardOS === os ? 'rgba(16,185,129,0.4)' : 'hsl(222,22%,20%)'}`,
                            color: wizardOS === os ? '#10b981' : 'hsl(215,20%,60%)',
                          }}
                        >{os}</button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)', color: '#fff' }}
                  >Generate Installation Script →</button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: '#cbd5e1' }}>Run this script on <strong style={{ color: '#10b981' }}>{wizardHost}</strong> ({wizardOS})</p>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs"
                      style={{ background: copied ? 'rgba(16,185,129,0.15)' : 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,20%)', color: copied ? '#10b981' : '#cbd5e1' }}
                    >
                      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                  <pre
                    className="font-mono text-xs p-4 rounded-lg overflow-auto custom-scroll"
                    style={{ background: 'hsl(222,47%,5%)', border: '1px solid hsl(222,22%,16%)', color: '#86efac', maxHeight: 300, lineHeight: 1.7 }}
                  >{installScripts[wizardOS]?.(wizardHost) || ''}</pre>
                  <div className="flex gap-3">
                    <button onClick={() => setWizardStep(1)} className="flex-1 py-2.5 rounded-lg text-sm" style={{ border: '1px solid hsl(222,22%,20%)', color: 'hsl(215,15%,50%)' }}>← Back</button>
                    <button onClick={() => setWizardStep(3)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)', color: '#fff' }}>Script Ready →</button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#10b981' }}>
                      <Check size={18} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>Awaiting Agent Check-in</h3>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215,15%,50%)' }}>
                      Run the script on <strong style={{ color: '#10b981' }}>{wizardHost}</strong>. The agent will appear in this inventory within 60 seconds of installation.
                    </p>
                  </div>
                  <div className="text-xs px-4 py-3 rounded-lg text-left space-y-1 font-mono" style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,22%,16%)', color: '#10b981' }}>
                    <div><span style={{ color: 'hsl(215,15%,40%)' }}>[waiting]</span> Listening for agent beacon on :55000...</div>
                    <div><span style={{ color: 'hsl(215,15%,40%)' }}>[info]</span>   Enrollment token expires in 24h</div>
                    <div><span style={{ color: 'hsl(215,15%,40%)' }}>[info]</span>   Expected hostname: {wizardHost}</div>
                  </div>
                  <button onClick={() => setShowWizard(false)} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)', color: '#fff' }}>
                    Close & Monitor
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
