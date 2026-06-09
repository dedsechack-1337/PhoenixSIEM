import { HashRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/threat-intel" element={<ThreatIntel />} />
          <Route path="/search" element={<LogSearch />} />
          <Route path="/fim" element={<FIM />} />
          <Route path="/mitre" element={<MitreHeatmap />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/uba" element={<UBA />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
