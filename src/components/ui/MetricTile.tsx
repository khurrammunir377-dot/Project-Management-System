import React from 'react';
import clsx from 'clsx';

interface MetricTileProps {
  label: string;
  value: number | string;
  accentColor?: string;
  accent?: string;
  subValue?: string;
  statusDot?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  accentColor,
  accent,
  subValue,
  statusDot,
  icon,
  onClick,
  active = false,
}) => {
  const color = accent || accentColor || '#00d4c8';

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex flex-col justify-between p-2.5 sm:p-3 text-left transition-all border rounded-[2px] min-w-[110px] flex-1 select-none',
        active
          ? 'bg-[#1a2130] border-[#00d4c8] shadow-[0_0_12px_rgba(0,212,200,0.15)]'
          : 'bg-[#10141c] hover:bg-[#151a24] border-[#1e2535] hover:border-[#2d374d]'
      )}
    >
      <div className="flex items-center justify-between gap-1.5 mb-1">
        <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#7a8899] font-medium truncate">
          {label}
        </span>
        {icon ? (
          <div className="opacity-80">{icon}</div>
        ) : statusDot ? (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: statusDot,
              boxShadow: `0 0 6px ${statusDot}`,
            }}
          />
        ) : null}
      </div>

      <div className="flex items-baseline justify-between gap-1">
        <span
          className="font-mono text-xl sm:text-2xl font-bold tracking-tight"
          style={{ color: active ? '#00d4c8' : color }}
        >
          {value}
        </span>
        {subValue && (
          <span className="font-mono text-[10px] text-[#55637a] tracking-wider">
            {subValue}
          </span>
        )}
      </div>
    </button>
  );
};
export default MetricTile;
