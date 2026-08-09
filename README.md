# MED-PRO Clinic OS

An advanced clinic **CRM + CMS** — patient management, EMR, appointments, queue,
billing, pharmacy, lab, tele-consult, a public website/CMS, and an AI clinical
copilot — built to compete with modern clinic platforms.

Design direction: **Aurora × Cortex** — a light, friendly palette with a dense,
command-center layout, command palette, and clinical copilot. Light + dark themes.

## Status

**Phase 1 — App shell + Dashboard** ✅

- Vite + React + Tailwind scaffold
- Design system tokens (`src/index.css`) — single source of truth, wired into
  `tailwind.config.js`
- App shell: sidebar, top bar with command palette, theme toggle (light/dark,
  persisted), routing for all 16 modules
- Dashboard: 5-KPI strip, revenue + footfall chart, today's schedule, live
  queue, Clinical Copilot

**Phase 2 — Operational core** ✅ (this milestone)

- **Patients** — searchable + filterable CRM table, KPI strip, dues, tags
- **Appointments** — week calendar grid, colour-coded per doctor + tele-visits
- **Queue** — live "now serving" token, wait stats, waiting-list table
- **Consultation / EMR** — 3-pane workspace: patient sidebar, tabbed SOAP notes,
  live vitals, allergy-aware Copilot hint
- **Prescriptions** — medication table, Rx templates, interaction safety check

**Next — Phase 3 (money & stock):** Billing, Payments, Pharmacy, Laboratory,
Inventory, Reports. Remaining modules are routed to a Placeholder so the whole
app stays navigable.

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
    ui.jsx             PageHead, Kpi, Card, Segmented, Table, Avatar, StatusBadge
    RevenueChart.jsx   Dependency-free SVG chart
  pages/
    Dashboard.jsx      Phase 1
    Patients.jsx       Phase 2 — CRM table
    Appointments.jsx   Phase 2 — week calendar
    Queue.jsx          Phase 2 — live queue
    Consultation.jsx   Phase 2 — EMR workspace
    Prescriptions.jsx  Phase 2 — e-prescribe
    Placeholder.jsx    Stub for upcoming modules
  data/mock.js         Placeholder data (swap for API in Phase 3+)
  lib/useTheme.js      Theme hook (persisted, system-aware)
```

## Design system

All colors, radii, and shadows are CSS custom properties defined once in
`src/index.css` (light-first, with a fully-defined dark theme). `tailwind.config.js`
maps them to semantic utilities (`bg-panel`, `text-ink-2`, `border-line`,
`shadow-card`, …). Change a token in one place and it propagates everywhere.
