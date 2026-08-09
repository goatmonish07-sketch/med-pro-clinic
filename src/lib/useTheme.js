import { useCallback, useEffect, useState } from 'react'

const KEY = 'medpro-theme'

// Reads the current effective theme, honouring an explicit choice or the
// system preference. Persists explicit choices to localStorage.
function currentTheme() {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'dark' || attr === 'light') return attr
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function useTheme() {
  const [theme, setTheme] = useState(currentTheme)

  useEffect(() => {
    const el = document.documentElement
    if (theme) el.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(KEY, theme)
    } catch (e) {
      /* storage unavailable — non-fatal */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}
