import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, GitBranch, Activity, ChevronRight, Eye, EyeOff, Zap, UserCheck, KeyRound } from 'lucide-react';
import DevHubLogo from '@/components/ui/DevHubLogo';
import { useDevHub } from '@/context/DevHubContext';

export default function Landing() {
  const navigate = useNavigate();
  const { projects, bugs, tasks, teamMembers } = useDevHub();
  const [username, setUsername] = useState('khurram.munir');
  const [password, setPassword] = useState('devhub2026');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  // System stats calculated from live context
  const systemStats = [
    { label: 'TOTAL PROJECTS', value: projects.length.toString() },
    { label: 'IN PRODUCTION',  value: projects.filter(p => p.status === 'Production').length.toString() },
    { label: 'OPEN BUGS',      value: bugs.filter(b => b.status === 'Open' || b.status === 'In Progress').length.toString() },
    { label: 'OPERATORS',      value: teamMembers.length.toString() },
    { label: 'SYSTEM BUILD',   value: 'v2.4.0 PRO' },
    { label: 'CLUSTER HEALTH', value: '100% OK' },
  ];

  const recentActivity = [
    { time: '15:05', msg: '31 projects loaded into workspace cluster', type: 'update' },
    { time: '14:50', msg: 'ClinicFlow project initialized on Next.js', type: 'deploy' },
    { time: '14:15', msg: 'AeroTrack Pro Aviation MRO Dashboard v1.2 tested', type: 'version' },
    { time: '13:10', msg: 'RentPilot UAE lease reminder workflows active', type: 'update' },
  ];

  const typeColors: Record<string, string> = {
    update: '#00d4c8',
    bug: '#ef4444',
    version: '#8b5cf6',
    deploy: '#10b981',
  };

  // Boot sequence animation
  const BOOT_SEQUENCE = [
    '> Initializing KMB DevHub PRO v2.4.0 Desktop Runtime...',
    `> Mounting project catalog (${projects.length} units)... OK`,
    '> Connecting to local repositories & endpoints... OK',
    '> Running system diagnostics... PASS (Latency: 8ms)',
    '> Loading operator profiles & security credentials... OK',
    '> All systems nominal. Ready for console access.',
  ];

  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i < BOOT_SEQUENCE.length) {
        setBootLines((prev) => [...prev, BOOT_SEQUENCE[i]]);
        i++;
        setTimeout(next, 200 + Math.random() * 80);
      } else {
        setTimeout(() => setBootDone(true), 300);
      }
    };
    setTimeout(next, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickBypass = () => {
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen w-full flex overflow-hidden select-none"
      style={{ background: '#0a0c0f', fontFamily: "'Calibri', 'Carlito', 'Candara', 'Segoe UI', Arial, sans-serif" }}
    >
      {/* Scanline subtle CRT effect overlay */}
      <div className="scanline" />

      {/* ── LEFT PANEL: System telemetry & Live Boot Log ────────────── */}
      <div
        className="hidden lg:flex flex-col w-[540px] flex-shrink-0 relative overflow-hidden"
        style={{
          background: '#0d1017',
          borderRight: '1px solid #1e2330',
        }}
      >
        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

        {/* Corner accent lines */}
        <div
          className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
          style={{
            borderTop: '2px solid #00d4c850',
            borderLeft: '2px solid #00d4c850',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
          style={{
            borderBottom: '2px solid #00d4c850',
            borderRight: '2px solid #00d4c850',
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-8">
          {/* Logo + Header */}
          <div className="mb-8">
            <div className="mb-4">
              <DevHubLogo size="lg" />
            </div>

            {/* Status bar */}
            <div
              className="flex items-center gap-4 px-3 py-2 rounded-[2px]"
              style={{ background: '#101318', border: '1px solid #1e2330' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
                />
                <span className="font-mono text-[10px] tracking-widest font-bold" style={{ color: '#10b981' }}>
                  CORE CLUSTER ONLINE
                </span>
              </div>
              <div className="flex-1" />
              <span className="font-mono text-xs text-[#00d4c8] font-bold">
                {new Date().toLocaleTimeString('en-GB', { hour12: false })}
              </span>
              <span className="font-mono text-[10px]" style={{ color: '#55637a' }}>
                {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>

          {/* System stats grid */}
          <div className="mb-6">
            <div className="font-mono text-[10px] tracking-[0.2em] mb-2 font-bold" style={{ color: '#55637a' }}>
              TELEMETRY BENCHMARKS
            </div>
            <div className="grid grid-cols-3 gap-px bg-[#1e2330] rounded-[2px] overflow-hidden">
              {systemStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-0.5 p-2.5 bg-[#101318]"
                >
                  <div className="font-mono text-base font-bold text-[#dce4f0]">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[8.5px] tracking-widest text-[#55637a]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="mb-6">
            <div className="font-mono text-[10px] tracking-[0.2em] mb-2 font-bold" style={{ color: '#55637a' }}>
              RECENT LOGGED EVENTS
            </div>
            <div className="space-y-0 pl-4 border-l border-[#1e2330]">
              {recentActivity.map((ev, i) => (
                <div key={i} className="relative py-1.5 flex items-start gap-2.5">
                  <div
                    className="absolute -left-[19px] top-[7px] w-[6px] h-[6px] rounded-full flex-shrink-0"
                    style={{
                      background: typeColors[ev.type],
                      boxShadow: `0 0 4px ${typeColors[ev.type]}60`,
                    }}
                  />
                  <span className="font-mono text-[10px] text-[#55637a] flex-shrink-0 w-10">
                    {ev.time}
                  </span>
                  <span className="text-xs text-[#8892a4] truncate">
                    {ev.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Boot sequence terminal */}
          <div className="mt-auto">
            <div className="p-3.5 font-mono text-[11px] bg-[#080a0d] border border-[#1e2330] rounded-[2px]">
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-[#1e2330]">
                <Terminal size={12} className="text-[#00d4c8]" />
                <span className="text-[#55637a] tracking-widest text-[9px] font-bold">STARTUP LOG</span>
              </div>
              <div className="space-y-0.5 text-[10px]">
                {bootLines.map((line, i) => (
                  <div key={i} style={{ color: i === bootLines.length - 1 ? '#00d4c8' : '#55637a' }}>
                    {line}
                  </div>
                ))}
                {bootDone && (
                  <div className="text-[#10b981] font-bold mt-1">
                    {'>'} AUTHENTICATION PROMPT READY — <span className="animate-pulse">█</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Auth terminal with 1-Click Access ─────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-dots opacity-25 pointer-events-none" />

        {/* Mobile: Logo header */}
        <div className="lg:hidden mb-8 text-center flex flex-col items-center">
          <DevHubLogo size="lg" />
        </div>

        {/* Auth Console Box */}
        <div className="relative z-10 w-full max-w-md bg-[#101318] border border-[#252c3a] rounded-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#1e2330] bg-[#0d1017]">
            <div className="flex items-center gap-2 font-mono text-xs text-[#dce4f0] font-bold">
              <Shield size={14} className="text-[#00d4c8]" />
              <span>OPERATOR CONSOLE ACCESS</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] opacity-80" />
            </div>
          </div>

          {/* Form body */}
          <div className="p-6 space-y-4">
            {/* ── 1-CLICK INSTANT START BUTTON ──────────────────────── */}
            <div>
              <button
                type="button"
                onClick={handleQuickBypass}
                className="w-full py-3 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono font-black text-xs tracking-wider rounded-[2px] flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(0,212,200,0.35)] active:scale-[0.99]"
              >
                <Zap size={15} className="fill-black" />
                <span>1-CLICK INSTANT START (DEVHUB PRO)</span>
                <ChevronRight size={15} />
              </button>
              <span className="block text-center font-mono text-[9.5px] text-[#55637a] mt-1.5 tracking-wider">
                Click above to bypass login & open Command Center directly
              </span>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-px bg-[#1e2330]" />
              <span className="font-mono text-[9px] text-[#404d60] uppercase tracking-widest">
                OR SIGN IN WITH CREDENTIALS
              </span>
              <div className="flex-1 h-px bg-[#1e2330]" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Username */}
              <div>
                <label className="block font-mono text-[10px] tracking-wider mb-1 text-[#7a8899]">
                  OPERATOR ID / USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. khurram.munir or admin"
                    className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] px-3 py-2 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
                  />
                  <UserCheck size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55637a]" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-mono text-[10px] tracking-wider mb-1 text-[#7a8899]">
                  ACCESS KEY / PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] px-3 py-2 pr-10 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55637a] hover:text-[#dce4f0]"
                  >
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-2 bg-[#ef444415] border border-[#ef444430] text-[#ef4444] font-mono text-xs rounded-[2px]">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#182232] hover:bg-[#202c40] text-[#00d4c8] border border-[#00d4c850] font-mono font-bold text-xs tracking-wider rounded-[2px] flex items-center justify-center gap-2 transition-all"
              >
                {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER'}
              </button>
            </form>

            {/* Default Credentials Box */}
            <div className="p-2.5 bg-[#0a0c10] border border-[#1e2330] rounded-[2px] font-mono text-[10px] text-[#7a8899] space-y-1">
              <div className="flex items-center gap-1.5 text-[#00d4c8] font-bold uppercase">
                <KeyRound size={11} /> PRE-CONFIGURED CREDENTIALS:
              </div>
              <div className="flex justify-between">
                <span>User ID: <code className="text-[#dce4f0]">khurram.munir</code></span>
                <span>Password: <code className="text-[#dce4f0]">devhub2026</code></span>
              </div>
              <div className="text-[9px] text-[#55637a]">
                (Or enter any username & password to enter)
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-2.5 bg-[#0d1017] border-t border-[#1e2330] flex items-center justify-between font-mono text-[9px] text-[#55637a]">
            <span>NODE: LOCAL_HOST_5173</span>
            <span className="text-[#10b981] font-bold">AUTH: ENABLED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
