import { Routes, Route } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Appointments from './pages/Appointments'
import Queue from './pages/Queue'
import Consultation from './pages/Consultation'
import Prescriptions from './pages/Prescriptions'
import Laboratory from './pages/Laboratory'
import Pharmacy from './pages/Pharmacy'
import Billing from './pages/Billing'
import Payments from './pages/Payments'
import Inventory from './pages/Inventory'
import Tele from './pages/Tele'
import Website from './pages/Website'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Placeholder from './pages/Placeholder'

// All 16 clinic modules are now live routed pages in the Aurora × Cortex
// design system. Unknown paths fall back to a friendly Placeholder.
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="queue" element={<Queue />} />
        <Route path="consultation" element={<Consultation />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="laboratory" element={<Laboratory />} />
        <Route path="pharmacy" element={<Pharmacy />} />
        <Route path="billing" element={<Billing />} />
        <Route path="payments" element={<Payments />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="tele" element={<Tele />} />
        <Route path="website" element={<Website />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Placeholder title="Not found" icon="dashboard" />} />
      </Route>
    </Routes>
  )
}
