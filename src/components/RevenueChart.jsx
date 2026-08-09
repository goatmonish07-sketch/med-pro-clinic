import { weeklyRevenue, weeklyFootfall, weekdays } from '../data/mock'

// Builds a smooth-ish SVG line + area from a numeric series, plus footfall bars.
// Pure presentational maths — no chart library needed for this density.
const W = 620
const H = 176
const PAD_TOP = 20
const PAD_BOTTOM = 8

function scale(series, min, max) {
  const lo = min ?? Math.min(...series)
  const hi = max ?? Math.max(...series)
  const span = hi - lo || 1
  const step = W / (series.length - 1)
  return series.map((v, i) => ({
    x: i * step,
    y: PAD_TOP + (1 - (v - lo) / span) * (H - PAD_TOP - PAD_BOTTOM),
  }))
}

function linePath(points) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
}

export default function RevenueChart() {
  const revLo = Math.min(...weeklyRevenue) * 0.85
  const revHi = Math.max(...weeklyRevenue) * 1.05
  const pts = scale(weeklyRevenue, revLo, revHi)
  const line = linePath(pts)
  const area = `${line} L ${W} ${H} L 0 ${H} Z`

  const barLo = 0
  const barHi = Math.max(...weeklyFootfall) * 1.1
  const barW = 18
  const step = W / (weeklyFootfall.length - 1)

  const last = pts[pts.length - 1]

  return (
    <div className="px-[13px] pb-3 pt-0.5">
      <div className="flex flex-wrap gap-4 px-[3px] pb-1.5">
        <span className="flex items-center gap-1.5 text-[11px] text-ink-2">
          <i className="h-[9px] w-[9px] rounded-[3px] bg-brand" /> Revenue · ₹2.64L
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-ink-2">
          <i className="h-[9px] w-[9px] rounded-[3px] bg-cyan" /> Patients · 218
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-[176px] w-full"
        role="img"
        aria-label="Weekly revenue and patient footfall, both trending up"
      >
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--brand)" stopOpacity="0.26" />
            <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[42, 88, 134].map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="var(--line)" strokeWidth="1" />
        ))}

        {weeklyFootfall.map((v, i) => {
          const h = ((v - barLo) / (barHi - barLo)) * (H - PAD_TOP - PAD_BOTTOM)
          const x = i * step - barW / 2
          const y = H - PAD_BOTTOM - h
          return <rect key={i} x={Math.max(2, x)} y={y} width={barW} height={h} rx="4" fill="var(--cyan)" opacity="0.5" />
        })}

        <path d={area} fill="url(#revFill)" />
        <path d={line} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" />
        <circle cx={last.x} cy={last.y} r="5" fill="var(--brand)" stroke="var(--panel)" strokeWidth="2.5" />
      </svg>

      <div className="flex justify-between px-1.5 pt-1.5 text-[10.5px] text-ink-3">
        {weekdays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  )
}
