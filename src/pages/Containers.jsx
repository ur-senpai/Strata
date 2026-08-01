import { useState, useRef } from 'react';
import CountUp from '../components/CountUp.jsx';
import { IconContainers } from '../components/icons.jsx';

const CONTAINERS = [
  { name: 'api-gateway', image: 'nginx:1.27', cpu: 4, mem: 210, memMax: 512, uptime: '12d', status: 'running', restarts: 0 },
  { name: 'postgres', image: 'postgres:16.3', cpu: 18, mem: 2150, memMax: 4096, uptime: '31d', status: 'running', restarts: 0 },
  { name: 'redis-cache', image: 'redis:7.2', cpu: 2, mem: 180, memMax: 512, uptime: '31d', status: 'running', restarts: 0 },
  { name: 'worker-queue', image: 'node:20-alpine', cpu: 25, mem: 910, memMax: 1024, uptime: '2h', status: 'restarting', restarts: 3 },
  { name: 'backup-agent', image: 'strata/backup:3.1', cpu: 0, mem: 38, memMax: 256, uptime: '31d', status: 'idle', restarts: 0 },
];

const EVENTS = [
  ['14:31:04', 'info', 'worker-queue restarted (attempt 3/5)'],
  ['14:12:38', 'warn', 'worker-queue OOM killed, limit 1024 MB'],
  ['12:55:19', 'deploy', 'redis-cache config update applied'],
  ['10:22:07', 'info', 'backup-agent snapshot completed'],
  ['09:14:55', 'info', 'api-gateway health check passed'],
  ['08:00:01', 'deploy', 'worker-queue rolled out to v1.9.2'],
];

const LEVELS = { deploy: 'lv-ok', info: 'lv-info', warn: 'lv-warn', error: 'lv-err' };

const statusColor = {
  running: 'var(--green)', restarting: 'var(--amber)', idle: 'var(--ink-faint)',
};
const statusBg = {
  running: 'var(--green-bg)', restarting: 'var(--amber-bg)', idle: 'var(--line-soft)',
};

function formatMem(mb) {
  return mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb + ' MB';
}

