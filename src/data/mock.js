// Placeholder clinic data for the prototype. Swap for API calls in Phase 2+.
// Names, tokens and figures mirror the approved MED-PRO mockups.

export const clinic = {
  name: 'MED-PRO Clinic',
  branch: 'Main Branch',
  user: { name: 'Dr. John Doe', role: 'Admin', initials: 'JD' },
  today: 'Saturday, 9 Aug 2026',
}

export const kpis = [
  { key: 'appointments', label: 'Appointments', value: '32', delta: '▲ 12% vs yest.', dir: 'up', accent: 'brand', icon: 'calendar' },
  { key: 'waiting', label: 'Waiting', value: '6', delta: '▲ avg 24m', dir: 'up', accent: 'warn', icon: 'clock' },
  { key: 'consults', label: 'Consults', value: '24', delta: '▲ 8%', dir: 'up', accent: 'cyan', icon: 'stethoscope' },
  { key: 'revenue', label: 'Revenue', value: '₹45.2k', delta: '▲ 15%', dir: 'up', accent: 'good', icon: 'rupee' },
  { key: 'pending', label: 'Pending pay', value: '₹8.4k', delta: '▼ 4 invoices', dir: 'dn', accent: 'violet', icon: 'payments' },
]

export const schedule = [
  { time: '09:00', name: 'Roni Kumar', detail: 'Follow-up · Dr. John Doe · Room 02', initials: 'RK', avatar: 'from-[#4361ee] to-[#7c5cf0]', status: 'done', statusLabel: 'Done' },
  { time: '09:30', name: 'Anitha Sharma', detail: 'Consultation · Dr. John Doe · Room 02', initials: 'AS', avatar: 'from-[#0ea5a0] to-[#12b3a3]', status: 'prog', statusLabel: 'In room' },
  { time: '10:00', name: 'Suresh Reddy', detail: 'Follow-up · Dr. Smith · Room 04', initials: 'SR', avatar: 'from-[#d98a00] to-[#f5a623]', status: 'wait', statusLabel: 'Waiting' },
  { time: '10:30', name: 'Priya Patel', detail: 'New patient · Dr. John Doe', initials: 'PP', avatar: 'from-[#7c5cf0] to-[#a48cff]', status: 'video', statusLabel: 'Video', tele: true },
  { time: '11:00', name: 'Vikram Singh', detail: 'Consultation · Dr. Smith · Room 04', initials: 'VS', avatar: 'from-[#e0396b] to-[#f5678f]', status: 'wait', statusLabel: 'Waiting' },
]

export const queue = {
  serving: { token: '#024', name: 'Roni Kumar', detail: 'Consultation · Room 02' },
  next: [
    { token: '#025', name: 'Anitha Sharma', wait: '~5m' },
    { token: '#026', name: 'Suresh Reddy', wait: '~12m' },
    { token: '#027', name: 'Priya Patel', wait: '~18m' },
  ],
}

export const copilotInsights = [
  { tone: 'crit', icon: 'alert', text: 'Interaction alert: Amoxicillin + Warfarin flagged for Vikram Singh.', cta: 'Review →' },
  { tone: 'warn', icon: 'box', text: '3 SKUs below reorder level.', cta: 'Auto-PO →' },
  { tone: 'good', icon: 'check', text: "Anitha's visit summary drafted from voice notes." },
]

// Weekly series for the revenue + footfall chart (SVG path is derived in the component).
export const weeklyRevenue = [1.9, 2.1, 2.0, 2.6, 2.4, 3.0, 3.1] // ₹ lakhs
export const weeklyFootfall = [24, 30, 27, 38, 34, 44, 47] // patients
export const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/* ============================ Phase 2 data ============================ */

// Reusable gradient avatar swatches (Tailwind arbitrary values).
export const avatarGradients = {
  RK: 'from-[#4361ee] to-[#7c5cf0]',
  AS: 'from-[#0ea5a0] to-[#12b3a3]',
  SR: 'from-[#d98a00] to-[#f5a623]',
  PP: 'from-[#7c5cf0] to-[#a48cff]',
  VS: 'from-[#e0396b] to-[#f5678f]',
  MN: 'from-[#0d9aa0] to-[#3a56e0]',
  AD: 'from-[#5a72f0] to-[#7c5cf0]',
}

