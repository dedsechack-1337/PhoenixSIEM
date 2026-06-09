import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { SecurityEvents } from "./pages/SecurityEvents";
import { Alerts } from "./pages/Alerts";
import { Assets } from "./pages/Assets";
import { ThreatIntel } from "./pages/ThreatIntel";
import { LogSearch } from "./pages/LogSearch";
import { FIM } from "./pages/FIM";
import { MitreHeatmap } from "./pages/MitreHeatmap";
import { Vulnerabilities } from "./pages/Vulnerabilities";
import { Compliance } from "./pages/Compliance";
import { UBA } from "./pages/UBA";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<SecurityEvents />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/threat-intel" element={<ThreatIntel />} />
        <Route path="/search" element={<LogSearch />} />
        <Route path="/fim" element={<FIM />} />
        <Route path="/mitre" element={<MitreHeatmap />} />
        <Route path="/vulnerabilities" element={<Vulnerabilities />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/uba" element={<UBA />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
