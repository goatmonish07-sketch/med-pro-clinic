import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'
import { notFound } from '../utils/httpError.js'

const router = Router()

const upsertSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  complaint: z.string().optional(),
  hpi: z.string().optional(),
  diagnosis: z.string().optional(),
  advice: z.string().optional(),
  vitals: z.record(z.any()).optional(),
})

// GET /api/consultations/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const c = await prisma.consultation.findUnique({
      where: { id: req.params.id },
      include: {
        patient: true,
        doctor: { select: { name: true } },
        prescription: { include: { items: true } },
      },
    })
    if (!c) throw notFound('Consultation not found')
    res.json(c)
  })
)

// POST /api/consultations  (doctor records a visit)
router.post(
  '/',
  requireRole('ADMIN', 'DOCTOR'),
  validate(upsertSchema),
  asyncHandler(async (req, res) => {
    const c = await prisma.consultation.create({ data: { ...req.body, doctorId: req.user.id } })
    res.status(201).json(c)
  })
)

// PATCH /api/consultations/:id
router.patch(
  '/:id',
  requireRole('ADMIN', 'DOCTOR'),
  validate(upsertSchema.partial()),
  asyncHandler(async (req, res) => {
    const c = await prisma.consultation.update({ where: { id: req.params.id }, data: req.body })
    res.json(c)
  })
)

// POST /api/consultations/:id/sign  (lock the note)
router.post(
  '/:id/sign',
  requireRole('ADMIN', 'DOCTOR'),
  asyncHandler(async (req, res) => {
    const c = await prisma.consultation.update({ where: { id: req.params.id }, data: { signedAt: new Date() } })
    res.json(c)
  })
)

export default router
