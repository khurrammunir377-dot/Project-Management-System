import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevHub } from '@/context/DevHubContext';
import { getMemberById } from '@/data/mockData';
import { Project } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  FolderGit2,
  Plus,
  Search,
  ArrowUpDown,
  Trash2,
  ExternalLink,
  Mail,
  AlertTriangle,
} from 'lucide-react';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { projects, teamMembers, openModal, setActiveProjectId, deleteProject } = useDevHub();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof Project>('lastUpdated');
  const [sortAsc, setSortAsc] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Extract unique types
  const types = ['ALL', ...Array.from(new Set(projects.map((p) => p.type)))];
  const statuses = ['ALL', 'Development', 'Testing', 'Production', 'On Hold', 'Archived'];

  // Filter projects
  const filtered = projects
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.stack.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.accountEmail && p.accountEmail.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchType = selectedType === 'ALL' || p.type === selectedType;
      return matchSearch && matchStatus && matchType;
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
      {/* Top Header */}
      <div className="p-3.5 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-grid">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#38bdf815] border border-[#38bdf850] text-[#38bdf8] rounded-[2px]">
            <FolderGit2 size={18} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#dce4f0] uppercase">
              PROJECT REGISTRY & REPOSITORIES
            </h1>
            <p className="font-mono text-[10px] text-[#55637a] tracking-wider">
              {projects.length} TOTAL MANAGED REPOSITORIES • {filtered.length} MATCHING FILTER
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('project')}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono text-xs font-bold tracking-wider rounded-[2px] transition-all shadow-[0_0_10px_rgba(0,212,200,0.3)]"
        >
          <Plus size={14} /> REGISTER NEW PROJECT
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#55637a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, code, tech stack, email, platform..."
            className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] placeholder-[#55637a] pl-8 pr-3 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
          />
        </div>

        {/* Status select */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[#55637a] text-[10px] uppercase tracking-wider">STATUS:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#141820] text-[#dce4f0] text-xs font-mono px-2 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Type select */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[#55637a] text-[10px] uppercase tracking-wider">TYPE:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#141820] text-[#dce4f0] text-xs font-mono px-2 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List Table */}
      <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left cmd-table">
            <thead>
              <tr className="bg-[#0b0e14]">
                <th onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    PROJECT NAME <ArrowUpDown size={10} />
                  </div>
                </th>
                <th onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-1">
                    TYPE <ArrowUpDown size={10} />
                  </div>
                </th>
                <th onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    STATUS <ArrowUpDown size={10} />
                  </div>
                </th>
                <th>TECH STACK / PLATFORM</th>
                <th>VERSION</th>
                <th onClick={() => handleSort('progress')}>
                  <div className="flex items-center gap-1">
                    PROGRESS <ArrowUpDown size={10} />
                  </div>
                </th>
                <th>REPOSITORY & LIVE URL</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b24] font-mono text-xs">
              {filtered.map((proj) => {
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
                    {/* Project */}
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#00d4c8] bg-[#00d4c810] px-1.5 py-0.5 rounded-[2px] border border-[#00d4c830] text-xs">
                          {proj.shortCode}
                        </span>
                        <div>
                          <span className="font-sans font-semibold text-[#dce4f0] group-hover:text-[#00d4c8] transition-colors block text-sm">
                            {proj.name}
                          </span>
                          <span className="text-[10px] text-[#55637a] block font-sans truncate max-w-sm">
                            {proj.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="text-[#8892a4] text-xs whitespace-nowrap">{proj.type}</td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={proj.status} size="sm" />
                    </td>

                    {/* Tech Stack */}
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 flex-wrap max-w-xs">
                          {proj.stack.map((st) => (
                            <span
                              key={st}
                              className="text-[9.5px] px-1.5 py-0.2 bg-[#171c26] text-[#94a3b8] border border-[#252f44] rounded-[2px]"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                        {proj.platformInfo && (
                          <span className="text-[9.5px] text-[#55637a] block truncate max-w-[200px]">
                            {proj.platformInfo}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Version */}
                    <td className="text-[#00d4c8] font-bold text-xs whitespace-nowrap">
                      {proj.version}
                    </td>

                    {/* Progress */}
                    <td className="w-28">
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

                    {/* Repo & Live Url */}
                    <td className="text-[11px]">
                      <div className="text-[#38bdf8] truncate max-w-[180px] hover:underline" title={proj.repository}>
                        {proj.repository || 'No remote git'}
                      </div>
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-[#10b981] hover:underline flex items-center gap-0.5 mt-0.5 truncate max-w-[180px]"
                        >
                          <ExternalLink size={10} /> Live: {proj.liveUrl}
                        </a>
                      )}
                    </td>

                    {/* Actions */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(proj)}
                        className="p-1.5 text-[#55637a] hover:text-[#ef4444] hover:bg-[#ef444415] rounded-[2px] transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#10141e] border border-[#ef4444] rounded-[2px] w-full max-w-md p-5 font-mono shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <div className="flex items-center gap-2 text-[#ef4444] mb-3">
              <AlertTriangle size={20} />
              <span className="font-bold text-sm uppercase">CONFIRM PROJECT REMOVAL</span>
            </div>
            <p className="text-xs text-[#dce4f0] mb-4">
              Are you sure you want to delete <span className="text-[#00d4c8] font-bold">{projectToDelete.name}</span> ({projectToDelete.shortCode}) from the registry?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-3 py-1.5 text-xs text-[#7a8899] hover:text-[#dce4f0] border border-[#252c3a] rounded-[2px]"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  deleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="px-4 py-1.5 text-xs bg-[#ef4444] hover:bg-[#ff5555] text-white font-bold rounded-[2px] transition-colors"
              >
                CONFIRM & DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Projects;
