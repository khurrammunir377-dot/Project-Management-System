import React, { useState } from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { getMemberById, getProjectById } from '@/data/mockData';
import { Task, TaskStatus, TaskPriority } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { CheckSquare, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Tasks: React.FC = () => {
  const { tasks, projects, teamMembers, openModal, deleteTask } = useDevHub();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<string>('ALL');

  const statuses: string[] = ['ALL', 'Todo', 'In Progress', 'Done', 'Blocked'];
  const priorities: string[] = ['ALL', 'High', 'Medium', 'Low'];

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    const matchProject = selectedProject === 'ALL' || t.projectId === selectedProject;
    return matchSearch && matchStatus && matchPriority && matchProject;
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* Header */}
      <div className="p-3.5 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-grid">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#fbbf2415] border border-[#fbbf2450] text-[#fbbf24] rounded-[2px]">
            <CheckSquare size={18} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#dce4f0] uppercase">
              ENGINEERING TASK REGISTRY
            </h1>
            <p className="font-mono text-[10px] text-[#55637a] tracking-wider">
              {tasks.length} TOTAL MANAGED TASKS • {filteredTasks.length} MATCHING ACTIVE FILTERS
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('task')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00d4c8] text-black font-mono text-xs font-bold tracking-wider rounded-[2px] hover:bg-[#00e5d8] transition-all shadow-[0_0_10px_rgba(0,212,200,0.3)]"
        >
          <Plus size={14} /> CREATE NEW TASK
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
            placeholder="Filter tasks by description..."
            className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] placeholder-[#55637a] pl-8 pr-3 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
          />
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

        {/* Priority */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[#55637a] text-[10px] uppercase">PRIORITY:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#141820] text-[#dce4f0] text-xs font-mono px-2 py-1.5 border border-[#252c3a] outline-none rounded-[2px]"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Project */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[#55637a] text-[10px] uppercase">PROJECT:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-[#141820] text-[#dce4f0] text-xs font-mono px-2 py-1.5 border border-[#252c3a] outline-none rounded-[2px]"
          >
            <option value="ALL">ALL PROJECTS</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.shortCode}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Data Table */}
      <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left cmd-table">
            <thead>
              <tr className="bg-[#0b0e14]">
                <th>TASK IDENTIFIER / DESCRIPTION</th>
                <th>PROJECT TARGET</th>
                <th>STATUS</th>
                <th>PRIORITY</th>
                <th>ASSIGNEE</th>
                <th>DUE DATE</th>
                <th>TAGS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b24] font-mono text-xs">
              {filteredTasks.map((task) => {
                const project = getProjectById(task.projectId, projects);
                const assignee = getMemberById(task.assignee, teamMembers);
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

                return (
                  <tr key={task.id} className="hover:bg-[#151a24] transition-colors">
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-[#55637a] font-bold text-[10px]">
                          {task.id.toUpperCase()}
                        </span>
                        <span className="font-sans font-medium text-[#dce4f0]">{task.title}</span>
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
                      <StatusBadge status={task.status} size="xs" />
                    </td>

                    <td>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] ${
                          task.priority === 'High'
                            ? 'bg-[#ef444415] text-[#ef4444] border border-[#ef444430]'
                            : task.priority === 'Medium'
                            ? 'bg-[#f59e0b15] text-[#f59e0b] border border-[#f59e0b30]'
                            : 'bg-[#6b728015] text-[#9ca3af] border border-[#6b728030]'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="text-[#a0aec0] font-sans">{assignee?.name || 'Unassigned'}</td>

                    <td>
                      <span className={isOverdue ? 'text-[#ef4444] font-bold' : 'text-[#7a8899]'}>
                        {task.dueDate} {isOverdue && '⚠️'}
                      </span>
                    </td>

                    <td>
                      <div className="flex gap-1">
                        {task.tags.map((tg) => (
                          <span
                            key={tg}
                            className="text-[9px] px-1 bg-[#141824] border border-[#252f44] text-[#7a8899] rounded-[2px]"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-[#55637a] hover:text-[#ef4444] p-1 rounded-[2px] transition-colors"
                        title="Delete task"
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
export default Tasks;
