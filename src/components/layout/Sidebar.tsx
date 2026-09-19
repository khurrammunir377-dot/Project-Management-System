import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  FolderGit2,
  Lightbulb,
  CheckSquare,
  Bug,
  MessageSquare,
  Tag,
  Users,
  Activity,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DevHubLogo from '../ui/DevHubLogo';
import { useDevHub } from '@/context/DevHubContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  label: string;
  path: string;
  icon: React.ElementType;
  iconColor: string;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}) => {
  const location = useLocation();
  const { projects, tasks, bugs, teamMembers, visitors, theme } = useDevHub();
  const isLight = theme === 'light-pro';

  const openBugsCount = bugs.filter((b) => b.status === 'Open' || b.status === 'In Progress').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'Done').length;
  const activeVisitorsCount = visitors.filter((v) => v.status === 'Active').length;

  const navItems: NavItemConfig[] = [
    { label: 'Dashboard',   path: '/dashboard',   icon: LayoutDashboard, iconColor: '#00d4c8' },
    { label: 'Projects',    path: '/projects',    icon: FolderGit2,      iconColor: '#38bdf8', badge: projects.length.toString(), badgeColor: '#38bdf8' },
    { label: 'Ideas',       path: '/ideas',       icon: Lightbulb,       iconColor: '#c084fc' },
    { label: 'Tasks',       path: '/tasks',       icon: CheckSquare,     iconColor: '#fbbf24', badge: openTasksCount.toString(),  badgeColor: '#fbbf24' },
    { label: 'Bugs',        path: '/bugs',        icon: Bug,             iconColor: '#f87171', badge: openBugsCount.toString(),   badgeColor: '#f87171' },
    { label: 'Suggestions', path: '/suggestions', icon: MessageSquare,   iconColor: '#34d399' },
    { label: 'Releases',    path: '/releases',    icon: Tag,             iconColor: '#818cf8' },
    { label: 'Team',        path: '/team',        icon: Users,           iconColor: '#fb923c', badge: teamMembers.length.toString(), badgeColor: '#fb923c' },
    { label: 'Activity',    path: '/activity',    icon: Activity,        iconColor: '#f43f5e' },
    { label: 'Admin Panel', path: '/admin',       icon: ShieldAlert,     iconColor: '#a3e635', badge: `${activeVisitorsCount} live`, badgeColor: '#a3e635' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Rail */}
      <aside
        className={clsx(
          'fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-200 ease-in-out select-none border-r',
          collapsed ? 'w-[64px]' : 'w-[235px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isLight
            ? 'bg-[#ffffff] border-[#e2e8f0]'
            : 'bg-[#0a0c10] border-[#1a1f2c]'
        )}
      >
        {/* Top Header / Branding */}
        <div
          className={`h-14 flex items-center justify-between px-3.5 border-b ${
            isLight ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-[#0c0e14] border-[#1a1f2c]'
          }`}
        >
          <DevHubLogo size={collapsed ? 'sm' : 'md'} collapsed={collapsed} />

          <button
            type="button"
            onClick={onToggle}
            className={`hidden lg:flex items-center justify-center w-6 h-6 rounded-[2px] border transition-colors ${
              isLight
                ? 'text-[#64748b] hover:text-[#0284c7] hover:bg-[#e2e8f0] border-transparent hover:border-[#cbd5e1]'
                : 'text-[#55637a] hover:text-[#00d4c8] hover:bg-[#141824] border-transparent hover:border-[#1e2535]'
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Console Mode Tag */}
        {!collapsed && (
          <div
            className={`px-3 py-2 border-b flex items-center justify-between font-mono text-[9px] ${
              isLight ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-[#0d1017] border-[#161a24]'
            }`}
          >
            <span
              className={`tracking-widest uppercase font-semibold ${
                isLight ? 'text-[#64748b]' : 'text-[#55637a]'
              }`}
            >
              SYS: DEV_CENTER
            </span>
            <span
              className={`flex items-center gap-1 font-bold ${
                isLight ? 'text-[#059669]' : 'text-[#00d4c8]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  isLight ? 'bg-[#059669]' : 'bg-[#00d4c8]'
                }`}
              />
              ONLINE
            </span>
          </div>
        )}

        {/* Navigation List with High-Contrast Hover States */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={clsx(
                  'flex items-center gap-2.5 px-2 py-1.5 rounded-[2px] text-xs font-mono transition-all group relative border-l-2',
                  isActive
                    ? isLight
                      ? 'bg-[#e0f2fe] text-[#0284c7] border-[#0284c7] pl-[7px] font-bold shadow-sm'
                      : 'bg-[#151c28] text-[#e2e8f0] border-[#00d4c8] pl-[7px] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : isLight
                    ? 'text-[#334155] hover:text-[#0f172a] hover:bg-[#f1f5f9] border-transparent'
                    : 'text-[#8892a4] hover:text-[#f1f5f9] hover:bg-[#121622] border-transparent'
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Vibrant Colored Icon Box */}
                <div
                  className="w-7 h-7 rounded-[2px] flex items-center justify-center flex-shrink-0 border transition-all"
                  style={{
                    backgroundColor: `${item.iconColor}18`,
                    borderColor: isActive ? `${item.iconColor}90` : `${item.iconColor}35`,
                    boxShadow: isActive ? `0 0 10px ${item.iconColor}40` : `0 0 4px ${item.iconColor}15`,
                  }}
                >
                  <Icon
                    size={14}
                    style={{ color: item.iconColor }}
                    className="flex-shrink-0 transition-transform group-hover:scale-110"
                  />
                </div>

                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span
                      className={`truncate tracking-wide font-medium transition-colors ${
                        isActive
                          ? isLight
                            ? 'text-[#0284c7] font-bold'
                            : 'text-[#f1f5f9] font-bold'
                          : isLight
                          ? 'text-[#334155] group-hover:text-[#0f172a]'
                          : 'text-[#8892a4] group-hover:text-[#ffffff]'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className="font-mono text-[9.5px] px-1.5 py-0.2 rounded-[2px] font-bold border"
                        style={{
                          backgroundColor: item.badgeColor ? `${item.badgeColor}15` : '#1a2130',
                          borderColor: item.badgeColor ? `${item.badgeColor}40` : '#283347',
                          color: item.badgeColor || '#7a8899',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Rail Diagnostics */}
        <div
          className={`p-3 border-t ${
            isLight ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-[#0c0e14] border-[#1a1f2c]'
          }`}
        >
          {collapsed ? (
            <div className="flex justify-center" title="System Online">
              <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            </div>
          ) : (
            <div className="space-y-1.5">
              <div
                className={`flex items-center justify-between font-mono text-[10px] ${
                  isLight ? 'text-[#64748b]' : 'text-[#55637a]'
                }`}
              >
                <span>CLUSTER</span>
                <span className={isLight ? 'text-[#0284c7] font-bold' : 'text-[#00d4c8] font-semibold'}>
                  PROD-LOCAL
                </span>
              </div>
              <div
                className={`flex items-center justify-between font-mono text-[10px] ${
                  isLight ? 'text-[#64748b]' : 'text-[#55637a]'
                }`}
              >
                <span>CATALOG</span>
                <span className={isLight ? 'text-[#0284c7] font-bold' : 'text-[#38bdf8] font-bold'}>
                  {projects.length} PROJECTS
                </span>
              </div>
              <div
                className={`pt-1 border-t flex items-center justify-between ${
                  isLight ? 'border-[#e2e8f0]' : 'border-[#161a24]'
                }`}
              >
                <span className={`font-mono text-[9px] ${isLight ? 'text-[#64748b]' : 'text-[#404d60]'}`}>
                  LATENCY: 8ms
                </span>
                <span className="font-mono text-[9px] text-[#10b981] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> 100% OK
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
