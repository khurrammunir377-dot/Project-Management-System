import React, { useState } from 'react';
import { useDevHub } from '@/context/DevHubContext';
import {
  FolderGit2, CheckSquare, Bug as BugIcon, UserPlus, Lightbulb, X, Check, Shield
} from 'lucide-react';
import { ProjectStatus, BugSeverity, TaskPriority, Environment } from '@/types';

export const GlobalModals: React.FC = () => {
  const {
    activeModal, closeModal, projects, teamMembers,
    addProject, addTask, addBug, addTeamMember, addIdea, setActiveProjectId
  } = useDevHub();

  // Project Form State
  const [pName, setPName] = useState('');
  const [pCode, setPCode] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pType, setPType] = useState('Web App');
  const [pStack, setPStack] = useState('React, TypeScript, Node.js');
  const [pVersion, setPVersion] = useState('v1.0');
  const [pEnv, setPEnv] = useState<Environment>('Local');
  const [pPath, setPPath] = useState('D:/Projects/new-app');
  const [pRepo, setPRepo] = useState('github.com/kmbdev/new-app');
  const [pServer, setPServer] = useState('http://localhost:3000');
  const [pPort, setPPort] = useState('3000');
  const [pDb, setPDb] = useState('newapp_db');

  // Task Form State
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tProject, setTProject] = useState(projects[0]?.id || 'p1');
  const [tPriority, setTPriority] = useState<TaskPriority>('High');
  const [tAssignee, setTAssignee] = useState(teamMembers[0]?.id || 'tm1');
  const [tDueDate, setTDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [tTags, setTTags] = useState('frontend, core');

  // Bug Form State
  const [bTitle, setBTitle] = useState('');
  const [bDesc, setBDesc] = useState('');
  const [bSteps, setBSteps] = useState('');
  const [bProject, setBProject] = useState(projects[0]?.id || 'p1');
  const [bSeverity, setBSeverity] = useState<BugSeverity>('High');
  const [bEnv, setBEnv] = useState('Local');
  const [bAssignee, setBAssignee] = useState(teamMembers[0]?.id || 'tm2');

  // Team Member Form State
  const [mName, setMName] = useState('');
  const [mRole, setMRole] = useState('Software Engineer');
  const [mEmail, setMEmail] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mAccess, setMAccess] = useState<'SuperAdmin' | 'Lead' | 'Developer' | 'QA' | 'Observer'>('Developer');
  const [mStatus, setMStatus] = useState<'Online' | 'Away' | 'Offline'>('Online');

  // Idea Form State
  const [iTitle, setITitle] = useState('');
  const [iDesc, setIDesc] = useState('');
  const [iProject, setIProject] = useState(projects[0]?.id || 'p1');
  const [iTags, setITags] = useState('architecture, perf');

  if (!activeModal) return null;

  // Handlers
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pCode.trim()) return;

    const newP = addProject({
      name: pName,
      shortCode: pCode.toUpperCase(),
      description: pDesc || 'Project managed via KMB DevHub Control Center.',
      type: pType,
      stack: pStack.split(',').map(s => s.trim()).filter(Boolean),
      version: pVersion,
      status: 'Development',
      progress: 10,
      environment: pEnv,
      localPath: pPath,
      repository: pRepo,
      serverUrl: pServer,
      port: pPort ? parseInt(pPort, 10) : null,
      database: pDb,
      latestBackup: 'N/A',
      owner: teamMembers[0]?.id || 'tm1',
      teamMembers: [teamMembers[0]?.id || 'tm1'],
      tags: ['new', pType.toLowerCase()],
    });

    setActiveProjectId(newP.id);
    closeModal();
    // Reset
    setPName(''); setPCode(''); setPDesc('');
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle.trim()) return;

    addTask({
      projectId: tProject,
      title: tTitle,
      description: tDesc,
      status: 'Todo',
      priority: tPriority,
      assignee: tAssignee,
      dueDate: tDueDate,
      tags: tTags.split(',').map(s => s.trim()).filter(Boolean),
    });

    closeModal();
    setTTitle(''); setTDesc('');
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim()) return;

    addBug({
      projectId: bProject,
      title: bTitle,
      description: bDesc,
      status: 'Open',
      severity: bSeverity,
      reportedBy: teamMembers[0]?.id || 'tm1',
      assignee: bAssignee,
      steps: bSteps,
      environment: bEnv,
    });

    closeModal();
    setBTitle(''); setBDesc(''); setBSteps('');
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !mEmail.trim()) return;

    const initials = mName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'OP';

    addTeamMember({
      name: mName,
      role: mRole,
      email: mEmail,
      phone: mPhone,
      avatar: initials,
      status: mStatus,
      accessLevel: mAccess,
    });

    closeModal();
    setMName(''); setMEmail(''); setMPhone('');
  };

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iTitle.trim()) return;

    addIdea({
      projectId: iProject,
      title: iTitle,
      description: iDesc,
      status: 'New',
      submittedBy: teamMembers[0]?.id || 'tm1',
      tags: iTags.split(',').map(s => s.trim()).filter(Boolean),
    });

    closeModal();
    setITitle(''); setIDesc('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141e] border border-[#00d4c8] rounded-[2px] w-full max-w-xl p-5 font-mono shadow-[0_0_30px_rgba(0,212,200,0.25)] relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e2330] mb-4">
          <div className="flex items-center gap-2">
            {activeModal === 'project' && <FolderGit2 size={16} className="text-[#00d4c8]" />}
            {activeModal === 'task' && <CheckSquare size={16} className="text-[#f59e0b]" />}
            {activeModal === 'bug' && <BugIcon size={16} className="text-[#ef4444]" />}
            {activeModal === 'member' && <UserPlus size={16} className="text-[#00d4c8]" />}
            {activeModal === 'idea' && <Lightbulb size={16} className="text-[#8b5cf6]" />}
            <span className="text-sm font-bold text-[#dce4f0] uppercase tracking-wider">
              {activeModal === 'project' && 'REGISTER NEW PROJECT / REPOSITORY'}
              {activeModal === 'task' && 'DISPATCH NEW ENGINEERING TASK'}
              {activeModal === 'bug' && 'REPORT SYSTEM DEFECT / TELEMETRY BUG'}
              {activeModal === 'member' && 'REGISTER NEW TEAM MEMBER / OPERATOR'}
              {activeModal === 'idea' && 'SUBMIT ARCHITECTURAL PROPOSAL'}
            </span>
          </div>
          <button onClick={closeModal} className="text-[#55637a] hover:text-[#dce4f0] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* ── MODAL 1: NEW PROJECT ── */}
        {activeModal === 'project' && (
          <form onSubmit={handleProjectSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">PROJECT NAME *</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={e => setPName(e.target.value)}
                  placeholder="e.g. Asset Management System"
                  className="w-full bg-[#141820] border border-[#252c3a] focus:border-[#00d4c8] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">SHORT CODE *</label>
                <input
                  type="text"
                  required
                  value={pCode}
                  onChange={e => setPCode(e.target.value)}
                  placeholder="e.g. ASSETS-01"
                  className="w-full bg-[#141820] border border-[#252c3a] focus:border-[#00d4c8] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">TYPE</label>
                <select
                  value={pType}
                  onChange={e => setPType(e.target.value)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
                >
                  <option>Web App</option>
                  <option>API / Backend</option>
                  <option>Mobile App</option>
                  <option>Microservice</option>
                  <option>CLI / Tool</option>
                </select>
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">VERSION</label>
                <input
                  type="text"
                  value={pVersion}
                  onChange={e => setPVersion(e.target.value)}
                  placeholder="v1.0"
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">ENVIRONMENT</label>
                <select
                  value={pEnv}
                  onChange={e => setPEnv(e.target.value as Environment)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
                >
                  <option value="Local">Local</option>
                  <option value="Staging">Staging</option>
                  <option value="Production">Production</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">TECH STACK (comma separated)</label>
              <input
                type="text"
                value={pStack}
                onChange={e => setPStack(e.target.value)}
                placeholder="Django, PostgreSQL, React"
                className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">LOCAL DISK PATH</label>
                <input
                  type="text"
                  value={pPath}
                  onChange={e => setPPath(e.target.value)}
                  placeholder="D:/Projects/ams-core"
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">GIT REPOSITORY</label>
                <input
                  type="text"
                  value={pRepo}
                  onChange={e => setPRepo(e.target.value)}
                  placeholder="github.com/kmbdev/ams"
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e2330]">
              <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs text-[#7a8899] hover:text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                CANCEL
              </button>
              <button type="submit" className="px-4 py-1.5 text-xs bg-[#00d4c8] text-black font-bold rounded-[2px] hover:bg-[#00e5d8] shadow-[0_0_10px_rgba(0,212,200,0.3)]">
                CONFIRM REGISTRATION
              </button>
            </div>
          </form>
        )}

        {/* ── MODAL 2: NEW TASK ── */}
        {activeModal === 'task' && (
          <form onSubmit={handleTaskSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">TARGET PROJECT *</label>
              <select
                value={tProject}
                onChange={e => setTProject(e.target.value)}
                className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.shortCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">TASK TITLE *</label>
              <input
                type="text"
                required
                value={tTitle}
                onChange={e => setTTitle(e.target.value)}
                placeholder="e.g. Implement webhook retry mechanism"
                className="w-full bg-[#141820] border border-[#252c3a] focus:border-[#00d4c8] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">PRIORITY</label>
                <select
                  value={tPriority}
                  onChange={e => setTPriority(e.target.value as TaskPriority)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">ASSIGNEE</label>
                <select
                  value={tAssignee}
                  onChange={e => setTAssignee(e.target.value)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">DUE DATE</label>
                <input
                  type="date"
                  value={tDueDate}
                  onChange={e => setTDueDate(e.target.value)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">TAGS (comma separated)</label>
              <input
                type="text"
                value={tTags}
                onChange={e => setTTags(e.target.value)}
                placeholder="backend, api, db"
                className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e2330]">
              <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs text-[#7a8899] hover:text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                CANCEL
              </button>
              <button type="submit" className="px-4 py-1.5 text-xs bg-[#f59e0b] text-black font-bold rounded-[2px] hover:bg-[#ffb020]">
                CREATE TASK
              </button>
            </div>
          </form>
        )}

        {/* ── MODAL 3: REPORT BUG ── */}
        {activeModal === 'bug' && (
          <form onSubmit={handleBugSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">TARGET PROJECT *</label>
              <select
                value={bProject}
                onChange={e => setBProject(e.target.value)}
                className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.shortCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">DEFECT / BUG TITLE *</label>
              <input
                type="text"
                required
                value={bTitle}
                onChange={e => setBTitle(e.target.value)}
                placeholder="e.g. Memory leak during large CSV batch import"
                className="w-full bg-[#141820] border border-[#252c3a] focus:border-[#ef4444] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">SEVERITY</label>
                <select
                  value={bSeverity}
                  onChange={e => setBSeverity(e.target.value as BugSeverity)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#ef4444] font-bold px-2 py-1.5 outline-none rounded-[2px]"
                >
                  <option value="Critical">Critical (Blocker)</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">ENVIRONMENT</label>
                <select
                  value={bEnv}
                  onChange={e => setBEnv(e.target.value)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
                >
                  <option>Local</option>
                  <option>Staging</option>
                  <option>Production</option>
                </select>
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">ASSIGN TO</label>
                <select
                  value={bAssignee}
                  onChange={e => setBAssignee(e.target.value)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">STEPS TO REPRODUCE</label>
              <textarea
                rows={2}
                value={bSteps}
                onChange={e => setBSteps(e.target.value)}
                placeholder="1. Open upload form... 2. Submit file > 50MB..."
                className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e2330]">
              <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs text-[#7a8899] hover:text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                CANCEL
              </button>
              <button type="submit" className="px-4 py-1.5 text-xs bg-[#ef4444] text-white font-bold rounded-[2px] hover:bg-[#ff5555] shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                DISPATCH BUG TICKET
              </button>
            </div>
          </form>
        )}

        {/* ── MODAL 4: ADD TEAM MEMBER / OPERATOR ── */}
        {activeModal === 'member' && (
          <form onSubmit={handleMemberSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={mName}
                  onChange={e => setMName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-[#141820] border border-[#252c3a] focus:border-[#00d4c8] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">ENGINEERING ROLE *</label>
                <input
                  type="text"
                  required
                  value={mRole}
                  onChange={e => setMRole(e.target.value)}
                  placeholder="e.g. Full Stack Engineer / DevOps"
                  className="w-full bg-[#141820] border border-[#252c3a] focus:border-[#00d4c8] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">OFFICIAL EMAIL *</label>
                <input
                  type="email"
                  required
                  value={mEmail}
                  onChange={e => setMEmail(e.target.value)}
                  placeholder="tariq@kmbdev.com"
                  className="w-full bg-[#141820] border border-[#252c3a] focus:border-[#00d4c8] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">PHONE NUMBER</label>
                <input
                  type="text"
                  value={mPhone}
                  onChange={e => setMPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">ACCESS / CLEARANCE LEVEL</label>
                <select
                  value={mAccess}
                  onChange={e => setMAccess(e.target.value as any)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#00d4c8] font-bold px-2 py-1.5 outline-none rounded-[2px]"
                >
                  <option value="Developer">Developer (Standard Read/Write)</option>
                  <option value="Lead">Lead Engineer (Deploy Access)</option>
                  <option value="SuperAdmin">SuperAdmin (Full Root Control)</option>
                  <option value="QA">QA / Tester (Bug & Audit)</option>
                  <option value="Observer">Observer (Read-Only)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#55637a] text-[10px] uppercase mb-1">INITIAL STATUS</label>
                <select
                  value={mStatus}
                  onChange={e => setMStatus(e.target.value as any)}
                  className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
                >
                  <option value="Online">Online</option>
                  <option value="Away">Away</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e2330]">
              <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs text-[#7a8899] hover:text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                CANCEL
              </button>
              <button type="submit" className="px-4 py-1.5 text-xs bg-[#00d4c8] text-black font-bold rounded-[2px] hover:bg-[#00e5d8] shadow-[0_0_10px_rgba(0,212,200,0.3)]">
                REGISTER OPERATOR
              </button>
            </div>
          </form>
        )}

        {/* ── MODAL 5: LOG IDEA ── */}
        {activeModal === 'idea' && (
          <form onSubmit={handleIdeaSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">TARGET PROJECT *</label>
              <select
                value={iProject}
                onChange={e => setIProject(e.target.value)}
                className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2 py-1.5 outline-none rounded-[2px]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.shortCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">PROPOSAL TITLE *</label>
              <input
                type="text"
                required
                value={iTitle}
                onChange={e => setITitle(e.target.value)}
                placeholder="e.g. Distributed caching via Dragonfly DB"
                className="w-full bg-[#141820] border border-[#252c3a] focus:border-[#8b5cf6] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
              />
            </div>

            <div>
              <label className="block text-[#55637a] text-[10px] uppercase mb-1">TECHNICAL JUSTIFICATION</label>
              <textarea
                rows={3}
                value={iDesc}
                onChange={e => setIDesc(e.target.value)}
                placeholder="Describe architectural advantages, bench results, or implementation roadmap..."
                className="w-full bg-[#141820] border border-[#252c3a] text-[#dce4f0] px-2.5 py-1.5 outline-none rounded-[2px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e2330]">
              <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs text-[#7a8899] hover:text-[#dce4f0] border border-[#252c3a] rounded-[2px]">
                CANCEL
              </button>
              <button type="submit" className="px-4 py-1.5 text-xs bg-[#8b5cf6] text-white font-bold rounded-[2px] hover:bg-[#9d74f8]">
                SUBMIT PROPOSAL
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default GlobalModals;
