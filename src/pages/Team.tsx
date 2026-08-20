import React, { useState } from 'react';
import { useDevHub } from '@/context/DevHubContext';
import { Users, Mail, Phone, Shield, Plus, Trash2, Check, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Team: React.FC = () => {
  const { teamMembers, projects, deleteTeamMember, updateMemberStatus, openModal } = useDevHub();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Online' | 'Away' | 'Offline'>('ALL');

  const filteredMembers = teamMembers.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8">
      {/* ── TOP HEADER ──────────────────────────────────────────────── */}
      <div className="p-3.5 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-grid">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#00d4c815] border border-[#00d4c850] text-[#00d4c8] rounded-[2px]">
            <Users size={18} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-[#dce4f0] uppercase">
              ENGINEERING OPERATORS & ROSTER
            </h1>
            <p className="font-mono text-[10px] text-[#55637a] tracking-wider">
              {teamMembers.length} ACTIVE REGISTERED OPERATORS • {filteredMembers.length} MATCHING FILTER
            </p>
          </div>
        </div>

        {/* Action Button: Add Team Member */}
        <button
          type="button"
          onClick={() => openModal('member')}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono text-xs font-bold tracking-wider rounded-[2px] transition-all shadow-[0_0_10px_rgba(0,212,200,0.3)]"
        >
          <Plus size={14} /> + ADD NEW TEAM MEMBER
        </button>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ─────────────────────────────────── */}
      <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#55637a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter operators by name, role, email..."
            className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] placeholder-[#55637a] pl-8 pr-3 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
          />
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[#55637a] text-[10px] uppercase">STATUS:</span>
          {(['ALL', 'Online', 'Away', 'Offline'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-1 text-[10px] uppercase rounded-[2px] border transition-colors ${
                statusFilter === st
                  ? 'bg-[#00d4c815] border-[#00d4c850] text-[#00d4c8] font-bold'
                  : 'bg-[#141820] border-[#252c3a] text-[#7a8899] hover:text-[#dce4f0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── OPERATORS CARD GRID ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredMembers.map((member) => {
          const assignedProjects = projects.filter(
            (p) => p.owner === member.id || p.teamMembers.includes(member.id)
          );

          return (
            <div
              key={member.id}
              className="p-4 bg-[#101318] border border-[#1e2330] hover:border-[#00d4c840] rounded-[2px] space-y-3.5 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex flex-col justify-between"
            >
              {/* Member Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[2px] bg-[#141d2d] border border-[#00d4c8] flex items-center justify-center font-mono font-bold text-base text-[#00d4c8] shadow-[0_0_12px_rgba(0,212,200,0.15)] flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm text-[#dce4f0] flex items-center gap-1.5">
                      {member.name}
                    </h3>
                    <p className="font-mono text-xs text-[#00d4c8] font-medium">{member.role}</p>
                    <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider block mt-0.5">
                      Joined {member.joinedAt}
                    </span>
                  </div>
                </div>

                {/* Status Selector Switcher */}
                <select
                  value={member.status}
                  onChange={(e) => updateMemberStatus(member.id, e.target.value as any)}
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] border outline-none bg-[#0c0e14] ${
                    member.status === 'Online'
                      ? 'border-[#10b98150] text-[#10b981]'
                      : member.status === 'Away'
                      ? 'border-[#f59e0b50] text-[#f59e0b]'
                      : 'border-[#6b728050] text-[#9ca3af]'
                  }`}
                >
                  <option value="Online">● Online</option>
                  <option value="Away">● Away</option>
                  <option value="Offline">● Offline</option>
                </select>
              </div>

              {/* Contact Info & Clearance */}
              <div className="space-y-1.5 pt-2 border-t border-[#1a1f2c] font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#55637a] flex items-center gap-1">
                    <Mail size={11} /> EMAIL:
                  </span>
                  <span className="text-[#dce4f0] select-all">{member.email}</span>
                </div>

                {member.phone && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#55637a] flex items-center gap-1">
                      <Phone size={11} /> PHONE:
                    </span>
                    <span className="text-[#a0aec0]">{member.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#55637a] flex items-center gap-1">
                    <Shield size={11} /> CLEARANCE:
                  </span>
                  <span className="text-[#00d4c8] font-bold">{member.accessLevel || 'Developer'}</span>
                </div>
              </div>

              {/* Assigned Repositories */}
              <div className="pt-2 border-t border-[#1a1f2c]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#55637a]">
                    ASSIGNED REPOSITORIES ({assignedProjects.length})
                  </span>
                  {member.id !== 'tm1' && (
                    <button
                      onClick={() => deleteTeamMember(member.id)}
                      className="text-[#ef4444] hover:text-[#ff6666] font-mono text-[9px] flex items-center gap-0.5"
                      title="Deactivate and remove from roster"
                    >
                      <Trash2 size={10} /> REMOVE
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap min-h-[24px]">
                  {assignedProjects.length > 0 ? (
                    assignedProjects.map((p) => (
                      <Link
                        key={p.id}
                        to={`/projects/${p.id}`}
                        className="font-mono text-[10px] px-1.5 py-0.5 bg-[#141824] hover:bg-[#1a2130] border border-[#252f44] text-[#dce4f0] hover:text-[#00d4c8] rounded-[2px] transition-colors"
                      >
                        {p.shortCode}
                      </Link>
                    ))
                  ) : (
                    <span className="font-mono text-[10px] text-[#55637a]">No active repositories assigned</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Team;
