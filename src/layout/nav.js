// Single source of truth for the sidebar navigation and routing.
export const navSections = [
  {
    label: null,
    items: [
      { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
      { to: '/patients', label: 'Patients', icon: 'patients' },
      { to: '/appointments', label: 'Appointments', icon: 'calendar' },
      { to: '/queue', label: 'Queue', icon: 'queue', badge: '6' },
      { to: '/consultation', label: 'Consultation', icon: 'stethoscope' },
      { to: '/prescriptions', label: 'Prescriptions', icon: 'rx' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/laboratory', label: 'Laboratory', icon: 'lab' },
      { to: '/pharmacy', label: 'Pharmacy', icon: 'pharmacy' },
      { to: '/billing', label: 'Billing', icon: 'billing' },
      { to: '/payments', label: 'Payments', icon: 'payments' },
      { to: '/inventory', label: 'Inventory', icon: 'inventory' },
    ],
  },
  {
    label: 'Grow',
    items: [
      { to: '/tele', label: 'Tele-consult', icon: 'video' },
      { to: '/website', label: 'Website (CMS)', icon: 'globe' },
      { to: '/reports', label: 'Reports', icon: 'reports' },
      { to: '/settings', label: 'Settings', icon: 'settings' },
    ],
  },
]
