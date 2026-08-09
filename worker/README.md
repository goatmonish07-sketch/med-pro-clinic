# MED-PRO Clinic OS — API on Cloudflare Workers + D1

The **entire backend running on Cloudflare** — a [Hono](https://hono.dev) Worker
with a **D1** (Cloudflare's SQLite) database. No external services, no servers to
manage. Same REST surface and response shapes as the Node API in `../server`, so
the front end works against it unchanged.

- Auth: JWT (HS256 via Web Crypto) + PBKDF2 password hashing + role-based access
- Data: D1, schema in `migrations/`, idempotent demo seed via `POST /api/dev/seed`
- Framework: Hono (routing, CORS, error handling)

## Deploy (all on Cloudflare)

```bash
cd worker
npm install
npx wrangler login

# 1) Create the D1 database, then paste the printed database_id into wrangler.toml
npm run db:create

# 2) Apply the schema to the remote D1
npm run db:migrate

# 3) Set the JWT secret (and an optional seed guard)
npx wrangler secret put JWT_SECRET
# npx wrangler secret put SEED_TOKEN   # optional; then send header X-Seed-Token

# 4) Deploy → https://med-pro-clinic-api.<your-subdomain>.workers.dev
npm run deploy

# 5) Load demo data (once)
curl -X POST https://med-pro-clinic-api.<your-subdomain>.workers.dev/api/dev/seed
```

Then set the web app's `VITE_API_URL` (Cloudflare Pages) to the Worker URL and
redeploy. Update `CORS_ORIGIN` in `wrangler.toml` if your web URL differs from
the default. Sign in with **admin@medpro.clinic / medpro123** → live data.

## Develop locally

```bash
npm run db:migrate:local          # apply schema to a local D1
npm run dev                       # wrangler dev on http://localhost:8787
curl -X POST http://localhost:8787/api/dev/seed
```

## Test

`npm test` runs an end-to-end suite that backs the D1 binding with SQLite and
drives the Hono app through login, reads, and write flows (invoice → payment →
PAID). No Cloudflare account required.

## Endpoints

Identical to the Node API — see [`../server/README.md`](../server/README.md).
Extra: `POST /api/dev/seed` (idempotent demo data).

## Notes

- D1 is SQLite, so this schema stores enums/arrays/JSON as TEXT and money as REAL
  (the Postgres `server/` uses native types). The API responses are identical.
- Passwords use PBKDF2 (Web Crypto) because bcrypt has no Workers build.
