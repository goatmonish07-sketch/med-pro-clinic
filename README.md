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

**Phase 2 — Operational core** ✅

- **Patients** — searchable + filterable CRM table, KPI strip, dues, tags
- **Appointments** — week calendar grid, colour-coded per doctor + tele-visits
- **Queue** — live "now serving" token, wait stats, waiting-list table
- **Consultation / EMR** — 3-pane workspace: patient sidebar, tabbed SOAP notes,
  live vitals, allergy-aware Copilot hint
- **Prescriptions** — medication table, Rx templates, interaction safety check

**Phase 3 — Money & stock** ✅

- **Laboratory** — test orders, sample tracking, status filters
- **Pharmacy** — dispensing with batch/stock, low-stock alerts
- **Billing** — GST-ready itemized invoice
- **Payments** — UPI/card/cash breakdown, transactions, status filters
- **Inventory** — SKUs, reorder levels, expiry flags
- **Reports** — revenue line chart, department donut, top-doctor leaderboard

**Phase 4 — Patient reach & admin** ✅ (final milestone)

- **Tele-consult** — live video stage with call controls, side notes, e-prescribe
- **Website (CMS)** — live editor with a booking-enabled marketing site preview
- **Settings** — automation toggles (WhatsApp/SMS reminders), users & roles (RBAC)

**All 16 modules are live routed pages.**

**Back end — REST API + PostgreSQL** ✅ (`server/`)

- **Express + Prisma + PostgreSQL**, JWT auth with role-based access control
- 13-model schema covering the whole domain; committed migrations + demo seed
- Full REST surface for every module (patients, appointments, queue, EMR,
  prescriptions, lab, pharmacy, billing, payments, inventory, reports, users)
- Server-side GST/invoice maths, transactional payments, atomic stock dispensing,
  aggregated analytics — verified end-to-end against a live database
- Frontend API client in `src/lib/api.js`, auth context in `src/lib/auth.jsx`,
  fetch hook in `src/lib/useApi.js`, and shape adapters in `src/lib/adapters.js`

See [`server/README.md`](server/README.md) to run the API.

**Live-data wiring** ✅

The data screens are wired to the API with a graceful demo fallback:

- Sign in from the top-bar user chip (demo `admin@medpro.clinic / medpro123`).
  A **Live / Demo** pill shows the current source.
- When signed in and the API is reachable, **Dashboard, Patients, Queue,
  Laboratory, Inventory, Payments, Reports and Settings** render **live data**
  from PostgreSQL (KPIs, dues, queue, transactions, users…).
- With no backend — or signed out — every page falls back to the mock data, so
  the static build still runs and deploys anywhere.

Remaining to fully productionize: connect the external integrations the model is
designed for (payment gateway, WhatsApp/SMS, video SDK).

## Deployment

Ready to deploy — see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

- **Web → Cloudflare Pages** (project `med-pro-clinic` → `med-pro-clinic.pages.dev`).
  Config is in the repo: `wrangler.toml`, `public/_redirects` (SPA fallback), and
  a GitHub Action (`.github/workflows/deploy-cloudflare.yml`) that auto-deploys
  once `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets are set. The static
  site works immediately in demo mode.
- **API + PostgreSQL** → any Node host. `render.yaml` provisions the API + managed
  Postgres on Render in one blueprint; `Dockerfile`s + `docker-compose.prod.yml`
  self-host the whole stack. Point the Pages app's `VITE_API_URL` at the API for
  live data.
- **CI** builds the web app and validates the API schema on every push
  (`.github/workflows/ci.yml`).

## Getting started

**Front end** (this folder):

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

**Back end** (`server/`): see [`server/README.md`](server/README.md) —
`docker compose up -d && npm install && npm run prisma:migrate && npm run db:seed && npm run dev`.

Node 18+ recommended. The front end runs standalone on mock data; start the API
to go live.

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
    RevenueChart.jsx   Dependency-free SVG area+bar chart
    LineChart.jsx      Reusable single-series area chart
    Donut.jsx          Reusable segmented donut chart
  pages/               All 16 modules (Dashboard, Patients, Appointments, Queue,
                       Consultation, Prescriptions, Laboratory, Pharmacy, Billing,
                       Payments, Inventory, Tele, Website, Reports, Settings) +
                       Placeholder (404 fallback)
  data/mock.js         Placeholder data (swap for API to complete the back end)
  lib/useTheme.js      Theme hook (persisted, system-aware)
```

## Design system

All colors, radii, and shadows are CSS custom properties defined once in
`src/index.css` (light-first, with a fully-defined dark theme). `tailwind.config.js`
maps them to semantic utilities (`bg-panel`, `text-ink-2`, `border-line`,
`shadow-card`, …). Change a token in one place and it propagates everywhere.
