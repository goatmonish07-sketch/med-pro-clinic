import { useState } from 'react'
import { PageHead, Card, Table, Avatar, StatusBadge } from '../components/ui'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApi'
import { mapUser } from '../lib/adapters'
import { settingsNav, automationSettings, users as mockUsers } from '../data/mock'

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-[22px] w-[38px] flex-none rounded-full transition-colors ${on ? 'bg-brand' : 'bg-line-2'}`}
    >
      <span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const [active, setActive] = useState('Reminders & automation')
  const [toggles, setToggles] = useState(automationSettings.map((s) => s.on))
  const { data: users } = useApiData(() => api.listUsers().then((r) => r.data.map(mapUser)), mockUsers, [])

  return (
    <>
      <PageHead title="Settings" sub="Clinic profile, users, roles & automation" />

      <div className="grid grid-cols-1 items-start gap-3.5 md:grid-cols-[200px_1fr]">
        {/* Settings nav */}
        <Card>
          <div className="flex flex-col gap-0.5 p-[15px]">
            {settingsNav.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`rounded-[9px] px-3 py-2.5 text-left text-[12.5px] ${
                  active === s ? 'bg-brand-soft font-semibold text-brand' : 'font-medium text-ink-2 hover:bg-panel-2'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-3.5">
          {/* Automation */}
          <Card title="Reminders & automation">
            {automationSettings.map((s, i) => (
              <div key={s.title} className="flex items-center justify-between gap-3 border-t border-line px-[15px] py-3">
                <div>
                  <div className="text-[12.5px] font-semibold">{s.title}</div>
                  <div className="text-[11px] text-ink-3">{s.desc}</div>
                </div>
                <Toggle on={toggles[i]} onClick={() => setToggles((t) => t.map((v, j) => (j === i ? !v : v)))} />
              </div>
            ))}
          </Card>

          {/* Users & roles */}
          <Card title="Users & roles" action={<button className="btn btn-primary !px-2.5 !py-1.5 !text-[11.5px]">+ Invite user</button>}>
            <Table head={['User', 'Role', 'Branch', 'Status']}>
              {users.map((u) => (
                <tr key={u.name} className="border-b border-line last:border-0">
                  <td className="px-[15px] py-[11px]">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={u.initials} gradient={u.grad} />
                      <strong className="font-semibold text-ink">{u.name}</strong>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{u.role}</td>
                  <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{u.branch}</td>
                  <td className="px-[15px] py-[11px]">
                    <StatusBadge tone={u.status}>{u.label}</StatusBadge>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      </div>
    </>
  )
}
