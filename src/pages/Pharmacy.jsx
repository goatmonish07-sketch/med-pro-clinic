import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHead, Card, Table, StatusBadge } from '../components/ui'
import { pharmacyDispense } from '../data/mock'

const toneMap = { crit: 'bg-crit-soft text-crit', warn: 'bg-warn-soft text-warn', brand: 'bg-brand-soft text-brand' }

export default function Pharmacy() {
  const navigate = useNavigate()
  const d = pharmacyDispense
  return (
    <>
      <PageHead title="Pharmacy" sub="Dispensing · ₹18,760 sales today · 3 low-stock alerts">
        <button className="btn">Dispense queue</button>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> New sale
        </button>
      </PageHead>

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.6fr_1fr]">
        <Card title={`Dispense · ${d.patient}`} action={<span className="chip">{d.rx}</span>}>
          <Table head={['Item', 'Batch', 'Qty', 'Rate', 'Amount', 'Stock']}>
            {d.items.map((it) => (
              <tr key={it.item} className="border-b border-line last:border-0">
                <td className="whitespace-nowrap px-[15px] py-[11px]">
                  <strong className="font-semibold text-ink">{it.item}</strong>
                </td>
                <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{it.batch}</td>
                <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{it.qty}</td>
                <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">₹{it.rate}</td>
                <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">₹{it.amount}</td>
                <td className="px-[15px] py-[11px]">
                  <StatusBadge tone={it.stockTone}>{it.stock}</StatusBadge>
                </td>
              </tr>
            ))}
          </Table>
          <div className="flex items-center justify-between border-t border-line px-[15px] py-3 text-[14px] font-bold">
            <span>Total</span>
            <span className="num">₹{d.total.toFixed(2)}</span>
          </div>
        </Card>

        <Card
          title="Stock alerts"
          icon="box"
          action={
            <button className="text-[11.5px] font-semibold text-brand" onClick={() => navigate('/inventory')}>
              Inventory →
            </button>
          }
        >
          {d.alerts.map((a, i) => (
            <div key={i} className="flex gap-2.5 border-t border-line px-[15px] py-2.5">
              <div className={`grid h-[27px] w-[27px] flex-none place-items-center rounded-lg ${toneMap[a.tone]}`}>
                <Icon name={a.icon} size={14} />
              </div>
              <p className="text-[12px] leading-snug text-ink-2">{a.text}</p>
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}
