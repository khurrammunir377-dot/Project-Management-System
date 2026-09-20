import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DevHubProvider } from '@/context/DevHubContext';
import Landing        from '@/pages/Landing';
import AppShell       from '@/components/layout/AppShell';
import Dashboard      from '@/pages/Dashboard';
import Projects       from '@/pages/Projects';
import ProjectDetail  from '@/pages/ProjectDetail';
import Tasks          from '@/pages/Tasks';
import Bugs           from '@/pages/Bugs';
import Ideas          from '@/pages/Ideas';
import Suggestions    from '@/pages/Suggestions';
import Releases       from '@/pages/Releases';
import Team           from '@/pages/Team';
import Activity       from '@/pages/Activity';
import Admin          from '@/pages/Admin';
import AiStudio       from '@/pages/AiStudio';

export default function App() {
  return (
    <DevHubProvider>
      <BrowserRouter>
        <Routes>
          {/* Public: auth terminal */}
          <Route path="/" element={<Landing />} />

          {/* Protected: main app shell */}
          <Route element={<AppShell />}>
            <Route path="/dashboard"            element={<Dashboard />} />
            <Route path="/ai-studio"            element={<AiStudio />} />
            <Route path="/projects"             element={<Projects />} />
            <Route path="/projects/:id"         element={<ProjectDetail />} />
            <Route path="/tasks"                element={<Tasks />} />
            <Route path="/bugs"                 element={<Bugs />} />
            <Route path="/ideas"                element={<Ideas />} />
            <Route path="/suggestions"          element={<Suggestions />} />
            <Route path="/releases"             element={<Releases />} />
            <Route path="/team"                 element={<Team />} />
            <Route path="/activity"             element={<Activity />} />
            <Route path="/admin"                element={<Admin />} />
            <Route path="*"                     element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DevHubProvider>
  );
}
