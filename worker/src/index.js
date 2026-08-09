import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { signToken, verifyToken, verifyPassword, hashPassword } from './auth.js'
import { seed } from './seed.js'
import {
  uid,
  nowIso,
  first,
  all,
  run,
  mapUser,
  mapPatient,
  mapAppointment,
  mapQueueToken,
  mapLab,
  mapInventory,
  mapInvoice,
  mapPayment,
} from './db.js'

const app = new Hono()
const secretOf = (c) => c.env.JWT_SECRET || 'dev-insecure-secret-change-me'

// ---- CORS ----
app.use('*', (c, next) =>
  cors({
    origin: (origin) => {
      const allowed = (c.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)
      if (!allowed.length) return origin || '*'
      return allowed.includes(origin) ? origin : allowed[0]
    },
    credentials: true,
  })(c, next)
)

// ---- Health ----
app.get('/health', (c) => c.json({ status: 'ok', service: 'med-pro-clinic-worker', time: nowIso() }))

// ---- Auth guard for /api/* (except login + seed) ----
app.use('/api/*', async (c, next) => {
  const p = c.req.path
  if (p === '/api/auth/login' || p === '/api/dev/seed') return next()
  const [scheme, token] = (c.req.header('Authorization') || '').split(' ')
  if (scheme !== 'Bearer' || !token) return c.json({ error: 'Missing bearer token' }, 401)
  try {
    c.set('user', await verifyToken(token, secretOf(c)))
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
  return next()
})

const hasRole = (c, ...roles) => roles.includes(c.get('user')?.role)

// ================= AUTH =================
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json().catch(() => ({}))
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
  const u = await first(c.env.DB, 'SELECT * FROM users WHERE email = ?', email)
  if (!u || u.status === 'DISABLED' || !(await verifyPassword(password, u.password_hash)))
    return c.json({ error: 'Invalid credentials' }, 401)
  const token = await signToken({ id: u.id, role: u.role, name: u.name }, secretOf(c))
  return c.json({ token, user: { id: u.id, name: u.name, email: u.email, role: u.role, branch: u.branch } })
})

app.get('/api/auth/me', async (c) => {
  const u = await first(c.env.DB, 'SELECT * FROM users WHERE id = ?', c.get('user').id)
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({ user: mapUser(u) })
})

// ================= PATIENTS =================
app.get('/api/patients', async (c) => {
  const search = (c.req.query('search') || '').trim().toLowerCase()
  const filter = c.req.query('filter') || 'All'
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(c.req.query('pageSize')) || 20))

  const rows = await all(
    c.env.DB,
    `SELECT p.*, u.name AS doctor_name,
      (SELECT COALESCE(SUM(i.total),0) FROM invoices i WHERE i.patient_id = p.id AND i.status IN ('UNPAID','PARTIAL')) AS due_amount,
      (SELECT MAX(a.scheduled_at) FROM appointments a WHERE a.patient_id = p.id) AS last_visit
     FROM patients p LEFT JOIN users u ON u.id = p.doctor_id
     ORDER BY p.created_at DESC`
  )

  let list = rows.map((r) => mapPatient(r, { dueAmount: r.due_amount || 0, lastVisit: r.last_visit || null }))
  if (search) list = list.filter((p) => p.name.toLowerCase().includes(search) || p.code.toLowerCase().includes(search) || (p.phone || '').includes(search))
  if (filter === 'New') list = list.filter((p) => p.tags.includes('New'))
  else if (filter === 'Due') list = list.filter((p) => p.dueAmount > 0)
  else if (filter === 'Follow-up') list = list.filter((p) => p.lastVisit)

  const total = list.length
  const data = list.slice((page - 1) * pageSize, page * pageSize)
  return c.json({ data, page, pageSize, total, totalPages: Math.ceil(total / pageSize) })
})

