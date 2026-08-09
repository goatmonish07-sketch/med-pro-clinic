import Icon from '../components/Icon'
import useTheme from '../lib/useTheme'
import { clinic } from '../data/mock'

export default function Topbar({ crumb }) {
  const { toggle } = useTheme()

  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] px-5 py-[11px] backdrop-blur-lg">
      <div className="whitespace-nowrap text-[12.5px] font-medium text-ink-3">
        MED-PRO <span className="opacity-40">/</span> <b className="font-semibold text-ink">{crumb}</b>
      </div>

      <label className="ml-1.5 flex max-w-[440px] flex-1 items-center gap-2.5 rounded-[11px] border border-line-2 bg-panel px-3 py-2 text-ink-3 focus-within:border-transparent focus-within:shadow-glow">
        <Icon name="search" size={15} className="flex-none" />
        <input
          className="min-w-0 flex-1 border-none bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-3"
          placeholder="Search or run a command…"
          aria-label="Command palette"
        />
        <kbd className="rounded-[5px] border border-line-2 bg-panel-2 px-1.5 py-0.5 font-mono text-[10.5px] text-ink-3">⌘K</kbd>
      </label>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="grid h-9 w-9 place-items-center rounded-[10px] border border-line-2 bg-panel text-ink-2 hover:bg-panel-2"
        >
          <Icon name="moon" size={17} />
        </button>
        <button
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-[10px] border border-line-2 bg-panel text-ink-2 hover:bg-panel-2"
        >
          <span className="absolute right-2 top-[7px] h-[7px] w-[7px] rounded-full border-2 border-panel bg-crit" />
          <Icon name="bell" size={17} />
        </button>
        <div className="flex items-center gap-2.5 rounded-[11px] border border-line-2 bg-panel py-[3px] pl-[3px] pr-1.5">
          <div className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg bg-gradient-to-br from-brand to-violet text-[11.5px] font-bold text-white">
            {clinic.user.initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-[12px] font-semibold leading-tight">{clinic.user.name}</div>
            <div className="text-[10.5px] text-ink-3">
              {clinic.user.role} · {clinic.branch}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
