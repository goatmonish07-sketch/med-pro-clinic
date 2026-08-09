import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented, Table, StatusBadge } from '../components/ui'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApi'
import { mapInventory, inr0 } from '../lib/adapters'
import { inventoryStats as mockStats, inventory as mockInv } from '../data/mock'

export default function Inventory() {
  const [filter, setFilter] = useState('All')

  const demo = {
    data: mockInv.filter(
      (i) =>
        filter === 'All' ||
        (filter === 'Low' && (i.label === 'Low' || i.label === 'Out')) ||
        (filter === 'Expiring' && i.label === 'Expiring')
    ),
    stats: null,
  }
  const { data } = useApiData(
    () => api.listInventory({ filter }).then((r) => ({ data: r.data.map(mapInventory), stats: r.stats })),
    demo,
    [filter]
  )

  const stats = data.stats
    ? [
        { key: 'sku', label: 'Total SKUs', value: String(data.stats.totalSkus), accent: 'brand' },
        { key: 'low', label: 'Low stock', value: String(data.stats.lowStock), accent: 'warn' },
        { key: 'exp', label: 'Expiring <60d', value: String(data.stats.expiringSoon), accent: 'violet' },
        { key: 'val', label: 'Stock value', value: inr0(data.stats.stockValue), accent: 'good' },
      ]
    : mockStats

  return (
    <>
      <PageHead title="Inventory" sub="Stock, reorder levels, batches and expiry">
        <button className="btn">Purchase orders</button>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> Add item
        </button>
      </PageHead>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {stats.map((s) => (
          <Kpi key={s.key} {...s} />
        ))}
      </div>

      <Card title="Stock items" action={<Segmented options={['All', 'Low', 'Expiring']} value={filter} onChange={setFilter} />}>
        <Table head={['Item', 'Category', 'Batch', 'Stock', 'Reorder', 'Expiry', 'Supplier', 'Status']}>
          {data.data.map((it) => (
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
