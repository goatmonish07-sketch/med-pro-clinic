import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'
import { notFound } from '../utils/httpError.js'

const router = Router()

const upsertSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1),
  age: z.number().int().min(0).max(140).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  bloodGroup: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  doctorId: z.string().optional(),
})

// Generate the next P-code (P1001, P1002, …).
async function nextCode() {
  const last = await prisma.patient.findFirst({ orderBy: { createdAt: 'desc' }, select: { code: true } })
  const n = last?.code?.match(/\d+/)?.[0]
  const next = n ? Number(n) + 1 : 1001
  return `P${next}`
}

// GET /api/patients?search=&filter=&page=&pageSize=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const search = (req.query.search || '').toString().trim()
    const filter = (req.query.filter || 'All').toString()
    const page = Math.max(1, Number(req.query.page) || 1)
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20))

    const where = { AND: [] }
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      })
    }
    if (filter === 'New') where.AND.push({ tags: { has: 'New' } })
    if (filter === 'Due') where.AND.push({ invoices: { some: { status: { in: ['UNPAID', 'PARTIAL'] } } } })

    const [total, data] = await Promise.all([
      prisma.patient.count({ where }),
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { doctor: { select: { name: true } } },
      }),
    ])

    res.json({ data, page, pageSize, total, totalPages: Math.ceil(total / pageSize) })
  })
)

// GET /api/patients/:id  (full profile with related records)
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        doctor: { select: { name: true } },
        appointments: { orderBy: { scheduledAt: 'desc' }, take: 10 },
        consultations: { orderBy: { createdAt: 'desc' }, take: 10 },
        invoices: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    })
    if (!patient) throw notFound('Patient not found')
    res.json(patient)
  })
)

// POST /api/patients
router.post(
  '/',
  requireRole('ADMIN', 'DOCTOR', 'FRONT_DESK'),
  validate(upsertSchema),
  asyncHandler(async (req, res) => {
    const code = req.body.code || (await nextCode())
    const patient = await prisma.patient.create({ data: { ...req.body, code } })
    res.status(201).json(patient)
  })
)

// PATCH /api/patients/:id
router.patch(
  '/:id',
  requireRole('ADMIN', 'DOCTOR', 'FRONT_DESK'),
  validate(upsertSchema.partial()),
  asyncHandler(async (req, res) => {
    const patient = await prisma.patient.update({ where: { id: req.params.id }, data: req.body })
    res.json(patient)
  })
)

// DELETE /api/patients/:id
router.delete(
  '/:id',
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    await prisma.patient.delete({ where: { id: req.params.id } })
    res.status(204).end()
  })
)

export default router
