import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, GitBranch, Activity, ChevronRight, Eye, EyeOff } from 'lucide-react';

// ─── System Status Panel ───────────────────────────────────────────
const systemStats = [
  { label: 'TOTAL PROJECTS',  value: '9'        },
  { label: 'ACTIVE BUILDS',   value: '3'        },
  { label: 'OPEN BUGS',       value: '6'        },
  { label: 'TEAM MEMBERS',    value: '6'        },
  { label: 'SYSTEM VERSION',  value: 'v1.0.0'   },
  { label: 'UPTIME',          value: '99.8%'    },
];

const recentActivity = [
  { time: '14:22', msg: 'Repair Module updated to build 88',       type: 'update' },
  { time: '13:48', msg: 'Bug #B004 reported — Safari file upload', type: 'bug'    },
  { time: '12:15', msg: 'UUDS Material v2.4 tagged & pushed',      type: 'version'},
  { time: '09:30', msg: 'Attendance System deployed to Production', type: 'deploy' },
];

const typeColors: Record<string, string> = {
  update:  '#00d4c8',
  bug:     '#ef4444',
  version: '#8b5cf6',
  deploy:  '#10b981',
};

// ─── Animated counter ─────────────────────────────────────────────
function useTypingEffect(text: string, speed = 60) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return displayed;
}

// ─── Clock ────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono text-xs text-[#00d4c8]">
      {time.toLocaleTimeString('en-GB', { hour12: false })}
    </span>
  );
}

