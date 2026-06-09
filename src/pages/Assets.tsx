import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Plus, Search, X, Copy, CheckCircle, Server, Wifi, Cloud, Cpu } from "lucide-react";
import { Layout } from "../components/Layout";
import { assets, AssetType, AssetStatus } from "../data/mockData";
import { format } from "date-fns";

const statusConfig: Record<AssetStatus, { label: string; color: string; dot: string }> = {
  online: { label: "Online", color: "text-emerald-400", dot: "bg-emerald-400" },
  offline: { label: "Offline", color: "text-slate-500", dot: "bg-slate-600" },
  quarantined: { label: "Quarantined", color: "text-red-400", dot: "bg-red-400" },
  degraded: { label: "Degraded", color: "text-orange-400", dot: "bg-orange-400" },
};

const typeIcon: Record<AssetType, React.ReactNode> = {
  server: <Server size={14} />,
  workstation: <Monitor size={14} />,
  network: <Wifi size={14} />,
  cloud: <Cloud size={14} />,
  iot: <Cpu size={14} />,
  mobile: <Monitor size={14} />,
};

const riskColor = (score: number) => {
  if (score >= 90) return "text-red-400 bg-red-400/10";
  if (score >= 70) return "text-orange-400 bg-orange-400/10";
  if (score >= 50) return "text-yellow-400 bg-yellow-400/10";
  return "text-emerald-400 bg-emerald-400/10";
};

const riskBarColor = (score: number) => {
  if (score >= 90) return "bg-red-400";
  if (score >= 70) return "bg-orange-400";
  if (score >= 50) return "bg-yellow-400";
  return "bg-emerald-400";
};

const INSTALL_SCRIPTS: Record<string, string> = {
  windows: `# Sentinel Agent Installation (Windows)
# Run as Administrator in PowerShell

$AgentUrl = "https://packages.sentinel.io/windows/sentinel-agent-4.7.2.msi"
$AgentKey = "AGENT-KEY-XXXX-YYYY-ZZZZ"

Write-Host "Downloading Sentinel Agent v4.7.2..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $AgentUrl -OutFile "sentinel-agent.msi"

Write-Host "Installing Sentinel Agent..." -ForegroundColor Cyan
Start-Process msiexec.exe -Wait -ArgumentList @(
  '/i', 'sentinel-agent.msi', '/quiet',
  "SENTINEL_SERVER=https://siem.company.com",
  "SENTINEL_KEY=$AgentKey",
  "ENROLLMENT_GROUP=windows-endpoints"
)

Write-Host "Starting Sentinel service..." -ForegroundColor Cyan
Start-Service SentinelAgent
Set-Service SentinelAgent -StartupType Automatic

Write-Host "✓ Sentinel Agent installed and running!" -ForegroundColor Green`,

  linux: `#!/bin/bash
# Sentinel Agent Installation (Linux/Ubuntu/Debian/RHEL)
# Run as root or with sudo

set -e

AGENT_VERSION="4.7.2"
SENTINEL_SERVER="https://siem.company.com"
AGENT_KEY="AGENT-KEY-XXXX-YYYY-ZZZZ"
ENROLLMENT_GROUP="linux-servers"

echo "→ Detecting OS..."
if [ -f /etc/debian_version ]; then
    curl -sSL https://packages.sentinel.io/gpg | gpg --dearmor > /etc/apt/trusted.gpg.d/sentinel.gpg
    echo "deb https://packages.sentinel.io/apt stable main" > /etc/apt/sources.list.d/sentinel.list
    apt-get update -qq && apt-get install -y sentinel-agent
elif [ -f /etc/redhat-release ]; then
    rpm --import https://packages.sentinel.io/gpg
    cat > /etc/yum.repos.d/sentinel.repo << EOF
[sentinel]
name=Sentinel Agent Repository
baseurl=https://packages.sentinel.io/yum
enabled=1
gpgcheck=1
EOF
    yum install -y sentinel-agent
fi

echo "→ Configuring agent..."
cat > /etc/sentinel/agent.conf << EOF
server: $SENTINEL_SERVER
api_key: $AGENT_KEY
enrollment_group: $ENROLLMENT_GROUP
log_level: info
fim:
  enabled: true
  monitored_paths:
    - /etc/passwd
    - /etc/shadow
    - /etc/sudoers
    - /usr/bin
rootkit_detection: true
vuln_scanning: true
EOF

systemctl enable --now sentinel-agent
echo "✓ Sentinel Agent v$AGENT_VERSION installed!"`,

  macos: `#!/bin/bash
# Sentinel Agent Installation (macOS)
# Requires macOS 12.0 Monterey or later

SENTINEL_SERVER="https://siem.company.com"
AGENT_KEY="AGENT-KEY-XXXX-YYYY-ZZZZ"

echo "-> Downloading Sentinel Agent v4.7.2 for macOS..."
curl -sSL "https://packages.sentinel.io/macos/SentinelAgent-4.7.2.pkg" -o /tmp/SentinelAgent.pkg

echo "→ Installing package (requires admin)..."
sudo installer -pkg /tmp/SentinelAgent.pkg -target /

echo "→ Configuring agent..."
sudo tee /Library/Application\ Support/Sentinel/agent.conf > /dev/null << EOF
server: $SENTINEL_SERVER
api_key: $AGENT_KEY
enrollment_group: macos-endpoints
fim:
  enabled: true
  monitored_paths:
    - /etc/hosts
    - /private/etc/sudoers
    - /usr/local/bin
EOF

echo "→ Loading LaunchDaemon..."
sudo launchctl load -w /Library/LaunchDaemons/io.sentinel.agent.plist

echo "✓ Sentinel Agent v4.7.2 installed on macOS!"`,
};

