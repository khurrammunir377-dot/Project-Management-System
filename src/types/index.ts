// ─── Status & Enums ──────────────────────────────────────────────
export type ProjectStatus = 'Development' | 'Testing' | 'Production' | 'On Hold' | 'Archived' | 'Completed';
export type BugStatus     = 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Wont Fix';
export type BugSeverity   = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus    = 'Todo' | 'In Progress' | 'Done' | 'Blocked';
export type TaskPriority  = 'High' | 'Medium' | 'Low';
export type Environment   = 'Local' | 'Staging' | 'Production' | 'N/A';
export type IdeaStatus    = 'New' | 'Evaluated' | 'Approved' | 'Rejected' | 'In Progress';

export type AppTheme =
  | 'cyber-teal'
  | 'matrix-green'
  | 'solar-amber'
  | 'electric-cobalt'
  | 'synthwave-purple';

// ─── Attachments ──────────────────────────────────────────────────
export interface ProjectScreenshot {
  id:         string;
  name:       string;
  dataUrl:    string;
  uploadedAt: string;
  size:       string;
  caption?:   string;
}

export interface ProjectZipArchive {
  id:         string;
  name:       string;
  size:       string;
  uploadedAt: string;
  versionTag: string;
  dataUrl?:   string;
  checksum?:  string;
}

// ─── Core Entities ────────────────────────────────────────────────
export interface Project {
  id:           string;
  name:         string;
  shortCode:    string;
  description:  string;
  type:         string;          // e.g. "Web App", "API", "Mobile", "Desktop"
  stack:        string[];        // ["Django", "PostgreSQL"]
  version:      string;
  status:       ProjectStatus;
  progress:     number;          // 0-100
  environment:  Environment;
  localPath:    string;
  repository:   string;
  serverUrl:    string;
  port:         number | null;
  database:     string;
  latestBackup: string;          // ISO date string
  lastUpdated:  string;          // ISO date string
  createdAt:    string;
  owner:        string;
  teamMembers:  string[];        // member IDs
  openBugs:     number;
  openTasks:    number;
  tags:         string[];
  // Extended fields for real project catalog
  liveUrl?:      string;
  accountEmail?: string;
  platformInfo?: string;
  screenshots?:  ProjectScreenshot[];
  zipArchives?:  ProjectZipArchive[];
}

export interface Task {
  id:          string;
  projectId:   string;
  title:       string;
  description: string;
  status:      TaskStatus;
  priority:    TaskPriority;
  assignee:    string;
  dueDate:     string;
  createdAt:   string;
  updatedAt:   string;
  tags:        string[];
}

export interface Bug {
  id:          string;
  projectId:   string;
  title:       string;
  description: string;
  status:      BugStatus;
  severity:    BugSeverity;
  reportedBy:  string;
  assignee:    string;
  createdAt:   string;
  updatedAt:   string;
  steps:       string;
  environment: string;
}

export interface TeamMember {
  id:          string;
  name:        string;
  role:        string;
  email:       string;
  avatar:      string;
  status:      'Online' | 'Away' | 'Offline';
  joinedAt:    string;
  accessLevel: 'SuperAdmin' | 'Lead' | 'Developer' | 'QA' | 'Observer';
  phone?:      string;
}

export interface ActivityEvent {
  id:        string;
  timestamp: string;        // ISO date
  type:      'update' | 'bug' | 'create' | 'deploy' | 'comment' | 'version' | 'task';
  message:   string;
  user:      string;
  projectId: string;
  entityId?: string;
}

export interface Version {
  id:          string;
  projectId:   string;
  version:     string;
  releaseDate: string;
  notes:       string;
  deployedBy:  string;
  environment: Environment;
}

export interface Idea {
  id:          string;
  projectId:   string;
  title:       string;
  description: string;
  status:      IdeaStatus;
  submittedBy: string;
  votes:       number;
  createdAt:   string;
  tags:        string[];
}

export interface Suggestion {
  id:          string;
  projectId:   string;
  title:       string;
  description: string;
  submittedBy: string;
  status:      'New' | 'Under Review' | 'Accepted' | 'Declined';
  createdAt:   string;
}

// ─── Admin & Visitor Control Entities ─────────────────────────────
export interface VisitorSession {
  id:           string;
  ipAddress:    string;
  location:     string;
  device:       string;
  browser:      string;
  currentPath:  string;
  entryTime:    string;
  lastActive:   string;
  status:       'Active' | 'Idle' | 'Blocked' | 'Terminated';
  accessType:   'Operator' | 'Guest' | 'API Client' | 'Suspicious';
  requestsCount: number;
}

export interface UserAccount {
  id:           string;
  username:     string;
  fullName:     string;
  role:         string;
  clearance:    'Level 4 (Root)' | 'Level 3 (Senior)' | 'Level 2 (Operator)' | 'Level 1 (Read-Only)';
  status:       'Active' | 'Suspended' | 'Pending Verification';
  twoFactor:    boolean;
  lastLogin:    string;
  lastIp:       string;
  totalLogins:  number;
}

export interface SecurityAuditLog {
  id:         string;
  timestamp:  string;
  event:      string;
  severity:   'Normal' | 'Warning' | 'Critical';
  sourceIp:   string;
  actor:      string;
  status:     'Allowed' | 'Blocked' | 'Flagged';
}

// ─── UI State ─────────────────────────────────────────────────────
export interface SortConfig {
  key:       string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  status?:  ProjectStatus | 'All';
  type?:    string;
  owner?:   string;
  search?:  string;
}