// ─── Main Landing ─────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [bootDone, setBootDone]       = useState(false);
  const [bootLines, setBootLines]     = useState<string[]>([]);

  const subtitle = useTypingEffect('DEVELOPMENT CONTROL CENTER', 35);

  // Boot sequence animation
  const BOOT_SEQUENCE = [
    '> Initializing KMB DevHub v1.0.0...',
    '> Loading project registry... OK',
    '> Connecting to local repositories... OK',
    '> Running system diagnostics... PASS',
    '> Loading team configuration... OK',
    '> All systems nominal. Authentication required.',
  ];

  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i < BOOT_SEQUENCE.length) {
        setBootLines(prev => [...prev, BOOT_SEQUENCE[i]]);
        i++;
        setTimeout(next, 280 + Math.random() * 120);
      } else {
        setTimeout(() => setBootDone(true), 400);
      }
    };
    setTimeout(next, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('ACCESS DENIED — credentials required');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Accept any credentials for demo
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div
      className="min-h-screen w-full flex overflow-hidden"
      style={{ background: '#0a0c0f', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Scanline overlay */}
      <div className="scanline" />

      {/* ── LEFT PANEL: System info ───────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col w-[520px] flex-shrink-0 relative overflow-hidden"
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
            borderTop: '2px solid #00d4c840',
            borderLeft: '2px solid #00d4c840',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
          style={{
            borderBottom: '2px solid #00d4c840',
            borderRight: '2px solid #00d4c840',
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-8">

          {/* Logo + name */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo icon */}
              <div
                className="flex items-center justify-center w-10 h-10 flex-shrink-0"
                style={{ border: '1px solid #00d4c8', background: '#00d4c810' }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  {/* Code brackets */}
                  <path d="M6 4 L2 11 L6 18" stroke="#00d4c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M16 4 L20 11 L16 18" stroke="#00d4c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Center node */}
                  <circle cx="11" cy="11" r="2" fill="#00d4c8" />
                  {/* Branch lines */}
                  <line x1="11" y1="9" x2="11" y2="5" stroke="#00d4c860" strokeWidth="1" />
                  <circle cx="11" cy="4" r="1.2" fill="none" stroke="#00d4c8" strokeWidth="1" />
                  <line x1="11" y1="13" x2="11" y2="17" stroke="#00d4c860" strokeWidth="1" />
                  <circle cx="11" cy="18" r="1.2" fill="none" stroke="#00d4c8" strokeWidth="1" />
                </svg>
              </div>
              <div>
                <div
                  className="font-mono font-semibold tracking-[0.15em] text-sm"
                  style={{ color: '#dce4f0', letterSpacing: '0.12em' }}
                >
                  KMB DEVHUB
                </div>
                <div
                  className="font-mono text-[10px] tracking-[0.2em] mt-0.5"
                  style={{ color: '#00d4c8' }}
                >
                  {subtitle}
                  {subtitle.length < 'DEVELOPMENT CONTROL CENTER'.length && (
                    <span className="animate-pulse">█</span>
                  )}
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div
              className="flex items-center gap-4 px-3 py-2"
              style={{ background: '#101318', border: '1px solid #1e2330' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
                />
                <span className="font-mono text-[10px] tracking-widest" style={{ color: '#10b981' }}>
                  SYSTEM ONLINE
                </span>
              </div>
              <div className="flex-1" />
              <LiveClock />
              <span className="font-mono text-[10px]" style={{ color: '#404d60' }}>
                {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>

          {/* System stats grid */}
          <div className="mb-8">
            <div
              className="font-mono text-[10px] tracking-[0.2em] mb-3"
              style={{ color: '#404d60' }}
            >
              SYSTEM METRICS
            </div>
            <div className="grid grid-cols-3 gap-px" style={{ background: '#1e2330' }}>
              {systemStats.map(stat => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 p-3"
                  style={{ background: '#101318' }}
                >
                  <div className="font-mono text-[18px] font-semibold" style={{ color: '#dce4f0' }}>
                    {stat.value}
                  </div>
                  <div className="font-mono text-[9px] tracking-widest" style={{ color: '#404d60' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="mb-8">
            <div
              className="font-mono text-[10px] tracking-[0.2em] mb-3"
              style={{ color: '#404d60' }}
            >
              RECENT ACTIVITY
            </div>
            <div className="space-y-0" style={{ borderLeft: '1px solid #1e2330', paddingLeft: '16px' }}>
              {recentActivity.map((ev, i) => (
                <div key={i} className="relative py-2 flex items-start gap-3">
                  {/* dot */}
                  <div
                    className="absolute -left-[20px] top-[9px] w-[7px] h-[7px] rounded-full flex-shrink-0"
                    style={{
                      background: typeColors[ev.type],
                      border: '1px solid #0a0c0f',
                      boxShadow: `0 0 4px ${typeColors[ev.type]}60`,
                    }}
                  />
                  <span className="font-mono text-[11px] flex-shrink-0" style={{ color: '#404d60', minWidth: '38px' }}>
                    {ev.time}
                  </span>
                  <span className="text-[12px]" style={{ color: '#7a8899' }}>
                    {ev.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Boot sequence terminal */}
          <div className="mt-auto">
            <div
              className="p-4 font-mono text-[11px]"
              style={{
                background: '#080a0d',
                border: '1px solid #1e2330',
              }}
            >
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <Terminal size={11} color="#404d60" />
                <span style={{ color: '#404d60', letterSpacing: '0.1em', fontSize: '9px' }}>SYSTEM LOG</span>
              </div>
              <div className="space-y-1">
                {bootLines.map((line, i) => (
                  <div key={i} style={{ color: i === bootLines.length - 1 ? '#00d4c8' : '#404d60' }}>
                    {line}
                  </div>
                ))}
                {bootDone && (
                  <div style={{ color: '#404d60' }}>
                    {'>'} <span style={{ color: '#10b981' }}>READY</span>
                    {' — '}
                    <span className="animate-pulse">█</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Auth terminal ────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Dot grid background */}
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

        {/* Mobile: show logo */}
        <div className="lg:hidden mb-10 text-center">
          <div className="font-mono font-semibold text-lg tracking-[0.15em]" style={{ color: '#dce4f0' }}>
            KMB DEVHUB
          </div>
          <div className="font-mono text-xs tracking-[0.2em] mt-1" style={{ color: '#00d4c8' }}>
            DEVELOPMENT CONTROL CENTER
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
            <span className="font-mono text-[10px] tracking-widest" style={{ color: '#10b981' }}>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Auth box */}
        <div
          className="relative z-10 w-full max-w-sm"
          style={{
            background: '#101318',
            border: '1px solid #252c3a',
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ borderBottom: '1px solid #1e2330', background: '#0d1017' }}
          >
            <Shield size={14} color="#00d4c8" />
            <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: '#7a8899' }}>
              AUTHENTICATION REQUIRED
            </span>
            <div className="ml-auto flex gap-1.5">
              {[0,1,2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#10b981', opacity: 0.6 }} />
              ))}
            </div>
          </div>

          {/* Form body */}
          <div className="p-6">
            {/* Clearance level indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px" style={{ background: '#1e2330' }} />
              <span className="font-mono text-[9px] tracking-[0.25em] px-2" style={{ color: '#404d60' }}>
                OPERATOR ACCESS
              </span>
              <div className="flex-1 h-px" style={{ background: '#1e2330' }} />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div>
                <label
                  className="block font-mono text-[10px] tracking-[0.15em] mb-1.5"
                  style={{ color: '#404d60' }}
                >
                  OPERATOR ID
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="cmd-input w-full px-3 py-2.5"
                  style={{ borderRadius: '2px' }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block font-mono text-[10px] tracking-[0.15em] mb-1.5"
                  style={{ color: '#404d60' }}
                >
                  ACCESS KEY
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="cmd-input w-full px-3 py-2.5 pr-10"
                    style={{ borderRadius: '2px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#404d60', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2 px-3 py-2 font-mono text-[11px]"
                  style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#ef4444' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-mono tracking-[0.15em] text-[11px]"
                style={{ borderRadius: '2px', marginTop: '8px' }}
              >
                {loading ? (
                  <>
                    <div
                      className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin"
                    />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    ENTER CONTROL CENTER
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div
              className="mt-5 pt-4 text-center font-mono text-[10px]"
              style={{ borderTop: '1px solid #1e2330', color: '#404d60' }}
            >
              DEMO: any credentials accepted
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{ borderTop: '1px solid #1e2330', background: '#0d1017' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <GitBranch size={10} color="#404d60" />
                <span className="font-mono text-[9px]" style={{ color: '#404d60' }}>main</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={10} color="#404d60" />
                <span className="font-mono text-[9px]" style={{ color: '#404d60' }}>build 001</span>
              </div>
            </div>
            <span className="font-mono text-[9px]" style={{ color: '#404d60' }}>
              KMB DEV © {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* Bottom corner indicators */}
        <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {['ENCRYPTED', 'SECURE', 'LOCAL'].map(label => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1e2330' }} />
                <span className="font-mono text-[9px]" style={{ color: '#2a3040' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <span className="font-mono text-[9px]" style={{ color: '#2a3040' }}>
            v1.0.0-rc.1
          </span>
        </div>
      </div>
    </div>
  );
}
