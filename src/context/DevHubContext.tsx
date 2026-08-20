import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project, Task, Bug, TeamMember, ActivityEvent, Version, Idea, Suggestion,
  VisitorSession, UserAccount, SecurityAuditLog, AppTheme, ProjectScreenshot, ProjectZipArchive
} from '@/types';
import {
  initialProjects, initialTasks, initialBugs, initialTeamMembers,
  initialActivities, initialVersions, initialIdeas, initialSuggestions,
  initialVisitors, initialUserAccounts, initialSecurityLogs
} from '@/data/mockData';

interface DevHubContextType {
  // Theme
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  // Data
  projects: Project[];
  tasks: Task[];
  bugs: Bug[];
  teamMembers: TeamMember[];
  activities: ActivityEvent[];
  versions: Version[];
  ideas: Idea[];
  suggestions: Suggestion[];
  visitors: VisitorSession[];
  users: UserAccount[];
  securityLogs: SecurityAuditLog[];

  // Active Target Context
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  activeProject: Project | undefined;

  // Mutators
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'lastUpdated' | 'openBugs' | 'openTasks'>) => Project;
  deleteProject: (id: string) => void;
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  deleteTask: (id: string) => void;
  addBug: (b: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>) => Bug;
  deleteBug: (id: string) => void;
  addIdea: (i: Omit<Idea, 'id' | 'createdAt' | 'votes'>) => Idea;
  deleteIdea: (id: string) => void;
  voteIdea: (id: string) => void;
  addTeamMember: (m: Omit<TeamMember, 'id' | 'joinedAt'>) => TeamMember;
  deleteTeamMember: (id: string) => void;
  updateMemberStatus: (id: string, status: 'Online' | 'Away' | 'Offline') => void;

  // Project Attachments (Screenshots & Code Zip archives)
  addProjectScreenshot: (projectId: string, screenshot: Omit<ProjectScreenshot, 'id' | 'uploadedAt'>) => void;
  deleteProjectScreenshot: (projectId: string, screenshotId: string) => void;
  addProjectZipArchive: (projectId: string, archive: Omit<ProjectZipArchive, 'id' | 'uploadedAt'>) => void;
  deleteProjectZipArchive: (projectId: string, archiveId: string) => void;

  // Admin Controls
  toggleUserStatus: (id: string) => void;
  blockVisitor: (id: string) => void;
  terminateVisitorSession: (id: string) => void;
  clearSecurityLogs: () => void;

  // Global Quick Add Modal State
  activeModal: 'project' | 'task' | 'bug' | 'idea' | 'member' | null;
  openModal: (type: 'project' | 'task' | 'bug' | 'idea' | 'member') => void;
  closeModal: () => void;
}

const DevHubContext = createContext<DevHubContextType | undefined>(undefined);

