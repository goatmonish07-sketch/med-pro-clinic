import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented } from '../components/ui'
import Donut from '../components/Donut'
import LineChart from '../components/LineChart'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApi'
import { inr0 } from '../lib/adapters'
import { monthlyRevenue, reportMonths, departmentSplit, topDoctors as mockDoctors } from '../data/mock'

// Turn { 'YYYY-MM': amount } into chart series (last 6 months).
function seriesFrom(byMonth) {
  const keys = Object.keys(byMonth || {}).sort().slice(-6)
  return {
    series: keys.map((k) => Number(byMonth[k]) / 100000),
    labels: keys.map((k) => new Date(k + '-01').toLocaleDateString('en-GB', { month: 'short' })),
  }
}

export default function Reports() {
  const [range, setRange] = useState('Month')

  const { data } = useApiData(() => api.analytics(), null, [])

  // KPI tiles
  const stats = data?.totals
    ? [
        { key: 'rev', label: 'Total revenue', value: inr0(data.totals.revenue), accent: 'good' },
        { key: 'new', label: 'New patients', value: String(data.totals.newPatients), accent: 'brand' },
        { key: 'con', label: 'Consultations', value: String(data.totals.consultations), accent: 'cyan' },
      ]
    : [
        { key: 'rev', label: 'Total revenue', value: '₹1.87L', delta: '▲ 10%', dir: 'up', accent: 'good' },
        { key: 'new', label: 'New patients', value: '320', delta: '▲ 15%', dir: 'up', accent: 'brand' },
        { key: 'con', label: 'Consultations', value: '845', delta: '▲ 8%', dir: 'up', accent: 'cyan' },
      ]

  // Revenue trend — live only if it has ≥2 months, else the mock series.
  const liveSeries = data?.revenueByMonth ? seriesFrom(data.revenueByMonth) : null
  const chart = liveSeries && liveSeries.series.length >= 2 ? liveSeries : { series: monthlyRevenue, labels: reportMonths }

  // Top doctors — live by consultation count if any, else mock by revenue.
  const liveTop = (data?.topDoctors || []).filter((d) => d.consultations > 0)
  const doctors =
    liveTop.length > 0
      ? (() => {
          const max = Math.max(...liveTop.map((d) => d.consultations))
          return liveTop.map((d) => ({ name: d.name, value: `${d.consultations} consults`, pct: Math.round((d.consultations / max) * 100) }))
        })()
      : mockDoctors.map((d) => ({ name: d.name, value: `₹${d.value.toLocaleString('en-IN')}`, pct: d.pct }))

  return (
    <>
      <PageHead title="Reports & analytics" sub="Revenue, patients and doctor performance">
        <Segmented options={['Week', 'Month', 'Year']} value={range} onChange={setRange} />
        <button className="btn btn-primary">
          <Icon name="send" size={15} /> Export
        </button>
      </PageHead>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {stats.map((s) => (
          <Kpi key={s.key} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Revenue trend" action={<span className="chip">Monthly</span>}>
          <LineChart series={chart.series} labels={chart.labels} color="var(--violet)" id="rep" ariaLabel="Monthly revenue trend" />
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card title="Revenue by department">
            <div className="grid grid-cols-[120px_1fr] items-center gap-3.5 px-[15px] pb-3.5 pt-0.5 max-[420px]:grid-cols-1 max-[420px]:justify-items-center">
              <Donut segments={departmentSplit} center={stats[0].value} sub="this month" />
              <div className="flex w-full flex-col gap-2">
                {departmentSplit.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-[11.5px]">
                    <i className="h-[9px] w-[9px] rounded-[3px]" style={{ background: d.color }} />
                    <span className="text-ink-2">{d.name}</span>
                    <span className="num ml-auto font-bold">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Top doctors">
            <div className="flex flex-col gap-2.5 p-[15px]">
              {doctors.map((d) => (
                <div key={d.name}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span>{d.name}</span>
                    <strong className="num">{d.value}</strong>
                  </div>
                  <div className="h-[7px] overflow-hidden rounded-full bg-panel-3">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
