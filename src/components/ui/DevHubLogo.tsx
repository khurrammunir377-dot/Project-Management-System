import React from 'react';

interface DevHubLogoProps {
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
}

export const DevHubLogo: React.FC<DevHubLogoProps> = ({ size = 'md', collapsed = false }) => {
  const iconSizes = {
    sm: { box: 'w-6 h-6', svg: 14 },
    md: { box: 'w-8 h-8', svg: 18 },
    lg: { box: 'w-10 h-10', svg: 22 },
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Terminal Bracket & Connected Nodes Icon */}
      <div
        className={`flex items-center justify-center flex-shrink-0 bg-[#00d4c810] border border-[#00d4c8] ${iconSizes[size].box} rounded-[2px] transition-all`}
        style={{ boxShadow: '0 0 10px rgba(0, 212, 200, 0.15)' }}
      >
        <svg
          width={iconSizes[size].svg}
          height={iconSizes[size].svg}
          viewBox="0 0 22 22"
          fill="none"
        >
          {/* Left bracket */}
          <path
            d="M6 4 L2 11 L6 18"
            stroke="#00d4c8"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right bracket */}
          <path
            d="M16 4 L20 11 L16 18"
            stroke="#00d4c8"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central core node */}
          <circle cx="11" cy="11" r="2.25" fill="#00d4c8" />
          {/* Vertical branch connections */}
          <line x1="11" y1="8.75" x2="11" y2="4.5" stroke="#00d4c880" strokeWidth="1.2" strokeDasharray="1 1" />
          <circle cx="11" cy="3.5" r="1.25" fill="#0a0c0f" stroke="#00d4c8" strokeWidth="1" />
          <line x1="11" y1="13.25" x2="11" y2="17.5" stroke="#00d4c880" strokeWidth="1.2" strokeDasharray="1 1" />
          <circle cx="11" cy="18.5" r="1.25" fill="#0a0c0f" stroke="#00d4c8" strokeWidth="1" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold tracking-[0.14em] text-sm text-[#dce4f0] leading-none">
              KMB<span className="text-[#00d4c8]">DEVHUB</span>
            </span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.18em] text-[#7a8899] uppercase leading-tight mt-0.5">
            Ops Console
          </span>
        </div>
      )}
    </div>
  );
};
export default DevHubLogo;
