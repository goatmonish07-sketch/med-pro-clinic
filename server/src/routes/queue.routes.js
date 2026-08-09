import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'
import { notFound } from '../utils/httpError.js'

const router = Router()

const enqueueSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  doctorName: z.string().optional(),
  type: z.string().optional(),
  room: z.string().optional(),
})

// GET /api/queue  → currently serving + waiting list + stats
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [serving, waiting] = await Promise.all([
      prisma.queueToken.findFirst({
        where: { status: 'SERVING' },
        include: { patient: { select: { name: true } } },
        orderBy: { calledAt: 'desc' },
      }),
      prisma.queueToken.findMany({
        where: { status: { in: ['WAITING', 'CALLED', 'OVERDUE'] } },
        include: { patient: { select: { name: true } } },
        orderBy: { enqueuedAt: 'asc' },
      }),
    ])
    const servedToday = await prisma.queueToken.count({ where: { status: 'DONE' } })
    res.json({
      serving,
      waiting,
      stats: { inQueue: waiting.length, servedToday },
    })
  })
)

// POST /api/queue  → issue the next token number
router.post(
  '/',
  requireRole('ADMIN', 'DOCTOR', 'FRONT_DESK'),
  validate(enqueueSchema),
  asyncHandler(async (req, res) => {
    const last = await prisma.queueToken.findFirst({ orderBy: { number: 'desc' }, select: { number: true } })
    const number = (last?.number ?? 0) + 1
    const token = await prisma.queueToken.create({ data: { ...req.body, number } })
    res.status(201).json(token)
  })
)

// POST /api/queue/:id/call  → mark serving (and close any prior serving token)
router.post(
  '/:id/call',
  requireRole('ADMIN', 'DOCTOR', 'FRONT_DESK'),
  asyncHandler(async (req, res) => {
    const token = await prisma.queueToken.findUnique({ where: { id: req.params.id } })
    if (!token) throw notFound('Token not found')
    await prisma.queueToken.updateMany({ where: { status: 'SERVING' }, data: { status: 'DONE' } })
    const updated = await prisma.queueToken.update({
      where: { id: req.params.id },
      data: { status: 'SERVING', calledAt: new Date() },
    })
    res.json(updated)
  })
)

// PATCH /api/queue/:id/status
router.patch(
  '/:id/status',
  requireRole('ADMIN', 'DOCTOR', 'FRONT_DESK'),
  validate(z.object({ status: z.enum(['WAITING', 'CALLED', 'SERVING', 'DONE', 'OVERDUE']) })),
  asyncHandler(async (req, res) => {
    const updated = await prisma.queueToken.update({ where: { id: req.params.id }, data: { status: req.body.status } })
    res.json(updated)
  })
)

export default router
