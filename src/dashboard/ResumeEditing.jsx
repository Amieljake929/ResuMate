import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  EMPTY, SAMPLE, TEMPLATES, ResumePreview,
  MARKERS, BULLET_STYLES, blankExperience, blankEducation,
} from '../editing/templateData'

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const DISPLAY = "font-['Outfit','Jost',sans-serif]"

const STEPS = [
  { id: 'personal', label: 'Personal', title: 'Personal details', hint: 'Start with how employers can reach you.' },
  { id: 'summary', label: 'Summary', title: 'Professional summary', hint: 'Two or three sentences that sell your experience.' },
  { id: 'experience', label: 'Experience', title: 'Work experience', hint: 'List your latest role first and show the results you delivered.' },
  { id: 'education', label: 'Education', title: 'Education', hint: 'Add your degrees, schools and years.' },
  { id: 'skills', label: 'Skills', title: 'Skills', hint: 'Pick the skills that match the jobs you want.' },
  { id: 'review', label: 'Review', title: 'Review your resume', hint: 'See your score and fix what is still missing.' },
]
const LAST = STEPS.length - 1
const ZOOMS = [50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200]
const DEFAULT_ZOOM = ZOOMS.indexOf(100)
const SUGGESTED_SKILLS = ['Communication', 'Teamwork', 'Problem solving', 'Leadership', 'Time management', 'Project management', 'Microsoft Office', 'Customer service']

const INPUT =
  'w-full rounded-lg border border-[#dde8f3] bg-[#f6faff] px-3.5 py-2.5 text-sm text-[#111] transition placeholder:text-[#9aaabd] hover:border-[#c3d6ea] focus:border-[#5b9bd5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#5b9bd5]/15'
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'
const BTN_PRIMARY = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0b1f3a] px-5 py-2.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#17335c] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${FOCUS}`
const BTN_GHOST = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#dde8f3] bg-white px-5 py-2.5 text-sm font-bold text-[#0b1f3a] transition duration-300 hover:border-[#5b9bd5] hover:bg-[#f6faff] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const has = (v) => !!(v && String(v).trim())
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
const parseSkills = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean)
const frac = (arr, fn) => (arr.length ? arr.filter(fn).length / arr.length : 0)
const sum = (arr, fn) => arr.reduce((a, x) => a + fn(x), 0)

/* Works out the resume score, a score per section, and what to fix next. */
function analyse(d, t) {
  const exp = d.experience
  const edu = d.education
  const skills = parseSkills(d.skills)

  const S = {
    personal: [
      { label: 'Add your full name', pts: 8, got: has(d.name) ? 1 : 0 },
      { label: 'Add your job title', pts: 6, got: has(d.title) ? 1 : 0 },
      { label: 'Add a valid email address', pts: 6, got: /^\S+@\S+\.\S+$/.test((d.email || '').trim()) ? 1 : 0 },
      { label: 'Add a phone number', pts: 4, got: has(d.phone) ? 1 : 0 },
      { label: 'Add your location', pts: 3, got: has(d.location) ? 1 : 0 },
    ],
    summary: [
      { label: words(d.summary) ? 'Expand your summary to 2 or 3 sentences' : 'Write a short professional summary', pts: 15, got: Math.min(1, words(d.summary) / 25) },
    ],
    experience: [
      { label: 'Add a job title and company', pts: 12, got: frac(exp, (e) => has(e.role) && has(e.company)) },
      { label: 'Add your employment dates', pts: 5, got: frac(exp, (e) => has(e.period)) },
      { label: 'Describe what you achieved', pts: 13, got: exp.length ? sum(exp, (e) => Math.min(1, words(e.details) / 20)) / exp.length : 0 },
    ],
    education: [
      { label: 'Add your degree and school', pts: 9, got: frac(edu, (e) => has(e.degree) && has(e.school)) },
      { label: 'Add your study dates', pts: 3, got: frac(edu, (e) => has(e.period)) },
    ],
    skills: [
      { label: skills.length ? 'List at least 6 skills' : 'Add your key skills', pts: 13, got: Math.min(1, skills.length / 6) },
    ],
  }
  if (t.photo) S.personal.push({ label: 'Upload a profile photo', pts: 5, got: has(d.photo) ? 1 : 0 })

  const all = Object.values(S).flat()
  const total = sum(all, (i) => i.pts)
  const score = Math.round((sum(all, (i) => i.pts * i.got) / total) * 100)

  const sections = Object.entries(S).map(([id, items]) => ({
    id,
    pct: Math.round((sum(items, (i) => i.pts * i.got) / sum(items, (i) => i.pts)) * 100),
  }))

  const tips = Object.entries(S)
    .flatMap(([id, items]) =>
      items
        .filter((i) => i.got < 1)
        .map((i) => ({ label: i.label, gain: Math.max(1, Math.round(((1 - i.got) * i.pts / total) * 100)), step: STEPS.findIndex((s) => s.id === id) }))
    )
    .sort((a, b) => b.gain - a.gain)

  return { score, sections, tips }
}

