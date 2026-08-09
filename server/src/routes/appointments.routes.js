import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'

const router = Router()

const createSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  type: z.enum(['CONSULTATION', 'FOLLOW_UP', 'TELE']).default('CONSULTATION'),
  scheduledAt: z.coerce.date(),
  room: z.string().optional(),
  notes: z.string().optional(),
})

const statusSchema = z.object({
  status: z.enum(['BOOKED', 'WAITING', 'IN_ROOM', 'DONE', 'CANCELLED', 'NO_SHOW']),
})

// GET /api/appointments?from=&to=&doctorId=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { from, to, doctorId } = req.query
    const where = {}
    if (from || to) where.scheduledAt = { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) }
    if (doctorId) where.doctorId = doctorId.toString()

    const data = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: { patient: { select: { name: true, code: true } }, doctor: { select: { name: true } } },
    })
    res.json({ data })
  })
)

// POST /api/appointments
router.post(
  '/',
  requireRole('ADMIN', 'DOCTOR', 'FRONT_DESK'),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const appt = await prisma.appointment.create({ data: req.body })
    res.status(201).json(appt)
  })
)

// PATCH /api/appointments/:id/status
router.patch(
  '/:id/status',
  requireRole('ADMIN', 'DOCTOR', 'FRONT_DESK'),
  validate(statusSchema),
  asyncHandler(async (req, res) => {
    const appt = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    })
    res.json(appt)
  })
)

export default router