app.get('/api/patients/:id', async (c) => {
  const r = await first(
    c.env.DB,
    'SELECT p.*, u.name AS doctor_name FROM patients p LEFT JOIN users u ON u.id = p.doctor_id WHERE p.id = ?',
    c.req.param('id')
  )
  if (!r) return c.json({ error: 'Patient not found' }, 404)
  const appointments = await all(c.env.DB, 'SELECT * FROM appointments WHERE patient_id = ? ORDER BY scheduled_at DESC LIMIT 10', r.id)
  const invoices = await all(c.env.DB, 'SELECT * FROM invoices WHERE patient_id = ? ORDER BY created_at DESC LIMIT 10', r.id)
  return c.json({ ...mapPatient(r), appointments, invoices: invoices.map(mapInvoice) })
})

app.post('/api/patients', async (c) => {
  if (!hasRole(c, 'ADMIN', 'DOCTOR', 'FRONT_DESK')) return c.json({ error: 'Forbidden' }, 403)
  const b = await c.req.json().catch(() => ({}))
  if (!b.name) return c.json({ error: 'Name is required' }, 400)
  let code = b.code
  if (!code) {
    const max = await first(c.env.DB, 'SELECT MAX(CAST(substr(code,2) AS INTEGER)) AS m FROM patients')
    code = `P${max?.m ? max.m + 1 : 1001}`
  }
  const id = uid()
  await run(
    c.env.DB,
    'INSERT INTO patients (id,code,name,age,gender,phone,email,blood_group,allergies,tags,doctor_id,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    id, code, b.name, b.age ?? null, b.gender ?? null, b.phone ?? null, b.email ?? null, b.bloodGroup ?? null,
    JSON.stringify(b.allergies || []), JSON.stringify(b.tags || []), b.doctorId ?? null, nowIso()
  )
  const r = await first(c.env.DB, 'SELECT * FROM patients WHERE id = ?', id)
  return c.json(mapPatient(r), 201)
})

// ================= APPOINTMENTS =================
app.get('/api/appointments', async (c) => {
  const from = c.req.query('from')
  const to = c.req.query('to')
  const doctorId = c.req.query('doctorId')
  const clauses = []
  const params = []
  if (from) { clauses.push('a.scheduled_at >= ?'); params.push(from) }
  if (to) { clauses.push('a.scheduled_at < ?'); params.push(to) }
  if (doctorId) { clauses.push('a.doctor_id = ?'); params.push(doctorId) }
  const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : ''
  const rows = await all(
    c.env.DB,
    `SELECT a.*, p.name AS patient_name, p.code AS patient_code, u.name AS doctor_name
     FROM appointments a JOIN patients p ON p.id = a.patient_id JOIN users u ON u.id = a.doctor_id
     ${where} ORDER BY a.scheduled_at ASC`,
    ...params
  )
  return c.json({ data: rows.map(mapAppointment) })
})

app.post('/api/appointments', async (c) => {
  if (!hasRole(c, 'ADMIN', 'DOCTOR', 'FRONT_DESK')) return c.json({ error: 'Forbidden' }, 403)
  const b = await c.req.json().catch(() => ({}))
  if (!b.patientId || !b.doctorId || !b.scheduledAt) return c.json({ error: 'patientId, doctorId, scheduledAt required' }, 400)
  const id = uid()
  await run(
    c.env.DB,
    'INSERT INTO appointments (id,patient_id,doctor_id,type,status,scheduled_at,room,notes,created_at) VALUES (?,?,?,?,?,?,?,?,?)',
    id, b.patientId, b.doctorId, b.type || 'CONSULTATION', 'BOOKED', new Date(b.scheduledAt).toISOString(), b.room ?? null, b.notes ?? null, nowIso()
  )
  return c.json({ id }, 201)
})

