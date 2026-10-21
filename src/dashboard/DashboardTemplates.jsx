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
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

// Template card. The sheet has square corners, like a real piece of bond paper.
export function TemplateCard({ t, size = 'letter' }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.25, ease: EASE }}>
      <Link
        to={`/dashboard/editor/${t.id}?size=${size}`}
        className={`group block rounded-[2px] focus-visible:outline-offset-4 ${FOCUS}`}
      >
        <div className="relative overflow-hidden rounded-[2px] border border-[#d5dfea] bg-white shadow-[0_1px_2px_rgba(11,31,58,0.08),0_6px_16px_rgba(11,31,58,0.06)] transition-[border-color,box-shadow] duration-300 group-hover:border-[#5b9bd5] group-hover:shadow-[0_2px_4px_rgba(11,31,58,0.1),0_16px_32px_rgba(11,31,58,0.14)]">
          <ResumePreview t={t} data={SAMPLE} thumb size={size} />
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#0b1f3a]/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="translate-y-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0b1f3a] shadow-md transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
              Use this template
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 px-0.5">
          <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: t.accent }} />
            <span className="truncate">{t.name}</span>
          </p>
          <div className="flex shrink-0 gap-1.5">
            {t.tags
              .filter((x) => TAG_LABEL[x])
              .slice(0, 2)
              .map((x) => (
                <span key={x} className="rounded-sm bg-[#eef4fa] px-2 py-0.5 text-[11px] font-semibold text-[#4a5a70]">
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mx-auto max-w-6xl pb-8"
    >
      {/* Page header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0b1f3a] md:text-3xl">Resume templates</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Every template is a clean single-column layout with real text, so applicant tracking systems can read it.
          No experience yet? You can add an internship or projects while editing.
        </p>
      </header>

      {/* Toolbar: filters on the left, paper size on the right */}
      <div className="mt-6 flex flex-col gap-4 border-y border-[#e3ebf4] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter templates"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`relative shrink-0 cursor-pointer rounded-md px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${FOCUS} ${
                  active ? 'text-white' : 'text-[#0b1f3a] hover:bg-[#eef4fa]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    className="absolute inset-0 rounded-md bg-[#0b1f3a]"
                  />
                )}
                <span className="relative">
                  {f.label}
                  <span className={`ml-1.5 text-xs font-medium ${active ? 'text-white/70' : 'text-slate-400'}`}>
                    {counts[f.id]}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">Paper size</span>
          <div
            role="radiogroup"
            aria-label="Paper size"
            className="inline-flex overflow-hidden rounded-md border border-[#d5dfea] bg-white"
          >
            {PAGE_SIZES.map((p, i) => {
              const on = size === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  title={`${p.label} (${p.dim})`}
                  onClick={() => setSize(p.id)}
                  className={`cursor-pointer px-4 py-1.5 text-center transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#5b9bd5] ${
                    i > 0 ? 'border-l border-[#d5dfea]' : ''
                  } ${on ? 'bg-[#0b1f3a] text-white' : 'text-[#0b1f3a] hover:bg-[#eef4fa]'}`}
                >
                  <span className="block text-sm font-semibold leading-tight">{p.short}</span>
                  <span className={`block text-[11px] leading-tight ${on ? 'text-white/70' : 'text-slate-500'}`}>
                    {p.dim}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-500" aria-live="polite">
        Showing {list.length} {list.length === 1 ? 'template' : 'templates'}
      </p>

      {/* Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <motion.div layout className="mt-5 grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <TemplateCard t={t} size={size} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-[#c9d8e8] bg-white px-6 py-14 text-center">
          <p className="font-semibold text-slate-900">No templates match this filter</p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`mt-3 cursor-pointer rounded text-sm font-semibold text-[#0b1f3a] hover:text-[#2f6fa8] ${FOCUS}`}
          >
            Show all templates
          </button>
        </div>
      )}
    </motion.div>
  )
}