import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Alerts } from './pages/Alerts';
import { Assets } from './pages/Assets';
import { ThreatIntel } from './pages/ThreatIntel';
import { LogSearch } from './pages/LogSearch';
import { FIM } from './pages/FIM';
import { MitreHeatmap } from './pages/MitreHeatmap';
import { Vulnerabilities } from './pages/Vulnerabilities';
import { Compliance } from './pages/Compliance';
import { UBA } from './pages/UBA';
import { AIAnalysis } from './pages/AIAnalysis';
import { Notifications } from './pages/Notifications';
import { ExportReports } from './pages/ExportReports';
import { Login } from './pages/Login';
import { useAuth } from './context/AuthContext';

function RequireAuth() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout><Outlet /></Layout>;
}

function RedirectByAuth() {
  const { user } = useAuth();
  return <Navigate to={user ? '/' : '/login'} replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/"                element={<Dashboard />} />
          <Route path="/events"          element={<Events />} />
          <Route path="/alerts"          element={<Alerts />} />
          <Route path="/assets"          element={<Assets />} />
          <Route path="/threat-intel"    element={<ThreatIntel />} />
          <Route path="/search"          element={<LogSearch />} />
          <Route path="/fim"             element={<FIM />} />
          <Route path="/mitre"           element={<MitreHeatmap />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          <Route path="/compliance"      element={<Compliance />} />
          <Route path="/uba"             element={<UBA />} />
          <Route path="/ai-analysis"     element={<AIAnalysis />} />
          <Route path="/notifications"   element={<Notifications />} />
          <Route path="/export"          element={<ExportReports />} />
        </Route>
        <Route path="*" element={<RedirectByAuth />} />
      </Routes>
    </HashRouter>
  );
}
