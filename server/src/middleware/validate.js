import { badRequest } from '../utils/httpError.js'

// Validate a request part against a zod schema and replace it with the parsed value.
export const validate =
  (schema, part = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[part])
    if (!result.success) {
      const details = result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
      return next(badRequest('Validation failed', details))
    }
    req[part] = result.data
    next()
  }