// ================= QUEUE =================
app.get('/api/queue', async (c) => {
  const serving = await first(
    c.env.DB,
    `SELECT q.*, p.name AS patient_name FROM queue_tokens q JOIN patients p ON p.id = q.patient_id
     WHERE q.status = 'SERVING' ORDER BY q.called_at DESC LIMIT 1`
  )
  const waiting = await all(
    c.env.DB,
    `SELECT q.*, p.name AS patient_name FROM queue_tokens q JOIN patients p ON p.id = q.patient_id
     WHERE q.status IN ('WAITING','CALLED','OVERDUE') ORDER BY q.enqueued_at ASC`
  )
  const served = await first(c.env.DB, "SELECT COUNT(*) AS n FROM queue_tokens WHERE status = 'DONE'")
  return c.json({
    serving: serving ? mapQueueToken(serving) : null,
    waiting: waiting.map(mapQueueToken),
    stats: { inQueue: waiting.length, servedToday: served?.n || 0 },
  })
})

app.post('/api/queue/:id/call', async (c) => {
  if (!hasRole(c, 'ADMIN', 'DOCTOR', 'FRONT_DESK')) return c.json({ error: 'Forbidden' }, 403)
  const id = c.req.param('id')
  const token = await first(c.env.DB, 'SELECT * FROM queue_tokens WHERE id = ?', id)
  if (!token) return c.json({ error: 'Token not found' }, 404)
  await run(c.env.DB, "UPDATE queue_tokens SET status = 'DONE' WHERE status = 'SERVING'")
  await run(c.env.DB, "UPDATE queue_tokens SET status = 'SERVING', called_at = ? WHERE id = ?", nowIso(), id)
  return c.json({ id, status: 'SERVING' })
})

// ================= CONSULTATIONS =================
app.post('/api/consultations', async (c) => {
  if (!hasRole(c, 'ADMIN', 'DOCTOR')) return c.json({ error: 'Forbidden' }, 403)
  const b = await c.req.json().catch(() => ({}))
  if (!b.patientId) return c.json({ error: 'patientId required' }, 400)
  const id = uid()
  await run(
    c.env.DB,
    'INSERT INTO consultations (id,patient_id,doctor_id,appointment_id,complaint,hpi,diagnosis,advice,vitals,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    id, b.patientId, c.get('user').id, b.appointmentId ?? null, b.complaint ?? null, b.hpi ?? null, b.diagnosis ?? null, b.advice ?? null,
    b.vitals ? JSON.stringify(b.vitals) : null, nowIso()
  )
  return c.json({ id }, 201)
})

// ================= PRESCRIPTIONS =================
app.post('/api/prescriptions', async (c) => {
  if (!hasRole(c, 'ADMIN', 'DOCTOR')) return c.json({ error: 'Forbidden' }, 403)
  const b = await c.req.json().catch(() => ({}))
  if (!b.patientId || !Array.isArray(b.items) || !b.items.length) return c.json({ error: 'patientId and items required' }, 400)
  const id = uid()
  await run(
    c.env.DB,
    'INSERT INTO prescriptions (id,patient_id,consultation_id,doctor_name,date) VALUES (?,?,?,?,?)',
    id, b.patientId, b.consultationId ?? null, b.doctorName ?? c.get('user').name, nowIso()
  )
  for (const it of b.items) {
    await run(
      c.env.DB,
      'INSERT INTO prescription_items (id,prescription_id,drug,dosage,frequency,duration,notes) VALUES (?,?,?,?,?,?,?)',
      uid(), id, it.drug, it.dosage ?? null, it.frequency ?? null, it.duration ?? null, it.notes ?? null
    )
  }
  return c.json({ id, items: b.items.length }, 201)
})

// ================= LAB =================
app.get('/api/lab', async (c) => {
  const status = c.req.query('status')
  const where = status && status !== 'All' ? 'WHERE l.status = ?' : ''
  const rows = await all(
    c.env.DB,
    `SELECT l.*, p.name AS patient_name FROM lab_orders l JOIN patients p ON p.id = l.patient_id ${where} ORDER BY l.ordered_at DESC`,
    ...(where ? [status] : [])
  )
  return c.json({ data: rows.map(mapLab) })
})

