import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal, Shield, Activity, ChevronRight, Eye, EyeOff, Zap,
  UserCheck, KeyRound, Server, Cpu, Database, Wifi, CheckCircle2,
  Lock, RefreshCw, Layers
} from 'lucide-react';
import DevHubLogo from '@/components/ui/DevHubLogo';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { useDevHub } from '@/context/DevHubContext';

export default function Landing() {
  const navigate = useNavigate();
  const { projects, bugs, tasks, teamMembers } = useDevHub();
  const [username, setUsername] = useState('khurram.munir');
  const [password, setPassword] = useState('devhub2026');
  const [selectedRole, setSelectedRole] = useState('Khurram Munir (Lead Architect)');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'terminal' | 'health'>('featured');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // System stats calculated from live context
  const systemStats = [
    { label: 'TOTAL PROJECTS', value: projects.length.toString(), color: '#00d4c8' },
    { label: 'IN PRODUCTION',  value: projects.filter(p => p.status === 'Production').length.toString(), color: '#10b981' },
    { label: 'TESTING / QA',   value: projects.filter(p => p.status === 'Testing').length.toString(), color: '#f59e0b' },
    { label: 'OPEN DEFECTS',   value: bugs.filter(b => b.status === 'Open' || b.status === 'In Progress').length.toString(), color: '#ef4444' },
    { label: 'ACTIVE OPERATORS', value: teamMembers.length.toString(), color: '#38bdf8' },
    { label: 'SYSTEM HEALTH',  value: '99.98%', color: '#10b981' },
  ];

  // Key Enterprise Systems Showcase
  const featuredSystems = projects.slice(0, 6);

  // Boot sequence animation
  const BOOT_SEQUENCE = [
    '> Initializing KMB DevHub PRO v2.4.0 Desktop Runtime Engine...',
    `> Mounting project catalog (${projects.length} repositories loaded)... OK`,
    '> Linking UUDS DXB Stores production cluster & database sockets... OK',
    '> Running core latency diagnostics... 4ms (Optimal)',
    '> Loading operator credentials & biometric security hashes... OK',
    '> All cluster nodes operational. Ready for console access.',
  ];

  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i < BOOT_SEQUENCE.length) {
        setBootLines((prev) => [...prev, BOOT_SEQUENCE[i]]);
        i++;
        setTimeout(next, 180 + Math.random() * 60);
      } else {
        setTimeout(() => setBootDone(true), 250);
      }
    };
    setTimeout(next, 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 350);
  };

  const handleQuickBypass = () => {
    navigate('/dashboard');
  };

  const selectOperatorProfile = (name: string, user: string, pass: string) => {
    setSelectedRole(name);
    setUsername(user);
    setPassword(pass);
  };

  const handleTerminalCommand = (cmd: string) => {
    if (cmd === 'clear') {
      setBootLines([]);
      return;
    }
    if (cmd === 'status') {
      setBootLines(prev => [...prev, `$ system:status`, `> CLUSTER: 31 Projects Active | 14 Production | Latency: 4ms | Status: 100% OK`]);
      return;
    }
    if (cmd === 'projects') {
      setBootLines(prev => [...prev, `$ projects:list`, `> 1. Tools Mgt (Django) | 2. Material Mgt (Django) | 3. Parts Inspection (Flutter)`]);
      return;
    }
    if (cmd === 'security') {
      setBootLines(prev => [...prev, `$ security:check`, `> TLS 1.3 Active | SuperAdmin Token Verified | Session: SEC_DXB_2026`]);
      return;
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[#0a0c0f] text-[#dce4f0] select-none transition-colors duration-150 overflow-y-auto lg:overflow-hidden"
      style={{ fontFamily: "'Calibri', 'Carlito', 'Candara', 'Segoe UI', Arial, sans-serif" }}
    >
      {/* Scanline CRT overlay */}
      <div className="scanline" />

      {/* ── TOP MISSION CONTROL HEADER BAR ──────────────────────────── */}
      <header className="w-full bg-[#0d1017] border-b border-[#1e2330] px-4 py-2.5 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <DevHubLogo size="sm" />
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#1e2330]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span className="font-mono text-[11px] font-bold text-[#10b981] tracking-wider uppercase">
              CORE CLUSTER ONLINE
            </span>
            <span className="font-mono text-[10px] text-[#55637a] tracking-wider">
              • DXB-PRIMARY (4ms)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Real-time Clock */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#101318] border border-[#1e2330] rounded-[2px] font-mono text-[11px]">
            <span className="text-[#00d4c8] font-bold">
              {currentTime.toLocaleTimeString('en-GB', { hour12: false })}
            </span>
            <span className="text-[#55637a]">
              {currentTime.toLocaleDateString('en-GB')}
            </span>
          </div>

          {/* Theme Switcher Toggle */}
          <ThemeSwitcher />

          {/* 1-Click Launch Header Action */}
          <button
            type="button"
            onClick={handleQuickBypass}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono text-xs font-black rounded-[3px] transition-all shadow-[0_0_12px_rgba(0,212,200,0.3)] active:scale-95"
            title="Instant 1-Click Dashboard Access"
          >
            <Zap size={13} className="fill-black" />
            <span className="hidden sm:inline">1-CLICK START</span>
            <span className="sm:hidden">START</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE VIEWPORT ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        {/* ── LEFT PANEL: Enterprise Telemetry & Systems Deck ──────── */}
        <div
          className="w-full lg:w-[560px] xl:w-[620px] flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#1e2330] bg-[#0d1017] p-4 sm:p-6 lg:overflow-y-auto scrollable relative"
        >
          {/* Subtle Grid Texture */}
          <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

          {/* Brand & Mission Banner */}
          <div className="relative z-10 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#00d4c8] bg-[#00d4c815] px-2 py-0.5 border border-[#00d4c840] rounded-[2px] tracking-wider">
                ENTERPRISE DEVELOPER COMMAND CENTER
              </span>
              <span className="font-mono text-[10px] text-[#55637a]">BUILD v2.4.0 PRO</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9] tracking-tight">
              UUDS DXB Stores & Operations Console
            </h1>
            <p className="text-xs text-[#7a8899] mt-1 leading-relaxed">
              Unified control center managing 31 production apps, real-time inventory systems, Flutter mobile inspection tools, and developer telemetry.
            </p>
          </div>

          {/* Metrics Matrix Strip */}
          <div className="relative z-10 mb-5">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1.5 bg-[#101318] border border-[#1e2330] rounded-[3px]">
              {systemStats.map((st) => (
                <div key={st.label} className="p-2 bg-[#141820] rounded-[2px] text-center border border-[#1e2535]">
                  <div className="font-mono text-base font-bold" style={{ color: st.color }}>
                    {st.value}
                  </div>
                  <div className="font-mono text-[8px] text-[#55637a] tracking-wider uppercase truncate">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Deck Interactive Tabs */}
          <div className="relative z-10 flex items-center gap-1 mb-3 border-b border-[#1e2330] pb-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-2.5 py-1 rounded-[2px] uppercase text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'featured'
                  ? 'bg-[#00d4c815] text-[#00d4c8] border border-[#00d4c850]'
                  : 'text-[#64748b] hover:text-[#dce4f0] border border-transparent'
              }`}
            >
              <Layers size={12} /> FEATURED REPOSITORIES ({featuredSystems.length})
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-2.5 py-1 rounded-[2px] uppercase text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'terminal'
                  ? 'bg-[#00d4c815] text-[#00d4c8] border border-[#00d4c850]'
                  : 'text-[#64748b] hover:text-[#dce4f0] border border-transparent'
              }`}
            >
              <Terminal size={12} /> LIVE TERMINAL
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-2.5 py-1 rounded-[2px] uppercase text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'health'
                  ? 'bg-[#00d4c815] text-[#00d4c8] border border-[#00d4c850]'
                  : 'text-[#64748b] hover:text-[#dce4f0] border border-transparent'
              }`}
            >
              <Activity size={12} /> CLUSTER HEALTH
            </button>
          </div>

          {/* Tab Content 1: Featured Systems */}
          {activeTab === 'featured' && (
            <div className="relative z-10 space-y-2 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {featuredSystems.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={handleQuickBypass}
                    className="p-2.5 bg-[#101318] hover:bg-[#141824] border border-[#1e2330] hover:border-[#00d4c860] rounded-[3px] transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-[#00d4c8] bg-[#00d4c810] px-1.5 py-0.5 rounded-[2px] border border-[#00d4c830]">
                        {proj.shortCode}
                      </span>
                      <span className="font-mono text-[9.5px] px-1.5 py-0.2 rounded-[2px] bg-[#10b98115] text-[#10b981] border border-[#10b98140] font-bold">
                        {proj.status}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-[#dce4f0] group-hover:text-[#00d4c8] truncate transition-colors">
                      {proj.name}
                    </div>
                    <div className="text-[10.5px] text-[#55637a] truncate mt-0.5">
                      {proj.description}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#181d28] font-mono text-[9px] text-[#7a8899]">
                      <span className="truncate max-w-[120px]">{proj.stack.slice(0, 2).join(' • ')}</span>
                      <span className="text-[#38bdf8] font-bold">{proj.version}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 2: Live Terminal */}
          {activeTab === 'terminal' && (
            <div className="relative z-10 flex-1 flex flex-col bg-[#080a0d] border border-[#1e2330] rounded-[3px] p-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1e2330]">
                <div className="flex items-center gap-1.5 text-[#00d4c8] text-[10px] font-bold">
                  <Terminal size={12} />
                  <span>RUNTIME CONSOLE STREAM</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTerminalCommand('status')}
                    className="px-1.5 py-0.5 bg-[#141820] hover:bg-[#1a2130] text-[#7a8899] hover:text-[#00d4c8] rounded-[2px] text-[9px] border border-[#252c3a]"
                  >
                    status
                  </button>
                  <button
                    onClick={() => handleTerminalCommand('projects')}
                    className="px-1.5 py-0.5 bg-[#141820] hover:bg-[#1a2130] text-[#7a8899] hover:text-[#00d4c8] rounded-[2px] text-[9px] border border-[#252c3a]"
                  >
                    projects
                  </button>
                  <button
                    onClick={() => handleTerminalCommand('security')}
                    className="px-1.5 py-0.5 bg-[#141820] hover:bg-[#1a2130] text-[#7a8899] hover:text-[#00d4c8] rounded-[2px] text-[9px] border border-[#252c3a]"
                  >
                    security
                  </button>
                  <button
                    onClick={() => handleTerminalCommand('clear')}
                    className="px-1.5 py-0.5 bg-[#141820] hover:bg-[#1a2130] text-[#7a8899] hover:text-[#ef4444] rounded-[2px] text-[9px] border border-[#252c3a]"
                  >
                    clear
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-[10.5px] max-h-48 overflow-y-auto scrollable">
                {bootLines.map((line, idx) => (
                  <div key={idx} className={idx === bootLines.length - 1 ? 'text-[#00d4c8]' : 'text-[#7a8899]'}>
                    {line}
                  </div>
                ))}
                {bootDone && (
                  <div className="text-[#10b981] font-bold flex items-center gap-1 mt-1">
                    <CheckCircle2 size={12} />
                    <span>SYSTEM ONLINE & READY</span>
                    <span className="animate-pulse text-[#00d4c8]">█</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content 3: Cluster Health */}
          {activeTab === 'health' && (
            <div className="relative z-10 flex-1 space-y-3 bg-[#101318] border border-[#1e2330] rounded-[3px] p-3.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e2330]">
                <span className="text-[#00d4c8] font-bold text-[11px] flex items-center gap-1.5">
                  <Cpu size={13} /> RESOURCE UTILIZATION & TELEMETRY
                </span>
                <span className="text-[#10b981] text-[10px] font-bold">ALL SERVICES NOMINAL</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[10px] text-[#7a8899] mb-1">
                    <span>CPU LOAD (8 CORES)</span>
                    <span className="text-[#00d4c8] font-bold">14.2%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#181d28] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00d4c8] w-[14.2%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#7a8899] mb-1">
                    <span>MEMORY ALLOCATED (32 GB)</span>
                    <span className="text-[#38bdf8] font-bold">32.8% (10.5 GB)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#181d28] rounded-full overflow-hidden">
                    <div className="h-full bg-[#38bdf8] w-[32.8%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#7a8899] mb-1">
                    <span>POSTGRESQL & REDIS CLUSTER POOL</span>
                    <span className="text-[#10b981] font-bold">48 ACTIVE CONNECTIONS</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#181d28] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] w-[45%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#7a8899] mb-1">
                    <span>LOCAL DISK NVMe STORAGE</span>
                    <span className="text-[#f59e0b] font-bold">62.1% (1.2 TB / 2.0 TB)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#181d28] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f59e0b] w-[62.1%]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Security Footer */}
          <div className="relative z-10 mt-auto pt-4 flex items-center justify-between font-mono text-[9.5px] text-[#55637a] border-t border-[#1e2330]">
            <div className="flex items-center gap-1.5">
              <Shield size={11} className="text-[#10b981]" />
              <span>TLS 1.3 ENCRYPTION ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={11} className="text-[#00d4c8]" />
              <span>PORT: 5173 • ON-PREMISE</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Auth Terminal & Fast Access Launch Deck ── */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative bg-[#0a0c0f]">
          <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

          {/* Auth Deck Container */}
          <div className="relative z-10 w-full max-w-md bg-[#101318] border border-[#252c3a] rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Card Top Title Bar */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#1e2330] bg-[#0d1017]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#dce4f0] font-bold">
                <Shield size={14} className="text-[#00d4c8]" />
                <span>OPERATOR CONSOLE AUTHENTICATION</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] opacity-80" />
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {/* ── MASTER 1-CLICK INSTANT START BUTTON ──────────────── */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={handleQuickBypass}
                  className="w-full py-3.5 px-4 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono font-black text-xs tracking-wider rounded-[3px] flex items-center justify-between transition-all shadow-[0_0_20px_rgba(0,212,200,0.4)] hover:shadow-[0_0_28px_rgba(0,212,200,0.6)] active:scale-[0.99] group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 bg-black/10 rounded-[2px]">
                      <Zap size={16} className="fill-black" />
                    </div>
                    <div className="text-left">
                      <div className="leading-tight">1-CLICK INSTANT LAUNCH</div>
                      <div className="text-[9.5px] opacity-80 font-normal tracking-normal">Directly open Command Dashboard</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Quick Profile Selectors */}
              <div>
                <label className="block font-mono text-[10px] tracking-wider mb-1.5 text-[#7a8899] uppercase font-bold">
                  QUICK OPERATOR SELECTOR:
                </label>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => selectOperatorProfile('Khurram Munir (Lead Architect)', 'khurram.munir', 'devhub2026')}
                    className={`p-2 rounded-[2px] border text-left transition-all ${
                      username === 'khurram.munir'
                        ? 'bg-[#00d4c815] border-[#00d4c860] text-[#00d4c8] font-bold'
                        : 'bg-[#141820] border-[#252c3a] text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#1a2130]'
                    }`}
                  >
                    <div className="truncate">Khurram Munir</div>
                    <div className="text-[8.5px] text-[#55637a]">Lead SuperAdmin</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectOperatorProfile('UUDS Core Team', 'uuds.admin', 'uuds2026')}
                    className={`p-2 rounded-[2px] border text-left transition-all ${
                      username === 'uuds.admin'
                        ? 'bg-[#00d4c815] border-[#00d4c860] text-[#00d4c8] font-bold'
                        : 'bg-[#141820] border-[#252c3a] text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#1a2130]'
                    }`}
                  >
                    <div className="truncate">UUDS Store Ops</div>
                    <div className="text-[8.5px] text-[#55637a]">Airport Ops Lead</div>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-px bg-[#1e2330]" />
                <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-widest font-bold">
                  OR AUTHENTICATE CREDENTIALS
                </span>
                <div className="flex-1 h-px bg-[#1e2330]" />
              </div>

              {/* Auth Form */}
              <form onSubmit={handleLogin} className="space-y-3">
                {/* Username */}
                <div>
                  <label className="block font-mono text-[10px] tracking-wider mb-1 text-[#7a8899] font-bold uppercase">
                    OPERATOR ID / USERNAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. khurram.munir or admin"
                      className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] px-3 py-2 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px] transition-colors"
                    />
                    <UserCheck size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55637a]" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-mono text-[10px] tracking-wider mb-1 text-[#7a8899] font-bold uppercase">
                    ACCESS KEY / SECURITY PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] px-3 py-2 pr-10 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55637a] hover:text-[#dce4f0] transition-colors"
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
                  className="w-full py-2.5 bg-[#182232] hover:bg-[#202c40] text-[#00d4c8] border border-[#00d4c850] font-mono font-bold text-xs tracking-wider rounded-[2px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>VERIFYING CREDENTIALS...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={13} />
                      <span>AUTHENTICATE & ENTER CONSOLE</span>
                    </>
                  )}
                </button>
              </form>

              {/* Pre-configured Credentials Guide */}
              <div className="p-2.5 bg-[#0a0c10] border border-[#1e2330] rounded-[2px] font-mono text-[10px] text-[#7a8899] space-y-1">
                <div className="flex items-center gap-1.5 text-[#00d4c8] font-bold uppercase">
                  <KeyRound size={11} /> PRE-CONFIGURED CREDENTIALS:
                </div>
                <div className="flex justify-between">
                  <span>User: <code className="text-[#dce4f0]">{username}</code></span>
                  <span>Pass: <code className="text-[#dce4f0]">{password}</code></span>
                </div>
                <div className="text-[8.5px] text-[#55637a]">
                  (Any ID and password will authenticate into the system)
                </div>
              </div>
            </div>

            {/* Footer Status Strip */}
            <div className="px-5 py-2 bg-[#0d1017] border-t border-[#1e2330] flex items-center justify-between font-mono text-[9px] text-[#55637a]">
              <span className="flex items-center gap-1">
                <Server size={10} className="text-[#00d4c8]" /> NODE: DXB_STORES_PRIMARY
              </span>
              <span className="text-[#10b981] font-bold">STATUS: AUTHORIZED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
