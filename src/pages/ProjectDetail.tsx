import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDevHub } from '@/context/DevHubContext';
import { getMemberById } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import ActivityFeed from '@/components/ui/ActivityFeed';
import {
  FolderGit2,
  ExternalLink,
  Plus,
  Bug,
  Tag,
  Copy,
  Check,
  Trash2,
  Upload,
  Image,
  FileArchive,
  Download,
  Eye,
  X,
  Mail,
  Server,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { ProjectScreenshot, ProjectZipArchive } from '@/types';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    projects,
    tasks: allTasks,
    bugs: allBugs,
    versions: allVersions,
    activities: allActivities,
    teamMembers,
    openModal,
    deleteProject,
    addProjectScreenshot,
    deleteProjectScreenshot,
    addProjectZipArchive,
    deleteProjectZipArchive,
  } = useDevHub();

  const project = projects.find((p) => p.id === id) || projects[0];

  const [activeTab, setActiveTab] = useState<string>('OVERVIEW');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  // Upload inputs
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const [screenshotCaption, setScreenshotCaption] = useState('');
  const [zipVersionTag, setZipVersionTag] = useState('v1.0-bundle');

  // Notes
  const [quickNote, setQuickNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>([
    'Verified production deployment and database migrations.',
    'Source repository and active server endpoints synchronized.',
  ]);

  if (!project) {
    return (
      <div className="p-8 text-center font-mono text-xs text-[#55637a]">
        PROJECT REPOSITORY NOT FOUND
      </div>
    );
  }

  // Associated resources
  const tasks = allTasks.filter((t) => t.projectId === project.id);
  const bugs = allBugs.filter((b) => b.projectId === project.id);
  const versions = allVersions.filter((v) => v.projectId === project.id);
  const projectActivities = allActivities.filter((a) => a.projectId === project.id);
  const owner = getMemberById(project.owner, teamMembers);
  const screenshots = project.screenshots || [];
  const zipArchives = project.zipArchives || [];

  const tabs = [
    'OVERVIEW',
    `SCREENSHOTS (${screenshots.length})`,
    `CODE ARCHIVES (${zipArchives.length})`,
    `TASKS (${tasks.length})`,
    `BUGS (${bugs.length})`,
    `VERSIONS (${versions.length})`,
    'FILES & REPOS',
    'TEAM',
    'ACTIVITY',
  ];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    setNotesList((prev) => [quickNote.trim(), ...prev]);
    setQuickNote('');
  };

  // Handle Screenshot Upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addProjectScreenshot(project.id, {
        name: file.name,
        dataUrl,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        caption: screenshotCaption.trim() || file.name,
      });
      setScreenshotCaption('');
    };
    reader.readAsDataURL(file);
  };

  // Handle Zip Upload
  const handleZipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addProjectZipArchive(project.id, {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        versionTag: zipVersionTag.trim() || 'v1.0-release',
        dataUrl,
        checksum: `sha256:${Math.random().toString(36).substring(2, 12)}`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate('/projects');
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8">
      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between font-mono text-[11px] text-[#55637a]">
        <div className="flex items-center gap-2">
          <Link to="/projects" className="hover:text-[#00d4c8] transition-colors">
            PROJECTS ({projects.length})
          </Link>
          <span>/</span>
          <span className="text-[#00d4c8] font-bold">{project.shortCode}</span>
          <span>/</span>
          <span className="text-[#a0aec0] uppercase">WORKSPACE CONSOLE</span>
        </div>

        {/* Delete Project Trigger */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1 text-[#ef4444] hover:text-[#ff7070] px-2 py-1 bg-[#ef444410] border border-[#ef444430] hover:border-[#ef444460] rounded-[2px] transition-colors"
          title="Delete project from registry"
        >
          <Trash2 size={12} />
          <span>DELETE PROJECT</span>
        </button>
      </div>

      {/* ── PROJECT HEADER SECTION ───────────────────────────────────── */}
      <div className="p-4 sm:p-5 bg-[#101318] border border-[#1e2330] rounded-[2px] space-y-4 bg-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono font-bold text-sm text-[#00d4c8] bg-[#00d4c810] px-2 py-0.5 rounded-[2px] border border-[#00d4c840]">
                {project.shortCode}
              </span>
              <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#dce4f0] uppercase">
                {project.name}
              </h1>
            </div>

            {/* Sub-header spec line */}
            <div className="flex items-center gap-2 mt-1.5 font-mono text-xs text-[#7a8899] flex-wrap">
              <span className="text-[#00d4c8] font-bold">{project.version}</span>
              <span>•</span>
              <StatusBadge status={project.status} size="xs" />
              <span>•</span>
              <span>{project.stack.join(' / ')}</span>
              <span>•</span>
              <span className="text-[#55637a]">{project.type}</span>
              {project.accountEmail && (
                <>
                  <span>•</span>
                  <span className="text-[#a0aec0] flex items-center gap-1">
                    <Mail size={11} className="text-[#00d4c8]" /> {project.accountEmail}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {project.repository && (
              <a
                href={project.repository.startsWith('http') ? project.repository : `https://${project.repository}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141824] hover:bg-[#1a2130] border border-[#252f44] hover:border-[#00d4c840] text-[#dce4f0] font-mono text-xs rounded-[2px] transition-colors"
              >
                <FolderGit2 size={13} className="text-[#00d4c8]" />
                <span>OPEN REPOSITORY</span>
              </a>
            )}

            {(project.liveUrl || project.serverUrl) && (
              <a
                href={project.liveUrl || project.serverUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141824] hover:bg-[#1a2130] border border-[#252f44] hover:border-[#10b98140] text-[#dce4f0] font-mono text-xs rounded-[2px] transition-colors"
              >
                <ExternalLink size={13} className="text-[#10b981]" />
                <span>OPEN LIVE SYSTEM</span>
              </a>
            )}

            <button
              onClick={() => openModal('task')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4c815] hover:bg-[#00d4c825] border border-[#00d4c850] text-[#00d4c8] font-mono text-xs font-semibold rounded-[2px] transition-colors"
            >
              <Plus size={13} />
              <span>ADD TASK</span>
            </button>

            <button
              onClick={() => openModal('bug')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ef444415] hover:bg-[#ef444425] border border-[#ef444450] text-[#ef4444] font-mono text-xs font-semibold rounded-[2px] transition-colors"
            >
              <Bug size={13} />
              <span>REPORT BUG</span>
            </button>
          </div>
        </div>

        {/* Quick Technical Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-3 border-t border-[#1e2330]">
          {/* Local Path */}
          <div className="p-2 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider">
              LOCAL PATH
            </span>
            <div className="flex items-center justify-between gap-1 mt-0.5">
              <span className="font-mono text-[11px] text-[#dce4f0] truncate" title={project.localPath}>
                {project.localPath}
              </span>
              <button
                onClick={() => handleCopy(project.localPath, 'path')}
                className="text-[#55637a] hover:text-[#00d4c8]"
              >
                {copiedField === 'path' ? <Check size={11} className="text-[#10b981]" /> : <Copy size={11} />}
              </button>
            </div>
          </div>

          {/* Repository */}
          <div className="p-2 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider">
              REPOSITORY
            </span>
            <span className="font-mono text-[11px] text-[#00d4c8] truncate mt-0.5" title={project.repository}>
              {project.repository}
            </span>
          </div>

          {/* Server / Port */}
          <div className="p-2 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider">
              SERVER & PORT
            </span>
            <span className="font-mono text-[11px] text-[#dce4f0] truncate mt-0.5">
              {project.serverUrl || 'N/A'} {project.port ? `(:${project.port})` : ''}
            </span>
          </div>

          {/* Database */}
          <div className="p-2 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider">
              DATABASE
            </span>
            <span className="font-mono text-[11px] text-[#dce4f0] truncate mt-0.5">
              {project.database}
            </span>
          </div>

          {/* Latest Backup */}
          <div className="p-2 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider">
              LATEST BACKUP
            </span>
            <span className="font-mono text-[11px] text-[#10b981] truncate mt-0.5">
              {project.latestBackup === 'N/A' ? 'None' : new Date(project.latestBackup).toLocaleDateString()}
            </span>
          </div>

          {/* Last Updated */}
          <div className="p-2 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider">
              LAST UPDATED
            </span>
            <span className="font-mono text-[11px] text-[#7a8899] truncate mt-0.5">
              {new Date(project.lastUpdated).toLocaleDateString()}
            </span>
          </div>

          {/* Owner */}
          <div className="p-2 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-[9px] text-[#55637a] uppercase tracking-wider">
              PRIMARY OWNER
            </span>
            <span className="font-mono text-[11px] text-[#dce4f0] truncate mt-0.5 font-bold">
              {owner?.name || 'Khurram Munir'}
            </span>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE TAB NAVIGATION ─────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-[#1e2330] overflow-x-auto bg-[#0a0c0f]">
        {tabs.map((tab) => {
          const isSelected =
            activeTab === tab ||
            (activeTab.startsWith('SCREENSHOTS') && tab.startsWith('SCREENSHOTS')) ||
            (activeTab.startsWith('CODE') && tab.startsWith('CODE')) ||
            (activeTab.startsWith('TASKS') && tab.startsWith('TASKS')) ||
            (activeTab.startsWith('BUGS') && tab.startsWith('BUGS')) ||
            (activeTab.startsWith('VERSIONS') && tab.startsWith('VERSIONS'));
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-xs uppercase tracking-wider px-3.5 py-2.5 transition-all border-b-2 whitespace-nowrap ${
                isSelected
                  ? 'border-[#00d4c8] text-[#00d4c8] font-bold bg-[#00d4c808]'
                  : 'border-transparent text-[#7a8899] hover:text-[#dce4f0] hover:bg-[#121622]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT REGION ───────────────────────────────────────── */}
      <div className="bg-[#101318] border border-[#1e2330] rounded-[2px] p-4 min-h-[380px]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-mono text-xs font-bold text-[#55637a] uppercase tracking-widest mb-1.5">
                  SYSTEM OVERVIEW & SCOPE
                </h3>
                <p className="text-sm text-[#c5d1e0] leading-relaxed font-sans bg-[#0c0e14] p-3 border border-[#1a1f2c] rounded-[2px]">
                  {project.description}
                </p>
                {project.platformInfo && (
                  <div className="mt-2 p-2 bg-[#141824] border border-[#252f44] rounded-[2px] text-xs font-mono text-[#00d4c8] flex items-center gap-2">
                    <Server size={13} />
                    <span>Deployment Platform: {project.platformInfo}</span>
                  </div>
                )}
              </div>

              {/* Progress Detail */}
              <div>
                <h3 className="font-mono text-xs font-bold text-[#55637a] uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>COMPLETION STATUS</span>
                  <span className="text-[#00d4c8]">{project.progress}%</span>
                </h3>
                <div className="w-full bg-[#181d28] h-2 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-[#00d4c8] shadow-[0_0_8px_#00d4c8]"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Operator Scratchpad */}
              <div>
                <h3 className="font-mono text-xs font-bold text-[#55637a] uppercase tracking-widest mb-1.5">
                  OPERATOR SCRATCHPAD & NOTES
                </h3>
                <form onSubmit={handleAddNote} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    placeholder="Add operator log note or deployment milestone..."
                    className="flex-1 bg-[#141820] text-xs font-mono text-[#dce4f0] px-2.5 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#00d4c815] text-[#00d4c8] border border-[#00d4c850] font-mono text-xs font-bold rounded-[2px]"
                  >
                    + ADD NOTE
                  </button>
                </form>
                <div className="space-y-1.5">
                  {notesList.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-[#0c0e14] border border-[#1a1f2c] text-xs font-mono text-[#a0aec0] rounded-[2px] flex items-start gap-2"
                    >
                      <span className="text-[#00d4c8] font-bold">›</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-mono text-xs font-bold text-[#55637a] uppercase tracking-widest mb-1.5">
                  PROJECT LABELS
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {project.tags.map((tg) => (
                    <span
                      key={tg}
                      className="font-mono text-[10px] px-2 py-0.5 bg-[#141824] border border-[#252f44] text-[#a0aec0] rounded-[2px]"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Side summary & Artifact counts */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px]">
                  <span className="font-mono text-[9px] text-[#55637a] uppercase">SCREENSHOTS</span>
                  <div className="font-mono text-xl font-bold text-[#00d4c8] mt-0.5">
                    {screenshots.length}
                  </div>
                </div>
                <div className="p-3 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px]">
                  <span className="font-mono text-[9px] text-[#55637a] uppercase">ZIP ARCHIVES</span>
                  <div className="font-mono text-xl font-bold text-[#38bdf8] mt-0.5">
                    {zipArchives.length}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px]">
                  <span className="font-mono text-[9px] text-[#55637a] uppercase">OPEN TASKS</span>
                  <div className="font-mono text-xl font-bold text-[#f59e0b] mt-0.5">
                    {tasks.filter((t) => t.status !== 'Done').length}
                  </div>
                </div>
                <div className="p-3 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px]">
                  <span className="font-mono text-[9px] text-[#55637a] uppercase">OPEN DEFECTS</span>
                  <div className="font-mono text-xl font-bold text-[#ef4444] mt-0.5">
                    {bugs.filter((b) => b.status === 'Open' || b.status === 'In Progress').length}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs font-bold text-[#55637a] uppercase tracking-widest mb-1.5">
                  LATEST PROJECT EVENTS
                </h3>
                <div className="bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] p-2 max-h-60 overflow-y-auto">
                  <ActivityFeed events={projectActivities} limit={4} compact />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCREENSHOTS UPLOAD & GALLERY */}
        {activeTab.startsWith('SCREENSHOTS') && (
          <div className="space-y-4">
            {/* Upload Toolbar */}
            <div className="p-3 bg-[#0c0e14] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  value={screenshotCaption}
                  onChange={(e) => setScreenshotCaption(e.target.value)}
                  placeholder="Screenshot title / caption (optional)..."
                  className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] px-2.5 py-1.5 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={screenshotInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
                <button
                  onClick={() => screenshotInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono text-xs font-bold rounded-[2px] transition-all shadow-[0_0_10px_rgba(0,212,200,0.25)]"
                >
                  <Upload size={13} /> UPLOAD SCREENSHOT
                </button>
              </div>
            </div>

            {/* Screenshots Gallery Grid */}
            {screenshots.length === 0 ? (
              <div className="p-12 text-center font-mono text-xs text-[#55637a] border border-dashed border-[#1e2330] rounded-[2px]">
                <Image size={24} className="mx-auto mb-2 text-[#404d60]" />
                <p>NO SCREENSHOTS UPLOADED YET</p>
                <p className="text-[10px] text-[#404d60] mt-1">
                  Upload UI screenshots or architectural diagrams for this project.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {screenshots.map((ss) => (
                  <div
                    key={ss.id}
                    className="bg-[#0c0e14] border border-[#1e2330] hover:border-[#00d4c840] rounded-[2px] overflow-hidden group flex flex-col justify-between"
                  >
                    <div
                      className="h-36 bg-[#141824] relative cursor-pointer overflow-hidden flex items-center justify-center"
                      onClick={() => setSelectedImagePreview(ss.dataUrl)}
                    >
                      <img
                        src={ss.dataUrl}
                        alt={ss.caption || ss.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye size={18} className="text-[#00d4c8]" />
                      </div>
                    </div>

                    <div className="p-2.5 space-y-1 font-mono">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#dce4f0] truncate">
                        <span className="truncate">{ss.caption || ss.name}</span>
                        <span className="text-[10px] text-[#55637a] flex-shrink-0 ml-1">{ss.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#55637a]">
                        <span>{new Date(ss.uploadedAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => deleteProjectScreenshot(project.id, ss.id)}
                          className="text-[#ef4444] hover:text-[#ff7070] flex items-center gap-0.5"
                          title="Delete screenshot"
                        >
                          <Trash2 size={11} /> DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CODE ZIP ARCHIVES UPLOADER & MANAGER */}
        {activeTab.startsWith('CODE') && (
          <div className="space-y-4">
            {/* Zip Upload Toolbar */}
            <div className="p-3 bg-[#0c0e14] border border-[#1e2330] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  value={zipVersionTag}
                  onChange={(e) => setZipVersionTag(e.target.value)}
                  placeholder="Version Tag (e.g. v2.0-release)..."
                  className="w-full bg-[#141820] text-xs font-mono text-[#dce4f0] px-2.5 py-1.5 border border-[#252c3a] focus:border-[#38bdf8] outline-none rounded-[2px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip,.tar.gz,.rar,.7z"
                  onChange={handleZipUpload}
                  className="hidden"
                />
                <button
                  onClick={() => zipInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#38bdf8] hover:bg-[#60a5fa] text-black font-mono text-xs font-bold rounded-[2px] transition-all shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                >
                  <FileArchive size={13} /> UPLOAD CODE .ZIP BUNDLE
                </button>
              </div>
            </div>

            {/* Zip Archives List */}
            {zipArchives.length === 0 ? (
              <div className="p-12 text-center font-mono text-xs text-[#55637a] border border-dashed border-[#1e2330] rounded-[2px]">
                <FileArchive size={24} className="mx-auto mb-2 text-[#404d60]" />
                <p>NO SOURCE CODE ARCHIVES STORED</p>
                <p className="text-[10px] text-[#404d60] mt-1">
                  Upload completed code `.zip` bundles or export packages for long-term archiving.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {zipArchives.map((zip) => (
                  <div
                    key={zip.id}
                    className="p-3 bg-[#0c0e14] border border-[#1e2330] hover:border-[#38bdf840] rounded-[2px] flex items-center justify-between gap-3 font-mono text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#38bdf815] border border-[#38bdf840] text-[#38bdf8] rounded-[2px]">
                        <FileArchive size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#dce4f0]">{zip.name}</span>
                          <span className="text-[10px] bg-[#38bdf815] text-[#38bdf8] px-1.5 py-0.2 rounded-[2px] border border-[#38bdf830]">
                            {zip.versionTag}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#55637a] mt-0.5">
                          Size: {zip.size} • Uploaded: {new Date(zip.uploadedAt).toLocaleDateString()} • {zip.checksum}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {zip.dataUrl && (
                        <a
                          href={zip.dataUrl}
                          download={zip.name}
                          className="flex items-center gap-1 px-2.5 py-1 bg-[#141824] hover:bg-[#1a2130] text-[#38bdf8] border border-[#252f44] rounded-[2px]"
                        >
                          <Download size={11} /> DOWNLOAD .ZIP
                        </a>
                      )}
                      <button
                        onClick={() => deleteProjectZipArchive(project.id, zip.id)}
                        className="text-[#ef4444] hover:text-[#ff7070] p-1 rounded-[2px]"
                        title="Delete code archive"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TASKS */}
        {activeTab.startsWith('TASKS') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#55637a] uppercase tracking-wider">
                ASSIGNED ACTION ITEMS
              </span>
              <button
                onClick={() => openModal('task')}
                className="font-mono text-xs text-[#00d4c8] hover:underline"
              >
                + CREATE TASK
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-[#55637a]">
                NO ACTIVE TASKS FOR THIS UNIT
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left cmd-table">
                  <thead>
                    <tr className="bg-[#0b0e14]">
                      <th>TASK DESCRIPTION</th>
                      <th>STATUS</th>
                      <th>PRIORITY</th>
                      <th>ASSIGNEE</th>
                      <th>DUE DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161b24] font-mono text-xs">
                    {tasks.map((task) => {
                      const assignee = getMemberById(task.assignee, teamMembers);
                      return (
                        <tr key={task.id} className="hover:bg-[#151a24]">
                          <td className="text-[#dce4f0] font-sans font-medium">{task.title}</td>
                          <td>
                            <StatusBadge status={task.status} size="xs" />
                          </td>
                          <td>
                            <span
                              className={`text-[10px] font-bold ${
                                task.priority === 'High' ? 'text-[#ef4444]' : 'text-[#f59e0b]'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="text-[#a0aec0]">{assignee?.name || 'Unassigned'}</td>
                          <td className="text-[#6b7b94]">{task.dueDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BUGS */}
        {activeTab.startsWith('BUGS') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#55637a] uppercase tracking-wider">
                TELEMETRY DEFECTS
              </span>
              <button
                onClick={() => openModal('bug')}
                className="font-mono text-xs text-[#ef4444] hover:underline"
              >
                + REPORT DEFECT
              </button>
            </div>

            {bugs.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-[#10b981] bg-[#10b98108] border border-[#10b98125]">
                ✓ ZERO ACTIVE BUGS REPORTED FOR THIS UNIT
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left cmd-table">
                  <thead>
                    <tr className="bg-[#0b0e14]">
                      <th>BUG ID</th>
                      <th>TITLE</th>
                      <th>SEVERITY</th>
                      <th>STATUS</th>
                      <th>ENVIRONMENT</th>
                      <th>REPORTER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161b24] font-mono text-xs">
                    {bugs.map((bug) => {
                      const rep = getMemberById(bug.reportedBy, teamMembers);
                      return (
                        <tr key={bug.id} className="hover:bg-[#151a24]">
                          <td className="text-[#ef4444] font-bold">{bug.id.toUpperCase()}</td>
                          <td className="text-[#dce4f0] font-sans">{bug.title}</td>
                          <td>
                            <span className="text-[10px] text-[#ef4444] bg-[#ef444415] px-1.5 py-0.5 rounded-[2px] border border-[#ef444430] font-bold">
                              {bug.severity}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={bug.status} size="xs" />
                          </td>
                          <td className="text-[#6b7b94]">{bug.environment}</td>
                          <td className="text-[#a0aec0]">{rep?.name || 'QA'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: VERSIONS */}
        {activeTab.startsWith('VERSIONS') && (
          <div className="space-y-3">
            <span className="font-mono text-xs text-[#55637a] uppercase tracking-wider block">
              TAGGED RELEASES & PRODUCTION BUILDS
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left cmd-table">
                <thead>
                  <tr className="bg-[#0b0e14]">
                    <th>VERSION TAG</th>
                    <th>RELEASE DATE</th>
                    <th>TARGET ENV</th>
                    <th>DEPLOYED BY</th>
                    <th>CHANGELOG / RELEASE NOTES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161b24] font-mono text-xs">
                  {versions.map((ver) => {
                    const deployer = getMemberById(ver.deployedBy, teamMembers);
                    return (
                      <tr key={ver.id} className="hover:bg-[#151a24]">
                        <td className="text-[#00d4c8] font-bold">{ver.version}</td>
                        <td className="text-[#6b7b94]">{ver.releaseDate}</td>
                        <td>
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#10b98115] border border-[#10b98135] text-[#10b981] font-bold rounded-[2px]">
                            {ver.environment}
                          </span>
                        </td>
                        <td className="text-[#dce4f0]">{deployer?.name || 'Admin'}</td>
                        <td className="text-[#a0aec0] font-sans">{ver.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: FILES & REPOS */}
        {activeTab === 'FILES & REPOS' && (
          <div className="space-y-3 font-mono text-xs">
            <span className="text-xs text-[#55637a] uppercase tracking-wider block">
              CONFIGURATIONS & PLATFORM ACCESS
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] space-y-2">
                <span className="text-[11px] font-bold text-[#00d4c8] block uppercase">
                  REPOSITORY & LOCAL DISK
                </span>
                <p className="text-[11px] text-[#7a8899]">
                  Path: <code className="text-[#dce4f0]">{project.localPath}</code>
                </p>
                <p className="text-[11px] text-[#7a8899]">
                  Remote: <code className="text-[#00d4c8]">{project.repository}</code>
                </p>
              </div>
              <div className="p-3 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] space-y-2">
                <span className="text-[11px] font-bold text-[#10b981] block uppercase">
                  DATABASE & BACKUP SPEC
                </span>
                <p className="text-[11px] text-[#7a8899]">
                  Database: <code className="text-[#dce4f0]">{project.database}</code>
                </p>
                <p className="text-[11px] text-[#7a8899]">
                  Latest Backup: <code className="text-[#10b981]">{project.latestBackup}</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: TEAM */}
        {activeTab === 'TEAM' && (
          <div className="space-y-3">
            <span className="font-mono text-xs text-[#55637a] uppercase tracking-wider block">
              ASSIGNED REPOSITORY CONTRIBUTORS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.teamMembers.map((memberId) => {
                const member = getMemberById(memberId, teamMembers);
                if (!member) return null;
                return (
                  <div
                    key={member.id}
                    className="p-3 bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-[2px] bg-[#141d2d] border border-[#00d4c8] flex items-center justify-center font-mono text-xs font-bold text-[#00d4c8]">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-xs text-[#dce4f0]">
                        {member.name}
                      </div>
                      <div className="font-mono text-[10px] text-[#6b7b94]">{member.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 9: ACTIVITY */}
        {activeTab === 'ACTIVITY' && (
          <div className="space-y-3">
            <span className="font-mono text-xs text-[#55637a] uppercase tracking-wider block">
              AUDIT LOG & COMMITS
            </span>
            <div className="bg-[#0c0e14] border border-[#1a1f2c] rounded-[2px] p-3">
              <ActivityFeed events={projectActivities} limit={15} />
            </div>
          </div>
        )}
      </div>

      {/* ── LIGHTBOX MODAL FOR SCREENSHOT PREVIEW ──────────────────── */}
      {selectedImagePreview && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setSelectedImagePreview(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-[#10141e] border border-[#00d4c8] p-2 rounded-[2px]">
            <button
              onClick={() => setSelectedImagePreview(null)}
              className="absolute -top-3 -right-3 w-7 h-7 bg-[#ef4444] text-white rounded-full flex items-center justify-center font-bold"
            >
              <X size={14} />
            </button>
            <img
              src={selectedImagePreview}
              alt="Screenshot Preview"
              className="max-h-[80vh] max-w-full object-contain mx-auto"
            />
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ──────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#10141e] border border-[#ef4444] rounded-[2px] w-full max-w-md p-5 font-mono shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <div className="flex items-center gap-2 text-[#ef4444] mb-3">
              <AlertTriangle size={20} />
              <span className="font-bold text-sm uppercase">CONFIRM PROJECT DELETION</span>
            </div>
            <p className="text-xs text-[#dce4f0] mb-4">
              Are you sure you want to permanently delete <span className="text-[#00d4c8] font-bold">{project.name}</span> ({project.shortCode}) and all its associated tasks and bugs?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs text-[#7a8899] hover:text-[#dce4f0] border border-[#252c3a] rounded-[2px]"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteProject}
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
export default ProjectDetail;
