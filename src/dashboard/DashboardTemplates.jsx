import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SAMPLE, TEMPLATES, ResumePreview } from '../editing/templateData'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ats', label: 'ATS-friendly' },
  { id: 'gdocs', label: 'Google Docs' },
  { id: 'single', label: 'Single column' },
  { id: 'two', label: 'Two column' },
  { id: 'profile', label: 'With photo' },
]
const TAG_LABEL = { ats: 'ATS', gdocs: 'Docs', single: '1 column', two: '2 column', profile: 'Photo' }

export function TemplateCard({ t }) {
  return (
    <Link
      to={`/dashboard/editor/${t.id}`}
      className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b9bd5]"
    >
      <div className="relative overflow-hidden rounded-xl border border-[#dde8f3] bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-[#5b9bd5] group-hover:shadow-[0_18px_40px_rgba(11,31,58,0.16)]">
        <ResumePreview t={t} data={SAMPLE} thumb />
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#0b1f3a]/70 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#0b1f3a] shadow-md">Use this template</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.accent }} />
          {t.name}
        </p>
        <div className="flex gap-1">
          {t.tags
            .filter((x) => TAG_LABEL[x])
            .slice(0, 2)
            .map((x) => (
              <span key={x} className="rounded-full bg-[#eef4fa] px-2 py-0.5 text-[10px] font-bold text-[#4a5a70]">
                {TAG_LABEL[x]}
              </span>
            ))}
        </div>
      </div>
    </Link>
  )
}

export default function DashboardTemplates() {
  const [filter, setFilter] = useState('all')
  const list = useMemo(
    () => (filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.tags.includes(filter))),
    [filter]
  )

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0b1f3a]">Choose a template</h1>
          <p className="mt-1 text-sm text-slate-600">Pick a design to start with. You can switch templates any time while editing.</p>
        </div>
        <p className="text-sm font-medium text-slate-500">{list.length} templates</p>
      </div>

      <div role="group" aria-label="Filter templates" className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5] ${
              filter === f.id
                ? 'border-[#0b1f3a] bg-[#0b1f3a] text-white'
                : 'border-[#dde8f3] bg-white text-[#0b1f3a] hover:border-[#5b9bd5]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-6 pb-4 md:grid-cols-3 xl:grid-cols-4">
        {list.map((t) => (
          <TemplateCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  )
}