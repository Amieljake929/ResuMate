import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  { to: '/dashboard/cover-letters', icon: LetterIcon, title: 'Write a cover letter', text: 'Match it to your resume.', soon: true },
  { to: '/dashboard/resumes', icon: ActivityIcon, title: 'My activities', text: 'Continue where you left off.' },
  { to: '/dashboard/ats-checker', icon: ShieldCheckIcon, title: 'Check ATS score', text: 'See how bots read your resume.', soon: true },
]

const TIPS = [
  { title: 'Lead with results', text: 'Use numbers where you can, such as "raised qualified leads by 42%".' },
  { title: 'Keep it to one page', text: 'Recruiters scan quickly. Focus on your most relevant roles.' },
  { title: 'Match the job post', text: 'Reuse keywords from the job description in your skills and summary.' },
]

const EASE = [0.2, 0.7, 0.2, 1]
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

// One orchestrated entrance: sections rise in sequence on page load.
const page = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

function SectionHead({ title, text, to, cta = 'View all' }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#0b1f3a]">{title}</h2>
        {text && <p className="mt-0.5 text-sm text-slate-600">{text}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className={`group inline-flex shrink-0 items-center gap-1.5 rounded text-sm font-bold text-[#0b1f3a] transition-colors hover:text-[#2f6fa8] ${FOCUS}`}
        >
          {cta} <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}

// Decorative stack of resume sheets, drawn with plain shapes.
function SheetStack() {
  const line = 'h-1.5 rounded-full bg-slate-200'
  return (
    <div aria-hidden="true" className="relative hidden h-full w-[300px] shrink-0 lg:block">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-6 top-1/2 h-[210px] w-[160px] -translate-y-1/2 rotate-[8deg] rounded-xl bg-white/10 ring-1 ring-white/15"
      />
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-16 top-1/2 h-[230px] w-[170px] -translate-y-1/2 -rotate-[4deg] rounded-xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        <div className="h-2.5 w-20 rounded-full bg-[#0b1f3a]" />
        <div className={`${line} mt-2 w-12`} />
        <div className="mt-5 h-1.5 w-10 rounded-full bg-[#5b9bd5]" />
        <div className={`${line} mt-2 w-full`} />
        <div className={`${line} mt-1.5 w-5/6`} />
        <div className="mt-4 h-1.5 w-12 rounded-full bg-[#5b9bd5]" />
        <div className={`${line} mt-2 w-full`} />
        <div className={`${line} mt-1.5 w-4/6`} />
        <div className={`${line} mt-1.5 w-5/6`} />
        <div className="mt-4 h-1.5 w-10 rounded-full bg-[#5b9bd5]" />
        <div className={`${line} mt-2 w-3/6`} />
      </motion.div>
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuth()
  const firstName = (user?.user_metadata?.full_name || '').split(' ')[0] || 'there'

  return (
    <motion.div variants={page} initial="hidden" animate="show" className="mx-auto max-w-6xl">
      {/* Hero */}
      <motion.section
        variants={rise}
        className="relative flex items-stretch justify-between overflow-hidden rounded-3xl bg-[#0b1f3a] px-6 py-9 text-white shadow-[0_18px_40px_rgba(11,31,58,0.18)] sm:px-9 md:px-12 md:py-12"
      >
        <motion.div
          aria-hidden="true"
          animate={{ scale: [1, 1.06, 1], x: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[#5b9bd5]/20"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 h-60 w-60 rounded-full bg-white/5" />

        <div className="relative max-w-xl">
          <p className="text-sm font-medium text-[#9cc3e8]">{greeting()}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">Welcome back, {firstName}</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#cfe3f8]">
            Build a polished, ATS-ready resume in minutes. Pick a template and we will guide you step by step.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/dashboard/templates"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[#0b1f3a] transition-shadow duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <PlusIcon className="h-4 w-4" /> Create new resume
              </Link>
            </motion.div>
            <Link
              to="/dashboard/resumes"
              className="rounded-lg px-4 py-2.5 text-sm font-bold text-[#cfe3f8] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Open my activities
            </Link>
          </div>
        </div>

        <SheetStack />
      </motion.section>

      {/* Quick actions */}
      <motion.section variants={rise} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((a) => (
          <motion.div key={a.to} whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.2 }}>
            <Link
              to={a.to}
              className={`group flex h-full flex-col rounded-2xl border border-[#e3ebf4] bg-white p-5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-[#c9d8e8] hover:shadow-md ${FOCUS}`}
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef4fa] transition-colors duration-300 group-hover:bg-[#0b1f3a] group-hover:text-white">
                  <a.icon className="h-5 w-5" />
                </span>
                {a.soon ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Soon</span>
                ) : (
                  <ArrowRightIcon className="h-5 w-5 text-slate-400 transition duration-300 group-hover:translate-x-1 group-hover:text-black" />
                )}
              </div>
              <p className="mt-5 font-semibold text-slate-900">{a.title}</p>
              <p className="mt-0.5 text-sm text-slate-600">{a.text}</p>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* Popular templates */}
      <motion.section variants={rise} className="mt-12">
        <SectionHead
          title="Popular resume templates"
          text="Start from a design recruiters already like."
          to="/dashboard/templates"
        />
        <motion.div variants={grid} className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {TEMPLATES.slice(0, 4).map((t) => (
            <motion.div key={t.id} variants={rise}>
              <TemplateCard t={t} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Tips */}
      <motion.section variants={rise} className="mt-12 pb-4">
        <SectionHead title="Resume tips" text="Small changes that get more replies." />
        <div className="grid gap-4 md:grid-cols-3">
          {TIPS.map((tip) => (
            <motion.div
              key={tip.title}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="flex gap-4 rounded-2xl border border-[#e3ebf4] bg-white p-5 transition-shadow duration-300 hover:shadow-md"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eef4fa] text-[#0b1f3a]">
                <CheckIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{tip.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{tip.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}