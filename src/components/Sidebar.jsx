import { memo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconOverview, IconCompute, IconNetwork, IconContainers,
  IconLogs, IconAlerts, IconSettings, IconSun, IconMoon,
} from './icons.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: IconOverview, end: true },
  { to: '/compute', label: 'Compute', icon: IconCompute },
  { to: '/network', label: 'Network', icon: IconNetwork },
  { to: '/containers', label: 'Containers', icon: IconContainers, badge: '5' },
  { to: '/logs', label: 'Logs', icon: IconLogs },
  { to: '/alerts', label: 'Alerts', icon: IconAlerts },
  { to: '/settings', label: 'Settings', icon: IconSettings },
];

function Sidebar() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  }

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-mark"><span></span><span></span><span></span></div>
          <span className="brand-name">Strata</span>
        </div>

      </div>

      <nav className="navlist">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => 'navitem' + (isActive ? ' active' : '')}
          >
            <Icon />
            {label}
            <span className="navunderline"></span>
            {badge && <span className="badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">

        <div className="theme-toggle" onClick={toggleTheme}>
          <span>{dark ? 'Mission control' : 'Light workspace'}</span>
          {dark ? <IconMoon /> : <IconSun />}
        </div>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