export const patients = [
  { id: 'P1001', name: 'Roni Kumar', initials: 'RK', age: 34, gender: 'Male', phone: '+91 90154 6201', doctor: 'Dr. John Doe', lastVisit: '06 Aug 2026', due: 0, tag: 'Diabetic' },
  { id: 'P1002', name: 'Anitha Sharma', initials: 'AS', age: 29, gender: 'Female', phone: '+91 98456 3390', doctor: 'Dr. John Doe', lastVisit: '09 Aug 2026', due: 0, tag: 'New' },
  { id: 'P1003', name: 'Suresh Reddy', initials: 'SR', age: 41, gender: 'Male', phone: '+91 99870 1223', doctor: 'Dr. Smith', lastVisit: '02 Aug 2026', due: 2340, tag: 'Hypertension' },
  { id: 'P1004', name: 'Priya Patel', initials: 'PP', age: 26, gender: 'Female', phone: '+91 88790 5567', doctor: 'Dr. John Doe', lastVisit: '—', due: 0, tag: 'Tele' },
  { id: 'P1005', name: 'Vikram Singh', initials: 'VS', age: 52, gender: 'Male', phone: '+91 90087 4410', doctor: 'Dr. Smith', lastVisit: '28 Jul 2026', due: 1870, tag: 'Cardiac' },
  { id: 'P1006', name: 'Meena Nair', initials: 'MN', age: 38, gender: 'Female', phone: '+91 91234 8890', doctor: 'Dr. John Doe', lastVisit: '05 Aug 2026', due: 0, tag: 'Thyroid' },
  { id: 'P1007', name: 'Arjun Das', initials: 'AD', age: 45, gender: 'Male', phone: '+91 98111 2200', doctor: 'Dr. Smith', lastVisit: '01 Aug 2026', due: 0, tag: 'General' },
]

export const patientFilters = ['All', 'New', 'Follow-up', 'Due']

export const patientStats = [
  { key: 'total', label: 'Total', value: '2,481', delta: '▲ 320 this mo.', dir: 'up', accent: 'brand' },
  { key: 'active', label: 'Active today', value: '18', delta: '▲ 4', dir: 'up', accent: 'cyan' },
  { key: 'repeat', label: 'Repeat rate', value: '68%', delta: '▲ 3%', dir: 'up', accent: 'good' },
  { key: 'due', label: 'Outstanding', value: '₹1.2L', delta: '▼ 6 patients', dir: 'dn', accent: 'warn' },
]

// Calendar: rows are time slots, columns are the 7 weekdays (Mon..Sun).
export const calendarDays = ['Mon 4', 'Tue 5', 'Wed 6', 'Thu 7', 'Fri 8', 'Sat 9', 'Sun 10']
export const calendarSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
// [slotIndex][dayIndex] -> event or null. color: b=Doe, c=Smith, v=Tele, g/o accents.
export const calendarEvents = [
  [{ t: 'Sunil Sharma', c: 'b' }, { t: 'Kiran Rao', c: 'c' }, { t: 'Ravi Menon', c: 'b' }, null, { t: 'Deepa Iyer', c: 'c' }, { t: 'Roni Kumar', c: 'b' }, null],
  [null, { t: 'Priya Nair', c: 'b' }, null, { t: 'Amit Shah', c: 'c' }, null, { t: 'Anitha Sharma', c: 'g' }, null],
  [{ t: 'Sunita Roy', c: 'c' }, null, { t: 'Gopal Das', c: 'b' }, { t: 'Latha K', c: 'b' }, { t: 'Vijay P', c: 'c' }, { t: 'Suresh Reddy', c: 'o' }, null],
  [null, { t: 'Neha G (Tele)', c: 'v' }, null, null, { t: 'Rahul V', c: 'b' }, { t: 'Priya Patel (Tele)', c: 'v' }, null],
  [{ t: 'Manoj T', c: 'b' }, { t: 'Asha B', c: 'c' }, { t: 'Farah S', c: 'c' }, { t: 'Ivan M', c: 'c' }, null, { t: 'Vikram Singh', c: 'c' }, null],
  [null, null, { t: 'Sara J', c: 'b' }, null, { t: 'Ramesh L', c: 'c' }, null, null],
]

export const queueStats = [
  { label: 'Avg wait', value: '24m' },
  { label: 'In queue', value: '6' },
  { label: 'Served today', value: '18' },
  { label: 'No-shows', value: '2' },
]

