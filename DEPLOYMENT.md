# Deployment

Two pieces ship separately:

| Piece | What | Where |
| --- | --- | --- |
| **Web** (this folder) | Static Vite SPA | **Cloudflare Pages** → `med-pro-clinic.pages.dev` |
| **API + DB** (`server/`) | Express + Prisma + PostgreSQL | A Node host with managed Postgres (Render / Railway / Fly / any VPS) |

> The web app runs in **demo mode** with no backend, so `med-pro-clinic.pages.dev`
> works the moment Pages finishes building. Point it at a live API (below) and
> signing in flips every screen to real data.

---

## 1 · Web → Cloudflare Pages (project `med-pro-clinic`)

Pick one of three ways. All produce `https://med-pro-clinic.pages.dev`.

### A. Cloudflare dashboard (no secrets to manage)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Select this repo and the branch `claude/clinic-crm-cms-design-tt037h` (or `main`).
3. Build settings:
   - **Project name:** `med-pro-clinic`
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. (Optional, for live data) **Environment variables → Add** `VITE_API_URL` =
   your API URL (e.g. `https://med-pro-clinic-api.onrender.com`).
5. **Save and Deploy.** Done — `_redirects` (already in the repo) handles SPA routing.

### B. Wrangler CLI (one command)

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name=med-pro-clinic
# first run: `npx wrangler login` (opens Cloudflare auth)
# for live data, build with:  VITE_API_URL=https://your-api npm run build
```

### C. GitHub Action (auto-deploy on push) — already wired

`.github/workflows/deploy-cloudflare.yml` deploys on every push once you add, in
**GitHub repo → Settings → Secrets and variables → Actions**:

- Secret `CLOUDFLARE_API_TOKEN` — token with the **Cloudflare Pages: Edit** permission
- Secret `CLOUDFLARE_ACCOUNT_ID` — your account id (dashboard sidebar)
- Variable `VITE_API_URL` *(optional)* — the deployed API URL

The next push publishes to `med-pro-clinic.pages.dev` automatically.

---

## 2 · API + PostgreSQL

Cloudflare Pages is static-only, so the Express/Prisma API needs a Node host with
a Postgres database. The repo includes a **Render blueprint** (`render.yaml`) that
provisions both:

1. Render dashboard → **New → Blueprint** → select this repo.
2. It creates `medpro-api` (web service) + `medpro-db` (PostgreSQL) and runs
   `prisma migrate deploy` before each deploy.
3. Set `CORS_ORIGIN` on `medpro-api` to `https://med-pro-clinic.pages.dev`.
4. (Optional) seed demo data once from the Render shell: `npm run db:seed`.

Then set `VITE_API_URL` on the Pages project to the `medpro-api` URL and redeploy
the web app. Sign in with `admin@medpro.clinic / medpro123` → live data.

Railway, Fly.io, or any VPS work the same way: run the API with `DATABASE_URL`,
`JWT_SECRET`, and `CORS_ORIGIN` set, and run `prisma migrate deploy` on release.

### Self-host everything with Docker

```bash
JWT_SECRET=$(openssl rand -hex 32) \
  docker compose -f docker-compose.prod.yml up -d --build
# web → http://localhost:8080   api → http://localhost:4000
docker compose -f docker-compose.prod.yml exec api npm run db:seed   # optional
```

---

## 3 · Fully on Cloudflare (advanced, optional)

To run the API on Cloudflare too: use a serverless Postgres (e.g. **Neon**) behind
**Cloudflare Hyperdrive**, and adapt the API to a **Worker** using Prisma's driver
adapters (`@prisma/adapter-pg`). This is a larger change than the static Pages
deploy above and is best done as a follow-up — the current Node API is portable
and runs unchanged on any Node host.

---

## Environment variables — reference

**Web (Cloudflare Pages)**

| Var | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL. Omit → demo mode (mock data). |

**API (`server/`)**

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Signing secret (use a long random value) |
| `CORS_ORIGIN` | Allowed web origin, e.g. `https://med-pro-clinic.pages.dev` |
| `PORT` | Defaults to 4000 |
