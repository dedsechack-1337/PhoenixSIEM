// ─── DEMO DATA LAYER ────────────────────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';

// ─── SECURITY EVENTS ────────────────────────────────────────────────────────
export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: Severity;
  source: string;
  destination?: string;
  description: string;
  sourceIp: string;
  destIp?: string;
  user?: string;
  rule: string;
  bytes?: number;
}

const now = Date.now();
const mins = (m: number) => new Date(now - m * 60000).toISOString();

export const securityEvents: SecurityEvent[] = [
  { id:'evt-001', timestamp: mins(1),  type:'Intrusion Attempt',    severity:'critical', source:'ext-fw-01',    destination:'web-srv-01', description:'SQL injection attack detected on /api/login endpoint', sourceIp:'185.220.101.45', destIp:'10.0.1.20', rule:'WEB-SQL-001', bytes:4521 },
  { id:'evt-002', timestamp: mins(2),  type:'Brute Force',          severity:'high',     source:'auth-srv-01',  destination:'dc-01',      description:'Failed RDP login attempts exceeded threshold (50/min)', sourceIp:'92.118.160.17',  destIp:'10.0.0.5',  user:'administrator', rule:'AUTH-BF-002', bytes:1240 },
  { id:'evt-003', timestamp: mins(3),  type:'Malware Detected',     severity:'critical', source:'edr-agent',    destination:'wks-042',    description:'Trojan.GenericKD.47203819 detected in memory', sourceIp:'10.0.5.42',    destIp:'', rule:'MAL-TROG-003', bytes:0 },
  { id:'evt-004', timestamp: mins(5),  type:'Port Scan',            severity:'medium',   source:'ext-fw-01',    destination:'dmz-net',    description:'SYN scan detected across 1024 ports from single source', sourceIp:'45.155.205.34', destIp:'10.0.2.0/24', rule:'SCAN-SYN-004', bytes:890 },
  { id:'evt-005', timestamp: mins(6),  type:'Data Exfiltration',    severity:'critical', source:'dlp-01',       destination:'ext',        description:'Large data transfer to unknown external IP (2.3GB)', sourceIp:'10.0.5.88',    destIp:'203.0.113.99', user:'jsmith', rule:'DLP-EXT-005', bytes:2457600 },
  { id:'evt-006', timestamp: mins(8),  type:'Privilege Escalation', severity:'high',     source:'edr-agent',    destination:'srv-db-01',  description:'Suspicious sudo usage escalating to root privileges', sourceIp:'10.0.3.15',    destIp:'', user:'devops_svc', rule:'PRIV-ESC-006', bytes:0 },
  { id:'evt-007', timestamp: mins(10), type:'Phishing',             severity:'high',     source:'email-gw-01',  destination:'user@corp',  description:'Malicious URL detected in email from spoofed domain', sourceIp:'198.51.100.22', destIp:'', user:'m.chen@corp.local', rule:'PHISH-URL-007', bytes:15320 },
  { id:'evt-008', timestamp: mins(12), type:'Lateral Movement',     severity:'critical', source:'edr-agent',    destination:'dc-01',      description:'Pass-the-hash attack detected targeting domain controller', sourceIp:'10.0.5.42',    destIp:'10.0.0.5', user:'svc_backup', rule:'LAT-PTH-008', bytes:2048 },
  { id:'evt-009', timestamp: mins(14), type:'C2 Communication',     severity:'critical', source:'ndr-01',       destination:'ext',        description:'Cobalt Strike beacon detected — encrypted C2 traffic', sourceIp:'10.0.5.42',    destIp:'91.109.190.14', rule:'C2-CS-009', bytes:98304 },
  { id:'evt-010', timestamp: mins(16), type:'Ransomware Activity',  severity:'critical', source:'edr-agent',    destination:'file-srv-01', description:'Mass file encryption detected — possible ransomware', sourceIp:'10.0.6.77',    destIp:'10.0.1.50', user:'financeuser1', rule:'RANSOM-ENC-010', bytes:0 },
  { id:'evt-011', timestamp: mins(18), type:'Port Scan',            severity:'low',      source:'ext-fw-01',    destination:'dmz-net',    description:'UDP port scan on common service ports', sourceIp:'77.247.181.165', destIp:'10.0.2.100', rule:'SCAN-UDP-011', bytes:256 },
  { id:'evt-012', timestamp: mins(20), type:'Authentication',       severity:'medium',   source:'auth-srv-01',  destination:'vpn-gw-01',  description:'Multiple failed VPN authentication attempts', sourceIp:'88.214.33.110',  destIp:'10.0.0.10', user:'rwalker', rule:'AUTH-VPN-012', bytes:512 },
  { id:'evt-013', timestamp: mins(22), type:'Malware Detected',     severity:'high',     source:'edr-agent',    destination:'wks-018',    description:'PUP.Optional.BundleInstaller detected and quarantined', sourceIp:'10.0.4.18',    destIp:'', user:'bwilson', rule:'MAL-PUP-013', bytes:0 },
  { id:'evt-014', timestamp: mins(25), type:'Intrusion Attempt',    severity:'high',     source:'waf-01',       destination:'api-gw-01',  description:'Path traversal attempt detected on REST API', sourceIp:'185.176.221.88', destIp:'10.0.1.30', rule:'WEB-TRAV-014', bytes:2048 },
  { id:'evt-015', timestamp: mins(28), type:'Data Exfiltration',    severity:'high',     source:'dlp-01',       destination:'ext',        description:'Sensitive data detected in outbound HTTPS traffic', sourceIp:'10.0.3.45',    destIp:'104.21.83.12', user:'t.nguyen', rule:'DLP-PII-015', bytes:843776 },
  { id:'evt-016', timestamp: mins(30), type:'Brute Force',          severity:'medium',   source:'auth-srv-01',  destination:'ssh-gw-01',  description:'SSH brute force attempt from Tor exit node', sourceIp:'185.220.101.67', destIp:'10.0.0.22', rule:'AUTH-SSH-016', bytes:4096 },
  { id:'evt-017', timestamp: mins(32), type:'Policy Violation',     severity:'low',      source:'proxy-01',     destination:'ext',        description:'Access to blocked category (gambling) detected', sourceIp:'10.0.4.99',    destIp:'88.99.66.22', user:'p.parker', rule:'POLICY-CAT-017', bytes:25600 },
  { id:'evt-018', timestamp: mins(35), type:'Privilege Escalation', severity:'critical', source:'siem-core',    destination:'dc-01',      description:'Token impersonation attempt detected via SeImpersonatePrivilege', sourceIp:'10.0.5.88', destIp:'10.0.0.5', user:'svc_iis', rule:'PRIV-TOK-018', bytes:0 },
  { id:'evt-019', timestamp: mins(38), type:'C2 Communication',     severity:'high',     source:'ndr-01',       destination:'ext',        description:'DNS tunneling detected — high entropy TXT record queries', sourceIp:'10.0.6.55',    destIp:'8.8.8.8', rule:'C2-DNS-019', bytes:16384 },
  { id:'evt-020', timestamp: mins(40), type:'Vulnerability Exploit', severity:'critical', source:'ids-01',      destination:'web-srv-01', description:'CVE-2024-3094 XZ backdoor exploitation attempt', sourceIp:'91.240.118.172', destIp:'10.0.1.20', rule:'VULN-XZ-020', bytes:8192 },
  { id:'evt-021', timestamp: mins(42), type:'Intrusion Attempt',    severity:'medium',   source:'ids-01',       destination:'web-srv-02', description:'SSRF attack vector detected via image processing endpoint', sourceIp:'45.33.32.156',  destIp:'10.0.1.21', rule:'WEB-SSRF-021', bytes:1024 },
  { id:'evt-022', timestamp: mins(45), type:'Authentication',       severity:'info',     source:'auth-srv-01',  destination:'corp-wifi',  description:'Successful authentication after geo-anomaly flagged', sourceIp:'192.168.1.200', destIp:'', user:'a.johnson', rule:'AUTH-GEO-022', bytes:128 },
  { id:'evt-023', timestamp: mins(48), type:'Malware Detected',     severity:'high',     source:'edr-agent',    destination:'srv-fin-01', description:'Mimikatz credential dumping tool detected', sourceIp:'10.0.3.200',   destIp:'', user:'root', rule:'MAL-CRED-023', bytes:0 },
  { id:'evt-024', timestamp: mins(50), type:'Policy Violation',     severity:'medium',   source:'dlp-01',       destination:'ext',        description:'Credit card numbers detected in outbound email', sourceIp:'10.0.4.77',    destIp:'smtp.external.com', user:'billing_svc', rule:'DLP-CC-024', bytes:4096 },
  { id:'evt-025', timestamp: mins(55), type:'Port Scan',            severity:'low',      source:'ext-fw-01',    destination:'corp-net',   description:'ICMP ping sweep across /24 network', sourceIp:'203.0.113.45',  destIp:'10.0.5.0/24', rule:'SCAN-ICMP-025', bytes:64 },
  { id:'evt-026', timestamp: mins(60), type:'Lateral Movement',     severity:'high',     source:'edr-agent',    destination:'srv-hr-01',  description:'Unusual SMB tree connections to sensitive share', sourceIp:'10.0.5.42',    destIp:'10.0.3.100', user:'svc_backup', rule:'LAT-SMB-026', bytes:512000 },
  { id:'evt-027', timestamp: mins(65), type:'Vulnerability Exploit', severity:'high',    source:'ids-01',       destination:'ssh-gw-01',  description:'CVE-2024-6387 regreSSHion exploit attempt detected', sourceIp:'185.191.127.26', destIp:'10.0.0.22', rule:'VULN-SSH-027', bytes:4096 },
  { id:'evt-028', timestamp: mins(70), type:'Ransomware Activity',  severity:'high',     source:'edr-agent',    destination:'wks-055',    description:'Shadow copy deletion via vssadmin.exe detected', sourceIp:'10.0.6.55',    destIp:'', user:'wks055_admin', rule:'RANSOM-VSS-028', bytes:0 },
  { id:'evt-029', timestamp: mins(75), type:'Brute Force',          severity:'high',     source:'auth-srv-01',  destination:'o365-gw',    description:'Password spray attack against Microsoft 365 accounts', sourceIp:'194.165.16.66', destIp:'login.microsoft.com', rule:'AUTH-SPRAY-029', bytes:2048 },
  { id:'evt-030', timestamp: mins(80), type:'C2 Communication',     severity:'critical', source:'ndr-01',       destination:'ext',        description:'Meterpreter reverse shell connection established', sourceIp:'10.0.5.42',    destIp:'45.142.212.100', rule:'C2-MSF-030', bytes:196608 },
  { id:'evt-031', timestamp: mins(85), type:'Policy Violation',     severity:'low',      source:'proxy-01',     destination:'ext',        description:'Tor browser usage detected on corporate network', sourceIp:'10.0.4.33',    destIp:'185.220.101.1', user:'r.smith', rule:'POLICY-TOR-031', bytes:1048576 },
  { id:'evt-032', timestamp: mins(90), type:'Authentication',       severity:'medium',   source:'auth-srv-01',  destination:'dc-01',      description:'Kerberoasting attack detected — SPN enumeration', sourceIp:'10.0.5.88',    destIp:'10.0.0.5', user:'jsmith', rule:'AUTH-KRB-032', bytes:8192 },
  { id:'evt-033', timestamp: mins(95), type:'Malware Detected',     severity:'critical', source:'edr-agent',    destination:'wks-001',    description:'Emotet dropper detected and blocked at execution', sourceIp:'10.0.4.1',     destIp:'', user:'ceo_user', rule:'MAL-EMOT-033', bytes:0 },
  { id:'evt-034', timestamp: mins(100), type:'Intrusion Attempt',   severity:'high',     source:'waf-01',       destination:'checkout',   description:'XSS payload detected in checkout form submission', sourceIp:'91.108.56.202', destIp:'10.0.1.25', rule:'WEB-XSS-034', bytes:512 },
  { id:'evt-035', timestamp: mins(105), type:'Data Exfiltration',   severity:'medium',   source:'dlp-01',       destination:'ext',        description:'Source code detected in Pastebin upload', sourceIp:'10.0.3.77',    destIp:'pastebin.com', user:'dev_contractor', rule:'DLP-CODE-035', bytes:204800 },
  { id:'evt-036', timestamp: mins(110), type:'Privilege Escalation', severity:'high',    source:'edr-agent',    destination:'linux-srv-01', description:'SUID binary abuse for privilege escalation', sourceIp:'10.0.3.30',  destIp:'', user:'www-data', rule:'PRIV-SUID-036', bytes:0 },
  { id:'evt-037', timestamp: mins(115), type:'Port Scan',           severity:'medium',   source:'ext-fw-01',    destination:'dmz-net',    description:'Nmap OS detection scan from external source', sourceIp:'194.61.24.109', destIp:'10.0.2.0/24', rule:'SCAN-OS-037', bytes:2048 },
  { id:'evt-038', timestamp: mins(120), type:'Vulnerability Exploit', severity:'critical', source:'ids-01',    destination:'conn-srv-01', description:'CVE-2024-1709 ScreenConnect auth bypass exploited', sourceIp:'185.220.101.45', destIp:'10.0.1.40', rule:'VULN-SC-038', bytes:16384 },
  { id:'evt-039', timestamp: mins(125), type:'Lateral Movement',    severity:'medium',   source:'edr-agent',    destination:'multiple',   description:'WMI remote execution across 5 endpoints detected', sourceIp:'10.0.0.50',    destIp:'10.0.4.0/24', user:'domain_admin', rule:'LAT-WMI-039', bytes:0 },
  { id:'evt-040', timestamp: mins(130), type:'Brute Force',         severity:'low',      source:'auth-srv-01',  destination:'ftp-01',     description:'Repeated FTP authentication failures from internal host', sourceIp:'10.0.4.200',   destIp:'10.0.1.60', rule:'AUTH-FTP-040', bytes:256 },
  { id:'evt-041', timestamp: mins(135), type:'C2 Communication',    severity:'high',     source:'ndr-01',       destination:'ext',        description:'Suspicious HTTPS beaconing — 60s interval to cloud IP', sourceIp:'10.0.6.77',    destIp:'52.72.193.44', rule:'C2-BEACON-041', bytes:65536 },
  { id:'evt-042', timestamp: mins(140), type:'Phishing',            severity:'critical', source:'email-gw-01',  destination:'exec',       description:'Whaling attempt targeting CFO with wire transfer request', sourceIp:'209.85.220.41', destIp:'', user:'cfo@corp.local', rule:'PHISH-WHALE-042', bytes:8192 },
  { id:'evt-043', timestamp: mins(145), type:'Policy Violation',    severity:'medium',   source:'proxy-01',     destination:'ext',        description:'Cloud storage upload of 500MB+ file without DLP approval', sourceIp:'10.0.4.55',    destIp:'drive.google.com', user:'s.wilson', rule:'POLICY-CS-043', bytes:524288 },
  { id:'evt-044', timestamp: mins(150), type:'Authentication',      severity:'info',     source:'auth-srv-01',  destination:'vpn-gw-01',  description:'Service account authenticated outside maintenance window', sourceIp:'10.0.100.5',   destIp:'10.0.0.10', user:'svc_monitoring', rule:'AUTH-WIN-044', bytes:128 },
];

