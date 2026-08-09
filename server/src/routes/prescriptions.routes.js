import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'
import { notFound } from '../utils/httpError.js'

const router = Router()

const createSchema = z.object({
  patientId: z.string().min(1),
  consultationId: z.string().optional(),
  doctorName: z.string().optional(),
  items: z
    .array(
      z.object({
        drug: z.string().min(1),
        dosage: z.string().optional(),
        frequency: z.string().optional(),
        duration: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1),
})

// GET /api/prescriptions/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const rx = await prisma.prescription.findUnique({
      where: { id: req.params.id },
      include: { items: true, patient: { select: { name: true, code: true, allergies: true } } },
    })
    if (!rx) throw notFound('Prescription not found')
    res.json(rx)
  })
)

// POST /api/prescriptions  (creates prescription + items in one transaction)
router.post(
  '/',
  requireRole('ADMIN', 'DOCTOR'),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const { items, ...rx } = req.body
    const created = await prisma.prescription.create({
      data: { ...rx, items: { create: items } },
      include: { items: true },
    })
    res.status(201).json(created)
  })
)

export default router
