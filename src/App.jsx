import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Overview from './pages/Overview.jsx';
import Compute from './pages/Compute.jsx';
import Network from './pages/Network.jsx';
import Containers from './pages/Containers.jsx';
import Logs from './pages/Logs.jsx';
import Alerts from './pages/Alerts.jsx';
import Settings from './pages/Settings.jsx';

// HashRouter is used so the built app can be opened directly as a static
// file (or hosted anywhere) without server-side rewrite rules for
// client-side routes. Swap for BrowserRouter if you deploy behind a
// server that can rewrite unknown paths to index.html.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="compute" element={<Compute />} />
          <Route path="network" element={<Network />} />
          <Route path="containers" element={<Containers />} />
          <Route path="logs" element={<Logs />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
