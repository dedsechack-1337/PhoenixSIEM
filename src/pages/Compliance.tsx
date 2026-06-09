import { useState } from 'react';
import { CheckSquare, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { complianceChecks, ComplianceStatus } from '../data';

const frameworks = ['PCI-DSS', 'CIS', 'HIPAA', 'NIST', 'SOC2', 'ISO27001'];

const frameworkColors: Record<string, string> = {
  'PCI-DSS': '#f97316',
  'CIS': '#38bdf8',
  'HIPAA': '#a78bfa',
  'NIST': '#10b981',
  'SOC2': '#eab308',
  'ISO27001': '#ec4899',
};

const statusConfig: Record<ComplianceStatus, { color: string; icon: any; label: string }> = {
  pass:    { color: '#10b981', icon: CheckSquare, label: 'PASS' },
  fail:    { color: '#ef4444', icon: XCircle, label: 'FAIL' },
  warning: { color: '#eab308', icon: AlertTriangle, label: 'WARN' },
};

export default function Compliance() {
  const [activeFramework, setActiveFramework] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = complianceChecks.filter(c => activeFramework === 'all' || c.framework === activeFramework);

  const getFrameworkScore = (fw: string) => {
    const checks = complianceChecks.filter(c => c.framework === fw);
    const passed = checks.filter(c => c.status === 'pass').length;
    return checks.length > 0 ? Math.round((passed / checks.length) * 100) : 0;
  };

  const overallPassed = complianceChecks.filter(c => c.status === 'pass').length;
  const overallScore = Math.round((overallPassed / complianceChecks.length) * 100);

  const formatTs = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Compliance</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215,15%,45%)' }}>
            {complianceChecks.filter(c => c.status === 'pass').length} passing · {complianceChecks.filter(c => c.status === 'fail').length} failing · {complianceChecks.filter(c => c.status === 'warning').length} warning
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono" style={{ color: overallScore >= 70 ? '#10b981' : overallScore >= 50 ? '#eab308' : '#ef4444' }}>
            {overallScore}%
          </div>
          <div className="text-xs" style={{ color: 'hsl(215,15%,45%)' }}>Overall Compliance</div>
        </div>
      </div>

      {/* Framework score cards */}
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {frameworks.map(fw => {
          const score = getFrameworkScore(fw);
          const scoreColor = score >= 70 ? '#10b981' : score >= 50 ? '#eab308' : '#ef4444';
          const checks = complianceChecks.filter(c => c.framework === fw);
          const fails = checks.filter(c => c.status === 'fail').length;
          return (
            <Card
              key={fw}
              className="p-3 cursor-pointer"
              hover
              onClick={() => setActiveFramework(activeFramework === fw ? 'all' : fw)}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className="text-[10px] font-bold"
                  style={{ color: frameworkColors[fw] }}
                >{fw}</span>
                {activeFramework === fw && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                )}
              </div>
              <div className="text-2xl font-bold font-mono mb-1" style={{ color: scoreColor }}>{score}%</div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222,22%,20%)' }}>
                <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
              </div>
              {fails > 0 && (
                <div className="text-[10px] mt-1.5" style={{ color: '#ef4444' }}>{fails} failing</div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveFramework('all')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: activeFramework === 'all' ? 'rgba(16,185,129,0.15)' : 'hsl(222,33%,14%)',
            color: activeFramework === 'all' ? '#10b981' : 'hsl(215,15%,50%)',
            border: `1px solid ${activeFramework === 'all' ? 'rgba(16,185,129,0.3)' : 'hsl(222,22%,20%)'}`,
          }}
        >All Frameworks</button>
        {frameworks.map(fw => (
          <button
            key={fw}
            onClick={() => setActiveFramework(activeFramework === fw ? 'all' : fw)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: activeFramework === fw ? `${frameworkColors[fw]}15` : 'hsl(222,33%,14%)',
              color: activeFramework === fw ? frameworkColors[fw] : 'hsl(215,15%,50%)',
              border: `1px solid ${activeFramework === fw ? `${frameworkColors[fw]}40` : 'hsl(222,22%,20%)'}`,
            }}
          >{fw}</button>
        ))}
      </div>

      {/* Check list */}
      <div className="space-y-2">
        {filtered.map(check => {
          const cfg = statusConfig[check.status];
          const Icon = cfg.icon;
          const isExpanded = expanded === check.id;
          return (
            <Card key={check.id} className="overflow-hidden">
              <div
                className="flex items-center gap-3 p-3.5 cursor-pointer hover:opacity-90"
                style={{ borderLeft: `3px solid ${cfg.color}` }}
                onClick={() => setExpanded(isExpanded ? null : check.id)}
              >
                <Icon size={16} style={{ color: cfg.color, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge color={frameworkColors[check.framework]} className="text-[10px]">{check.framework}</Badge>
                    <span className="font-mono text-[10px]" style={{ color: 'hsl(215,15%,40%)' }}>{check.controlId}</span>
                    <span className="text-xs font-semibold" style={{ color: '#f1f5f9' }}>{check.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                    style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
                  >{cfg.label}</span>
                  <span className="text-[10px]" style={{ color: 'hsl(215,15%,40%)' }}>{formatTs(check.lastChecked)}</span>
                  {isExpanded ? <ChevronUp size={14} style={{ color: 'hsl(215,15%,40%)' }} /> : <ChevronDown size={14} style={{ color: 'hsl(215,15%,40%)' }} />}
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 space-y-2" style={{ borderTop: '1px solid hsl(222,22%,14%)' }}>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>{check.description}</p>
                  {check.status !== 'pass' && (
                    <div className="text-xs px-3 py-2 rounded-lg" style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}20`, color: cfg.color }}>
                      <strong>Remediation:</strong> {check.remediation}
                    </div>
                  )}
                  {check.affectedAssets > 0 && (
                    <p className="text-xs" style={{ color: 'hsl(215,15%,40%)' }}>
                      Affects <strong style={{ color: '#f1f5f9' }}>{check.affectedAssets}</strong> asset{check.affectedAssets !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
