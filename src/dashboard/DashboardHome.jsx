import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import { TEMPLATES } from '../editing/templateData'
import { TemplateCard } from './DashboardTemplates'
import {
  PlusIcon,
  ArrowRightIcon,
  LetterIcon,
  ActivityIcon,
  ShieldCheckIcon,
  CheckIcon,
} from './icons'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

const ACTIONS = [
  { to: '/dashboard/templates', icon: PlusIcon, title: 'Create a resume', text: 'Pick a template and start building.' },
  { to: '/dashboard/cover-letters', icon: LetterIcon, title: 'Write a cover letter', text: 'Match it to your resume.' },
  { to: '/dashboard/resumes', icon: ActivityIcon, title: 'My activities', text: 'Continue where you left off.' },
  { to: '/dashboard/ats-checker', icon: ShieldCheckIcon, title: 'Check ATS score', text: 'See how bots read your resume.' },
]

const TIPS = [
  { title: 'Lead with results', text: 'Use numbers where you can, such as "raised qualified leads by 42%".' },
  { title: 'Keep it to one page', text: 'Recruiters scan quickly. Focus on your most relevant roles.' },
  { title: 'Match the job post', text: 'Reuse keywords from the job description in your skills and summary.' },
]

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

function SectionHead({ title, text, to, cta = 'View all' }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#e3ebf4] pb-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-[#0b1f3a] sm:text-xl">{title}</h2>
        {text && <p className="mt-1 text-sm text-slate-600">{text}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className={`group inline-flex shrink-0 items-center gap-1.5 rounded text-sm font-semibold text-[#0b1f3a] transition-colors hover:text-[#2f6fa8] ${FOCUS}`}
        >
          {cta}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuth()
  const reduce = useReducedMotion()
  const firstName = (user?.user_metadata?.full_name || '').split(' ')[0] || 'there'

  // A single, quiet entrance for the whole page. Skipped when the user prefers reduced motion.
  const entrance = reduce
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] } }

  return (
    <motion.div {...entrance} className="mx-auto max-w-6xl space-y-10 pb-8 sm:space-y-12">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl bg-[#0b1f3a] text-white shadow-sm">
        <div className="flex flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[#9cc3e8]">{greeting()}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[#cfe3f8]">
              Build a polished, ATS-ready resume in minutes. Pick a template and we will guide you step by step.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Link
              to="/dashboard/templates"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0b1f3a] transition-colors hover:bg-[#eef4fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PlusIcon className="h-4 w-4" /> Create new resume
            </Link>
            <Link
              to="/dashboard/resumes"
              className="inline-flex items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Open my activities
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions: one panel, divided cells */}
      <section aria-label="Quick actions">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#e3ebf4] bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((a, i) => (
            <Link
              key={a.to}
              to={a.to}
              className={`group flex items-start gap-4 p-5 transition-colors hover:bg-[#f6f9fc] ${FOCUS} focus-visible:-outline-offset-2
                ${i > 0 ? 'border-t border-[#e3ebf4]' : ''}
                ${i > 0 ? 'sm:border-t-0' : ''}
                ${i % 2 === 1 ? 'sm:border-l' : ''}
                ${i >= 2 ? 'sm:border-t' : ''}
                ${i > 0 ? 'lg:border-t-0 lg:border-l' : ''}`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#eef4fa] text-[#0b1f3a] transition-colors duration-200 group-hover:bg-[#0b1f3a] group-hover:text-white">
                <a.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">{a.title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-slate-600">{a.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular templates: 3 per row on desktop */}
      <section>
        <SectionHead
          title="Popular resume templates"
          text="Start from a design recruiters already like."
          to="/dashboard/templates"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {TEMPLATES.slice(0, 3).map((t) => (
            <div key={t.id} className="min-w-0">
              <TemplateCard t={t} />
            </div>
          ))}
        </div>
      </section>

      {/* Tips: one panel with dividers */}
      <section>
        <SectionHead title="Resume tips" text="Small changes that get more replies." />
        <ul className="grid divide-y divide-[#e3ebf4] overflow-hidden rounded-2xl border border-[#e3ebf4] bg-white shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
          {TIPS.map((tip) => (
            <li key={tip.title} className="flex gap-4 p-5 sm:p-6">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eef4fa] text-[#0b1f3a]">
                <CheckIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{tip.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{tip.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  )
}