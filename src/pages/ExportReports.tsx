import { useState } from 'react';
import { Download, FileText, Table, Calendar, CheckCircle, Clock, Loader, Shield } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { alerts, securityEvents, assets, threatIntel } from '../data/mockData';
import { format } from 'date-fns';

type ExportFormat = 'csv' | 'pdf';
type ReportType = 'alerts' | 'events' | 'assets' | 'threat_intel' | 'executive';

interface ExportJob {
  id: string;
  report: string;
  format: ExportFormat;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  rows?: number;
  createdAt: string;
  size?: string;
}

const REPORT_CONFIGS: Record<ReportType, { label: string; description: string; rows: number; icon: typeof Shield }> = {
  alerts: { label: 'Alert Report', description: 'All alerts with MITRE mappings, status, and investigation notes', rows: alerts.length, icon: Shield },
  events: { label: 'Security Events', description: 'Full event log with source IPs, hosts, and raw logs', rows: securityEvents.length, icon: FileText },
  assets: { label: 'Asset Inventory', description: 'All endpoints with risk scores, OS, tags, and owner info', rows: assets.length, icon: Table },
  threat_intel: { label: 'Threat Intel IOCs', description: 'All indicators of compromise with confidence scores', rows: threatIntel.length, icon: Shield },
  executive: { label: 'Executive Summary', description: 'High-level security posture report for management', rows: 1, icon: FileText },
};

// ── CSV generators ────────────────────────────────────────────────────────────

function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateAlertsCSV() {
  const headers = ['ID', 'Timestamp', 'Title', 'Severity', 'Status', 'MITRE ID', 'MITRE Tactic', 'Affected Hosts', 'Event Count', 'Assignee', 'Notes'];
  const rows = alerts.map((a) => [
    a.id, format(a.timestamp, 'yyyy-MM-dd HH:mm:ss'), `"${a.title}"`, a.severity, a.status,
    a.mitreId, `"${a.mitre}"`, `"${a.affectedHosts.join('; ')}"`, a.eventCount,
    a.assignee || '', `"${a.notes.join('; ')}"`,
  ]);
  return [headers, ...rows].map((r) => r.join(',')).join('\n');
}

function generateEventsCSV() {
  const headers = ['ID', 'Timestamp', 'Severity', 'Type', 'Source IP', 'Destination IP', 'Host', 'User', 'Rule ID', 'Description'];
  const rows = securityEvents.map((e) => [
    e.id, format(e.timestamp, 'yyyy-MM-dd HH:mm:ss'), e.severity, e.type,
    e.source, e.destination || '', e.host, e.user || '', e.ruleId, `"${e.description}"`,
  ]);
  return [headers, ...rows].map((r) => r.join(',')).join('\n');
}

function generateAssetsCSV() {
  const headers = ['ID', 'Hostname', 'IP', 'OS', 'Type', 'Status', 'Risk Score', 'Agent Version', 'Owner', 'Location', 'Tags'];
  const rows = assets.map((a) => [
    a.id, a.hostname, a.ip, a.os, a.type, a.status, a.riskScore,
    a.agentVersion, a.owner, a.location, `"${a.tags.join('; ')}"`,
  ]);
  return [headers, ...rows].map((r) => r.join(',')).join('\n');
}

function generateThreatIntelCSV() {
  const headers = ['ID', 'IOC', 'Type', 'Category', 'Confidence', 'Active', 'Source', 'First Seen', 'Last Seen', 'Tags', 'Description'];
  const rows = threatIntel.map((t) => [
    t.id, t.ioc, t.type, t.category, t.confidence, t.active ? 'Yes' : 'No',
    t.source, format(t.firstSeen, 'yyyy-MM-dd'), format(t.lastSeen, 'yyyy-MM-dd'),
    `"${t.tags.join('; ')}"`, `"${t.description}"`,
  ]);
  return [headers, ...rows].map((r) => r.join(',')).join('\n');
}

// ── Simple HTML→PDF-style text report ────────────────────────────────────────

