import React from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { getProjectById, getMemberById } from '@/data/mockData';
import { MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Suggestions: React.FC = () => {
  const { suggestions, projects, teamMembers, openModal } = useDevHub();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* Header */}
      <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-grid">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#00d4c815] border border-[#00d4c850] text-[#00d4c8] rounded-[2px]">
            <MessageSquare size={16} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#dce4f0] uppercase">
              ENGINEERING FEEDBACK & SUGGESTIONS
            </h1>
            <p className="font-mono text-[10px] text-[#55637a] tracking-wider">
              {suggestions.length} LOGGED ARCHITECTURE SUGGESTIONS & OPTIMIZATIONS
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('idea')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4c8] text-black font-mono text-xs font-bold tracking-wider rounded-[2px] hover:bg-[#00e5d8] transition-all shadow-[0_0_10px_rgba(0,212,200,0.3)]"
        >
          <Plus size={14} /> NEW SUGGESTION
        </button>
      </div>

      {/* Suggestions Table */}
      <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left cmd-table">
            <thead>
              <tr className="bg-[#0b0e14]">
                <th>SUGGESTION TITLE & SCOPE</th>
                <th>PROJECT TARGET</th>
                <th>STATUS</th>
                <th>SUBMITTER</th>
                <th>DATE LOGGED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b24] font-mono text-xs">
              {suggestions.map((sug) => {
                const project = getProjectById(sug.projectId, projects);
                const submitter = getMemberById(sug.submittedBy, teamMembers);

                return (
                  <tr key={sug.id} className="hover:bg-[#151a24] transition-colors">
                    <td>
                      <div>
                        <span className="font-sans font-semibold text-[#dce4f0] block">
                          {sug.title}
                        </span>
                        <span className="text-[10px] text-[#55637a] block font-sans">
                          {sug.description}
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
                          sug.status === 'Accepted'
                            ? 'bg-[#10b98115] border-[#10b98140] text-[#10b981]'
                            : sug.status === 'Under Review'
                            ? 'bg-[#f59e0b15] border-[#f59e0b40] text-[#f59e0b]'
                            : 'bg-[#6b728015] border-[#6b728040] text-[#9ca3af]'
                        }`}
                      >
                        {sug.status}
                      </span>
                    </td>

                    <td className="text-[#a0aec0] font-sans">{submitter?.name || 'Dev'}</td>
                    <td className="text-[#6b7b94]">{sug.createdAt}</td>
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
export default Suggestions;
