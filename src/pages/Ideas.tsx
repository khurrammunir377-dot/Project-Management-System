import React from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { getProjectById, getMemberById } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Lightbulb, Plus, ArrowUp, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Ideas: React.FC = () => {
  const { ideas, projects, teamMembers, voteIdea, openModal, deleteIdea } = useDevHub();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* Header */}
      <div className="p-3.5 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-grid">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#c084fc15] border border-[#c084fc50] text-[#c084fc] rounded-[2px]">
            <Lightbulb size={18} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#dce4f0] uppercase">
              FEATURE PROPOSALS & INNOVATION LAB
            </h1>
            <p className="font-mono text-[10px] text-[#55637a] tracking-wider">
              {ideas.length} RECORDED ARCHITECTURAL CONCEPTS & ENHANCEMENTS
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('idea')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c084fc] text-black font-mono text-xs font-bold tracking-wider rounded-[2px] hover:bg-[#d8b4fe] shadow-[0_0_10px_rgba(192,132,252,0.3)] transition-all"
        >
          <Plus size={14} /> SUBMIT PROPOSAL
        </button>
      </div>

      {/* Ideas Table */}
      <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left cmd-table">
            <thead>
              <tr className="bg-[#0b0e14]">
                <th>VOTES</th>
                <th>PROPOSAL TITLE & SCOPE</th>
                <th>TARGET PROJECT</th>
                <th>STATUS</th>
                <th>AUTHOR</th>
                <th>DATE LOGGED</th>
                <th>TAGS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b24] font-mono text-xs">
              {ideas.map((idea) => {
                const project = getProjectById(idea.projectId, projects);
                const submitter = getMemberById(idea.submittedBy, teamMembers);

                return (
                  <tr key={idea.id} className="hover:bg-[#151a24] transition-colors">
                    <td>
                      <button
                        onClick={() => voteIdea(idea.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-[#141824] hover:bg-[#c084fc20] border border-[#252f44] hover:border-[#c084fc50] text-[#dce4f0] hover:text-[#c084fc] rounded-[2px] transition-colors"
                        title="Upvote proposal"
                      >
                        <ArrowUp size={11} className="text-[#c084fc]" />
                        <span className="font-bold">{idea.votes}</span>
                      </button>
                    </td>

                    <td>
                      <div>
                        <span className="font-sans font-semibold text-[#dce4f0] block">
                          {idea.title}
                        </span>
                        <span className="text-[10px] text-[#55637a] block font-sans">
                          {idea.description}
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
                      <StatusBadge status={idea.status} size="xs" />
                    </td>

                    <td className="text-[#a0aec0] font-sans">{submitter?.name || 'Engineer'}</td>
                    <td className="text-[#6b7b94]">{idea.createdAt}</td>

                    <td>
                      <div className="flex gap-1">
                        {idea.tags.map((tg) => (
                          <span
                            key={tg}
                            className="text-[9px] px-1.5 py-0.2 bg-[#141824] border border-[#252f44] text-[#c084fc] rounded-[2px]"
                          >
                            #{tg}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="text-[#55637a] hover:text-[#ef4444] p-1 rounded-[2px] transition-colors"
                        title="Delete proposal"
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
export default Ideas;