const scoreColor = (n) => (n < 40 ? '#f2a93b' : n < 75 ? '#5b9bd5' : '#2fc27a')
const scoreLabel = (n) => (n < 25 ? 'Just getting started' : n < 50 ? 'Getting there' : n < 75 ? 'Looking good' : n < 90 ? 'Strong resume' : 'Excellent')

/* Crops the photo to a square and shrinks it so it stays light. */
const readPhoto = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const side = Math.min(img.width, img.height)
      const out = Math.min(480, side)
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = out
      canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, out, out)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('unreadable')) }
    img.src = url
  })

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
const CameraIcon = (p) => <Icon {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></Icon>
const PenIcon = (p) => <Icon {...p}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" /></Icon>
const ChevronLeft = (p) => <Icon {...p}><path d="M15 5l-7 7 7 7" /></Icon>
const ChevronRight = (p) => <Icon {...p}><path d="M9 5l7 7-7 7" /></Icon>
const CloseIcon = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>

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
function RichField({ label, value, format, onChange, placeholder, rows = 4 }) {
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

function PhotoUpload({ value, onChange }) {
  const [err, setErr] = useState('')
  const [drag, setDrag] = useState(false)

  const handle = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setErr('Please choose an image file, such as a JPG or PNG.'); return }
    if (file.size > 8 * 1024 * 1024) { setErr('That image is over 8 MB. Choose a smaller one.'); return }
    try { setErr(''); onChange(await readPhoto(file)) } catch { setErr('We could not read that image. Try another one.') }
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-bold text-[#0b1f3a]">Profile photo</p>
      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
        className={`flex cursor-pointer items-center gap-4 rounded-xl border border-dashed p-3.5 transition duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#5b9bd5] ${
          drag ? 'border-[#0b1f3a] bg-[#eaf3ff]' : 'border-[#9cc3e8] bg-[#f6faff] hover:border-[#0b1f3a]'
        }`}
      >
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => { handle(e.target.files[0]); e.target.value = '' }} />
        <span className="grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#dcebfa] text-[#5b9bd5]">
          {value ? <img key={value.slice(-24)} src={value} alt="Your profile" className="ed-pop h-full w-full object-cover" /> : <CameraIcon className="h-7 w-7" />}
        </span>
        <span className="grid gap-0.5">
          <span className="text-sm font-bold text-[#0b1f3a]">{value ? 'Change photo' : 'Upload a photo'}</span>
          <span className="text-xs text-[#4a5a70]">Drop an image here or click. It is cropped to a circle.</span>
        </span>
      </label>
      {value && (
        <button type="button" onClick={() => onChange('')} className="mt-2 cursor-pointer text-xs font-bold text-[#7a2e3a] hover:underline">Remove photo</button>
      )}
      {err && <p role="alert" className="mt-2 text-xs font-bold text-[#7a2e3a]">{err}</p>}
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
    <ol aria-label="Resume steps" className="flex shrink-0 items-start px-5 pb-1 pt-5">
      {STEPS.map((s, i) => {
        const active = i === step
        const complete = done[i] && !active
        return (
          <li key={s.id} className="relative flex-1">
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
              <span className={`hidden text-[11px] font-bold sm:block ${active ? 'text-[#0b1f3a]' : 'text-[#4a5a70]'}`}>{s.label}</span>
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
  const t = TEMPLATES.find((x) => x.id === templateId) || TEMPLATES[0]

  const [data, setData] = useState(EMPTY)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [zi, setZi] = useState(DEFAULT_ZOOM)
  const [modal, setModal] = useState(true)
  const [started, setStarted] = useState(false)
  const [scan, setScan] = useState('idle') // idle | scanning
  const [scanStep, setScanStep] = useState(0)
  const [fileName, setFileName] = useState('')
  const [notice, setNotice] = useState('')
  const [tab, setTab] = useState('edit') // mobile only
  const timers = useRef([])
  const bodyRef = useRef(null)

  const analysis = useMemo(() => analyse(data, t), [data, t])
  const done = useMemo(
    () => [...analysis.sections.map((s) => s.pct >= 75), analysis.score >= 80],
    [analysis]
  )
  const zoom = ZOOMS[zi]

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
  const setExpRich = (i) => ({ text, format }) =>
    setData((d) => ({ ...d, experience: d.experience.map((it, idx) => (idx === i ? { ...it, details: text, format } : it)) }))
  const addItem = (key, blank) => setData((d) => ({ ...d, [key]: [...d[key], blank] }))
  const removeItem = (key, i) => setData((d) => ({ ...d, [key]: d[key].filter((_, idx) => idx !== i) }))

  const skills = parseSkills(data.skills)
  const setSkills = (list) => setData((d) => ({ ...d, skills: list.join(', ') }))
  const suggestions = SUGGESTED_SKILLS.filter((s) => !skills.some((x) => x.toLowerCase() === s.toLowerCase())).slice(0, 6)

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
        setData(SAMPLE)
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
    setData(EMPTY)
    setNotice('')
    setStarted(true)
    setStep(0)
    setModal(false)
  }

  /* ---------------- Step content ---------------- */
  const renderStep = () => {
    switch (STEPS[step].id) {
      case 'personal':
        return (
          <>
            {t.photo && <PhotoUpload value={data.photo} onChange={(photo) => setData((d) => ({ ...d, photo }))} />}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" value={data.name} onChange={setField('name')} placeholder="Amelia Reyes" autoComplete="name" />
              <Field label="Job title" value={data.title} onChange={setField('title')} placeholder="Marketing Manager" />
              <Field label="Email" type="email" value={data.email} onChange={setField('email')} placeholder="you@email.com" autoComplete="email" />
              <Field label="Phone" type="tel" value={data.phone} onChange={setField('phone')} placeholder="+63 900 000 0000" autoComplete="tel" />
              <Field label="Location" value={data.location} onChange={setField('location')} placeholder="Quezon City" className="col-span-2" />
            </div>
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
            {data.experience.map((e, i) => (
              <div key={i} className="grid gap-3 rounded-xl border border-[#dde8f3] border-l-4 border-l-[#5b9bd5] bg-white p-4 shadow-[0_6px_18px_rgba(11,31,58,0.04)]">
                <div className="flex items-center justify-between">
                  <p className={`${DISPLAY} text-sm font-medium text-[#0b1f3a]`}>Position {i + 1}</p>
                  {data.experience.length > 1 && (
                    <button type="button" onClick={() => removeItem('experience', i)} aria-label={`Remove position ${i + 1}`} className={`grid h-8 w-8 cursor-pointer place-items-center rounded-md text-[#7a2e3a] transition hover:bg-[#f8eeef] ${FOCUS}`}>
                      <TrashIcon />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Job title" value={e.role} onChange={setItem('experience', i, 'role')} placeholder="Senior Marketing Manager" />
                  <Field label="Company" value={e.company} onChange={setItem('experience', i, 'company')} placeholder="Northwind Co." />
                  <Field label="Dates" value={e.period} onChange={setItem('experience', i, 'period')} placeholder="2021 to now" className="col-span-2" />
                </div>
                <RichField label="Achievements" value={e.details} format={e.format} onChange={setExpRich(i)} placeholder="Describe what you achieved and the results." />
              </div>
            ))}
            <button type="button" onClick={() => addItem('experience', blankExperience())} className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#9cc3e8] py-3 text-sm font-bold text-[#0b1f3a] transition duration-300 hover:border-[#0b1f3a] hover:bg-[#f6faff] ${FOCUS}`}>
              <PlusIcon /> Add another position
            </button>
          </>
        )

      case 'education':
        return (
          <>
            {data.education.map((e, i) => (
              <div key={i} className="grid gap-3 rounded-xl border border-[#dde8f3] border-l-4 border-l-[#5b9bd5] bg-white p-4 shadow-[0_6px_18px_rgba(11,31,58,0.04)]">
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
              </div>
            ))}
            <button type="button" onClick={() => addItem('education', blankEducation())} className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#9cc3e8] py-3 text-sm font-bold text-[#0b1f3a] transition duration-300 hover:border-[#0b1f3a] hover:bg-[#f6faff] ${FOCUS}`}>
              <PlusIcon /> Add another school
            </button>
          </>
        )

      case 'skills':
        return (
          <>
            <Field label="Skills, separated by commas" value={data.skills} onChange={setField('skills')} placeholder="Strategy, Analytics, SEO" />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2" aria-label="Your skills">
                {skills.map((s, i) => (
                  <span key={`${s}-${i}`} className="ed-pop inline-flex items-center gap-1.5 rounded-full bg-[#0b1f3a] py-1.5 pl-3.5 pr-2 text-xs font-bold text-white">
                    {s}
                    <button type="button" aria-label={`Remove ${s}`} onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className={`grid h-5 w-5 cursor-pointer place-items-center rounded-full transition hover:bg-white/20 ${FOCUS}`}>
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
                    <button key={s} type="button" onClick={() => setSkills([...skills, s])} className={`inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#dde8f3] bg-white px-3 py-1.5 text-xs font-bold text-[#0b1f3a] transition duration-300 hover:-translate-y-0.5 hover:border-[#5b9bd5] hover:bg-[#f6faff] ${FOCUS}`}>
                      <PlusIcon className="h-3 w-3" /> {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )

      default:
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
              {analysis.sections.map((s, i) => (
                <div key={s.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-bold text-[#0b1f3a]">{STEPS[i].label}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-[#4a5a70]">{s.pct}%</span>
                      <button type="button" onClick={() => go(i)} className={`cursor-pointer rounded text-xs font-bold text-[#2f6fa8] hover:underline ${FOCUS}`}>Edit</button>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#dcebfa]">
                    <div className="ed-grow h-full origin-left rounded-full transition-[width] duration-700 ease-out" style={{ width: `${s.pct}%`, background: scoreColor(s.pct) }} />
                  </div>
                </div>
              ))}
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
        <aside className={`${tab === 'edit' ? 'flex' : 'hidden'} ed-in-l min-h-0 w-full flex-col bg-white md:flex md:w-[460px] md:shrink-0 md:border-r md:border-[#dde8f3]`}>
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
                Next: {STEPS[step + 1].label} <ChevronRight />
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

          <div className="h-full overflow-auto bg-[radial-gradient(#c3d6ea_1.1px,transparent_1.1px)] [background-size:24px_24px] px-4 pb-28 pt-16 md:px-10">
            <div
              className="ed-sheet mx-auto bg-white shadow-[0_24px_60px_rgba(11,31,58,0.16)]"
              style={{ width: `calc(min(680px, 100%) * ${zoom / 100})`, transition: 'width 0.3s cubic-bezier(0.2,0.7,0.2,1)' }}
            >
              <ResumePreview t={t} data={data} />
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