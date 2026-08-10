import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHead, Card } from '../components/ui'
import { teleVisit } from '../data/mock'

export default function Tele() {
  const navigate = useNavigate()
  const t = teleVisit
  return (
    <>
      <PageHead
        title="Tele-consultation"
        live="Connected"
        sub={`${t.patient} · ${t.id} · ${t.kind} · ${t.time}`}
      >
        <button className="btn" onClick={() => navigate('/app/prescriptions')}>
          <Icon name="rx" size={15} /> e-Prescribe
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/app/billing')}>
          Collect ₹{t.fee}
        </button>
      </PageHead>

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.6fr_1fr]">
        {/* Video stage */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line bg-[#0b1020]">
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#1a2550] to-[#0e1430] text-[#8695c8]">
            <div className="text-center">
              <div className="mx-auto grid h-[74px] w-[74px] place-items-center rounded-full bg-gradient-to-br from-[#7c5cf0] to-[#5a72f0] text-2xl font-bold text-white">
                {t.initials}
              </div>
              <div className="mt-2.5 text-[12px]">{t.patient}</div>
            </div>
          </div>
          <div className="absolute left-3 top-3 rounded-lg bg-black/40 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
            {t.patient} · {t.elapsed}
          </div>
          <div className="absolute bottom-3 right-3 grid aspect-[4/3] w-[110px] place-items-center rounded-[10px] border-2 border-white/20 bg-gradient-to-br from-[#0f9d94] to-[#12b3a3] text-[11px] font-semibold text-white">
            You · Dr. Doe
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2.5">
            {['brain', 'video', 'dashboard'].map((ic) => (
              <button key={ic} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/[.14] text-white" aria-label={ic}>
                <Icon name={ic} size={18} />
              </button>
            ))}
            <button className="grid h-10 w-10 place-items-center rounded-full bg-crit text-white" aria-label="End call">
              <Icon name="payments" size={18} />
            </button>
          </div>
        </div>

        {/* Notes + copilot */}
        <div className="flex flex-col gap-3.5">
          <Card title="Visit notes">
            <div className="flex flex-col gap-2.5 p-[15px]">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-semibold text-ink-2">Chief complaint</span>
                <textarea rows={2} className="field-input" defaultValue={t.complaint} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-semibold text-ink-2">Advice</span>
                <input className="field-input" defaultValue={t.advice} />
              </label>
            </div>
          </Card>
          <Card
            title="Copilot"
            icon="brain"
            className="bg-gradient-to-b from-[color-mix(in_srgb,var(--violet)_7%,var(--panel))] to-panel [&_h2_.text-brand]:text-violet"
          >
            <div className="flex gap-2.5 border-t border-line px-[15px] py-2.5">
              <div className="grid h-[27px] w-[27px] flex-none place-items-center rounded-lg bg-good-soft text-good">
                <Icon name="check" size={14} />
              </div>
              <p className="text-[12px] leading-snug text-ink-2">
                Live transcript &amp; summary recording. Ready to attach to the record.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
