import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TEMPLATES, SAMPLE, ResumePreview } from './templateData'

const FILTERS = [
  { id: 'all', label: 'All templates' },
  { id: 'ats', label: 'ATS' },
  { id: 'profile', label: 'With profile' },
  { id: 'single', label: 'Single column' },
  { id: 'two', label: 'Two column' },
  { id: 'gdocs', label: 'Google Docs style' },
  { id: 'more', label: 'See more' },
]

export default function ResumeTemplates() {
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()
  const list = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.tags.includes(filter))

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#111]">
      <header className="sticky top-0 z-30 border-b border-[#dde8f3] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 w-[min(1160px,100%-3rem)] items-center justify-between">
          <Link to="/"><img src="/logo/resumate.png" alt="ResuMate" className="h-12 w-auto md:h-14" /></Link>
          <div className="flex items-center gap-5 text-sm font-bold text-[#0b1f3a]">
            <Link to="/" className="hover:text-[#5b9bd5]">Home</Link>
            <Link to="/signin" className="hover:text-[#5b9bd5]">Sign in</Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-white to-[#f1f7fd] pb-6 pt-12">
        <div className="mx-auto w-[min(1160px,100%-3rem)]">
          <h1 className="font-['Outfit','Jost',sans-serif] text-[clamp(2rem,4.5vw,3.2rem)] leading-tight text-[#0b1f3a]">Choose a resume template</h1>
          <p className="mt-3 max-w-[520px] text-[1.05rem] text-[#4a5a70]">Pick a design to start with. You can change it later without losing your content.</p>

          <nav aria-label="Template filters" className="-mx-6 mt-8 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition duration-300 ${
                  filter === f.id ? 'border-[#0b1f3a] bg-[#0b1f3a] text-white' : 'border-[#dde8f3] bg-white text-[#0b1f3a] hover:border-[#5b9bd5]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <main className="bg-[#f1f7fd] pb-20 pt-6">
        <div className="mx-auto w-[min(1160px,100%-3rem)]">
          <p className="mb-6 text-sm text-[#4a5a70]">{list.length} templates</p>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {list.map((t, i) => (
              <button
                key={`${filter}-${t.id}`}
                onClick={() => navigate(`/editing/${t.id}`)}
                style={{ animationDelay: `${i * 50}ms` }}
                className="group animate-[rm-fade_0.5s_forwards] cursor-pointer text-left opacity-0"
                aria-label={`Use the ${t.name} template`}
              >
                <div className="relative overflow-hidden rounded-[3px] border border-[#dde8f3] shadow-[0_10px_30px_rgba(11,31,58,0.07)] transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_40px_rgba(11,31,58,0.14)]">
                  <ResumePreview t={t} data={SAMPLE} thumb />
                  <div className="absolute inset-0 grid place-items-center bg-[#0b1f3a]/55 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="rounded bg-white px-5 py-2.5 text-sm font-bold text-[#0b1f3a]">Use this template</span>
                  </div>
                </div>
                <p className="mt-3 font-['Outfit','Jost',sans-serif] text-lg font-medium text-[#0b1f3a]">{t.name}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}