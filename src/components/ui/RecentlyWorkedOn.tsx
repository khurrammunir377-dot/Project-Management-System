import React from 'react';
import { Project } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Link } from 'react-router-dom';
import { GitCommit, FolderGit2 } from 'lucide-react';

interface RecentlyWorkedOnProps {
  projects: Project[];
}

export const RecentlyWorkedOn: React.FC<RecentlyWorkedOnProps> = ({ projects }) => {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="p-2.5 bg-[#10141c] hover:bg-[#151a24] border border-[#1e2535] hover:border-[#00d4c840] rounded-[2px] transition-all block group"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-[11px] font-bold text-[#00d4c8] bg-[#00d4c810] px-1.5 py-0.2 rounded-[2px] border border-[#00d4c830] flex-shrink-0">
                {project.shortCode}
              </span>
              <span className="font-mono text-xs text-[#dce4f0] font-semibold truncate group-hover:text-[#00d4c8]">
                {project.name}
              </span>
            </div>
            <StatusBadge status={project.status} size="xs" />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-[#6b7b94] mb-1.5">
            <span className="text-[#a0aec0]">{project.version}</span>
            <span>{project.stack.slice(0, 2).join(' / ')}</span>
          </div>

          {/* Progress Line */}
          <div className="w-full bg-[#1e2535] h-[3px] rounded-none overflow-hidden">
            <div
              className="bg-[#00d4c8] h-full transition-all"
              style={{
                width: `${project.progress}%`,
                boxShadow: '0 0 6px rgba(0, 212, 200, 0.4)',
              }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};
export default RecentlyWorkedOn;
