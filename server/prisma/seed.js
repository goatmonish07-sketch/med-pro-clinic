import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@medpro.clinic'
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'medpro123'

async function main() {
  console.log('Seeding MED-PRO Clinic OS…')
  const hash = (pw) => bcrypt.hashSync(pw, 10)

  // ---- Users ----
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: 'Dr. John Doe', email: adminEmail, passwordHash: hash(adminPassword), role: 'ADMIN', status: 'ACTIVE' },
  })
  const smith = await prisma.user.upsert({
    where: { email: 'smith@medpro.clinic' },
    update: {},
    create: { name: 'Dr. Smith', email: 'smith@medpro.clinic', passwordHash: hash('medpro123'), role: 'DOCTOR', status: 'ACTIVE' },
  })
  await prisma.user.upsert({
    where: { email: 'reena@medpro.clinic' },
    update: {},
    create: { name: 'Reena (Reception)', email: 'reena@medpro.clinic', passwordHash: hash('medpro123'), role: 'FRONT_DESK', status: 'ACTIVE' },
  })
  await prisma.user.upsert({
    where: { email: 'pharma@medpro.clinic' },
    update: {},
    create: { name: 'Pharma Desk', email: 'pharma@medpro.clinic', passwordHash: hash('medpro123'), role: 'PHARMACIST', status: 'INVITED' },
  })

  // ---- Patients ----
  const patientSeed = [
    { code: 'P1001', name: 'Roni Kumar', age: 34, gender: 'MALE', phone: '+91 90154 6201', bloodGroup: 'B+', allergies: ['Penicillin'], tags: ['Diabetic'], doctorId: admin.id },
    { code: 'P1002', name: 'Anitha Sharma', age: 29, gender: 'FEMALE', phone: '+91 98456 3390', tags: ['New'], doctorId: admin.id },
    { code: 'P1003', name: 'Suresh Reddy', age: 41, gender: 'MALE', phone: '+91 99870 1223', tags: ['Hypertension'], doctorId: smith.id },
    { code: 'P1004', name: 'Priya Patel', age: 26, gender: 'FEMALE', phone: '+91 88790 5567', tags: ['Tele'], doctorId: admin.id },
    { code: 'P1005', name: 'Vikram Singh', age: 52, gender: 'MALE', phone: '+91 90087 4410', tags: ['Cardiac'], doctorId: smith.id },
    { code: 'P1006', name: 'Meena Nair', age: 38, gender: 'FEMALE', phone: '+91 91234 8890', tags: ['Thyroid'], doctorId: admin.id },
    { code: 'P1007', name: 'Arjun Das', age: 45, gender: 'MALE', phone: '+91 98111 2200', tags: ['General'], doctorId: smith.id },
  ]
  const patients = {}
  for (const p of patientSeed) {
    patients[p.code] = await prisma.patient.upsert({ where: { code: p.code }, update: {}, create: p })
  }

  // ---- Inventory ----
  const inv = [
    { name: 'Paracetamol 500mg', category: 'Analgesic', batch: 'PA2291', stock: 40, reorderLevel: 100, expiry: new Date('2027-03-01'), supplier: 'MedSupply Co.', unitRate: 2 },
    { name: 'ORS sachet', category: 'Rehydration', batch: 'OR1120', stock: 0, reorderLevel: 50, expiry: new Date('2027-06-01'), supplier: 'MedSupply Co.', unitRate: 12 },
    { name: 'Amoxicillin 250mg', category: 'Antibiotic', batch: 'AM4410', stock: 28, reorderLevel: 80, expiry: new Date('2027-01-01'), supplier: 'PharmaWorld', unitRate: 5 },
    { name: 'Cetirizine 10mg', category: 'Antihistamine', batch: 'CT8830', stock: 220, reorderLevel: 100, expiry: new Date('2026-09-20'), supplier: 'PharmaWorld', unitRate: 3 },
    { name: 'Insulin (vial)', category: 'Hormone', batch: 'IN2201', stock: 64, reorderLevel: 30, expiry: new Date('2026-12-01'), supplier: 'ColdChain Ltd', unitRate: 180 },
  ]
  for (const i of inv) {
    await prisma.inventoryItem.upsert({ where: { batch: i.batch }, update: {}, create: i })
  }

  // ---- Appointments (today) ----
  const at = (h, m) => {
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
  }
  const apptSeed = [
    { patient: 'P1001', doctorId: admin.id, type: 'FOLLOW_UP', status: 'DONE', scheduledAt: at(9, 0), room: 'Room 02' },
    { patient: 'P1002', doctorId: admin.id, type: 'CONSULTATION', status: 'IN_ROOM', scheduledAt: at(9, 30), room: 'Room 02' },
    { patient: 'P1003', doctorId: smith.id, type: 'FOLLOW_UP', status: 'WAITING', scheduledAt: at(10, 0), room: 'Room 04' },
    { patient: 'P1004', doctorId: admin.id, type: 'TELE', status: 'BOOKED', scheduledAt: at(10, 30) },
    { patient: 'P1005', doctorId: smith.id, type: 'CONSULTATION', status: 'WAITING', scheduledAt: at(11, 0), room: 'Room 04' },
  ]
  // Only seed appointments once (idempotent-ish: skip if any exist today)
  const existingToday = await prisma.appointment.count({ where: { scheduledAt: { gte: at(0, 0) } } })
  if (existingToday === 0) {
    for (const a of apptSeed) {
      await prisma.appointment.create({ data: { ...a, patientId: patients[a.patient].id, patient: undefined } })
    }
  }

  // ---- Queue tokens ----
  if ((await prisma.queueToken.count()) === 0) {
    await prisma.queueToken.create({ data: { number: 24, patientId: patients.P1001.id, doctorName: 'Dr. John Doe', type: 'Consultation', room: 'Room 02', status: 'SERVING', calledAt: new Date() } })
    const waiting = [
      ['P1002', 25, 'Consultation', 'Dr. John Doe'],
      ['P1003', 26, 'Follow-up', 'Dr. Smith'],
      ['P1004', 27, 'Consultation', 'Dr. John Doe'],
      ['P1005', 28, 'Consultation', 'Dr. Smith'],
    ]
    for (const [code, number, type, doc] of waiting) {
      await prisma.queueToken.create({ data: { number, patientId: patients[code].id, doctorName: doc, type, status: 'WAITING' } })
    }
  }

  // ---- Lab orders ----
  if ((await prisma.labOrder.count()) === 0) {
    const labs = [
      ['L-2201', 'P1001', 'CBC, CRP', 'Blood', 'Dr. John Doe', 'READY'],
      ['L-2202', 'P1003', 'Lipid profile, HbA1c', 'Blood', 'Dr. Smith', 'PROCESSING'],
      ['L-2203', 'P1006', 'TSH, T3, T4', 'Blood', 'Dr. John Doe', 'READY'],
      ['L-2204', 'P1005', 'ECG, Troponin', '—', 'Dr. Smith', 'SAMPLE_TAKEN'],
      ['L-2205', 'P1002', 'Urine routine', 'Urine', 'Dr. John Doe', 'ORDERED'],
    ]
    for (const [code, code2, tests, sample, by, status] of labs) {
      await prisma.labOrder.create({ data: { code, patientId: patients[code2].id, tests, sample, orderedBy: by, status } })
    }
  }

  // ---- Invoices + payments ----
  if ((await prisma.invoice.count()) === 0) {
    const inv1 = await prisma.invoice.create({
      data: {
        number: 'INV-2026-0451', patientId: patients.P1001.id,
        lines: [
          { description: 'Consultation · Dr. John Doe', amount: 500 },
          { description: 'CBC + CRP (Lab)', amount: 650 },
          { description: 'Pharmacy (3 items)', amount: 87 },
          { description: 'Procedure · Dressing', amount: 200 },
        ],
        subtotal: 1437, tax: 258.66, discount: 143.7, total: 1551.96, status: 'PAID',
      },
    })
    await prisma.payment.create({ data: { reference: 'TXN-9921', invoiceId: inv1.id, patientId: patients.P1001.id, method: 'UPI', amount: 1551.96, status: 'PAID' } })
    await prisma.payment.create({ data: { reference: 'TXN-9920', patientId: patients.P1002.id, method: 'CARD', amount: 800, status: 'PAID' } })
    await prisma.payment.create({ data: { reference: 'TXN-9918', patientId: patients.P1006.id, method: 'CASH', amount: 1100, status: 'PAID' } })
    // Two pending (unpaid) invoices to drive the "pending" KPIs
    await prisma.invoice.create({ data: { number: 'INV-2026-0449', patientId: patients.P1003.id, lines: [{ description: 'Consultation + Lab', amount: 2340 }], subtotal: 2340, tax: 0, discount: 0, total: 2340, status: 'UNPAID' } })
    await prisma.invoice.create({ data: { number: 'INV-2026-0447', patientId: patients.P1005.id, lines: [{ description: 'Consultation + ECG', amount: 1870 }], subtotal: 1870, tax: 0, discount: 0, total: 1870, status: 'UNPAID' } })
  }

  console.log('Seed complete.')
  console.log(`  Admin login → ${adminEmail} / ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
