import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2, Server, Database, Smartphone, Bot, Cpu, Zap, Shield,
  ExternalLink, Mail, Phone, MapPin, Github, Linkedin, ChevronRight,
  Sparkles, Layers, CheckCircle2, ArrowUpRight, Terminal, Globe,
  Activity, Star, UserCheck, Eye, EyeOff, Lock, RefreshCw, KeyRound,
  FolderGit2
} from 'lucide-react';
import DevHubLogo from '@/components/ui/DevHubLogo';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { useDevHub } from '@/context/DevHubContext';

export default function Landing() {
  const navigate = useNavigate();
  const { projects, bugs, tasks, teamMembers, theme } = useDevHub();
  const isLight = theme === 'light-pro';

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'skills' | 'ai-copilot' | 'auth'>('portfolio');
  const [username, setUsername] = useState('khurram.munir');
  const [password, setPassword] = useState('devhub2026');
  const [showPass, setShowPass] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // System statistics
  const totalProjects = projects.length;
  const productionProjects = projects.filter(p => p.status === 'Production').length;
  const uudsProjects = projects.filter(p => p.tags.includes('uuds') || p.tags.includes('dxb-stores')).length;

  // Filter projects for portfolio showcase
  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'UUDS' && (p.tags.includes('uuds') || p.tags.includes('dxb-stores'))) ||
      (selectedCategory === 'DJANGO' && p.stack.includes('Django')) ||
      (selectedCategory === 'FLUTTER' && (p.stack.includes('Flutter') || p.type.includes('Mobile'))) ||
      (selectedCategory === 'REACT' && (p.stack.includes('React') || p.stack.includes('TypeScript') || p.stack.includes('Next.js'))) ||
      (selectedCategory === 'PRODUCTION' && p.status === 'Production');

    const matchesSearch =
      searchFilter === '' ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.shortCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.stack.some(s => s.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col select-none transition-colors duration-200 ${
        isLight ? 'bg-[#f8fafc] text-[#0f172a]' : 'bg-[#0a0c0f] text-[#dce4f0]'
      }`}
      style={{ fontFamily: "'Calibri', 'Carlito', 'Candara', 'Segoe UI', Arial, sans-serif" }}
    >
      {/* ── HEADER NAVBAR ────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 w-full px-4 sm:px-8 py-3 border-b backdrop-blur-md transition-colors ${
          isLight ? 'bg-[#ffffff]/90 border-[#e2e8f0]' : 'bg-[#0d1017]/95 border-[#1e2330]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <DevHubLogo size="md" />
            <div className="hidden sm:block pl-3 border-l border-[#1e2330]">
              <div className="font-bold text-sm tracking-tight text-[#f1f5f9] flex items-center gap-1.5">
                <span>Khurram Munir Basra</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#00d4c815] text-[#00d4c8] border border-[#00d4c840] rounded-[2px]">
                  PORTFOLIO & COMMAND CENTER
                </span>
              </div>
              <div className="text-[10.5px] text-[#7a8899] font-mono">
                Lead Architect • Full Stack & Enterprise Engineer
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-[#00d4c815] text-[#00d4c8] font-bold border border-[#00d4c850]'
                  : 'text-[#7a8899] hover:text-[#dce4f0]'
              }`}
            >
              PROJECTS ({totalProjects})
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                activeTab === 'skills'
                  ? 'bg-[#00d4c815] text-[#00d4c8] font-bold border border-[#00d4c850]'
                  : 'text-[#7a8899] hover:text-[#dce4f0]'
              }`}
            >
              ARCHITECTURE & SKILLS
            </button>
            <button
              onClick={() => navigate('/ai-studio')}
              className="px-3 py-1.5 rounded-[3px] bg-[#a855f715] text-[#c084fc] hover:bg-[#a855f725] border border-[#a855f750] font-bold transition-all flex items-center gap-1.5"
            >
              <Bot size={13} />
              <span>AI DEV STUDIO</span>
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                activeTab === 'auth'
                  ? 'bg-[#00d4c815] text-[#00d4c8] font-bold border border-[#00d4c850]'
                  : 'text-[#7a8899] hover:text-[#dce4f0]'
              }`}
            >
              OPERATOR LOGIN
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono text-xs font-black rounded-[3px] transition-all shadow-[0_0_14px_rgba(0,212,200,0.35)] active:scale-95 cursor-pointer"
            >
              <Zap size={14} className="fill-black" />
              <span>ENTER WORKSPACE</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO PROFILE & EXECUTIVE SUMMARY ────────────────────────── */}
      <section
        className={`w-full py-8 sm:py-12 px-4 sm:px-8 border-b relative overflow-hidden ${
          isLight ? 'bg-[#ffffff] border-[#e2e8f0]' : 'bg-[#0d1017] border-[#1e2330]'
        }`}
      >
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Bio & Value Proposition */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00d4c815] border border-[#00d4c840] rounded-[3px] font-mono text-xs text-[#00d4c8] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span>AVAILABLE FOR ARCHITECTURE & ENTERPRISE ENGINEERING</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#f8fafc]">
                Khurram Munir Basra
              </h1>

              <div className="text-sm sm:text-base text-[#00d4c8] font-mono font-bold flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Principal Full-Stack Architect</span>
                <span>•</span>
                <span>Python / Django & PostgreSQL</span>
                <span>•</span>
                <span>Flutter Mobile</span>
                <span>•</span>
                <span>AI Engineering</span>
              </div>

              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-3xl">
                Senior systems architect with extensive track record building mission-critical enterprise platforms, including high-scale inventory and material management systems for <strong className="text-[#f1f5f9]">UUDS Dubai Airport Stores</strong>, aviation MRO operations, cross-platform mobile apps, and custom AI copilot integrations.
              </p>

              {/* Contact / Connect Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs text-[#7a8899]">
                <a
                  href="mailto:khurrammunir377@gmail.com"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141820] hover:bg-[#1a2130] text-[#dce4f0] hover:text-[#00d4c8] border border-[#252c3a] rounded-[3px] transition-colors"
                >
                  <Mail size={13} className="text-[#00d4c8]" />
                  <span>khurrammunir377@gmail.com</span>
                </a>
                <a
                  href="https://github.com/khurrammunir377-dot"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141820] hover:bg-[#1a2130] text-[#dce4f0] hover:text-[#00d4c8] border border-[#252c3a] rounded-[3px] transition-colors"
                >
                  <Github size={13} className="text-[#38bdf8]" />
                  <span>github.com/khurrammunir377-dot</span>
                </a>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141820] text-[#dce4f0] border border-[#252c3a] rounded-[3px]">
                  <MapPin size={13} className="text-[#f59e0b]" />
                  <span>Dubai, United Arab Emirates</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 font-mono">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-black text-xs rounded-[3px] flex items-center gap-2 transition-all shadow-[0_0_18px_rgba(0,212,200,0.4)] active:scale-95 cursor-pointer"
                >
                  <Zap size={15} className="fill-black" />
                  <span>1-CLICK LAUNCH WORKSPACE</span>
                  <ChevronRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/ai-studio')}
                  className="px-4 py-2.5 bg-[#a855f715] hover:bg-[#a855f730] text-[#c084fc] border border-[#a855f760] font-bold text-xs rounded-[3px] flex items-center gap-2 transition-all"
                >
                  <Bot size={15} />
                  <span>OPEN AI DEV STUDIO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('portfolio')}
                  className="px-4 py-2.5 bg-[#141820] hover:bg-[#1a2130] text-[#dce4f0] hover:text-[#00d4c8] border border-[#252c3a] font-bold text-xs rounded-[3px] flex items-center gap-2 transition-all"
                >
                  <FolderGit2 size={15} />
                  <span>VIEW 31 PORTFOLIO PROJECTS</span>
                </button>
              </div>
            </div>

            {/* Right KPI & Architecture Deck */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 bg-[#101318] border border-[#1e2330] rounded-[4px] shadow-lg space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-[#1e2330] text-xs">
                  <span className="text-[#00d4c8] font-bold flex items-center gap-1.5">
                    <Activity size={14} /> PRODUCTION BENCHMARKS
                  </span>
                  <span className="text-[#10b981] font-bold">100% RELIABILITY</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-[#141820] border border-[#1e2535] rounded-[2px] text-center">
                    <div className="text-2xl font-black text-[#00d4c8]">{totalProjects}</div>
                    <div className="text-[9px] text-[#7a8899] uppercase">DELIVERED SYSTEMS</div>
                  </div>
                  <div className="p-2.5 bg-[#141820] border border-[#1e2535] rounded-[2px] text-center">
                    <div className="text-2xl font-black text-[#10b981]">{productionProjects}</div>
                    <div className="text-[9px] text-[#7a8899] uppercase">IN LIVE PRODUCTION</div>
                  </div>
                  <div className="p-2.5 bg-[#141820] border border-[#1e2535] rounded-[2px] text-center">
                    <div className="text-2xl font-black text-[#38bdf8]">{uudsProjects}</div>
                    <div className="text-[9px] text-[#7a8899] uppercase">UUDS AIRPORT APPS</div>
                  </div>
                  <div className="p-2.5 bg-[#141820] border border-[#1e2535] rounded-[2px] text-center">
                    <div className="text-2xl font-black text-[#c084fc]">99.98%</div>
                    <div className="text-[9px] text-[#7a8899] uppercase">SYSTEM UPTIME</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1e2330] text-[10px] text-[#7a8899] space-y-1">
                  <div className="flex justify-between">
                    <span>Key Client:</span>
                    <strong className="text-[#dce4f0]">UUDS Airport Stores (DXB)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Stack:</span>
                    <strong className="text-[#00d4c8]">Django / Waitress / PostgreSQL</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Platform:</span>
                    <strong className="text-[#38bdf8]">Flutter / Dart Android Apps</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAB SELECTOR RIBBON ─────────────────────────────────────── */}
      <div
        className={`sticky top-[57px] z-40 w-full px-4 sm:px-8 py-2.5 border-b font-mono text-xs ${
          isLight ? 'bg-[#ffffff] border-[#e2e8f0]' : 'bg-[#0d1017] border-[#1e2330]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded-[3px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'portfolio'
                  ? 'bg-[#00d4c8] text-black shadow-sm'
                  : 'text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#141820]'
              }`}
            >
              <FolderGit2 size={13} />
              <span>PORTFOLIO REPOSITORIES ({totalProjects})</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 rounded-[3px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'skills'
                  ? 'bg-[#00d4c8] text-black shadow-sm'
                  : 'text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#141820]'
              }`}
            >
              <Cpu size={13} />
              <span>TECHNICAL STACK & ARCHITECTURE</span>
            </button>

            <button
              onClick={() => navigate('/ai-studio')}
              className="px-3 py-1.5 rounded-[3px] font-bold uppercase transition-all flex items-center gap-1.5 bg-[#a855f715] text-[#c084fc] hover:bg-[#a855f725] border border-[#a855f750]"
            >
              <Bot size={13} />
              <span>AI COPILOT STUDIO (GROK / GPT-4o)</span>
            </button>

            <button
              onClick={() => setActiveTab('auth')}
              className={`px-3 py-1.5 rounded-[3px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'auth'
                  ? 'bg-[#00d4c8] text-black shadow-sm'
                  : 'text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#141820]'
              }`}
            >
              <Shield size={13} />
              <span>CONSOLE LOGIN</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10.5px] text-[#55637a]">
            <span>NODE: DXB_PORTFOLIO_PRO</span>
            <span>•</span>
            <span className="text-[#10b981] font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT 1: PORTFOLIO SHOWCASE ───────────────────────── */}
      {activeTab === 'portfolio' && (
        <section className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6">
          {/* Filter ribbon */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['ALL', 'UUDS', 'PRODUCTION', 'DJANGO', 'FLUTTER', 'REACT'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-[2px] font-bold uppercase transition-colors border ${
                    selectedCategory === cat
                      ? 'bg-[#00d4c815] border-[#00d4c8] text-[#00d4c8]'
                      : 'bg-[#141820] border-[#252c3a] text-[#7a8899] hover:text-[#dce4f0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search 31 projects, tech stack, or SKU..."
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-[2px] border outline-none ${
                  isLight
                    ? 'bg-[#ffffff] border-[#cbd5e1] text-[#0f172a] focus:border-[#0284c7]'
                    : 'bg-[#101318] border-[#252c3a] text-[#dce4f0] focus:border-[#00d4c8]'
                }`}
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}`)}
                className={`p-4 rounded-[3px] border transition-all cursor-pointer group shadow-sm flex flex-col justify-between ${
                  isLight
                    ? 'bg-[#ffffff] hover:bg-[#f8fafc] border-[#e2e8f0] hover:border-[#0284c7]'
                    : 'bg-[#101318] hover:bg-[#141824] border-[#1e2330] hover:border-[#00d4c860]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#00d4c8] bg-[#00d4c810] px-2 py-0.5 rounded-[2px] border border-[#00d4c830]">
                      {proj.shortCode}
                    </span>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-[2px] font-bold ${
                        proj.status === 'Production'
                          ? 'bg-[#10b98115] text-[#10b981] border border-[#10b98140]'
                          : proj.status === 'Testing'
                          ? 'bg-[#f59e0b15] text-[#f59e0b] border border-[#f59e0b40]'
                          : 'bg-[#3b82f615] text-[#3b82f6] border border-[#3b82f640]'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#f1f5f9] group-hover:text-[#00d4c8] transition-colors line-clamp-1">
                    {proj.name}
                  </h3>

                  <p className="text-xs text-[#7a8899] mt-1.5 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e2330] space-y-2">
                  <div className="flex flex-wrap items-center gap-1 font-mono text-[9.5px]">
                    {proj.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-1.5 py-0.2 bg-[#141820] text-[#94a3b8] border border-[#252f44] rounded-[2px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-[#55637a] pt-1">
                    <span className="text-[#38bdf8] font-bold">{proj.version}</span>
                    <span className="group-hover:text-[#00d4c8] flex items-center gap-0.5 font-bold transition-colors">
                      VIEW WORKSPACE <ArrowUpRight size={11} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TAB CONTENT 2: SKILLS & ARCHITECTURE ────────────────────── */}
      {activeTab === 'skills' && (
        <section className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Backend Architecture */}
            <div className="p-5 bg-[#101318] border border-[#1e2330] rounded-[4px] space-y-3">
              <div className="flex items-center gap-2 text-[#00d4c8] font-mono text-sm font-bold">
                <Server size={18} />
                <span>BACKEND ARCHITECTURE</span>
              </div>
              <p className="text-xs text-[#7a8899]">
                High-throughput, asynchronous, and robust backend engineering with atomic transactional safety.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                {['Python 3.12', 'Django 5', 'Django REST Framework', 'Waitress WSGI', 'FastAPI', 'Celery', 'Redis', 'Gunicorn', 'WebSockets'].map(s => (
                  <span key={s} className="px-2 py-1 bg-[#141820] text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Database & Data Integrity */}
            <div className="p-5 bg-[#101318] border border-[#1e2330] rounded-[4px] space-y-3">
              <div className="flex items-center gap-2 text-[#10b981] font-mono text-sm font-bold">
                <Database size={18} />
                <span>DATABASE & RELIABILITY</span>
              </div>
              <p className="text-xs text-[#7a8899]">
                High-volume schema design, indexing, partitioning, ACID compliance, and zero-downtime migrations.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                {['PostgreSQL 16', 'Query Optimization', 'Index Tuning (B-Tree/GIN)', 'CTEs & Stored Procedures', 'Automated Daily Backups', 'Connection Pooling (PgBouncer)'].map(s => (
                  <span key={s} className="px-2 py-1 bg-[#141820] text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Mobile & Flutter Engineering */}
            <div className="p-5 bg-[#101318] border border-[#1e2330] rounded-[4px] space-y-3">
              <div className="flex items-center gap-2 text-[#38bdf8] font-mono text-sm font-bold">
                <Smartphone size={18} />
                <span>MOBILE & FLUTTER</span>
              </div>
              <p className="text-xs text-[#7a8899]">
                Cross-platform Android and iOS applications with offline-first data caching and hardware camera integration.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                {['Flutter 3.x', 'Dart', 'Barcode & QR Scanning', 'Haptic Feedback', 'Offline SQLite Sync', 'Provider / Bloc', 'Native Android Plugins'].map(s => (
                  <span key={s} className="px-2 py-1 bg-[#141820] text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Integrations & Copilots */}
            <div className="p-5 bg-[#101318] border border-[#1e2330] rounded-[4px] space-y-3">
              <div className="flex items-center gap-2 text-[#c084fc] font-mono text-sm font-bold">
                <Bot size={18} />
                <span>AI & COPILOT WORKFLOWS</span>
              </div>
              <p className="text-xs text-[#7a8899]">
                Integrating LLMs (Grok, OpenAI GPT-4o, Claude) into workflow automation and intelligent code development.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                {['xAI Grok 2', 'OpenAI GPT-4o', 'Claude 3.5 Sonnet', 'Prompt Engineering', 'Streaming APIs', 'Code Scaffolding', 'Document Intelligence'].map(s => (
                  <span key={s} className="px-2 py-1 bg-[#141820] text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Frontend & Modern Web */}
            <div className="p-5 bg-[#101318] border border-[#1e2330] rounded-[4px] space-y-3">
              <div className="flex items-center gap-2 text-[#fbbf24] font-mono text-sm font-bold">
                <Code2 size={18} />
                <span>FRONTEND & COMMAND UI</span>
              </div>
              <p className="text-xs text-[#7a8899]">
                Ultra-responsive, high-density developer consoles, telemetry charts, and mission-control portals.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                {['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'HTML5/Canvas', 'State Management'].map(s => (
                  <span key={s} className="px-2 py-1 bg-[#141820] text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Enterprise Operations & Logistics */}
            <div className="p-5 bg-[#101318] border border-[#1e2330] rounded-[4px] space-y-3">
              <div className="flex items-center gap-2 text-[#f43f5e] font-mono text-sm font-bold">
                <Shield size={18} />
                <span>ENTERPRISE LOGISTICS</span>
              </div>
              <p className="text-xs text-[#7a8899]">
                Domain expertise in airport store operations, aviation calibration cycles, parts serialization, and material auditing.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                {['UUDS Airport Stores', 'Aviation MRO Standards', 'Batch Lifecycle Tracking', 'Warehouse Bin Allocation', 'Calibration Alerts', 'Operator Audit Logs'].map(s => (
                  <span key={s} className="px-2 py-1 bg-[#141820] text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TAB CONTENT 4: OPERATOR CONSOLE AUTH ────────────────────── */}
      {activeTab === 'auth' && (
        <section className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-8 flex items-center justify-center">
          <div className="w-full bg-[#101318] border border-[#252c3a] rounded-[4px] shadow-2xl overflow-hidden font-mono">
            <div className="px-5 py-3.5 bg-[#0d1017] border-b border-[#1e2330] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#00d4c8] font-bold">
                <Shield size={14} />
                <span>OPERATOR CONSOLE ACCESS</span>
              </div>
              <span className="text-[10px] text-[#10b981] font-bold">ENCRYPTED TLS 1.3</span>
            </div>

            <div className="p-6 space-y-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-black text-xs rounded-[3px] flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,212,200,0.35)] cursor-pointer"
              >
                <Zap size={15} className="fill-black" />
                <span>1-CLICK INSTANT START (BYPASS)</span>
                <ChevronRight size={15} />
              </button>

              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-px bg-[#1e2330]" />
                <span className="text-[9px] text-[#55637a] uppercase">OR LOGIN WITH USERNAME</span>
                <div className="flex-1 h-px bg-[#1e2330]" />
              </div>

              <form onSubmit={handleLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#7a8899] text-[10px] uppercase font-bold mb-1">
                    OPERATOR ID / USERNAME
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#141820] text-xs text-[#dce4f0] px-3 py-2 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block text-[#7a8899] text-[10px] uppercase font-bold mb-1">
                    ACCESS KEY / PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#141820] text-xs text-[#dce4f0] px-3 py-2 pr-10 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
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

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-[#182232] hover:bg-[#202c40] text-[#00d4c8] border border-[#00d4c850] font-bold text-xs rounded-[2px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER'}
                </button>
              </form>

              <div className="p-2.5 bg-[#0a0c10] border border-[#1e2330] rounded-[2px] text-[10px] text-[#7a8899] space-y-1">
                <div className="flex items-center gap-1.5 text-[#00d4c8] font-bold">
                  <KeyRound size={11} /> PRE-CONFIGURED CREDENTIALS:
                </div>
                <div className="flex justify-between">
                  <span>User: <code className="text-[#dce4f0]">khurram.munir</code></span>
                  <span>Pass: <code className="text-[#dce4f0]">devhub2026</code></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer
        className={`w-full px-4 sm:px-8 py-6 border-t mt-auto font-mono text-xs ${
          isLight ? 'bg-[#ffffff] border-[#e2e8f0]' : 'bg-[#0a0c10] border-[#1a1f2c]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#7a8899]">
            <span className="font-bold text-[#dce4f0]">Khurram Munir Basra</span>
            <span>•</span>
            <span>Lead Full Stack Architect & Systems Engineer</span>
          </div>

          <div className="flex items-center gap-4 text-[#55637a] text-[11px]">
            <span>NODE: DXB_STORES_PRODUCTION</span>
            <span>BUILD: v2.4.0 PRO</span>
            <span className="text-[#10b981] font-bold">100% OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
