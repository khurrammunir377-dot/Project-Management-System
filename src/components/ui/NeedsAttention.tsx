import React from 'react';
import { Task, Bug, Project } from '@/types';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bug as BugIcon, Clock, Flame } from 'lucide-react';

interface NeedsAttentionProps {
  overdueTasks: Task[];
  criticalBugs: Bug[];
  stalledProjects: Project[];
}

export const NeedsAttention: React.FC<NeedsAttentionProps> = ({
  overdueTasks,
  criticalBugs,
  stalledProjects,
}) => {
  const totalIssues = overdueTasks.length + criticalBugs.length + stalledProjects.length;

  return (
    <div className="space-y-2.5">
      {totalIssues === 0 ? (
        <div className="p-3 text-center font-mono text-[11px] text-[#10b981] bg-[#10b98110] border border-[#10b98130] rounded-[2px]">
          ✓ NO CRITICAL ALERTS • ALL SYSTEMS NOMINAL
        </div>
      ) : null}

      {/* Critical / High Severity Bugs */}
      {criticalBugs.map((bug) => (
        <Link
          key={bug.id}
          to={`/bugs`}
          className="flex items-start gap-2.5 p-2 bg-[#1a1418] hover:bg-[#25181e] border border-[#ef444440] hover:border-[#ef444480] rounded-[2px] transition-colors group block"
        >
          <div className="p-1 bg-[#ef444420] text-[#ef4444] rounded-[2px] mt-0.5 flex-shrink-0">
            <Flame size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#ef4444] font-bold">
                {bug.severity} BUG
              </span>
              <span className="font-mono text-[9px] text-[#6b7b94]">
                {bug.id.toUpperCase()}
              </span>
            </div>
            <p className="text-[11.5px] text-[#e2e8f0] font-medium truncate group-hover:text-[#ff8080]">
              {bug.title}
            </p>
          </div>
        </Link>
      ))}

      {/* Overdue Tasks */}
      {overdueTasks.map((task) => (
        <Link
          key={task.id}
          to={`/tasks`}
          className="flex items-start gap-2.5 p-2 bg-[#1c1812] hover:bg-[#272118] border border-[#f59e0b40] hover:border-[#f59e0b80] rounded-[2px] transition-colors group block"
        >
          <div className="p-1 bg-[#f59e0b20] text-[#f59e0b] rounded-[2px] mt-0.5 flex-shrink-0">
            <Clock size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#f59e0b] font-bold">
                OVERDUE TASK
              </span>
              <span className="font-mono text-[9px] text-[#ef4444] font-medium">
                Due {task.dueDate}
              </span>
            </div>
            <p className="text-[11.5px] text-[#e2e8f0] font-medium truncate group-hover:text-[#ffd280]">
              {task.title}
            </p>
          </div>
        </Link>
      ))}

      {/* Stalled Projects */}
      {stalledProjects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="flex items-start gap-2.5 p-2 bg-[#141822] hover:bg-[#1b2230] border border-[#3b82f640] hover:border-[#3b82f680] rounded-[2px] transition-colors group block"
        >
          <div className="p-1 bg-[#3b82f620] text-[#3b82f6] rounded-[2px] mt-0.5 flex-shrink-0">
            <AlertTriangle size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#3b82f6] font-bold">
                IDLE PROJECT
              </span>
              <span className="font-mono text-[9px] text-[#6b7b94]">
                {project.shortCode}
              </span>
            </div>
            <p className="text-[11.5px] text-[#e2e8f0] font-medium truncate group-hover:text-[#93c5fd]">
              {project.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
export default NeedsAttention;
