# Strata

A clean, lightweight server and infrastructure monitoring dashboard built with React + Vite.

![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## What is Strata?

Strata gives you a single place to monitor your entire infrastructure at a glance — think of it as a self-hosted alternative to tools like Datadog, Grafana, or Vercel's dashboard.

## Pages

| Page | What it shows |
|------|---------------|
| **Overview** | Live system status, uptime, response times, CPU gauge, memory bar, network throughput, containers, system load graph, activity log, and alerts |
| **Compute** | CPU utilization gauge, per-core bars, load average, temperature, CPU history graph, and top processes table |
| **Network** | Upload/download speeds, active connections, throughput graph, bandwidth by protocol, packets & errors, region latency, DNS resolution, and endpoints table |
| **Containers** | Running/total count, combined CPU & memory, resource graph, detailed table with inline progress bars, image versions, and recent container events |
| **Logs** | Entry counts, warnings/errors breakdown, deployments, log volume graph, and a filterable log list (All / Deploy / Info / Warn / Error) |
| **Alerts** | Active alert status, resolved incidents (30d), avg resolution time, alert frequency timeline, configured alert rules, and resolved history |
| **Settings** | Environment info, API access (masked key), notification toggles, data retention settings, and danger zone actions |

## Tech Stack

- **React 19** — UI components
- **Vite 8** — Dev server and build tool
- **React Router 7** — Client-side routing (HashRouter)
- **Framer Motion** — Page transition animations
- **Vanilla CSS** — Custom design system with light/dark theme support
- **Oxlint** — Linting

## Design System

Strata uses a custom design system with:

- **Typography** — Fraunces (display), Inter (body), JetBrains Mono (data)
- **Color palette** — Warm neutrals with blue, green, amber, and red accents
- **Light & dark themes** — Toggle via the sidebar
- **Responsive layout** — Sidebar collapses to horizontal nav at 980px
- **Motion** — Smooth page transitions, animated gauges, and sparkline draw animations

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

The dev server runs at `http://localhost:5173/`.

## Project Structure

```
src/
├── components/
│   ├── CountUp.jsx        # Animated number counter
│   ├── Layout.jsx         # App shell with animated page transitions
│   ├── Sidebar.jsx        # Navigation sidebar with theme toggle
│   └── icons.jsx          # SVG icon components
├── hooks/
│   └── useScrollRestoration.js
├── pages/
│   ├── Overview.jsx       # Home / dashboard overview
│   ├── Compute.jsx        # CPU & process monitoring
│   ├── Network.jsx        # Network throughput & endpoints
│   ├── Containers.jsx     # Docker container management
│   ├── Logs.jsx           # Activity log with filters
│   ├── Alerts.jsx         # Alert rules & incident history
│   └── Settings.jsx       # Preferences & configuration
├── App.jsx                # Router setup
├── main.jsx               # Entry point
└── styles.css             # Full design system
```

## Note

This is currently a **frontend-only** project with static/mock data. To make it production-ready, you would connect it to real backends like Prometheus, Docker API, syslog, etc. to pull live metrics.
