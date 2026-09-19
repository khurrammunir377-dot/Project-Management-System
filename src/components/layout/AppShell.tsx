import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppTitleBar from './AppTitleBar';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlobalModals from '../ui/GlobalModals';

export const AppShell: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0c0f] text-[#dce4f0] font-sans antialiased">
      {/* Scanline subtle CRT effect overlay */}
      <div className="scanline pointer-events-none" />

      {/* Global Action Modals (New Project, Task, Bug, Member, Idea) */}
      <GlobalModals />

      {/* Native Desktop Software Title Bar & Controls */}
      <AppTitleBar />

      {/* Main Workspace Frame (Sidebar + Content Deck) */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Left Navigation Rail */}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Workdeck */}
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          {/* Top Command Bar with Dynamic Target Switcher */}
          <TopBar onToggleMobile={() => setMobileOpen(true)} />

          {/* Scrollable Center Canvas */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0a0c0f] p-3 sm:p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
export default AppShell;
