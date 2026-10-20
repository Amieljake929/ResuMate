import { useMemo, useState } from 'react'
import { BriefcaseIcon } from './icons'

const APPLICATIONS = [
  { company: 'Northstar Studio', role: 'Product Designer', date: 'Oct 18, 2026', status: 'Interview' },
  { company: 'Brightpath', role: 'UX Researcher', date: 'Oct 15, 2026', status: 'Applied' },
  { company: 'Pine & Co.', role: 'Visual Designer', date: 'Oct 12, 2026', status: 'Saved' },
  { company: 'Atlas Works', role: 'Design Lead', date: 'Oct 08, 2026', status: 'Offer' },
]

const FILTERS = ['All', 'Saved', 'Applied', 'Interview', 'Offer']
const STATUS_STYLES = {
  Interview: 'bg-blue-50 text-blue-700',
  Applied: 'bg-slate-100 text-slate-700',
  Saved: 'bg-amber-50 text-amber-700',
  Offer: 'bg-green-50 text-green-700',
}

export default function JobTracker() {
  const [filter, setFilter] = useState('All')
  const applications = useMemo(
    () => filter === 'All' ? APPLICATIONS : APPLICATIONS.filter((application) => application.status === filter),
    [filter]
  )

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-[#e3ebf4] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef4fa] text-[#0b1f3a]">
            <BriefcaseIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#2f6fa8]">Career organizer</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0b1f3a] md:text-3xl">Job tracker</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Keep your opportunities and next steps organized in one place.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#fff7e8] px-3 py-1.5 text-xs font-semibold text-[#91631b]">
          Frontend preview · sample applications
        </span>
      </header>

      <section className="mt-6 rounded-2xl border border-[#e3ebf4] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#0b1f3a]">Applications</h2>
            <p className="mt-1 text-sm text-slate-600">
              {applications.length} sample {applications.length === 1 ? 'application' : 'applications'}
            </p>
          </div>
          <div aria-label="Filter applications" className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5] ${
                  filter === item
                    ? 'border-[#0b1f3a] bg-[#0b1f3a] text-white'
                    : 'border-[#dde8f3] text-slate-600 hover:border-[#5b9bd5] hover:text-[#0b1f3a]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e3ebf4] text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Company / role</th>
                <th className="px-3 py-3">Date added</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.company} className="border-b border-[#eef2f7] last:border-0">
                  <td className="px-3 py-4">
                    <p className="font-semibold text-[#0b1f3a]">{application.company}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{application.role}</p>
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">{application.date}</td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[application.status]}`}>
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-3 py-10 text-center text-sm text-slate-500">
                    No sample applications in this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          These example entries are static and are not saved to an account or backend.
        </p>
      </section>
    </div>
  )
}