# MED-PRO Clinic OS — API

REST API for the clinic OS. **Express + Prisma + PostgreSQL**, JWT auth with
role-based access control (RBAC), request validation (zod), and a seed that
loads the same demo data the front end shows.

## Quick start

```bash
cd server
cp .env.example .env

# 1) Start Postgres (Docker) — or point DATABASE_URL at your own
docker compose up -d

# 2) Install, migrate, seed
npm install
npm run prisma:migrate      # creates tables
npm run db:seed             # loads demo clinic data

# 3) Run
npm run dev                 # http://localhost:4000  (nodemon)
```

Health check: `GET http://localhost:4000/health` (works without a database).

Seed admin login: **admin@medpro.clinic / medpro123**
(other seeded users: `smith@`, `reena@`, `pharma@` — all `medpro123`.)

## Auth

```bash
# Login → returns a JWT
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@medpro.clinic","password":"medpro123"}'

# Use the token
curl http://localhost:4000/api/patients -H "Authorization: Bearer <TOKEN>"
```

Roles: `ADMIN`, `DOCTOR`, `FRONT_DESK`, `PHARMACIST`. Write endpoints enforce
the appropriate role; all data endpoints require a valid token.

## Endpoints

| Group | Routes |
| --- | --- |
| Auth | `POST /api/auth/login`, `GET /api/auth/me` |
| Patients | `GET/POST /api/patients`, `GET/PATCH/DELETE /api/patients/:id` |
| Appointments | `GET/POST /api/appointments`, `PATCH /api/appointments/:id/status` |
| Queue | `GET/POST /api/queue`, `POST /api/queue/:id/call`, `PATCH /api/queue/:id/status` |
| Consultations | `GET /api/consultations/:id`, `POST/PATCH`, `POST /:id/sign` |
| Prescriptions | `GET /api/prescriptions/:id`, `POST /api/prescriptions` |
| Laboratory | `GET/POST /api/lab`, `PATCH /api/lab/:id` |
| Pharmacy | `GET /api/pharmacy/alerts`, `POST /api/pharmacy/dispense` |
| Billing | `GET /api/invoices/:id`, `POST /api/invoices` |
| Payments | `GET/POST /api/payments`, `POST /api/payments/:id/refund` |
| Inventory | `GET/POST /api/inventory`, `PATCH /api/inventory/:id` |
| Reports | `GET /api/reports/dashboard`, `GET /api/reports/analytics` |
| Users | `GET/POST /api/users`, `PATCH /api/users/:id` (admin) |

Highlights: invoices compute GST/discount **server-side**; payments run in a
**transaction** that flips the invoice to `PAID`/`PARTIAL`; pharmacy dispensing
**decrements stock atomically** and can raise an invoice; reports **aggregate**
live KPIs and analytics.

## Structure

```
server/
  prisma/
    schema.prisma     Data model (13 models, enums, indexes)
    seed.js           Demo data loader
    migrations/       Committed SQL migrations
  src/
    index.js          Entry (listen + graceful shutdown)
    app.js            Express app (helmet, cors, json, routes, errors)
    env.js            Validated env access
    db.js             Prisma singleton
    middleware/       auth (JWT + RBAC), validate (zod), error
    routes/           One module per resource + index.js
    utils/            httpError, asyncHandler, jwt
```

## Connecting the front end

Set `VITE_API_URL` in the web app's `.env` to this server's URL and use the
client in `src/lib/api.js`. Response shapes match `src/data/mock.js`, so swapping
a page from mock data to live calls is a localized change.

## Notes

- `npm run db:reset` drops + recreates + reseeds (dev only).
- Integrations designed into the model but stubbed for later: payment gateway
  (Razorpay/Stripe), WhatsApp/SMS reminders, and the tele-consult video SDK.
