import CountUp from '../components/CountUp.jsx';
import { IconAlerts, IconCheck } from '../components/icons.jsx';

const RESOLVED = [
  { title: 'postgres connection pool near capacity', time: '14 days ago', level: 'warn', duration: '42 min' },
  { title: 'worker-queue restart loop', time: '22 days ago', level: 'error', duration: '1h 18 min' },
  { title: 'disk usage above 80% on fra-2', time: '30 days ago', level: 'warn', duration: '3h 5 min' },
  { title: 'events.strata.io elevated latency', time: '33 days ago', level: 'warn', duration: '28 min' },
  { title: 'TLS certificate expiry warning', time: '41 days ago', level: 'warn', duration: '12 min' },
];

const RULES = [
  { name: 'CPU > 80%', target: 'all nodes', active: true },
  { name: 'Memory > 80%', target: 'all nodes', active: true },
  { name: 'Disk > 75%', target: 'fra-2', active: true },
  { name: 'Latency > 50 ms', target: 'all endpoints', active: true },
  { name: 'Error rate > 1%', target: 'api-gateway', active: true },
  { name: 'Container restarts > 3', target: 'all containers', active: false },
];

export default function Alerts() {
  return (
    <>
      <header className="page-head">
        <div className="eyebrow"><IconAlerts style={{ width: 13, height: 13 }} /> Alerts</div>
        <h1>Nothing needs your attention.</h1>
        <p>All thresholds are within range. The last five incidents are shown below for reference.</p>
      </header>

      <section className="grid">
        {/* Summary stat cards */}
        <div className="card c-third">
          <div className="alert-empty">
            <IconCheck />
            <div className="t">No active alerts</div>
            <div className="s">Every service is within threshold.</div>
          </div>
        </div>
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Resolved, 30d</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={5} /></span><span className="mem-total">incidents</span></div>
          <div className="bar"><span className="used" style={{ width: '16%', background: 'var(--amber)', opacity: 0.7 }}></span></div>
        </div>
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Avg resolution</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={61} suffix=" min" /></span><span className="mem-total">mean time</span></div>
          <div className="mini-spark">
            <svg viewBox="0 0 200 24" preserveAspectRatio="none">
              <polyline points="0,8 40,18 80,6 120,20 160,10 200,14" fill="none" stroke="var(--amber)" strokeWidth="1.3" />
            </svg>
          </div>
        </div>

        {/* Alert timeline graph */}
        <div className="card c-full">
          <div className="graph-head">
            <span className="card-title">Alert frequency, 30 days</span>
            <div className="range-tabs">
              <button className="range-tab active">30d</button>
              <button className="range-tab">90d</button>
            </div>
          </div>
          <div className="graph-area" style={{ height: 140 }}>
            <svg viewBox="0 0 1000 140" preserveAspectRatio="none">
              <line x1="0" y1="35" x2="1000" y2="35" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="70" x2="1000" y2="70" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="105" x2="1000" y2="105" stroke="var(--line-soft)" strokeWidth="1" />
              <defs>
                <linearGradient id="alertFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Bar-style representation of alert days — thin vertical bars */}
              <rect x="30" y="60" width="12" height="60" rx="3" fill="var(--amber)" opacity="0.3" />
              <rect x="200" y="40" width="12" height="80" rx="3" fill="var(--red)" opacity="0.35" />
              <rect x="280" y="70" width="12" height="50" rx="3" fill="var(--amber)" opacity="0.3" />
              <rect x="550" y="80" width="12" height="40" rx="3" fill="var(--amber)" opacity="0.3" />
              <rect x="700" y="65" width="12" height="55" rx="3" fill="var(--amber)" opacity="0.3" />
              {/* Trend line */}
              <path className="gline" style={{ stroke: 'var(--amber)' }} fill="none" d="M0,95 C100,92 200,70 300,80 C400,90 500,100 600,95 C700,85 800,100 900,105 L1000,108" />
            </svg>
          </div>
        </div>

        {/* Alert rules + Resolved history */}
        <div className="card c-half">
          <div className="card-head"><span className="card-title">Alert rules</span></div>
          {RULES.map((r) => (
            <div className="setting-row" key={r.name}>
              <div>
                <div className="setting-t">{r.name}</div>
                <div className="setting-s">{r.target}</div>
              </div>
              <span className="log-level" style={{
                background: r.active ? 'var(--green-bg)' : 'var(--line-soft)',
                color: r.active ? 'var(--green)' : 'var(--ink-faint)',
              }}>{r.active ? 'active' : 'paused'}</span>
            </div>
          ))}
        </div>

        <div className="card c-half">
          <div className="card-head"><span className="card-title">Resolved recently</span></div>
          {RESOLVED.map((r) => (
            <div className="alert-row" key={r.title}>
              <span className="a-dot" style={{ background: r.level === 'error' ? 'var(--red)' : 'var(--amber)' }}></span>
              <div style={{ flex: 1 }}>
                <div className="a-t">{r.title}</div>
                <div className="a-s">Resolved &middot; {r.time} &middot; took {r.duration}</div>
              </div>
            </div>
          ))}
          <div className="alert-note">LAST INCIDENT &middot; 14 DAYS AGO</div>
        </div>
      </section>
    </>
  );
}
