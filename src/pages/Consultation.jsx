import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Card, Avatar } from '../components/ui'
import { emr } from '../data/mock'

export default function Consultation() {
  const [tab, setTab] = useState(emr.tabs[0])

  return (
    <>
      <PageHead
        title="Consultation · New visit"
        sub={`${emr.patient.name} · ${emr.patient.id} · ${emr.patient.age} · ${emr.patient.gender} · Follow-up`}
      >
        <button className="btn">
          <Icon name="brain" size={15} /> Voice note
        </button>
        <button className="btn btn-primary">
          <Icon name="check" size={15} /> Save &amp; sign
        </button>
      </PageHead>

      {/* Tabs */}
      <div className="flex flex-wrap gap-0.5 rounded-t-xl border border-b-0 border-line bg-panel px-[15px]">
        {emr.tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`cursor-pointer border-b-2 px-3 py-2.5 text-[12px] font-semibold ${
              t === tab ? 'border-brand text-brand' : 'border-transparent text-ink-3'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card rounded-t-none">
        <div className="grid grid-cols-1 items-start gap-3.5 p-[15px] lg:grid-cols-[200px_1fr_210px]">
          {/* Patient sidebar */}
          <div className="flex flex-col gap-2.5">
            <div className="card !shadow-none">
              <div className="p-[15px] text-center">
                <div className="mx-auto mb-2 w-fit">
                  <Avatar initials={emr.patient.initials} gradient="from-[#4361ee] to-[#7c5cf0]" size={56} />
                </div>
                <div className="text-[14px] font-bold">{emr.patient.name}</div>
                <div className="text-[11.5px] text-ink-3">
                  {emr.patient.id} · {emr.patient.age}y · {emr.patient.gender}
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  <span className="rounded-full border border-crit-soft bg-crit-soft px-2.5 py-1 text-[11px] font-semibold text-crit">
                    {emr.patient.allergy}
                  </span>
                  <span className="chip">{emr.patient.bloodGroup}</span>
                </div>
              </div>
            </div>
            <div className="card !shadow-none">
              <div className="px-[13px] pb-2.5 pt-3 text-[13px] font-bold">Recent visits</div>
              {emr.recentVisits.map((v) => (
                <div key={v.date} className="border-t border-line px-[13px] py-2">
                  <div className="text-[12.5px] font-semibold">{v.date}</div>
                  <div className="text-[11px] text-ink-3">{v.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2.5">
            <Field label="Chief complaint">
              <textarea rows={2} className="field-input" defaultValue={emr.complaint} />
            </Field>
            <Field label="History of present illness">
              <textarea rows={3} className="field-input" defaultValue={emr.hpi} />
            </Field>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Field label="Diagnosis">
                <input className="field-input" defaultValue={emr.diagnosis} />
              </Field>
              <Field label="Advice">
                <input className="field-input" defaultValue={emr.advice} />
              </Field>
            </div>
            <div className="flex gap-2.5 rounded-[11px] border border-violet-soft bg-violet-soft p-2.5">
              <div className="grid h-[27px] w-[27px] flex-none place-items-center rounded-lg bg-violet text-white">
                <Icon name="brain" size={14} />
              </div>
              <p className="text-[12px] leading-snug text-ink-2">
                <b className="font-semibold text-ink">Copilot:</b> {emr.copilot}
              </p>
            </div>
          </div>

          {/* Vitals */}
          <div className="flex flex-col gap-2.5">
            <div className="card !shadow-none">
              <div className="px-[15px] pb-1.5 pt-3 text-[13px] font-bold">Vitals</div>
              <div className="grid grid-cols-2 gap-2 px-[15px] pb-[15px]">
                {emr.vitals.map((v) => (
                  <div key={v.label} className="rounded-[10px] border border-line-2 bg-panel-2 px-2.5 py-2.5">
                    <div className="num text-[16px] font-bold">
                      {v.value}
                      {v.unit && <span className="text-[9px]">{v.unit}</span>}
                    </div>
                    <div className="text-[10px] font-semibold text-ink-3">{v.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-semibold text-ink-2">{label}</span>
      {children}
    </label>
  )
}
