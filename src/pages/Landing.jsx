import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import useTheme from '../lib/useTheme'

const features = [
  { icon: 'brain', tone: 'violet', title: 'AI Clinical Copilot', desc: 'Voice-to-notes, drug-interaction & allergy alerts, and instant history summaries.' },
  { icon: 'video', tone: 'cyan', title: 'Tele-consultation', desc: 'In-app video visits with e-prescription and payment — care beyond the clinic walls.' },
  { icon: 'calendar', tone: 'brand', title: 'Online booking', desc: 'A public site with real-time self-scheduling that flows straight into your calendar.' },
  { icon: 'queue', tone: 'warn', title: 'Live queue', desc: 'Token board, average-wait analytics, and “you’re next” SMS nudges.' },
  { icon: 'billing', tone: 'good', title: 'GST billing & payments', desc: 'Itemized invoices, UPI/card/cash, insurance claims, and reconciliation.' },
  { icon: 'reports', tone: 'brand', title: 'Insights & forecasting', desc: 'Revenue, occupancy, doctor productivity, and no-show prediction.' },
]
const toneClass = {
  violet: 'bg-violet-soft text-violet',
  cyan: 'bg-cyan-soft text-cyan',
  brand: 'bg-brand-soft text-brand',
  warn: 'bg-warn-soft text-warn',
  good: 'bg-good-soft text-good',
}
const modules = ['Patients CRM', 'Appointments', 'Queue', 'Consultation / EMR', 'Prescriptions', 'Laboratory', 'Pharmacy', 'Billing', 'Payments', 'Inventory', 'Reports', 'Tele-consult', 'Website (CMS)', 'Settings & RBAC']
const kpis = [
  { label: 'Appointments', value: '32', accent: 'brand' },
  { label: 'Revenue today', value: '₹45.2k', accent: 'good' },
  { label: 'Waiting', value: '6', accent: 'warn' },
  { label: 'Consults', value: '24', accent: 'cyan' },
]

