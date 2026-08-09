import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented, Table, StatusBadge } from '../components/ui'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApi'
import { mapLab } from '../lib/adapters'
import { labStats, labOrders as mockLab } from '../data/mock'

export default function Laboratory() {
  const [filter, setFilter] = useState('All')

  const demo = mockLab.filter(
    (o) => filter === 'All' || (filter === 'Ready' && o.label === 'Ready') || (filter === 'Pending' && o.label !== 'Ready')
  )
  const status = filter === 'Ready' ? 'READY' : filter === 'Pending' ? 'PROCESSING' : 'All'
  const { data } = useApiData(() => api.listLab({ status }).then((r) => r.data.map(mapLab)), demo, [filter])

  return (
    <>
      <PageHead title="Laboratory" sub="Test orders · sample tracking · result delivery">
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> New order
        </button>
      </PageHead>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {labStats.map((s) => (
          <Kpi key={s.key} {...s} />
        ))}
      </div>

      <Card title="Test orders" action={<Segmented options={['All', 'Pending', 'Ready']} value={filter} onChange={setFilter} />}>
        <Table head={['Order', 'Patient', 'Test', 'Sample', 'Ordered by', 'Status']}>
          {data.map((o) => (
            <tr key={o.id} className="border-b border-line last:border-0 hover:bg-panel-2">
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{o.id}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{o.patient}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{o.test}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{o.sample}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{o.by}</td>
              <td className="px-[15px] py-[11px]">
                <StatusBadge tone={o.status}>{o.label}</StatusBadge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
