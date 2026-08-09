import Icon from '../components/Icon'
import { PageHead } from '../components/ui'

// Temporary page for modules scheduled in later phases. Keeps the shell
// fully navigable while each screen is built out from the approved prototype.
export default function Placeholder({ title, icon = 'dashboard', phase }) {
  return (
    <>
      <PageHead title={title} sub="This module is part of the roadmap and comes next." />
      <div className="card grid place-items-center px-[15px] py-16 text-center">
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Icon name={icon} size={26} />
        </div>
        <h2 className="text-[16px] font-bold">{title}</h2>
        <p className="mt-1 max-w-[46ch] text-[12.5px] text-ink-3">
          The full {title} screen is designed and approved in the prototype. It will be wired up in
          {phase ? ` ${phase}` : ' an upcoming phase'} using this same design system.
        </p>
      </div>
    </>
  )
}
