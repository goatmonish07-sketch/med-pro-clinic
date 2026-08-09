import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'

const router = Router()

const createSchema = z.object({
  patientId: z.string().min(1),
  tests: z.string().min(1),
  sample: z.string().optional(),
  orderedBy: z.string().optional(),
})

async function nextCode() {
  const last = await prisma.labOrder.findFirst({ orderBy: { orderedAt: 'desc' }, select: { code: true } })
  const n = last?.code?.match(/\d+/)?.[0]
  return `L-${n ? Number(n) + 1 : 2201}`
}

// GET /api/lab?status=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const status = req.query.status?.toString()
    const where = status && status !== 'All' ? { status } : {}
    const data = await prisma.labOrder.findMany({
      where,
      orderBy: { orderedAt: 'desc' },
      include: { patient: { select: { name: true } } },
    })
    res.json({ data })
  })
)

// POST /api/lab
router.post(
  '/',
  requireRole('ADMIN', 'DOCTOR'),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const code = await nextCode()
    const order = await prisma.labOrder.create({ data: { ...req.body, code } })
    res.status(201).json(order)
  })
)

// PATCH /api/lab/:id  (update status / attach result)
router.patch(
  '/:id',
  requireRole('ADMIN', 'DOCTOR'),
  validate(
    z.object({
      status: z.enum(['ORDERED', 'SAMPLE_TAKEN', 'PROCESSING', 'READY', 'DELIVERED']).optional(),
      result: z.record(z.any()).optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const data = { ...req.body }
    if (req.body.status === 'READY') data.resultAt = new Date()
    const order = await prisma.labOrder.update({ where: { id: req.params.id }, data })
    res.json(order)
  })
)

export default router
