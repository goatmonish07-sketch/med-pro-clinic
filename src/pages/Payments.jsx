import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented, Table, StatusBadge } from '../components/ui'
import { paymentStats, payments } from '../data/mock'

export default function Payments() {
  const [filter, setFilter] = useState('All')
  const rows = payments.filter(
    (p) =>
      filter === 'All' ||
      (filter === 'Paid' && p.label === 'Paid') ||
      (filter === 'Pending' && p.label === 'Pending')
  )
  return (
    <>
      <PageHead title="Payments" sub="₹45,230 collected today · 4 pending · UPI, card & cash">
        <button className="btn">Reconcile</button>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> Record payment
        </button>
      </PageHead>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {paymentStats.map((s) => (
          <Kpi key={s.key} {...s} />
        ))}
      </div>

      <Card
        title="Recent transactions"
        action={<Segmented options={['All', 'Paid', 'Pending', 'Refunds']} value={filter} onChange={setFilter} />}
      >
        <Table head={['Txn', 'Patient', 'Invoice', 'Method', 'Amount', 'Status', 'Time']}>
          {rows.map((p) => (
            <tr key={p.txn} className="border-b border-line last:border-0 hover:bg-panel-2">
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{p.txn}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{p.patient}</td>
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{p.inv}</td>
              <td className="px-[15px] py-[11px]">
                <span className="chip">{p.method}</span>
              </td>
              <td className="num whitespace-nowrap px-[15px] py-[11px]">
                <strong className="font-semibold text-ink">₹{p.amount.toLocaleString('en-IN')}</strong>
              </td>
              <td className="px-[15px] py-[11px]">
                <StatusBadge tone={p.status}>{p.label}</StatusBadge>
              </td>
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{p.time}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
