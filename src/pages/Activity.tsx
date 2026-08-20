import React, { useState } from 'react';
import { useDevHub } from '@/context/DevHubContext';
import ActivityFeed from '@/components/ui/ActivityFeed';
import { Activity as ActivityIcon, Filter } from 'lucide-react';

export const Activity: React.FC = () => {
  const { activities } = useDevHub();
  const [filterType, setFilterType] = useState<string>('ALL');

  const types = ['ALL', 'update', 'bug', 'version', 'deploy', 'task', 'comment'];

  const filtered = activities.filter((a) => {
    return filterType === 'ALL' || a.type === filterType;
  });

  return (
    <div className="space-y-4 max-w-[1200px] mx-auto pb-6">
      {/* Header */}
      <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex items-center justify-between bg-grid">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#00d4c815] border border-[#00d4c850] text-[#00d4c8] rounded-[2px]">
            <ActivityIcon size={16} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#dce4f0] uppercase">
              GLOBAL TELEMETRY & ACTIVITY STREAM
            </h1>
            <p className="font-mono text-[10px] text-[#55637a] tracking-wider">
              REAL-TIME AUDIT LOG OF DEPLOYS, DEFECTS, BUILDS AND REPOSITORY COMMITS
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-x-auto">
        <span className="font-mono text-[10px] text-[#55637a] uppercase mr-2 flex items-center gap-1">
          <Filter size={10} /> FILTER STREAM:
        </span>
        {types.map((tp) => (
          <button
            key={tp}
            onClick={() => setFilterType(tp)}
            className={`font-mono text-[10px] px-2.5 py-1 rounded-[2px] uppercase tracking-wider transition-colors ${
              filterType === tp
                ? 'bg-[#00d4c815] text-[#00d4c8] border border-[#00d4c850] font-bold'
                : 'text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#141824]'
            }`}
          >
            {tp}
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="p-4 bg-[#101318] border border-[#1e2330] rounded-[2px]">
        <ActivityFeed events={filtered} limit={50} />
      </div>
    </div>
  );
};
export default Activity;