export default function Landing() {
  const { toggle } = useTheme()
  return (
    <div className="min-h-dvh bg-bg text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-line bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#4361ee] to-[#0ea5a0] text-white">
              <Icon name="logo" size={19} strokeWidth={2.3} />
            </div>
            <div className="leading-tight">
              <b className="block text-[15px] font-extrabold tracking-tight">MED-PRO</b>
              <span className="text-[9.5px] uppercase tracking-[0.13em] text-ink-3">Clinic OS</span>
            </div>
          </div>
          <nav className="ml-auto hidden items-center gap-6 text-[13px] font-medium text-ink-2 md:flex">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#modules" className="hover:text-ink">Modules</a>
            <a href="#why" className="hover:text-ink">Why MED-PRO</a>
          </nav>
          <button onClick={toggle} aria-label="Toggle theme" className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] border border-line-2 bg-panel text-ink-2 hover:bg-panel-2 md:ml-3">
            <Icon name="moon" size={17} />
          </button>
          <Link to="/app" className="btn btn-primary !py-2">Open app</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 420px at 15% -10%, color-mix(in srgb, var(--brand) 20%, transparent), transparent 60%), radial-gradient(700px 380px at 100% 0%, color-mix(in srgb, var(--cyan) 16%, transparent), transparent 55%)',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-panel px-3 py-1.5 text-[12px] font-semibold text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-good" /> Advanced clinic CRM + CMS
            </span>
            <h1 className="mt-4 text-[clamp(30px,7vw,52px)] font-extrabold leading-[1.05] tracking-tight text-balance">
              Run your entire clinic from one screen.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">
              Patients, appointments, EMR, billing, pharmacy, lab, tele-consult, and an AI clinical
              copilot — a modern platform built to help your clinic compete and grow.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/app" className="btn btn-primary !px-5 !py-3 !text-[14px]">
                Open the app →
              </Link>
              <a href="#features" className="btn !px-5 !py-3 !text-[14px]">See features</a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-3">
              <span className="flex items-center gap-1.5"><Icon name="check" size={15} className="text-good" /> 16 modules</span>
              <span className="flex items-center gap-1.5"><Icon name="check" size={15} className="text-good" /> Light &amp; dark</span>
              <span className="flex items-center gap-1.5"><Icon name="check" size={15} className="text-good" /> Mobile-ready</span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div className="rounded-2xl border border-line bg-panel p-3 shadow-card">
              <div className="mb-3 flex items-center gap-1.5 px-1">
                <span className="h-2.5 w-2.5 rounded-full bg-crit/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-good/70" />
                <span className="ml-2 text-[11px] text-ink-3">med-pro-clinic.pages.dev</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {kpis.map((k) => (
                  <div key={k.label} className={`relative overflow-hidden rounded-xl border border-line bg-panel-2 p-3 before:absolute before:inset-y-0 before:left-0 before:w-[3px] ${toneClass[k.accent].split(' ')[0].replace('bg-', 'before:bg-').replace('-soft', '')}`}>
                    <div className="text-[9.5px] font-semibold uppercase tracking-wide text-ink-3">{k.label}</div>
                    <div className="num mt-1 text-[19px] font-extrabold">{k.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 rounded-xl border border-line bg-panel-2 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] font-bold">Revenue &amp; footfall</span>
                  <span className="text-[10px] text-ink-3">This week</span>
                </div>
                <svg viewBox="0 0 320 90" preserveAspectRatio="none" className="h-[90px] w-full">
                  <defs>
                    <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="var(--brand)" stopOpacity="0.3" />
                      <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 70 C40 62 60 66 100 52 C140 38 160 48 200 34 C240 22 270 28 320 14 L320 90 L0 90 Z" fill="url(#lg)" />
                  <path d="M0 70 C40 62 60 66 100 52 C140 38 160 48 200 34 C240 22 270 28 320 14" fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="mt-2.5 rounded-xl bg-gradient-to-br from-[#0f9d94] to-[#12b3a3] p-3 text-white">
                <div className="text-[9px] font-bold uppercase tracking-widest opacity-90">Now serving</div>
                <div className="num text-[20px] font-extrabold">Token #024</div>
                <div className="text-[11px] opacity-90">Roni Kumar · Room 02</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-cyan">Built to compete</p>
          <h2 className="mt-1.5 text-[clamp(24px,4vw,34px)] font-extrabold tracking-tight text-balance">Everything a modern clinic needs</h2>
          <p className="mt-2 text-[14px] text-ink-2">The everyday workflow plus the advanced features buyers now expect.</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-panel p-5 shadow-card-sm transition-transform hover:-translate-y-0.5">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${toneClass[f.tone]}`}>
                <Icon name={f.icon} size={21} />
              </div>
              <h3 className="mt-3.5 text-[16px] font-bold tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section id="why" className="border-y border-line bg-panel-2">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            ['16', 'Modules, one login'],
            ['3', 'Ways to run: web · PWA · mobile'],
            ['100%', 'On Cloudflare — Pages + Worker/D1'],
            ['AA', 'Accessible, light & dark'],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="num text-[clamp(26px,5vw,38px)] font-extrabold tracking-tight text-brand">{n}</div>
              <div className="mt-1 text-[12.5px] text-ink-2">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-cyan">The full suite</p>
          <h2 className="mt-1.5 text-[clamp(24px,4vw,34px)] font-extrabold tracking-tight">One platform, every workflow</h2>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {modules.map((m) => (
            <span key={m} className="rounded-full border border-line-2 bg-panel px-4 py-2 text-[13px] font-medium text-ink-2">{m}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#101a3a] to-[#1c2a5c] px-6 py-12 text-center text-white sm:px-10">
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(600px 300px at 80% 0%, rgba(45,212,191,.25), transparent 60%)' }} />
          <div className="relative">
            <h2 className="text-[clamp(24px,4.5vw,36px)] font-extrabold tracking-tight text-balance">Ready to run your clinic smarter?</h2>
            <p className="mx-auto mt-2 max-w-lg text-[14px] text-[#c4cdf0]">Open the app now — explore all 16 modules with demo data, in light or dark.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/app" className="rounded-[11px] bg-white px-6 py-3 text-[14px] font-bold text-[#101a3a] hover:opacity-90">Open the app</Link>
              <a href="#features" className="rounded-[11px] border border-white/30 px-6 py-3 text-[14px] font-semibold text-white hover:bg-white/10">Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-[12.5px] text-ink-3 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-[#4361ee] to-[#0ea5a0] text-white"><Icon name="logo" size={13} strokeWidth={2.4} /></div>
            <span>MED-PRO Clinic OS</span>
          </div>
          <span>Advanced clinic CRM / CMS · built to compete</span>
        </div>
      </footer>
    </div>
  )
}
