import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented, Table, Avatar } from '../components/ui'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApi'
import { mapPatient, gradientFor } from '../lib/adapters'
import { patients as mockPatients, patientStats, patientFilters } from '../data/mock'

export default function Patients() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  // Demo fallback — client-filter the mock the same way, in the live shape.
  const demoRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mockPatients.filter((p) => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q)
      const matchF =
        filter === 'All' ||
        (filter === 'New' && p.tag === 'New') ||
        (filter === 'Due' && p.due > 0) ||
        (filter === 'Follow-up' && p.lastVisit !== '—')
      return matchQ && matchF
    })
  }, [filter, query])

  const { data } = useApiData(
    () =>
      api
        .listPatients({ search: query, filter, page: 1, pageSize: 50 })
        .then((r) => ({ rows: r.data.map(mapPatient), total: r.total })),
    { rows: demoRows, total: demoRows.length },
    [query, filter]
  )
  const rows = data.rows
  const total = data.total

  return (
    <>
      <PageHead title="Patients" sub={`${total} shown · search, filter and tags`}>
        <button className="btn">
          <Icon name="reports" size={15} /> Filter
        </button>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> New patient
        </button>
      </PageHead>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {patientStats.map((s) => (
          <Kpi key={s.key} {...s} />
        ))}
      </div>

      <Card title="All patients" action={<Segmented options={patientFilters} value={filter} onChange={setFilter} />}>
        <div className="px-[15px] pb-2.5">
          <label className="flex max-w-sm items-center gap-2.5 rounded-[10px] border border-line-2 bg-panel-2 px-3 py-2 text-ink-3 focus-within:border-transparent focus-within:shadow-glow">
            <Icon name="search" size={15} className="flex-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-3"
              placeholder="Search name, ID or phone…"
              aria-label="Search patients"
            />
          </label>
        </div>

        <Table head={['Patient', 'ID', 'Age / Gender', 'Phone', 'Doctor', 'Last visit', 'Due', 'Tags']}>
          {rows.map((p) => (
            <tr
              key={p.id}
              onClick={() => navigate('/app/consultation')}
              className="cursor-pointer border-b border-line last:border-0 hover:bg-panel-2"
            >
              <td className="px-[15px] py-[11px]">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={p.initials} gradient={gradientFor(p.name)} />
                  <strong className="font-semibold text-ink">{p.name}</strong>
                </div>
              </td>
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{p.id}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">
                {p.age} · {p.gender}
              </td>
              <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{p.phone}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{p.doctor}</td>
              <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{p.lastVisit}</td>
              <td className="num whitespace-nowrap px-[15px] py-[11px]">
                {p.due > 0 ? (
                  <span className="font-semibold text-crit">₹{p.due.toLocaleString('en-IN')}</span>
                ) : (
                  <span className="text-ink-2">₹0</span>
                )}
              </td>
              <td className="whitespace-nowrap px-[15px] py-[11px]">
                <span className="chip">{p.tag}</span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-[15px] py-10 text-center text-[12.5px] text-ink-3">
                No patients match your search.
              </td>
            </tr>
          )}
        </Table>

        <div className="flex items-center justify-between px-[15px] py-[11px] text-[11.5px] text-ink-3">
          <span>Showing {rows.length} of {total}</span>
          <div className="flex gap-2">
            <button className="btn !px-2.5 !py-1.5 !text-[11.5px]">‹ Prev</button>
            <button className="btn !px-2.5 !py-1.5 !text-[11.5px]">Next ›</button>
          </div>
        </div>
      </Card>
    </>
  )
}
