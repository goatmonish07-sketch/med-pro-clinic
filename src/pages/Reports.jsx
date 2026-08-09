import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHead, Kpi, Card, Segmented } from '../components/ui'
import Donut from '../components/Donut'
import LineChart from '../components/LineChart'
import { reportStats, monthlyRevenue, reportMonths, departmentSplit, topDoctors } from '../data/mock'

export default function Reports() {
  const [range, setRange] = useState('Month')
  return (
    <>
      <PageHead title="Reports & analytics" sub="This month · ₹1,87,000 revenue · 320 new patients">
        <Segmented options={['Week', 'Month', 'Year']} value={range} onChange={setRange} />
        <button className="btn btn-primary">
          <Icon name="send" size={15} /> Export
        </button>
      </PageHead>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {reportStats.map((s) => (
          <Kpi key={s.key} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Revenue trend" action={<span className="chip">Monthly</span>}>
          <LineChart
            series={monthlyRevenue}
            labels={reportMonths}
            color="var(--violet)"
            id="rep"
            ariaLabel="Monthly revenue trend, rising from March to August"
          />
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card title="Revenue by department">
            <div className="grid grid-cols-[120px_1fr] items-center gap-3.5 px-[15px] pb-3.5 pt-0.5 max-[420px]:grid-cols-1 max-[420px]:justify-items-center">
              <Donut segments={departmentSplit} center="₹1.87L" sub="this month" />
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
              {topDoctors.map((d) => (
                <div key={d.name}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span>{d.name}</span>
                    <strong className="num">₹{d.value.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="h-[7px] overflow-hidden rounded-full bg-panel-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2"
                      style={{ width: `${d.pct}%` }}
                    />
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
