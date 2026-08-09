import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented, Table, StatusBadge } from '../components/ui'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApi'
import { mapPayment, inr0 } from '../lib/adapters'
import { paymentStats as mockStats, payments as mockPayments } from '../data/mock'

export default function Payments() {
  const [filter, setFilter] = useState('All')

  const demo = {
    data: mockPayments.filter(
      (p) => filter === 'All' || (filter === 'Paid' && p.label === 'Paid') || (filter === 'Pending' && p.label === 'Pending')
    ),
    byMethod: null,
  }
  const { data } = useApiData(
    () => api.listPayments({ filter }).then((r) => ({ data: r.data.map(mapPayment), byMethod: r.byMethod })),
    demo,
    [filter]
  )

  // KPI tiles: live from byMethod totals, else the mock tiles.
  const stats = data.byMethod
    ? [
        { key: 'coll', label: 'Collected', value: inr0(Object.values(data.byMethod).reduce((a, b) => a + b, 0)), accent: 'good' },
        { key: 'upi', label: 'UPI', value: inr0(data.byMethod.UPI || 0), accent: 'brand' },
        { key: 'card', label: 'Card', value: inr0(data.byMethod.CARD || 0), accent: 'cyan' },
        { key: 'cash', label: 'Cash', value: inr0(data.byMethod.CASH || 0), accent: 'warn' },
      ]
    : mockStats

  return (
    <>
      <PageHead title="Payments" sub="Collections by UPI, card & cash · transactions">
        <button className="btn">Reconcile</button>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> Record payment
        </button>
      </PageHead>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {stats.map((s) => (
          <Kpi key={s.key} {...s} />
        ))}
      </div>

      <Card title="Recent transactions" action={<Segmented options={['All', 'Paid', 'Pending', 'Refunds']} value={filter} onChange={setFilter} />}>
        <Table head={['Txn', 'Patient', 'Invoice', 'Method', 'Amount', 'Status', 'Time']}>
          {data.data.map((p) => (
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
