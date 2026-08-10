// Single source of truth for the sidebar navigation and routing.
// The app lives under /app; the public landing page is at /.
export const navSections = [
  {
    label: null,
    items: [
      { to: '/app', label: 'Dashboard', icon: 'dashboard', end: true },
      { to: '/app/patients', label: 'Patients', icon: 'patients' },
      { to: '/app/appointments', label: 'Appointments', icon: 'calendar' },
      { to: '/app/queue', label: 'Queue', icon: 'queue', badge: '6' },
      { to: '/app/consultation', label: 'Consultation', icon: 'stethoscope' },
      { to: '/app/prescriptions', label: 'Prescriptions', icon: 'rx' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/app/laboratory', label: 'Laboratory', icon: 'lab' },
      { to: '/app/pharmacy', label: 'Pharmacy', icon: 'pharmacy' },
      { to: '/app/billing', label: 'Billing', icon: 'billing' },
      { to: '/app/payments', label: 'Payments', icon: 'payments' },
      { to: '/app/inventory', label: 'Inventory', icon: 'inventory' },
    ],
  },
  {
    label: 'Grow',
    items: [
      { to: '/app/tele', label: 'Tele-consult', icon: 'video' },
      { to: '/app/website', label: 'Website (CMS)', icon: 'globe' },
      { to: '/app/reports', label: 'Reports', icon: 'reports' },
      { to: '/app/settings', label: 'Settings', icon: 'settings' },
    ],
  },
]
