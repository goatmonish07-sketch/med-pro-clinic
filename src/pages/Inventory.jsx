import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented, Table, StatusBadge } from '../components/ui'
import { inventoryStats, inventory } from '../data/mock'

export default function Inventory() {
  const [filter, setFilter] = useState('All')
  const rows = inventory.filter(
    (i) =>
      filter === 'All' ||
      (filter === 'Low' && (i.label === 'Low' || i.label === 'Out')) ||
      (filter === 'Expiring' && i.label === 'Expiring')
  )
  return (
    <>
      <PageHead title="Inventory" sub="642 SKUs · 3 low-stock · 5 expiring soon">
        <button className="btn">Purchase orders</button>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> Add item
        </button>
      </PageHead>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {inventoryStats.map((s) => (
          <Kpi key={s.key} {...s} />
        ))}
      </div>

      <Card title="Stock items" action={<Segmented options={['All', 'Low', 'Expiring']} value={filter} onChange={setFilter} />}>
        <Table head={['Item', 'Category', 'Batch', 'Stock', 'Reorder', 'Expiry', 'Supplier', 'Status']}>
          {rows.map((it) => (
            <tr key={it.batch} className="border-b border-line last:border-0 hover:bg-panel-2">
              <td className="whitespace-nowrap px-[15px] py-[11px]">
                <strong className="font-semibold text-ink">{it.item}</strong>
              </td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{it.cat}</td>
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{it.batch}</td>
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{it.stock}</td>
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{it.reorder}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{it.expiry}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{it.supplier}</td>
              <td className="px-[15px] py-[11px]">
                <StatusBadge tone={it.status}>{it.label}</StatusBadge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
