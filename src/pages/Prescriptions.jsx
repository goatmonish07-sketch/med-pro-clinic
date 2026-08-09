import Icon from '../components/Icon'
import { PageHead, Card, Table } from '../components/ui'
import { prescription } from '../data/mock'

export default function Prescriptions() {
  const p = prescription
  return (
    <>
      <PageHead title="Prescription" sub={`${p.patient} · ${p.id} · ${p.doctor} · ${p.date}`}>
        <button className="btn">
          <Icon name="reports" size={15} /> Print
        </button>
        <button className="btn btn-primary">
          <Icon name="send" size={15} /> Send e-Rx
        </button>
      </PageHead>

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.6fr_1fr]">
        <Card
          title="Medications"
          action={<button className="btn btn-primary !px-2.5 !py-1.5 !text-[11.5px]">+ Add drug</button>}
        >
          <Table head={['Drug', 'Dosage', 'Frequency', 'Duration', 'Notes']}>
            {p.meds.map((m) => (
              <tr key={m.drug} className="border-b border-line last:border-0">
                <td className="whitespace-nowrap px-[15px] py-[11px]">
                  <strong className="font-semibold text-ink">{m.drug}</strong>
                </td>
                <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{m.dosage}</td>
                <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{m.freq}</td>
                <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{m.duration}</td>
                <td className="whitespace-nowrap px-[15px] py-[11px] text-ink-2">{m.notes}</td>
              </tr>
            ))}
          </Table>
          <div className="flex gap-2.5 border-t border-line px-[15px] py-2.5">
            <div className="grid h-[27px] w-[27px] flex-none place-items-center rounded-lg bg-crit-soft text-crit">
              <Icon name="alert" size={14} />
            </div>
            <p className="text-[12px] leading-snug text-ink-2">
              <b className="font-semibold text-ink">Safety check passed.</b> No interactions among selected drugs.
              Penicillin class auto-excluded (allergy on file).
            </p>
          </div>
        </Card>

        <Card title="Rx templates">
          {p.templates.map((t) => (
            <div key={t.name} className="flex items-center gap-2.5 border-t border-line px-[15px] py-2.5">
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold">{t.name}</div>
                <div className="text-[11px] text-ink-3">{t.detail}</div>
              </div>
              <button className="btn !px-2.5 !py-1.5 !text-[11.5px]">Use</button>
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}
