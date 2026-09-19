import React from 'react';

interface DevHubLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  collapsed?: boolean;
  showSubtitle?: boolean;
}

export const DevHubLogo: React.FC<DevHubLogoProps> = ({
  size = 'md',
  collapsed = false,
  showSubtitle = true,
}) => {
  const iconConfig = {
    sm: { box: 'w-7 h-7', size: 20 },
    md: { box: 'w-8 h-8', size: 24 },
    lg: { box: 'w-10 h-10', size: 30 },
    xl: { box: 'w-14 h-14', size: 44 },
  };

  const { box, size: svgSize } = iconConfig[size] || iconConfig.md;

  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      {/* ── HIGH-END ENGINEERING COMMAND EMBLEM ──────────────────────── */}
      <div
        className={`relative flex items-center justify-center flex-shrink-0 ${box} rounded-[4px] bg-gradient-to-br from-[#121927] via-[#0d121c] to-[#080b12] border border-[#00d4c860] shadow-[0_0_15px_rgba(0,212,200,0.2)] group-hover:border-[#00d4c8] group-hover:shadow-[0_0_22px_rgba(0,212,200,0.4)] transition-all duration-300`}
      >
        {/* Glow ambient background aura */}
        <div className="absolute inset-0 bg-[#00d4c8] opacity-10 blur-sm rounded-[4px] pointer-events-none group-hover:opacity-20 transition-opacity" />

        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_0_4px_rgba(0,212,200,0.5)]"
        >
          <defs>
            <linearGradient id="cyberGradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00d4c8" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="innerCoreGradient" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00ffcc" />
              <stop offset="100%" stopColor="#0088ff" />
            </linearGradient>
          </defs>

          {/* Outer Shield / Hexagonal Isometric Command Structure */}
          <path
            d="M24 4L42 14.5V33.5L24 44L6 33.5V14.5L24 4Z"
            stroke="url(#cyberGradient)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="group-hover:stroke-[#00ffcc] transition-colors"
          />

          {/* Isometric Inner Grid Ribs */}
          <path
            d="M24 4V24M42 14.5L24 24M6 14.5L24 24"
            stroke="#00d4c8"
            strokeWidth="1.75"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />

          {/* Lower Isometric Facets */}
          <path
            d="M24 24V44M24 24L42 33.5M24 24L6 33.5"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeOpacity="0.45"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />

          {/* Central Nexus Diamond / Core Processor */}
          <polygon
            points="24,17 31,24 24,31 17,24"
            fill="url(#innerCoreGradient)"
            className="animate-pulse"
          />
          <circle cx="24" cy="24" r="2.5" fill="#ffffff" />

          {/* Corner Quantum Nodes */}
          <circle cx="24" cy="4" r="2" fill="#00d4c8" />
          <circle cx="42" cy="14.5" r="2" fill="#38bdf8" />
          <circle cx="42" cy="33.5" r="2" fill="#818cf8" />
          <circle cx="24" cy="44" r="2" fill="#00d4c8" />
          <circle cx="6" cy="33.5" r="2" fill="#818cf8" />
          <circle cx="6" cy="14.5" r="2" fill="#38bdf8" />
        </svg>
      </div>

      {/* ── LOGO TYPOGRAPHY ─────────────────────────────────────────── */}
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-mono font-black tracking-[0.16em] text-[15px] text-[#f1f5f9] drop-shadow-sm">
              KMB<span className="text-[#00d4c8] font-black">DEVHUB</span>
            </span>
            <span className="font-mono text-[8px] font-bold text-[#00d4c8] bg-[#00d4c815] border border-[#00d4c840] px-1 py-0.2 rounded-[2px] leading-none uppercase">
              PRO
            </span>
          </div>
          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] tracking-[0.2em] text-[#64748b] uppercase leading-none font-semibold">
              <span>OPS CONSOLE</span>
              <span className="text-[#00d4c8]">/</span>
              <span className="text-[#38bdf8]">V2.4</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default DevHubLogo;
