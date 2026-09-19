import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, Command, Menu, ChevronDown, Check, ShieldAlert, FolderGit2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDevHub } from '@/context/DevHubContext';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import ThemeToggleBtn from '../ui/ThemeToggleBtn';

interface TopBarProps {
  onToggleMobile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    projects, tasks, bugs,
    activeProjectId, setActiveProjectId, activeProject,
    openModal
  } = useDevHub();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const projectSwitchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Determine current active target based on route or selected state
  const isProjectRoute = location.pathname.startsWith('/projects/');
  const routeProjectId = isProjectRoute ? location.pathname.split('/projects/')[1]?.split('/')[0] : null;
  const currentDisplayedProject = routeProjectId
    ? projects.find(p => p.id === routeProjectId) || activeProject
    : activeProject;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setQuickAddOpen(false);
      }
      if (projectSwitchRef.current && !projectSwitchRef.current.contains(e.target as Node)) {
        setProjectSwitcherOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search filters
  const filteredProjects = searchQuery.trim()
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.accountEmail && p.accountEmail.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredTasks = searchQuery.trim()
    ? tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredBugs = searchQuery.trim()
    ? bugs.filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="h-14 bg-[#0d1017] border-b border-[#1a1f2c] flex items-center justify-between px-3 sm:px-4 gap-2 z-30 select-none">
      {/* ── LEFT: Mobile Menu & Dynamic Target Project Switcher ── */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-1.5 text-[#7a8899] hover:text-[#dce4f0] bg-[#141824] border border-[#1e2535] rounded-[2px]"
          title="Toggle Navigation"
        >
          <Menu size={16} />
        </button>

        {/* Dynamic Project Target Dropdown Switcher */}
        <div ref={projectSwitchRef} className="relative">
          <button
            type="button"
            onClick={() => setProjectSwitcherOpen(!projectSwitcherOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#10141c] hover:bg-[#151a24] border border-[#1e2535] hover:border-[#00d4c840] rounded-[2px] transition-colors group"
            title="Click to switch active project focus"
          >
            <span className="w-2 h-2 rounded-full bg-[#00d4c8] shadow-[0_0_8px_#00d4c8] animate-pulse flex-shrink-0" />
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#55637a] font-medium hidden md:inline">
              TARGET:
            </span>
            <span className="font-mono text-xs font-semibold text-[#dce4f0] group-hover:text-[#00d4c8] truncate max-w-[140px] sm:max-w-[210px]">
              {currentDisplayedProject ? currentDisplayedProject.name : 'ALL 31 PROJECTS'}
            </span>
            {currentDisplayedProject && (
              <span className="font-mono text-[10px] text-[#00d4c8] bg-[#00d4c815] px-1 py-0.2 rounded-[2px] border border-[#00d4c830] hidden sm:inline font-bold">
                {currentDisplayedProject.version}
              </span>
            )}
            <ChevronDown size={11} className="text-[#55637a] group-hover:text-[#00d4c8]" />
          </button>

          {/* Project Switcher Dropdown */}
          {projectSwitcherOpen && (
            <div className="absolute left-0 top-full mt-1 w-72 bg-[#10141e] border border-[#252f44] rounded-[2px] shadow-[0_10px_25px_rgba(0,0,0,0.85)] z-50 py-1 font-mono text-xs max-h-80 overflow-y-auto">
              <div className="px-2.5 py-1 text-[9.5px] uppercase text-[#55637a] tracking-wider border-b border-[#1a2130]">
                SWITCH WORKSPACE TARGET ({projects.length} PROJECTS)
              </div>
              <button
                onClick={() => {
                  setActiveProjectId(null);
                  setProjectSwitcherOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full px-2.5 py-1.5 text-left text-[#dce4f0] hover:bg-[#1a2130] hover:text-[#00d4c8] flex items-center justify-between transition-colors border-b border-[#1a2130]"
              >
                <span>🌐 ALL PROJECTS (GLOBAL CONSOLE)</span>
                {!activeProjectId && <Check size={12} className="text-[#00d4c8]" />}
              </button>

              {projects.map((p) => {
                const isSelected = (currentDisplayedProject?.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      setProjectSwitcherOpen(false);
                      navigate(`/projects/${p.id}`);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#00d4c810] text-[#00d4c8] font-bold'
                        : 'text-[#dce4f0] hover:bg-[#1a2130] hover:text-[#00d4c8]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[10px] text-[#55637a]">{p.shortCode}</span>
                      <span className="truncate">{p.name}</span>
                    </div>
                    {isSelected && <Check size={12} className="text-[#00d4c8] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── CENTER: Global Command & File Search ── */}
      <div ref={searchRef} className="relative flex-1 max-w-xl mx-2">
        <div className="relative flex items-center">
          <Search
            size={14}
            className="absolute left-3 text-[#55637a] pointer-events-none"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search all 31 projects, repos, accounts, stack, bugs..."
            className="w-full bg-[#121622] hover:bg-[#151a28] focus:bg-[#151a28] text-xs font-mono text-[#dce4f0] placeholder-[#475569] pl-9 pr-14 py-1.5 border border-[#1f2638] focus:border-[#00d4c8] rounded-[2px] outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
          />
          <div className="absolute right-2 hidden sm:flex items-center gap-0.5 px-1 py-0.5 bg-[#1b2233] border border-[#27324b] rounded-[2px] pointer-events-none">
            <Command size={10} className="text-[#55637a]" />
            <span className="font-mono text-[9px] text-[#55637a]">K</span>
          </div>
        </div>

        {/* Global Search Results Dropdown */}
        {searchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#10141e] border border-[#252f44] rounded-[2px] shadow-[0_10px_25px_rgba(0,0,0,0.85)] z-50 max-h-80 overflow-y-auto divide-y divide-[#1a2130]">
            {filteredProjects.length > 0 && (
              <div className="p-2">
                <div className="font-mono text-[9px] uppercase tracking-widest text-[#55637a] mb-1 px-1">
                  Projects ({filteredProjects.length})
                </div>
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      navigate(`/projects/${p.id}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-1.5 hover:bg-[#1a2130] rounded-[2px] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] font-bold text-[#00d4c8] bg-[#00d4c810] px-1 border border-[#00d4c830] flex-shrink-0">
                        {p.shortCode}
                      </span>
                      <span className="font-mono text-xs text-[#dce4f0] group-hover:text-[#00d4c8] truncate">
                        {p.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#6b7b94] flex-shrink-0 ml-2">{p.version}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredTasks.length > 0 && (
              <div className="p-2">
                <div className="font-mono text-[9px] uppercase tracking-widest text-[#55637a] mb-1 px-1">
                  Tasks ({filteredTasks.length})
                </div>
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      navigate('/tasks');
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-1.5 hover:bg-[#1a2130] rounded-[2px] text-left transition-colors"
                  >
                    <span className="text-xs text-[#dce4f0] truncate">{t.title}</span>
                    <span className="font-mono text-[10px] text-[#fbbf24]">{t.status}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredBugs.length > 0 && (
              <div className="p-2">
                <div className="font-mono text-[9px] uppercase tracking-widest text-[#55637a] mb-1 px-1">
                  Bugs ({filteredBugs.length})
                </div>
                {filteredBugs.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      navigate('/bugs');
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-1.5 hover:bg-[#1a2130] rounded-[2px] text-left transition-colors"
                  >
                    <span className="text-xs text-[#dce4f0] truncate">{b.title}</span>
                    <span className="font-mono text-[10px] text-[#f87171]">{b.severity}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredProjects.length === 0 && filteredTasks.length === 0 && filteredBugs.length === 0 && (
              <div className="p-4 text-center font-mono text-xs text-[#55637a]">
                NO MATCHING RECORDS FOUND
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── RIGHT: Theme Toggle (Light/Dark), Theme Switcher, Quick Actions, Profile ── */}
      <div className="flex items-center gap-2">
        {/* Direct 1-Click Light / Dark Mode Toggle */}
        <ThemeToggleBtn />

        {/* 6-Theme Color Palettes Switcher */}
        <ThemeSwitcher />

        {/* Quick Add Menu */}
        <div ref={quickAddRef} className="relative">
          <button
            type="button"
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#00d4c815] hover:bg-[#00d4c825] border border-[#00d4c850] text-[#00d4c8] rounded-[2px] font-mono text-xs font-semibold tracking-wide transition-all shadow-[0_0_8px_rgba(0,212,200,0.1)]"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">QUICK ADD</span>
            <ChevronDown size={11} />
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-[#10141e] border border-[#252f44] rounded-[2px] shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-50 py-1 font-mono text-xs">
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  openModal('project');
                }}
                className="w-full px-3 py-1.5 text-left text-[#dce4f0] hover:bg-[#1a2130] hover:text-[#00d4c8] flex items-center gap-2"
              >
                + New Project
              </button>
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  openModal('task');
                }}
                className="w-full px-3 py-1.5 text-left text-[#dce4f0] hover:bg-[#1a2130] hover:text-[#fbbf24] flex items-center gap-2"
              >
                + Add Task
              </button>
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  openModal('bug');
                }}
                className="w-full px-3 py-1.5 text-left text-[#dce4f0] hover:bg-[#1a2130] hover:text-[#f87171] flex items-center gap-2"
              >
                + Report Defect / Bug
              </button>
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  openModal('member');
                }}
                className="w-full px-3 py-1.5 text-left text-[#dce4f0] hover:bg-[#1a2130] hover:text-[#00d4c8] flex items-center gap-2"
              >
                + Add Team Member
              </button>
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  openModal('idea');
                }}
                className="w-full px-3 py-1.5 text-left text-[#dce4f0] hover:bg-[#1a2130] hover:text-[#c084fc] flex items-center gap-2"
              >
                + Log Idea / Proposal
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 text-[#7a8899] hover:text-[#dce4f0] bg-[#121622] hover:bg-[#151a28] border border-[#1f2638] rounded-[2px] transition-colors relative"
            title="Notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#f87171] rounded-full shadow-[0_0_4px_#f87171]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-[#10141e] border border-[#252f44] rounded-[2px] shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-50 p-2 font-mono">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#1a2130] text-[10px] text-[#55637a] tracking-widest uppercase">
                <span>SYSTEM ALERTS</span>
                <span className="text-[#00d4c8]">3 UNREAD</span>
              </div>
              <div className="space-y-1 text-xs">
                <div
                  onClick={() => { navigate('/bugs'); setNotificationsOpen(false); }}
                  className="p-1.5 bg-[#161b26] hover:bg-[#1c2230] rounded-[2px] text-[#dce4f0] border-l-2 border-[#f87171] cursor-pointer"
                >
                  <div className="text-[11px] font-semibold text-[#f87171]">Bug #b1 Reported</div>
                  <div className="text-[10px] text-[#7a8899]">QMS DWC PDF report timeout</div>
                </div>
                <div
                  onClick={() => { navigate('/tasks'); setNotificationsOpen(false); }}
                  className="p-1.5 bg-[#161b26] hover:bg-[#1c2230] rounded-[2px] text-[#dce4f0] border-l-2 border-[#fbbf24] cursor-pointer"
                >
                  <div className="text-[11px] font-semibold text-[#fbbf24]">Deployment Scheduled</div>
                  <div className="text-[10px] text-[#7a8899]">Auto Barcode Generator September milestone</div>
                </div>
                <div
                  onClick={() => { navigate('/releases'); setNotificationsOpen(false); }}
                  className="p-1.5 bg-[#161b26] hover:bg-[#1c2230] rounded-[2px] text-[#dce4f0] border-l-2 border-[#34d399] cursor-pointer"
                >
                  <div className="text-[11px] font-semibold text-[#34d399]">Release Deployed</div>
                  <div className="text-[10px] text-[#7a8899]">Material Management System v3.2 is Live</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          onClick={() => navigate('/team')}
          className="flex items-center gap-2 pl-2 border-l border-[#1f2638] cursor-pointer group"
          title="Khurram Munir (Lead Architect & SuperAdmin)"
        >
          <div className="w-7 h-7 rounded-[2px] bg-[#141d2d] border border-[#00d4c8] flex items-center justify-center font-mono text-[11px] font-bold text-[#00d4c8] shadow-[0_0_8px_rgba(0,212,200,0.15)] group-hover:bg-[#00d4c820] transition-colors">
            KM
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-mono text-xs font-semibold text-[#dce4f0] leading-none group-hover:text-[#00d4c8]">
              K. MUNIR
            </span>
            <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider mt-0.5">
              SUPERADMIN
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default TopBar;
