import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Shield, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TechBackground } from '../components/ui/TechBackground';

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24, background: 'var(--bg-void)', position: 'relative', overflow: 'hidden',
  },
  grid: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle, rgba(30,63,102,0.45) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
  },
  glow1: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,107,26,0.07) 0%, transparent 65%)',
  },
  glow2: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 50% 50% at 50% 100%, rgba(0,180,255,0.04) 0%, transparent 60%)',
  },
  wrap: { position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 },
  logoArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 },
  logoRing: { position: 'relative', width: 88, height: 88, marginBottom: 18 },
  logoGlow: { position: 'absolute', inset: -8, borderRadius: '50%', background: 'rgba(255,107,26,0.18)', filter: 'blur(16px)' },
  logoImg: { position: 'relative', width: 88, height: 88, objectFit: 'contain',
    filter: 'drop-shadow(0 0 10px rgba(255,107,26,0.75)) drop-shadow(0 0 28px rgba(255,107,26,0.35))' },
  titleRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  title: { fontSize: 28, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 },
  aiBadge: { display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 8px',
    borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
    background: 'rgba(255,107,26,0.14)', border: '1px solid rgba(255,107,26,0.4)',
    color: '#ff8c3a', boxShadow: '0 0 10px rgba(255,107,26,0.2)' },
  subtitle: { fontSize: 12.5, fontFamily: 'monospace', color: '#3d5a7a', margin: '8px 0 0', lineHeight: 1.4 },
  card: {
    background: 'linear-gradient(160deg, rgba(10,22,44,0.98) 0%, rgba(4,10,22,0.99) 100%)',
    border: '1px solid rgba(30,63,102,0.55)',
    borderRadius: 18,
    padding: 36,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(1,4,9,0.8), 0 24px 64px rgba(1,4,9,0.5)',
  },
  cardTopLine: {
    display: 'block', height: 1, marginBottom: 28, borderRadius: 99,
    background: 'linear-gradient(90deg, transparent, rgba(255,107,26,0.35), transparent)',
  },
  authRow: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28 },
  authTitle: { fontSize: 14.5, fontWeight: 600, color: '#f0f6ff', margin: 0, flex: 1, lineHeight: 1.3 },
  authBadge: { fontSize: 10, fontFamily: 'monospace', color: '#3d5a7a', lineHeight: 1.3 },
  fieldWrap: { marginBottom: 22 },
  label: { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', color: '#3d5a7a', marginBottom: 9, lineHeight: 1.4 },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
    width: 15, height: 15, color: '#3d5a7a', pointerEvents: 'none' as const },
  input: {
    width: '100%', boxSizing: 'border-box' as const,
    paddingLeft: 40, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
    fontSize: 14, color: '#f0f6ff', borderRadius: 10,
    background: 'linear-gradient(145deg, rgba(1,4,9,0.8), rgba(3,9,18,0.6))',
    border: '1px solid rgba(30,63,102,0.6)',
    boxShadow: 'inset 0 2px 4px rgba(1,4,9,0.5)',
    outline: 'none', fontFamily: 'inherit',
  },
  inputPr: { paddingRight: 40 },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#3d5a7a' },
  errorBox: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
    borderRadius: 8, marginBottom: 16,
    background: 'rgba(255,32,64,0.08)', border: '1px solid rgba(255,32,64,0.3)' },
  errorDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
    background: '#ff2040', boxShadow: '0 0 6px rgba(255,32,64,0.8)' },
  errorText: { fontSize: 12, color: '#ff6080', lineHeight: 1.4 },
  submitBtn: {
    width: '100%', padding: '14px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, marginTop: 4,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: 'linear-gradient(145deg, rgba(255,107,26,0.28), rgba(200,60,0,0.18))',
    border: '1px solid rgba(255,107,26,0.45)', color: '#ff8c3a',
    boxShadow: 'inset 0 1px 0 rgba(255,180,102,0.12), 0 2px 8px rgba(255,107,26,0.18)',
    transition: 'all 0.2s',
  },
  divider: { height: 1, background: 'rgba(30,63,102,0.4)', margin: '28px 0' },
  demoLabel: { fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' as const,
    letterSpacing: '0.12em', color: '#3d5a7a', marginBottom: 14, lineHeight: 1.4 },
  demoBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '11px 14px', borderRadius: 8, marginBottom: 9, cursor: 'pointer',
    background: 'rgba(8,20,42,0.7)', border: '1px solid rgba(30,63,102,0.4)',
    textAlign: 'left' as const, transition: 'all 0.15s',
  },
  demoUser: { fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: '#ff8c3a', lineHeight: 1.4 },
  demoPass: { fontSize: 11.5, fontFamily: 'monospace', color: '#3d5a7a', marginLeft: 8, lineHeight: 1.4 },
  demoRole: { fontSize: 11.5, color: '#3d5a7a', lineHeight: 1.4 },
  footer: { textAlign: 'center' as const, fontSize: 11.5, fontFamily: 'monospace', color: '#3d5a7a', marginTop: 28, lineHeight: 1.6 },
  spinner: { width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,140,58,0.25)', borderTopColor: '#ff8c3a', animation: 'spin 0.7s linear infinite' },
};

