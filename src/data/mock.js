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