// ─── TIMELINE DATA ──────────────────────────────────────────────────────────
export interface TimelinePoint {
  time: string;
  total: number;
  critical: number;
}

export const timelineData: TimelinePoint[] = Array.from({ length: 24 }, (_, i) => {
  const h = i;
  const total = Math.floor(Math.random() * 180) + 20;
  const critical = Math.floor(total * (Math.random() * 0.3 + 0.05));
  return { time: `${String(h).padStart(2,'0')}:00`, total, critical };
});

// ─── ALERTS ─────────────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  status: AlertStatus;
  mitreTactic: string;
  mitreTechnique: string;
  mitreId: string;
  asset: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  events: number;
  description: string;
  notes?: string;
  iocs: string[];
}

export const alerts: Alert[] = [
  { id:'alr-001', title:'Active Ransomware Campaign — Finance Subnet', severity:'critical', status:'investigating', mitreTactic:'Impact', mitreTechnique:'Data Encrypted for Impact', mitreId:'T1486', asset:'wks-055, srv-fin-01', assignee:'K. Martinez', createdAt: mins(15), updatedAt: mins(5), events:8, description:'Multiple endpoints showing signs of ransomware activity including shadow copy deletion, mass file encryption, and C2 beaconing.', notes:'Isolated affected hosts. Notified IR team. Checking backup integrity.', iocs:['10.0.6.77','10.0.6.55','45.142.212.100'] },
  { id:'alr-002', title:'Cobalt Strike C2 Infrastructure Detected', severity:'critical', status:'open', mitreTactic:'Command and Control', mitreTechnique:'Application Layer Protocol', mitreId:'T1071.001', asset:'wks-042', assignee:'', createdAt: mins(20), updatedAt: mins(20), events:4, description:'Cobalt Strike beacon detected communicating with known C2 infrastructure. Host wks-042 appears to be the initial access point.', notes:'', iocs:['91.109.190.14','10.0.5.42','cobaltbeacon.darkhotel.ru'] },
  { id:'alr-003', title:'Pass-the-Hash — Domain Admin Compromise', severity:'critical', status:'investigating', mitreTactic:'Lateral Movement', mitreTechnique:'Pass the Hash', mitreId:'T1550.002', asset:'wks-042 → dc-01', assignee:'J. Thompson', createdAt: mins(25), updatedAt: mins(10), events:6, description:'Pass-the-hash attack originating from compromised workstation attempting to authenticate to domain controller.', notes:'Reset KRBTGT password. Reviewing DC security logs.', iocs:['10.0.5.42','10.0.0.5','svc_backup'] },
  { id:'alr-004', title:'Whaling Email Targeting CFO', severity:'high', status:'acknowledged', mitreTactic:'Initial Access', mitreTechnique:'Spearphishing Link', mitreId:'T1566.002', asset:'cfo@corp.local', assignee:'L. Chen', createdAt: mins(50), updatedAt: mins(30), events:2, description:'Sophisticated whaling attempt impersonating CEO requesting urgent wire transfer. Email passed SPF/DKIM checks using lookalike domain.', notes:'CFO notified. Email quarantined. Domain reported.', iocs:['corp-finance-request.net','209.85.220.41'] },
  { id:'alr-005', title:'SQL Injection Campaign on Web API', severity:'high', status:'open', mitreTactic:'Initial Access', mitreTechnique:'Exploit Public-Facing Application', mitreId:'T1190', asset:'web-srv-01, api-gw-01', assignee:'', createdAt: mins(60), updatedAt: mins(60), events:5, description:'Automated SQL injection campaign targeting multiple API endpoints. WAF blocking most attempts but some payloads are evading detection.', notes:'', iocs:['185.220.101.45','185.176.221.88'] },
  { id:'alr-006', title:'Mimikatz Credential Harvesting', severity:'high', status:'resolved', mitreTactic:'Credential Access', mitreTechnique:'OS Credential Dumping', mitreId:'T1003', asset:'srv-fin-01', assignee:'K. Martinez', createdAt: mins(120), updatedAt: mins(60), events:3, description:'Mimikatz-style credential dumping detected on finance server. LSASS process access by unauthorized process.', notes:'Credentials rotated for all service accounts. AV updated. Host reimaged.', iocs:['10.0.3.200','mimikatz.exe hash: a1b2c3d4'] },
  { id:'alr-007', title:'DNS Tunneling — Data Exfiltration via DNS', severity:'high', status:'open', mitreTactic:'Exfiltration', mitreTechnique:'Exfiltration Over Alternative Protocol', mitreId:'T1048', asset:'10.0.6.55', assignee:'', createdAt: mins(80), updatedAt: mins(80), events:3, description:'High-entropy DNS TXT queries indicating DNS tunneling for C2 or data exfiltration. Pattern suggests Iodine or similar tool.', notes:'', iocs:['tunnel.ext-c2.xyz','10.0.6.55'] },
  { id:'alr-008', title:'Password Spray Against Microsoft 365', severity:'high', status:'acknowledged', mitreTactic:'Credential Access', mitreTechnique:'Brute Force: Password Spraying', mitreId:'T1110.003', asset:'o365-gw', assignee:'R. Garcia', createdAt: mins(90), updatedAt: mins(45), events:4, description:'Password spray attack targeting 200+ M365 accounts with common passwords. 3 successful authentications detected from Tor exit nodes.', notes:'Forced MFA re-enrollment. Blocked Tor IPs at perimeter.', iocs:['194.165.16.66','login.microsoft.com'] },
  { id:'alr-009', title:'Kerberoasting Attack — SPN Enumeration', severity:'medium', status:'closed', mitreTactic:'Credential Access', mitreTechnique:'Steal or Forge Kerberos Tickets', mitreId:'T1558.003', asset:'dc-01', assignee:'J. Thompson', createdAt: mins(200), updatedAt: mins(100), events:2, description:'Kerberoasting attack detected. Service account SPNs enumerated and TGS tickets requested for offline cracking.', notes:'Service account passwords reset with 30+ char random strings. Monitoring enabled.', iocs:['10.0.5.88','jsmith'] },
  { id:'alr-010', title:'Source Code Exfiltration via Pastebin', severity:'medium', status:'open', mitreTactic:'Exfiltration', mitreTechnique:'Exfiltration to Code Repository', mitreId:'T1567.001', asset:'dev workstation', assignee:'', createdAt: mins(110), updatedAt: mins(110), events:1, description:'Source code content detected in outbound upload to Pastebin. Contractor account may be exfiltrating proprietary code.', notes:'', iocs:['dev_contractor','pastebin.com','10.0.3.77'] },
  { id:'alr-011', title:'SUID Binary Privilege Escalation on Linux', severity:'high', status:'resolved', mitreTactic:'Privilege Escalation', mitreTechnique:'Abuse Elevation Control Mechanism', mitreId:'T1548', asset:'linux-srv-01', assignee:'K. Martinez', createdAt: mins(180), updatedAt: mins(90), events:2, description:'SUID binary abused by web application user www-data to gain root privileges on production Linux server.', notes:'SUID bit removed from binary. Root cause analysis complete. Patched.', iocs:['www-data','10.0.3.30','/usr/bin/find'] },
  { id:'alr-012', title:'ScreenConnect Auth Bypass — CVE-2024-1709', severity:'critical', status:'investigating', mitreTactic:'Initial Access', mitreTechnique:'Exploit Public-Facing Application', mitreId:'T1190', asset:'conn-srv-01', assignee:'R. Garcia', createdAt: mins(130), updatedAt: mins(20), events:3, description:'Critical ScreenConnect vulnerability actively exploited. Attacker gained unauthenticated access to remote management console.', notes:'ScreenConnect taken offline. Investigating scope of access.', iocs:['185.220.101.45','10.0.1.40','CVE-2024-1709'] },
];

