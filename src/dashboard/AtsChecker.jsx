import { useState } from 'react'
import { ShieldCheckIcon } from './icons'

const CHECKLIST = [
  'Use standard section headings such as Experience, Education, and Skills.',
  'Keep important details in the document body, not only in headers or footers.',
  'Use consistent date and job-title formatting throughout your resume.',
  'Include relevant terms from the job description where they accurately describe your experience.',
]

export default function AtsChecker() {
  const [fileName, setFileName] = useState('')
  const [showChecklist, setShowChecklist] = useState(false)

  return (
    <div className="mx-auto max-w-5xl">
      <header className="rounded-3xl bg-[#0b1f3a] p-6 text-white shadow-[0_18px_40px_rgba(11,31,58,0.16)] sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#cfe3f8]">
          <ShieldCheckIcon className="h-6 w-6" />
        </span>
        <p className="mt-5 text-sm font-semibold text-[#9cc3e8]">Resume review workspace</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">ATS checker</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#cfe3f8]">
          Prepare your resume and a target job description for a quick compatibility review.
        </p>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-[#e3ebf4] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-[#0b1f3a]">Add your resume</h2>
          <p className="mt-1 text-sm text-slate-600">Choose a document to prepare your review.</p>
          <label className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c9d8e8] bg-[#f8fbff] px-4 py-6 text-center transition-colors hover:border-[#5b9bd5]">
            <span className="text-sm font-semibold text-[#0b1f3a]">{fileName || 'Select a resume file'}</span>
            <span className="mt-1 text-xs text-slate-500">PDF, DOC, or DOCX</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
              className="sr-only"
            />
          </label>

          <label htmlFor="ats-job-description" className="mt-5 block text-sm font-semibold text-[#0b1f3a]">
            Job description
          </label>
          <textarea
            id="ats-job-description"
            rows="6"
            placeholder="Paste the job description here to prepare a targeted review…"
            className="mt-2 w-full resize-y rounded-xl border border-[#dde8f3] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#5b9bd5] focus:ring-2 focus:ring-[#5b9bd5]/20"
          />
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            This is a frontend preview. Resume analysis and ATS scoring are not connected to a backend.
          </p>
        </section>

        <aside className="rounded-2xl border border-[#e3ebf4] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-[#0b1f3a]">Quick ATS checklist</h2>
          <p className="mt-1 text-sm text-slate-600">A few general checks to keep in mind.</p>
          <ul className="mt-5 space-y-4">
            {CHECKLIST.slice(0, showChecklist ? CHECKLIST.length : 2).map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#5b9bd5]" />
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-expanded={showChecklist}
            onClick={() => setShowChecklist((visible) => !visible)}
            className="mt-5 rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#17395f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]"
          >
            {showChecklist ? 'Show less' : 'See full checklist'}
          </button>
        </aside>
      </div>
    </div>
  )
}