// ================= INVENTORY =================
app.get('/api/inventory', async (c) => {
  const filter = c.req.query('filter') || 'All'
  const items = await all(c.env.DB, 'SELECT * FROM inventory_items ORDER BY name ASC')
  const soon = Date.now() + 60 * 24 * 3600 * 1000
  const isExp = (i) => i.expiry && new Date(i.expiry).getTime() <= soon
  const stats = {
    totalSkus: items.length,
    lowStock: items.filter((i) => i.stock <= i.reorder_level).length,
    expiringSoon: items.filter(isExp).length,
    stockValue: items.reduce((s, i) => s + i.unit_rate * i.stock, 0),
  }
  let data = items
  if (filter === 'Low') data = items.filter((i) => i.stock <= i.reorder_level)
  else if (filter === 'Expiring') data = items.filter(isExp)
  return c.json({ data: data.map(mapInventory), stats })
})

// ================= PHARMACY =================
app.get('/api/pharmacy/alerts', async (c) => {
  const items = await all(c.env.DB, 'SELECT * FROM inventory_items')
  const soon = Date.now() + 60 * 24 * 3600 * 1000
  return c.json({
    outOfStock: items.filter((i) => i.stock === 0).map(mapInventory),
    lowStock: items.filter((i) => i.stock > 0 && i.stock <= i.reorder_level).map(mapInventory),
    expiring: items.filter((i) => i.expiry && new Date(i.expiry).getTime() <= soon).map(mapInventory),
  })
})

app.post('/api/pharmacy/dispense', async (c) => {
  if (!hasRole(c, 'ADMIN', 'PHARMACIST')) return c.json({ error: 'Forbidden' }, 403)
  const b = await c.req.json().catch(() => ({}))
  if (!b.patientId || !Array.isArray(b.items) || !b.items.length) return c.json({ error: 'patientId and items required' }, 400)

  const lines = []
  for (const line of b.items) {
    const item = await first(c.env.DB, 'SELECT * FROM inventory_items WHERE batch = ?', line.batch)
    if (!item) return c.json({ error: `Unknown batch ${line.batch}` }, 400)
    if (item.stock < line.qty) return c.json({ error: `Insufficient stock for ${item.name} (have ${item.stock})` }, 400)
    await run(c.env.DB, 'UPDATE inventory_items SET stock = stock - ?, updated_at = ? WHERE batch = ?', line.qty, nowIso(), line.batch)
    lines.push({ description: `${item.name} × ${line.qty}`, amount: item.unit_rate * line.qty })
  }

  let invoice = null
  if (b.createInvoice !== false) {
    const count = await first(c.env.DB, 'SELECT COUNT(*) AS n FROM invoices')
    const number = `INV-${new Date().getFullYear()}-${String((count?.n || 0) + 1).padStart(4, '0')}`
    const subtotal = lines.reduce((s, l) => s + l.amount, 0)
    const id = uid()
    await run(
      c.env.DB,
      'INSERT INTO invoices (id,number,patient_id,lines,subtotal,tax,discount,total,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      id, number, b.patientId, JSON.stringify(lines), subtotal, 0, 0, subtotal, 'UNPAID', nowIso()
    )
    invoice = { id, number, total: subtotal }
  }
  return c.json({ lines, invoice }, 201)
})

// ================= INVOICES =================
app.get('/api/invoices/:id', async (c) => {
  const r = await first(c.env.DB, 'SELECT * FROM invoices WHERE id = ?', c.req.param('id'))
  if (!r) return c.json({ error: 'Invoice not found' }, 404)
  const patient = await first(c.env.DB, 'SELECT name, code FROM patients WHERE id = ?', r.patient_id)
  const payments = await all(c.env.DB, 'SELECT * FROM payments WHERE invoice_id = ?', r.id)
  return c.json({ ...mapInvoice(r), patient, payments: payments.map(mapPayment) })
})

