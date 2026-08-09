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
  lines: z.array(z.object({ description: z.string().min(1), amount: z.number() })).min(1),
  taxRate: z.number().min(0).max(1).default(0.18),
  discountRate: z.number().min(0).max(1).default(0),
})

async function nextNumber() {
  const year = new Date().getFullYear()
  const count = await prisma.invoice.count()
  return `INV-${year}-${String(count + 1).padStart(4, '0')}`
}

// GET /api/invoices/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const inv = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { patient: { select: { name: true, code: true } }, payments: true },
    })
    if (!inv) throw notFound('Invoice not found')
    res.json(inv)
  })
)

// POST /api/invoices  (computes totals server-side)
router.post(
  '/',
  requireRole('ADMIN', 'FRONT_DESK'),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const { patientId, lines, taxRate, discountRate } = req.body
    const subtotal = lines.reduce((sum, l) => sum + l.amount, 0)
    const discount = +(subtotal * discountRate).toFixed(2)
    const tax = +((subtotal - discount) * taxRate).toFixed(2)
    const total = +(subtotal - discount + tax).toFixed(2)
    const number = await nextNumber()

    const invoice = await prisma.invoice.create({
      data: { number, patientId, lines, subtotal, tax, discount, total, status: 'UNPAID' },
    })
    res.status(201).json(invoice)
  })
)

export default router
