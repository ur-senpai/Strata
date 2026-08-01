import { useState } from 'react';
import { IconSettings } from '../components/icons.jsx';

const NOTIFICATIONS = [
  { key: 'deploy', title: 'Deploy notifications', desc: 'Notify when a service finishes rolling out.', on: true },
  { key: 'threshold', title: 'Threshold alerts', desc: 'Notify when CPU, memory, or disk crosses 80%.', on: true },
  { key: 'weekly', title: 'Weekly summary', desc: 'A digest of uptime and incidents every Monday.', on: false },
  { key: 'digest', title: 'Third-party status', desc: 'Include upstream provider incidents in alerts.', on: false },
];

const RETENTION = [
  { key: 'logs', title: 'Log retention', desc: 'How long to keep activity log entries.', value: '90 days' },
  { key: 'metrics', title: 'Metrics retention', desc: 'How long to keep CPU, memory, and network metrics.', value: '12 months' },
  { key: 'backup', title: 'Backup frequency', desc: 'How often automatic snapshots are taken.', value: 'Every 6h' },
  { key: 'backup-retain', title: 'Backup retention', desc: 'How many backup snapshots to retain.', value: '30 snapshots' },
];

export default function Settings() {
  const [items, setItems] = useState(NOTIFICATIONS);

  function toggle(key) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, on: !it.on } : it)));
  }

  return (
    <>
      <header className="page-head">
        <div className="eyebrow"><IconSettings style={{ width: 13, height: 13 }} /> Settings</div>
        <h1>Notification preferences.</h1>
        <p>Choose what Strata should tell you about, and how often.</p>
      </header>

      <section className="grid">
        {/* Account info */}
        <div className="card c-half">
          <div className="card-head"><span className="card-title">Environment</span></div>
          <div className="info-row">
            <span className="info-label">Cluster</span>
            <span className="info-value">fra-2 &middot; Production</span>
          </div>
          <div className="info-row">
            <span className="info-label">Plan</span>
            <span className="info-value">Pro &middot; 8 vCPU, 32 GB</span>
          </div>
          <div className="info-row">
            <span className="info-label">Region</span>
            <span className="info-value">eu-central-1</span>
          </div>
          <div className="info-row">
            <span className="info-label">Version</span>
            <span className="info-value">Strata v3.2.1</span>
          </div>
        </div>

        {/* API access */}
        <div className="card c-half">
          <div className="card-head"><span className="card-title">API access</span></div>
          <div className="info-row">
            <span className="info-label">API key</span>
            <span className="info-value masked">sk-••••••••••••7f3a</span>
          </div>
          <div className="info-row">
            <span className="info-label">Last used</span>
            <span className="info-value">2 hours ago</span>
          </div>
          <div className="info-row">
            <span className="info-label">Requests today</span>
            <span className="info-value">4,218</span>
          </div>
          <div className="info-row">
            <span className="info-label">Rate limit</span>
            <span className="info-value">5,000 req/min</span>
          </div>
        </div>

        {/* Notification toggles */}
        <div className="card c-full">
          <div className="card-head"><span className="card-title">Notifications</span></div>
          {items.map((it) => (
            <div className="setting-row" key={it.key}>
              <div>
                <div className="setting-t">{it.title}</div>
                <div className="setting-s">{it.desc}</div>
              </div>
              <div className={'switch' + (it.on ? ' on' : '')} onClick={() => toggle(it.key)}>
                <i></i>
              </div>
            </div>
          ))}
        </div>

        {/* Data retention */}
        <div className="card c-full">
          <div className="card-head"><span className="card-title">Data retention</span></div>
          {RETENTION.map((r) => (
            <div className="info-row" key={r.key}>
              <div>
                <div className="setting-t">{r.title}</div>
                <div className="setting-s">{r.desc}</div>
              </div>
              <span className="info-value">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="card c-full danger-card">
          <div className="card-head"><span className="card-title">Danger zone</span></div>
          <div className="setting-row">
            <div>
              <div className="setting-t">Reset all metrics</div>
              <div className="setting-s">Clear all stored CPU, memory, and network data. This cannot be undone.</div>
            </div>
            <button className="danger-btn">Reset metrics</button>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-t">Purge logs</div>
              <div className="setting-s">Delete all activity log entries. New events will continue to be recorded.</div>
            </div>
            <button className="danger-btn">Purge logs</button>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-t">Delete all backups</div>
              <div className="setting-s">Remove all stored snapshots. The next scheduled backup will create a fresh one.</div>
            </div>
            <button className="danger-btn">Delete backups</button>
          </div>
        </div>
      </section>
    </>
  );
}
