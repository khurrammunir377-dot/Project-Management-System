import React, { useState } from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { getMemberById, getProjectById } from '@/data/mockData';
import { BugSeverity, BugStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { Bug as BugIcon, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Bugs: React.FC = () => {
  const { bugs, projects, teamMembers, openModal, deleteBug } = useDevHub();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const severities = ['ALL', 'Critical', 'High', 'Medium', 'Low'];
  const statuses = ['ALL', 'Open', 'In Progress', 'Resolved', 'Closed'];

  const filteredBugs = bugs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSev = selectedSeverity === 'ALL' || b.severity === selectedSeverity;
    const matchStat = selectedStatus === 'ALL' || b.status === selectedStatus;
    return matchSearch && matchSev && matchStat;
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* Header */}
      <div className="p-3.5 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-grid">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#ef444415] border border-[#ef444450] text-[#ef4444] rounded-[2px]">
            <BugIcon size={18} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#dce4f0] uppercase">
              DEFECT TELEMETRY & BUG CONSOLE
            </h1>
            <p className="font-mono text-[10px] text-[#55637a] tracking-wider">
              {bugs.length} REGISTERED DEFECTS • {filteredBugs.length} FILTERED ENTRIES
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('bug')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ef4444] text-white font-mono text-xs font-bold tracking-wider rounded-[2px] hover:bg-[#ff5252] shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all"
        >
          <Plus size={14} /> REPORT CRITICAL DEFECT
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#55637a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bug title or steps to reproduce..."
            className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] placeholder-[#55637a] pl-8 pr-3 py-1.5 border border-[#252c3a] focus:border-[#ef4444] outline-none rounded-[2px]"
          />
        </div>

        {/* Severity */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[#55637a] text-[10px] uppercase">SEVERITY:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[#141820] text-[#dce4f0] text-xs font-mono px-2 py-1.5 border border-[#252c3a] outline-none rounded-[2px]"
          >
            {severities.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[#55637a] text-[10px] uppercase">STATUS:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#141820] text-[#dce4f0] text-xs font-mono px-2 py-1.5 border border-[#252c3a] outline-none rounded-[2px]"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bugs Table */}
      <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left cmd-table">
            <thead>
              <tr className="bg-[#0b0e14]">
                <th>BUG ID</th>
                <th>ISSUE TITLE & DESCRIPTION</th>
                <th>PROJECT TARGET</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
                <th>ENVIRONMENT</th>
                <th>REPORTER / ASSIGNEE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b24] font-mono text-xs">
              {filteredBugs.map((bug) => {
                const project = getProjectById(bug.projectId, projects);
                const reporter = getMemberById(bug.reportedBy, teamMembers);
                const assignee = getMemberById(bug.assignee, teamMembers);

                return (
                  <tr key={bug.id} className="hover:bg-[#151a24] transition-colors">
                    <td className="text-[#ef4444] font-bold">{bug.id.toUpperCase()}</td>
                    <td>
                      <div>
                        <span className="font-sans font-medium text-[#dce4f0] block">
                          {bug.title}
                        </span>
                        <span className="text-[10px] text-[#55637a] block font-sans truncate max-w-md">
                          {bug.description}
                        </span>
                      </div>
                    </td>
                    <td>
                      {project ? (
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-[#00d4c8] hover:underline font-bold text-[11px]"
                        >
                          {project.shortCode}
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] border ${
                          bug.severity === 'Critical' || bug.severity === 'High'
                            ? 'bg-[#ef444415] border-[#ef444440] text-[#ef4444]'
                            : 'bg-[#f59e0b15] border-[#f59e0b40] text-[#f59e0b]'
                        }`}
                      >
                        {bug.severity}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={bug.status} size="xs" />
                    </td>
                    <td className="text-[#6b7b94]">{bug.environment}</td>
                    <td className="text-[11px] text-[#a0aec0] font-sans">
                      <div>Rep: {reporter?.name || 'Khurram'}</div>
                      <div className="text-[10px] text-[#55637a]">Assigned: {assignee?.name || 'Unassigned'}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteBug(bug.id)}
                        className="text-[#55637a] hover:text-[#ef4444] p-1 rounded-[2px] transition-colors"
                        title="Delete bug defect"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Bugs;
