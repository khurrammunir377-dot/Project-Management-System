import React, { useState } from 'react';
import { useDevHub } from '@/context/DevHubContext';
import {
  ShieldAlert, Users, Radio, Activity, Lock, AlertTriangle, CheckCircle2,
  XCircle, Ban, RefreshCw, Server, Cpu, Database, HardDrive, Terminal, Search
} from 'lucide-react';

export const Admin: React.FC = () => {
  const {
    visitors, users, securityLogs,
    toggleUserStatus, blockVisitor, terminateVisitorSession, clearSecurityLogs,
    openModal
  } = useDevHub();

  const [activeTab, setActiveTab] = useState<'visitors' | 'users' | 'security' | 'health'>('visitors');
  const [visitorSearch, setVisitorSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Computed stats
  const activeVisitors = visitors.filter(v => v.status === 'Active').length;
  const blockedVisitors = visitors.filter(v => v.status === 'Blocked').length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const criticalThreats = securityLogs.filter(s => s.severity === 'Critical').length;

  const filteredVisitors = visitors.filter(v =>
    v.ipAddress.includes(visitorSearch) ||
    v.location.toLowerCase().includes(visitorSearch.toLowerCase()) ||
    v.browser.toLowerCase().includes(visitorSearch.toLowerCase()) ||
    v.currentPath.toLowerCase().includes(visitorSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8">
      {/* ── TOP ADMIN BANNER ────────────────────────────────────────── */}
      <div className="p-4 bg-[#101318] border border-[#1e2330] rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-grid">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00d4c815] border border-[#00d4c850] text-[#00d4c8] rounded-[2px]">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold tracking-widest text-[#dce4f0] uppercase">
                SYSTEM ADMINISTRATION & VISITOR TELEMETRY CONSOLE
              </h1>
              <span className="font-mono text-[9px] bg-[#ef444415] text-[#ef4444] px-1.5 py-0.5 border border-[#ef444430] font-bold">
                ROOT CLEARANCE
              </span>
            </div>
            <p className="font-mono text-[10.5px] text-[#7a8899] tracking-wider mt-0.5">
              REAL-TIME NETWORK CONNECTIONS • USER ACCESS CONTROL • FIREWALL & AUDIT LOGS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('member')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono text-xs font-bold rounded-[2px] transition-all shadow-[0_0_10px_rgba(0,212,200,0.25)]"
          >
            + PROVISION OPERATOR
          </button>
        </div>
      </div>

      {/* ── METRICS STRIP ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <div className="p-3 bg-[#10141c] border border-[#1e2535] rounded-[2px]">
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#55637a] block">LIVE SESSIONS</span>
          <div className="font-mono text-2xl font-bold text-[#00d4c8] mt-0.5 flex items-baseline justify-between">
            <span>{activeVisitors}</span>
            <span className="text-[10px] text-[#10b981] font-normal">Active Sockets</span>
          </div>
        </div>

        <div className="p-3 bg-[#10141c] border border-[#1e2535] rounded-[2px]">
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#55637a] block">REGISTERED USERS</span>
          <div className="font-mono text-2xl font-bold text-[#dce4f0] mt-0.5 flex items-baseline justify-between">
            <span>{users.length}</span>
            <span className="text-[10px] text-[#3b82f6] font-normal">{activeUsers} Active</span>
          </div>
        </div>

        <div className="p-3 bg-[#10141c] border border-[#1e2535] rounded-[2px]">
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#55637a] block">BLOCKED THREATS</span>
          <div className="font-mono text-2xl font-bold text-[#ef4444] mt-0.5 flex items-baseline justify-between">
            <span>{blockedVisitors}</span>
            <span className="text-[10px] text-[#ef4444] font-normal">Firewall Drop</span>
          </div>
        </div>

        <div className="p-3 bg-[#10141c] border border-[#1e2535] rounded-[2px]">
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#55637a] block">SECURITY AUDITS</span>
          <div className="font-mono text-2xl font-bold text-[#f59e0b] mt-0.5 flex items-baseline justify-between">
            <span>{securityLogs.length}</span>
            <span className="text-[10px] text-[#ef4444] font-normal">{criticalThreats} Critical</span>
          </div>
        </div>

        <div className="p-3 bg-[#10141c] border border-[#1e2535] rounded-[2px]">
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#55637a] block">SYSTEM UPTIME</span>
          <div className="font-mono text-2xl font-bold text-[#10b981] mt-0.5 flex items-baseline justify-between">
            <span>99.98%</span>
            <span className="text-[10px] text-[#10b981] font-normal">24d 18h</span>
          </div>
        </div>

        <div className="p-3 bg-[#10141c] border border-[#1e2535] rounded-[2px]">
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#55637a] block">SERVER MEMORY</span>
          <div className="font-mono text-2xl font-bold text-[#a0aec0] mt-0.5 flex items-baseline justify-between">
            <span>2.4 GB</span>
            <span className="text-[10px] text-[#55637a] font-normal">/ 16 GB</span>
          </div>
        </div>
      </div>

      {/* ── TAB NAVIGATION ──────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-[#1e2330] bg-[#0a0c0f] overflow-x-auto">
        <button
          onClick={() => setActiveTab('visitors')}
          className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'visitors'
              ? 'border-[#00d4c8] text-[#00d4c8] font-bold bg-[#00d4c808]'
              : 'border-transparent text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#121622]'
          }`}
        >
          <Radio size={13} />
          <span>LIVE VISITORS & CONNECTIONS ({visitors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-[#00d4c8] text-[#00d4c8] font-bold bg-[#00d4c808]'
              : 'border-transparent text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#121622]'
          }`}
        >
          <Users size={13} />
          <span>USER ACCOUNTS & CLEARANCE ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-[#00d4c8] text-[#00d4c8] font-bold bg-[#00d4c808]'
              : 'border-transparent text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#121622]'
          }`}
        >
          <Lock size={13} />
          <span>FIREWALL & SECURITY AUDIT ({securityLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'health'
              ? 'border-[#00d4c8] text-[#00d4c8] font-bold bg-[#00d4c808]'
              : 'border-transparent text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#121622]'
          }`}
        >
          <Server size={13} />
          <span>NODE HEALTH & TELEMETRY</span>
        </button>
      </div>

      {/* ── TAB 1: LIVE VISITORS & SESSIONS ─────────────────────────── */}
      {activeTab === 'visitors' && (
        <div className="space-y-3">
          {/* Controls */}
          <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#55637a]" />
              <input
                type="text"
                value={visitorSearch}
                onChange={e => setVisitorSearch(e.target.value)}
                placeholder="Filter by IP, location, endpoint or browser..."
                className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] placeholder-[#55637a] pl-8 pr-3 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
              />
            </div>
            <span className="font-mono text-[10px] text-[#55637a]">
              POLLING INTERVAL: 3000ms • WEBSOCKET CONNECTED
            </span>
          </div>

          <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left cmd-table">
                <thead>
                  <tr className="bg-[#0b0e14]">
                    <th>SESSION ID / IP ADDRESS</th>
                    <th>GEO LOCATION</th>
                    <th>DEVICE & CLIENT AGENT</th>
                    <th>CURRENT ACTIVE ROUTE</th>
                    <th>STATUS</th>
                    <th>REQ COUNT</th>
                    <th>LAST ACTIVE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161b24] font-mono text-xs">
                  {filteredVisitors.map(v => (
                    <tr key={v.id} className="hover:bg-[#151a24] transition-colors">
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            v.status === 'Active' ? 'bg-[#10b981] shadow-[0_0_6px_#10b981]' :
                            v.status === 'Blocked' ? 'bg-[#ef4444]' : 'bg-[#6b7280]'
                          }`} />
                          <div>
                            <span className="text-[#00d4c8] font-bold block">{v.ipAddress}</span>
                            <span className="text-[10px] text-[#55637a]">{v.id} • {v.accessType}</span>
                          </div>
                        </div>
                      </td>

                      <td className="text-[#dce4f0] font-sans">{v.location}</td>

                      <td>
                        <div className="text-[#a0aec0]">{v.device}</div>
                        <div className="text-[10px] text-[#55637a]">{v.browser}</div>
                      </td>

                      <td>
                        <span className="text-[11px] text-[#00d4c8] bg-[#00d4c810] px-1.5 py-0.5 rounded-[2px] border border-[#00d4c830]">
                          {v.currentPath}
                        </span>
                      </td>

                      <td>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[2px] border ${
                          v.status === 'Active' ? 'bg-[#10b98115] border-[#10b98140] text-[#10b981]' :
                          v.status === 'Blocked' ? 'bg-[#ef444415] border-[#ef444440] text-[#ef4444]' :
                          'bg-[#6b728015] border-[#6b728040] text-[#9ca3af]'
                        }`}>
                          {v.status}
                        </span>
                      </td>

                      <td className="text-[#dce4f0] font-bold">{v.requestsCount}</td>
                      <td className="text-[#7a8899]">{v.lastActive}</td>

                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => blockVisitor(v.id)}
                            className={`px-2 py-1 text-[10px] rounded-[2px] border transition-colors ${
                              v.status === 'Blocked'
                                ? 'bg-[#10b98115] border-[#10b98140] text-[#10b981] hover:bg-[#10b98125]'
                                : 'bg-[#ef444415] border-[#ef444440] text-[#ef4444] hover:bg-[#ef444425]'
                            }`}
                            title={v.status === 'Blocked' ? 'Unblock IP' : 'Block IP via Firewall'}
                          >
                            {v.status === 'Blocked' ? 'UNBLOCK' : 'BLOCK IP'}
                          </button>

                          <button
                            onClick={() => terminateVisitorSession(v.id)}
                            className="px-2 py-1 text-[10px] bg-[#141824] hover:bg-[#1a2130] text-[#7a8899] hover:text-[#dce4f0] border border-[#252f44] rounded-[2px]"
                            title="Drop WebSocket connection"
                          >
                            TERMINATE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: USER ACCOUNTS & CLEARANCE ───────────────────────── */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#55637a]" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search operators by name or role..."
                className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] placeholder-[#55637a] pl-8 pr-3 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
              />
            </div>
            <button
              onClick={() => openModal('member')}
              className="px-3 py-1.5 bg-[#00d4c8] text-black font-mono text-xs font-bold rounded-[2px] hover:bg-[#00e5d8]"
            >
              + ADD OPERATOR ACCOUNT
            </button>
          </div>

          <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left cmd-table">
                <thead>
                  <tr className="bg-[#0b0e14]">
                    <th>OPERATOR</th>
                    <th>CLEARANCE LEVEL</th>
                    <th>STATUS</th>
                    <th>2FA SECURITY</th>
                    <th>LAST ACTIVE IP</th>
                    <th>TOTAL SESSIONS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161b24] font-mono text-xs">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-[#151a24] transition-colors">
                      <td>
                        <div>
                          <span className="font-sans font-bold text-[#dce4f0] block">{u.fullName}</span>
                          <span className="text-[10px] text-[#55637a]">@{u.username} • {u.role}</span>
                        </div>
                      </td>

                      <td>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[2px] border ${
                          u.clearance.includes('Root') ? 'bg-[#ef444415] border-[#ef444440] text-[#ef4444]' :
                          u.clearance.includes('Senior') ? 'bg-[#00d4c815] border-[#00d4c840] text-[#00d4c8]' :
                          'bg-[#3b82f615] border-[#3b82f640] text-[#3b82f6]'
                        }`}>
                          {u.clearance}
                        </span>
                      </td>

                      <td>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[2px] border ${
                          u.status === 'Active' ? 'bg-[#10b98115] border-[#10b98140] text-[#10b981]' :
                          'bg-[#ef444415] border-[#ef444440] text-[#ef4444]'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      <td>
                        {u.twoFactor ? (
                          <span className="text-[#10b981] flex items-center gap-1 font-bold text-[11px]">
                            <CheckCircle2 size={12} /> ENFORCED
                          </span>
                        ) : (
                          <span className="text-[#f59e0b] flex items-center gap-1 text-[11px]">
                            <AlertTriangle size={12} /> DISABLED
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="text-[#7a8899]">{u.lastIp}</span>
                        <div className="text-[10px] text-[#55637a]">{u.lastLogin}</div>
                      </td>

                      <td className="text-[#dce4f0]">{u.totalLogins} logins</td>

                      <td>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2 py-1 text-[10px] rounded-[2px] border transition-colors ${
                              u.status === 'Active'
                                ? 'bg-[#ef444415] border-[#ef444440] text-[#ef4444] hover:bg-[#ef444425]'
                                : 'bg-[#10b98115] border-[#10b98140] text-[#10b981] hover:bg-[#10b98125]'
                            }`}
                          >
                            {u.status === 'Active' ? 'SUSPEND' : 'ACTIVATE'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: FIREWALL & SECURITY AUDITS ──────────────────────── */}
      {activeTab === 'security' && (
        <div className="space-y-3">
          <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[2px] flex items-center justify-between">
            <span className="font-mono text-xs text-[#55637a] uppercase tracking-wider">
              REAL-TIME SECURITY INCIDENTS & ACCESS LOGS
            </span>
            <button
              onClick={clearSecurityLogs}
              className="px-2.5 py-1 text-[10px] font-mono text-[#7a8899] hover:text-[#dce4f0] bg-[#141820] border border-[#252c3a] rounded-[2px]"
            >
              CLEAR AUDIT BUFFER
            </button>
          </div>

          <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left cmd-table">
                <thead>
                  <tr className="bg-[#0b0e14]">
                    <th>TIMESTAMP</th>
                    <th>SECURITY EVENT</th>
                    <th>SEVERITY</th>
                    <th>SOURCE IP</th>
                    <th>ACTOR / USER</th>
                    <th>FIREWALL STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161b24] font-mono text-xs">
                  {securityLogs.map(s => (
                    <tr key={s.id} className="hover:bg-[#151a24]">
                      <td className="text-[#55637a]">{s.timestamp}</td>
                      <td className="text-[#dce4f0] font-sans font-medium">{s.event}</td>
                      <td>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] border ${
                          s.severity === 'Critical' ? 'bg-[#ef444415] border-[#ef444440] text-[#ef4444]' :
                          s.severity === 'Warning' ? 'bg-[#f59e0b15] border-[#f59e0b40] text-[#f59e0b]' :
                          'bg-[#10b98115] border-[#10b98140] text-[#10b981]'
                        }`}>
                          {s.severity}
                        </span>
                      </td>
                      <td className="text-[#00d4c8]">{s.sourceIp}</td>
                      <td className="text-[#a0aec0] font-sans">{s.actor}</td>
                      <td>
                        <span className={`text-[10px] font-bold ${
                          s.status === 'Blocked' ? 'text-[#ef4444]' : 'text-[#10b981]'
                        }`}>
                          ● {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: NODE HEALTH & TELEMETRY ─────────────────────────── */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-4 bg-[#101318] border border-[#1e2330] rounded-[2px] space-y-3">
            <div className="flex items-center justify-between text-[#55637a] text-[10px] uppercase">
              <span className="flex items-center gap-1.5"><Cpu size={14} className="text-[#00d4c8]" /> CPU LOAD</span>
              <span className="text-[#10b981]">14.2%</span>
            </div>
            <div className="w-full bg-[#181d28] h-2">
              <div className="bg-[#00d4c8] h-full" style={{ width: '14.2%' }} />
            </div>
            <div className="text-[10px] text-[#7a8899]">8 Cores @ 3.4GHz • Thread pool nominal</div>
          </div>

          <div className="p-4 bg-[#101318] border border-[#1e2330] rounded-[2px] space-y-3">
            <div className="flex items-center justify-between text-[#55637a] text-[10px] uppercase">
              <span className="flex items-center gap-1.5"><Database size={14} className="text-[#3b82f6]" /> DB CONNECTION POOL</span>
              <span className="text-[#3b82f6]">18 / 100</span>
            </div>
            <div className="w-full bg-[#181d28] h-2">
              <div className="bg-[#3b82f6] h-full" style={{ width: '18%' }} />
            </div>
            <div className="text-[10px] text-[#7a8899]">PostgreSQL 16 • Max latency: 4ms</div>
          </div>

          <div className="p-4 bg-[#101318] border border-[#1e2330] rounded-[2px] space-y-3">
            <div className="flex items-center justify-between text-[#55637a] text-[10px] uppercase">
              <span className="flex items-center gap-1.5"><HardDrive size={14} className="text-[#f59e0b]" /> DISK I/O STORAGE</span>
              <span className="text-[#f59e0b]">42%</span>
            </div>
            <div className="w-full bg-[#181d28] h-2">
              <div className="bg-[#f59e0b] h-full" style={{ width: '42%' }} />
            </div>
            <div className="text-[10px] text-[#7a8899]">NVMe Array • 420 GB / 1.0 TB used</div>
          </div>

          <div className="p-4 bg-[#101318] border border-[#1e2330] rounded-[2px] space-y-3">
            <div className="flex items-center justify-between text-[#55637a] text-[10px] uppercase">
              <span className="flex items-center gap-1.5"><Radio size={14} className="text-[#10b981]" /> WEBSOCKET SOCKETS</span>
              <span className="text-[#10b981]">ONLINE</span>
            </div>
            <div className="w-full bg-[#181d28] h-2">
              <div className="bg-[#10b981] h-full" style={{ width: '100%' }} />
            </div>
            <div className="text-[10px] text-[#7a8899]">14 Active channels • 0 Dropped frames</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
