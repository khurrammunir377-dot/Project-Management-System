import React from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { getProjectById, getMemberById } from '@/data/mockData';
import { Tag, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Releases: React.FC = () => {
  const { versions, projects, teamMembers, openModal } = useDevHub();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* Header */}
      <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-grid">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#00d4c815] border border-[#00d4c850] text-[#00d4c8] rounded-[2px]">
            <Tag size={16} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#dce4f0] uppercase">
              PRODUCTION RELEASES & TAG REGISTRY
            </h1>
            <p className="font-mono text-[10px] text-[#55637a] tracking-wider">
              {versions.length} REGISTERED BUILDS & TAGGED RELEASES
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('project')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4c8] text-black font-mono text-xs font-bold tracking-wider rounded-[2px] hover:bg-[#00e5d8] transition-all shadow-[0_0_10px_rgba(0,212,200,0.3)]"
        >
          <Plus size={14} /> TAG NEW RELEASE
        </button>
      </div>

      {/* Releases Table */}
      <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left cmd-table">
            <thead>
              <tr className="bg-[#0b0e14]">
                <th>VERSION TAG</th>
                <th>PROJECT TARGET</th>
                <th>ENVIRONMENT</th>
                <th>RELEASE DATE</th>
                <th>DEPLOYED BY</th>
                <th>CHANGELOG / RELEASE NOTES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b24] font-mono text-xs">
              {versions.map((ver) => {
                const project = getProjectById(ver.projectId, projects);
                const deployer = getMemberById(ver.deployedBy, teamMembers);

                return (
                  <tr key={ver.id} className="hover:bg-[#151a24] transition-colors">
                    <td>
                      <span className="font-bold text-[#00d4c8] bg-[#00d4c810] px-2 py-0.5 rounded-[2px] border border-[#00d4c830]">
                        {ver.version}
                      </span>
                    </td>

                    <td>
                      {project ? (
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-[#dce4f0] hover:text-[#00d4c8] font-bold text-xs"
                        >
                          {project.name} ({project.shortCode})
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </td>

                    <td>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] border ${
                          ver.environment === 'Production'
                            ? 'bg-[#10b98115] border-[#10b98140] text-[#10b981]'
                            : 'bg-[#f59e0b15] border-[#f59e0b40] text-[#f59e0b]'
                        }`}
                      >
                        {ver.environment}
                      </span>
                    </td>

                    <td className="text-[#6b7b94]">{ver.releaseDate}</td>
                    <td className="text-[#dce4f0] font-sans">{deployer?.name || 'Admin'}</td>
                    <td className="text-[#a0aec0] font-sans">{ver.notes}</td>
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
export default Releases;
