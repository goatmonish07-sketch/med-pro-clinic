import { useState } from 'react'
import Icon from './Icon'
import { useAuth } from '../lib/auth.jsx'

// Login dialog. Pre-filled with the seeded demo admin so connecting to a local
// API is one click; clears cleanly on failure (e.g. API not running).
export default function Login({ onClose }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@medpro.clinic')
  const [password, setPassword] = useState('medpro123')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(email, password)
      onClose()
    } catch (err) {
      setError(
        err.status === 401
          ? 'Invalid email or password.'
          : 'Could not reach the API. Is the server running on VITE_API_URL?'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Log in"
    >
      <div className="card w-full max-w-[380px] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#4361ee] to-[#0ea5a0] text-white">
            <Icon name="logo" size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-[15px] font-bold leading-tight">Sign in to MED-PRO</div>
            <div className="text-[11.5px] text-ink-3">Connect to your live clinic data</div>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-semibold text-ink-2">Email</span>
            <input
              className="field-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-semibold text-ink-2">Password</span>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="rounded-lg bg-crit-soft px-3 py-2 text-[11.5px] font-medium text-crit" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary mt-1 justify-center" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-center text-[11px] text-ink-3">
            Demo: admin@medpro.clinic / medpro123 · needs the API running
          </p>
        </form>
      </div>
    </div>
  )
}
