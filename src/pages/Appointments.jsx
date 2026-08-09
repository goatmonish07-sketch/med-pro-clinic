import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Card, Segmented } from '../components/ui'
import { calendarDays, calendarSlots, calendarEvents } from '../data/mock'

const evTone = {
  b: 'bg-brand-soft text-brand',
  c: 'bg-cyan-soft text-cyan',
  v: 'bg-violet-soft text-violet',
  g: 'bg-good-soft text-good',
  o: 'bg-warn-soft text-warn',
}

export default function Appointments() {
  const [view, setView] = useState('Week')

  return (
    <>
      <PageHead title="Appointments" sub="Week of 4–10 Aug 2026 · 3 doctors · 28 booked">
        <Segmented options={['Day', 'Week', 'Month']} value={view} onChange={setView} />
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> New
        </button>
      </PageHead>

      <Card
        title="August 2026"
        icon="calendar"
        action={
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-ink-2">
              <i className="h-[9px] w-[9px] rounded-[3px] bg-brand" /> Dr. Doe
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-ink-2">
              <i className="h-[9px] w-[9px] rounded-[3px] bg-cyan" /> Dr. Smith
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-ink-2">
              <i className="h-[9px] w-[9px] rounded-[3px] bg-violet" /> Tele
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-[52px_repeat(7,1fr)] border-t border-line">
            {/* Header row */}
            <div className="border-b border-r border-line bg-panel-2" />
            {calendarDays.map((d, i) => (
              <div
                key={d}
                className={`border-b border-r border-line bg-panel-2 py-2 text-center text-[11px] font-semibold ${
                  i === 5 ? 'text-brand' : 'text-ink-2'
                }`}
              >
                {d}
              </div>
            ))}

            {/* Slot rows */}
            {calendarSlots.map((slot, si) => (
              <div key={slot} className="contents">
                <div className="min-h-[44px] border-b border-r border-line px-1.5 py-1">
                  <span className="font-mono text-[9.5px] text-ink-3">{slot}</span>
                </div>
                {calendarDays.map((_, di) => {
                  const ev = calendarEvents[si]?.[di]
                  return (
                    <div key={di} className="min-h-[44px] border-b border-r border-line p-1">
                      {ev && (
                        <div className={`mb-0.5 cursor-pointer rounded-md px-1.5 py-1 text-[10px] font-semibold leading-tight ${evTone[ev.c]}`}>
                          {ev.t}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}
