import { Routes, Route } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Placeholder from './pages/Placeholder'

// Phase 1 ships the shell + Dashboard. Remaining modules are routed to a
// Placeholder so the whole app is navigable; each is built out in later phases.
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Placeholder title="Patients" icon="patients" phase="Phase 2" />} />
        <Route path="appointments" element={<Placeholder title="Appointments" icon="calendar" phase="Phase 2" />} />
        <Route path="queue" element={<Placeholder title="Queue" icon="queue" phase="Phase 2" />} />
        <Route path="consultation" element={<Placeholder title="Consultation / EMR" icon="stethoscope" phase="Phase 2" />} />
        <Route path="prescriptions" element={<Placeholder title="Prescriptions" icon="rx" phase="Phase 2" />} />
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