// ─── ASSETS ─────────────────────────────────────────────────────────────────
export type AssetType = 'workstation' | 'server' | 'network' | 'mobile' | 'cloud';
export type AssetOS = 'Windows' | 'Linux' | 'macOS' | 'Network OS' | 'Android' | 'iOS';

export interface Asset {
  id: string;
  hostname: string;
  ip: string;
  os: AssetOS;
  type: AssetType;
  riskScore: number;
  agentVersion: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'warning';
  department: string;
  owner: string;
  tags: string[];
}

export const assets: Asset[] = [
  { id:'ast-001', hostname:'dc-01',         ip:'10.0.0.5',    os:'Windows', type:'server',      riskScore:72, agentVersion:'4.7.2', lastSeen: mins(2),   status:'online',  department:'IT',      owner:'sysadmin',       tags:['critical','domain-controller'] },
  { id:'ast-002', hostname:'web-srv-01',    ip:'10.0.1.20',   os:'Linux',   type:'server',      riskScore:85, agentVersion:'4.7.2', lastSeen: mins(1),   status:'online',  department:'DevOps',  owner:'webmaster',      tags:['dmz','public-facing'] },
  { id:'ast-003', hostname:'wks-042',       ip:'10.0.5.42',   os:'Windows', type:'workstation', riskScore:98, agentVersion:'4.7.1', lastSeen: mins(5),   status:'online',  department:'Finance', owner:'jsmith',         tags:['compromised','high-priority'] },
  { id:'ast-004', hostname:'srv-fin-01',    ip:'10.0.3.200',  os:'Windows', type:'server',      riskScore:91, agentVersion:'4.7.2', lastSeen: mins(3),   status:'online',  department:'Finance', owner:'fin_admin',      tags:['sensitive','pci-scope'] },
  { id:'ast-005', hostname:'wks-055',       ip:'10.0.6.77',   os:'Windows', type:'workstation', riskScore:96, agentVersion:'4.6.8', lastSeen: mins(8),   status:'warning', department:'Finance', owner:'financeuser1',   tags:['ransomware-suspect'] },
  { id:'ast-006', hostname:'linux-srv-01',  ip:'10.0.3.30',   os:'Linux',   type:'server',      riskScore:64, agentVersion:'4.7.2', lastSeen: mins(1),   status:'online',  department:'DevOps',  owner:'devops_team',    tags:['production'] },
  { id:'ast-007', hostname:'vpn-gw-01',     ip:'10.0.0.10',   os:'Network OS', type:'network',  riskScore:45, agentVersion:'N/A',  lastSeen: mins(1),   status:'online',  department:'Network', owner:'net_admin',      tags:['gateway','perimeter'] },
  { id:'ast-008', hostname:'wks-018',       ip:'10.0.4.18',   os:'Windows', type:'workstation', riskScore:35, agentVersion:'4.7.2', lastSeen: mins(20),  status:'online',  department:'HR',      owner:'bwilson',        tags:[] },
  { id:'ast-009', hostname:'api-gw-01',     ip:'10.0.1.30',   os:'Linux',   type:'server',      riskScore:78, agentVersion:'4.7.2', lastSeen: mins(1),   status:'online',  department:'DevOps',  owner:'api_team',       tags:['dmz','public-facing'] },
  { id:'ast-010', hostname:'conn-srv-01',   ip:'10.0.1.40',   os:'Windows', type:'server',      riskScore:93, agentVersion:'4.5.1', lastSeen: mins(12),  status:'warning', department:'IT',      owner:'helpdesk',       tags:['remote-access','compromised'] },
  { id:'ast-011', hostname:'file-srv-01',   ip:'10.0.1.50',   os:'Windows', type:'server',      riskScore:82, agentVersion:'4.7.2', lastSeen: mins(3),   status:'online',  department:'IT',      owner:'sysadmin',       tags:['file-share','sensitive'] },
  { id:'ast-012', hostname:'srv-hr-01',     ip:'10.0.3.100',  os:'Linux',   type:'server',      riskScore:55, agentVersion:'4.7.2', lastSeen: mins(5),   status:'online',  department:'HR',      owner:'hr_admin',       tags:['sensitive','pii'] },
  { id:'ast-013', hostname:'wks-001',       ip:'10.0.4.1',    os:'macOS',   type:'workstation', riskScore:88, agentVersion:'4.7.2', lastSeen: mins(10),  status:'online',  department:'Executive', owner:'ceo_user',     tags:['vip','high-value'] },
  { id:'ast-014', hostname:'ssh-gw-01',     ip:'10.0.0.22',   os:'Linux',   type:'server',      riskScore:61, agentVersion:'4.7.2', lastSeen: mins(2),   status:'online',  department:'IT',      owner:'net_admin',      tags:['gateway','perimeter'] },
  { id:'ast-015', hostname:'ftp-01',        ip:'10.0.1.60',   os:'Linux',   type:'server',      riskScore:42, agentVersion:'4.7.0', lastSeen: mins(45),  status:'offline', department:'IT',      owner:'sysadmin',       tags:['legacy'] },
  { id:'ast-016', hostname:'wks-033',       ip:'10.0.4.33',   os:'Windows', type:'workstation', riskScore:58, agentVersion:'4.7.2', lastSeen: mins(15),  status:'online',  department:'Legal',   owner:'r.smith',        tags:['policy-violation'] },
  { id:'ast-017', hostname:'wks-099',       ip:'10.0.4.99',   os:'Windows', type:'workstation', riskScore:29, agentVersion:'4.7.2', lastSeen: mins(60),  status:'online',  department:'Sales',   owner:'p.parker',       tags:[] },
  { id:'ast-018', hostname:'mail-srv-01',   ip:'10.0.2.10',   os:'Linux',   type:'server',      riskScore:70, agentVersion:'4.7.2', lastSeen: mins(1),   status:'online',  department:'IT',      owner:'mail_admin',     tags:['public-facing','mx'] },
];