export default function Containers() {
  const [tooltip, setTooltip] = useState(null);
  const graphRef = useRef(null);

  const totalCpu = CONTAINERS.reduce((s, c) => s + c.cpu, 0);
  const totalMem = CONTAINERS.reduce((s, c) => s + c.mem, 0);
  const runningCount = CONTAINERS.filter(c => c.status === 'running').length;

  function handleGraphMove(e) {
    const rect = graphRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const points = [38, 36, 42, 40, 50, 48, 32, 35, 55, 52, 28, 31, 24, 26, 44, 42, 52, 50, 22, 24];
    const idx = Math.max(0, Math.min(points.length - 1, Math.round((x / rect.width) * (points.length - 1))));
    setTooltip({ x: (idx / (points.length - 1)) * rect.width, value: points[idx] });
  }

  return (
    <>
      <header className="page-head">
        <div className="eyebrow"><IconContainers style={{ width: 13, height: 13 }} /> Containers</div>
        <h1>5 containers, {runningCount} running.</h1>
        <p>worker-queue restarted after a memory limit adjustment 2 hours ago.</p>
      </header>

      <section className="grid">
        {/* Summary stat cards */}
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Running</span></div>
          <div className="mem-row">
            <span className="mem-num"><CountUp value={runningCount} /> <span style={{ fontSize: 14, color: 'var(--ink-faint)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>of {CONTAINERS.length}</span></span>
          </div>
          <div className="bar"><span className="used" style={{ width: ((runningCount / CONTAINERS.length) * 100) + '%', background: 'var(--green)' }}></span></div>
        </div>
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Total CPU</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={totalCpu} suffix="%" /></span><span className="mem-total">combined</span></div>
          <div className="bar"><span className="used" style={{ width: totalCpu + '%' }}></span></div>
        </div>
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Total memory</span></div>
          <div className="mem-row"><span className="mem-num">{formatMem(totalMem)}</span><span className="mem-total">allocated</span></div>
          <div className="bar"><span className="used" style={{ width: '54%' }}></span></div>
        </div>

        {/* Container resource graph */}
        <div className="card c-full">
          <div className="graph-head">
            <span className="card-title">Combined CPU, 24h</span>
            <div className="range-tabs">
              <button className="range-tab active">24h</button>
              <button className="range-tab">7d</button>
              <button className="range-tab">30d</button>
            </div>
          </div>
          <div className="graph-area" style={{ height: 180 }} ref={graphRef} onMouseMove={handleGraphMove} onMouseLeave={() => setTooltip(null)}>
            <svg viewBox="0 0 1000 180" preserveAspectRatio="none">
              <line x1="0" y1="45" x2="1000" y2="45" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="90" x2="1000" y2="90" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="135" x2="1000" y2="135" stroke="var(--line-soft)" strokeWidth="1" />
              <defs>
                <linearGradient id="ctrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--green)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#ctrFill)" stroke="none" d="M0,100 C50,95 100,70 160,75 C220,80 260,110 320,105 C380,100 420,60 480,65 C540,70 580,100 640,95 C700,90 740,55 800,60 C860,65 900,90 960,85 L1000,82 L1000,160 L0,160 Z" />
              <path className="gline" style={{ stroke: 'var(--green)' }} fill="none" d="M0,100 C50,95 100,70 160,75 C220,80 260,110 320,105 C380,100 420,60 480,65 C540,70 580,100 640,95 C700,90 740,55 800,60 C860,65 900,90 960,85 L1000,82" />
            </svg>
            {tooltip && (
              <>
                <div className="graph-crosshair" style={{ left: tooltip.x, opacity: 1 }}></div>
                <div className="graph-tooltip" style={{ left: tooltip.x, opacity: 1 }}>{tooltip.value}% CPU</div>
              </>
            )}
          </div>
        </div>

        {/* Container table with resource bars */}
        <div className="card c-full">
          <div className="card-head"><span className="card-title">Container details</span></div>
          <table className="table">
            <thead><tr><th>Container</th><th>Image</th><th>CPU</th><th>Memory</th><th>Uptime</th><th>Restarts</th><th>Status</th></tr></thead>
            <tbody>
              {CONTAINERS.map((c) => (
                <tr key={c.name}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="dk-dot" style={{ background: statusColor[c.status] }}></span>{c.name}
                  </td>
                  <td className="mono">{c.image}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="pbar"><span style={{ width: c.cpu + '%', background: 'var(--blue)', opacity: 0.7 }}></span></div>
                      <span className="pval">{c.cpu}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="pbar"><span style={{ width: ((c.mem / c.memMax) * 100) + '%', background: c.mem / c.memMax > 0.8 ? 'var(--amber)' : 'var(--blue)', opacity: 0.7 }}></span></div>
                      <span className="pval">{formatMem(c.mem)}</span>
                    </div>
                  </td>
                  <td className="mono">{c.uptime}</td>
                  <td className="mono" style={{ color: c.restarts > 0 ? 'var(--amber)' : 'var(--ink-faint)' }}>{c.restarts}</td>
                  <td>
                    <span className="log-level" style={{ background: statusBg[c.status], color: statusColor[c.status] }}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Image versions + Container events */}
        <div className="card c-half">
          <div className="card-head"><span className="card-title">Image versions</span></div>
          {CONTAINERS.map((c) => (
            <div className="dk-row" key={c.name}>
              <span className="dk-dot" style={{ background: statusColor[c.status] }}></span>
              <span className="dk-name">{c.name}</span>
              <span className="dk-img">{c.image}</span>
            </div>
          ))}
        </div>
        <div className="card c-half">
          <div className="card-head"><span className="card-title">Recent events</span></div>
          <div className="log-list scroll">
            {EVENTS.map(([time, level, msg], i) => (
              <div className="log-row" key={i}>
                <span className="log-time">{time}</span>
                <span className={'log-level ' + LEVELS[level]}>{level}</span>
                <span className="log-msg">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
