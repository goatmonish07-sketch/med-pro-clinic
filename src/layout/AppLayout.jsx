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

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[216px_1fr]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-col">
        <Topbar crumb={crumb} />
        <main className="flex flex-col gap-3.5 px-5 pb-10 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