// ─── THREAT INTEL ───────────────────────────────────────────────────────────
export type IOCType = 'ip' | 'domain' | 'md5' | 'sha256' | 'url' | 'email';
export type ThreatCategory = 'malware' | 'phishing' | 'c2' | 'ransomware' | 'botnet' | 'apt' | 'exploit';

export interface ThreatIntel {
  id: string;
  ioc: string;
  type: IOCType;
  category: ThreatCategory;
  confidence: number;
  active: boolean;
  firstSeen: string;
  lastSeen: string;
  description: string;
  tags: string[];
  source: string;
}

export const threatIntel: ThreatIntel[] = [
  { id:'ioc-001', ioc:'91.109.190.14',    type:'ip',     category:'c2',         confidence:98, active:true,  firstSeen:'2024-11-15', lastSeen:'2024-12-20', description:'Cobalt Strike C2 server used in APT29 campaigns', tags:['apt29','cobalt-strike'], source:'AlienVault OTX' },
  { id:'ioc-002', ioc:'185.220.101.45',   type:'ip',     category:'exploit',    confidence:95, active:true,  firstSeen:'2024-10-01', lastSeen:'2024-12-19', description:'Known Tor exit node used in SQL injection campaigns', tags:['tor','scanning'], source:'AbuseIPDB' },
  { id:'ioc-003', ioc:'45.142.212.100',   type:'ip',     category:'c2',         confidence:92, active:true,  firstSeen:'2024-12-01', lastSeen:'2024-12-20', description:'Metasploit handler / Meterpreter C2 infrastructure', tags:['metasploit','meterpreter'], source:'Mandiant' },
  { id:'ioc-004', ioc:'cobaltbeacon.darkhotel.ru', type:'domain', category:'apt', confidence:99, active:true, firstSeen:'2024-09-01', lastSeen:'2024-12-18', description:'DarkHotel APT group C2 domain for Cobalt Strike', tags:['darkhotel','apt','nation-state'], source:'CISA Advisory' },
  { id:'ioc-005', ioc:'a1b2c3d4e5f67890abcd1234ef567890', type:'md5', category:'malware', confidence:100, active:true, firstSeen:'2024-11-20', lastSeen:'2024-12-15', description:'Mimikatz credential dumping tool — weaponized variant', tags:['mimikatz','credential-dumping'], source:'VirusTotal' },
  { id:'ioc-006', ioc:'3f9a8b2c1d4e5f607a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f', type:'sha256', category:'ransomware', confidence:100, active:true, firstSeen:'2024-12-10', lastSeen:'2024-12-20', description:'LockBit 3.0 ransomware binary — .lockbit extension', tags:['lockbit','ransomware'], source:'CISA' },
  { id:'ioc-007', ioc:'corp-finance-request.net', type:'domain', category:'phishing', confidence:97, active:true, firstSeen:'2024-12-18', lastSeen:'2024-12-20', description:'Lookalike domain used in whaling attack against CFO', tags:['whaling','bec'], source:'Internal Intel' },
  { id:'ioc-008', ioc:'https://malicious-cdn.xyz/payload.ps1', type:'url', category:'malware', confidence:95, active:true, firstSeen:'2024-12-05', lastSeen:'2024-12-19', description:'PowerShell dropper hosting URL — serves stage 2 payload', tags:['powershell','dropper'], source:'URLhaus' },
  { id:'ioc-009', ioc:'tunnel.ext-c2.xyz',  type:'domain', category:'c2',      confidence:90, active:true,  firstSeen:'2024-11-28', lastSeen:'2024-12-20', description:'DNS tunneling C2 domain using Iodine protocol', tags:['dns-tunnel','c2'], source:'Cisco Talos' },
  { id:'ioc-010', ioc:'194.165.16.66',      type:'ip',     category:'botnet',   confidence:88, active:true,  firstSeen:'2024-10-15', lastSeen:'2024-12-19', description:'Botnet C2 used in M365 password spraying campaigns', tags:['botnet','spray'], source:'Microsoft MSTIC' },
  { id:'ioc-011', ioc:'91.240.118.172',     type:'ip',     category:'exploit',  confidence:96, active:true,  firstSeen:'2024-04-01', lastSeen:'2024-12-15', description:'XZ backdoor exploit origin — CVE-2024-3094', tags:['xz-backdoor','supply-chain'], source:'CISA' },
  { id:'ioc-012', ioc:'phishing@tax-refund-2024.com', type:'email', category:'phishing', confidence:92, active:false, firstSeen:'2024-09-01', lastSeen:'2024-11-30', description:'IRS impersonation phishing campaign sender', tags:['irs','tax-phishing'], source:'PhishTank' },
  { id:'ioc-013', ioc:'185.191.127.26',     type:'ip',     category:'exploit',  confidence:94, active:true,  firstSeen:'2024-07-01', lastSeen:'2024-12-18', description:'Active scanner for CVE-2024-6387 regreSSHion vulnerability', tags:['ssh','cve-2024-6387'], source:'Shodan' },
  { id:'ioc-014', ioc:'b5e3f1a29c4d67890e1f2a3b4c5d6e7f', type:'md5', category:'malware', confidence:99, active:false, firstSeen:'2024-08-15', lastSeen:'2024-11-01', description:'Emotet dropper hash — Epoch 5 variant', tags:['emotet','dropper'], source:'VirusTotal' },
  { id:'ioc-015', ioc:'https://update.microsoft-patch.ru/kb5031274', type:'url', category:'apt', confidence:98, active:false, firstSeen:'2024-06-01', lastSeen:'2024-10-15', description:'APT29 fake Microsoft update URL delivering WellMess', tags:['apt29','wellmess','russia'], source:'UK NCSC' },
];

