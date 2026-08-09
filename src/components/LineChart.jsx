// Minimal single-series area+line chart. Shares the maths style with
// RevenueChart but is generic so Reports can reuse it.
const W = 620
const H = 170
const PAD_TOP = 22
const PAD_BOTTOM = 12

export default function LineChart({ series, labels, color = 'var(--violet)', id = 'lc', ariaLabel = 'Trend' }) {
  const lo = Math.min(...series) * 0.85
  const hi = Math.max(...series) * 1.05
  const span = hi - lo || 1
  const step = W / (series.length - 1)
  const pts = series.map((v, i) => ({
    x: i * step,
    y: PAD_TOP + (1 - (v - lo) / span) * (H - PAD_TOP - PAD_BOTTOM),
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${W} ${H} L 0 ${H} Z`
  const last = pts[pts.length - 1]

  return (
    <div className="px-[13px] pb-3 pt-0.5">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-[170px] w-full" role="img" aria-label={ariaLabel}>
        <defs>
          <linearGradient id={`${id}Fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.26" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[42, 85, 128].map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="var(--line)" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#${id}Fill)`} />
        <path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx={last.x} cy={last.y} r="5" fill={color} stroke="var(--panel)" strokeWidth="2.5" />
      </svg>
      {labels && (
        <div className="flex justify-between px-1.5 pt-1.5 text-[10.5px] text-ink-3">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}