export const queueList = [
  { token: '#025', name: 'Anitha Sharma', type: 'Consultation', doctor: 'Dr. John Doe', waited: '5m', status: 'called', label: 'Called' },
  { token: '#026', name: 'Suresh Reddy', type: 'Follow-up', doctor: 'Dr. Smith', waited: '12m', status: 'wait', label: 'Waiting' },
  { token: '#027', name: 'Priya Patel', type: 'Consultation', doctor: 'Dr. John Doe', waited: '18m', status: 'wait', label: 'Waiting' },
  { token: '#028', name: 'Vikram Singh', type: 'Consultation', doctor: 'Dr. Smith', waited: '25m', status: 'wait', label: 'Waiting' },
  { token: '#029', name: 'Meena Nair', type: 'Follow-up', doctor: 'Dr. John Doe', waited: '30m', status: 'over', label: 'Overdue' },
  { token: '#030', name: 'Arjun Das', type: 'Consultation', doctor: 'Dr. Smith', waited: '2m', status: 'done', label: 'Arrived' },
]

// Consultation / EMR — the visit currently open in the workspace.
export const emr = {
  patient: { name: 'Roni Kumar', id: 'P1001', age: 34, gender: 'Male', initials: 'RK', bloodGroup: 'B+', allergy: 'Penicillin allergy' },
  recentVisits: [
    { date: '06 Aug 2026', note: 'Fever, headache' },
    { date: '18 Jul 2026', note: 'Routine check-up' },
  ],
  tabs: ['Complaint', 'History', 'Vitals', 'Examination', 'Diagnosis', 'Prescription', 'Lab orders'],
  vitals: [
    { label: 'Temp', value: '98.6', unit: '°F' },
    { label: 'BP mmHg', value: '120/80' },
    { label: 'Pulse', value: '78' },
    { label: 'SpO₂', value: '98%' },
    { label: 'Resp/min', value: '16' },
    { label: 'Weight', value: '72', unit: 'kg' },
  ],
  complaint: 'Fever and headache since 2 days, mild body ache.',
  hpi: 'Patient reports intermittent fever (up to 100.4°F), frontal headache, and generalized body ache for 2 days. No cough, no cold. Appetite reduced.',
  diagnosis: 'Viral fever (ICD-10: B34.9)',
  advice: 'Rest, fluids, review in 3 days',
  copilot: 'Suggested Dx Viral fever from symptoms. ⚠ Avoid Amoxicillin — penicillin allergy on file.',
}

export const prescription = {
  patient: 'Roni Kumar', id: 'P1001', doctor: 'Dr. John Doe', date: '09 Aug 2026',
  meds: [
    { drug: 'Paracetamol 500mg', dosage: '1 tab', freq: '1-1-1 (TDS)', duration: '3 days', notes: 'After food' },
    { drug: 'Cetirizine 10mg', dosage: '1 tab', freq: '0-0-1 (HS)', duration: '3 days', notes: 'At night' },
    { drug: 'ORS sachet', dosage: '1 sachet', freq: 'SOS', duration: 'As needed', notes: 'In 1L water' },
  ],
  templates: [
    { name: 'Viral fever pack', detail: 'Paracetamol · Cetirizine · ORS' },
    { name: 'URI / cold', detail: 'Levocetirizine · Steam · Rest' },
    { name: 'Diabetic follow-up', detail: 'Metformin · Diet advice' },
    { name: 'Hypertension', detail: 'Amlodipine · Low-salt diet' },
  ],
}

/* ============================ Phase 3 data ============================ */

export const labStats = [
  { key: 'orders', label: 'Orders today', value: '14', accent: 'brand' },
  { key: 'ready', label: 'Results ready', value: '11', accent: 'good' },
  { key: 'pending', label: 'Pending', value: '3', accent: 'warn' },
  { key: 'rev', label: 'Revenue', value: '₹12.4k', accent: 'cyan' },
]
export const labOrders = [
  { id: 'L-2201', patient: 'Roni Kumar', test: 'CBC, CRP', sample: 'Blood', by: 'Dr. John Doe', status: 'good', label: 'Ready' },
  { id: 'L-2202', patient: 'Suresh Reddy', test: 'Lipid profile, HbA1c', sample: 'Blood', by: 'Dr. Smith', status: 'warn', label: 'Processing' },
  { id: 'L-2203', patient: 'Meena Nair', test: 'TSH, T3, T4', sample: 'Blood', by: 'Dr. John Doe', status: 'good', label: 'Ready' },
  { id: 'L-2204', patient: 'Vikram Singh', test: 'ECG, Troponin', sample: '—', by: 'Dr. Smith', status: 'cyan', label: 'Sample taken' },
  { id: 'L-2205', patient: 'Anitha Sharma', test: 'Urine routine', sample: 'Urine', by: 'Dr. John Doe', status: 'crit', label: 'Awaiting sample' },
]

