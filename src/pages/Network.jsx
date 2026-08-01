import { useState, useRef } from 'react';
import CountUp from '../components/CountUp.jsx';
import { IconNetwork, IconUp, IconDown } from '../components/icons.jsx';

const ENDPOINTS = [
  { name: 'api.strata.io', region: 'fra-2', latency: '14 ms', status: 'healthy' },
  { name: 'cdn.strata.io', region: 'global', latency: '9 ms', status: 'healthy' },
  { name: 'db.strata.io', region: 'fra-2', latency: '2 ms', status: 'healthy' },
  { name: 'events.strata.io', region: 'ams-1', latency: '31 ms', status: 'degraded' },
];

const REGIONS = [
  { name: 'fra-2', latency: 14, max: 50, status: 'healthy' },
  { name: 'ams-1', latency: 31, max: 50, status: 'degraded' },
  { name: 'lon-1', latency: 18, max: 50, status: 'healthy' },
];

export default function Network() {
  const [tooltip, setTooltip] = useState(null);
  const graphRef = useRef(null);

  function handleGraphMove(e) {
    const rect = graphRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const points = [8.2, 7.9, 9.1, 8.4, 10.2, 9.8, 7.6, 8.8, 11.1, 10.5, 7.2, 8.0, 6.9, 7.4, 9.6, 9.2, 10.8, 10.4, 6.8, 7.1];
    const idx = Math.max(0, Math.min(points.length - 1, Math.round((x / rect.width) * (points.length - 1))));
    setTooltip({ x: (idx / (points.length - 1)) * rect.width, value: points[idx] });
  }

  return (
    <>
      <header className="page-head">
        <div className="eyebrow"><IconNetwork style={{ width: 13, height: 13 }} /> Network</div>
        <h1>10.5 MB/s combined throughput.</h1>
        <p>Traffic is routed across 3 regions with automatic failover to the nearest healthy edge.</p>
      </header>

      <section className="grid">
        {/* Stat cards */}
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Upload</span></div>
          <div className="net-line"><IconUp /><span className="v" style={{ fontSize: 22 }}>2.4</span><span className="u">MB/s</span></div>
          <span className="stat-delta up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
            12%
          </span>
          <div className="mini-spark">
            <svg viewBox="0 0 200 24" preserveAspectRatio="none">
              <polyline points="0,16 15,12 30,18 45,6 60,10 75,4 90,14 105,8 120,15 135,5 150,11 165,3 180,10 200,6" fill="none" stroke="var(--green)" strokeWidth="1.3" />
            </svg>
          </div>
        </div>
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Download</span></div>
          <div className="net-line"><IconDown /><span className="v" style={{ fontSize: 22 }}>8.1</span><span className="u">MB/s</span></div>
          <span className="stat-delta up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
            5%
          </span>
          <div className="mini-spark">
            <svg viewBox="0 0 200 24" preserveAspectRatio="none">
              <polyline points="0,12 15,8 30,14 45,4 60,8 75,6 90,10 105,4 120,12 135,6 150,8 165,2 180,8 200,4" fill="none" stroke="var(--blue)" strokeWidth="1.3" />
            </svg>
          </div>
        </div>
        <div className="card c-third">
          <div className="card-head"><span className="card-title">Active connections</span></div>
          <div className="net-line"><span className="v" style={{ fontSize: 22 }}><CountUp value={1284} /></span></div>
          <span className="stat-delta down">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            3%
          </span>
          <div className="mini-spark">
            <svg viewBox="0 0 200 24" preserveAspectRatio="none">
              <polyline points="0,4 20,8 40,6 60,10 80,8 100,12 120,10 140,14 160,12 180,16 200,14" fill="none" stroke="var(--ink-faint)" strokeWidth="1.3" />
            </svg>
          </div>
        </div>

        {/* Throughput graph */}
        <div className="card c-full">
          <div className="graph-head">
            <span className="card-title">Throughput, last hour</span>
            <div className="range-tabs">
              <button className="range-tab active">1h</button>
              <button className="range-tab">6h</button>
              <button className="range-tab">24h</button>
            </div>
          </div>
          <div className="graph-area" style={{ height: 200 }} ref={graphRef} onMouseMove={handleGraphMove} onMouseLeave={() => setTooltip(null)}>
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="1000" y2="50" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="var(--line-soft)" strokeWidth="1" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="var(--line-soft)" strokeWidth="1" />
              <defs>
                <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#netFill)" stroke="none" d="M0,110 C60,100 90,60 150,70 C210,80 240,120 300,110 C360,100 390,50 450,55 C510,60 540,100 600,95 C660,90 690,40 750,45 C810,50 840,90 900,80 C950,72 980,60 1000,58 L1000,180 L0,180 Z" />
              <path className="gline" fill="none" d="M0,110 C60,100 90,60 150,70 C210,80 240,120 300,110 C360,100 390,50 450,55 C510,60 540,100 600,95 C660,90 690,40 750,45 C810,50 840,90 900,80 C950,72 980,60 1000,58" />
            </svg>
            {tooltip && (
              <>
                <div className="graph-crosshair" style={{ left: tooltip.x, opacity: 1 }}></div>
                <div className="graph-tooltip" style={{ left: tooltip.x, opacity: 1 }}>{tooltip.value} MB/s</div>
              </>
            )}
          </div>
        </div>

        {/* Bandwidth breakdown + Packets */}
        <div className="card c-half">
          <div className="card-head"><span className="card-title">Bandwidth by protocol</span></div>
          <div className="hbar">
            <span style={{ width: '58%', background: 'var(--blue)', opacity: 0.75 }}></span>
            <span style={{ width: '24%', background: 'var(--green)', opacity: 0.7 }}></span>
            <span style={{ width: '12%', background: 'var(--amber)', opacity: 0.7 }}></span>
            <span style={{ width: '6%', background: 'var(--ink-faint)', opacity: 0.4 }}></span>
          </div>
          <div className="hbar-legend">
            <div className="li"><span className="dot" style={{ background: 'var(--blue)', opacity: 0.75 }}></span>HTTPS &middot; 58%</div>
            <div className="li"><span className="dot" style={{ background: 'var(--green)', opacity: 0.7 }}></span>WebSocket &middot; 24%</div>
            <div className="li"><span className="dot" style={{ background: 'var(--amber)', opacity: 0.7 }}></span>gRPC &middot; 12%</div>
            <div className="li"><span className="dot" style={{ background: 'var(--ink-faint)', opacity: 0.4 }}></span>Other &middot; 6%</div>
          </div>
        </div>
        <div className="card c-half">
          <div className="card-head"><span className="card-title">Packets &amp; errors</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={4.2} decimals={1} suffix="M" /></span><span className="mem-total">packets / hour</span></div>
          <div className="bar"><span className="used" style={{ width: '0.3%', background: 'var(--red)' }}></span><span className="cached" style={{ width: '99.7%', background: 'var(--green)', opacity: 0.35 }}></span></div>
          <div className="mem-legend">
            <div className="li"><span className="dot" style={{ background: 'var(--green)', opacity: 0.55 }}></span>Success &middot; 99.7%</div>
            <div className="li"><span className="dot" style={{ background: 'var(--red)' }}></span>Errors &middot; 0.3%</div>
          </div>
        </div>

        {/* Region latency */}
        <div className="card c-half">
          <div className="card-head"><span className="card-title">Region latency</span></div>
          {REGIONS.map((r) => (
            <div className="latency-row" key={r.name}>
              <span className="latency-status" style={{ background: r.status === 'healthy' ? 'var(--green)' : 'var(--amber)' }}></span>
              <span className="latency-name">{r.name}</span>
              <div className="latency-bar-wrap"><span style={{ width: ((r.latency / r.max) * 100) + '%' }}></span></div>
              <span className="latency-val">{r.latency} ms</span>
            </div>
          ))}
        </div>

        {/* DNS card */}
        <div className="card c-half">
          <div className="card-head"><span className="card-title">DNS resolution</span></div>
          <div className="mem-row"><span className="mem-num"><CountUp value={4} suffix=" ms" /></span><span className="mem-total">avg lookup time</span></div>
          <div className="bar"><span className="used" style={{ width: '8%', background: 'var(--green)' }}></span></div>
          <div className="mini-spark">
            <svg viewBox="0 0 200 24" preserveAspectRatio="none">
              <polyline points="0,12 20,10 40,14 60,8 80,12 100,10 120,14 140,8 160,10 180,12 200,10" fill="none" stroke="var(--green)" strokeWidth="1.3" />
            </svg>
          </div>
        </div>

        {/* Endpoints table */}
        <div className="card c-full">
          <div className="card-head"><span className="card-title">Endpoints</span></div>
          <table className="table">
            <thead><tr><th>Endpoint</th><th>Region</th><th>Latency</th><th>Status</th></tr></thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.name}>
                  <td className="mono">{e.name}</td>
                  <td>{e.region}</td>
                  <td className="mono">{e.latency}</td>
                  <td>
                    <span className="log-level" style={{
                      background: e.status === 'healthy' ? 'var(--green-bg)' : 'var(--amber-bg)',
                      color: e.status === 'healthy' ? 'var(--green)' : 'var(--amber)',
                    }}>{e.status}</span>
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
