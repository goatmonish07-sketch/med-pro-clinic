// Small typed HTTP error so handlers can throw with a status code.
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

export const notFound = (msg = 'Resource not found') => new HttpError(404, msg)
export const badRequest = (msg = 'Bad request', details) => new HttpError(400, msg, details)
export const unauthorized = (msg = 'Unauthorized') => new HttpError(401, msg)
export const forbidden = (msg = 'Forbidden') => new HttpError(403, msg)
export const conflict = (msg = 'Conflict') => new HttpError(409, msg)
