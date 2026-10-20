import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SAMPLE, TEMPLATES, PAGE_SIZES, ResumePreview } from '../editing/templateData'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ats', label: 'ATS-friendly' },
  { id: 'fresh', label: 'Fresh graduate' },
  { id: 'serif', label: 'Serif' },
  { id: 'sans', label: 'Sans-serif' },
]
const TAG_LABEL = { ats: 'ATS', fresh: 'Fresh grad', serif: 'Serif', sans: 'Sans' }

const EASE = [0.2, 0.7, 0.2, 1]

export function TemplateCard({ t, size = 'letter' }) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.25, ease: EASE }}>
      <Link
        to={`/dashboard/editor/${t.id}?size=${size}`}
        className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b9bd5]"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#dde8f3] bg-white shadow-sm transition-[border-color,box-shadow] duration-300 group-hover:border-[#5b9bd5] group-hover:shadow-[0_18px_40px_rgba(11,31,58,0.16)]">
          <ResumePreview t={t} data={SAMPLE} thumb size={size} />
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#0b1f3a]/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="translate-y-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#0b1f3a] shadow-md transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
              Use this template
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 px-0.5">
          <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: t.accent }} />
            <span className="truncate">{t.name}</span>
          </p>
          <div className="flex shrink-0 gap-1">
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
    </motion.div>
  )
}

export default function DashboardTemplates() {
  const [filter, setFilter] = useState('all')
  // Paper size is passed to the editor, where it can still be changed.
  const [size, setSize] = useState('letter')
  const list = useMemo(
    () => (filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.tags.includes(filter))),
    [filter]
  )
  const counts = useMemo(() => {
    const c = { all: TEMPLATES.length }
    FILTERS.forEach((f) => {
      if (f.id !== 'all') c[f.id] = TEMPLATES.filter((t) => t.tags.includes(f.id)).length
    })
    return c
  }, [])

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="rounded-3xl border border-[#e3ebf4] bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0b1f3a] md:text-3xl">Resume templates</h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600">
              Every template is a clean single-column layout with real text, so applicant tracking systems can read it.
              No experience yet? You can add an internship or projects while editing.
            </p>
          </div>
          <p className="rounded-full bg-[#eef4fa] px-3 py-1 text-sm font-semibold text-[#0b1f3a]">
            {list.length} {list.length === 1 ? 'template' : 'templates'}
          </p>
        </div>

        {/* Paper size */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm font-bold text-[#0b1f3a]">Paper size</p>
          <div role="radiogroup" aria-label="Paper size" className="flex flex-wrap gap-2">
            {PAGE_SIZES.map((p) => {
              const on = size === p.id
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSize(p.id)}
                  className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5] ${
                    on ? 'border-[#0b1f3a] bg-[#0b1f3a] text-white' : 'border-[#dde8f3] bg-white text-[#0b1f3a] hover:border-[#5b9bd5]'
                  }`}
                >
                  <span className="block text-sm font-bold leading-tight">{p.label}</span>
                  <span className={`block text-[11px] ${on ? 'text-white/70' : 'text-slate-500'}`}>{p.dim}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Filters: scroll sideways on small screens, active pill glides between options */}
        <div
          role="group"
          aria-label="Filter templates"
          className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-7 sm:px-7 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id
            return (
              <motion.button
                key={f.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`relative shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-bold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5] ${
                  active
                    ? 'border-[#0b1f3a] text-white'
                    : 'border-[#dde8f3] bg-white text-[#0b1f3a] hover:border-[#5b9bd5]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    className="absolute inset-0 rounded-full bg-[#0b1f3a]"
                  />
                )}
                <span className="relative">
                  {f.label}
                  <span className={`ml-1.5 text-xs font-semibold ${active ? 'text-white/70' : 'text-slate-400'}`}>
                    {counts[f.id]}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <motion.div layout className="mt-8 grid grid-cols-2 items-start gap-4 pb-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <TemplateCard t={t} size={size} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-[#c9d8e8] bg-white px-6 py-14 text-center">
          <p className="font-semibold text-slate-900">No templates match this filter</p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="mt-3 cursor-pointer text-sm font-bold text-[#0b1f3a] hover:text-[#2f6fa8]"
          >
            Show all templates
          </button>
        </div>
      )}
    </div>
  )
}