export function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) navigate('/', { replace: true });
    else setError('Invalid credentials. Check username and password.');
  };

  return (
    <div style={s.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <TechBackground />
      <div style={s.grid} />
      <div style={s.glow1} />
      <div style={s.glow2} />

      <div style={s.wrap}>
        {/* Logo */}
        <div style={s.logoArea}>
          <div style={s.logoRing}>
            <div style={s.logoGlow} />
            <img src="phoenix-logo.png" alt="PhoenixSIEM" style={s.logoImg} />
          </div>
          <div style={s.titleRow}>
            <h1 style={s.title}>PhoenixSIEM</h1>
            <span style={s.aiBadge}>
              <Zap size={10} />AI
            </span>
          </div>
          <p style={s.subtitle}>Enterprise Security Operations Center</p>
        </div>

        {/* Card */}
        <div style={s.card}>
          <span style={s.cardTopLine} />

          <div style={s.authRow}>
            <Shield size={15} color="#ff8c3a" />
            <p style={s.authTitle}>Secure Authentication</p>
            <span style={s.authBadge}>TLS 1.3</span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={s.fieldWrap}>
              <label style={s.label}>Username</label>
              <div style={s.inputWrap}>
                <User size={15} style={s.inputIcon} />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="analyst1" required style={s.input}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,107,26,0.5)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(1,4,9,0.5), 0 0 0 3px rgba(255,107,26,0.07)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(30,63,102,0.6)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(1,4,9,0.5)'; }} />
              </div>
            </div>

            {/* Password */}
            <div style={s.fieldWrap}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <Lock size={15} style={s.inputIcon} />
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  style={{ ...s.input, ...s.inputPr }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,107,26,0.5)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(1,4,9,0.5), 0 0 0 3px rgba(255,107,26,0.07)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(30,63,102,0.6)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(1,4,9,0.5)'; }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={s.errorBox}>
                <div style={s.errorDot} />
                <span style={s.errorText}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{ ...s.submitBtn, opacity: loading ? 0.6 : 1 }}>
              {loading
                ? <><div style={s.spinner} />Authenticating...</>
                : <><Shield size={14} />Sign In to SOC</>}
            </button>
          </form>

          {/* Divider */}
          <div style={s.divider} />

          {/* Demo credentials */}
          <p style={s.demoLabel}>Demo Credentials</p>
          {[
            { user: 'analyst1', pass: 'soc@1337',   role: 'SOC Analyst L2' },
            { user: 'admin',    pass: 'admin@1337', role: 'SOC Admin' },
            { user: 'viewer',   pass: 'view@1337',  role: 'Read-Only' },
          ].map(c => (
            <button key={c.user} type="button"
              onClick={() => { setUsername(c.user); setPassword(c.pass); setError(''); }}
              style={s.demoBtn}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,107,26,0.3)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,107,26,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(30,63,102,0.4)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,20,42,0.7)'; }}>
              <div>
                <span style={s.demoUser}>{c.user}</span>
                <span style={s.demoPass}>/ {c.pass}</span>
              </div>
              <span style={s.demoRole}>{c.role}</span>
            </button>
          ))}
        </div>

        <p style={s.footer}>PhoenixSIEM v4.8.1 — All access is logged and monitored</p>
      </div>
    </div>
  );
}
