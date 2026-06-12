import { useState } from 'react';
import { Monitor, Plus, X, Terminal, ChevronRight, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { assets, Asset, AssetStatus } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<AssetStatus, { icon: typeof Wifi; color: string; label: string }> = {
  online: { icon: Wifi, color: 'text-green-400', label: 'Online' },
  offline: { icon: WifiOff, color: 'text-red-400', label: 'Offline' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', label: 'Warning' },
};

function riskColor(score: number) {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-green-400';
}

function riskBg(score: number) {
  if (score >= 80) return 'bg-red-500';
  if (score >= 60) return 'bg-orange-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
}

const osIcons: Record<string, string> = {
  'Windows Server': '🪟',
  'Windows 11': '🪟',
  'Windows 10': '🪟',
  'Ubuntu': '🐧',
  'CentOS': '🐧',
  'RHEL': '🐧',
  'macOS': '🍎',
  'Cisco IOS': '🌐',
};

const installScripts: Record<string, string> = {
  Windows: `# PhoenixSIEM Agent — Windows PowerShell Install
$AgentUrl = "https://agent.phoenixsiem.io/downloads/phoenix-agent-4.8.1-windows.msi"
$EnrollKey = "PHNX-ENT-7f4a9b2c-d8e3-4f1a-b9c6"

Write-Host "[+] Downloading PhoenixSIEM Agent..."
Invoke-WebRequest -Uri $AgentUrl -OutFile "$env:TEMP\\phoenix-agent.msi"

Write-Host "[+] Installing Agent..."
Start-Process msiexec.exe -ArgumentList "/i $env:TEMP\\phoenix-agent.msi /quiet ENROLL_KEY=$EnrollKey" -Wait

Write-Host "[+] Starting PhoenixSIEM Service..."
Start-Service -Name "PhoenixSIEMAgent"

Write-Host "[✓] Agent installed and enrolled successfully!"`,
  Linux: `#!/bin/bash
# PhoenixSIEM Agent — Linux Install Script
set -e

AGENT_URL="https://agent.phoenixsiem.io/downloads/phoenix-agent-4.8.1-linux.deb"
ENROLL_KEY="PHNX-ENT-7f4a9b2c-d8e3-4f1a-b9c6"

echo "[+] Downloading PhoenixSIEM Agent..."
curl -fsSL $AGENT_URL -o /tmp/phoenix-agent.deb

echo "[+] Installing Agent..."
sudo dpkg -i /tmp/phoenix-agent.deb

echo "[+] Configuring enrollment key..."
echo "ENROLL_KEY=$ENROLL_KEY" | sudo tee -a /etc/phoenix-siem/agent.conf

echo "[+] Starting PhoenixSIEM Service..."
sudo systemctl enable --now phoenix-agent

echo "[✓] Agent installed and enrolled successfully!"`,
  macOS: `#!/bin/bash
# PhoenixSIEM Agent — macOS Install Script
set -e

AGENT_URL="https://agent.phoenixsiem.io/downloads/phoenix-agent-4.8.1-macos.pkg"
ENROLL_KEY="PHNX-ENT-7f4a9b2c-d8e3-4f1a-b9c6"

echo "[+] Downloading PhoenixSIEM Agent..."
curl -fsSL $AGENT_URL -o /tmp/phoenix-agent.pkg

echo "[+] Installing Agent..."
sudo installer -pkg /tmp/phoenix-agent.pkg -target /

echo "[+] Enrolling with key: $ENROLL_KEY"
sudo /usr/local/bin/phoenix-agent enroll --key "$ENROLL_KEY"

echo "[+] Starting PhoenixSIEM Agent..."
sudo launchctl load /Library/LaunchDaemons/io.phoenixsiem.agent.plist

echo "[✓] Agent installed and enrolled successfully!"`,
};

export function Assets() {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedOS, setSelectedOS] = useState<'Windows' | 'Linux' | 'macOS'>('Windows');
  const [hostname, setHostname] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [localAssets, setLocalAssets] = useState<Asset[]>(assets);

  const handleAddAsset = () => {
    if (hostname) {
      const newAsset: Asset = {
        id: `AST-${String(localAssets.length + 1).padStart(3, '0')}`,
        hostname,
        ip: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 254) + 1}`,
        os: selectedOS === 'Windows' ? 'Windows 11' : selectedOS === 'macOS' ? 'macOS' : 'Ubuntu',
        type: 'workstation',
        status: 'offline',
        riskScore: 0,
        agentVersion: '4.8.1',
        lastSeen: new Date(),
        tags: ['new', 'pending-enrollment'],
        owner: 'Unknown',
        location: 'Unassigned',
      };
      setLocalAssets((prev) => [newAsset, ...prev]);
      setShowWizard(false);
      setWizardStep(1);
      setHostname('');
    }
  };

  return (
    <div className="space-y-5" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: localAssets.length, color: 'text-white' },
          { label: 'Online', value: localAssets.filter((a) => a.status === 'online').length, color: 'text-green-400' },
          { label: 'Warning', value: localAssets.filter((a) => a.status === 'warning').length, color: 'text-yellow-400' },
          { label: 'Offline', value: localAssets.filter((a) => a.status === 'offline').length, color: 'text-red-400' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="py-4">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#3d5a7a] mt-1">{s.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Asset Inventory ({localAssets.length})</h3>
        <button
          onClick={() => { setShowWizard(true); setWizardStep(1); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-lg text-sm hover:bg-orange-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Endpoint
        </button>
      </div>

      {/* Asset Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(30,63,102,0.5)]">
                {['Status', 'Hostname', 'IP Address', 'OS', 'Type', 'Risk Score', 'Agent', 'Last Seen'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-[#3d5a7a] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0a1628]">
              {localAssets.map((asset) => {
                const { icon: StatusIcon, color } = statusConfig[asset.status];
                return (
                  <tr
                    key={asset.id}
                    className="hover:bg-transparent cursor-pointer transition-colors"
                    onClick={() => setSelectedAsset(selectedAsset?.id === asset.id ? null : asset)}
                  >
                    <td className="px-4 py-3">
                      <StatusIcon className={`w-4 h-4 ${color}`} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-sm text-white">{asset.hostname}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {asset.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-[#1a3050] text-[#3d5a7a]">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#8ba8c8]">{asset.ip}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-[#8ba8c8]">
                        <span>{osIcons[asset.os] || '💻'}</span>
                        <span>{asset.os}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs capitalize text-[#8ba8c8]">{asset.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#1a3050] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${riskBg(asset.riskScore)}`} style={{ width: `${asset.riskScore}%` }} />
                        </div>
                        <span className={`text-xs font-mono font-semibold ${riskColor(asset.riskScore)}`}>{asset.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#3d5a7a]">{asset.agentVersion}</td>
                    <td className="px-4 py-3 text-xs text-[#3d5a7a]">{formatDistanceToNow(asset.lastSeen, { addSuffix: true })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Endpoint Wizard */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Add New Endpoint</h3>
                  <p className="text-xs text-[#3d5a7a] mt-0.5">Step {wizardStep} of 3</p>
                </div>
                <button onClick={() => setShowWizard(false)} className="p-1 text-[#3d5a7a] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Progress */}
              <div className="flex gap-1 mt-3">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1 flex-1 rounded-full ${s <= wizardStep ? 'bg-orange-500' : 'bg-[#1a3050]'}`} />
                ))}
              </div>
            </CardHeader>
            <CardBody>
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#8ba8c8] mb-2">Hostname</label>
                    <input
                      type="text"
                      placeholder="e.g., ws-newhost-01"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg text-sm text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8ba8c8] mb-2">Operating System</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Windows', 'Linux', 'macOS'] as const).map((os) => (
                        <button
                          key={os}
                          onClick={() => setSelectedOS(os)}
                          className={`p-3 rounded-lg border text-sm text-center transition-colors ${
                            selectedOS === os
                              ? 'border-orange-500/60 bg-orange-500/10 text-orange-400'
                              : 'border-[rgba(30,63,102,0.5)] text-[#8ba8c8] hover:border-orange-500/30'
                          }`}
                        >
                          <div className="text-2xl mb-1">{os === 'Windows' ? '🪟' : os === 'macOS' ? '🍎' : '🐧'}</div>
                          {os}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => hostname && setWizardStep(2)}
                    disabled={!hostname}
                    className="w-full py-2.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-white">Installation Script — {selectedOS}</span>
                    </div>
                    <pre className="bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg p-4 text-[11px] font-mono text-green-400 overflow-x-auto whitespace-pre-wrap max-h-56 custom-scrollbar">
                      {installScripts[selectedOS]}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setWizardStep(1)} className="flex-1 py-2.5 border border-[rgba(30,63,102,0.5)] text-[#8ba8c8] rounded-lg text-sm hover:text-white transition-colors">Back</button>
                    <button onClick={() => setWizardStep(3)} className="flex-1 py-2.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors">
                      Script Deployed →
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto">
                    <Monitor className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Enrollment Pending</h4>
                    <p className="text-sm text-[#8ba8c8] mt-1">Agent script deployed to <span className="font-mono text-orange-400">{hostname}</span>. Waiting for check-in...</p>
                  </div>
                  <div className="bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg p-3 text-left">
                    <div className="text-xs font-mono text-[#3d5a7a] space-y-1">
                      <div className="text-green-400">✓ Enrollment key generated</div>
                      <div className="text-green-400">✓ Installation script created</div>
                      <div className="text-yellow-400">⏳ Waiting for agent check-in...</div>
                    </div>
                  </div>
                  <button onClick={handleAddAsset} className="w-full py-2.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors">
                    Add to Inventory
                  </button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
