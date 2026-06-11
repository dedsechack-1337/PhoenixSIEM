import { useState } from 'react';
import { Bell, Mail, MessageSquare, Save, Send, Check, AlertTriangle, Trash2, Plus, Toggle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { alerts } from '../data/mockData';
import type { Severity } from '../data/mockData';

type ChannelType = 'email' | 'slack';

interface NotificationChannel {
  id: string;
  type: ChannelType;
  name: string;
  destination: string;
  enabled: boolean;
  severities: Severity[];
  lastSent?: string;
}

interface NotificationLog {
  id: string;
  channel: string;
  type: ChannelType;
  alert: string;
  severity: Severity;
  sentAt: string;
  status: 'sent' | 'failed';
}

const DEFAULT_CHANNELS: NotificationChannel[] = [
  { id: 'CH-001', type: 'email', name: 'SOC Team Email', destination: 'soc-team@company.com', enabled: true, severities: ['critical', 'high'], lastSent: '2 min ago' },
  { id: 'CH-002', type: 'slack', name: '#security-alerts', destination: 'https://hooks.slack.com/services/T00/B00/demo', enabled: true, severities: ['critical'], lastSent: '5 min ago' },
  { id: 'CH-003', type: 'email', name: 'CISO Weekly Report', destination: 'ciso@company.com', enabled: false, severities: ['critical', 'high', 'medium'], lastSent: '2 days ago' },
];

const MOCK_LOGS: NotificationLog[] = [
  { id: 'L-001', channel: 'SOC Team Email', type: 'email', alert: 'Cobalt Strike C2 Beacon', severity: 'critical', sentAt: '2 min ago', status: 'sent' },
  { id: 'L-002', channel: '#security-alerts', type: 'slack', alert: 'Cobalt Strike C2 Beacon', severity: 'critical', sentAt: '2 min ago', status: 'sent' },
  { id: 'L-003', channel: 'SOC Team Email', type: 'email', alert: 'Ransomware Encryption Campaign', severity: 'critical', sentAt: '35 min ago', status: 'sent' },
  { id: 'L-004', channel: '#security-alerts', type: 'slack', alert: 'Ransomware Encryption Campaign', severity: 'critical', sentAt: '35 min ago', status: 'failed' },
  { id: 'L-005', channel: 'SOC Team Email', type: 'email', alert: 'Golden Ticket Attack', severity: 'critical', sentAt: '2 hr ago', status: 'sent' },
  { id: 'L-006', channel: 'SOC Team Email', type: 'email', alert: 'SSH Brute Force — Sustained Attack', severity: 'high', sentAt: '3 hr ago', status: 'sent' },
];

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

function ChannelIcon({ type }: { type: ChannelType }) {
  return type === 'email'
    ? <Mail className="w-4 h-4 text-blue-400" />
    : <MessageSquare className="w-4 h-4 text-purple-400" />;
}

export function Notifications() {
  const [channels, setChannels] = useState<NotificationChannel[]>(DEFAULT_CHANNELS);
  const [logs] = useState<NotificationLog[]>(MOCK_LOGS);
  const [testStatus, setTestStatus] = useState<Record<string, 'idle' | 'sending' | 'sent'>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChannel, setNewChannel] = useState<Partial<NotificationChannel>>({ type: 'email', severities: ['critical', 'high'], enabled: true });
  const [saved, setSaved] = useState(false);

  const openAlerts = alerts.filter((a) => a.status === 'open' || a.status === 'acknowledged');

  const toggleChannel = (id: string) => {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  };

  const toggleSeverity = (id: string, sev: Severity) => {
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const sevs = c.severities.includes(sev)
          ? c.severities.filter((s) => s !== sev)
          : [...c.severities, sev];
        return { ...c, severities: sevs };
      })
    );
  };

  const deleteChannel = (id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
  };

  const testChannel = (id: string) => {
    setTestStatus((prev) => ({ ...prev, [id]: 'sending' }));
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, [id]: 'sent' }));
      setTimeout(() => setTestStatus((prev) => ({ ...prev, [id]: 'idle' })), 2000);
    }, 1200);
  };

  const addChannel = () => {
    if (!newChannel.name || !newChannel.destination) return;
    const ch: NotificationChannel = {
      id: `CH-${Date.now()}`,
      type: newChannel.type || 'email',
      name: newChannel.name,
      destination: newChannel.destination,
      enabled: true,
      severities: newChannel.severities || ['critical'],
    };
    setChannels((prev) => [...prev, ch]);
    setNewChannel({ type: 'email', severities: ['critical', 'high'], enabled: true });
    setShowAddForm(false);
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" /> Alert Notifications
          </h2>
          <p className="text-xs text-[#3d5a7a] mt-0.5">Configure Email & Slack channels for real-time alert delivery</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-[rgba(30,63,102,0.5)] text-xs text-[#8ba8c8] hover:text-white hover:border-orange-500/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Channel
          </button>
          <button
            onClick={saveSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs hover:bg-orange-500/30 transition-colors"
          >
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Settings</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Channels', value: channels.filter(c => c.enabled).length, color: 'text-green-400' },
          { label: 'Alerts to Notify', value: openAlerts.length, color: 'text-red-400' },
          { label: 'Sent Today', value: logs.filter(l => l.status === 'sent').length, color: 'text-blue-400' },
          { label: 'Failed', value: logs.filter(l => l.status === 'failed').length, color: 'text-yellow-400' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="py-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#3d5a7a] mt-1">{s.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Add Channel Form */}
      {showAddForm && (
        <Card className="border-orange-500/30">
          <CardHeader>
            <h3 className="text-sm font-semibold text-white">Add Notification Channel</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#3d5a7a] mb-1.5 uppercase tracking-wider">Channel Type</label>
                <div className="flex gap-2">
                  {(['email', 'slack'] as ChannelType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewChannel((p) => ({ ...p, type: t }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                        newChannel.type === t
                          ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                          : 'bg-transparent border-[rgba(30,63,102,0.5)] text-[#8ba8c8] hover:text-white'
                      }`}
                    >
                      {t === 'email' ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                      {t === 'email' ? 'Email' : 'Slack Webhook'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#3d5a7a] mb-1.5 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  placeholder="e.g. SOC Team Email"
                  value={newChannel.name || ''}
                  onChange={(e) => setNewChannel((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg text-xs text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#3d5a7a] mb-1.5 uppercase tracking-wider">
                  {newChannel.type === 'email' ? 'Email Address' : 'Slack Webhook URL'}
                </label>
                <input
                  type="text"
                  placeholder={newChannel.type === 'email' ? 'alerts@company.com' : 'https://hooks.slack.com/services/...'}
                  value={newChannel.destination || ''}
                  onChange={(e) => setNewChannel((p) => ({ ...p, destination: e.target.value }))}
                  className="w-full px-3 py-2 bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg text-xs text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50 font-mono"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#3d5a7a] mb-1.5 uppercase tracking-wider">Notify on Severity</label>
                <div className="flex gap-2 flex-wrap">
                  {SEVERITIES.map((sev) => (
                    <button
                      key={sev}
                      onClick={() => {
                        const sevs = (newChannel.severities || []);
                        setNewChannel((p) => ({
                          ...p,
                          severities: sevs.includes(sev) ? sevs.filter(s => s !== sev) : [...sevs, sev],
                        }));
                      }}
                      className={`px-3 py-1 rounded-lg border text-xs transition-colors ${
                        (newChannel.severities || []).includes(sev)
                          ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                          : 'bg-transparent border-[rgba(30,63,102,0.5)] text-[#3d5a7a] hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addChannel} className="px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30 transition-colors">
                Add Channel
              </button>
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-transparent border border-[rgba(30,63,102,0.5)] text-[#8ba8c8] rounded-lg text-xs hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Channels */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-white">Notification Channels</h3>
        </CardHeader>
        <div className="divide-y divide-[rgba(30,63,102,0.4)]">
          {channels.map((ch) => {
            const ts = testStatus[ch.id] || 'idle';
            return (
              <div key={ch.id} className="px-5 py-4 hover:bg-transparent transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${ch.type === 'email' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-purple-500/10 border-purple-500/30'}`}>
                      <ChannelIcon type={ch.type} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{ch.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${ch.enabled ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-[#1a3050]/50 border-[rgba(30,63,102,0.5)] text-[#3d5a7a]'}`}>
                          {ch.enabled ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>
                      <div className="text-xs text-[#3d5a7a] font-mono mt-0.5">{ch.destination}</div>
                      {ch.lastSent && <div className="text-[10px] text-[#3d5a7a] mt-0.5">Last sent: {ch.lastSent}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => testChannel(ch.id)}
                      disabled={ts === 'sending'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(30,63,102,0.5)] bg-transparent text-xs text-[#8ba8c8] hover:text-white transition-colors disabled:opacity-50"
                    >
                      {ts === 'sending' ? (
                        <span className="w-3 h-3 border border-[#94a3b8]/30 border-t-[#94a3b8] rounded-full animate-spin" />
                      ) : ts === 'sent' ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                      {ts === 'sending' ? 'Sending...' : ts === 'sent' ? 'Sent!' : 'Test'}
                    </button>
                    <button
                      onClick={() => toggleChannel(ch.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                        ch.enabled
                          ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                          : 'bg-transparent border-[rgba(30,63,102,0.5)] text-[#3d5a7a] hover:text-white'
                      }`}
                    >
                      {ch.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => deleteChannel(ch.id)} className="p-1.5 rounded-lg text-[#3d5a7a] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Severity filters */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-[10px] text-[#3d5a7a] uppercase tracking-wider">Notify on:</span>
                  {SEVERITIES.map((sev) => (
                    <button
                      key={sev}
                      onClick={() => toggleSeverity(ch.id, sev)}
                      className={`px-2 py-0.5 rounded border text-[10px] transition-colors ${
                        ch.severities.includes(sev)
                          ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                          : 'border-[rgba(30,63,102,0.5)] text-[#3d5a7a] hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Pending alerts preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Alerts Pending Notification</h3>
            <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">{openAlerts.length} pending</span>
          </div>
        </CardHeader>
        <div className="divide-y divide-[rgba(30,63,102,0.4)]">
          {openAlerts.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3">
              <SeverityBadge severity={a.severity} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white truncate">{a.title}</div>
                <div className="text-[10px] text-[#3d5a7a] font-mono">{a.mitreId} · {a.affectedHosts.join(', ')}</div>
              </div>
              <div className="flex gap-1">
                {channels.filter(c => c.enabled && c.severities.includes(a.severity)).map((c) => (
                  <div key={c.id} title={c.name} className={`p-1 rounded ${c.type === 'email' ? 'text-blue-400' : 'text-purple-400'}`}>
                    <ChannelIcon type={c.type} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Log */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-white">Notification Log</h3>
          <p className="text-xs text-[#3d5a7a] mt-0.5">Recent delivery history</p>
        </CardHeader>
        <div className="divide-y divide-[rgba(30,63,102,0.4)]">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 px-5 py-3">
              <div className={`p-1.5 rounded-lg border ${log.type === 'email' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-purple-500/10 border-purple-500/30'}`}>
                <ChannelIcon type={log.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white truncate">{log.alert}</div>
                <div className="text-[10px] text-[#3d5a7a]">{log.channel} · {log.sentAt}</div>
              </div>
              <SeverityBadge severity={log.severity} />
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                log.status === 'sent'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {log.status === 'sent' ? '✓ SENT' : '✗ FAILED'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
