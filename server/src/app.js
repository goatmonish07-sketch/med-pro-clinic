import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './env.js'
import api from './routes/index.js'
import { notFoundHandler, errorHandler } from './middleware/error.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.corsOrigin.split(',').map((s) => s.trim()), credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  if (env.nodeEnv !== 'test') app.use(morgan('dev'))

  // Liveness — works even without a database connection.
  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'med-pro-clinic-api', time: new Date().toISOString() }))

  app.use('/api', api)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