app.post('/api/invoices', async (c) => {
  if (!hasRole(c, 'ADMIN', 'FRONT_DESK')) return c.json({ error: 'Forbidden' }, 403)
  const b = await c.req.json().catch(() => ({}))
  if (!b.patientId || !Array.isArray(b.lines) || !b.lines.length) return c.json({ error: 'patientId and lines required' }, 400)
  const taxRate = b.taxRate ?? 0.18
  const discountRate = b.discountRate ?? 0
  const subtotal = b.lines.reduce((s, l) => s + Number(l.amount), 0)
  const discount = +(subtotal * discountRate).toFixed(2)
  const tax = +((subtotal - discount) * taxRate).toFixed(2)
  const total = +(subtotal - discount + tax).toFixed(2)
  const count = await first(c.env.DB, 'SELECT COUNT(*) AS n FROM invoices')
  const number = `INV-${new Date().getFullYear()}-${String((count?.n || 0) + 1).padStart(4, '0')}`
  const id = uid()
  await run(
    c.env.DB,
    'INSERT INTO invoices (id,number,patient_id,lines,subtotal,tax,discount,total,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    id, number, b.patientId, JSON.stringify(b.lines), subtotal, tax, discount, total, 'UNPAID', nowIso()
  )
  const r = await first(c.env.DB, 'SELECT * FROM invoices WHERE id = ?', id)
  return c.json(mapInvoice(r), 201)
})

// ================= PAYMENTS =================
app.get('/api/payments', async (c) => {
  const filter = c.req.query('filter') || 'All'
  const where = filter === 'Paid' ? "WHERE pay.status = 'PAID'" : filter === 'Pending' ? "WHERE pay.status = 'PENDING'" : ''
  const rows = await all(
    c.env.DB,
    `SELECT pay.*, p.name AS patient_name, i.number AS invoice_number
     FROM payments pay JOIN patients p ON p.id = pay.patient_id LEFT JOIN invoices i ON i.id = pay.invoice_id
     ${where} ORDER BY pay.created_at DESC LIMIT 100`
  )
  const paid = await all(c.env.DB, "SELECT method, amount FROM payments WHERE status = 'PAID'")
  const byMethod = paid.reduce((acc, p) => ((acc[p.method] = (acc[p.method] || 0) + p.amount), acc), {})
  return c.json({ data: rows.map(mapPayment), byMethod })
})

app.post('/api/payments', async (c) => {
  if (!hasRole(c, 'ADMIN', 'FRONT_DESK')) return c.json({ error: 'Forbidden' }, 403)
  const b = await c.req.json().catch(() => ({}))
  if (!b.patientId || !b.method || !b.amount) return c.json({ error: 'patientId, method, amount required' }, 400)
  const reference = `TXN-${Date.now().toString().slice(-6)}`
  const id = uid()
  await run(
    c.env.DB,
    'INSERT INTO payments (id,reference,invoice_id,patient_id,method,amount,status,created_at) VALUES (?,?,?,?,?,?,?,?)',
    id, reference, b.invoiceId ?? null, b.patientId, b.method, Number(b.amount), 'PAID', nowIso()
  )
  if (b.invoiceId) {
    const inv = await first(c.env.DB, 'SELECT * FROM invoices WHERE id = ?', b.invoiceId)
    if (inv) {
      const paidRows = await all(c.env.DB, "SELECT amount FROM payments WHERE invoice_id = ? AND status = 'PAID'", b.invoiceId)
      const paidTotal = paidRows.reduce((s, p) => s + p.amount, 0)
      await run(c.env.DB, 'UPDATE invoices SET status = ? WHERE id = ?', paidTotal >= inv.total ? 'PAID' : 'PARTIAL', b.invoiceId)
    }
  }
  return c.json({ id, reference, status: 'PAID' }, 201)
})

