import { NavLink } from 'react-router-dom'
import Icon from '../components/Icon'
import { navSections } from './nav'

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="sticky top-0 flex h-screen w-[216px] flex-col gap-0.5 overflow-y-auto bg-gradient-to-b from-rail to-rail-2 px-[11px] py-[15px] text-rail-ink [scrollbar-width:none]">
      <div className="flex items-center gap-2.5 px-[7px] pb-3.5 pt-1">
        <div className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] bg-gradient-to-br from-[#4361ee] to-[#0ea5a0] text-white shadow-[0_6px_16px_-6px_rgba(67,97,238,.7)]">
          <Icon name="logo" size={19} strokeWidth={2.3} />
        </div>
        <div>
          <b className="block text-[14px] font-bold leading-tight tracking-tight text-white">MED-PRO</b>
          <small className="text-[9.5px] uppercase tracking-[0.13em] text-rail-ink-2">Clinic OS</small>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {navSections.map((section, i) => (
          <div key={i} className="contents">
            {section.label && (
              <div className="px-[9px] pb-1 pt-[11px] text-[9.5px] font-semibold uppercase tracking-[0.13em] text-rail-ink-2">
                {section.label}
              </div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 rounded-[9px] px-[9px] py-[7px] text-[12.5px] font-medium transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-[rgba(67,97,238,.92)] to-[rgba(67,97,238,.5)] text-white shadow-[0_8px_16px_-10px_rgba(67,97,238,.9)]'
                      : 'text-rail-ink hover:bg-white/[.06] hover:text-white',
                  ].join(' ')
                }
              >
                <Icon name={item.icon} size={16} className="flex-none opacity-85" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-crit px-1.5 py-px text-[10px] font-bold text-white">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
