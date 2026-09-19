import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDevHub } from '@/context/DevHubContext';
import { getMetrics, getRecentProjects, getNeedsAttention, getMemberById } from '@/data/mockData';
import { Project, ProjectStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricTile from '@/components/ui/MetricTile';
import ActivityFeed from '@/components/ui/ActivityFeed';
import NeedsAttention from '@/components/ui/NeedsAttention';
import RecentlyWorkedOn from '@/components/ui/RecentlyWorkedOn';
import {
  FolderGit2,
  AlertTriangle,
  ArrowUpDown,
  Search,
  ExternalLink,
  Tag,
  Users,
  Activity as ActivityIcon,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    tasks,
    bugs,
    activities,
    teamMembers,
    openModal,
    setActiveProjectId,
  } = useDevHub();

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Project>('lastUpdated');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const metrics = getMetrics(projects, bugs, tasks);
  const recentProjects = getRecentProjects(projects);
  const attention = getNeedsAttention(projects, bugs, tasks);

  const statusFilters = ['ALL', 'Development', 'Testing', 'Production', 'On Hold', 'Archived'];

  const filteredProjects = projects
    .filter((p) => {
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.stack.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* ── TOP METRICS COMMAND STRIP ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <MetricTile
          label="TOTAL PROJECTS"
          value={metrics.total}
          accent="#00d4c8"
          icon={<FolderGit2 size={13} className="text-[#00d4c8]" />}
        />
        <MetricTile
          label="IN PRODUCTION"
          value={metrics.production}
          accent="#10b981"
          icon={<ShieldCheck size={13} className="text-[#10b981]" />}
        />
        <MetricTile
          label="TESTING / STAGING"
          value={metrics.testing}
          accent="#f59e0b"
          icon={<Tag size={13} className="text-[#f59e0b]" />}
        />
        <MetricTile
          label="DEVELOPMENT"
          value={metrics.active}
          accent="#38bdf8"
          icon={<FolderGit2 size={13} className="text-[#38bdf8]" />}
        />
        <MetricTile
          label="OPEN DEFECTS"
          value={metrics.openBugs}
          accent="#ef4444"
          icon={<AlertTriangle size={13} className="text-[#ef4444]" />}
        />
        <MetricTile
          label="OPEN TASKS"
          value={metrics.openTasks}
          accent="#fbbf24"
          icon={<Tag size={13} className="text-[#fbbf24]" />}
        />
        <MetricTile
          label="OPERATORS"
          value={teamMembers.length}
          accent="#a855f7"
          icon={<Users size={13} className="text-[#a855f7]" />}
        />
      </div>

      {/* ── MAIN TWO-COLUMN DECK ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {/* LEFT / CENTER (Main Projects Table) */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-3">
          {/* Table Header & Quick Action */}
          <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#e2e8f0] tracking-wider uppercase">
                PROJECT COMMAND MATRIX
              </span>
              <span className="font-mono text-[10px] text-[#00d4c8] bg-[#00d4c810] px-1.5 py-0.2 rounded-[2px] border border-[#00d4c830] font-bold">
                {filteredProjects.length} / {projects.length} UNITS
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Search */}
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#55637a]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter matrix..."
                  className="bg-[#141820] text-xs font-mono text-[#dce4f0] placeholder-[#55637a] pl-7 pr-2.5 py-1 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px] w-36 sm:w-48"
                />
              </div>

              <button
                onClick={() => openModal('project')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#00d4c815] hover:bg-[#00d4c825] border border-[#00d4c850] text-[#00d4c8] font-mono text-xs font-semibold rounded-[2px] transition-colors"
              >
                <Plus size={12} /> NEW
              </button>
            </div>
          </div>

          {/* Status Filter Tab Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {statusFilters.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`font-mono text-[10.5px] px-2.5 py-1 rounded-[2px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer select-none border ${
                  selectedStatus === st
                    ? 'bg-[#00d4c815] text-[#00d4c8] border-[#00d4c880] font-bold shadow-sm'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] dark:text-[#7a8899] dark:hover:text-[#f1f5f9] dark:hover:bg-[#141824] border-transparent'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Projects Command Table */}
          <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left cmd-table">
                <thead>
                  <tr className="bg-[#0b0e14]">
                    <th onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        PROJECT <ArrowUpDown size={10} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-1">
                        STATUS <ArrowUpDown size={10} />
                      </div>
                    </th>
                    <th>TECH STACK</th>
                    <th>VERSION</th>
                    <th onClick={() => handleSort('progress')}>
                      <div className="flex items-center gap-1">
                        PROGRESS <ArrowUpDown size={10} />
                      </div>
                    </th>
                    <th>REPOSITORY / LIVE LINK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161b24] font-mono text-xs">
                  {filteredProjects.map((proj) => {
                    const owner = getMemberById(proj.owner, teamMembers);
                    return (
                      <tr
                        key={proj.id}
                        onClick={() => {
                          setActiveProjectId(proj.id);
                          navigate(`/projects/${proj.id}`);
                        }}
                        className="cursor-pointer hover:bg-[#151a24] transition-colors group"
                      >
                        {/* Project Code & Name */}
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#00d4c8] bg-[#00d4c810] px-1.5 py-0.2 rounded-[2px] border border-[#00d4c830] text-[11px]">
                              {proj.shortCode}
                            </span>
                            <div>
                              <span className="font-sans font-semibold text-[#dce4f0] group-hover:text-[#00d4c8] transition-colors block text-xs">
                                {proj.name}
                              </span>
                              <span className="text-[10px] text-[#55637a] block font-sans truncate max-w-xs">
                                {proj.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <StatusBadge status={proj.status} size="xs" />
                        </td>

                        {/* Tech Stack */}
                        <td>
                          <div className="flex items-center gap-1 flex-wrap max-w-xs">
                            {proj.stack.slice(0, 3).map((st) => (
                              <span
                                key={st}
                                className="text-[9px] px-1.5 py-0.2 bg-[#171c26] text-[#94a3b8] border border-[#252f44] rounded-[2px]"
                              >
                                {st}
                              </span>
                            ))}
                            {proj.stack.length > 3 && (
                              <span className="text-[9px] text-[#55637a]">+{proj.stack.length - 3}</span>
                            )}
                          </div>
                        </td>

                        {/* Version */}
                        <td className="text-[#00d4c8] font-bold text-xs">{proj.version}</td>

                        {/* Progress Bar */}
                        <td className="w-24">
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#55637a]">{proj.progress}%</span>
                            <div className="w-full bg-[#181d28] h-[3px] overflow-hidden">
                              <div
                                className="h-full bg-[#00d4c8]"
                                style={{ width: `${proj.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Repo / Live Link */}
                        <td className="text-[11px]">
                          <div className="text-[#38bdf8] truncate max-w-[170px] hover:underline" title={proj.repository}>
                            {proj.repository || 'Local Archive'}
                          </div>
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-[#10b981] hover:underline flex items-center gap-0.5 mt-0.5 truncate max-w-[170px]"
                            >
                              <ExternalLink size={9} /> {proj.liveUrl}
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (Recently Worked On, Needs Attention, Activity Feed) */}
        <div className="space-y-4">
          {/* Recently Worked On */}
          <RecentlyWorkedOn projects={recentProjects} />

          {/* Needs Attention */}
          <NeedsAttention
            overdueTasks={attention.overdueTasks}
            criticalBugs={attention.criticalBugs}
            stalledProjects={attention.stalledProjects}
          />

          {/* Real-time Activity Feed */}
          <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-[#1e2330]">
              <div className="flex items-center gap-1.5">
                <ActivityIcon size={13} className="text-[#00d4c8]" />
                <span className="font-mono text-xs font-bold text-[#e2e8f0] uppercase tracking-wider">
                  TELEMETRY STREAM
                </span>
              </div>
              <Link to="/activity" className="font-mono text-[10px] text-[#00d4c8] hover:underline">
                VIEW ALL
              </Link>
            </div>
            <ActivityFeed events={activities} limit={5} compact />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