export const DevHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('kmb_devhub_theme') as AppTheme;
    return saved || 'cyber-teal';
  });

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem('kmb_devhub_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Data States
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('kmb_devhub_projects_v2');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kmb_devhub_tasks_v2');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [bugs, setBugs] = useState<Bug[]>(() => {
    const saved = localStorage.getItem('kmb_devhub_bugs_v2');
    return saved ? JSON.parse(saved) : initialBugs;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('kmb_devhub_team_v2');
    return saved ? JSON.parse(saved) : initialTeamMembers;
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('kmb_devhub_activities_v2');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [versions, setVersions] = useState<Version[]>(initialVersions);
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [visitors, setVisitors] = useState<VisitorSession[]>(initialVisitors);
  const [users, setUsers] = useState<UserAccount[]>(initialUserAccounts);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>(initialSecurityLogs);

  // Active Project Selection (defaults to p8 DevHub, or null for ALL)
  const [activeProjectId, setActiveProjectId] = useState<string | null>('p8');
  const [activeModal, setActiveModal] = useState<'project' | 'task' | 'bug' | 'idea' | 'member' | null>(null);

  const activeProject = activeProjectId ? projects.find(p => p.id === activeProjectId) : undefined;

  // Persist important data
  useEffect(() => {
    localStorage.setItem('kmb_devhub_projects_v2', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('kmb_devhub_team_v2', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('kmb_devhub_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kmb_devhub_bugs_v2', JSON.stringify(bugs));
  }, [bugs]);

  const logActivity = (type: ActivityEvent['type'], message: string, projectId: string, entityId?: string) => {
    const newAct: ActivityEvent = {
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      user: 'tm1',
      projectId,
      entityId,
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const addProject = (p: Omit<Project, 'id' | 'createdAt' | 'lastUpdated' | 'openBugs' | 'openTasks'>) => {
    const newProj: Project = {
      ...p,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      openBugs: 0,
      openTasks: 0,
      screenshots: [],
      zipArchives: [],
    };
    setProjects(prev => [newProj, ...prev]);
    logActivity('create', `Project ${newProj.name} (${newProj.shortCode}) registered`, newProj.id);
    return newProj;
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    setBugs(prev => prev.filter(b => b.projectId !== id));
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
    if (project) {
      logActivity('comment', `Project ${project.name} (${project.shortCode}) removed from registry`, id);
    }
  };

  const addTask = (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...t,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity('task', `Task created: ${newTask.title}`, newTask.projectId, newTask.id);
    return newTask;
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addBug = (b: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBug: Bug = {
      ...b,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setBugs(prev => [newBug, ...prev]);
    logActivity('bug', `Bug reported [${newBug.severity}]: ${newBug.title}`, newBug.projectId, newBug.id);
    return newBug;
  };

  const deleteBug = (id: string) => {
    setBugs(prev => prev.filter(b => b.id !== id));
  };

  const addIdea = (i: Omit<Idea, 'id' | 'createdAt' | 'votes'>) => {
    const newIdea: Idea = {
      ...i,
      id: `i-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      votes: 1,
    };
    setIdeas(prev => [newIdea, ...prev]);
    logActivity('comment', `Proposal logged: ${newIdea.title}`, newIdea.projectId, newIdea.id);
    return newIdea;
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const voteIdea = (id: string) => {
    setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea));
  };

  const addTeamMember = (m: Omit<TeamMember, 'id' | 'joinedAt'>) => {
    const newMember: TeamMember = {
      ...m,
      id: `tm-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setTeamMembers(prev => [...prev, newMember]);
    logActivity('comment', `New team operator registered: ${newMember.name} (${newMember.role})`, 'p8');
    return newMember;
  };

  const deleteTeamMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    if (member) {
      logActivity('comment', `Operator ${member.name} removed from roster`, 'p8');
    }
  };

  const updateMemberStatus = (id: string, status: 'Online' | 'Away' | 'Offline') => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  // Screenshot and Zip Management
  const addProjectScreenshot = (projectId: string, screenshot: Omit<ProjectScreenshot, 'id' | 'uploadedAt'>) => {
    const newScreenshot: ProjectScreenshot = {
      ...screenshot,
      id: `ss-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const existing = p.screenshots || [];
        return { ...p, screenshots: [newScreenshot, ...existing] };
      }
      return p;
    }));
    logActivity('update', `Uploaded screenshot: ${newScreenshot.name}`, projectId);
  };

  const deleteProjectScreenshot = (projectId: string, screenshotId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, screenshots: (p.screenshots || []).filter(s => s.id !== screenshotId) };
      }
      return p;
    }));
  };

  const addProjectZipArchive = (projectId: string, archive: Omit<ProjectZipArchive, 'id' | 'uploadedAt'>) => {
    const newArchive: ProjectZipArchive = {
      ...archive,
      id: `zip-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const existing = p.zipArchives || [];
        return { ...p, zipArchives: [newArchive, ...existing] };
      }
      return p;
    }));
    logActivity('version', `Source code ZIP bundle uploaded: ${newArchive.name} (${newArchive.versionTag})`, projectId);
  };

  const deleteProjectZipArchive = (projectId: string, archiveId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, zipArchives: (p.zipArchives || []).filter(z => z.id !== archiveId) };
      }
      return p;
    }));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const blockVisitor = (id: string) => {
    setVisitors(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, status: v.status === 'Blocked' ? 'Active' : 'Blocked' };
      }
      return v;
    }));
  };

  const terminateVisitorSession = (id: string) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'Terminated' } : v));
  };

  const clearSecurityLogs = () => {
    setSecurityLogs([]);
  };

  const openModal = (type: 'project' | 'task' | 'bug' | 'idea' | 'member') => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <DevHubContext.Provider
      value={{
        theme,
        setTheme,
        projects,
        tasks,
        bugs,
        teamMembers,
        activities,
        versions,
        ideas,
        suggestions,
        visitors,
        users,
        securityLogs,
        activeProjectId,
        setActiveProjectId,
        activeProject,
        addProject,
        deleteProject,
        addTask,
        deleteTask,
        addBug,
        deleteBug,
        addIdea,
        deleteIdea,
        voteIdea,
        addTeamMember,
        deleteTeamMember,
        updateMemberStatus,
        addProjectScreenshot,
        deleteProjectScreenshot,
        addProjectZipArchive,
        deleteProjectZipArchive,
        toggleUserStatus,
        blockVisitor,
        terminateVisitorSession,
        clearSecurityLogs,
        activeModal,
        openModal,
        closeModal,
      }}
    >
      {children}
    </DevHubContext.Provider>
  );
};

export const useDevHub = () => {
  const context = useContext(DevHubContext);
  if (!context) {
    throw new Error('useDevHub must be used within a DevHubProvider');
  }
  return context;
};
