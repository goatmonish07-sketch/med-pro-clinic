import { HttpError } from '../utils/httpError.js'

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Not found' })
}

// Central error handler. Maps known Prisma + Http errors to clean responses.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details })
  }
  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Unique constraint violated', details: err.meta?.target })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' })
  }
  if (err.name === 'PrismaClientInitializationError') {
    return res.status(503).json({ error: 'Database unavailable. Is Postgres running and migrated?' })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