// ─── FIM EVENTS ─────────────────────────────────────────────────────────────
export type FIMAction = 'modified' | 'created' | 'deleted' | 'permission_changed' | 'owner_changed';

export interface FIMEvent {
  id: string;
  timestamp: string;
  path: string;
  action: FIMAction;
  severity: Severity;
  host: string;
  user: string;
  oldHash?: string;
  newHash?: string;
  oldPermissions?: string;
  newPermissions?: string;
  acknowledged: boolean;
  whitelisted: boolean;
}

export const fimEvents: FIMEvent[] = [
  { id:'fim-001', timestamp: mins(5),   path:'/etc/passwd',              action:'modified',          severity:'critical', host:'linux-srv-01', user:'root',       oldHash:'d41d8cd98f00b204', newHash:'a87ff679a2f3e71d', acknowledged:false, whitelisted:false },
  { id:'fim-002', timestamp: mins(8),   path:'/etc/sudoers',             action:'modified',          severity:'critical', host:'linux-srv-01', user:'www-data',   oldHash:'e10adc3949ba59ab', newHash:'21232f297a57a5a7', acknowledged:false, whitelisted:false },
  { id:'fim-003', timestamp: mins(12),  path:'C:\\Windows\\System32\\lsass.exe', action:'modified',  severity:'critical', host:'wks-042',      user:'SYSTEM',     oldHash:'5f4dcc3b5aa765d6', newHash:'7c4a8d09ca3762af', acknowledged:false, whitelisted:false },
  { id:'fim-004', timestamp: mins(20),  path:'/etc/ssh/sshd_config',     action:'modified',          severity:'high',     host:'ssh-gw-01',    user:'svc_deploy', oldHash:'6512bd43d9caa6e0', newHash:'c20ad4d76fe97759', acknowledged:false, whitelisted:false },
  { id:'fim-005', timestamp: mins(35),  path:'C:\\Windows\\System32\\drivers\\etc\\hosts', action:'modified', severity:'high', host:'wks-055', user:'financeuser1', oldHash:'1679091c5a880faf', newHash:'8f14e45fceea167a', acknowledged:false, whitelisted:false },
  { id:'fim-006', timestamp: mins(50),  path:'/etc/cron.d/cleanup',      action:'created',           severity:'high',     host:'web-srv-01',   user:'www-data',   newHash:'45c48cce2e2d7fbd', acknowledged:false, whitelisted:false },
  { id:'fim-007', timestamp: mins(60),  path:'/tmp/.hidden_payload',     action:'created',           severity:'critical', host:'api-gw-01',    user:'nobody',     newHash:'98f13708210194c4', acknowledged:false, whitelisted:false },
  { id:'fim-008', timestamp: mins(90),  path:'/etc/ld.so.preload',       action:'created',           severity:'critical', host:'linux-srv-01', user:'root',       newHash:'c51ce410c124a10e', acknowledged:true,  whitelisted:false },
  { id:'fim-009', timestamp: mins(120), path:'/var/log/auth.log',        action:'deleted',           severity:'high',     host:'ssh-gw-01',    user:'root',       oldHash:'2838023a778dfaecdc212708f721b788', acknowledged:true, whitelisted:false },
  { id:'fim-010', timestamp: mins(180), path:'/etc/security/limits.conf', action:'permission_changed', severity:'medium', host:'linux-srv-01', user:'devops_svc', oldPermissions:'-rw-r--r--', newPermissions:'-rwxrwxrwx', acknowledged:true, whitelisted:false },
];