export const pharmacyDispense = {
  patient: 'Roni Kumar', rx: 'Rx #R-5521',
  items: [
    { item: 'Paracetamol 500mg', batch: 'PA2291', qty: 9, rate: 2, amount: 18, stock: 'Low · 40', stockTone: 'warn' },
    { item: 'Cetirizine 10mg', batch: 'CT8830', qty: 3, rate: 3, amount: 9, stock: '220', stockTone: 'good' },
    { item: 'ORS sachet', batch: 'OR1120', qty: 5, rate: 12, amount: 60, stock: 'Out · 0', stockTone: 'crit' },
  ],
  total: 87,
  alerts: [
    { tone: 'crit', icon: 'alert', text: 'ORS sachet is out of stock. Auto-PO drafted to MedSupply Co.' },
    { tone: 'warn', icon: 'box', text: 'Paracetamol, Amoxicillin below reorder level.' },
    { tone: 'brand', icon: 'clock', text: 'Batch CT8830 (Cetirizine) expires in 45 days.' },
  ],
}

export const invoice = {
  no: 'INV-2026-0451', date: '09 Aug 2026', patient: 'Roni Kumar',
  gstin: '29ABCDE1234F1Z5', address: '123 Health St · Bengaluru',
  lines: [
    { d: 'Consultation · Dr. John Doe', a: 500 },
    { d: 'CBC + CRP (Lab)', a: 650 },
    { d: 'Pharmacy (3 items)', a: 87 },
    { d: 'Procedure · Dressing', a: 200 },
  ],
  subtotal: 1437,
  taxAdj: 114.96,
  total: 1551.96,
}

export const paymentStats = [
  { key: 'coll', label: 'Collected today', value: '₹45.2k', delta: '▲ 15%', dir: 'up', accent: 'good' },
  { key: 'upi', label: 'UPI', value: '₹28.1k', delta: '62%', accent: 'brand' },
  { key: 'card', label: 'Card', value: '₹11.9k', delta: '26%', accent: 'cyan' },
  { key: 'pend', label: 'Pending', value: '₹8.4k', delta: '▼ 4 invoices', dir: 'dn', accent: 'warn' },
]
export const payments = [
  { txn: 'TXN-9921', patient: 'Roni Kumar', inv: 'INV-0451', method: 'UPI', amount: 1552, status: 'good', label: 'Paid', time: '10:24' },
  { txn: 'TXN-9920', patient: 'Anitha Sharma', inv: 'INV-0450', method: 'Card', amount: 800, status: 'good', label: 'Paid', time: '10:02' },
  { txn: 'TXN-9919', patient: 'Suresh Reddy', inv: 'INV-0449', method: '—', amount: 2340, status: 'warn', label: 'Pending', time: '—' },
  { txn: 'TXN-9918', patient: 'Meena Nair', inv: 'INV-0448', method: 'Cash', amount: 1100, status: 'good', label: 'Paid', time: '09:41' },
  { txn: 'TXN-9917', patient: 'Vikram Singh', inv: 'INV-0447', method: '—', amount: 1870, status: 'warn', label: 'Pending', time: '—' },
]

