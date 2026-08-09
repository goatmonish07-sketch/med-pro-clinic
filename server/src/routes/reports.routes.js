import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// GET /api/reports/dashboard  → KPIs + live queue snapshot for the home screen
router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const today = startOfToday()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [appointmentsToday, waiting, consultsToday, paymentsToday, pending] = await Promise.all([
      prisma.appointment.count({ where: { scheduledAt: { gte: today, lt: tomorrow } } }),
      prisma.queueToken.count({ where: { status: { in: ['WAITING', 'CALLED', 'OVERDUE'] } } }),
      prisma.consultation.count({ where: { createdAt: { gte: today } } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID', createdAt: { gte: today } } }),
      prisma.invoice.aggregate({ _sum: { total: true }, _count: true, where: { status: { in: ['UNPAID', 'PARTIAL'] } } }),
    ])

    res.json({
      kpis: {
        appointmentsToday,
        waiting,
        consultsToday,
        revenueToday: Number(paymentsToday._sum.amount || 0),
        pendingAmount: Number(pending._sum.total || 0),
        pendingCount: pending._count,
      },
    })
  })
)

// GET /api/reports/analytics  → revenue trend, department split, top doctors
router.get(
  '/analytics',
  asyncHandler(async (_req, res) => {
    // Revenue by month (last 6 months) from PAID payments
    const since = new Date()
    since.setMonth(since.getMonth() - 5, 1)
    since.setHours(0, 0, 0, 0)
    const payments = await prisma.payment.findMany({
      where: { status: 'PAID', createdAt: { gte: since } },
      select: { amount: true, createdAt: true },
    })
    const months = {}
    for (const p of payments) {
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`
      months[key] = (months[key] || 0) + Number(p.amount)
    }

    const [newPatients, consultations, doctors] = await Promise.all([
      prisma.patient.count({ where: { createdAt: { gte: since } } }),
      prisma.consultation.count({ where: { createdAt: { gte: since } } }),
      prisma.user.findMany({
        where: { role: { in: ['DOCTOR', 'ADMIN'] } },
        select: { name: true, _count: { select: { consultations: true } } },
      }),
    ])

    res.json({
      revenueByMonth: months,
      totals: {
        revenue: payments.reduce((s, p) => s + Number(p.amount), 0),
        newPatients,
        consultations,
      },
      topDoctors: doctors
        .map((d) => ({ name: d.name, consultations: d._count.consultations }))
        .sort((a, b) => b.consultations - a.consultations)
        .slice(0, 5),
    })
  })
)

export default router