// ================= REPORTS =================
app.get('/api/reports/dashboard', async (c) => {
  const start = new Date(); start.setHours(0, 0, 0, 0)
  const end = new Date(start); end.setDate(end.getDate() + 1)
  const s = start.toISOString(), e = end.toISOString()

  const appt = await first(c.env.DB, 'SELECT COUNT(*) AS n FROM appointments WHERE scheduled_at >= ? AND scheduled_at < ?', s, e)
  const waiting = await first(c.env.DB, "SELECT COUNT(*) AS n FROM queue_tokens WHERE status IN ('WAITING','CALLED','OVERDUE')")
  const consults = await first(c.env.DB, 'SELECT COUNT(*) AS n FROM consultations WHERE created_at >= ?', s)
  const rev = await first(c.env.DB, "SELECT COALESCE(SUM(amount),0) AS v FROM payments WHERE status = 'PAID' AND created_at >= ?", s)
  const pend = await first(c.env.DB, "SELECT COALESCE(SUM(total),0) AS v, COUNT(*) AS n FROM invoices WHERE status IN ('UNPAID','PARTIAL')")

  return c.json({
    kpis: {
      appointmentsToday: appt?.n || 0,
      waiting: waiting?.n || 0,
      consultsToday: consults?.n || 0,
      revenueToday: rev?.v || 0,
      pendingAmount: pend?.v || 0,
      pendingCount: pend?.n || 0,
    },
  })
})

app.get('/api/reports/analytics', async (c) => {
  const since = new Date(); since.setMonth(since.getMonth() - 5, 1); since.setHours(0, 0, 0, 0)
  const s = since.toISOString()

  const payments = await all(c.env.DB, "SELECT amount, created_at FROM payments WHERE status = 'PAID' AND created_at >= ?", s)
  const revenueByMonth = {}
  for (const p of payments) {
    const d = new Date(p.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    revenueByMonth[key] = (revenueByMonth[key] || 0) + p.amount
  }
  const newPatients = await first(c.env.DB, 'SELECT COUNT(*) AS n FROM patients WHERE created_at >= ?', s)
  const consultations = await first(c.env.DB, 'SELECT COUNT(*) AS n FROM consultations WHERE created_at >= ?', s)
  const doctors = await all(
    c.env.DB,
    `SELECT u.name, COUNT(cn.id) AS consultations FROM users u LEFT JOIN consultations cn ON cn.doctor_id = u.id
     WHERE u.role IN ('DOCTOR','ADMIN') GROUP BY u.id ORDER BY consultations DESC LIMIT 5`
  )
  return c.json({
    revenueByMonth,
    totals: {
      revenue: payments.reduce((sum, p) => sum + p.amount, 0),
      newPatients: newPatients?.n || 0,
      consultations: consultations?.n || 0,
    },
    topDoctors: doctors.map((d) => ({ name: d.name, consultations: d.consultations })),
  })
})

// ================= USERS =================
app.get('/api/users', async (c) => {
  if (!hasRole(c, 'ADMIN')) return c.json({ error: 'Forbidden' }, 403)
  const rows = await all(c.env.DB, 'SELECT * FROM users ORDER BY created_at ASC')
  return c.json({ data: rows.map(mapUser) })
})

app.post('/api/users', async (c) => {
  if (!hasRole(c, 'ADMIN')) return c.json({ error: 'Forbidden' }, 403)
  const b = await c.req.json().catch(() => ({}))
  if (!b.name || !b.email || !b.password || !b.role) return c.json({ error: 'name, email, password, role required' }, 400)
  const id = uid()
  await run(
    c.env.DB,
    'INSERT INTO users (id,name,email,password_hash,role,branch,status,created_at) VALUES (?,?,?,?,?,?,?,?)',
    id, b.name, b.email, await hashPassword(b.password), b.role, b.branch || 'Main', 'INVITED', nowIso()
  )
  const r = await first(c.env.DB, 'SELECT * FROM users WHERE id = ?', id)
  return c.json(mapUser(r), 201)
})

// ================= DEV SEED =================
app.post('/api/dev/seed', async (c) => {
  // Optional guard: if SEED_TOKEN is configured, require it.
  if (c.env.SEED_TOKEN && c.req.header('X-Seed-Token') !== c.env.SEED_TOKEN)
    return c.json({ error: 'Forbidden' }, 403)
  const result = await seed(c.env.DB)
  return c.json(result)
})

// ---- 404 + error ----
app.notFound((c) => c.json({ error: 'Not found' }, 404))
app.onError((err, c) => {
  console.error(err)
  if (String(err.message || '').includes('UNIQUE')) return c.json({ error: 'Unique constraint violated' }, 409)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
