import { useEffect, useState } from 'react'
import { useAuth } from './auth.jsx'

// Fetch data from the API when authenticated, with a mock fallback otherwise.
//
//   const { data, loading, live, error } = useApiData(
//     () => api.listPatients(params),   // fetcher (live)
//     demoData,                         // fallback (demo)
//     [params.search, params.filter]    // deps that re-trigger the fetch
//   )
//
// - Not authenticated  → returns fallback, live=false (demo mode)
// - Authenticated + ok → returns API data, live=true
// - Authenticated + err→ returns fallback, live=false, error set
export function useApiData(fetcher, fallback, deps = []) {
  const { authed } = useAuth()
  const [state, setState] = useState({ data: fallback, loading: authed, live: false, error: null })

  useEffect(() => {
    let cancelled = false
    if (!authed) {
      setState({ data: fallback, loading: false, live: false, error: null })
      return
    }
    setState((s) => ({ ...s, loading: true }))
    fetcher()
      .then((data) => !cancelled && setState({ data, loading: false, live: true, error: null }))
      .catch((error) => !cancelled && setState({ data: fallback, loading: false, live: false, error }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, ...deps])

  return state
}
