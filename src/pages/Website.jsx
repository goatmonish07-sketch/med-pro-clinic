import Icon from '../components/Icon'
import { PageHead, Card } from '../components/ui'
import { siteServices, clinic } from '../data/mock'

export default function Website() {
  return (
    <>
      <PageHead title="Website (CMS)" sub="medproclinic.com · published · online booking on">
        <button className="btn">
          <Icon name="globe" size={15} /> Preview
        </button>
        <button className="btn btn-primary">
          <Icon name="send" size={15} /> Publish
        </button>
      </PageHead>

      <Card className="relative">
        <span className="absolute right-2 top-2 z-10 rounded-full bg-violet-soft px-2.5 py-0.5 text-[9.5px] font-bold text-violet">
          Live editor
        </span>
        <div className="p-[15px]">
          {/* Site preview */}
          <div className="overflow-hidden rounded-xl border border-line-2">
            <div className="bg-gradient-to-br from-[#101a3a] to-[#1c2a5c] px-[22px] py-[26px] text-white">
              <div className="mb-5 flex flex-wrap items-center gap-4 text-[11px] text-[#c4cdf0]">
                <b className="mr-auto text-[13px] text-white">{clinic.name}</b>
                <span>Home</span>
                <span>Services</span>
                <span>Doctors</span>
                <span>Contact</span>
                <span className="rounded-[7px] bg-white/[.15] px-2.5 py-[3px] text-white">Book now</span>
              </div>
              <h3 className="mb-2 max-w-[22ch] text-[22px] font-bold tracking-tight">
                Expert care for your family, all under one roof.
              </h3>
              <p className="mb-4 max-w-[44ch] text-[12.5px] text-[#c4cdf0]">
                Book appointments online, consult by video, and access your records anytime.
              </p>
              <div className="flex gap-2">
                <span className="rounded-[9px] bg-white px-3.5 py-2 text-[12px] font-bold text-[#101a3a]">Book appointment</span>
                <span className="rounded-[9px] border border-white/35 px-3.5 py-2 text-[12px] font-semibold text-white">Video consult</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 bg-panel p-[18px] sm:grid-cols-3">
              {siteServices.map((s) => (
                <div key={s.title} className="rounded-xl border border-line p-3.5">
                  <div className="mb-2 grid h-8 w-8 place-items-center rounded-[9px] bg-brand-soft text-brand">
                    <Icon name={s.icon} size={17} />
                  </div>
                  <b className="text-[12.5px]">{s.title}</b>
                  <p className="mt-0.5 text-[11px] text-ink-3">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Editor fields */}
          <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-semibold text-ink-2">Hero headline</span>
              <input className="field-input" defaultValue="Expert care for your family, all under one roof." />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-semibold text-ink-2">Booking button link</span>
              <input className="field-input" defaultValue="/book · opens real-time scheduler" />
            </label>
          </div>
        </div>
      </Card>
    </>
  )
}
