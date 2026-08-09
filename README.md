# MED-PRO Clinic OS

An advanced clinic **CRM + CMS** — patient management, EMR, appointments, queue,
billing, pharmacy, lab, tele-consult, a public website/CMS, and an AI clinical
copilot — built to compete with modern clinic platforms.

Design direction: **Aurora × Cortex** — a light, friendly palette with a dense,
command-center layout, command palette, and clinical copilot. Light + dark themes.

## Status

**Phase 1 — App shell + Dashboard** (this milestone)

- ✅ Vite + React + Tailwind scaffold
- ✅ Design system tokens (`src/index.css`) — single source of truth, wired into
  `tailwind.config.js`
- ✅ App shell: sidebar, top bar with command palette, theme toggle (light/dark,
  persisted), routing for all 16 modules
- ✅ Dashboard: 5-KPI strip, revenue + footfall chart, today's schedule, live
  queue, Clinical Copilot
- ⏳ Remaining modules routed to a Placeholder, built out in later phases (see the
  roadmap in the project plan)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

Node 18+ recommended.

## Project structure

```
src/
  index.css            Design-system tokens + Tailwind layers
  main.jsx             App entry (Router)
  App.jsx              Routes (Dashboard + placeholders)
  layout/
    AppLayout.jsx      Sidebar + Topbar shell
    Sidebar.jsx        Navigation (source of truth: nav.js)
    Topbar.jsx         Command palette, theme toggle, user
    nav.js             Nav + route definitions
  components/
    Icon.jsx           Inline SVG icon set
    ui.jsx             PageHead, Kpi, Card, Segmented
    RevenueChart.jsx   Dependency-free SVG chart
  pages/
    Dashboard.jsx      Phase 1 screen
    Placeholder.jsx    Stub for upcoming modules
  data/mock.js         Placeholder data (swap for API in Phase 2)
  lib/useTheme.js      Theme hook (persisted, system-aware)
```

## Design system

All colors, radii, and shadows are CSS custom properties defined once in
`src/index.css` (light-first, with a fully-defined dark theme). `tailwind.config.js`
maps them to semantic utilities (`bg-panel`, `text-ink-2`, `border-line`,
`shadow-card`, …). Change a token in one place and it propagates everywhere.
