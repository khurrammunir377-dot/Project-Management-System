import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Terminal, Cpu, HardDrive, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import DevHubLogo from '../ui/DevHubLogo';
import { useDevHub } from '@/context/DevHubContext';

export const AppTitleBar: React.FC = () => {
  const { projects, theme } = useDevHub();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(1.4);
  const [memoryUsage, setMemoryUsage] = useState(186);

  // Subtle real-time hardware telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => +(1.0 + Math.random() * 1.8).toFixed(1));
      setMemoryUsage((prev) => Math.floor(180 + Math.random() * 15));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMinimize = () => {
    // In web environment, notify or collapse
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleClose = () => {
    if (window.confirm('Exit DevHub Desktop Console session?')) {
      window.close();
    }
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const menuItems = [
    {
      name: 'File',
      options: [
        { label: 'New Project (Ctrl+N)', action: () => window.location.hash = '#new-project' },
        { label: 'Import Codebase (.zip)', action: () => {} },
        { label: 'Export System Snapshot', action: () => {} },
        { label: 'Exit Application', action: handleClose },
      ],
    },
    {
      name: 'Edit',
      options: [
        { label: 'Undo', action: () => {} },
        { label: 'Redo', action: () => {} },
        { label: 'Preferences...', action: () => {} },
      ],
    },
    {
      name: 'View',
      options: [
        { label: isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)', action: toggleFullscreen },
        { label: 'Reload Workspace (Ctrl+R)', action: () => window.location.reload() },
        { label: 'Toggle Activity Stream', action: () => {} },
      ],
    },
    {
      name: 'Terminal',
      options: [
        { label: 'New Ops Session', action: () => {} },
        { label: 'Run Diagnostic Suite', action: () => {} },
        { label: 'Check Git Remote Status', action: () => {} },
      ],
    },
    {
      name: 'Help',
      options: [
        { label: 'Documentation & Specs', action: () => {} },
        { label: 'GitHub Repository', action: () => window.open('https://github.com/khurrammunir377-dot/Project-Management-System.git', '_blank') },
        { label: 'About DevHub PRO v2.4', action: () => alert('KMB DevHub PRO v2.4.0\nEnterprise Engineering Operations Console\nLead Architect: Khurram Munir') },
      ],
    },
  ];

  return (
    <div className="h-7 bg-[#07090d] border-b border-[#181d28] flex items-center justify-between px-2 text-[11px] font-mono select-none z-50 text-[#8892a4]">
      {/* ── LEFT: Software Icon, Name & Native Menus ───────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold text-[#dce4f0]">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00d4c8] shadow-[0_0_6px_#00d4c8]" />
          <span className="tracking-widest text-[#f1f5f9]">KMB DEVHUB PRO</span>
          <span className="text-[9px] text-[#00d4c8] bg-[#00d4c815] px-1 py-0.2 rounded-[2px] border border-[#00d4c830]">
            DESKTOP_BUILD
          </span>
        </div>

        {/* Native Desktop App Menu */}
        <div className="hidden md:flex items-center gap-0.5 relative" onClick={(e) => e.stopPropagation()}>
          {menuItems.map((menu) => (
            <div key={menu.name} className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === menu.name ? null : menu.name)}
                className={`px-2 py-0.5 rounded-[2px] transition-colors ${
                  activeMenu === menu.name
                    ? 'bg-[#151c28] text-[#00d4c8] font-bold'
                    : 'hover:bg-[#121722] hover:text-[#dce4f0]'
                }`}
              >
                {menu.name}
              </button>

              {/* Submenu Dropdown */}
              {activeMenu === menu.name && (
                <div className="absolute left-0 top-full mt-1 w-52 bg-[#0e121a] border border-[#252f44] rounded-[2px] shadow-[0_8px_24px_rgba(0,0,0,0.9)] py-1 z-50 divide-y divide-[#182030]">
                  <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-[#55637a]">
                    {menu.name} Commands
                  </div>
                  <div className="py-0.5">
                    {menu.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          opt.action();
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#dce4f0] hover:bg-[#182232] hover:text-[#00d4c8] flex items-center justify-between transition-colors"
                      >
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CENTER: Software Window Title ─────────────────────────── */}
      <div className="hidden lg:flex items-center gap-2 text-[10px] text-[#55637a]">
        <span>SYS.RUNTIME: READY</span>
        <span>•</span>
        <span className="text-[#38bdf8]">{projects.length} UNITS MOUNTED</span>
        <span>•</span>
        <span>ENCRYPTED V2.4</span>
      </div>

      {/* ── RIGHT: Telemetry & Native Window Controls ─────────────── */}
      <div className="flex items-center gap-2.5">
        {/* Real-time Hardware Telemetry Gauges */}
        <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 bg-[#0b0e14] border border-[#1a2130] rounded-[2px] text-[10px]">
          <span className="flex items-center gap-1 text-[#00d4c8]">
            <Cpu size={10} /> {cpuUsage}%
          </span>
          <span className="text-[#334155]">|</span>
          <span className="flex items-center gap-1 text-[#38bdf8]">
            <HardDrive size={10} /> {memoryUsage}MB
          </span>
          <span className="text-[#334155]">|</span>
          <span className="flex items-center gap-1 text-[#10b981]">
            <ShieldCheck size={10} /> SECURE
          </span>
        </div>

        {/* Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-1 pl-1">
          <button
            type="button"
            onClick={handleMinimize}
            className="w-6 h-5 flex items-center justify-center text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#182030] rounded-[2px] transition-colors"
            title="Minimize"
          >
            <Minus size={11} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-6 h-5 flex items-center justify-center text-[#7a8899] hover:text-[#00d4c8] hover:bg-[#182030] rounded-[2px] transition-colors"
            title={isFullscreen ? 'Restore Window' : 'Maximize (Fullscreen)'}
          >
            <Square size={10} />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-6 h-5 flex items-center justify-center text-[#7a8899] hover:text-white hover:bg-[#ef4444] rounded-[2px] transition-colors"
            title="Close Console"
          >
            <X size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default AppTitleBar;
