import { useState } from 'react'
import { motion } from 'framer-motion'
import { PAGE_SIZES } from '../editing/templateData'
import { COVER_LETTERS, PREVIEW_STYLES, CoverLetterPreview } from '../editing/CoverLetterData'

const EASE = [0.2, 0.7, 0.2, 1]

// Cover letter card. Same look as the resume template card, but not clickable yet.
function CoverLetterCard({ template, size }) {
  return (
    <article className="min-w-0" aria-label={`${template.title} cover letter template, coming soon`}>
      <div className="relative overflow-hidden rounded-[2px] border border-[#d5dfea] bg-white shadow-[0_1px_2px_rgba(11,31,58,0.08),0_6px_16px_rgba(11,31,58,0.06)]">
        <CoverLetterPreview template={template} size={size} />
        {/* Bottom right, so it never covers the letterhead */}
        <span className="absolute bottom-3 right-3 rounded-sm bg-[#0b1f3a] px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
          Coming soon
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 px-0.5">
        <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: PREVIEW_STYLES[template.style].accent }}
          />
          <span className="truncate">{template.title}</span>
        </p>
        <span className="shrink-0 rounded-sm bg-[#eef4fa] px-2 py-0.5 text-[11px] font-semibold text-[#4a5a70]">
          {template.type}
        </span>
      </div>
      <p className="mt-1 px-0.5 text-sm text-slate-600">{template.description}</p>
    </article>
  )
}

export default function CoverLetter() {
  const [size, setSize] = useState('letter')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mx-auto max-w-6xl pb-8"
    >
      {/* Page header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0b1f3a] md:text-3xl">Cover letter templates</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Preview the cover letter designs that match your resume. Opening a template in the editor is coming soon.
        </p>
      </header>

      {/* Toolbar: count on the left, paper size on the right */}
      <div className="mt-6 flex flex-col gap-3 border-y border-[#e3ebf4] py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500" aria-live="polite">
          Showing {COVER_LETTERS.length} {COVER_LETTERS.length === 1 ? 'template' : 'templates'}
        </p>
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

      {/* Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="mt-5 grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
        {COVER_LETTERS.map((template) => (
          <CoverLetterCard key={template.id} template={template} size={size} />
        ))}
      </div>
    </motion.div>
  )
}