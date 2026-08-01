import { useEffect, useRef, useState } from 'react';
import CountUp from '../components/CountUp.jsx';
import { IconCompute, IconMem, IconNetwork, IconContainers, IconUp, IconDown } from '../components/icons.jsx';

const CORE_LOADS = [22, 61, 38, 47, 29, 55, 33, 18];
const GRAPH_POINTS = [42, 40, 48, 44, 58, 54, 34, 38, 64, 60, 30, 34, 26, 29, 52, 50, 60, 58, 24, 27, 36, 32, 22, 25];
const CPU_PCT = 34;
const ARC_LEN = 238;

export default function Overview() {
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
    const idx = Math.max(0, Math.min(GRAPH_POINTS.length - 1, Math.round((x / rect.width) * (GRAPH_POINTS.length - 1))));
    setTooltip({ x: (idx / (GRAPH_POINTS.length - 1)) * rect.width, value: GRAPH_POINTS[idx] });
  }

  return (
    <>
      <header className="hero">
        <div className="eyebrow"><span className="pulse-dot"></span> Live status</div>
        <h1>All systems nominal.</h1>
        <p className="sub">9 services across 3 regions &mdash; last checked 6 seconds ago.</p>
        <div className="hero-stats">
          <div className="hero-stat"><div className="val"><CountUp value={99.98} decimals={2} suffix="%" /></div><div className="lbl">Uptime, 30d</div></div>
          <div className="hero-stat"><div className="val"><CountUp value={118} suffix="ms" /></div><div className="lbl">Avg response</div></div>
          <div className="hero-stat"><div className="val"><CountUp value={0} /></div><div className="lbl">Open incidents</div></div>
          <div className="hero-stat"><div className="val"><CountUp value={14} /></div><div className="lbl">Days since last</div></div>
        </div>
        <div className="hero-graph">
          <svg viewBox="0 0 1000 96" preserveAspectRatio="none">
            <path className="line" d="M0,58 C40,55 70,40 110,44 C150,48 180,66 220,64 C260,62 290,32 330,30 C370,28 400,50 440,52 C480,54 510,38 550,36 C590,34 620,58 660,60 C700,62 730,42 770,40 C810,38 840,52 880,50 C920,48 950,36 1000,34" />
          </svg>
        </div>
      </header>

      <section className="grid">
        <div className="card c-cpu">
          <div className="card-head">
            <span className="card-title">Compute</span>
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
          <div className="cores">
            {CORE_LOADS.map((h, i) => (
              <i key={i}><b style={{ height: h + '%' }}></b></i>
            ))}
          </div>
        </div>

        <div className="card c-mem">
          <div className="card-head">
            <span className="card-title">Memory</span>
            <IconMem className="card-icon" />
          </div>
          <div className="mem-row">
            <span className="mem-num">18.2 GB</span>
            <span className="mem-total">of 32 GB total</span>
          </div>
          <div className="bar"><span className="used" style={{ width: '47%' }}></span><span className="cached" style={{ width: '14%' }}></span></div>
          <div className="mem-legend">
            <div className="li"><span className="dot" style={{ background: 'var(--blue)', opacity: 0.75 }}></span>Used &middot; 47%</div>
            <div className="li"><span className="dot" style={{ background: 'var(--blue)', opacity: 0.3 }}></span>Cached &middot; 14%</div>
            <div className="li"><span className="dot" style={{ background: 'var(--line-soft)' }}></span>Free &middot; 39%</div>
          </div>
        </div>

        <div className="card c-net">
          <div className="card-head">
            <span className="card-title">Network</span>
            <IconNetwork className="card-icon" />
          </div>
          <div className="net-line"><IconUp /><span className="v">2.4</span><span className="u">MB/s up</span></div>
          <div className="net-line"><IconDown /><span className="v">8.1</span><span className="u">MB/s down</span></div>
          <div className="spark">
            <svg viewBox="0 0 200 30" preserveAspectRatio="none">
              <polyline points="0,20 15,16 30,22 45,10 60,14 75,8 90,17 105,12 120,19 135,9 150,15 165,6 180,13 200,9" fill="none" stroke="var(--blue)" strokeWidth="1.4" opacity="0.6" />
            </svg>
          </div>
        </div>

        <div className="card c-docker">
          <div className="card-head">
            <span className="card-title">Containers</span>
            <IconContainers className="card-icon" />
          </div>
          <div className="dk-row"><span className="dk-dot" style={{ background: 'var(--green)' }}></span><span className="dk-name">api-gateway</span><span className="dk-img">nginx:1.27</span><span className="dk-up">12d</span></div>
          <div className="dk-row"><span className="dk-dot" style={{ background: 'var(--green)' }}></span><span className="dk-name">postgres</span><span className="dk-img">pg:16.3</span><span className="dk-up">31d</span></div>
          <div className="dk-row"><span className="dk-dot" style={{ background: 'var(--green)' }}></span><span className="dk-name">redis-cache</span><span className="dk-img">redis:7.2</span><span className="dk-up">31d</span></div>
          <div className="dk-row"><span className="dk-dot" style={{ background: 'var(--amber)' }}></span><span className="dk-name">worker-queue</span><span className="dk-img">node:20</span><span className="dk-up">2h</span></div>
        </div>

        <div className="card c-graph">
          <div className="graph-head">
            <span className="card-title">System load</span>
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
                <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#fillGrad)" stroke="none" d="M0,150 C60,140 90,90 150,95 C210,100 240,150 300,140 C360,130 390,70 450,75 C510,80 540,130 600,125 C660,120 690,60 750,65 C810,70 840,110 900,100 C950,92 980,80 1000,78 L1000,216 L0,216 Z" />
              <path className="gline" d="M0,150 C60,140 90,90 150,95 C210,100 240,150 300,140 C360,130 390,70 450,75 C510,80 540,130 600,125 C660,120 690,60 750,65 C810,70 840,110 900,100 C950,92 980,80 1000,78" />
            </svg>
            {tooltip && (
              <>
                <div className="graph-crosshair" style={{ left: tooltip.x, opacity: 1 }}></div>
                <div className="graph-tooltip" style={{ left: tooltip.x, opacity: 1 }}>{tooltip.value}% load</div>
              </>
            )}
          </div>
        </div>

        <div className="card c-logs">
          <div className="card-head"><span className="card-title">Activity log</span></div>
          <div className="log-list scroll">
            <div className="log-row"><span className="log-time">14:32:08</span><span className="log-level lv-ok">deploy</span><span className="log-msg">api-gateway rolled out to v2.4.1</span></div>
            <div className="log-row"><span className="log-time">14:19:52</span><span className="log-level lv-info">info</span><span className="log-msg">worker-queue scaled to 3 replicas</span></div>
            <div className="log-row"><span className="log-time">13:58:41</span><span className="log-level lv-warn">warn</span><span className="log-msg">postgres connection pool at 82% capacity</span></div>
            <div className="log-row"><span className="log-time">13:40:07</span><span className="log-level lv-info">info</span><span className="log-msg">scheduled backup completed &middot; 4.2 GB</span></div>
            <div className="log-row"><span className="log-time">12:55:19</span><span className="log-level lv-ok">deploy</span><span className="log-msg">redis-cache restarted after config update</span></div>
            <div className="log-row"><span className="log-time">12:03:44</span><span className="log-level lv-info">info</span><span className="log-msg">TLS certificate renewed for 3 domains</span></div>
          </div>
        </div>

        <div className="card c-alerts">
          <div className="card-head"><span className="card-title">Alerts</span></div>
          <div className="alert-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></svg>
            <div className="t">No active alerts</div>
            <div className="s">Every service is within threshold.</div>
          </div>
          <div className="alert-note">LAST INCIDENT &middot; 14 DAYS AGO</div>
        </div>
      </section>
    </>
  );
}
