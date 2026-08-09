import { Routes, Route } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Appointments from './pages/Appointments'
import Queue from './pages/Queue'
import Consultation from './pages/Consultation'
import Prescriptions from './pages/Prescriptions'
import Placeholder from './pages/Placeholder'

// Phases 1–2 ship the shell, Dashboard, and the operational core (Patients,
// Appointments, Queue, Consultation/EMR, Prescriptions). Remaining modules are
// routed to a Placeholder so the whole app stays navigable.
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
        <Route path="laboratory" element={<Placeholder title="Laboratory" icon="lab" phase="Phase 3" />} />
        <Route path="pharmacy" element={<Placeholder title="Pharmacy" icon="pharmacy" phase="Phase 3" />} />
        <Route path="billing" element={<Placeholder title="Billing" icon="billing" phase="Phase 3" />} />
        <Route path="payments" element={<Placeholder title="Payments" icon="payments" phase="Phase 3" />} />
        <Route path="inventory" element={<Placeholder title="Inventory" icon="inventory" phase="Phase 3" />} />
        <Route path="tele" element={<Placeholder title="Tele-consult" icon="video" phase="Phase 5" />} />
        <Route path="website" element={<Placeholder title="Website (CMS)" icon="globe" phase="Phase 4" />} />
        <Route path="reports" element={<Placeholder title="Reports" icon="reports" phase="Phase 3" />} />
        <Route path="settings" element={<Placeholder title="Settings" icon="settings" phase="Phase 1" />} />
        <Route path="*" element={<Placeholder title="Not found" icon="dashboard" />} />
      </Route>
    </Routes>
  )
}
