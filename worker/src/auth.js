import { sign, verify } from 'hono/jwt'

// Password hashing with Web Crypto PBKDF2 (bcrypt has no Workers build).
// Format: pbkdf2$<iterations>$<saltB64>$<hashB64>
const enc = new TextEncoder()
const ITER = 100000

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  return crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256)
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const bits = await pbkdf2(password, salt, ITER)
  return `pbkdf2$${ITER}$${toB64(salt)}$${toB64(bits)}`
}

export async function verifyPassword(password, stored) {
  const [scheme, iter, salt, hash] = String(stored).split('$')
  if (scheme !== 'pbkdf2') return false
  const bits = await pbkdf2(password, fromB64(salt), Number(iter))
  // constant-ish time compare
  const a = toB64(bits)
  if (a.length !== hash.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ hash.charCodeAt(i)
  return diff === 0
}

const ALG = 'HS256'

export async function signToken(payload, secret) {
  const now = Math.floor(Date.now() / 1000)
  return sign({ ...payload, iat: now, exp: now + 12 * 3600 }, secret, ALG)
}

export async function verifyToken(token, secret) {
  return verify(token, secret, ALG)
}
