// Maps API response shapes onto the shapes the UI components expect, and
// provides small presentation helpers so live + demo data render identically.

const GRADIENTS = [
  'from-[#4361ee] to-[#7c5cf0]',
  'from-[#0ea5a0] to-[#12b3a3]',
  'from-[#d98a00] to-[#f5a623]',
  'from-[#7c5cf0] to-[#a48cff]',
  'from-[#e0396b] to-[#f5678f]',
  'from-[#0d9aa0] to-[#3a56e0]',
  'from-[#5a72f0] to-[#7c5cf0]',
]

export function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return ((parts[0][0] || '') + (parts[1]?.[0] || '')).toUpperCase()
}

// Deterministic gradient per name so a patient always looks the same.
export function gradientFor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return GRADIENTS[h % GRADIENTS.length]
}

const cap = (s) => (s ? s[0] + s.slice(1).toLowerCase() : s)

export const inr0 = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

export function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ---- Patients ----
export function mapPatient(p) {
  return {
    id: p.code,
    _id: p.id,
    name: p.name,
    initials: initialsOf(p.name),
    gradient: gradientFor(p.name),
    age: p.age ?? '—',
    gender: cap(p.gender) ?? '—',
    phone: p.phone ?? '—',
    doctor: p.doctor?.name ?? '—',
    lastVisit: fmtDate(p.lastVisit),
    due: Number(p.dueAmount || 0),
    tag: p.tags?.[0] || 'General',
  }
}

// ---- Queue ----
const QUEUE_STATUS = {
  WAITING: { status: 'wait', label: 'Waiting' },
  CALLED: { status: 'called', label: 'Called' },
  SERVING: { status: 'called', label: 'Serving' },
  OVERDUE: { status: 'over', label: 'Overdue' },
  DONE: { status: 'done', label: 'Arrived' },
}
export function mapQueue(res) {
  const serving = res.serving
    ? { token: '#' + String(res.serving.number).padStart(3, '0'), name: res.serving.patient?.name || '—', detail: [res.serving.type, res.serving.room].filter(Boolean).join(' · ') }
    : { token: '#—', name: 'No patient', detail: 'Queue empty' }
  const rows = (res.waiting || []).map((q) => ({
    token: '#' + String(q.number).padStart(3, '0'),
    name: q.patient?.name || '—',
    type: q.type || '—',
    doctor: q.doctorName || '—',
    waited: waitedSince(q.enqueuedAt),
    ...(QUEUE_STATUS[q.status] || { status: 'wait', label: q.status }),
  }))
  return { serving, rows, next: rows.slice(0, 3).map((r) => ({ token: r.token, name: r.name, wait: r.waited })), stats: res.stats }
}
function waitedSince(t) {
  if (!t) return '—'
  const mins = Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 60000))
  return mins + 'm'
}

// ---- Lab ----
const LAB_STATUS = {
  ORDERED: { status: 'crit', label: 'Awaiting sample' },
  SAMPLE_TAKEN: { status: 'cyan', label: 'Sample taken' },
  PROCESSING: { status: 'warn', label: 'Processing' },
  READY: { status: 'good', label: 'Ready' },
  DELIVERED: { status: 'good', label: 'Delivered' },
}
export function mapLab(o) {
  return {
    id: o.code,
    patient: o.patient?.name || '—',
    test: o.tests,
    sample: o.sample || '—',
    by: o.orderedBy || '—',
    ...(LAB_STATUS[o.status] || { status: 'warn', label: o.status }),
  }
}

// ---- Inventory ----
export function mapInventory(it) {
  const soon = Date.now() + 60 * 24 * 3600 * 1000
  let s = { status: 'good', label: 'OK' }
  if (it.stock === 0) s = { status: 'crit', label: 'Out' }
  else if (it.stock <= it.reorderLevel) s = { status: 'warn', label: 'Low' }
  else if (it.expiry && new Date(it.expiry).getTime() <= soon) s = { status: 'violet', label: 'Expiring' }
  return {
    item: it.name,
    cat: it.category || '—',
    batch: it.batch,
    stock: it.stock,
    reorder: it.reorderLevel,
    expiry: it.expiry ? new Date(it.expiry).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—',
    supplier: it.supplier || '—',
    ...s,
  }
}

// ---- Payments ----
const PAY_STATUS = { PAID: { status: 'good', label: 'Paid' }, PENDING: { status: 'warn', label: 'Pending' }, REFUNDED: { status: 'crit', label: 'Refunded' } }
export function mapPayment(p) {
  return {
    txn: p.reference,
    patient: p.patient?.name || '—',
    inv: p.invoice?.number || '—',
    method: p.method,
    amount: Number(p.amount),
    time: new Date(p.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    ...(PAY_STATUS[p.status] || { status: 'warn', label: p.status }),
  }
}

// ---- Users ----
const ROLE_LABEL = { ADMIN: 'Admin', DOCTOR: 'Doctor', FRONT_DESK: 'Front desk', PHARMACIST: 'Pharmacist' }
const USER_STATUS = { ACTIVE: { status: 'good', label: 'Active' }, INVITED: { status: 'warn', label: 'Invited' }, DISABLED: { status: 'crit', label: 'Disabled' } }
export function mapUser(u) {
  return {
    name: u.name,
    initials: initialsOf(u.name),
    grad: gradientFor(u.name),
    role: u.role === 'ADMIN' ? 'Admin · Doctor' : ROLE_LABEL[u.role] || u.role,
    branch: u.branch,
    ...(USER_STATUS[u.status] || { status: 'good', label: u.status }),
  }
}
