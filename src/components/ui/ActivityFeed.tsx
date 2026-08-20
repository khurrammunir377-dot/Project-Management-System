import React from 'react';
import { ActivityEvent } from '@/types';
import { getMemberById } from '@/data/mockData';
import { Link } from 'react-router-dom';

interface ActivityFeedProps {
  events: ActivityEvent[];
  limit?: number;
  compact?: boolean;
}

const typeMap: Record<string, { color: string; label: string }> = {
  update:  { color: '#00d4c8', label: 'UPD' },
  bug:     { color: '#ef4444', label: 'BUG' },
  create:  { color: '#3b82f6', label: 'NEW' },
  deploy:  { color: '#10b981', label: 'DEP' },
  comment: { color: '#8b5cf6', label: 'LOG' },
  version: { color: '#0ea5e9', label: 'REL' },
  task:    { color: '#f59e0b', label: 'TSK' },
};

function formatTime(isoStr: string) {
  try {
    const date = new Date(isoStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return isoStr;
  }
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  events,
  limit = 8,
  compact = false,
}) => {
  const displayEvents = limit ? events.slice(0, limit) : events;

  return (
    <div className="space-y-0 relative before:absolute before:top-2 before:bottom-2 before:left-[21px] before:w-[1px] before:bg-[#1e2535]">
      {displayEvents.map((event) => {
        const typeInfo = typeMap[event.type] || { color: '#7a8899', label: 'SYS' };
        const member = getMemberById(event.user);
        const timeStr = formatTime(event.timestamp);

        return (
          <div
            key={event.id}
            className="flex items-start gap-3 py-2.5 px-2 hover:bg-[#141824] transition-colors rounded-[2px] relative group"
          >
            {/* Timeline node icon */}
            <div
              className="w-[11px] h-[11px] rounded-full border-2 border-[#0a0c0f] flex-shrink-0 mt-1 z-10"
              style={{
                backgroundColor: typeInfo.color,
                boxShadow: `0 0 6px ${typeInfo.color}66`,
              }}
            />

            {/* Time */}
            <span className="font-mono text-[11px] text-[#55637a] flex-shrink-0 w-14 group-hover:text-[#7a8899]">
              {timeStr}
            </span>

            {/* Message Body */}
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-[#c5d1e0] leading-snug break-words">
                {event.projectId ? (
                  <Link
                    to={`/projects/${event.projectId}`}
                    className="hover:text-[#00d4c8] transition-colors"
                  >
                    {event.message}
                  </Link>
                ) : (
                  event.message
                )}
              </div>

              {!compact && (
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="font-mono text-[9px] px-1 py-0.2 rounded-[2px] font-semibold border"
                    style={{
                      borderColor: `${typeInfo.color}40`,
                      color: typeInfo.color,
                      backgroundColor: `${typeInfo.color}15`,
                    }}
                  >
                    {typeInfo.label}
                  </span>
                  {member && (
                    <span className="font-mono text-[10px] text-[#6b7b94]">
                      @{member.name.split(' ')[0]}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ActivityFeed;
