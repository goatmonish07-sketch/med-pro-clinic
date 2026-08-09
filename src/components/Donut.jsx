// Segmented donut from a list of { pct, color } — pure SVG, no dependency.
// Uses stroke-dasharray on stacked circles (r chosen so circumference ≈ 100).
export default function Donut({ segments, center, sub, size = 120 }) {
  const r = 15.9155 // circumference ≈ 100 → dasharray values map to percentages
  let offset = 25 // start at 12 o'clock
  return (
    <svg viewBox="0 0 42 42" style={{ width: size, height: size }} role="img" aria-label={sub || 'Donut chart'}>
      <circle cx="21" cy="21" r={r} fill="none" stroke="var(--panel-3)" strokeWidth="6" />
      {segments.map((s, i) => {
        const dash = `${s.pct} ${100 - s.pct}`
        const el = (
          <circle
            key={i}
            cx="21"
            cy="21"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="6"
            strokeDasharray={dash}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        )
        offset -= s.pct
        return el
      })}
      {center && (
        <text x="21" y="21" textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--ink)">
          {center}
        </text>
      )}
      {sub && (
        <text x="21" y="26" textAnchor="middle" fontSize="2.8" fill="var(--ink-3)">
          {sub}
        </text>
      )}
    </svg>
  )
}
