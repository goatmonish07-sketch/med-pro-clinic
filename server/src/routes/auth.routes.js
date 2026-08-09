import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../db.js'
import { signToken } from '../utils/jwt.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { unauthorized } from '../utils/httpError.js'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// POST /api/auth/login
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.status === 'DISABLED') throw unauthorized('Invalid credentials')
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw unauthorized('Invalid credentials')

    const token = signToken({ id: user.id, role: user.role, name: user.name })
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, branch: user.branch },
    })
  })
)

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, branch: true, status: true },
    })
    if (!user) throw unauthorized()
    res.json({ user })
  })
)

export default router