function generateExecutiveHTML(): string {
  const now = new Date();
  const critical = alerts.filter((a) => a.severity === 'critical');
  const open = alerts.filter((a) => a.status === 'open');
  const onlineAssets = assets.filter((a) => a.status === 'online').length;

  return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"/>
<title>PhoenixSIEM Executive Summary</title>
<style>
  body{font-family:system-ui,sans-serif;background:#fff;color:#111;margin:40px;max-width:900px}
  h1{color:#e85d04;border-bottom:2px solid #e85d04;padding-bottom:8px}
  h2{color:#333;margin-top:32px}
  table{width:100%;border-collapse:collapse;margin-top:12px}
  th{background:#e85d04;color:white;text-align:left;padding:8px 12px;font-size:13px}
  td{padding:8px 12px;border-bottom:1px solid #eee;font-size:13px}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600}
  .critical{background:#fee2e2;color:#b91c1c}
  .high{background:#ffedd5;color:#c2410c}
  .medium{background:#fef9c3;color:#854d0e}
  .open{background:#fee2e2;color:#b91c1c}
  .resolved{background:#dcfce7;color:#166534}
  .stat{display:inline-block;background:#f3f4f6;border-radius:8px;padding:16px 24px;margin:8px;text-align:center}
  .stat-num{font-size:32px;font-weight:700;color:#e85d04}
  .stat-label{font-size:12px;color:#666}
</style>
</head><body>
<h1>🔥 PhoenixSIEM — Executive Security Summary</h1>
<p><strong>Generated:</strong> ${format(now, 'PPPp')} &nbsp;|&nbsp; <strong>Period:</strong> Last 24 hours &nbsp;|&nbsp; <strong>Classification:</strong> CONFIDENTIAL</p>

<h2>Security Posture Overview</h2>
<div>
  <div class="stat"><div class="stat-num">${alerts.length}</div><div class="stat-label">Total Alerts</div></div>
  <div class="stat"><div class="stat-num" style="color:#b91c1c">${critical.length}</div><div class="stat-label">Critical</div></div>
  <div class="stat"><div class="stat-num" style="color:#c2410c">${open.length}</div><div class="stat-label">Open</div></div>
  <div class="stat"><div class="stat-num" style="color:#166534">${onlineAssets}</div><div class="stat-label">Assets Online</div></div>
  <div class="stat"><div class="stat-num">3,847</div><div class="stat-label">Events (24h)</div></div>
</div>

<h2>Critical & High Priority Alerts</h2>
<table>
  <tr><th>ID</th><th>Alert</th><th>Severity</th><th>Status</th><th>MITRE</th><th>Hosts</th></tr>
  ${alerts.filter(a => a.severity === 'critical' || a.severity === 'high').map(a => `
  <tr>
    <td>${a.id}</td>
    <td>${a.title}</td>
    <td><span class="badge ${a.severity}">${a.severity.toUpperCase()}</span></td>
    <td><span class="badge ${a.status === 'resolved' || a.status === 'closed' ? 'resolved' : 'open'}">${a.status.toUpperCase()}</span></td>
    <td>${a.mitreId}</td>
    <td>${a.affectedHosts.join(', ')}</td>
  </tr>`).join('')}
</table>

<h2>Top Risk Assets</h2>
<table>
  <tr><th>Hostname</th><th>IP</th><th>Risk Score</th><th>Status</th><th>Owner</th></tr>
  ${assets.sort((a,b) => b.riskScore - a.riskScore).slice(0, 5).map(a => `
  <tr>
    <td>${a.hostname}</td>
    <td>${a.ip}</td>
    <td><strong style="color:${a.riskScore > 80 ? '#b91c1c' : a.riskScore > 60 ? '#c2410c' : '#166534'}">${a.riskScore}/100</strong></td>
    <td>${a.status}</td>
    <td>${a.owner}</td>
  </tr>`).join('')}
</table>

<h2>Recommendations</h2>
<ol>
  <li>Immediately isolate and investigate <strong>ws-finance-04</strong> and <strong>ws-finance-09</strong> — active C2 beacons detected.</li>
  <li>Contain active ransomware on <strong>fs-server-01</strong> — disconnect from network and initiate recovery.</li>
  <li>Rotate all domain credentials — Golden Ticket attack detected on <strong>dc-01</strong>.</li>
  <li>Review and restrict outbound DNS for all workstations to prevent DNS tunneling.</li>
  <li>Patch all systems against CVE-2024-3400 (PAN-OS) and CVE-2021-44228 (Log4Shell).</li>
</ol>

<p style="color:#999;font-size:11px;margin-top:40px">Generated by PhoenixSIEM v6.5.7 Enterprise — AI-Powered Security Intelligence Platform</p>
</body></html>`;
}

function downloadHTML(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportReports() {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

  const exportReport = (type: ReportType, fmt: ExportFormat) => {
    const jobId = `${type}-${fmt}-${Date.now()}`;
    const cfg = REPORT_CONFIGS[type];

    const newJob: ExportJob = {
      id: jobId,
      report: cfg.label,
      format: fmt,
      status: 'generating',
      rows: cfg.rows,
      createdAt: format(new Date(), 'HH:mm:ss'),
    };
    setJobs((prev) => [newJob, ...prev]);
    setGenerating(jobId);

    setTimeout(() => {
      try {
        const ts = format(new Date(), 'yyyyMMdd_HHmmss');

        if (fmt === 'csv') {
          let csv = '';
          if (type === 'alerts') csv = generateAlertsCSV();
          else if (type === 'events') csv = generateEventsCSV();
          else if (type === 'assets') csv = generateAssetsCSV();
          else if (type === 'threat_intel') csv = generateThreatIntelCSV();
          else csv = 'Report Type,Generated At\nExecutive Summary,' + ts;
          downloadCSV(`PhoenixSIEM_${type}_${ts}.csv`, csv);
        } else {
          const html = generateExecutiveHTML();
          downloadHTML(`PhoenixSIEM_${type}_${ts}.html`, html);
        }

        setJobs((prev) =>
          prev.map((j) => j.id === jobId ? { ...j, status: 'ready', size: fmt === 'csv' ? '~45 KB' : '~28 KB' } : j)
        );
      } catch {
        setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: 'failed' } : j));
      }
      setGenerating(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-orange-400" /> Export Reports
        </h2>
        <p className="text-xs text-[#3d5a7a] mt-0.5">Download SIEM data as CSV or HTML reports</p>
      </div>

      {/* Report types */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(Object.entries(REPORT_CONFIGS) as [ReportType, typeof REPORT_CONFIGS[ReportType]][]).map(([type, cfg]) => {
          const Icon = cfg.icon;
          const isGen = generating !== null;
          return (
            <Card key={type} className="hover:border-orange-500/30 transition-colors">
              <CardBody>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <Icon className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white">{cfg.label}</h4>
                    <p className="text-xs text-[#3d5a7a] mt-0.5">{cfg.description}</p>
                    <span className="text-[10px] text-[#3d5a7a] font-mono mt-1 block">{cfg.rows} record{cfg.rows !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => exportReport(type, 'csv')}
                    disabled={isGen}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-transparent border border-[rgba(30,63,102,0.5)] text-xs text-[#8ba8c8] hover:text-white hover:border-orange-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Table className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button
                    onClick={() => exportReport(type, 'pdf')}
                    disabled={isGen}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-transparent border border-[rgba(30,63,102,0.5)] text-xs text-[#8ba8c8] hover:text-white hover:border-orange-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="w-3.5 h-3.5" /> HTML Report
                  </button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Quick stats */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-white">Data Summary</h3>
          <p className="text-xs text-[#3d5a7a] mt-0.5">Current dataset available for export</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Alerts', value: alerts.length, sub: `${alerts.filter(a=>a.severity==='critical').length} critical` },
              { label: 'Security Events', value: securityEvents.length, sub: 'last 24 hours' },
              { label: 'Assets', value: assets.length, sub: `${assets.filter(a=>a.status==='online').length} online` },
              { label: 'Threat IOCs', value: threatIntel.length, sub: `${threatIntel.filter(t=>t.active).length} active` },
            ].map((s) => (
              <div key={s.label} className="text-center py-3 px-4 rounded-xl bg-transparent border border-[rgba(30,63,102,0.5)]">
                <div className="text-2xl font-bold text-orange-400">{s.value}</div>
                <div className="text-xs text-[#8ba8c8] mt-0.5">{s.label}</div>
                <div className="text-[10px] text-[#3d5a7a] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recent exports */}
      {jobs.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-white">Recent Exports</h3>
          </CardHeader>
          <div className="divide-y divide-[rgba(30,63,102,0.4)]">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`p-1.5 rounded-lg border ${job.format === 'csv' ? 'bg-green-500/10 border-green-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                  {job.format === 'csv' ? <Table className="w-3.5 h-3.5 text-green-400" /> : <FileText className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white">{job.report} <span className="text-[#3d5a7a] font-mono uppercase text-[10px]">.{job.format}</span></div>
                  <div className="text-[10px] text-[#3d5a7a]">{job.rows} records · {job.createdAt}{job.size ? ` · ${job.size}` : ''}</div>
                </div>
                {job.status === 'generating' && (
                  <div className="flex items-center gap-1.5 text-[10px] text-orange-400">
                    <Loader className="w-3 h-3 animate-spin" /> Generating...
                  </div>
                )}
                {job.status === 'ready' && (
                  <div className="flex items-center gap-1 text-[10px] text-green-400">
                    <CheckCircle className="w-3 h-3" /> Downloaded
                  </div>
                )}
                {job.status === 'failed' && (
                  <span className="text-[10px] text-red-400">✗ Failed</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Scheduled reports hint */}
      <Card className="border-dashed">
        <CardBody>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-transparent border border-[rgba(30,63,102,0.5)]">
              <Calendar className="w-4 h-4 text-[#3d5a7a]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#8ba8c8]">Scheduled Reports</p>
              <p className="text-xs text-[#3d5a7a] mt-0.5">Automatic daily/weekly exports via email — configure in Notification Settings</p>
            </div>
            <Clock className="w-4 h-4 text-[#3d5a7a] ml-auto flex-shrink-0" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
