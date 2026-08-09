import Icon from './Icon'

// Accent → token class maps (kept explicit so Tailwind's JIT keeps the classes).
const accentBar = {
  brand: 'before:bg-brand',
  warn: 'before:bg-warn',
  cyan: 'before:bg-cyan',
  good: 'before:bg-good',
  violet: 'before:bg-violet',
}
const accentIcon = {
  brand: 'bg-brand-soft text-brand',
  warn: 'bg-warn-soft text-warn',
  cyan: 'bg-cyan-soft text-cyan',
  good: 'bg-good-soft text-good',
  violet: 'bg-violet-soft text-violet',
}

export function PageHead({ title, sub, live, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3.5">
      <div>
        <h1 className="mb-[3px] flex items-center gap-2.5 text-[21px] font-bold tracking-tight">
          {title}
          {live && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-good-soft px-2 py-[3px] text-[10.5px] font-semibold text-good">
              <i className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-good motion-reduce:animate-none" />
              {live}
            </span>
          )}
        </h1>
        {sub && <p className="text-[12.5px] text-ink-3">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function Kpi({ label, value, delta, dir, accent = 'brand', icon }) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm2 border border-line bg-panel px-3.5 py-[13px] shadow-card-sm before:absolute before:bottom-0 before:left-0 before:top-0 before:w-[3px] before:content-[''] ${accentBar[accent]}`}
    >
      <div className="mb-[7px] flex items-center justify-between">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">{label}</span>
        {icon && (
          <span className={`grid h-[26px] w-[26px] place-items-center rounded-lg ${accentIcon[accent]}`}>
            <Icon name={icon} size={15} />
          </span>
        )}
      </div>
      <div className="num text-[23px] font-extrabold tracking-tight">{value}</div>
      {delta && (
        <div className={`mt-0.5 text-[11px] font-semibold ${dir === 'dn' ? 'text-crit' : 'text-good'}`}>{delta}</div>
      )}
    </div>
  )
}

export function Card({ title, icon, action, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2.5 px-[15px] pb-[9px] pt-[13px]">
          <h2 className="flex items-center gap-2 text-[14px] font-bold tracking-tight">
            {icon && (
              <span className="inline-flex text-brand">
                <Icon name={icon} size={16} />
              </span>
            )}
            {title}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

// Status pill — semantic tone maps kept explicit for Tailwind JIT.
const statusTones = {
  good: 'text-good bg-good-soft',
  brand: 'text-brand bg-brand-soft',
  warn: 'text-warn bg-warn-soft',
  violet: 'text-violet bg-violet-soft',
  cyan: 'text-cyan bg-cyan-soft',
  crit: 'text-crit bg-crit-soft',
}
export function StatusBadge({ tone = 'good', children }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2 py-[3px] text-[10px] font-bold ${statusTones[tone]}`}>
      {children}
    </span>
  )
}

export function Avatar({ initials, gradient = 'from-brand to-violet', size = 30 }) {
  return (
    <span
      className={`grid flex-none place-items-center rounded-lg bg-gradient-to-br ${gradient} font-bold text-white`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  )
}

// Horizontally-scrollable table wrapper — keeps wide tables off the page body.
export function TableWrap({ children }) {
  return <div className="overflow-x-auto">{children}</div>
}
export function Table({ head, children }) {
  return (
    <TableWrap>
      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap border-b border-line-2 px-[15px] py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </TableWrap>
  )
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex gap-0.5 rounded-lg border border-line-2 bg-panel-2 p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange?.(o)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
            o === value ? 'bg-brand text-white' : 'text-ink-3'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
