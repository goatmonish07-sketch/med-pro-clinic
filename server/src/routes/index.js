import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import authRoutes from './auth.routes.js'
import patientsRoutes from './patients.routes.js'
import appointmentsRoutes from './appointments.routes.js'
import queueRoutes from './queue.routes.js'
import consultationsRoutes from './consultations.routes.js'
import prescriptionsRoutes from './prescriptions.routes.js'
import labRoutes from './lab.routes.js'
import pharmacyRoutes from './pharmacy.routes.js'
import invoicesRoutes from './invoices.routes.js'
import paymentsRoutes from './payments.routes.js'
import inventoryRoutes from './inventory.routes.js'
import reportsRoutes from './reports.routes.js'
import usersRoutes from './users.routes.js'

const api = Router()

// Public
api.use('/auth', authRoutes)

// Everything below requires a valid token
api.use(authenticate)
api.use('/patients', patientsRoutes)
api.use('/appointments', appointmentsRoutes)
api.use('/queue', queueRoutes)
api.use('/consultations', consultationsRoutes)
api.use('/prescriptions', prescriptionsRoutes)
api.use('/lab', labRoutes)
api.use('/pharmacy', pharmacyRoutes)
api.use('/invoices', invoicesRoutes)
api.use('/payments', paymentsRoutes)
api.use('/inventory', inventoryRoutes)
api.use('/reports', reportsRoutes)
api.use('/users', usersRoutes)

export default api
