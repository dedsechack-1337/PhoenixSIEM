import { useState } from 'react';
import { Zap, Eye, EyeOff, Shield, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (!ok) setError('Invalid credentials. Check username and password.');
  };

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#1a3050 1px, transparent 1px), linear-gradient(90deg, #1a3050 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-600 opacity-10 blur-xl" />
            <img
              src="phoenix-logo.png"
              alt="PhoenixSIEM"
              className="relative w-20 h-20 object-contain drop-shadow-[0_0_16px_rgba(249,115,22,0.7)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">PhoenixSIEM</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/20 border border-orange-500/40">
              <Zap className="w-3 h-3 text-orange-400" />
              <span className="text-[10px] font-semibold text-orange-400 tracking-wide">AI</span>
            </span>
          </div>
          <p className="text-sm text-[#475569] mt-1 font-mono">Enterprise Security Operations Center</p>
        </div>

        {/* Card */}
        <div className="bg-[#080f1e] border border-[#1a3050] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-semibold text-white">Secure Authentication</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs text-[#475569] mb-1.5 font-medium uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="analyst1"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#050d1a] border border-[#1a3050] rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-[#475569] mb-1.5 font-medium uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[#050d1a] border border-[#1a3050] rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500/80 to-red-600/80 hover:from-orange-500 hover:to-red-600 border border-orange-500/40 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign In to SOC
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-[#1a3050]">
            <p className="text-[10px] text-[#475569] uppercase tracking-wider mb-3 font-medium">Demo Credentials</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { user: 'analyst1', pass: 'soc@1337', role: 'SOC Analyst L2' },
                { user: 'admin', pass: 'admin@1337', role: 'SOC Administrator' },
                { user: 'viewer', pass: 'view@1337', role: 'Read-Only Analyst' },
              ].map((c) => (
                <button
                  key={c.user}
                  type="button"
                  onClick={() => { setUsername(c.user); setPassword(c.pass); setError(''); }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0d1f35] border border-[#1a3050] hover:border-orange-500/30 transition-colors text-left"
                >
                  <div>
                    <span className="text-xs font-mono text-orange-400">{c.user}</span>
                    <span className="text-[10px] text-[#475569] ml-2">/ {c.pass}</span>
                  </div>
                  <span className="text-[10px] text-[#475569]">{c.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-[#475569] mt-6">
          PhoenixSIEM v4.8.1 — All access is logged and monitored
        </p>
      </div>
    </div>
  );
}