// ─── MITRE ATT&CK ──────────────────────────────────────────────────────────
export interface MitreTactic {
  id: string;
  name: string;
  techniques: MitreTechnique[];
}

export interface MitreTechnique {
  id: string;
  name: string;
  hits: number;
}

export const mitreTactics: MitreTactic[] = [
  { id:'TA0001', name:'Initial Access',        techniques:[{ id:'T1190', name:'Exploit Public-Facing App', hits:8 },{ id:'T1566.001', name:'Spearphishing Attachment', hits:3 },{ id:'T1566.002', name:'Spearphishing Link', hits:5 },{ id:'T1078', name:'Valid Accounts', hits:4 }] },
  { id:'TA0002', name:'Execution',             techniques:[{ id:'T1059.001', name:'PowerShell', hits:6 },{ id:'T1059.003', name:'Windows Cmd Shell', hits:4 },{ id:'T1047', name:'WMI', hits:3 },{ id:'T1053', name:'Scheduled Task', hits:2 }] },
  { id:'TA0003', name:'Persistence',           techniques:[{ id:'T1053.005', name:'Scheduled Task/Job', hits:2 },{ id:'T1543.003', name:'Windows Service', hits:1 },{ id:'T1574', name:'Hijack Execution Flow', hits:2 }] },
  { id:'TA0004', name:'Privilege Escalation',  techniques:[{ id:'T1548', name:'Abuse Elevation Control', hits:4 },{ id:'T1134', name:'Access Token Manipulation', hits:3 },{ id:'T1068', name:'Exploitation for Privilege Escalation', hits:2 }] },
  { id:'TA0005', name:'Defense Evasion',       techniques:[{ id:'T1027', name:'Obfuscated Files', hits:5 },{ id:'T1562.001', name:'Disable Security Tools', hits:3 },{ id:'T1070', name:'Indicator Removal', hits:4 }] },
  { id:'TA0006', name:'Credential Access',     techniques:[{ id:'T1003', name:'OS Credential Dumping', hits:7 },{ id:'T1110.003', name:'Password Spraying', hits:5 },{ id:'T1558.003', name:'Kerberoasting', hits:3 },{ id:'T1552', name:'Unsecured Credentials', hits:2 }] },
  { id:'TA0007', name:'Discovery',             techniques:[{ id:'T1046', name:'Network Service Scan', hits:6 },{ id:'T1083', name:'File & Directory Discovery', hits:3 },{ id:'T1087', name:'Account Discovery', hits:4 }] },
  { id:'TA0008', name:'Lateral Movement',      techniques:[{ id:'T1550.002', name:'Pass the Hash', hits:4 },{ id:'T1021.002', name:'SMB/Windows Admin Shares', hits:3 },{ id:'T1047', name:'WMI Remote Execution', hits:2 }] },
  { id:'TA0009', name:'Collection',            techniques:[{ id:'T1074', name:'Data Staged', hits:4 },{ id:'T1056.001', name:'Keylogging', hits:1 },{ id:'T1113', name:'Screen Capture', hits:2 }] },
  { id:'TA0010', name:'Exfiltration',          techniques:[{ id:'T1048', name:'Exfil Over Alternative Protocol', hits:4 },{ id:'T1567.001', name:'Exfil to Code Repo', hits:2 },{ id:'T1030', name:'Data Transfer Size Limits', hits:3 }] },
  { id:'TA0011', name:'Command & Control',     techniques:[{ id:'T1071.001', name:'Web Protocols', hits:9 },{ id:'T1071.004', name:'DNS', hits:5 },{ id:'T1095', name:'Non-App Layer Protocol', hits:3 },{ id:'T1102', name:'Web Service', hits:2 }] },
  { id:'TA0040', name:'Impact',                techniques:[{ id:'T1486', name:'Data Encrypted for Impact', hits:6 },{ id:'T1490', name:'Inhibit System Recovery', hits:3 },{ id:'T1485', name:'Data Destruction', hits:1 }] },
];

// ─── VULNERABILITIES ────────────────────────────────────────────────────────
export type VulnStatus = 'open' | 'patched' | 'mitigated' | 'accepted' | 'in_progress';

export interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  cvss: number;
  severity: Severity;
  status: VulnStatus;
  affectedAssets: string[];
  exploitAvailable: boolean;
  exploitedInWild: boolean;
  publishedDate: string;
  patchAvailable: boolean;
  description: string;
  remediation: string;
  affectedSoftware: string;
}

