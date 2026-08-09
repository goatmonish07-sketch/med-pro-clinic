// Thin API client for the MED-PRO backend.
//
// The UI ships working on the mock data in src/data/mock.js so it runs and
// deploys with no backend. To go live, point VITE_API_URL at the running API
// (see server/README.md) and replace a page's mock import with these calls —
// the response shapes are designed to match the mock data.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const TOKEN_KEY = 'medpro-token'

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}
export const setToken = (t) => {
  try {
    t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    err.details = data.details
    throw err
  }
  return data
}

// Endpoint helpers, grouped by module.
export const api = {
  // auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => request('/auth/me'),

  // patients
  listPatients: (params = {}) => request(`/patients?${new URLSearchParams(params)}`),
  getPatient: (id) => request(`/patients/${id}`),
  createPatient: (body) => request('/patients', { method: 'POST', body }),

  // appointments
  listAppointments: (params = {}) => request(`/appointments?${new URLSearchParams(params)}`),
  createAppointment: (body) => request('/appointments', { method: 'POST', body }),

  // queue
  getQueue: () => request('/queue'),
  callToken: (id) => request(`/queue/${id}/call`, { method: 'POST' }),

  // consultations & prescriptions
  createConsultation: (body) => request('/consultations', { method: 'POST', body }),
  createPrescription: (body) => request('/prescriptions', { method: 'POST', body }),

  // lab, pharmacy, inventory
  listLab: (params = {}) => request(`/lab?${new URLSearchParams(params)}`),
  pharmacyAlerts: () => request('/pharmacy/alerts'),
  dispense: (body) => request('/pharmacy/dispense', { method: 'POST', body }),
  listInventory: (params = {}) => request(`/inventory?${new URLSearchParams(params)}`),

  // billing & payments
  createInvoice: (body) => request('/invoices', { method: 'POST', body }),
  getInvoice: (id) => request(`/invoices/${id}`),
  listPayments: (params = {}) => request(`/payments?${new URLSearchParams(params)}`),
  recordPayment: (body) => request('/payments', { method: 'POST', body }),

  // reports
  dashboard: () => request('/reports/dashboard'),
  analytics: () => request('/reports/analytics'),

  // users
  listUsers: () => request('/users'),
  inviteUser: (body) => request('/users', { method: 'POST', body }),
}
