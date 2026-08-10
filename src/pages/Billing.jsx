import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHead, Card } from '../components/ui'
import { invoice, clinic } from '../data/mock'

const inr = (n) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Billing() {
  const navigate = useNavigate()
  const v = invoice
  return (
    <>
      <PageHead title="Billing & invoice" sub={`Invoice ${v.no} · ${v.patient} · ${v.date}`}>
        <button className="btn">
          <Icon name="reports" size={15} /> Print
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/app/payments')}>
          <Icon name="payments" size={15} /> Collect payment
        </button>
      </PageHead>

      <Card className="max-w-[560px]">
        <div className="p-[15px]">
          <div className="mb-3.5 flex items-start justify-between">
            <div>
              <div className="text-[15px] font-bold">{clinic.name}</div>
              <div className="text-[11.5px] text-ink-3">
                {v.address} · GSTIN {v.gstin}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">Invoice</div>
              <div className="num font-bold">{v.no}</div>
              <div className="text-[11.5px] text-ink-3">{v.date}</div>
            </div>
          </div>

          {v.lines.map((l) => (
            <div key={l.d} className="flex justify-between border-b border-line py-2.5 text-[12.5px]">
              <span className="text-ink-2">{l.d}</span>
              <span className="num font-semibold">{inr(l.a)}</span>
            </div>
          ))}

          <div className="flex justify-between border-b-0 py-2.5 text-[12.5px]">
            <span className="text-ink-2">Subtotal</span>
            <span className="num font-semibold">{inr(v.subtotal)}</span>
          </div>
          <div className="flex justify-between pb-2.5 text-[12.5px]">
            <span className="text-ink-2">GST (18%) · Discount (10%)</span>
            <span className="num font-semibold">{inr(v.taxAdj)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-line-2 py-2.5 text-[14px] font-extrabold text-brand">
            <span>Total due</span>
            <span className="num">{inr(v.total)}</span>
          </div>
        </div>
      </Card>
    </>
  )
}
