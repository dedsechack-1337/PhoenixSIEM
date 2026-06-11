import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Shield, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    if (ok) {
      navigate('/', { replace: true });
    } else {
      setError('Invalid credentials. Check username and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-void)' }}>

      {/* HDR background layers */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(30,63,102,0.5) 1px, transparent 1px)',
        backgroundSize: '28px 28px'
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,107,26,0.06) 0%, transparent 60%)'
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 50% at 50% 100%, rgba(0,180,255,0.03) 0%, transparent 60%)'
      }} />
      {/* Corner accent glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(255,107,26,0.4), transparent)' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo block */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-5">
            <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: 'rgba(255,107,26,0.25)' }} />
            <div className="absolute inset-0 rounded-full blur-md animate-glow" style={{ background: 'rgba(255,107,26,0.15)' }} />
            <img src="phoenix-logo.png" alt="PhoenixSIEM" className="relative w-24 h-24 object-contain"
              style={{ filter: 'drop-shadow(0 0 12px rgba(255,107,26,0.8)) drop-shadow(0 0 32px rgba(255,107,26,0.4)) drop-shadow(0 0 48px rgba(255,107,26,0.15))' }} />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f0f6ff' }}>PhoenixSIEM</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide"
              style={{ background: 'rgba(255,107,26,0.15)', border: '1px solid rgba(255,107,26,0.4)',
                color: '#ff8c3a', boxShadow: '0 0 10px rgba(255,107,26,0.25)' }}>
              <Zap className="w-3 h-3" />AI
            </span>
          </div>
          <p className="text-xs font-mono" style={{ color: '#3d5a7a' }}>Enterprise Security Operations Center</p>
        </div>

        {/* Login card */}
        <div className="login-panel p-8">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-px rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,26,0.4), transparent)' }} />

          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-4 h-4" style={{ color: '#ff8c3a' }} />
            <h2 className="text-sm font-semibold" style={{ color: '#f0f6ff' }}>Secure Authentication</h2>
            <span className="ml-auto text-[10px] font-mono" style={{ color: '#3d5a7a' }}>TLS 1.3 ENCRYPTED</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#3d5a7a' }}>Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#3d5a7a' }} />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="analyst1" required
                  className="input-3d w-full pl-10 pr-4 py-3 text-sm"
                  style={{ color: '#f0f6ff' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#3d5a7a' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#3d5a7a' }} />
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  className="input-3d w-full pl-10 pr-10 py-3 text-sm"
                  style={{ color: '#f0f6ff' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#3d5a7a' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f0f6ff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3d5a7a')}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                style={{ background: 'rgba(255,32,64,0.08)', border: '1px solid rgba(255,32,64,0.3)',
                  boxShadow: '0 0 16px rgba(255,32,64,0.1)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#ff2040', boxShadow: '0 0 6px rgba(255,32,64,0.8)' }} />
                <span className="text-xs" style={{ color: '#ff6080' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-hdr w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <><span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,140,58,0.3)', borderTopColor: '#ff8c3a' }} />Authenticating...</>
              ) : (
                <><Shield className="w-4 h-4" />Sign In to SOC</>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(30,63,102,0.4)' }}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: '#3d5a7a' }}>Demo Credentials</p>
            <div className="space-y-1.5">
              {[
                { user: 'analyst1',  pass: 'soc@1337',   role: 'SOC Analyst L2' },
                { user: 'admin',     pass: 'admin@1337', role: 'SOC Administrator' },
                { user: 'viewer',    pass: 'view@1337',  role: 'Read-Only Analyst' },
              ].map(c => (
                <button key={c.user} type="button"
                  onClick={() => { setUsername(c.user); setPassword(c.pass); setError(''); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left"
                  style={{ background: 'rgba(8,20,42,0.8)', border: '1px solid rgba(30,63,102,0.4)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,26,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,107,26,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,63,102,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(8,20,42,0.8)'; }}>
                  <div>
                    <span className="text-xs font-mono font-bold" style={{ color: '#ff8c3a' }}>{c.user}</span>
                    <span className="text-[10px] font-mono ml-2" style={{ color: '#3d5a7a' }}>/ {c.pass}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: '#3d5a7a' }}>{c.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] font-mono mt-6" style={{ color: '#3d5a7a' }}>
          PhoenixSIEM v4.8.1 — All access is logged and monitored
        </p>
      </div>
    </div>
  );
}
