import React, { useState, useRef, useEffect } from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { Palette, Check, Sun, Moon } from 'lucide-react';
import { AppTheme } from '@/types';

interface ThemeOption {
  id: AppTheme;
  name: string;
  dotColor: string;
  bgPreview: string;
  tag: string;
  isLight?: boolean;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'cyber-teal',
    name: 'Cyber Teal',
    dotColor: '#00d4c8',
    bgPreview: '#0a0c0f',
    tag: 'Graphite / Cyan (Dark)',
  },
  {
    id: 'matrix-green',
    name: 'Matrix Terminal',
    dotColor: '#00ff66',
    bgPreview: '#040805',
    tag: 'Phosphor Green (Dark)',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    dotColor: '#f59e0b',
    bgPreview: '#0a0805',
    tag: 'War Room Tactical (Dark)',
  },
  {
    id: 'electric-cobalt',
    name: 'Electric Cobalt',
    dotColor: '#38bdf8',
    bgPreview: '#060a14',
    tag: 'Midnight Blue (Dark)',
  },
  {
    id: 'synthwave-purple',
    name: 'Synthwave Purple',
    dotColor: '#c084fc',
    bgPreview: '#0a0614',
    tag: 'Neon Violet (Dark)',
  },
  {
    id: 'light-pro',
    name: 'Light Console Pro',
    dotColor: '#0284c7',
    bgPreview: '#f8fafc',
    tag: 'Clean Precision (Light)',
    isLight: true,
  },
];

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useDevHub();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeThemeObj = themeOptions.find((t) => t.id === theme) || themeOptions[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative select-none">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#121622] hover:bg-[#151a28] border border-[#1f2638] hover:border-[#00d4c840] rounded-[2px] font-mono text-xs text-[#dce4f0] transition-all group"
        title="Switch Console Color Theme (6 Themes + Light Mode)"
      >
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
          style={{
            backgroundColor: activeThemeObj.dotColor,
            boxShadow: `0 0 8px ${activeThemeObj.dotColor}`,
          }}
        />
        <span className="hidden md:inline font-semibold">{activeThemeObj.name}</span>
        <Palette size={13} className="text-[#7a8899] group-hover:text-[#dce4f0]" />
      </button>

      {/* 6-Theme Selector Popover */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#10141e] border border-[#252f44] rounded-[2px] shadow-[0_10px_30px_rgba(0,0,0,0.85)] z-50 py-1.5 font-mono text-xs divide-y divide-[#1a2130]">
          <div className="px-3 py-1.5 text-[9.5px] uppercase tracking-widest text-[#55637a] flex items-center justify-between">
            <span>ENGINEERING THEMES</span>
            <span className="text-[#00d4c8]">LIGHT / DARK</span>
          </div>

          <div className="p-1 space-y-1">
            {themeOptions.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full px-2.5 py-2 text-left rounded-[2px] flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#182030] border border-[#00d4c840] shadow-[0_0_8px_rgba(0,212,200,0.15)]'
                      : 'hover:bg-[#141824] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: opt.dotColor }}
                    >
                      {isSelected && <Check size={10} className="text-black stroke-[3]" />}
                    </div>
                    <div>
                      <div
                        className="text-xs font-bold flex items-center gap-1.5"
                        style={{ color: isSelected ? opt.dotColor : '#dce4f0' }}
                      >
                        <span>{opt.name}</span>
                        {opt.isLight ? <Sun size={10} className="text-[#f59e0b]" /> : <Moon size={10} className="text-[#38bdf8]" />}
                      </div>
                      <div className="text-[9.5px] text-[#6b7b94]">{opt.tag}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] border"
                      style={{
                        color: opt.dotColor,
                        borderColor: `${opt.dotColor}40`,
                        backgroundColor: `${opt.dotColor}15`,
                      }}
                    >
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default ThemeSwitcher;