export const vulnerabilities: Vulnerability[] = [
  { id:'vuln-001', cve:'CVE-2024-3094',  title:'XZ Utils Backdoor',                        cvss:10.0, severity:'critical', status:'patched',     affectedAssets:['linux-srv-01','web-srv-01'], exploitAvailable:true,  exploitedInWild:true,  publishedDate:'2024-03-29', patchAvailable:true,  description:'Supply chain backdoor in XZ Utils 5.6.0/5.6.1 allowing unauthenticated RCE via SSH.', remediation:'Downgrade xz-utils to 5.4.x. Update to patched version.', affectedSoftware:'XZ Utils 5.6.0, 5.6.1' },
  { id:'vuln-002', cve:'CVE-2024-6387',  title:'regreSSHion OpenSSH RCE',                  cvss:8.1,  severity:'high',     status:'in_progress', affectedAssets:['ssh-gw-01','linux-srv-01','api-gw-01'], exploitAvailable:true, exploitedInWild:true, publishedDate:'2024-07-01', patchAvailable:true, description:'Race condition in OpenSSH sshd allows unauthenticated RCE as root on glibc-based Linux.', remediation:'Upgrade OpenSSH to 9.8p1. Set LoginGraceTime=0 as temporary mitigation.', affectedSoftware:'OpenSSH < 9.8p1' },
  { id:'vuln-003', cve:'CVE-2024-1709',  title:'ScreenConnect Authentication Bypass',       cvss:10.0, severity:'critical', status:'open',        affectedAssets:['conn-srv-01'], exploitAvailable:true, exploitedInWild:true, publishedDate:'2024-02-21', patchAvailable:true, description:'Path traversal allows unauthenticated user to create new admin account in ScreenConnect.', remediation:'Upgrade to ScreenConnect 23.9.8 immediately. Isolate host.', affectedSoftware:'ScreenConnect < 23.9.8' },
  { id:'vuln-004', cve:'CVE-2023-20198', title:'Cisco IOS XE Web UI Privilege Escalation', cvss:10.0, severity:'critical', status:'mitigated',   affectedAssets:['vpn-gw-01'], exploitAvailable:true, exploitedInWild:true, publishedDate:'2023-10-16', patchAvailable:true, description:'Zero-day in Cisco IOS XE web UI allows unauthenticated remote attackers to create privileged accounts.', remediation:'Disable HTTP/HTTPS server feature. Apply Cisco patch immediately.', affectedSoftware:'Cisco IOS XE Web UI' },
  { id:'vuln-005', cve:'CVE-2024-21762', title:'Fortinet FortiOS Out-of-Bound Write',       cvss:9.8,  severity:'critical', status:'open',        affectedAssets:['vpn-gw-01'], exploitAvailable:true, exploitedInWild:true, publishedDate:'2024-02-08', patchAvailable:true, description:'Out-of-bound write vulnerability in FortiOS SSL VPN allows unauthenticated RCE.', remediation:'Upgrade FortiOS to 7.4.3+. Disable SSL VPN as workaround.', affectedSoftware:'FortiOS 7.4, 7.2, 7.0, 6.4' },
  { id:'vuln-006', cve:'CVE-2024-20353', title:'Cisco ASA/FTD Denial of Service',          cvss:8.6,  severity:'high',     status:'in_progress', affectedAssets:['vpn-gw-01'], exploitAvailable:false, exploitedInWild:true, publishedDate:'2024-04-24', patchAvailable:true, description:'Incomplete error checking in HTTPS requests enables remote DoS against ASA and FTD devices.', remediation:'Apply Cisco Security Advisory patches. Monitor for Akira ransomware IOCs.', affectedSoftware:'Cisco ASA, Cisco FTD' },
  { id:'vuln-007', cve:'CVE-2024-22024', title:'Ivanti ZTNA Auth Bypass',                  cvss:8.3,  severity:'high',     status:'open',        affectedAssets:['vpn-gw-01'], exploitAvailable:true, exploitedInWild:true, publishedDate:'2024-02-09', patchAvailable:true, description:'XML external entity vulnerability in Ivanti Connect Secure allows auth bypass without credentials.', remediation:'Apply Ivanti patches. Run Ivanti ICT scanner to check for compromise.', affectedSoftware:'Ivanti Connect Secure < 22.6R2.2' },
  { id:'vuln-008', cve:'CVE-2024-4040',  title:'CrushFTP Virtual Filesystem Escape',       cvss:9.8,  severity:'critical', status:'accepted',    affectedAssets:['ftp-01'], exploitAvailable:true, exploitedInWild:true, publishedDate:'2024-04-19', patchAvailable:true, description:'Server-side template injection in CrushFTP VFS allows unauthenticated file read and RCE.', remediation:'Upgrade to CrushFTP 10.7.1+. Risk accepted for legacy FTP server (EOL).', affectedSoftware:'CrushFTP < 10.7.1' },
  { id:'vuln-009', cve:'CVE-2024-23897', title:'Jenkins Arbitrary File Read',               cvss:9.8,  severity:'critical', status:'patched',     affectedAssets:['linux-srv-01'], exploitAvailable:true, exploitedInWild:true, publishedDate:'2024-01-24', patchAvailable:true, description:'CLI arg parsing flaw allows unauthenticated attackers to read arbitrary files from Jenkins server.', remediation:'Upgrade Jenkins to 2.442+. Disable CLI access if not needed.', affectedSoftware:'Jenkins < 2.442' },
  { id:'vuln-010', cve:'CVE-2024-27198', title:'JetBrains TeamCity Auth Bypass',           cvss:9.8,  severity:'critical', status:'patched',     affectedAssets:['linux-srv-01'], exploitAvailable:true, exploitedInWild:true, publishedDate:'2024-03-04', patchAvailable:true, description:'Authentication bypass in TeamCity web server allows unauthenticated admin account creation.', remediation:'Upgrade to TeamCity 2023.11.4. Apply immediately — actively exploited by APT29.', affectedSoftware:'TeamCity < 2023.11.4' },
];

// ─── COMPLIANCE ─────────────────────────────────────────────────────────────
export type ComplianceStatus = 'pass' | 'fail' | 'warning';

export interface ComplianceCheck {
  id: string;
  framework: string;
  controlId: string;
  title: string;
  description: string;
  status: ComplianceStatus;
  severity: Severity;
  lastChecked: string;
  affectedAssets: number;
  remediation: string;
}

export const complianceChecks: ComplianceCheck[] = [
  { id:'cc-001', framework:'PCI-DSS', controlId:'PCI-1.1', title:'Firewall Configuration Standards', description:'Firewall and router configuration standards must be established and implemented.', status:'pass', severity:'high', lastChecked: mins(60), affectedAssets:3, remediation:'N/A' },
  { id:'cc-002', framework:'PCI-DSS', controlId:'PCI-6.3', title:'Security Vulnerabilities Addressed', description:'Critical security vulnerabilities must be patched within one month.', status:'fail', severity:'critical', lastChecked: mins(120), affectedAssets:5, remediation:'Remediate CVE-2024-1709, CVE-2024-21762, CVE-2024-22024 immediately.' },
  { id:'cc-003', framework:'PCI-DSS', controlId:'PCI-10.2', title:'Audit Log Implementation', description:'Automated audit logs must be implemented for all system components.', status:'warning', severity:'medium', lastChecked: mins(60), affectedAssets:2, remediation:'Enable audit logging on ftp-01 and conn-srv-01.' },
  { id:'cc-004', framework:'CIS',     controlId:'CIS-4.1',  title:'Secure Configuration Inventory', description:'Maintain documented, standard security configurations for all authorized OS.', status:'pass', severity:'medium', lastChecked: mins(180), affectedAssets:18, remediation:'N/A' },
  { id:'cc-005', framework:'CIS',     controlId:'CIS-7.2',  title:'Disable Unneeded Services', description:'Unnecessary services, protocols, daemons, and functions must be disabled.', status:'fail', severity:'high', lastChecked: mins(120), affectedAssets:4, remediation:'Disable legacy FTP on ftp-01. Disable HTTP on vpn-gw-01.' },
  { id:'cc-006', framework:'CIS',     controlId:'CIS-13.1', title:'Data Protection', description:'Maintain an inventory of sensitive data and implement data protection controls.', status:'warning', severity:'high', lastChecked: mins(240), affectedAssets:6, remediation:'Complete DLP policy coverage for cloud storage uploads.' },
  { id:'cc-007', framework:'HIPAA',   controlId:'HIP-164.312a', title:'Access Control', description:'Implement technical policies limiting access to ePHI to authorized users.', status:'pass', severity:'critical', lastChecked: mins(60), affectedAssets:12, remediation:'N/A' },
  { id:'cc-008', framework:'HIPAA',   controlId:'HIP-164.312b', title:'Audit Controls', description:'Implement hardware/software activity recording in systems with ePHI.', status:'warning', severity:'high', lastChecked: mins(180), affectedAssets:3, remediation:'Enable audit controls on srv-hr-01 HIPAA-scope systems.' },
  { id:'cc-009', framework:'NIST',    controlId:'NIST-AC-2', title:'Account Management', description:'Manage information system accounts including establishing, activating, modifying, reviewing, disabling, and removing accounts.', status:'fail', severity:'high', lastChecked: mins(120), affectedAssets:8, remediation:'Remove/disable 12 stale service accounts inactive >90 days.' },
  { id:'cc-010', framework:'NIST',    controlId:'NIST-SI-2', title:'Flaw Remediation', description:'Identify, report, and correct information system flaws; test software updates.', status:'fail', severity:'critical', lastChecked: mins(60), affectedAssets:10, remediation:'Patch 4 critical CVEs within SLA. Update patch management process.' },
  { id:'cc-011', framework:'NIST',    controlId:'NIST-IR-4', title:'Incident Handling', description:'Implement incident handling capability for security incidents including preparation, detection, containment.', status:'pass', severity:'high', lastChecked: mins(240), affectedAssets:0, remediation:'N/A' },
  { id:'cc-012', framework:'SOC2',    controlId:'SOC-CC6.1', title:'Logical & Physical Access Controls', description:'Implement logical access security measures to protect against threats from sources outside the system boundaries.', status:'pass', severity:'high', lastChecked: mins(60), affectedAssets:18, remediation:'N/A' },
  { id:'cc-013', framework:'SOC2',    controlId:'SOC-CC7.2', title:'System Monitoring', description:'Implement detection and monitoring procedures to identify, assess, and report change and anomalies.', status:'pass', severity:'medium', lastChecked: mins(30), affectedAssets:18, remediation:'N/A' },
  { id:'cc-014', framework:'SOC2',    controlId:'SOC-CC9.1', title:'Risk Mitigation', description:'Identify, select, and develop risk mitigation activities for risks arising from potential business disruptions.', status:'warning', severity:'medium', lastChecked: mins(480), affectedAssets:5, remediation:'Update BCP/DR plan to include ransomware recovery procedures.' },
  { id:'cc-015', framework:'ISO27001', controlId:'ISO-A.12.4', title:'Logging and Monitoring', description:'Event logs recording user activities, exceptions, faults and information security events must be produced, kept, and regularly reviewed.', status:'pass', severity:'high', lastChecked: mins(60), affectedAssets:18, remediation:'N/A' },
  { id:'cc-016', framework:'ISO27001', controlId:'ISO-A.14.2', title:'Security in Dev & Support', description:'Security must be designed and implemented within the development lifecycle of information systems.', status:'warning', severity:'medium', lastChecked: mins(720), affectedAssets:6, remediation:'Implement SAST/DAST scanning in CI/CD pipeline.' },
  { id:'cc-017', framework:'ISO27001', controlId:'ISO-A.6.1',  title:'Information Security Roles', description:'All information security responsibilities must be defined and allocated.', status:'pass', severity:'low', lastChecked: mins(1440), affectedAssets:0, remediation:'N/A' },
  { id:'cc-018', framework:'PCI-DSS', controlId:'PCI-8.2', title:'User Authentication Management', description:'Proper identification and authentication must be managed for all system component users.', status:'fail', severity:'critical', lastChecked: mins(60), affectedAssets:7, remediation:'Enforce MFA on all privileged accounts. Disable shared accounts.' },
  { id:'cc-019', framework:'NIST',    controlId:'NIST-SC-28', title:'Protection of Data at Rest', description:'Implement cryptographic mechanisms to prevent unauthorized disclosure of information at rest.', status:'pass', severity:'high', lastChecked: mins(240), affectedAssets:10, remediation:'N/A' },
];

