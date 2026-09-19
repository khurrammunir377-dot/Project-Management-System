import React from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggleBtn: React.FC = () => {
  const { theme, setTheme } = useDevHub();
  const isLight = theme === 'light-pro';

  const toggleTheme = () => {
    if (isLight) {
      // Switch back to default cyber-teal or previous dark theme
      setTheme('cyber-teal');
    } else {
      setTheme('light-pro');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] border font-mono text-xs font-semibold transition-all select-none group ${
        isLight
          ? 'bg-[#ffffff] hover:bg-[#f1f5f9] border-[#cbd5e1] text-[#0f172a] shadow-sm'
          : 'bg-[#121622] hover:bg-[#182030] border-[#1f2638] hover:border-[#00d4c840] text-[#dce4f0]'
      }`}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {isLight ? (
        <>
          <Sun size={14} className="text-[#f59e0b] animate-spin-slow" />
          <span className="text-[11px] font-bold text-[#d97706]">LIGHT</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-[#38bdf8] group-hover:text-[#00d4c8]" />
          <span className="text-[11px] font-bold text-[#94a3b8] group-hover:text-[#dce4f0]">DARK</span>
        </>
      )}
    </button>
  );
};
export default ThemeToggleBtn;
