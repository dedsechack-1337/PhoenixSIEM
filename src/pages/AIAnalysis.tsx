import { useState } from 'react';
import { Flame, Zap, Send, Copy, RotateCcw, AlertTriangle, Shield, Search, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { securityEvents, alerts } from '../data/mockData';

const QUICK_PROMPTS = [
  { label: 'Analyze Critical Alerts', prompt: 'Analyze all critical severity alerts in this SIEM. Identify patterns, correlate events, and provide a prioritized incident response plan.' },
  { label: 'C2 Beacon Investigation', prompt: 'Investigate the Cobalt Strike C2 beacon activity detected on ws-finance-04. What is the likely attack chain and what containment steps should I take?' },
  { label: 'Ransomware Triage', prompt: 'A ransomware encryption campaign is active on fs-server-01. Provide an immediate triage checklist and incident response steps.' },
  { label: 'Threat Hunt', prompt: 'Based on the current events, suggest 5 threat hunting hypotheses I should investigate, with specific IoCs and detection queries.' },
  { label: 'MITRE Mapping', prompt: 'Map the current active alerts to MITRE ATT&CK tactics and techniques, identify the most likely attack campaign, and suggest detection improvements.' },
  { label: 'Executive Summary', prompt: 'Write a concise executive summary of the current security posture for the CISO, covering critical risks, ongoing incidents, and recommended actions.' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function buildContext(): string {
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high').slice(0, 6);
  const recentEvents = securityEvents.slice(0, 10);
  return `
=== PHOENIXSIEM CONTEXT (Live Data) ===

ACTIVE ALERTS (Critical/High):
${criticalAlerts.map((a) => `- [${a.severity.toUpperCase()}] ${a.title} | Status: ${a.status} | MITRE: ${a.mitreId} (${a.mitre}) | Hosts: ${a.affectedHosts.join(', ')} | Events: ${a.eventCount}`).join('\n')}

RECENT SECURITY EVENTS (Last 10):
${recentEvents.map((e) => `- [${e.severity.toUpperCase()}] ${e.description} | Host: ${e.host} | Source: ${e.source} | Rule: ${e.ruleId}`).join('\n')}

ENVIRONMENT:
- Total assets: 12 | Online: 11 | Warning: 3
- 24h event volume: 3,847 events
- Active IOCs: 12 tracked
- Platform: PhoenixSIEM v6.5.7 Enterprise
`.trim();
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-orange-500/15 border border-orange-500/25 rounded-2xl rounded-br-sm px-4 py-3">
          <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-600/30 border border-orange-500/40 flex items-center justify-center">
        <Flame className="w-3.5 h-3.5 text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-transparent border border-[rgba(30,63,102,0.5)] rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">Phoenix AI</span>
              <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-orange-500/10 border border-orange-500/30">
                <Zap className="w-2.5 h-2.5 text-orange-400" />
                <span className="text-[8px] text-orange-400 font-semibold">Sonnet</span>
              </span>
            </div>
            <button onClick={copy} className="text-[#3d5a7a] hover:text-white transition-colors">
              <Copy className="w-3 h-3" />
            </button>
          </div>
          {copied && <span className="text-[10px] text-green-400">Copied!</span>}
          <div className="text-sm text-[#f0f6ff] whitespace-pre-wrap leading-relaxed">{msg.content}</div>
        </div>
      </div>
    </div>
  );
}

export function AIAnalysis() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [error, setError] = useState('');

  const contextData = buildContext();

  const sendMessage = async (userText: string) => {
    if (!userText.trim()) return;
    if (!apiKey) { setShowKeyInput(true); return; }

    const userMsg: Message = { role: 'user', content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are Phoenix AI, an expert SOC analyst and cybersecurity AI assistant embedded in PhoenixSIEM. You have deep expertise in threat detection, incident response, MITRE ATT&CK, malware analysis, and security operations. You analyze live SIEM data and provide actionable, expert-level security guidance.

Always be precise, use proper security terminology, reference specific events/alerts when relevant, and provide clear prioritized recommendations. Format responses with clear structure using headers (##), bullet points, and severity indicators where helpful.

${contextData}`,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const assistantText = data.content?.map((c: { type: string; text?: string }) => c.type === 'text' ? c.text : '').join('') || '';
      setMessages([...newMessages, { role: 'assistant', content: assistantText }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reach AI. Check your API key.');
      setMessages(newMessages); // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" /> Phoenix AI — Threat Analysis
          </h2>
          <p className="text-xs text-[#3d5a7a] mt-0.5">Claude-powered SOC analyst with real-time SIEM context</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-[rgba(30,63,102,0.5)] text-xs text-[#8ba8c8] hover:text-white hover:border-orange-500/30 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            {apiKey ? '✓ API Key Set' : 'Set API Key'}
            <ChevronDown className="w-3 h-3" />
          </button>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-[rgba(30,63,102,0.5)] text-xs text-[#8ba8c8] hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* API Key Input */}
      {showKeyInput && (
        <Card>
          <CardBody>
            <p className="text-xs text-[#8ba8c8] mb-2">
              Enter your <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-orange-400 underline">Anthropic API key</a>. It stays in your browser session only — never sent anywhere except Anthropic.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent border border-[rgba(30,63,102,0.5)] rounded-lg text-xs text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50"
              />
              <button
                onClick={() => setShowKeyInput(false)}
                className="px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30 transition-colors"
              >
                Save
              </button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Context preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#3d5a7a]" />
            <span className="text-xs font-semibold text-[#8ba8c8]">Live SIEM Context Loaded</span>
          </div>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Critical Alerts', value: alerts.filter(a => a.severity === 'critical').length.toString(), color: 'text-red-400' },
              { label: 'High Alerts', value: alerts.filter(a => a.severity === 'high').length.toString(), color: 'text-orange-400' },
              { label: 'Open Incidents', value: alerts.filter(a => a.status === 'open').length.toString(), color: 'text-yellow-400' },
              { label: 'Events (24h)', value: '3,847', color: 'text-blue-400' },
            ].map((s) => (
              <div key={s.label} className="text-center py-2 px-3 rounded-lg bg-transparent border border-[rgba(30,63,102,0.5)]">
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-[#3d5a7a]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent critical events */}
          <div className="mt-3 space-y-1">
            {securityEvents.filter(e => e.severity === 'critical').slice(0, 3).map(e => (
              <div key={e.id} className="flex items-center gap-2 text-[11px]">
                <SeverityBadge severity={e.severity} className="flex-shrink-0" />
                <span className="text-[#8ba8c8] truncate">{e.description}</span>
                <span className="text-[#3d5a7a] flex-shrink-0 font-mono">{e.host}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Quick prompts */}
      {messages.length === 0 && (
        <div>
          <p className="text-xs text-[#3d5a7a] mb-3 font-medium uppercase tracking-wider">Quick Analysis Prompts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.label}
                onClick={() => sendMessage(qp.prompt)}
                className="text-left px-4 py-3 rounded-xl bg-transparent border border-[rgba(30,63,102,0.5)] hover:border-orange-500/30 hover:bg-transparent transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3 h-3 text-orange-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-white">{qp.label}</span>
                </div>
                <p className="text-[11px] text-[#3d5a7a] line-clamp-2 group-hover:text-[#8ba8c8] transition-colors">{qp.prompt}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <Card>
          <CardBody>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {loading && (
                <div className="flex gap-3 items-center">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-600/30 border border-orange-500/40 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-transparent border border-[rgba(30,63,102,0.5)] rounded-2xl rounded-tl-sm">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Ask Phoenix AI about threats, incidents, or request analysis..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-transparent border border-[rgba(30,63,102,0.5)] rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 disabled:opacity-50 transition-colors"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-[#3d5a7a] text-center">Phoenix AI has access to all current SIEM data. Responses are AI-generated — always verify before acting.</p>
    </div>
  );
}
