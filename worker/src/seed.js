import { hashPassword } from './auth.js'
import { uid, nowIso, first, run } from './db.js'

// Idempotent demo seed — no-ops if users already exist.
export async function seed(db) {
  const existing = await first(db, 'SELECT COUNT(*) AS n FROM users')
  if (existing && existing.n > 0) return { seeded: false, message: 'Already seeded' }

  const now = nowIso()
  const adminHash = await hashPassword('medpro123')

  const users = [
    ['Dr. John Doe', 'admin@medpro.clinic', 'ADMIN', 'ACTIVE'],
    ['Dr. Smith', 'smith@medpro.clinic', 'DOCTOR', 'ACTIVE'],
    ['Reena (Reception)', 'reena@medpro.clinic', 'FRONT_DESK', 'ACTIVE'],
    ['Pharma Desk', 'pharma@medpro.clinic', 'PHARMACIST', 'INVITED'],
  ]
  const userIds = {}
  for (const [name, email, role, status] of users) {
    const id = uid()
    userIds[email] = id
    await run(
      db,
      'INSERT INTO users (id,name,email,password_hash,role,branch,status,created_at) VALUES (?,?,?,?,?,?,?,?)',
      id, name, email, adminHash, role, 'Main', status, now
    )
  }
  const admin = userIds['admin@medpro.clinic']
  const smith = userIds['smith@medpro.clinic']

  const patients = [
    ['P1001', 'Roni Kumar', 34, 'MALE', '+91 90154 6201', 'B+', ['Penicillin'], ['Diabetic'], admin],
    ['P1002', 'Anitha Sharma', 29, 'FEMALE', '+91 98456 3390', null, [], ['New'], admin],
    ['P1003', 'Suresh Reddy', 41, 'MALE', '+91 99870 1223', null, [], ['Hypertension'], smith],
    ['P1004', 'Priya Patel', 26, 'FEMALE', '+91 88790 5567', null, [], ['Tele'], admin],
    ['P1005', 'Vikram Singh', 52, 'MALE', '+91 90087 4410', null, [], ['Cardiac'], smith],
    ['P1006', 'Meena Nair', 38, 'FEMALE', '+91 91234 8890', null, [], ['Thyroid'], admin],
    ['P1007', 'Arjun Das', 45, 'MALE', '+91 98111 2200', null, [], ['General'], smith],
  ]
  const pid = {}
  for (const [code, name, age, gender, phone, bg, allergies, tags, doctorId] of patients) {
    const id = uid()
    pid[code] = id
    await run(
      db,
      'INSERT INTO patients (id,code,name,age,gender,phone,blood_group,allergies,tags,doctor_id,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      id, code, name, age, gender, phone, bg, JSON.stringify(allergies), JSON.stringify(tags), doctorId, now
    )
  }

  const inv = [
    ['Paracetamol 500mg', 'Analgesic', 'PA2291', 40, 100, '2027-03-01', 'MedSupply Co.', 2],
    ['ORS sachet', 'Rehydration', 'OR1120', 0, 50, '2027-06-01', 'MedSupply Co.', 12],
    ['Amoxicillin 250mg', 'Antibiotic', 'AM4410', 28, 80, '2027-01-01', 'PharmaWorld', 5],
    ['Cetirizine 10mg', 'Antihistamine', 'CT8830', 220, 100, '2026-09-20', 'PharmaWorld', 3],
    ['Insulin (vial)', 'Hormone', 'IN2201', 64, 30, '2026-12-01', 'ColdChain Ltd', 180],
  ]
  for (const [name, cat, batch, stock, reorder, expiry, supplier, rate] of inv) {
    await run(
      db,
      'INSERT INTO inventory_items (id,name,category,batch,stock,reorder_level,expiry,supplier,unit_rate,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      uid(), name, cat, batch, stock, reorder, expiry, supplier, rate, now, now
    )
  }

  // Appointments today
  const at = (h, m) => {
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }
  const appts = [
    ['P1001', admin, 'FOLLOW_UP', 'DONE', at(9, 0), 'Room 02'],
    ['P1002', admin, 'CONSULTATION', 'IN_ROOM', at(9, 30), 'Room 02'],
    ['P1003', smith, 'FOLLOW_UP', 'WAITING', at(10, 0), 'Room 04'],
    ['P1004', admin, 'TELE', 'BOOKED', at(10, 30), null],
    ['P1005', smith, 'CONSULTATION', 'WAITING', at(11, 0), 'Room 04'],
  ]
  for (const [code, doctorId, type, status, when, room] of appts) {
    await run(
      db,
      'INSERT INTO appointments (id,patient_id,doctor_id,type,status,scheduled_at,room,created_at) VALUES (?,?,?,?,?,?,?,?)',
      uid(), pid[code], doctorId, type, status, when, room, now
    )
  }

  // Queue
  await run(
    db,
    'INSERT INTO queue_tokens (id,number,patient_id,doctor_name,type,room,status,enqueued_at,called_at) VALUES (?,?,?,?,?,?,?,?,?)',
    uid(), 24, pid['P1001'], 'Dr. John Doe', 'Consultation', 'Room 02', 'SERVING', now, now
  )
  const waiting = [
    ['P1002', 25, 'Consultation', 'Dr. John Doe'],
    ['P1003', 26, 'Follow-up', 'Dr. Smith'],
    ['P1004', 27, 'Consultation', 'Dr. John Doe'],
    ['P1005', 28, 'Consultation', 'Dr. Smith'],
  ]
  for (const [code, number, type, doc] of waiting) {
    await run(
      db,
      'INSERT INTO queue_tokens (id,number,patient_id,doctor_name,type,status,enqueued_at) VALUES (?,?,?,?,?,?,?)',
      uid(), number, pid[code], doc, type, 'WAITING', now
    )
  }

  // Lab
  const labs = [
    ['L-2201', 'P1001', 'CBC, CRP', 'Blood', 'Dr. John Doe', 'READY'],
    ['L-2202', 'P1003', 'Lipid profile, HbA1c', 'Blood', 'Dr. Smith', 'PROCESSING'],
    ['L-2203', 'P1006', 'TSH, T3, T4', 'Blood', 'Dr. John Doe', 'READY'],
    ['L-2204', 'P1005', 'ECG, Troponin', '—', 'Dr. Smith', 'SAMPLE_TAKEN'],
    ['L-2205', 'P1002', 'Urine routine', 'Urine', 'Dr. John Doe', 'ORDERED'],
  ]
  for (const [code, pcode, tests, sample, by, status] of labs) {
    await run(
      db,
      'INSERT INTO lab_orders (id,code,patient_id,tests,sample,ordered_by,status,ordered_at) VALUES (?,?,?,?,?,?,?,?)',
      uid(), code, pid[pcode], tests, sample, by, status, now
    )
  }

  // Invoices + payments
  const inv1 = uid()
  await run(
    db,
    'INSERT INTO invoices (id,number,patient_id,lines,subtotal,tax,discount,total,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    inv1, 'INV-2026-0451', pid['P1001'],
    JSON.stringify([
      { description: 'Consultation · Dr. John Doe', amount: 500 },
      { description: 'CBC + CRP (Lab)', amount: 650 },
      { description: 'Pharmacy (3 items)', amount: 87 },
      { description: 'Procedure · Dressing', amount: 200 },
    ]),
    1437, 258.66, 143.7, 1551.96, 'PAID', now
  )
  await run(
    db,
    'INSERT INTO payments (id,reference,invoice_id,patient_id,method,amount,status,created_at) VALUES (?,?,?,?,?,?,?,?)',
    uid(), 'TXN-9921', inv1, pid['P1001'], 'UPI', 1551.96, 'PAID', now
  )
  await run(
    db,
    'INSERT INTO payments (id,reference,patient_id,method,amount,status,created_at) VALUES (?,?,?,?,?,?,?)',
    uid(), 'TXN-9920', pid['P1002'], 'CARD', 800, 'PAID', now
  )
  await run(
    db,
    'INSERT INTO payments (id,reference,patient_id,method,amount,status,created_at) VALUES (?,?,?,?,?,?,?)',
    uid(), 'TXN-9918', pid['P1006'], 'CASH', 1100, 'PAID', now
  )
  await run(
    db,
    'INSERT INTO invoices (id,number,patient_id,lines,subtotal,tax,discount,total,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    uid(), 'INV-2026-0449', pid['P1003'], JSON.stringify([{ description: 'Consultation + Lab', amount: 2340 }]), 2340, 0, 0, 2340, 'UNPAID', now
  )
  await run(
    db,
    'INSERT INTO invoices (id,number,patient_id,lines,subtotal,tax,discount,total,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    uid(), 'INV-2026-0447', pid['P1005'], JSON.stringify([{ description: 'Consultation + ECG', amount: 1870 }]), 1870, 0, 0, 1870, 'UNPAID', now
  )

  return { seeded: true, admin: 'admin@medpro.clinic / medpro123' }
}