export const inventoryStats = [
  { key: 'sku', label: 'Total SKUs', value: '642', accent: 'brand' },
  { key: 'low', label: 'Low stock', value: '3', accent: 'warn' },
  { key: 'exp', label: 'Expiring <60d', value: '5', accent: 'violet' },
  { key: 'val', label: 'Stock value', value: '₹4.8L', accent: 'good' },
]
export const inventory = [
  { item: 'Paracetamol 500mg', cat: 'Analgesic', batch: 'PA2291', stock: 40, reorder: 100, expiry: 'Mar 2027', supplier: 'MedSupply Co.', status: 'warn', label: 'Low' },
  { item: 'ORS sachet', cat: 'Rehydration', batch: 'OR1120', stock: 0, reorder: 50, expiry: 'Jun 2027', supplier: 'MedSupply Co.', status: 'crit', label: 'Out' },
  { item: 'Amoxicillin 250mg', cat: 'Antibiotic', batch: 'AM4410', stock: 28, reorder: 80, expiry: 'Jan 2027', supplier: 'PharmaWorld', status: 'warn', label: 'Low' },
  { item: 'Cetirizine 10mg', cat: 'Antihistamine', batch: 'CT8830', stock: 220, reorder: 100, expiry: 'Sep 2026', supplier: 'PharmaWorld', status: 'violet', label: 'Expiring' },
  { item: 'Insulin (vial)', cat: 'Hormone', batch: 'IN2201', stock: 64, reorder: 30, expiry: 'Dec 2026', supplier: 'ColdChain Ltd', status: 'good', label: 'OK' },
]

export const reportStats = [
  { key: 'rev', label: 'Total revenue', value: '₹1.87L', delta: '▲ 10%', dir: 'up', accent: 'good' },
  { key: 'new', label: 'New patients', value: '320', delta: '▲ 15%', dir: 'up', accent: 'brand' },
  { key: 'con', label: 'Consultations', value: '845', delta: '▲ 8%', dir: 'up', accent: 'cyan' },
]
export const monthlyRevenue = [1.2, 1.35, 1.3, 1.55, 1.7, 1.87] // ₹ lakhs
export const reportMonths = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
export const departmentSplit = [
  { name: 'Consultation', pct: 60, color: 'var(--brand)' },
  { name: 'Pharmacy', pct: 25, color: 'var(--cyan)' },
  { name: 'Laboratory', pct: 15, color: 'var(--violet)' },
]
export const topDoctors = [
  { name: 'Dr. John Doe', value: 85640, pct: 88 },
  { name: 'Dr. Smith', value: 62450, pct: 64 },
  { name: 'Dr. Jane Patel', value: 42330, pct: 43 },
]

/* ============================ Phase 4 data ============================ */

export const teleVisit = {
  patient: 'Priya Patel', id: 'P1004', kind: 'New patient', time: '10:30 AM', initials: 'PP',
  elapsed: '00:14:22',
  complaint: 'Recurring migraine, seeking teleconsult for medication review.',
  advice: 'Hydration, sleep hygiene, follow-up in 1 week',
  fee: 500,
}

export const siteServices = [
  { icon: 'patients', title: 'General medicine', desc: 'Consultations & check-ups' },
  { icon: 'lab', title: 'Diagnostics', desc: 'In-house lab & reports' },
  { icon: 'video', title: 'Tele-medicine', desc: 'Consult from home' },
]

export const automationSettings = [
  { title: 'WhatsApp appointment reminders', desc: 'Sent 24h & 2h before each visit', on: true },
  { title: 'SMS confirmations', desc: 'On booking & on reschedule', on: true },
  { title: 'No-show follow-up', desc: 'Auto-nudge patients who missed a visit', on: true },
  { title: 'Payment reminders', desc: 'Daily at 6 PM for pending invoices', on: false },
  { title: 'Recall campaigns', desc: 'Re-engage patients due for follow-up', on: true },
]
export const settingsNav = ['Clinic profile', 'Users & roles', 'Services & pricing', 'Taxes (GST)', 'Reminders & automation', 'Integrations', 'Branches', 'Audit log']
export const users = [
  { name: 'Dr. John Doe', initials: 'JD', role: 'Admin · Doctor', branch: 'Main', status: 'good', label: 'Active', grad: 'from-[#3a56e0] to-[#7c5cf0]' },
  { name: 'Dr. Smith', initials: 'DS', role: 'Doctor', branch: 'Main', status: 'good', label: 'Active', grad: 'from-[#0d9aa0] to-[#3a56e0]' },
  { name: 'Reena (Reception)', initials: 'RN', role: 'Front desk', branch: 'Main', status: 'good', label: 'Active', grad: 'from-[#d98a00] to-[#e0396b]' },
  { name: 'Pharma Desk', initials: 'PH', role: 'Pharmacist', branch: 'Main', status: 'warn', label: 'Invited', grad: 'from-[#7c5cf0] to-[#5a72f0]' },
]
