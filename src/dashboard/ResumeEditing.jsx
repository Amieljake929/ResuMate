import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { getActivity, newActivityId, saveActivity } from '../lib/activityStore'
import {
  EMPTY, SAMPLE, TEMPLATES, ResumePreview, PAGE_SIZES, pageOf, SKILL_CATEGORIES,
  MARKERS, BULLET_STYLES, blankExperience, blankEducation, blankProject, blankLink, blankSkillGroup,
} from '../editing/templateData'

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const DISPLAY = "font-['Outfit','Jost',sans-serif]"

const STEPS = [
  { id: 'personal', label: 'Personal', title: 'Personal details', hint: 'Start with how employers can reach you.' },
  { id: 'summary', label: 'Summary', title: 'Professional summary', hint: 'Two or three sentences that sell your experience.' },
  { id: 'experience', label: 'Experience', title: 'Work experience', hint: 'List your latest role first. Fresh graduate? Add an internship.' },
  { id: 'projects', label: 'Projects', title: 'Projects', hint: 'Optional. Show what you have built, especially if you are just starting out.' },
  { id: 'education', label: 'Education', title: 'Education', hint: 'Add your degrees, schools and years.' },
  { id: 'skills', label: 'Skills', title: 'Skills', hint: 'Group your skills by category: technical, soft or other.' },
  { id: 'review', label: 'Review', title: 'Review your resume', hint: 'See your score and fix what is still missing.' },
  { id: 'download', label: 'Download', title: 'Download your resume', hint: 'Choose a paper size and format, then save your resume.' },
]
const LAST = STEPS.length - 1
const stepIndex = (id) => STEPS.findIndex((s) => s.id === id)

const ZOOMS = [50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200]
const DEFAULT_ZOOM = ZOOMS.indexOf(100)

const SKILL_SUGGESTIONS = {
  'Technical Skills': ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'HTML and CSS', 'REST APIs'],
  'Soft Skills': ['Communication', 'Teamwork', 'Problem solving', 'Leadership', 'Time management', 'Adaptability', 'Critical thinking', 'Creativity'],
  'Other Skills': ['Microsoft Office', 'Customer service', 'Project management', 'Data entry', 'Bookkeeping', 'Filipino', 'English', 'Typing'],
}
const SKILL_HINTS = {
  'Technical Skills': 'JavaScript, React, SQL',
  'Soft Skills': 'Communication, Teamwork',
  'Other Skills': 'Microsoft Office, Filipino',
}

const LINK_TYPES = ['LinkedIn', 'GitHub', 'Portfolio', 'Website', 'Behance', 'Other']
const MAX_LINKS = 5

const FORMATS = [
  { id: 'pdf', label: 'PDF', icon: 'file', text: 'Best for applying. Text stays selectable, so ATS can read it. Your print dialog opens: choose "Save as PDF".' },
  { id: 'png', label: 'Image (PNG)', icon: 'image', text: 'Looks exactly like the preview. Good for sharing, but ATS cannot read images.' },
]

/* Makes older saved resumes safe to open: adds missing fields such as entry type, education details,
   paper size, and turns the old single skills list into a skill category. */
const DEFAULTS = { projects: [], links: [] }
const toSkillGroups = (d) => {
  if (Array.isArray(d.skillGroups) && d.skillGroups.length) return d.skillGroups
  if (d.skills) return [{ category: d.skillsTitle === 'Technical Skills' ? 'Technical Skills' : 'Other Skills', items: d.skills }]
  return [blankSkillGroup()]
}
const withDefaults = (d) => {
  const rest = { ...d }
  delete rest.skills
  delete rest.skillsTitle
  return {
    ...DEFAULTS,
    ...rest,
    skillGroups: toSkillGroups(d),
    pageSize: PAGE_SIZES.some((p) => p.id === d.pageSize) ? d.pageSize : 'letter',
    experience: (d.experience || []).map((e) => ({ kind: 'job', ...e })),
    education: (d.education || []).map((e) => ({ details: '', format: { mode: 'bullets', style: 'disc' }, ...e })),
  }
}

const INPUT =
  'w-full rounded-lg border border-[#dde8f3] bg-[#f6faff] px-3.5 py-2.5 text-sm text-[#111] transition placeholder:text-[#9aaabd] hover:border-[#c3d6ea] focus:border-[#5b9bd5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#5b9bd5]/15'
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'
const BTN_PRIMARY = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0b1f3a] px-5 py-2.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#17335c] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${FOCUS}`
const BTN_GHOST = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#dde8f3] bg-white px-5 py-2.5 text-sm font-bold text-[#0b1f3a] transition duration-300 hover:border-[#5b9bd5] hover:bg-[#f6faff] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`
const ADD_BTN = `flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#9cc3e8] py-3 text-sm font-bold text-[#0b1f3a] transition duration-300 hover:border-[#0b1f3a] hover:bg-[#f6faff] ${FOCUS}`
const CARD = 'grid gap-3 rounded-xl border border-[#dde8f3] border-l-4 border-l-[#5b9bd5] bg-white p-4 shadow-[0_6px_18px_rgba(11,31,58,0.04)]'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const has = (v) => !!(v && String(v).trim())
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
const parseSkills = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean)
const frac = (arr, fn) => (arr.length ? arr.filter(fn).length / arr.length : 0)
const sum = (arr, fn) => arr.reduce((a, x) => a + fn(x), 0)
const safeName = (s) => (s || '').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'resume'
const isFilled = (e) => has(e.role) || has(e.company)

/* Works out the resume score, a score per section, and what to fix next.
   Projects are optional. If there is no work experience but there are projects,
   the projects count as the experience section. An internship counts as experience. */
function analyse(d) {
  const exp = d.experience
  const edu = d.education
  const skills = (d.skillGroups || []).flatMap((g) => parseSkills(g.items))
  const proj = (d.projects || []).filter((p) => has(p.name))
  const links = d.links || []

  const expRows = exp.filter(isFilled)
  const expFilled = expRows.length > 0
  const internOnly = expFilled && expRows.every((e) => e.kind === 'internship')
  const useProj = !expFilled && proj.length > 0
  const work = useProj ? proj.map((p) => ({ role: p.name, company: p.tech, period: p.period, details: p.details })) : exp

  const S = {
    personal: [
      { label: 'Add your full name', pts: 8, got: has(d.name) ? 1 : 0 },
      { label: 'Add your job title', pts: 6, got: has(d.title) ? 1 : 0 },
      { label: 'Add a valid email address', pts: 6, got: /^\S+@\S+\.\S+$/.test((d.email || '').trim()) ? 1 : 0 },
      { label: 'Add a phone number', pts: 4, got: has(d.phone) ? 1 : 0 },
      { label: 'Add your location', pts: 3, got: has(d.location) ? 1 : 0 },
      { label: 'Add a LinkedIn or portfolio link', pts: 3, got: links.some((l) => has(l.url)) ? 1 : 0 },
    ],
    summary: [
      { label: words(d.summary) ? 'Expand your summary to 2 or 3 sentences' : 'Write a short professional summary', pts: 15, got: Math.min(1, words(d.summary) / 25) },
    ],
    experience: [
      {
        label: useProj ? 'Add a name to each project' : internOnly ? 'Add your intern role and organization' : 'Add a job title and company',
        pts: 12,
        got: frac(work, (e) => has(e.role) && (useProj || has(e.company))),
      },
      {
        label: useProj ? 'Add your project dates' : internOnly ? 'Add your internship dates' : 'Add your employment dates',
        pts: 5,
        got: frac(work, (e) => has(e.period)),
      },
      {
        label: useProj ? 'Describe what you built' : internOnly ? 'Describe what you did and learned' : 'Describe what you achieved',
        pts: 13,
        got: work.length ? sum(work, (e) => Math.min(1, words(e.details) / 20)) / work.length : 0,
      },
    ],
    education: [
      { label: 'Add your degree and school', pts: 9, got: frac(edu, (e) => has(e.degree) && has(e.school)) },
      { label: 'Add your study dates', pts: 3, got: frac(edu, (e) => has(e.period)) },
    ],
    skills: [
      { label: skills.length ? 'List at least 6 skills' : 'Add your key skills', pts: 13, got: Math.min(1, skills.length / 6) },
    ],
  }
  if (proj.length > 0 && !useProj) {
    S.projects = [
      { label: 'Describe what you built in each project', pts: 6, got: frac(proj, (p) => words(p.details) >= 8) },
    ]
  }

  // Which wizard step fixes each section.
  const stepOf = { experience: useProj ? 'projects' : 'experience' }

  const all = Object.values(S).flat()
  const total = sum(all, (i) => i.pts)
  const score = Math.round((sum(all, (i) => i.pts * i.got) / total) * 100)

  const sections = Object.entries(S).map(([id, items]) => ({
    id,
    step: stepOf[id] || id,
    pct: Math.round((sum(items, (i) => i.pts * i.got) / sum(items, (i) => i.pts)) * 100),
  }))

  const tips = Object.entries(S)
    .flatMap(([id, items]) =>
      items
        .filter((i) => i.got < 1)
        .map((i) => ({ label: i.label, gain: Math.max(1, Math.round(((1 - i.got) * i.pts / total) * 100)), step: stepIndex(stepOf[id] || id) }))
    )
    .sort((a, b) => b.gain - a.gain)

  return { score, sections, tips }
}

