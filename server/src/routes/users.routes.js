import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'

const router = Router()

const inviteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'DOCTOR', 'FRONT_DESK', 'PHARMACIST']),
  branch: z.string().default('Main'),
})

// GET /api/users  (admin only)
router.get(
  '/',
  requireRole('ADMIN'),
  asyncHandler(async (_req, res) => {
    const data = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, email: true, role: true, branch: true, status: true, createdAt: true },
    })
    res.json({ data })
  })
)

// POST /api/users  (admin invites a teammate)
router.post(
  '/',
  requireRole('ADMIN'),
  validate(inviteSchema),
  asyncHandler(async (req, res) => {
    const { password, ...rest } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { ...rest, passwordHash, status: 'INVITED' },
      select: { id: true, name: true, email: true, role: true, branch: true, status: true },
    })
    res.status(201).json(user)
  })
)

// PATCH /api/users/:id  (update role/status)
router.patch(
  '/:id',
  requireRole('ADMIN'),
  validate(
    z.object({
      role: z.enum(['ADMIN', 'DOCTOR', 'FRONT_DESK', 'PHARMACIST']).optional(),
      status: z.enum(['ACTIVE', 'INVITED', 'DISABLED']).optional(),
      branch: z.string().optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
      select: { id: true, name: true, email: true, role: true, branch: true, status: true },
    })
    res.json(user)
  })
)

export default router
