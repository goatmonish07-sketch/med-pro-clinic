import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'
import { notFound, badRequest } from '../utils/httpError.js'

const router = Router()

const createSchema = z.object({
  invoiceId: z.string().optional(),
  patientId: z.string().min(1),
  method: z.enum(['UPI', 'CARD', 'CASH']),
  amount: z.number().positive(),
})

// GET /api/payments?filter=All|Paid|Pending
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = (req.query.filter || 'All').toString()
    const where = filter === 'Paid' ? { status: 'PAID' } : filter === 'Pending' ? { status: 'PENDING' } : {}
    const data = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { patient: { select: { name: true } }, invoice: { select: { number: true } } },
    })
    // Method split for the KPI tiles
    const paid = await prisma.payment.findMany({ where: { status: 'PAID' }, select: { method: true, amount: true } })
    const byMethod = paid.reduce((acc, p) => ((acc[p.method] = (acc[p.method] || 0) + Number(p.amount)), acc), {})
    res.json({ data, byMethod })
  })
)

// POST /api/payments  (records a payment and marks its invoice paid when covered)
router.post(
  '/',
  requireRole('ADMIN', 'FRONT_DESK'),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const { invoiceId, patientId, method, amount } = req.body
    const reference = `TXN-${Date.now().toString().slice(-6)}`

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: { reference, invoiceId, patientId, method, amount, status: 'PAID' },
      })

      if (invoiceId) {
        const invoice = await tx.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } })
        if (!invoice) throw notFound('Invoice not found')
        const paidTotal = invoice.payments.reduce((s, p) => s + Number(p.amount), 0)
        const status = paidTotal >= Number(invoice.total) ? 'PAID' : 'PARTIAL'
        await tx.invoice.update({ where: { id: invoiceId }, data: { status } })
      }
      return payment
    })

    res.status(201).json(result)
  })
)

// POST /api/payments/:id/refund
router.post(
  '/:id/refund',
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.id } })
    if (!payment) throw notFound('Payment not found')
    if (payment.status !== 'PAID') throw badRequest('Only paid payments can be refunded')
    const updated = await prisma.payment.update({ where: { id: req.params.id }, data: { status: 'REFUNDED' } })
    res.json(updated)
  })
)

export default router
