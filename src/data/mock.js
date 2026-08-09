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
