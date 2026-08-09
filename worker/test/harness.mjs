// Local end-to-end test for the Worker. Backs the D1 binding with better-sqlite3
// (D1 is SQLite too), imports the Hono app, and drives it via app.fetch().
// Run: node test/harness.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import Database from 'better-sqlite3'
import app from '../src/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---- D1 shim over better-sqlite3 ----
class Stmt {
  constructor(bs) { this.bs = bs; this.params = [] }
  bind(...p) { this.params = p; return this }
  async first() { return this.bs.get(...this.params) ?? null }
  async all() { return { results: this.bs.all(...this.params) } }
  async run() { const i = this.bs.run(...this.params); return { success: true, meta: { changes: i.changes } } }
}
class D1 {
  constructor(db) { this.db = db }
  prepare(sql) { return new Stmt(this.db.prepare(sql)) }
}

const sqlite = new Database(':memory:')
sqlite.exec(readFileSync(join(__dirname, '../migrations/0001_init.sql'), 'utf8'))

const env = { DB: new D1(sqlite), JWT_SECRET: 'test-secret', CORS_ORIGIN: 'http://localhost:5173' }

// ---- helpers ----
let token = null
let pass = 0
let fail = 0
async function call(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await app.fetch(new Request('http://localhost' + path, { method, headers, body: body ? JSON.stringify(body) : undefined }), env)
  const json = await res.json().catch(() => ({}))
  return { status: res.status, json }
}
function check(name, cond, detail = '') {
  if (cond) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ✗ ${name}  ${detail}`) }
}

const run = async () => {
  console.log('MED-PRO Worker — end-to-end (D1 shim)\n')

  let r = await call('GET', '/health')
  check('health ok', r.status === 200 && r.json.status === 'ok')

  r = await call('POST', '/api/dev/seed')
  check('seed runs', r.status === 200 && r.json.seeded === true, JSON.stringify(r.json))
  r = await call('POST', '/api/dev/seed')
  check('seed idempotent', r.json.seeded === false)

  r = await call('POST', '/api/auth/login', { email: 'admin@medpro.clinic', password: 'medpro123' })
  check('login returns token', r.status === 200 && !!r.json.token, JSON.stringify(r.json))
  token = r.json.token
  check('login user is admin', r.json.user?.role === 'ADMIN')

  r = await call('POST', '/api/auth/login', { email: 'admin@medpro.clinic', password: 'wrong' })
  check('bad password → 401', r.status === 401)

  const saved = token; token = null
  r = await call('GET', '/api/patients')
  check('no token → 401', r.status === 401)
  token = saved

  r = await call('GET', '/api/auth/me')
  check('me returns user', r.json.user?.email === 'admin@medpro.clinic')

  r = await call('GET', '/api/patients')
  check('patients list = 7', r.json.total === 7, `total=${r.json.total}`)
  const suresh = r.json.data.find((p) => p.name === 'Suresh Reddy')
  check('computed due for Suresh = 2340', suresh?.dueAmount === 2340, `due=${suresh?.dueAmount}`)
  check('patient has lastVisit', !!suresh?.lastVisit)

  r = await call('GET', '/api/patients?search=roni')
  check('search filters', r.json.total === 1 && r.json.data[0].name === 'Roni Kumar')

  r = await call('GET', '/api/reports/dashboard')
  check('dashboard KPIs', r.json.kpis?.appointmentsToday === 5 && r.json.kpis?.pendingCount === 2, JSON.stringify(r.json.kpis))
  check('dashboard revenue today > 0', r.json.kpis.revenueToday > 0)

  r = await call('GET', '/api/queue')
  check('queue serving #24', r.json.serving?.number === 24 && r.json.waiting.length === 4)

  r = await call('GET', '/api/lab')
  check('lab orders = 5', r.json.data.length === 5)

  r = await call('GET', '/api/inventory')
  check('inventory stats', r.json.stats?.totalSkus === 5 && r.json.stats.lowStock >= 1)

  r = await call('GET', '/api/payments')
  check('payments byMethod UPI', r.json.byMethod?.UPI > 0, JSON.stringify(r.json.byMethod))

  r = await call('GET', '/api/reports/analytics')
  check('analytics totals', r.json.totals?.revenue > 0 && Object.keys(r.json.revenueByMonth).length >= 1)

  r = await call('GET', '/api/users')
  check('users list = 4', r.json.data.length === 4)

  // Write flow: create patient → invoice → payment → invoice PAID
  r = await call('POST', '/api/patients', { name: 'Test Person', age: 30, gender: 'MALE', tags: ['New'] })
  check('create patient auto-code', r.status === 201 && /^P\d+$/.test(r.json.code), r.json.code)
  const pid = r.json.id

  r = await call('POST', '/api/invoices', { patientId: pid, lines: [{ description: 'Consultation', amount: 500 }] })
  check('invoice computes GST total 590', r.status === 201 && r.json.total === 590, `total=${r.json.total}`)
  const invId = r.json.id

  r = await call('POST', '/api/payments', { invoiceId: invId, patientId: pid, method: 'UPI', amount: 590 })
  check('payment recorded', r.status === 201 && r.json.status === 'PAID')

  r = await call('GET', `/api/invoices/${invId}`)
  check('invoice now PAID', r.json.status === 'PAID', `status=${r.json.status}`)

  r = await call('POST', '/api/patients', { age: 30 })
  check('validation: missing name → 400', r.status === 400)

  r = await call('GET', '/api/nope')
  check('unknown route → 404', r.status === 404)

  console.log(`\n${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
}

run().catch((e) => { console.error(e); process.exit(1) })
