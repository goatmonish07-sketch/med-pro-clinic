import Icon from '../components/Icon'
import { PageHead, Card, Table, StatusBadge } from '../components/ui'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApi'
import { mapQueue } from '../lib/adapters'
import { queue as mockServing, queueList } from '../data/mock'

const statusTone = { called: 'cyan', wait: 'warn', over: 'crit', done: 'good' }

// Average waited-minutes from the "12m" style strings.
function avgWait(rows) {
  const mins = rows.map((r) => parseInt(r.waited, 10)).filter((n) => !Number.isNaN(n))
  if (!mins.length) return '—'
  return Math.round(mins.reduce((a, b) => a + b, 0) / mins.length) + 'm'
}

export default function Queue() {
  const demo = {
    serving: { token: mockServing.serving.token, name: mockServing.serving.name, detail: mockServing.serving.detail },
    rows: queueList,
    stats: { servedToday: 18 },
  }

  const { data } = useApiData(() => api.getQueue().then(mapQueue), demo, [])
  const { serving, rows, stats } = data

  const tiles = [
    { label: 'Avg wait', value: avgWait(rows) },
    { label: 'In queue', value: rows.filter((r) => ['wait', 'called', 'over'].includes(r.status)).length },
    { label: 'Served today', value: stats?.servedToday ?? 18 },
    { label: 'Waiting', value: rows.filter((r) => r.status === 'wait').length },
  ]

  return (
    <>
      <PageHead title="Queue management" live="Live" sub={`${tiles[1].value} in queue · avg wait ${tiles[0].value} · 2 rooms active`}>
        <button className="btn">
          <Icon name="dashboard" size={15} /> Waiting-room display
        </button>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} /> New token
        </button>
      </PageHead>

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1fr_1.6fr]">
        <Card>
          <div className="relative m-[15px] mt-[15px] overflow-hidden rounded-[13px] bg-gradient-to-br from-[#0f9d94] to-[#12b3a3] p-[15px] text-white after:absolute after:-right-7 after:-top-7 after:h-[120px] after:w-[120px] after:rounded-full after:bg-white/[.12] after:content-['']">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-90">Now serving</div>
            <div className="num my-[2px] text-[27px] font-extrabold tracking-tight">Token {serving.token}</div>
            <div className="text-[12px] opacity-95">
              {serving.name} · {serving.detail}
            </div>
            <button className="mt-3 w-full rounded-[10px] border border-white/[.28] bg-white/[.18] py-2.5 text-[12.5px] font-semibold text-white">
              Call next patient →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 px-[15px] pb-[15px]">
            {tiles.map((s) => (
              <div key={s.label} className="rounded-[10px] border border-line-2 bg-panel-2 px-2.5 py-2.5">
                <div className="num text-[16px] font-bold">{s.value}</div>
                <div className="text-[10px] font-semibold text-ink-3">{s.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Waiting list" action={<span className="chip">All doctors</span>}>
          <Table head={['Token', 'Patient', 'Type', 'Doctor', 'Waited', 'Status']}>
            {rows.map((q) => (
              <tr key={q.token} className="border-b border-line last:border-0">
                <td className="num px-[15px] py-[11px]">
                  <strong className="font-semibold text-ink">{q.token}</strong>
                </td>
                <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{q.name}</td>
                <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{q.type}</td>
                <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{q.doctor}</td>
                <td className="num whitespace-nowrap px-[15px] py-[11px] text-ink-2">{q.waited}</td>
                <td className="px-[15px] py-[11px]">
                  <StatusBadge tone={statusTone[q.status]}>{q.label}</StatusBadge>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-[15px] py-10 text-center text-[12.5px] text-ink-3">
                  Queue is empty.
                </td>
              </tr>
            )}
          </Table>
        </Card>
      </div>
    </>
  )
}
