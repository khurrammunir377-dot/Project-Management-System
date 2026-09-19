import React from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useDevHub();
  const isLight = theme === 'light-pro';

  const handleToggle = () => {
    if (isLight) {
      setTheme('cyber-teal');
    } else {
      setTheme('light-pro');
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-[4px] font-mono text-xs font-bold transition-all duration-200 border select-none group shadow-sm ${
        isLight
          ? 'bg-[#ffffff] hover:bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a]'
          : 'bg-[#121622] hover:bg-[#182030] border-[#1f2638] hover:border-[#00d4c860] text-[#dce4f0]'
      }`}
      title={isLight ? 'Click to switch to Dark Mode' : 'Click to switch to Light Mode'}
    >
      {/* Sliding Toggle Capsule Pill */}
      <div
        className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors duration-200 ${
          isLight ? 'bg-[#e2e8f0] justify-end' : 'bg-[#1a2333] justify-start'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center transition-all transform shadow-sm ${
            isLight
              ? 'bg-[#f59e0b] text-white shadow-[0_0_8px_#f59e0b]'
              : 'bg-[#00d4c8] text-black shadow-[0_0_8px_#00d4c8]'
          }`}
        >
          {isLight ? <Sun size={10} className="stroke-[2.5]" /> : <Moon size={10} className="stroke-[2.5]" />}
        </div>
      </div>

      {/* Mode Label */}
      <span className="text-[11px] uppercase tracking-wider font-extrabold flex items-center gap-1">
        {isLight ? (
          <span className="text-[#d97706]">LIGHT</span>
        ) : (
          <span className="text-[#00d4c8]">DARK</span>
        )}
      </span>
    </button>
  );
};
export default ThemeSwitcher;
