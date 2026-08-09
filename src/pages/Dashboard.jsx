import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented } from '../components/ui'
import RevenueChart from '../components/RevenueChart'
import { clinic, kpis, schedule, queue, copilotInsights } from '../data/mock'
import { useState } from 'react'

const statusStyle = {
  done: 'text-good bg-good-soft',
  prog: 'text-brand bg-brand-soft',
  wait: 'text-warn bg-warn-soft',
  video: 'text-violet bg-violet-soft',
}
const copilotTone = {
  crit: 'bg-crit-soft text-crit',
  warn: 'bg-warn-soft text-warn',
  good: 'bg-good-soft text-good',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [range, setRange] = useState('Week')

  return (
    <>
      <PageHead
        title="Command center"
        live="Live"
        sub={`${clinic.today} · 3 doctors on shift · 28 appointments · 6 waiting`}
      >
        <button className="btn" onClick={() => navigate('/tele')}>
          <Icon name="video" size={15} /> Tele-visit
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/patients')}>
          <Icon name="plus" size={15} /> Add patient
        </button>
      </PageHead>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <Kpi key={k.key} {...k} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-3.5">
          <Card
            title="Revenue & footfall"
            icon="trend"
            action={<Segmented options={['Day', 'Week', 'Month']} value={range} onChange={setRange} />}
          >
            <RevenueChart />
          </Card>

          <Card
            title="Today's schedule"
            icon="calendar"
            action={
              <button className="text-[11.5px] font-semibold text-brand" onClick={() => navigate('/appointments')}>
                Open calendar →
              </button>
            }
          >
            {schedule.map((a) => (
              <div key={a.time} className="flex items-center gap-2.5 border-t border-line px-[15px] py-[9px]">
                <span className="num w-12 flex-none font-mono text-[11px] text-ink-2">{a.time}</span>
                <span className={`grid h-[30px] w-[30px] flex-none place-items-center rounded-lg bg-gradient-to-br ${a.avatar} text-[11px] font-bold text-white`}>
                  {a.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold">
                    {a.name}
                    {a.tele && <span className="text-cyan"> · Tele</span>}
                  </div>
                  <div className="text-[11px] text-ink-3">{a.detail}</div>
                </div>
                <span className={`whitespace-nowrap rounded-full px-2 py-[3px] text-[10px] font-bold ${statusStyle[a.status]}`}>
                  {a.statusLabel}
                </span>
              </div>
            ))}
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5">
          <Card
            title="Live queue"
            icon="queue"
            action={
              <button className="text-[11.5px] font-semibold text-brand" onClick={() => navigate('/queue')}>
                Manage →
              </button>
            }
          >
            <div className="relative m-[15px_15px_6px] overflow-hidden rounded-[13px] bg-gradient-to-br from-[#0f9d94] to-[#12b3a3] p-[15px] text-white after:absolute after:-right-7 after:-top-7 after:h-[120px] after:w-[120px] after:rounded-full after:bg-white/[.12] after:content-['']">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-90">Now serving</div>
              <div className="num my-[2px] text-[27px] font-extrabold tracking-tight">Token {queue.serving.token}</div>
              <div className="text-[12px] opacity-95">
                {queue.serving.name} · {queue.serving.detail}
              </div>
              <button className="mt-3 w-full rounded-[10px] border border-white/[.28] bg-white/[.18] py-2.5 text-[12.5px] font-semibold text-white">
                Call next patient →
              </button>
            </div>
            {queue.next.map((q) => (
              <div key={q.token} className="flex items-center gap-2.5 border-t border-line px-[15px] py-[7px] text-[12px]">
                <span className="num w-[38px] font-mono text-[10.5px] text-ink-3">{q.token}</span>
                <span className="flex-1 font-medium">{q.name}</span>
                <span className="text-[10.5px] text-ink-3">{q.wait}</span>
              </div>
            ))}
          </Card>

          <Card
            title="Clinical Copilot"
            icon="brain"
            className="bg-gradient-to-b from-[color-mix(in_srgb,var(--violet)_7%,var(--panel))] to-panel [&_h2_.text-brand]:text-violet"
            action={<button className="text-[11.5px] font-semibold text-brand">History</button>}
          >
            {copilotInsights.map((c, i) => (
              <div key={i} className="flex gap-2.5 border-t border-line px-[15px] py-2.5">
                <div className={`grid h-[27px] w-[27px] flex-none place-items-center rounded-lg ${copilotTone[c.tone]}`}>
                  <Icon name={c.icon} size={14} />
                </div>
                <p className="text-[12px] leading-snug text-ink-2">
                  {c.text} {c.cta && <span className="font-semibold text-brand">{c.cta}</span>}
                </p>
              </div>
            ))}
            <div className="flex gap-2 px-[15px] pb-3.5 pt-2.5">
              <input className="field-input flex-1" placeholder="Ask about a patient, drug, or schedule…" aria-label="Ask copilot" />
              <button aria-label="Send" className="grid w-[38px] place-items-center rounded-[9px] bg-gradient-to-br from-violet to-brand text-white">
                <Icon name="send" size={15} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
