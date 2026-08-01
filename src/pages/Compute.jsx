import { useEffect, useRef, useState } from 'react';
import CountUp from '../components/CountUp.jsx';
import { IconCompute } from '../components/icons.jsx';

const PROCESSES = [
  { name: 'postgres', pid: '4021', cpu: 18.2, mem: '2.1 GB', status: 'running' },
  { name: 'node (api-gateway)', pid: '5510', cpu: 11.4, mem: '640 MB', status: 'running' },
  { name: 'redis-server', pid: '3210', cpu: 3.6, mem: '180 MB', status: 'running' },
  { name: 'worker-queue', pid: '6633', cpu: 24.8, mem: '910 MB', status: 'running' },
  { name: 'nginx', pid: '2201', cpu: 0.8, mem: '42 MB', status: 'running' },
  { name: 'backup-agent', pid: '7781', cpu: 0.1, mem: '38 MB', status: 'idle' },
];

const CORE_LOADS = [22, 61, 38, 47, 29, 55, 33, 18];
const CPU_PCT = 34;
const ARC_LEN = 238;

const LOAD_SPARK = '0,18 15,14 30,20 45,8 60,12 75,6 90,15 105,10 120,17 135,7 150,13 165,4 180,11 200,7';
const TEMP_SPARK = '0,10 20,11 40,9 60,12 80,10 100,11 120,9 140,10 160,12 180,10 200,11';

