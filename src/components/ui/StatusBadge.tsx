import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: string;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'xs',
  showLabel = true,
}) => {
  const norm = status?.toLowerCase() || '';

  // Determine status color configuration
  let dotColor = '#6b7280';
  let bgColor = 'rgba(107, 114, 128, 0.12)';
  let borderColor = 'rgba(107, 114, 128, 0.3)';
  let textColor = '#9ca3af';

  if (norm.includes('dev') || norm === 'in progress' || norm === 'in_progress') {
    dotColor = '#3b82f6';
    bgColor = 'rgba(59, 130, 246, 0.12)';
    borderColor = 'rgba(59, 130, 246, 0.35)';
    textColor = '#93c5fd';
  } else if (norm.includes('test') || norm === 'staging' || norm === 'under review' || norm === 'evaluated') {
    dotColor = '#f59e0b';
    bgColor = 'rgba(245, 158, 11, 0.12)';
    borderColor = 'rgba(245, 158, 11, 0.35)';
    textColor = '#fcd34d';
  } else if (norm.includes('prod') || norm === 'done' || norm === 'resolved' || norm === 'approved' || norm === 'accepted') {
    dotColor = '#10b981';
    bgColor = 'rgba(16, 185, 129, 0.12)';
    borderColor = 'rgba(16, 185, 129, 0.35)';
    textColor = '#6ee7b7';
  } else if (norm.includes('hold') || norm === 'blocked' || norm === 'declined' || norm === 'wont fix') {
    dotColor = '#94a3b8';
    bgColor = 'rgba(148, 163, 184, 0.12)';
    borderColor = 'rgba(148, 163, 184, 0.3)';
    textColor = '#cbd5e1';
  } else if (norm.includes('arch') || norm === 'closed') {
    dotColor = '#475569';
    bgColor = 'rgba(71, 85, 105, 0.15)';
    borderColor = 'rgba(71, 85, 105, 0.4)';
    textColor = '#64748b';
  } else if (norm.includes('bug') || norm === 'open' || norm === 'critical' || norm === 'high') {
    dotColor = '#ef4444';
    bgColor = 'rgba(239, 68, 68, 0.12)';
    borderColor = 'rgba(239, 68, 68, 0.35)';
    textColor = '#fca5a5';
  } else if (norm === 'new' || norm === 'idea') {
    dotColor = '#8b5cf6';
    bgColor = 'rgba(139, 92, 246, 0.12)';
    borderColor = 'rgba(139, 92, 246, 0.35)';
    textColor = '#c4b5fd';
  } else if (norm === 'local') {
    dotColor = '#00d4c8';
    bgColor = 'rgba(0, 212, 200, 0.12)';
    borderColor = 'rgba(0, 212, 200, 0.35)';
    textColor = '#5eead4';
  }

  const dotSizeClass = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  }[size];

  const textSizeClass = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-medium border rounded-[2px] select-none whitespace-nowrap',
        textSizeClass
      )}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
      }}
    >
      <span
        className={clsx('rounded-full flex-shrink-0', dotSizeClass)}
        style={{
          backgroundColor: dotColor,
          boxShadow: `0 0 5px ${dotColor}88`,
        }}
      />
      {showLabel && <span>{status}</span>}
    </span>
  );
};
export default StatusBadge;
