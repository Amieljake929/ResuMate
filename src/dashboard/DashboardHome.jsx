import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { TEMPLATES } from '../editing/templateData'
import { TemplateCard } from './DashboardTemplates'
import { PlusIcon, FolderIcon, ArrowRightIcon } from './icons'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

const TIPS = [
  { title: 'Lead with results', text: 'Use numbers where you can, such as "raised qualified leads by 42%".' },
  { title: 'Keep it to one page', text: 'Recruiters scan quickly. Focus on your most relevant roles.' },
  { title: 'Match the job post', text: 'Reuse keywords from the job description in your skills and summary.' },
]

export default function DashboardHome() {
  const { user } = useAuth()
  const firstName = (user?.user_metadata?.full_name || '').split(' ')[0] || 'there'

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0b1f3a] px-7 py-9 text-white shadow-[0_18px_40px_rgba(11,31,58,0.18)] md:px-10 md:py-11">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#5b9bd5]/20" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-28 h-60 w-60 rounded-full bg-white/5" />
        <div className="relative max-w-xl">
          <p className="text-sm font-medium text-[#9cc3e8]">Dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#cfe3f8]">
            Build a polished, ATS-ready resume in minutes. Pick a template and we will guide you step by step.
          </p>
          <Link
            to="/dashboard/templates"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[#0b1f3a] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <PlusIcon className="h-4 w-4" /> Create new resume
          </Link>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { to: '/dashboard/templates', icon: PlusIcon, title: 'Create a new resume', text: 'Pick a template and start building.' },
          { to: '/dashboard/resumes', icon: FolderIcon, title: 'My resumes', text: 'Open or continue editing a saved resume.' },
        ].map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group flex items-center gap-4 rounded-xl border border-[#e3ebf4] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-[#e3ebf4] bg-[#f6faff]">
              <a.icon className="h-6 w-6 text-black" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-slate-900">{a.title}</span>
              <span className="mt-0.5 block text-sm text-slate-600">{a.text}</span>
            </span>
            <ArrowRightIcon className="h-5 w-5 shrink-0 text-black transition group-hover:translate-x-1" />
          </Link>
        ))}
      </section>

      {/* Popular templates */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0b1f3a]">Popular templates</h2>
            <p className="mt-0.5 text-sm text-slate-600">Start from a design recruiters already like.</p>
          </div>
          <Link to="/dashboard/templates" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b1f3a] hover:text-[#2f6fa8]">
            View all <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {TEMPLATES.slice(0, 4).map((t) => (
            <TemplateCard key={t.id} t={t} />
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="mt-10 pb-4">
        <h2 className="mb-4 text-xl font-semibold text-[#0b1f3a]">Resume tips</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TIPS.map((tip, i) => (
            <div key={tip.title} className="rounded-xl border border-[#e3ebf4] bg-white p-5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-xs font-bold text-white">{i + 1}</span>
              <p className="mt-3 font-semibold text-slate-900">{tip.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}