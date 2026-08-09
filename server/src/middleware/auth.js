import { verifyToken } from '../utils/jwt.js'
import { unauthorized, forbidden } from '../utils/httpError.js'

// Requires a valid Bearer token; attaches { id, role, name } to req.user.
export function authenticate(req, _res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return next(unauthorized('Missing bearer token'))
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    next(unauthorized('Invalid or expired token'))
  }
}

// Restrict a route to one or more roles. Use after `authenticate`.
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(unauthorized())
    if (!roles.includes(req.user.role)) return next(forbidden('Insufficient role'))
    next()
  }
}
