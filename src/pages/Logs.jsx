import { useState } from 'react';
import CountUp from '../components/CountUp.jsx';
import { IconLogs } from '../components/icons.jsx';

const LEVELS_MAP = { deploy: 'lv-ok', info: 'lv-info', warn: 'lv-warn', error: 'lv-err' };

const LOG_ENTRIES = [
  ['14:32:08', 'deploy', 'api-gateway rolled out to v2.4.1'],
  ['14:19:52', 'info', 'worker-queue scaled to 3 replicas'],
  ['13:58:41', 'warn', 'postgres connection pool at 82% capacity'],
  ['13:40:07', 'info', 'scheduled backup completed \u00b7 4.2 GB'],
  ['12:55:19', 'deploy', 'redis-cache restarted after config update'],
  ['12:03:44', 'info', 'TLS certificate renewed for 3 domains'],
  ['11:47:02', 'error', 'worker-queue failed health check, restarting'],
  ['11:20:15', 'info', 'new region ams-1 added to load balancer'],
  ['10:58:33', 'warn', 'disk usage on fra-2 exceeded 75%'],
  ['10:12:09', 'deploy', 'nginx config reloaded \u00b7 zero downtime'],
  ['09:44:51', 'info', 'api rate limit raised to 5,000 req/min'],
  ['09:02:18', 'info', 'daily vacuum completed on postgres'],
  ['08:31:47', 'deploy', 'worker-queue rolled out to v1.9.2'],
  ['07:55:03', 'info', 'session cache cleared \u00b7 scheduled maintenance'],
  ['07:12:40', 'warn', 'elevated latency on events.strata.io, 31 ms'],
  ['06:40:22', 'info', 'ssh access from new IP, key fingerprint verified'],
];

const FILTER_TABS = ['all', 'deploy', 'info', 'warn', 'error'];

export default function Logs() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? LOG_ENTRIES : LOG_ENTRIES.filter(([, lvl]) => lvl === filter);

  const counts = {
    total: LOG_ENTRIES.length,
    errors: LOG_ENTRIES.filter(([, l]) => l === 'error' || l === 'warn').length,
    deploys: LOG_ENTRIES.filter(([, l]) => l === 'deploy').length,
  };

  return (
    <>
      <header className="page-head">
        <div className="eyebrow"><IconLogs style={{ width: 13, height: 13 }} /> Activity log</div>
        <h1>Full history.</h1>
        <p>Scroll down, switch pages, and come back &mdash; your position here is remembered.</p>
      </header>

      <section className="grid">
        {/* Summary stats */}
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Total entries</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={counts.total} /></span><span className="mem-total">today</span></div>
          <div className="mini-spark">
            <svg viewBox="0 0 200 24" preserveAspectRatio="none">
              <polyline points="0,18 20,12 40,16 60,8 80,14 100,10 120,16 140,6 160,12 180,8 200,10" fill="none" stroke="var(--blue)" strokeWidth="1.3" />
            </svg>
          </div>
        </div>
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Warnings &amp; errors</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={counts.errors} /></span><span className="mem-total">entries</span></div>
          <div className="hbar" style={{ height: 6, marginTop: 4 }}>
            <span style={{ width: '75%', background: 'var(--amber)', opacity: 0.7 }}></span>
            <span style={{ width: '25%', background: 'var(--red)', opacity: 0.7 }}></span>
          </div>
          <div className="hbar-legend" style={{ marginTop: 8 }}>
            <div className="li"><span className="dot" style={{ background: 'var(--amber)' }}></span>Warn</div>
            <div className="li"><span className="dot" style={{ background: 'var(--red)' }}></span>Error</div>
          </div>
        </div>
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Deployments</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={counts.deploys} /></span><span className="mem-total">today</span></div>
          <div className="bar"><span className="used" style={{ width: '100%', background: 'var(--green)', opacity: 0.45 }}></span></div>
        </div>

        {/* Log volume graph */}
        <div className="card c-full">
          <div className="graph-head">
            <span className="card-title">Log volume, 24h</span>
            <div className="range-tabs">
              <button className="range-tab active">24h</button>
              <button className="range-tab">7d</button>
            </div>
          </div>
          <div className="graph-area" style={{ height: 120 }}>
            <svg viewBox="0 0 1000 120" preserveAspectRatio="none">
              <line x1="0" y1="40" x2="1000" y2="40" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="80" x2="1000" y2="80" stroke="var(--line-soft)" strokeWidth="1" />
              <defs>
                <linearGradient id="logFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#logFill)" stroke="none" d="M0,80 C60,70 120,50 180,55 C240,60 300,85 360,80 C420,75 480,40 540,45 C600,50 660,70 720,65 C780,60 840,35 900,40 C950,44 980,50 1000,48 L1000,110 L0,110 Z" />
              <path className="gline" fill="none" d="M0,80 C60,70 120,50 180,55 C240,60 300,85 360,80 C420,75 480,40 540,45 C600,50 660,70 720,65 C780,60 840,35 900,40 C950,44 980,50 1000,48" />
            </svg>
          </div>
        </div>

        {/* Log list with filter */}
        <div className="card c-full">
          <div className="card-head" style={{ flexWrap: 'wrap', gap: 10 }}>
            <span className="card-title">Log entries</span>
            <div className="filter-bar">
              {FILTER_TABS.map((t) => (
                <button key={t} className={'filter-btn' + (filter === t ? ' active' : '')} onClick={() => setFilter(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="log-list scroll" style={{ maxHeight: 360 }}>
            {filtered.length === 0 && (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ink-faint)', fontSize: 12 }}>No entries match this filter.</div>
            )}
            {filtered.map(([time, level, msg], i) => (
              <div className="log-row" key={i}>
                <span className="log-time">{time}</span>
                <span className={'log-level ' + LEVELS_MAP[level]}>{level}</span>
                <span className="log-msg">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
