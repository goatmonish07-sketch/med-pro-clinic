import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { navSections } from './nav'

// Flattened lookup: path -> label, for the breadcrumb.
const labelByPath = navSections
  .flatMap((s) => s.items)
  .reduce((acc, i) => ({ ...acc, [i.to]: i.label }), {})

export default function AppLayout() {
  const { pathname } = useLocation()
  const crumb = labelByPath[pathname] || 'Dashboard'
  const [mobileNav, setMobileNav] = useState(false)

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setMobileNav(false)
  }, [pathname])

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[216px_1fr]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNav(false)} aria-hidden="true" />
          <div className="absolute left-0 top-0 h-full w-[236px] shadow-2xl">
            <Sidebar onNavigate={() => setMobileNav(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <Topbar crumb={crumb} onMenu={() => setMobileNav(true)} />
        <main className="flex flex-col gap-3.5 px-4 pb-10 pt-4 sm:px-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
