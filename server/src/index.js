import { createApp } from './app.js'
import { env } from './env.js'
import { prisma } from './db.js'

const app = createApp()

const server = app.listen(env.port, () => {
  console.log(`MED-PRO API listening on http://localhost:${env.port}  (${env.nodeEnv})`)
})

// Graceful shutdown
async function shutdown(signal) {
  console.log(`\n${signal} received — shutting down…`)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