export default function Compute() {
  const cpuArcRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const graphRef = useRef(null);

  useEffect(() => {
    const el = cpuArcRef.current;
    if (!el) return;
    el.style.strokeDashoffset = ARC_LEN;
    const t = setTimeout(() => {
      el.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)';
      el.style.strokeDashoffset = ARC_LEN - (ARC_LEN * CPU_PCT) / 100;
    }, 300);
    return () => clearTimeout(t);
  }, []);

  function handleGraphMove(e) {
    const rect = graphRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const points = [42, 40, 48, 44, 58, 54, 34, 38, 64, 60, 30, 34, 26, 29, 52, 50, 60, 58, 24, 27, 36, 32, 22, 25];
    const idx = Math.max(0, Math.min(points.length - 1, Math.round((x / rect.width) * (points.length - 1))));
    setTooltip({ x: (idx / (points.length - 1)) * rect.width, value: points[idx] });
  }

  return (
    <>
      <header className="page-head">
        <div className="eyebrow"><IconCompute style={{ width: 13, height: 13 }} /> Compute</div>
        <h1>8 cores, 2.1 GHz average.</h1>
        <p>Aggregate load has stayed under 40% for the last six hours across all instances.</p>
      </header>

      <section className="grid">
        {/* CPU Gauge card */}
        <div className="card" style={{ gridColumn: '1 / 5', gridRow: '1 / 3', display: 'flex', flexDirection: 'column' }}>
          <div className="card-head">
            <span className="card-title">CPU utilization</span>
            <IconCompute className="card-icon" />
          </div>
          <div className="gauge-wrap">
            <svg width="180" height="110" viewBox="0 0 180 110">
              <path d="M14,100 A76,76 0 0 1 166,100" fill="none" stroke="var(--line-soft)" strokeWidth="9" strokeLinecap="round" />
              <path ref={cpuArcRef} d="M14,100 A76,76 0 0 1 166,100" fill="none" stroke="var(--blue)" strokeWidth="9" strokeLinecap="round" strokeDasharray={ARC_LEN} strokeDashoffset={ARC_LEN} />
            </svg>
            <div className="gauge-num"><CountUp value={CPU_PCT} />%</div>
            <div className="gauge-cap">8 cores &middot; 2.1 GHz avg</div>
          </div>
          <div className="cores" style={{ height: 48, marginTop: 'auto', paddingTop: 14 }}>
            {CORE_LOADS.map((h, i) => (
              <i key={i} style={{ height: '100%' }}><b style={{ height: h + '%' }}></b></i>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="card c-third" style={{ gridColumn: '5 / 9' }}>
          <div className="card-head"><span className="card-title">Current load</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={34} suffix="%" /></span><span className="mem-total">of capacity</span></div>
          <div className="bar"><span className="used" style={{ width: '34%' }}></span></div>
          <div className="mini-spark">
            <svg viewBox="0 0 200 24" preserveAspectRatio="none">
              <polyline points={LOAD_SPARK} fill="none" stroke="var(--blue)" strokeWidth="1.3" />
            </svg>
          </div>
        </div>
        <div className="card c-third" style={{ gridColumn: '9 / 13' }}>
          <div className="card-head"><span className="card-title">Temperature</span></div>
          <div className="mem-row"><span className="mem-num">52&deg;C</span><span className="mem-total">nominal range</span></div>
          <div className="bar"><span className="used" style={{ width: '52%', background: 'var(--green)' }}></span></div>
          <div className="mini-spark">
            <svg viewBox="0 0 200 24" preserveAspectRatio="none">
              <polyline points={TEMP_SPARK} fill="none" stroke="var(--green)" strokeWidth="1.3" />
            </svg>
          </div>
        </div>

        <div className="card c-third" style={{ gridColumn: '5 / 9' }}>
          <div className="card-head"><span className="card-title">Load average</span></div>
          <div className="mem-row"><span className="mem-num">1.84</span><span className="mem-total">1 / 5 / 15 min</span></div>
          <div className="bar"><span className="used" style={{ width: '46%' }}></span></div>
        </div>
        <div className="card c-third" style={{ gridColumn: '9 / 13' }}>
          <div className="card-head"><span className="card-title">Uptime</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={31} /> days</span><span className="mem-total">since reboot</span></div>
          <div className="bar"><span className="used" style={{ width: '100%', background: 'var(--green)', opacity: 0.45 }}></span></div>
        </div>

        {/* System load graph */}
        <div className="card c-full">
          <div className="graph-head">
            <span className="card-title">CPU history</span>
            <div className="range-tabs">
              <button className="range-tab active">24h</button>
              <button className="range-tab">7d</button>
              <button className="range-tab">30d</button>
            </div>
          </div>
          <div className="graph-area" ref={graphRef} onMouseMove={handleGraphMove} onMouseLeave={() => setTooltip(null)}>
            <svg viewBox="0 0 1000 240" preserveAspectRatio="none">
              <line x1="0" y1="60" x2="1000" y2="60" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="120" x2="1000" y2="120" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="180" x2="1000" y2="180" stroke="var(--line-soft)" strokeWidth="1" />
              <defs>
                <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#cpuFill)" stroke="none" d="M0,160 C50,150 90,100 150,110 C210,120 250,155 310,145 C370,135 400,80 460,85 C520,90 550,140 610,130 C670,120 700,70 760,75 C820,80 850,120 910,110 C960,102 980,90 1000,88 L1000,216 L0,216 Z" />
              <path className="gline" d="M0,160 C50,150 90,100 150,110 C210,120 250,155 310,145 C370,135 400,80 460,85 C520,90 550,140 610,130 C670,120 700,70 760,75 C820,80 850,120 910,110 C960,102 980,90 1000,88" />
            </svg>
            {tooltip && (
              <>
                <div className="graph-crosshair" style={{ left: tooltip.x, opacity: 1 }}></div>
                <div className="graph-tooltip" style={{ left: tooltip.x, opacity: 1 }}>{tooltip.value}% CPU</div>
              </>
            )}
          </div>
        </div>

        {/* Process table */}
        <div className="card c-full">
          <div className="card-head"><span className="card-title">Top processes</span></div>
          <table className="table">
            <thead>
              <tr><th>Process</th><th>PID</th><th>CPU</th><th>Memory</th><th>State</th></tr>
            </thead>
            <tbody>
              {PROCESSES.map((p) => (
                <tr key={p.pid}>
                  <td>{p.name}</td>
                  <td className="mono">{p.pid}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="pbar"><span style={{ width: p.cpu + '%', background: 'var(--blue)', opacity: 0.7 }}></span></div>
                      <span className="pval">{p.cpu}%</span>
                    </div>
                  </td>
                  <td className="mono">{p.mem}</td>
                  <td>
                    <span className="log-level" style={{
                      background: p.status === 'running' ? 'var(--green-bg)' : 'var(--amber-bg)',
                      color: p.status === 'running' ? 'var(--green)' : 'var(--amber)',
                    }}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