// ─── UBA EVENTS ─────────────────────────────────────────────────────────────
export type UBAType = 'impossible_travel' | 'unusual_login_time' | 'excessive_data_access' | 'privilege_escalation' | 'lateral_movement' | 'after_hours' | 'data_staging';
export type UBAStatus = 'open' | 'investigating' | 'resolved' | 'false_positive';

export interface UBAEvent {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  department: string;
  type: UBAType;
  riskScore: number;
  severity: Severity;
  status: UBAStatus;
  description: string;
  details: string;
  sourceIp?: string;
  location?: string;
  previousLocation?: string;
  timeBetween?: string;
}

export const ubaEvents: UBAEvent[] = [
  { id:'uba-001', timestamp: mins(10), user:'John Smith',        userId:'jsmith',         department:'Finance',   type:'impossible_travel',    riskScore:98, severity:'critical', status:'investigating', description:'Impossible travel: New York → Moscow in 45 minutes', details:'User authenticated from 10.0.5.42 (New York) at 09:15, then from 91.109.190.14 (Moscow) at 10:00. Physical travel impossible.', sourceIp:'91.109.190.14', location:'Moscow, Russia', previousLocation:'New York, USA', timeBetween:'45 min' },
  { id:'uba-002', timestamp: mins(15), user:'Finance User 1',    userId:'financeuser1',   department:'Finance',   type:'data_staging',         riskScore:95, severity:'critical', status:'investigating', description:'Mass file access before potential exfiltration event', details:'User accessed 2,847 files in 8 minutes across Finance share — 300x normal rate. Followed by outbound transfer alert.', sourceIp:'10.0.6.77', location:'Office - New York' },
  { id:'uba-003', timestamp: mins(25), user:'Service Account',   userId:'svc_backup',     department:'IT',        type:'lateral_movement',     riskScore:92, severity:'critical', status:'open', description:'Service account performing human-like lateral movement', details:'Backup service account accessed 12 systems outside backup window. SMB connections pattern matches human navigation, not automated backup.', sourceIp:'10.0.5.42', location:'Internal Network' },
  { id:'uba-004', timestamp: mins(40), user:'Dev Contractor',    userId:'dev_contractor', department:'Engineering', type:'after_hours',          riskScore:78, severity:'high', status:'open', description:'Contractor accessing sensitive repos at 2:47 AM local time', details:'User authenticated at 02:47 AM Saturday. Downloaded 500MB from internal code repository. Contractor contract allows 9-5 M-F only.', sourceIp:'10.0.3.77', location:'Remote - Unknown ISP' },
  { id:'uba-005', timestamp: mins(55), user:'IIS Service',       userId:'svc_iis',        department:'IT',        type:'privilege_escalation', riskScore:90, severity:'critical', status:'investigating', description:'IIS service account attempting domain admin privilege escalation', details:'svc_iis requested SeImpersonatePrivilege and attempted token manipulation. Normally restricted to web service operations only.', sourceIp:'10.0.5.88' },
  { id:'uba-006', timestamp: mins(70), user:'Robert Walker',     userId:'rwalker',        department:'Legal',     type:'unusual_login_time',   riskScore:55, severity:'medium', status:'open', description:'Login at 11:45 PM from unknown location — never before seen', details:'User has never logged in outside 8 AM - 7 PM window in 18 months. VPN auth from new geographic location (Eastern Europe).', sourceIp:'88.214.33.110', location:'Bucharest, Romania' },
  { id:'uba-007', timestamp: mins(85), user:'Billing Service',   userId:'billing_svc',    department:'Finance',   type:'excessive_data_access', riskScore:67, severity:'high', status:'open', description:'Service account accessing PII records 50x above baseline', details:'billing_svc queried 45,000 customer records in 3 hours vs typical 800/day. Pattern matches data harvesting for exfiltration.', sourceIp:'10.0.4.77' },
  { id:'uba-008', timestamp: mins(100), user:'Admin User',       userId:'domain_admin',   department:'IT',        type:'lateral_movement',     riskScore:82, severity:'high', status:'resolved', description:'Domain admin account used for widespread WMI remote execution', details:'domain_admin executed commands on 47 endpoints via WMI in 12 minutes. Not part of any scheduled maintenance window. Account may be compromised.', sourceIp:'10.0.0.50' },
];

// ─── SEVERITY COLORS & UTILS ────────────────────────────────────────────────
export const severityConfig = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'CRITICAL' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'HIGH' },
  medium:   { color: '#eab308', bg: 'rgba(234,179,8,0.15)', label: 'MEDIUM' },
  low:      { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'LOW' },
  info:     { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', label: 'INFO' },
};

export const statusColors: Record<AlertStatus, string> = {
  open:          '#ef4444',
  acknowledged:  '#f97316',
  investigating: '#eab308',
  resolved:      '#10b981',
  closed:        '#6b7280',
};

export const getSeverityDistribution = () => {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  securityEvents.forEach(e => counts[e.severity]++);
  return [
    { name: 'Critical', value: counts.critical, fill: '#ef4444' },
    { name: 'High',     value: counts.high,     fill: '#f97316' },
    { name: 'Medium',   value: counts.medium,   fill: '#eab308' },
    { name: 'Low',      value: counts.low,      fill: '#10b981' },
    { name: 'Info',     value: counts.info,     fill: '#38bdf8' },
  ];
};
