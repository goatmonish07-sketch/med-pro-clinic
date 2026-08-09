import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'
import { badRequest } from '../utils/httpError.js'

const router = Router()

const dispenseSchema = z.object({
  patientId: z.string().min(1),
  createInvoice: z.boolean().default(true),
  items: z
    .array(z.object({ batch: z.string().min(1), qty: z.number().int().positive() }))
    .min(1),
})

// GET /api/pharmacy/alerts  → low-stock and expiring batches
router.get(
  '/alerts',
  asyncHandler(async (_req, res) => {
    const soon = new Date()
    soon.setDate(soon.getDate() + 60)
    const items = await prisma.inventoryItem.findMany()
    res.json({
      outOfStock: items.filter((i) => i.stock === 0),
      lowStock: items.filter((i) => i.stock > 0 && i.stock <= i.reorderLevel),
      expiring: items.filter((i) => i.expiry && i.expiry <= soon),
    })
  })
)

// POST /api/pharmacy/dispense
// Decrements stock atomically and (optionally) raises an invoice.
router.post(
  '/dispense',
  requireRole('ADMIN', 'PHARMACIST'),
  validate(dispenseSchema),
  asyncHandler(async (req, res) => {
    const { patientId, items, createInvoice } = req.body

    const result = await prisma.$transaction(async (tx) => {
      const lines = []
      for (const line of items) {
        const item = await tx.inventoryItem.findUnique({ where: { batch: line.batch } })
        if (!item) throw badRequest(`Unknown batch ${line.batch}`)
        if (item.stock < line.qty) throw badRequest(`Insufficient stock for ${item.name} (have ${item.stock})`)
        await tx.inventoryItem.update({ where: { batch: line.batch }, data: { stock: { decrement: line.qty } } })
        lines.push({ description: `${item.name} × ${line.qty}`, amount: Number(item.unitRate) * line.qty })
      }

      let invoice = null
      if (createInvoice) {
        const subtotal = lines.reduce((s, l) => s + l.amount, 0)
        const count = await tx.invoice.count()
        invoice = await tx.invoice.create({
          data: {
            number: `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`,
            patientId,
            lines,
            subtotal,
            tax: 0,
            discount: 0,
            total: subtotal,
            status: 'UNPAID',
          },
        })
      }
      return { lines, invoice }
    })

    res.status(201).json(result)
  })
)

export default router
