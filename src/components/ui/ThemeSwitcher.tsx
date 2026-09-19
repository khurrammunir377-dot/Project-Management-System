import React, { useState, useRef, useEffect } from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { Sun, Moon, Check, Sparkles, ChevronDown } from 'lucide-react';
import { AppTheme } from '@/types';

interface ThemeOption {
  id: AppTheme;
  name: string;
  dotColor: string;
  tag: string;
  icon: 'sun' | 'moon';
  group: 'Light' | 'Dark';
}

const themeOptions: ThemeOption[] = [
  {
    id: 'light-pro',
    name: 'Light Console Pro',
    dotColor: '#0284c7',
    tag: 'Clean Daylight Precision',
    icon: 'sun',
    group: 'Light',
  },
  {
    id: 'cyber-teal',
    name: 'Cyber Teal (Default)',
    dotColor: '#00d4c8',
    tag: 'Graphite / Cyan Command',
    icon: 'moon',
    group: 'Dark',
  },
  {
    id: 'matrix-green',
    name: 'Matrix Terminal',
    dotColor: '#00ff66',
    tag: 'Phosphor Green Terminal',
    icon: 'moon',
    group: 'Dark',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    dotColor: '#f59e0b',
    tag: 'Tactical War Room',
    icon: 'moon',
    group: 'Dark',
  },
  {
    id: 'electric-cobalt',
    name: 'Electric Cobalt',
    dotColor: '#38bdf8',
    tag: 'Deep Midnight Blue',
    icon: 'moon',
    group: 'Dark',
  },
  {
    id: 'synthwave-purple',
    name: 'Synthwave Purple',
    dotColor: '#c084fc',
    tag: 'Neon Violet / Obsidian',
    icon: 'moon',
    group: 'Dark',
  },
];

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useDevHub();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeThemeObj = themeOptions.find((t) => t.id === theme) || themeOptions[1];
  const isLight = theme === 'light-pro';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative select-none">
      {/* ── Single Master Theme Button ────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] font-mono text-xs font-semibold transition-all border shadow-sm group ${
          isLight
            ? 'bg-[#ffffff] hover:bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a]'
            : 'bg-[#121622] hover:bg-[#182030] border-[#1f2638] hover:border-[#00d4c850] text-[#dce4f0]'
        }`}
        title="Change App Theme & Mode (Light / Dark)"
      >
        {/* Active Mode Icon (Sun for Light, Glowing Colored Dot for Dark) */}
        {isLight ? (
          <Sun size={14} className="text-[#f59e0b] flex-shrink-0 animate-spin-slow" />
        ) : (
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: activeThemeObj.dotColor,
              boxShadow: `0 0 8px ${activeThemeObj.dotColor}`,
            }}
          />
        )}

        <span className="hidden sm:inline font-bold">
          {activeThemeObj.name.split(' (')[0]}
        </span>

        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${
            open ? 'rotate-180 text-[#00d4c8]' : 'text-[#7a8899] group-hover:text-[#dce4f0]'
          }`}
        />
      </button>

      {/* ── All-In-One Theme & Light/Dark Palette Menu ──────────────── */}
      {open && (
        <div
          className={`absolute right-0 top-full mt-1.5 w-72 rounded-[2px] border shadow-[0_12px_36px_rgba(0,0,0,0.9)] z-50 py-1 font-mono text-xs divide-y ${
            isLight
              ? 'bg-[#ffffff] border-[#cbd5e1] divide-[#f1f5f9]'
              : 'bg-[#10141e] border-[#252f44] divide-[#182030]'
          }`}
        >
          <div
            className={`px-3 py-1.5 text-[9.5px] uppercase tracking-widest flex items-center justify-between font-bold ${
              isLight ? 'text-[#64748b] bg-[#f8fafc]' : 'text-[#55637a] bg-[#0c0f17]'
            }`}
          >
            <span>SELECT THEME / MODE</span>
            <span className="text-[#00d4c8]">{themeOptions.length} OPTIONS</span>
          </div>

          <div className="p-1 space-y-1">
            {themeOptions.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectTheme(opt.id)}
                  className={`w-full px-2.5 py-2 text-left rounded-[2px] flex items-center justify-between transition-all border ${
                    isSelected
                      ? isLight
                        ? 'bg-[#e0f2fe] border-[#0284c7] text-[#0284c7] font-bold shadow-sm'
                        : 'bg-[#182030] border-[#00d4c850] shadow-[0_0_10px_rgba(0,212,200,0.15)] font-bold'
                      : isLight
                      ? 'hover:bg-[#f1f5f9] border-transparent text-[#334155]'
                      : 'hover:bg-[#141824] border-transparent text-[#dce4f0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {opt.icon === 'sun' ? (
                      <div className="w-5 h-5 rounded-full bg-[#fef3c7] border border-[#f59e0b] flex items-center justify-center flex-shrink-0">
                        <Sun size={11} className="text-[#f59e0b]" />
                      </div>
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: opt.dotColor }}
                      >
                        {isSelected && <Check size={11} className="text-black stroke-[3]" />}
                      </div>
                    )}

                    <div>
                      <div
                        className="text-xs font-bold"
                        style={{
                          color: isSelected ? opt.dotColor : isLight ? '#0f172a' : '#dce4f0',
                        }}
                      >
                        {opt.name}
                      </div>
                      <div
                        className={`text-[9.5px] ${
                          isLight ? 'text-[#64748b]' : 'text-[#6b7b94]'
                        }`}
                      >
                        {opt.tag}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] border flex-shrink-0"
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
