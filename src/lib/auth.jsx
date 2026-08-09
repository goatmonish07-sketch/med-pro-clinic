import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, getToken, setToken } from './api'

// Auth state for the app. When a valid token is present and the API responds,
// the app is "live"; otherwise it renders demo (mock) data. This keeps the
// static build working with no backend while enabling real data when the API
// is up.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // On mount, if we have a stored token, verify it against the API.
  useEffect(() => {
    let cancelled = false
    const token = getToken()
    if (!token) {
      setReady(true)
      return
    }
    api
      .me()
      .then(({ user }) => !cancelled && setUser(user))
      .catch(() => {
        // Invalid token or API unreachable → fall back to demo mode.
        setToken(null)
        if (!cancelled) setUser(null)
      })
      .finally(() => !cancelled && setReady(true))
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user } = await api.login(email, password)
    setToken(token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = { user, authed: !!user, ready, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
