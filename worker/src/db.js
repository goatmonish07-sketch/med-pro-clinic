// Thin helpers over the D1 binding + row → API-shape mappers.
// Shapes intentionally match the Node/Prisma API so the front end is unchanged.

export const uid = () => crypto.randomUUID()
export const nowIso = () => new Date().toISOString()

export const first = (db, sql, ...p) => db.prepare(sql).bind(...p).first()
export const all = async (db, sql, ...p) => (await db.prepare(sql).bind(...p).all()).results
export const run = (db, sql, ...p) => db.prepare(sql).bind(...p).run()

const jparse = (s, fallback) => {
  try {
    return s ? JSON.parse(s) : fallback
  } catch {
    return fallback
  }
}

// ---- mappers ----
export const mapUser = (r) =>
  r && { id: r.id, name: r.name, email: r.email, role: r.role, branch: r.branch, status: r.status, createdAt: r.created_at }

export const mapPatient = (r, extra = {}) =>
  r && {
    id: r.id,
    code: r.code,
    name: r.name,
    age: r.age,
    gender: r.gender,
    phone: r.phone,
    email: r.email,
    bloodGroup: r.blood_group,
    allergies: jparse(r.allergies, []),
    tags: jparse(r.tags, []),
    doctor: r.doctor_name ? { name: r.doctor_name } : null,
    createdAt: r.created_at,
    ...extra,
  }

export const mapAppointment = (r) =>
  r && {
    id: r.id,
    type: r.type,
    status: r.status,
    scheduledAt: r.scheduled_at,
    room: r.room,
    patient: { name: r.patient_name, code: r.patient_code },
    doctor: { name: r.doctor_name },
  }

export const mapQueueToken = (r) =>
  r && {
    id: r.id,
    number: r.number,
    type: r.type,
    room: r.room,
    doctorName: r.doctor_name,
    status: r.status,
    enqueuedAt: r.enqueued_at,
    patient: { name: r.patient_name },
  }

export const mapLab = (r) =>
  r && {
    id: r.id,
    code: r.code,
    tests: r.tests,
    sample: r.sample,
    orderedBy: r.ordered_by,
    status: r.status,
    orderedAt: r.ordered_at,
    patient: { name: r.patient_name },
  }

export const mapInventory = (r) =>
  r && {
    id: r.id,
    name: r.name,
    category: r.category,
    batch: r.batch,
    stock: r.stock,
    reorderLevel: r.reorder_level,
    expiry: r.expiry,
    supplier: r.supplier,
    unitRate: r.unit_rate,
  }

export const mapInvoice = (r) =>
  r && {
    id: r.id,
    number: r.number,
    patientId: r.patient_id,
    lines: jparse(r.lines, []),
    subtotal: r.subtotal,
    tax: r.tax,
    discount: r.discount,
    total: r.total,
    status: r.status,
    createdAt: r.created_at,
  }

export const mapPayment = (r) =>
  r && {
    id: r.id,
    reference: r.reference,
    method: r.method,
    amount: r.amount,
    status: r.status,
    createdAt: r.created_at,
    patient: { name: r.patient_name },
    invoice: r.invoice_number ? { number: r.invoice_number } : null,
  }