export const Assets: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedOS, setSelectedOS] = useState<"windows" | "linux" | "macos">("linux");
  const [copied, setCopied] = useState(false);

  const filtered = assets.filter(a =>
    !search ||
    a.hostname.toLowerCase().includes(search.toLowerCase()) ||
    a.ip.includes(search) ||
    a.os.toLowerCase().includes(search.toLowerCase())
  );

  const copyScript = () => {
    navigator.clipboard.writeText(INSTALL_SCRIPTS[selectedOS]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout title="Asset Inventory" subtitle={`${assets.length} assets monitored · ${assets.filter(a=>a.status==="online").length} online`}>
      {/* Controls */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search hostname, IP, OS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/50"
            style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
          />
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-colors"
        >
          <Plus size={15} />
          Add Endpoint
        </button>
      </div>

      {/* Assets Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,18%)" }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600 border-b" style={{ borderColor: "hsl(222,25%,16%)" }}>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Hostname</div>
          <div className="col-span-2">IP Address</div>
          <div className="col-span-2">OS</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Risk Score</div>
          <div className="col-span-1">Agent</div>
          <div className="col-span-1">Last Seen</div>
        </div>

        <div className="divide-y divide-white/3">
          {filtered.map((asset, i) => {
            const sc = statusConfig[asset.status];
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/2 transition-colors items-center"
              >
                <div className="col-span-1 flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot} ${asset.status === "online" ? "animate-pulse" : ""}`} />
                  <span className={`text-[10px] font-mono ${sc.color}`}>{sc.label}</span>
                </div>
                <div className="col-span-2 font-mono text-xs text-slate-200 truncate">{asset.hostname}</div>
                <div className="col-span-2 font-mono text-xs text-slate-400">{asset.ip}</div>
                <div className="col-span-2 text-xs text-slate-400 truncate">{asset.os}</div>
                <div className="col-span-1">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    {typeIcon[asset.type]}
                    <span className="capitalize">{asset.type}</span>
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${riskBarColor(asset.riskScore)}`}
                        style={{ width: `${asset.riskScore}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${riskColor(asset.riskScore)}`}>
                      {asset.riskScore}
                    </span>
                  </div>
                </div>
                <div className="col-span-1 font-mono text-[10px] text-slate-600">{asset.agentVersion}</div>
                <div className="col-span-1 text-[10px] text-slate-600 font-mono">
                  {format(asset.lastSeen, "HH:mm")}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Endpoint Wizard */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl border overflow-hidden"
              style={{ background: "hsl(222,35%,11%)", borderColor: "hsl(222,25%,22%)" }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "hsl(222,25%,18%)" }}>
                <div>
                  <h2 className="text-base font-semibold text-slate-100">Add Endpoint</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Step {wizardStep} of 3 — Deploy Sentinel Agent</p>
                </div>
                <button onClick={() => { setShowWizard(false); setWizardStep(1); }} className="text-slate-500 hover:text-slate-300">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {wizardStep === 1 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-200 mb-4">Select Operating System</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(["windows","linux","macos"] as const).map(os => (
                        <button
                          key={os}
                          onClick={() => setSelectedOS(os)}
                          className={`p-4 rounded-xl border text-center transition-all ${
                            selectedOS === os
                              ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
                              : "border-white/8 bg-white/3 text-slate-400 hover:border-white/15"
                          }`}
                        >
                          <div className="text-2xl mb-2">{os === "windows" ? "🪟" : os === "linux" ? "🐧" : "🍎"}</div>
                          <p className="text-sm font-medium capitalize">{os}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-200 mb-4">Installation Script</h3>
                    <div className="relative">
                      <pre className="text-[11px] font-mono text-slate-400 p-4 rounded-xl overflow-x-auto max-h-80" style={{ background: "hsl(222,47%,6%)", border: "1px solid hsl(222,25%,16%)" }}>
                        {INSTALL_SCRIPTS[selectedOS]}
                      </pre>
                      <button
                        onClick={copyScript}
                        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: "hsl(222,35%,16%)" }}
                      >
                        {copied ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} className="text-slate-400" />}
                        <span className={copied ? "text-emerald-400" : "text-slate-400"}>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={28} className="text-emerald-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-200 mb-2">Agent Enrollment Pending</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Run the installation script on your endpoint. The agent will appear in the asset list within 60 seconds of successful installation.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Waiting for enrollment signal...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between px-6 py-4 border-t" style={{ borderColor: "hsl(222,25%,18%)" }}>
                <button
                  onClick={() => wizardStep > 1 ? setWizardStep(s => s - 1) : setShowWizard(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors border border-white/8"
                >
                  {wizardStep === 1 ? "Cancel" : "Back"}
                </button>
                <button
                  onClick={() => wizardStep < 3 ? setWizardStep(s => s + 1) : setShowWizard(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-emerald-900 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                >
                  {wizardStep === 3 ? "Done" : "Next"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
