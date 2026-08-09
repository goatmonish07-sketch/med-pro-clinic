import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { requireRole } from '../middleware/auth.js'

const router = Router()

const upsertSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  batch: z.string().min(1),
  stock: z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(0),
  expiry: z.coerce.date().optional(),
  supplier: z.string().optional(),
  unitRate: z.number().min(0).default(0),
})

// GET /api/inventory?filter=All|Low|Expiring
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = (req.query.filter || 'All').toString()
    const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } })

    const soon = new Date()
    soon.setDate(soon.getDate() + 60)
    let data = items
    if (filter === 'Low') data = items.filter((i) => i.stock <= i.reorderLevel)
    if (filter === 'Expiring') data = items.filter((i) => i.expiry && i.expiry <= soon)

    const stats = {
      totalSkus: items.length,
      lowStock: items.filter((i) => i.stock <= i.reorderLevel).length,
      expiringSoon: items.filter((i) => i.expiry && i.expiry <= soon).length,
      stockValue: items.reduce((sum, i) => sum + Number(i.unitRate) * i.stock, 0),
    }
    res.json({ data, stats })
  })
)

// POST /api/inventory
router.post(
  '/',
  requireRole('ADMIN', 'PHARMACIST'),
  validate(upsertSchema),
  asyncHandler(async (req, res) => {
    const item = await prisma.inventoryItem.create({ data: req.body })
    res.status(201).json(item)
  })
)

// PATCH /api/inventory/:id  (e.g. adjust stock on restock)
router.patch(
  '/:id',
  requireRole('ADMIN', 'PHARMACIST'),
  validate(upsertSchema.partial()),
  asyncHandler(async (req, res) => {
    const item = await prisma.inventoryItem.update({ where: { id: req.params.id }, data: req.body })
    res.json(item)
  })
)

export default router