const scoreColor = (n) => (n < 40 ? '#f2a93b' : n < 75 ? '#5b9bd5' : '#2fc27a')
const scoreLabel = (n) => (n < 25 ? 'Just getting started' : n < 50 ? 'Getting there' : n < 75 ? 'Looking good' : n < 90 ? 'Strong resume' : 'Excellent')

function useCountUp(target) {
  const [val, setVal] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const start = from.current
    const diff = target - start
    if (!diff) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { from.current = target; setVal(target); return }
    let raf
    let t0
    const tick = (t) => {
      t0 = t0 ?? t
      const p = Math.min(1, (t - t0) / 650)
      const v = Math.round(start + diff * (1 - Math.pow(1 - p, 3)))
      from.current = v
      setVal(v)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return val
}

/* ------------------------------------------------------------------ */
/* Export helpers (PDF, PNG)                                           */
/* ------------------------------------------------------------------ */

/* PNG: needs `npm i html-to-image` */
async function exportPng(node, name) {
  const { toPng } = await import('html-to-image')
  const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#ffffff', cacheBust: true })
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `${name}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/* PDF: prints the resume from a hidden frame, so the text stays selectable for ATS.
   `ps` is the chosen paper size (letter, A4 or long). */
async function exportPdf(node, name, ps) {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.title = name
  Object.assign(iframe.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' })
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument
  const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')].map((n) => n.outerHTML).join('')
  doc.open()
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${name}</title>${styles}` +
    `<style>@page{size:${ps.css};margin:0}html,body{margin:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style>` +
    `</head><body><div style="width:${ps.w}px">${node.outerHTML}</div></body></html>`
  )
  doc.close()

  await new Promise((r) => { iframe.onload = r; setTimeout(r, 700) })
  await doc.fonts?.ready
  const win = iframe.contentWindow
  win.onafterprint = () => iframe.remove()
  win.focus()
  win.print()
  setTimeout(() => iframe.remove(), 120000)
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const Icon = ({ children, className = 'h-4 w-4', ...rest }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} {...rest}>
    {children}
  </svg>
)
const CheckIcon = (p) => <Icon {...p}><path d="M5 12l5 5 9-10" /></Icon>
const PlusIcon = (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
const MinusIcon = (p) => <Icon {...p}><path d="M5 12h14" /></Icon>
const TrashIcon = (p) => <Icon {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" /></Icon>
const UploadIcon = (p) => <Icon {...p}><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></Icon>
const DownloadIcon = (p) => <Icon {...p}><path d="M12 4v12M7 11l5 5 5-5M5 20h14" /></Icon>
const PenIcon = (p) => <Icon {...p}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" /></Icon>
const ChevronLeft = (p) => <Icon {...p}><path d="M15 5l-7 7 7 7" /></Icon>
const ChevronRight = (p) => <Icon {...p}><path d="M9 5l7 7-7 7" /></Icon>
const CloseIcon = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>
const FileIcon = (p) => <Icon {...p}><path d="M7 3h7l5 5v13H7zM14 3v5h5" /></Icon>
const ImageIcon = (p) => <Icon {...p}><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M4 17l5-5 4 4 3-3 4 4" /></Icon>
const FolderPlusIcon = (p) => <Icon {...p}><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M12 11v5M9.5 13.5h5" /></Icon>
const FORMAT_ICON = { file: FileIcon, image: ImageIcon }

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */
function Field({ label, value, onChange, placeholder, className = '', type = 'text', autoComplete }) {
  const id = useId()
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-xs font-bold text-[#0b1f3a]">{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} className={INPUT} />
    </div>
  )
}

const MODES = [
  { id: 'paragraph', label: 'Text', icon: <Icon><path d="M4 6h16M4 12h16M4 18h10" /></Icon> },
  { id: 'bullets', label: 'Bullets', icon: <Icon><circle cx="5" cy="6" r="1.3" fill="currentColor" /><circle cx="5" cy="12" r="1.3" fill="currentColor" /><circle cx="5" cy="18" r="1.3" fill="currentColor" /><path d="M10 6h10M10 12h10M10 18h10" /></Icon> },
  { id: 'numbered', label: 'Numbered', icon: <Icon><path d="M10 6h10M10 12h10M10 18h10" /><text x="2" y="8" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">1</text><text x="2" y="14" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">2</text><text x="2" y="20" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">3</text></Icon> },
]

/* A text box with a Text / Bullets / Numbered switch and a choice of bullet style. */
function RichField({ label, value = '', format, onChange, placeholder, rows = 4 }) {
  const id = useId()
  const f = format || { mode: 'paragraph', style: 'disc' }
  const isList = f.mode !== 'paragraph'

  const switchMode = (mode) => {
    if (mode === f.mode) return
    let text = value
    if (!isList && mode !== 'paragraph') text = value.replace(/([.!?])\s+/g, '$1\n').trim()
    if (isList && mode === 'paragraph') text = value.split('\n').map((l) => l.trim()).filter(Boolean).join(' ')
    onChange({ text, format: { ...f, mode } })
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-bold text-[#0b1f3a]">{label}</label>
        <div role="group" aria-label={`${label} format`} className="flex rounded-lg bg-[#eef5fb] p-0.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => switchMode(m.id)}
              aria-pressed={f.mode === m.id}
              className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition duration-200 ${FOCUS} ${
                f.mode === m.id ? 'bg-white text-[#0b1f3a] shadow-sm' : 'text-[#4a5a70] hover:text-[#0b1f3a]'
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {f.mode === 'bullets' && (
        <div className="ed-rise flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-[#4a5a70]">Bullet style</span>
          {BULLET_STYLES.map((b) => (
            <button
              key={b.id}
              type="button"
              title={b.label}
              aria-label={b.label}
              aria-pressed={f.style === b.id}
              onClick={() => onChange({ text: value, format: { ...f, style: b.id } })}
              className={`grid h-8 w-8 cursor-pointer place-items-center rounded-md border text-sm transition duration-200 ${FOCUS} ${
                f.style === b.id ? 'border-[#0b1f3a] bg-[#0b1f3a] text-white' : 'border-[#dde8f3] bg-white text-[#0b1f3a] hover:border-[#5b9bd5]'
              }`}
            >
              {MARKERS[b.id]}
            </button>
          ))}
        </div>
      )}

      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange({ text: e.target.value, format: f })}
        placeholder={isList ? 'One point per line. Press Enter for a new one.' : placeholder}
        className={`${INPUT} resize-y leading-relaxed`}
      />
    </div>
  )
}

/* Job / Internship switch for one experience entry. */
function KindSwitch({ value, onChange }) {
  return (
    <div role="group" aria-label="Entry type" className="flex rounded-lg bg-[#eef5fb] p-0.5">
      {[['job', 'Job'], ['internship', 'Internship']].map(([id, label]) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-bold transition duration-200 ${FOCUS} ${
            value === id ? 'bg-white text-[#0b1f3a] shadow-sm' : 'text-[#4a5a70] hover:text-[#0b1f3a]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/* Paper size choice: Short (Letter), A4 or Long. `compact` is the small version used over the preview. */
function PagePicker({ value, onChange, compact = false }) {
  if (compact) {
    return (
      <div role="radiogroup" aria-label="Paper size" className="flex items-center gap-0.5 rounded-full border border-[#dde8f3] bg-white/95 p-1 shadow-sm backdrop-blur">
        {PAGE_SIZES.map((p) => {
          const on = value === p.id
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              title={`${p.label} (${p.dim})`}
              onClick={() => onChange(p.id)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition duration-200 ${FOCUS} ${
                on ? 'bg-[#0b1f3a] text-white' : 'text-[#0b1f3a] hover:bg-[#eef5fb]'
              }`}
            >
              {p.short}
            </button>
          )
        })}
      </div>
    )
  }
  return (
    <div role="radiogroup" aria-label="Paper size" className="grid gap-2 sm:grid-cols-3">
      {PAGE_SIZES.map((p) => {
        const on = value === p.id
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(p.id)}
            className={`cursor-pointer rounded-xl border px-3.5 py-3 text-left transition duration-300 ${FOCUS} ${
              on ? 'border-[#0b1f3a] bg-[#f6faff] shadow-[0_8px_22px_rgba(11,31,58,0.08)]' : 'border-[#dde8f3] bg-white hover:-translate-y-0.5 hover:border-[#5b9bd5]'
            }`}
          >
            <span className={`${DISPLAY} block text-sm font-medium text-[#0b1f3a]`}>{p.label}</span>
            <span className="mt-0.5 block text-xs text-[#4a5a70]">{p.dim}</span>
          </button>
        )
      })}
    </div>
  )
}

/* One skill category: pick the category, then type or select the skills that belong to it. */
function SkillGroupCard({ index, group, usedElsewhere, canRemove, onChange, onRemove }) {
  const id = useId()
  const list = parseSkills(group.items)
  const setList = (next) => onChange({ items: next.join(', ') })
  const pool = SKILL_SUGGESTIONS[group.category] || []
  const suggestions = pool.filter((s) => !list.some((x) => x.toLowerCase() === s.toLowerCase())).slice(0, 6)

  return (
    <div className={`${CARD} ed-rise`}>
      <div className="flex items-center justify-between">
        <p className={`${DISPLAY} text-sm font-medium text-[#0b1f3a]`}>Category {index + 1}</p>
        {canRemove && (
          <button type="button" onClick={onRemove} aria-label={`Remove category ${index + 1}`} className={`grid h-8 w-8 cursor-pointer place-items-center rounded-md text-[#7a2e3a] transition hover:bg-[#f8eeef] ${FOCUS}`}>
            <TrashIcon />
          </button>
        )}
      </div>

      <div className="grid grid-cols-[150px_1fr] gap-3">
        <div className="grid gap-1.5">
          <label htmlFor={`${id}-cat`} className="text-xs font-bold text-[#0b1f3a]">Category</label>
          <select id={`${id}-cat`} value={group.category} onChange={(e) => onChange({ category: e.target.value })} className={`${INPUT} cursor-pointer`}>
            {SKILL_CATEGORIES.map((c) => (
              <option key={c} value={c} disabled={usedElsewhere.includes(c)}>{c}</option>
            ))}
          </select>
        </div>
        <Field
          label="Skills, separated by commas"
          value={group.items}
          onChange={(e) => onChange({ items: e.target.value })}
          placeholder={SKILL_HINTS[group.category] || 'Add your skills'}
        />
      </div>

      {list.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label={`${group.category} you added`}>
          {list.map((s, i) => (
            <span key={`${s}-${i}`} className="ed-pop inline-flex items-center gap-1.5 rounded-full bg-[#0b1f3a] py-1.5 pl-3.5 pr-2 text-xs font-bold text-white">
              {s}
              <button type="button" aria-label={`Remove ${s}`} onClick={() => setList(list.filter((_, idx) => idx !== i))} className={`grid h-5 w-5 cursor-pointer place-items-center rounded-full transition hover:bg-white/20 ${FOCUS}`}>
                <CloseIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-[#0b1f3a]">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => setList([...list, s])} className={`inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#dde8f3] bg-white px-3 py-1.5 text-xs font-bold text-[#0b1f3a] transition duration-300 hover:-translate-y-0.5 hover:border-[#5b9bd5] hover:bg-[#f6faff] ${FOCUS}`}>
                <PlusIcon className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* Contact links such as LinkedIn, GitHub or a portfolio. */
function LinksEditor({ links, onChange }) {
  const update = (i, patch) => onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))
  return (
    <div className="grid gap-2.5">
      <div>
        <p className="text-xs font-bold text-[#0b1f3a]">Links</p>
        <p className="mt-0.5 text-xs text-[#4a5a70]">LinkedIn, GitHub, portfolio or any page you want employers to see.</p>
      </div>
      {links.map((l, i) => (
        <div key={i} className="ed-rise grid grid-cols-[112px_1fr_auto] items-center gap-2">
          <select
            aria-label={`Link ${i + 1} type`}
            value={l.type}
            onChange={(e) => update(i, { type: e.target.value })}
            className={`${INPUT} cursor-pointer`}
          >
            {LINK_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <input
            aria-label={`Link ${i + 1} address`}
            type="url"
            value={l.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="linkedin.com/in/yourname"
            className={INPUT}
          />
          <button type="button" onClick={() => onChange(links.filter((_, idx) => idx !== i))} aria-label={`Remove link ${i + 1}`} className={`grid h-9 w-9 cursor-pointer place-items-center rounded-md text-[#7a2e3a] transition hover:bg-[#f8eeef] ${FOCUS}`}>
            <TrashIcon />
          </button>
        </div>
      ))}
      {links.length < MAX_LINKS && (
        <button type="button" onClick={() => onChange([...links, blankLink()])} className={`inline-flex w-fit cursor-pointer items-center gap-1.5 rounded text-xs font-bold text-[#2f6fa8] hover:underline ${FOCUS}`}>
          <PlusIcon className="h-3.5 w-3.5" /> Add a link
        </button>
      )}
    </div>
  )
}

function ScoreRing({ score, size = 56, stroke = 5, dark = true }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const shown = useCountUp(score)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.14)' : '#dde8f3'} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={scoreColor(score)} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2,0.7,0.2,1), stroke 0.4s' }}
        />
      </svg>
      <span
        className={`absolute inset-0 grid place-items-center font-medium ${DISPLAY} ${dark ? 'text-white' : 'text-[#0b1f3a]'}`}
        style={{ fontSize: size * 0.28 }}
      >
        {shown}%
      </span>
    </div>
  )
}

function ScoreCard({ analysis, onJump }) {
  const tip = analysis.tips[0]
  return (
    <div className="ed-down mx-4 mt-4 flex shrink-0 items-center gap-4 rounded-xl bg-[#0b1f3a] p-4 text-white shadow-[0_12px_30px_rgba(11,31,58,0.18)]">
      <ScoreRing score={analysis.score} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#b9cde4]">Resume score</p>
        <p className={`${DISPLAY} text-lg font-medium leading-tight`}>{scoreLabel(analysis.score)}</p>
        {tip ? (
          <button type="button" onClick={() => onJump(tip.step)} className={`mt-1.5 flex w-full cursor-pointer items-center gap-2 text-left text-xs text-[#cfe3f8] transition hover:text-white ${FOCUS}`}>
            <span className="truncate">Next: {tip.label}</span>
            <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white">+{tip.gain}%</span>
          </button>
        ) : (
          <p className="mt-1.5 text-xs text-[#8fe0b8]">Everything is filled in.</p>
        )}
      </div>
    </div>
  )
}

function Stepper({ step, done, onGo }) {
  return (
    <ol aria-label="Resume steps" className="flex shrink-0 items-start px-4 pb-1 pt-5">
      {STEPS.map((s, i) => {
        const active = i === step
        const complete = done[i] && !active
        return (
          <li key={s.id} className="relative min-w-0 flex-1">
            {i < LAST && (
              <span aria-hidden="true" className="absolute left-1/2 top-4 h-0.5 w-full -translate-y-1/2 bg-[#dde8f3]">
                <span className="block h-full bg-[#0b1f3a] transition-[width] duration-500 ease-out" style={{ width: i < step ? '100%' : '0%' }} />
              </span>
            )}
            <button
              type="button"
              onClick={() => onGo(i)}
              aria-current={active ? 'step' : undefined}
              aria-label={`${s.label}${complete ? ', complete' : ''}`}
              className={`relative z-10 mx-auto flex cursor-pointer flex-col items-center gap-1.5 rounded-md ${FOCUS}`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold transition duration-300 ${
                  active ? 'ed-ring border-[#0b1f3a] bg-[#0b1f3a] text-white'
                    : complete ? 'border-[#2f6fa8] bg-[#2f6fa8] text-white'
                    : i < step ? 'border-[#0b1f3a] bg-white text-[#0b1f3a]'
                    : 'border-[#cfdceb] bg-white text-[#4a5a70] hover:border-[#5b9bd5]'
                }`}
              >
                {complete ? <CheckIcon className="h-4 w-4" /> : i + 1}
              </span>
              <span className={`hidden whitespace-nowrap text-[10px] font-bold sm:block ${active ? 'text-[#0b1f3a]' : 'text-[#4a5a70]'}`}>{s.label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function ResumeEditing() {
  const { templateId } = useParams()
  // An unknown id (for example a template that was removed) falls back to the first template.
  const t = TEMPLATES.find((x) => x.id === templateId) || TEMPLATES[0]

  const navigate = useNavigate()
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const [params] = useSearchParams()
  // Opened from My Activities: load the saved resume instead of starting fresh.
  const [saved] = useState(() => (params.get('activity') ? getActivity(userId, params.get('activity')) : null))
  const [activityId, setActivityId] = useState(saved?.id || null)
  const [saveErr, setSaveErr] = useState('')

  // The paper size lives inside the resume data, so it is saved with the resume.
  // A new resume starts with the size picked on the templates page (?size=a4).
  const [data, setData] = useState(() => withDefaults(saved ? saved.data : { ...EMPTY, pageSize: params.get('size') }))
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [zi, setZi] = useState(DEFAULT_ZOOM)
  const [modal, setModal] = useState(!saved)
  const [started, setStarted] = useState(!!saved)
  const [scan, setScan] = useState('idle') // idle | scanning
  const [scanStep, setScanStep] = useState(0)
  const [fileName, setFileName] = useState('')
  const [notice, setNotice] = useState(saved ? 'Your saved resume is loaded. Make changes, then update it in My Activities.' : '')
  const [tab, setTab] = useState('edit') // mobile only
  const [fmt, setFmt] = useState('pdf')
  const [outName, setOutName] = useState(saved?.title || '')
  const [busy, setBusy] = useState(false)
  const [dlMsg, setDlMsg] = useState(null)
  const [downloaded, setDownloaded] = useState(false)
  const timers = useRef([])
  const bodyRef = useRef(null)
  const exportRef = useRef(null)

  const ps = pageOf(data.pageSize)
  const setPageSize = (id) => setData((d) => ({ ...d, pageSize: id }))

  const analysis = useMemo(() => analyse(data), [data])
  const done = useMemo(
    () =>
      STEPS.map((s) => {
        if (s.id === 'review') return analysis.score >= 80
        if (s.id === 'download') return downloaded
        const sec = analysis.sections.find((x) => x.step === s.id)
        return sec ? sec.pct >= 75 : false
      }),
    [analysis, downloaded]
  )
  const zoom = ZOOMS[zi]
  const expFilled = data.experience.some(isFilled)
  // Shown to people with no experience yet, until they pick Internship or fill in a job.
  const showInternHint = !expFilled && data.experience.every((e) => e.kind !== 'internship')

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }) }, [step])
  useEffect(() => {
    if (!modal || !started || scan !== 'idle') return
    const onKey = (e) => e.key === 'Escape' && setModal(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal, started, scan])

  const go = (i) => { setDir(i >= step ? 1 : -1); setStep(i) }

  const setField = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }))
  const setItem = (key, i, field) => (e) =>
    setData((d) => ({ ...d, [key]: d[key].map((it, idx) => (idx === i ? { ...it, [field]: e.target.value } : it)) }))
  const setRich = (key, i) => ({ text, format }) =>
    setData((d) => ({ ...d, [key]: d[key].map((it, idx) => (idx === i ? { ...it, details: text, format } : it)) }))
  const setKind = (i, kind) =>
    setData((d) => ({ ...d, experience: d.experience.map((it, idx) => (idx === i ? { ...it, kind } : it)) }))
  const addItem = (key, blank) => setData((d) => ({ ...d, [key]: [...(d[key] || []), blank] }))
  const removeItem = (key, i) => setData((d) => ({ ...d, [key]: d[key].filter((_, idx) => idx !== i) }))

  /* Skill categories */
  const updateGroup = (i, patch) =>
    setData((d) => ({ ...d, skillGroups: d.skillGroups.map((g, idx) => (idx === i ? { ...g, ...patch } : g)) }))
  const removeGroup = (i) =>
    setData((d) => ({ ...d, skillGroups: d.skillGroups.filter((_, idx) => idx !== i) }))
  const addGroup = () =>
    setData((d) => {
      const used = d.skillGroups.map((g) => g.category)
      const next = SKILL_CATEGORIES.find((c) => !used.includes(c))
      return next ? { ...d, skillGroups: [...d.skillGroups, blankSkillGroup(next)] } : d
    })

  /* Placeholder scan: shows progress, then fills the form with sample data.
     TODO: send the file to your backend or an AI service and use the parsed details instead of SAMPLE. */
  const startUpload = (file) => {
    if (!file) return
    timers.current.forEach(clearTimeout)
    setFileName(file.name)
    setScan('scanning')
    setScanStep(0)
    timers.current = [
      setTimeout(() => setScanStep(1), 800),
      setTimeout(() => setScanStep(2), 1600),
      setTimeout(() => {
        setData((d) => withDefaults({ ...SAMPLE, pageSize: d.pageSize }))
        setNotice(`We filled the form from ${file.name}. Check each field before you finish.`)
        setScan('idle')
        setModal(false)
        setStarted(true)
        setDir(1)
        setStep(0)
      }, 2600),
    ]
  }

  const startBlank = () => {
    setData((d) => withDefaults({ ...EMPTY, pageSize: d.pageSize }))
    setNotice('')
    setStarted(true)
    setStep(0)
    setModal(false)
  }

  /* ---------------- Download ---------------- */
  const defaultName = `${(data.name || 'My').trim().replace(/\s+/g, '-')}-Resume`

  const handleDownload = async () => {
    setBusy(true)
    setDlMsg(null)
    try {
      const name = safeName(outName.trim() || defaultName)
      if (fmt === 'png') await exportPng(exportRef.current, name)
      else await exportPdf(exportRef.current, name, ps)
      setDownloaded(true)
      setDlMsg({
        ok: true,
        text: fmt === 'pdf' ? `Your print dialog is open. Choose "Save as PDF" as the destination. Paper size: ${ps.label}.` : `Saved ${name}.${fmt}.`,
      })
    } catch (err) {
      console.error(err)
      setDlMsg({ ok: false, text: 'We could not create that file. Try again or choose another format.' })
    } finally {
      setBusy(false)
    }
  }

  /* Saves the resume in this browser under My Activities, then opens that page. */
  const handleAddToActivities = () => {
    const id = activityId || newActivityId()
    const title = outName.trim() || defaultName.replace(/-/g, ' ')
    const res = saveActivity(userId, { id, title, templateId: t.id, data, score: analysis.score })
    if (!res.ok) { setSaveErr(res.error); return }
    setSaveErr('')
    setActivityId(id)
    navigate('/dashboard/resumes', { state: { added: title, updated: !!activityId } })
  }

  /* ---------------- Step content ---------------- */
  const renderStep = () => {
    switch (STEPS[step].id) {
      case 'personal':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" value={data.name} onChange={setField('name')} placeholder="Amelia Reyes" autoComplete="name" />
              <Field label="Job title" value={data.title} onChange={setField('title')} placeholder="Marketing Manager" />
              <Field label="Email" type="email" value={data.email} onChange={setField('email')} placeholder="you@email.com" autoComplete="email" />
              <Field label="Phone" type="tel" value={data.phone} onChange={setField('phone')} placeholder="+63 900 000 0000" autoComplete="tel" />
              <Field label="Location" value={data.location} onChange={setField('location')} placeholder="Quezon City" className="col-span-2" />
            </div>
            <LinksEditor links={data.links} onChange={(links) => setData((d) => ({ ...d, links }))} />
          </>
        )

      case 'summary':
        return (
          <RichField
            label="Professional summary"
            rows={6}
            value={data.summary}
            format={data.summaryFormat}
            onChange={({ text, format }) => setData((d) => ({ ...d, summary: text, summaryFormat: format }))}
            placeholder="Marketing manager with 8 years of experience leading campaigns that grow revenue."
          />
        )

      case 'experience':
        return (
          <>
            {showInternHint && (
              <div className="flex items-start gap-3 rounded-xl bg-[#eef5fb] p-4 text-sm text-[#0b1f3a]">
                <p className="flex-1">
                  Fresh graduate or no work experience yet? Add an internship or your projects instead. Both count as experience.
                </p>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <button type="button" onClick={() => setKind(0, 'internship')} className={`cursor-pointer rounded text-sm font-bold text-[#2f6fa8] hover:underline ${FOCUS}`}>
                    Use internship
                  </button>
                  <button type="button" onClick={() => go(stepIndex('projects'))} className={`cursor-pointer rounded text-sm font-bold text-[#2f6fa8] hover:underline ${FOCUS}`}>
                    Add projects
                  </button>
                </div>
              </div>
            )}
            {data.experience.map((e, i) => {
              const intern = e.kind === 'internship'
              return (
                <div key={i} className={CARD}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={`${DISPLAY} text-sm font-medium text-[#0b1f3a]`}>{intern ? 'Internship' : 'Position'} {i + 1}</p>
                    <div className="flex items-center gap-2">
                      <KindSwitch value={e.kind || 'job'} onChange={(k) => setKind(i, k)} />
                      {data.experience.length > 1 && (
                        <button type="button" onClick={() => removeItem('experience', i)} aria-label={`Remove ${intern ? 'internship' : 'position'} ${i + 1}`} className={`grid h-8 w-8 cursor-pointer place-items-center rounded-md text-[#7a2e3a] transition hover:bg-[#f8eeef] ${FOCUS}`}>
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label={intern ? 'Intern role' : 'Job title'}
                      value={e.role}
                      onChange={setItem('experience', i, 'role')}
                      placeholder={intern ? 'IT / Technical Support Intern' : 'Senior Marketing Manager'}
                    />
                    <Field
                      label={intern ? 'Organization' : 'Company'}
                      value={e.company}
                      onChange={setItem('experience', i, 'company')}
                      placeholder={intern ? 'Philippine Red Cross' : 'Northwind Co.'}
                    />
                    <Field
                      label="Dates"
                      value={e.period}
                      onChange={setItem('experience', i, 'period')}
                      placeholder={intern ? 'Jan to Mar 2026' : '2021 to now'}
                      className="col-span-2"
                    />
                  </div>
                  <RichField
                    label={intern ? 'What you did' : 'Achievements'}
                    value={e.details}
                    format={e.format}
                    onChange={setRich('experience', i)}
                    placeholder={intern ? 'Describe your tasks and what you learned or achieved.' : 'Describe what you achieved and the results.'}
                  />
                </div>
              )
            })}
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => addItem('experience', blankExperience('job'))} className={ADD_BTN}>
                <PlusIcon /> Add a position
              </button>
              <button type="button" onClick={() => addItem('experience', blankExperience('internship'))} className={ADD_BTN}>
                <PlusIcon /> Add an internship
              </button>
            </div>
          </>
        )

      case 'projects':
        return (
          <>
            {data.projects.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#9cc3e8] bg-[#f6faff] p-5 text-sm text-[#4a5a70]">
                <p className={`${DISPLAY} text-base font-medium text-[#0b1f3a]`}>This step is optional</p>
                <p className="mt-1">
                  Add school, personal or capstone projects. If you have no work experience yet, projects count as your experience.
                </p>
              </div>
            )}
            {data.projects.map((p, i) => (
              <div key={i} className={`${CARD} ed-rise`}>
                <div className="flex items-center justify-between">
                  <p className={`${DISPLAY} text-sm font-medium text-[#0b1f3a]`}>Project {i + 1}</p>
                  <button type="button" onClick={() => removeItem('projects', i)} aria-label={`Remove project ${i + 1}`} className={`grid h-8 w-8 cursor-pointer place-items-center rounded-md text-[#7a2e3a] transition hover:bg-[#f8eeef] ${FOCUS}`}>
                    <TrashIcon />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Project name" value={p.name} onChange={setItem('projects', i, 'name')} placeholder="Online Store App" className="col-span-2" />
                  <Field label="Your role or tools used" value={p.tech} onChange={setItem('projects', i, 'tech')} placeholder="Full Stack Developer, or React, Node.js" className="col-span-2" />
                  <Field label="Link (optional)" value={p.link} onChange={setItem('projects', i, 'link')} placeholder="github.com/you/project" />
                  <Field label="Dates (optional)" value={p.period} onChange={setItem('projects', i, 'period')} placeholder="2025" />
                </div>
                <RichField label="What you built" value={p.details} format={p.format} onChange={setRich('projects', i)} placeholder="Describe what the project does and the result." />
              </div>
            ))}
            <button type="button" onClick={() => addItem('projects', blankProject())} className={ADD_BTN}>
              <PlusIcon /> {data.projects.length ? 'Add another project' : 'Add a project'}
            </button>
          </>
        )

      case 'education':
        return (
          <>
            {data.education.map((e, i) => (
              <div key={i} className={CARD}>
                <div className="flex items-center justify-between">
                  <p className={`${DISPLAY} text-sm font-medium text-[#0b1f3a]`}>School {i + 1}</p>
                  {data.education.length > 1 && (
                    <button type="button" onClick={() => removeItem('education', i)} aria-label={`Remove school ${i + 1}`} className={`grid h-8 w-8 cursor-pointer place-items-center rounded-md text-[#7a2e3a] transition hover:bg-[#f8eeef] ${FOCUS}`}>
                      <TrashIcon />
                    </button>
                  )}
                </div>
                <Field label="Degree" value={e.degree} onChange={setItem('education', i, 'degree')} placeholder="BS Business Administration" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="School" value={e.school} onChange={setItem('education', i, 'school')} placeholder="University of the Philippines" />
                  <Field label="Dates" value={e.period} onChange={setItem('education', i, 'period')} placeholder="2014 to 2018" />
                </div>
                <RichField
                  label="Details (optional)"
                  rows={3}
                  value={e.details}
                  format={e.format}
                  onChange={setRich('education', i)}
                  placeholder="Major, honors or relevant coursework."
                />
              </div>
            ))}
            <button type="button" onClick={() => addItem('education', blankEducation())} className={ADD_BTN}>
              <PlusIcon /> Add another school
            </button>
          </>
        )

      case 'skills':
        return (
          <>
            {data.skillGroups.map((g, i) => (
              <SkillGroupCard
                key={i}
                index={i}
                group={g}
                usedElsewhere={data.skillGroups.filter((_, idx) => idx !== i).map((x) => x.category)}
                canRemove={data.skillGroups.length > 1}
                onChange={(patch) => updateGroup(i, patch)}
                onRemove={() => removeGroup(i)}
              />
            ))}
            {data.skillGroups.length < SKILL_CATEGORIES.length && (
              <button type="button" onClick={addGroup} className={ADD_BTN}>
                <PlusIcon /> Add another category
              </button>
            )}
          </>
        )

      case 'review':
        return (
          <>
            <div className="flex items-center gap-5 rounded-xl border border-[#dde8f3] bg-[#f6faff] p-5">
              <ScoreRing score={analysis.score} size={104} stroke={9} dark={false} />
              <div>
                <p className={`${DISPLAY} text-xl font-medium text-[#0b1f3a]`}>{scoreLabel(analysis.score)}</p>
                <p className="mt-1 text-sm text-[#4a5a70]">
                  {analysis.tips.length
                    ? `Fix the items below to add up to ${100 - analysis.score}% to your score.`
                    : 'Every section is complete. Your resume is ready to send.'}
                </p>
              </div>
            </div>

            <div className="grid gap-3.5">
              {analysis.sections.map((s) => {
                const target = stepIndex(s.step)
                return (
                  <div key={s.id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-bold text-[#0b1f3a]">{STEPS[target].label}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-[#4a5a70]">{s.pct}%</span>
                        <button type="button" onClick={() => go(target)} className={`cursor-pointer rounded text-xs font-bold text-[#2f6fa8] hover:underline ${FOCUS}`}>Edit</button>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#dcebfa]">
                      <div className="ed-grow h-full origin-left rounded-full transition-[width] duration-700 ease-out" style={{ width: `${s.pct}%`, background: scoreColor(s.pct) }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {analysis.tips.length > 0 && (
              <div>
                <p className={`${DISPLAY} mb-2 text-base font-medium text-[#0b1f3a]`}>What to improve</p>
                <ul className="grid gap-2">
                  {analysis.tips.map((tip) => (
                    <li key={tip.label}>
                      <button type="button" onClick={() => go(tip.step)} className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#dde8f3] bg-white px-4 py-3 text-left text-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#5b9bd5] ${FOCUS}`}>
                        <span className="text-[#0b1f3a]">{tip.label}</span>
                        <span className="flex shrink-0 items-center gap-2 text-xs font-bold text-[#169b5b]">+{tip.gain}% <ChevronRight className="h-3.5 w-3.5 text-[#4a5a70]" /></span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )

      default:
        return (
          <>
            {analysis.score < 60 && (
              <div className="flex items-start gap-3 rounded-xl bg-[#fff6e6] p-4 text-sm text-[#5c3d00]">
                <p className="flex-1">Your score is {analysis.score}%. You can download now, or fix a few items first.</p>
                <button type="button" onClick={() => go(stepIndex('review'))} className={`shrink-0 cursor-pointer rounded font-bold underline ${FOCUS}`}>Review</button>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-bold text-[#0b1f3a]">Paper size</p>
              <PagePicker value={data.pageSize} onChange={(id) => { setPageSize(id); setDlMsg(null) }} />
            </div>

            <div role="radiogroup" aria-label="File format" className="grid gap-3">
              {FORMATS.map((f) => {
                const FIcon = FORMAT_ICON[f.icon]
                const on = fmt === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => { setFmt(f.id); setDlMsg(null) }}
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 text-left transition duration-300 ${FOCUS} ${
                      on ? 'border-[#0b1f3a] bg-[#f6faff] shadow-[0_8px_22px_rgba(11,31,58,0.08)]' : 'border-[#dde8f3] bg-white hover:-translate-y-0.5 hover:border-[#5b9bd5]'
                    }`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg transition duration-300 ${on ? 'bg-[#0b1f3a] text-white' : 'bg-[#eef5fb] text-[#0b1f3a]'}`}>
                      <FIcon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`${DISPLAY} block text-base font-medium text-[#0b1f3a]`}>{f.label}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-[#4a5a70]">{f.text}</span>
                    </span>
                    <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition duration-300 ${on ? 'border-[#0b1f3a] bg-[#0b1f3a] text-white' : 'border-[#cfdceb]'}`}>
                      {on && <CheckIcon className="h-3 w-3" />}
                    </span>
                  </button>
                )
              })}
            </div>

            <Field label="File name" value={outName} onChange={(e) => setOutName(e.target.value)} placeholder={defaultName} />

            <button type="button" onClick={handleDownload} disabled={busy} className={`${BTN_PRIMARY} w-full !py-3`}>
              <DownloadIcon /> {busy ? 'Preparing your file' : `Download ${FORMATS.find((f) => f.id === fmt).label}`}
            </button>

            {dlMsg && (
              <p
                role={dlMsg.ok ? 'status' : 'alert'}
                className={`ed-rise rounded-lg p-3 text-sm ${dlMsg.ok ? 'bg-[#eaf8f1] text-[#0f6b40]' : 'bg-[#f8eeef] text-[#7a2e3a]'}`}
              >
                {dlMsg.text}
              </p>
            )}

            <div className="mt-1 border-t border-[#dde8f3] pt-5">
              <p className="text-sm text-[#4a5a70]">
                {activityId ? 'Save your latest changes to the copy in My Activities.' : 'Keep this resume in My Activities so you can open and edit it later.'}
              </p>
              <button type="button" onClick={handleAddToActivities} className={`${BTN_GHOST} mt-3 w-full !py-3`}>
                <FolderPlusIcon /> {activityId ? 'Update in My Activities' : 'Add to My Activities'}
              </button>
              {saveErr && <p role="alert" className="mt-2 rounded-lg bg-[#f8eeef] p-3 text-sm text-[#7a2e3a]">{saveErr}</p>}
            </div>
          </>
        )
    }
  }

  const zoomBy = (n) => setZi((i) => Math.min(ZOOMS.length - 1, Math.max(0, i + n)))
  const zoomBtn = `grid h-9 w-9 cursor-pointer place-items-center rounded-full text-[#0b1f3a] transition duration-200 hover:bg-[#eef5fb] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${FOCUS}`

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#eef4fa] font-['Jost',sans-serif] text-[#111]">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes ed-up { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
          @keyframes ed-rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
          @keyframes ed-down { from { opacity: 0; transform: translateY(-14px) } to { opacity: 1; transform: none } }
          @keyframes ed-fade { from { opacity: 0 } to { opacity: 1 } }
          @keyframes ed-in-r { from { opacity: 0; transform: translateX(26px) } to { opacity: 1; transform: none } }
          @keyframes ed-in-l { from { opacity: 0; transform: translateX(-26px) } to { opacity: 1; transform: none } }
          @keyframes ed-pop { from { opacity: 0; transform: translateY(14px) scale(.96) } to { opacity: 1; transform: none } }
          @keyframes ed-sheet { from { opacity: 0; transform: translateY(30px) scale(.97) } to { opacity: 1; transform: none } }
          @keyframes ed-grow { from { transform: scaleX(0) } to { transform: none } }
          @keyframes ed-ring { from { box-shadow: 0 0 0 0 rgba(91,155,213,.55) } to { box-shadow: 0 0 0 12px rgba(91,155,213,0) } }
          @keyframes ed-scan { 0%, 100% { top: 6% } 50% { top: 90% } }
          .ed-up { animation: ed-up .6s cubic-bezier(.2,.7,.2,1) both }
          .ed-rise { animation: ed-rise .4s cubic-bezier(.2,.7,.2,1) both }
          .ed-down { animation: ed-down .6s cubic-bezier(.2,.7,.2,1) both }
          .ed-fade { animation: ed-fade .35s ease-out both }
          .ed-in-r { animation: ed-in-r .45s cubic-bezier(.2,.7,.2,1) both }
          .ed-in-l { animation: ed-in-l .45s cubic-bezier(.2,.7,.2,1) both }
          .ed-pop { animation: ed-pop .45s cubic-bezier(.2,.7,.2,1) both }
          .ed-sheet { animation: ed-sheet .9s .25s cubic-bezier(.2,.7,.2,1) both }
          .ed-grow { animation: ed-grow .8s .1s cubic-bezier(.2,.7,.2,1) both }
          .ed-ring { animation: ed-ring .9s ease-out 1 }
          .ed-scan { animation: ed-scan 1.8s ease-in-out infinite }
          .ed-stagger > * { animation: ed-rise .5s cubic-bezier(.2,.7,.2,1) both }
          .ed-stagger > *:nth-child(2) { animation-delay: 70ms }
          .ed-stagger > *:nth-child(3) { animation-delay: 140ms }
          .ed-stagger > *:nth-child(4) { animation-delay: 210ms }
          .ed-stagger > *:nth-child(5) { animation-delay: 280ms }
          .ed-stagger > *:nth-child(6) { animation-delay: 350ms }
          .ed-stagger > *:nth-child(n+7) { animation-delay: 420ms }
        }
      `}</style>

      {/* HEADER */}
      <header className="ed-down relative z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#dde8f3] bg-white px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link to="/dashboard/templates" className={`inline-flex shrink-0 items-center gap-1.5 rounded text-sm font-bold text-[#0b1f3a] transition hover:text-[#5b9bd5] ${FOCUS}`}>
            <ChevronLeft className="h-4 w-4" /> Templates
          </Link>
          <span className="hidden h-7 w-px bg-[#dde8f3] md:block" />
          <span className="hidden items-center gap-2 rounded-full border border-[#dde8f3] bg-[#f6faff] py-1.5 pl-3 pr-4 text-sm text-[#4a5a70] md:flex">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.accent }} />
            <span className="text-[#0b1f3a]">{t.name}</span> template
          </span>
        </div>
        <button type="button" onClick={() => { setScan('idle'); setModal(true) }} className={`${BTN_GHOST} !px-4`}>
          <UploadIcon /> <span className="hidden sm:inline">Import resume</span><span className="sm:hidden">Import</span>
        </button>
      </header>

      {/* MOBILE TABS */}
      <div className="relative grid shrink-0 grid-cols-2 border-b border-[#dde8f3] bg-white text-sm font-bold md:hidden">
        {['edit', 'preview'].map((k) => (
          <button key={k} type="button" onClick={() => setTab(k)} className={`py-3 capitalize transition ${tab === k ? 'text-[#0b1f3a]' : 'text-[#4a5a70]'}`}>{k}</button>
        ))}
        <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 w-1/2 bg-[#0b1f3a] transition-transform duration-300" style={{ transform: tab === 'preview' ? 'translateX(100%)' : 'none' }} />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* LEFT: guided form */}
        <aside className={`${tab === 'edit' ? 'flex' : 'hidden'} ed-in-l min-h-0 w-full flex-col bg-white md:flex md:w-[500px] md:shrink-0 md:border-r md:border-[#dde8f3]`}>
          <ScoreCard analysis={analysis} onJump={go} />
          <Stepper step={step} done={done} onGo={go} />

          {notice && (
            <div role="status" className="ed-down mx-5 mt-3 flex shrink-0 items-start gap-3 rounded-lg bg-[#eef5fb] p-3 text-sm text-[#0b1f3a]">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#2f6fa8] text-white"><CheckIcon className="h-3 w-3" /></span>
              <p className="flex-1">{notice}</p>
              <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message" className={`grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded text-[#4a5a70] hover:text-[#0b1f3a] ${FOCUS}`}><CloseIcon className="h-3.5 w-3.5" /></button>
            </div>
          )}

          <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5">
            <div key={step} className={dir > 0 ? 'ed-in-r' : 'ed-in-l'}>
              <p className="text-xs font-bold text-[#5b9bd5]">Step {step + 1} of {STEPS.length}</p>
              <h2 className={`${DISPLAY} mt-0.5 text-[1.5rem] font-medium leading-tight text-[#0b1f3a]`}>{STEPS[step].title}</h2>
              <p className="mb-5 mt-1 text-sm text-[#4a5a70]">{STEPS[step].hint}</p>
              <div className="ed-stagger grid gap-4">{renderStep()}</div>
            </div>
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#dde8f3] bg-white px-5 py-3.5 shadow-[0_-8px_24px_rgba(11,31,58,0.04)]">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className={BTN_GHOST}>
              <ChevronLeft /> Back
            </button>
            {step < LAST ? (
              <button type="button" onClick={() => go(step + 1)} className={BTN_PRIMARY}>
                {STEPS[step + 1].id === 'projects' ? 'Next: Projects (optional)' : `Next: ${STEPS[step + 1].label}`} <ChevronRight />
              </button>
            ) : (
              <button type="button" onClick={() => setTab('preview')} className={`${BTN_PRIMARY} md:hidden`}>View resume</button>
            )}
          </footer>
        </aside>

        {/* RIGHT: live preview */}
        <main className={`${tab === 'preview' ? 'block' : 'hidden'} relative min-w-0 flex-1 md:block`}>
          <span className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-[#dde8f3] bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#0b1f3a] shadow-sm backdrop-blur md:left-6 md:top-5">
            <span className="h-2 w-2 rounded-full bg-[#2fc27a]" /> Live preview
          </span>

          {/* Paper size */}
          <div className="absolute right-4 top-3 z-20 md:right-6 md:top-4">
            <PagePicker compact value={data.pageSize} onChange={setPageSize} />
          </div>

          <div className="h-full overflow-auto bg-[radial-gradient(#c3d6ea_1.1px,transparent_1.1px)] [background-size:24px_24px] px-4 pb-28 pt-16 md:px-10">
            <div
              className="ed-sheet mx-auto bg-white shadow-[0_24px_60px_rgba(11,31,58,0.16)]"
              style={{ width: `calc(min(680px, 100%) * ${zoom / 100})`, transition: 'width 0.3s cubic-bezier(0.2,0.7,0.2,1)' }}
            >
              <ResumePreview t={t} data={data} size={data.pageSize} />
            </div>
          </div>

          {/* Zoom controls */}
          <div className="ed-up absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-[#dde8f3] bg-white/95 p-1 shadow-[0_14px_34px_rgba(11,31,58,0.18)] backdrop-blur" role="group" aria-label="Zoom">
            <button type="button" aria-label="Zoom out" disabled={zi === 0} onClick={() => zoomBy(-1)} className={zoomBtn}><MinusIcon /></button>
            <button type="button" aria-label="Reset zoom to 100%" onClick={() => setZi(DEFAULT_ZOOM)} className={`min-w-[60px] cursor-pointer rounded-full px-2 py-2 text-center text-sm font-bold text-[#0b1f3a] transition hover:bg-[#eef5fb] ${FOCUS}`}>{zoom}%</button>
            <button type="button" aria-label="Zoom in" disabled={zi === ZOOMS.length - 1} onClick={() => zoomBy(1)} className={zoomBtn}><PlusIcon /></button>
          </div>
        </main>
      </div>

      {/* Full-size copy of the resume used for PDF and PNG export. Only mounted on the download step. */}
      {step === LAST && (
        <div aria-hidden="true" className="pointer-events-none fixed -left-[10000px] top-0">
          <div ref={exportRef} style={{ width: ps.w, background: '#fff' }}>
            <ResumePreview t={t} data={data} size={data.pageSize} />
          </div>
        </div>
      )}

      {/* START / IMPORT MODAL */}
      {modal && (
        <div
          className="ed-fade fixed inset-0 z-50 grid place-items-center bg-[#0b1f3a]/55 p-4 backdrop-blur-sm"
          onMouseDown={(e) => { if (e.target === e.currentTarget && started && scan === 'idle') setModal(false) }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="start-title" className="ed-pop relative w-full max-w-[600px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="h-1.5 bg-gradient-to-r from-[#0b1f3a] via-[#5b9bd5] to-[#0b1f3a]" />
            {started && scan === 'idle' && (
              <button type="button" onClick={() => setModal(false)} aria-label="Close" className={`absolute right-4 top-6 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-[#4a5a70] transition hover:bg-[#eef5fb] hover:text-[#0b1f3a] ${FOCUS}`}><CloseIcon /></button>
            )}

            <div className="p-6 md:p-8">
              {scan === 'scanning' ? (
                <div className="grid items-center gap-7 py-2 sm:grid-cols-[140px_1fr]">
                  <div className="relative mx-auto h-[172px] w-[132px] overflow-hidden rounded-lg border border-[#dde8f3] bg-[#f6faff] p-3.5">
                    <span className="block h-7 w-7 rounded-full bg-[#5b9bd5]" />
                    <span className="mt-2.5 block h-2 w-3/5 rounded-full bg-[#0b1f3a]" />
                    {[100, 90, 75, 100, 60, 85, 50].map((w, i) => (
                      <span key={i} className="mt-2 block h-1.5 rounded-full bg-[#cfe3f8]" style={{ width: `${w}%` }} />
                    ))}
                    <span className="ed-scan absolute inset-x-0 top-[6%] h-0.5 bg-[#5b9bd5] shadow-[0_0_14px_3px_rgba(91,155,213,0.7)]" />
                  </div>
                  <div>
                    <h2 id="start-title" className={`${DISPLAY} text-2xl font-medium text-[#0b1f3a]`}>Scanning your resume</h2>
                    <p className="mt-1 truncate text-sm text-[#4a5a70]">{fileName}</p>
                    <ul className="mt-5 grid gap-3 text-sm">
                      {['Reading your file', 'Finding your details', 'Filling in the form'].map((label, i) => (
                        <li key={label} className={`flex items-center gap-3 transition duration-300 ${i <= scanStep ? 'text-[#0b1f3a]' : 'text-[#9aaabd]'}`}>
                          <span className={`grid h-5 w-5 place-items-center rounded-full border-2 transition duration-300 ${i < scanStep ? 'border-[#2f6fa8] bg-[#2f6fa8] text-white' : i === scanStep ? 'border-[#5b9bd5]' : 'border-[#dde8f3]'}`}>
                            {i < scanStep && <CheckIcon className="h-3 w-3" />}
                          </span>
                          {label}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#dcebfa]">
                      <div className="h-full rounded-full bg-[#0b1f3a] transition-[width] duration-700 ease-out" style={{ width: `${((scanStep + 1) / 3) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 id="start-title" className={`${DISPLAY} text-[1.7rem] font-medium text-[#0b1f3a]`}>How would you like to start?</h2>
                  <p className="mt-1 text-sm text-[#4a5a70]">You are using the {t.name} template. You can change it any time.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <button type="button" onClick={startBlank} className={`group cursor-pointer rounded-xl border border-[#dde8f3] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#0b1f3a] hover:shadow-[0_14px_30px_rgba(11,31,58,0.1)] ${FOCUS}`}>
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#eef5fb] text-[#0b1f3a] transition duration-300 group-hover:bg-[#0b1f3a] group-hover:text-white"><PenIcon className="h-5 w-5" /></span>
                      <span className={`${DISPLAY} mt-4 block text-lg font-medium text-[#0b1f3a]`}>Create new</span>
                      <span className="mt-1 block text-sm text-[#4a5a70]">Start with a blank form and follow the steps.</span>
                    </button>
                    <label
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); startUpload(e.dataTransfer.files[0]) }}
                      className="group cursor-pointer rounded-xl border border-dashed border-[#5b9bd5] bg-[#f6faff] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#0b1f3a] hover:shadow-[0_14px_30px_rgba(11,31,58,0.1)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#5b9bd5]"
                    >
                      <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => startUpload(e.target.files[0])} />
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-[#2f6fa8] transition duration-300 group-hover:bg-[#0b1f3a] group-hover:text-white"><UploadIcon className="h-5 w-5" /></span>
                      <span className={`${DISPLAY} mt-4 block text-lg font-medium text-[#0b1f3a]`}>Upload existing</span>
                      <span className="mt-1 block text-sm text-[#4a5a70]">Drop a PDF or Word file. We scan it and fill the form for you.</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}