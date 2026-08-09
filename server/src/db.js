import { PrismaClient } from '@prisma/client'

// Single Prisma instance reused across the process (avoids exhausting
// connections during dev hot-reloads).
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma
}
