import { Fragment } from 'react'

/* ---------- Fonts ----------
   Load once in index.html:
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Inter:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap" />
   Without it, the templates fall back to Segoe UI / Arial.                 */
export const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Inter:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap'

/* ---------- Paper sizes ----------
   ratio  height divided by width
   css    value for the print @page size
   w, h   pixel size at 96 dpi (used for PDF and PNG export)             */
export const PAGE_SIZES = [
  { id: 'letter', label: 'Short (Letter)', short: 'Short', dim: '8.5 x 11 in', ratio: 11 / 8.5, css: '8.5in 11in', w: 816, h: 1056 },
  { id: 'a4', label: 'A4', short: 'A4', dim: '210 x 297 mm', ratio: 297 / 210, css: '210mm 297mm', w: 794, h: 1123 },
  { id: 'long', label: 'Long (Legal)', short: 'Long', dim: '8.5 x 13 in', ratio: 13 / 8.5, css: '8.5in 13in', w: 816, h: 1248 },
]
export const pageOf = (id) => PAGE_SIZES.find((p) => p.id === id) || PAGE_SIZES[0]

/* ---------- Bullet styles ---------- */
export const MARKERS = { disc: '•', circle: '○', square: '▪', arrow: '➤', check: '✓', dash: '–' }
export const BULLET_STYLES = [
  { id: 'disc', label: 'Dot' },
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
  { id: 'arrow', label: 'Arrow' },
  { id: 'check', label: 'Check mark' },
  { id: 'dash', label: 'Dash' },
]

/* ---------- Skill categories ---------- */
export const SKILL_CATEGORIES = ['Technical Skills', 'Soft Skills', 'Other Skills']

/* ---------- Blank / sample data ---------- */
const BULLETS = { mode: 'bullets', style: 'disc' }

/* kind is 'job' or 'internship'. Both are saved in the experience list. */
export const blankExperience = (kind = 'job') => ({ kind, role: '', company: '', period: '', details: '', format: { ...BULLETS } })
export const blankEducation = () => ({ school: '', degree: '', period: '', details: '', format: { ...BULLETS } })
export const blankProject = () => ({ name: '', tech: '', link: '', period: '', details: '', format: { ...BULLETS } })
export const blankLink = () => ({ type: 'LinkedIn', url: '' })
/* items is a comma separated string, for example "JavaScript, React, SQL". */
export const blankSkillGroup = (category = 'Technical Skills') => ({ category, items: '' })

export const EMPTY = {
  name: '', title: '', email: '', phone: '', location: '', summary: '',
  summaryFormat: { mode: 'paragraph', style: 'disc' },
  links: [],
  experience: [blankExperience()],
  projects: [],
  education: [blankEducation()],
  skillGroups: [blankSkillGroup()],
  pageSize: 'letter',
}

export const SAMPLE = {
  name: 'Amelia Reyes', title: 'Marketing Manager', email: 'amelia.reyes@email.com',
  phone: '+63 912 345 6789', location: 'Quezon City',
  summary: 'Marketing manager with 8 years of experience leading campaigns that grow revenue and brand reach. Skilled in digital strategy, team leadership, and turning customer data into clear, measurable results.',
  summaryFormat: { mode: 'paragraph', style: 'disc' },
  links: [{ type: 'LinkedIn', url: 'linkedin.com/in/ameliareyes' }],
  experience: [
    {
      kind: 'job', role: 'Senior Marketing Manager', company: 'Northwind Co.', period: '2021 to now',
      details: 'Led a team of six and raised qualified leads by 42%.\nLaunched three campaigns that doubled social engagement.',
      format: { mode: 'bullets', style: 'disc' },
    },
    {
      kind: 'job', role: 'Marketing Specialist', company: 'Bluepeak Digital', period: '2018 to 2021',
      details: 'Managed a monthly ad budget of PHP 1.2M across search and social.\nCut cost per lead by 28% through weekly A/B testing.',
      format: { mode: 'bullets', style: 'disc' },
    },
    {
      kind: 'internship', role: 'Marketing Intern', company: 'Brightside Agency', period: '2017 to 2018',
      details: 'Built weekly social media reports for five clients.\nHelped run two product launch events.',
      format: { mode: 'bullets', style: 'disc' },
    },
  ],
  projects: [],
  education: [{
    school: 'University of the Philippines', degree: 'BS Business Administration', period: '2014 to 2018',
    details: 'Major in Marketing Management', format: { mode: 'bullets', style: 'disc' },
  }],
  skillGroups: [
    { category: 'Technical Skills', items: 'Analytics, SEO, Copywriting, Budgeting' },
    { category: 'Soft Skills', items: 'Strategy, Team leadership' },
  ],
  pageSize: 'letter',
}

/* ---------- Templates ----------
   Every template is a single column with real text, so ATS can read it.

   header     left | center | banner
   heading    rule (line under title) | accent (colored title and line) | band (tinted bar)
   entry      role | company: which one is the bold first line of a job
   oneLine    true: "Role, Company" on one line
   eduFirst   degree | school: which one is bold in Education
   dates      right (aligned right) | inline ("Title - 2021 to 2024")
   skills     inline | grid (3 columns) | labelled (bullet with bold label)
              Each skill category gets its own label, line or block.
   order      order of the sections
   labels     rename section headings                                       */
const T = (o) => ({
  size: '1.85cqw', font: 'Arial, sans-serif', ink: '#111', accent: '#111', tint: '#eee', body: '#222',
  header: 'left', headRule: false, sep: '|', nameStyle: {}, titleStyle: {},
  heading: 'rule', headWeight: 700, headStyle: {},
  order: ['summary', 'experience', 'projects', 'education', 'skills'],
  labels: {}, entry: 'role', oneLine: false, eduFirst: 'degree',
  dates: 'right', dateStyle: {}, subStyle: {}, skills: 'inline', linkColor: 'inherit',
  tags: ['ats'], ...o,
})

export const TEMPLATES = [
  // 1. Classic serif, education first, diamond separators
  T({
    id: 'classic', name: 'Classic', font: "'Times New Roman', Times, serif", size: '1.75cqw',
    ink: '#000', accent: '#000', tint: '#e5e5e5', body: '#1a1a1a',
    nameStyle: { fontSize: '2.7em', fontWeight: 700, textTransform: 'uppercase' },
    titleStyle: { fontStyle: 'italic' },
    sep: '❖', headStyle: { fontSize: '1.05em' },
    order: ['summary', 'education', 'experience', 'projects', 'skills'],
    labels: { summary: 'Professional Summary' },
    entry: 'company', eduFirst: 'school',
    dateStyle: { fontWeight: 700, fontStyle: 'italic' }, subStyle: { fontStyle: 'italic' },
    skills: 'labelled', tags: ['ats', 'serif', 'fresh'],
  }),

  // 2. Professional blue, centered header
  T({
    id: 'professional', name: 'Professional Blue', font: "'Poppins', 'Segoe UI', Arial, sans-serif", size: '1.7cqw',
    ink: '#111827', accent: '#1d4ed8', tint: '#dbeafe',
    header: 'center',
    nameStyle: { fontSize: '2.4em', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' },
    titleStyle: { fontWeight: 600, textTransform: 'uppercase', color: '#111827' },
    heading: 'accent', headWeight: 500, labels: { summary: 'Objective' },
    entry: 'role', dateStyle: { fontWeight: 700 }, subStyle: { fontStyle: 'italic' },
    linkColor: '#1d4ed8', tags: ['ats', 'sans'],
  }),

  // 3. Gray banner header, 3 column skills
  T({
    id: 'banner', name: 'Gray Banner', font: "'Inter', 'Segoe UI', Arial, sans-serif",
    ink: '#333', accent: '#333', tint: '#f1f1f1', body: '#444',
    header: 'banner',
    nameStyle: { fontSize: '2.7em', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#3b3b3b' },
    titleStyle: { fontStyle: 'italic', letterSpacing: '0.12em', color: '#555' },
    sep: '•', labels: { experience: 'Work Experience' },
    entry: 'role', dates: 'inline', subStyle: { color: '#666' },
    skills: 'grid', tags: ['ats', 'sans'],
  }),

  // 4. Fresh graduate: centered serif, education before experience
  T({
    id: 'fresh-grad', name: 'Fresh Graduate', font: "'Times New Roman', Times, serif", size: '1.8cqw',
    ink: '#000', accent: '#000', tint: '#e5e5e5', body: '#1a1a1a',
    header: 'center',
    nameStyle: { fontSize: '2.4em', fontWeight: 700 },
    titleStyle: { fontSize: '0.95em' },
    headStyle: { fontSize: '1.05em' },
    order: ['summary', 'education', 'experience', 'projects', 'skills'],
    labels: { summary: 'Profile', experience: 'Work Experience' },
    entry: 'company', eduFirst: 'school', subStyle: { color: '#333', fontSize: '0.92em' },
    tags: ['ats', 'serif', 'fresh'],
  }),

  // 5. Soft band: tinted section bars, one line job titles
  T({
    id: 'soft-band', name: 'Soft Band', font: "'DM Sans', 'Segoe UI', Arial, sans-serif",
    ink: '#111', accent: '#5b7a99', tint: '#dbe3ec', body: '#222',
    header: 'center', headRule: true,
    nameStyle: { fontSize: '2.4em', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' },
    titleStyle: { fontSize: '0.95em' },
    heading: 'band', labels: { summary: 'Summary', experience: 'Work Experience', skills: 'Key Skills' },
    oneLine: true, skills: 'grid', tags: ['ats', 'sans'],
  }),
]

/* ---------- Helpers ---------- */
const ph = (v, p) => (v && String(v).trim() ? v : p)
const has = (v) => !!(v && String(v).trim())
const isFilled = (e) => has(e.role) || has(e.company)
const normUrl = (u) => (/^https?:\/\//i.test(u.trim()) ? u.trim() : `https://${u.trim()}`)
const showUrl = (u) => u.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '')
const parseList = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean)

/* Returns the skill categories that have at least one skill: [{ category, items: [..] }].
   Older saved resumes only have a plain `skills` string, so that is handled too. */
export function skillGroupsOf(d) {
  const raw = Array.isArray(d.skillGroups)
    ? d.skillGroups
    : d.skills
      ? [{ category: d.skillsTitle === 'Technical Skills' ? 'Technical Skills' : 'Other Skills', items: d.skills }]
      : []
  return raw
    .map((g) => ({ category: g.category || 'Skills', items: parseList(g.items) }))
    .filter((g) => g.items.length)
}

/* Section heading */
function Sec({ t, title, children }) {
  const base = { margin: 0, fontWeight: t.headWeight, textTransform: 'uppercase', marginBottom: '0.45em', ...t.headStyle }
  const style =
    t.heading === 'band'
      ? { ...base, background: t.tint, color: t.ink, padding: '0.35em 0.7em' }
      : t.heading === 'accent'
        ? { ...base, color: t.accent, borderBottom: `0.08em solid ${t.accent}`, paddingBottom: '0.25em' }
        : { ...base, color: t.ink, borderBottom: `0.08em solid ${t.ink}`, paddingBottom: '0.25em' }
  return (
    <div>
      <p style={style}>{title}</p>
      {children}
    </div>
  )
}

/* A clickable link in the full preview and exports. In thumbnails it is plain text,
   because thumbnails already sit inside a link. */
function Anchor({ url, plain, color }) {
  if (plain) return <span style={{ color: color || 'inherit' }}>{showUrl(url)}</span>
  return (
    <a href={normUrl(url)} target="_blank" rel="noreferrer" style={{ color: color || 'inherit', textDecoration: 'none' }}>
      {showUrl(url)}
    </a>
  )
}

/* Paragraph, bullet or numbered text, depending on the chosen format. */
function RichText({ t, text, format, fallback }) {
  const f = format || { mode: 'paragraph', style: 'disc' }
  const body = { lineHeight: 1.45, color: t.body }
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean)

  if (f.mode === 'paragraph' || !lines.length) {
    if (!lines.length && !fallback) return null
    return <p style={{ ...body, margin: 0, whiteSpace: 'pre-line' }}>{lines.length ? lines.join('\n') : fallback}</p>
  }
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {lines.map((line, i) => (
        <li key={i} style={{ ...body, display: 'flex', gap: '0.55em', marginBottom: '0.15em', paddingLeft: '0.6em' }}>
          <span style={{ flexShrink: 0, minWidth: '1em', color: t.ink }}>
            {f.mode === 'numbered' ? `${i + 1}.` : MARKERS[f.style] || MARKERS.disc}
          </span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

/* Left text, optional right text on the same line. */
function Row({ left, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1em' }}>
      <div style={{ minWidth: 0, wordBreak: 'break-word' }}>{left}</div>
      {right ? <div style={{ flexShrink: 0, textAlign: 'right', whiteSpace: 'nowrap' }}>{right}</div> : null}
    </div>
  )
}

/* Bold first line (with the date on the right or inline) and an optional second line. */
function Head({ t, main, sub, date, subRight }) {
  const inline = t.dates === 'inline'
  const first = inline && has(date) ? `${main} - ${date}` : main
  return (
    <div style={{ lineHeight: 1.45, color: t.body }}>
      <Row
        left={<span style={{ fontWeight: 700, color: t.ink }}>{first}</span>}
        right={!inline && has(date) ? <span style={t.dateStyle}>{date}</span> : null}
      />
      {(has(sub) || subRight) && (
        <Row
          left={<span style={t.subStyle}>{sub}</span>}
          right={subRight ? <span style={t.subStyle}>{subRight}</span> : null}
        />
      )}
    </div>
  )
}

/* Resume page. `size` is letter, a4 or long. All sizes use cqw, so it scales from a thumbnail to a full preview. */
export function ResumePreview({ t, data: d, thumb = false, size = 'letter' }) {
  const ps = pageOf(size)
  const L = { summary: 'Professional Summary', experience: 'Experience', projects: 'Projects', education: 'Education', ...t.labels }
  const groups = skillGroupsOf(d)
  const links = (d.links || []).filter((l) => has(l.url))
  const projects = (d.projects || []).filter((p) => has(p.name))
  const experience = d.experience || []
  const education = d.education || []
  const expFilled = experience.some(isFilled)
  // With no work experience but some projects, the projects stand in for experience.
  const showExp = expFilled || projects.length === 0
  const expList = expFilled ? experience.filter(isFilled) : experience
  const internOnly = expFilled && expList.every((e) => e.kind === 'internship')

  /* ----- header ----- */
  const contactItems = [d.email, d.phone, d.location].filter(Boolean).map((x, i) => <span key={`c${i}`}>{x}</span>)
  links.forEach((l, i) => contactItems.push(<Anchor key={`l${i}`} url={l.url} plain={thumb} color={t.linkColor} />))
  const contact = contactItems.length
    ? contactItems.map((n, i) => (
        <Fragment key={i}>
          {i > 0 && <span style={{ margin: '0 0.55em' }}>{t.sep}</span>}
          {n}
        </Fragment>
      ))
    : 'email@example.com | +00 000 000 000'

  const banner = t.header === 'banner'
  const headerStyle = {
    textAlign: t.header === 'center' ? 'center' : 'left',
    ...(banner
      ? { background: t.tint, margin: '-6cqw -6cqw 0', padding: '6cqw 6cqw 5cqw' }
      : t.headRule
        ? { borderBottom: '0.08em solid #e3e6ea', paddingBottom: '0.8em' }
        : {}),
  }
  const header = (
    <div style={headerStyle}>
      <p style={{ margin: 0, lineHeight: 1.1, color: t.ink, ...t.nameStyle }}>{ph(d.name, 'Your Name')}</p>
      <p style={{ margin: 0, marginTop: '0.3em', color: t.body, ...t.titleStyle }}>{ph(d.title, 'Job title')}</p>
      <p style={{ margin: 0, fontSize: '0.85em', marginTop: '0.4em', color: t.body, wordBreak: 'break-word' }}>{contact}</p>
    </div>
  )

  /* ----- sections ----- */
  const summary = (
    <Sec t={t} title={L.summary}>
      <RichText t={t} text={d.summary} format={d.summaryFormat} fallback="Your short professional summary appears here." />
    </Sec>
  )

  const expMain = (e) =>
    t.oneLine
      ? [ph(e.role, 'Job title'), e.company].filter(has).join(', ')
      : t.entry === 'company' ? ph(e.company, 'Company') : ph(e.role, 'Job title')
  const expSub = (e) => (t.oneLine ? '' : t.entry === 'company' ? e.role : e.company)

  const exp = showExp && expList.length > 0 && (
    <Sec t={t} title={internOnly ? 'Internship' : L.experience}>
      {expList.map((e, i) => (
        <div key={i} style={{ marginBottom: '0.6em' }}>
          <Head t={t} main={expMain(e)} sub={expSub(e)} date={e.period} />
          <RichText t={t} text={e.details} format={e.format} fallback="Describe what you achieved." />
        </div>
      ))}
    </Sec>
  )

  const projectsSec = projects.length > 0 && (
    <Sec t={t} title={L.projects}>
      {projects.map((p, i) => (
        <div key={i} style={{ marginBottom: '0.6em' }}>
          <Head
            t={t}
            main={p.name}
            sub={p.tech}
            date={p.period}
            subRight={has(p.link) ? <Anchor url={p.link} plain={thumb} color={t.linkColor} /> : null}
          />
          <RichText t={t} text={p.details} format={p.format} fallback="" />
        </div>
      ))}
    </Sec>
  )

  const edu = education.length > 0 && (
    <Sec t={t} title={L.education}>
      {education.map((e, i) => {
        const main = t.eduFirst === 'school' ? ph(e.school, 'School') : ph(e.degree, 'Degree')
        const sub = t.eduFirst === 'school' ? e.degree : e.school
        return (
          <div key={i} style={{ marginBottom: '0.5em' }}>
            <Head t={t} main={main} sub={sub} date={e.period} />
            <RichText t={t} text={e.details} format={e.format} fallback="" />
          </div>
        )
      })}
    </Sec>
  )

  const body = { lineHeight: 1.45, color: t.body }
  const skillsBody = !groups.length ? (
    <p style={{ ...body, margin: 0 }}>Your key skills</p>
  ) : (
    <div style={{ display: 'grid', gap: '0.35em' }}>
      {groups.map((g, gi) =>
        t.skills === 'grid' ? (
          <div key={gi}>
            <p style={{ ...body, margin: 0, fontWeight: 700, color: t.ink }}>{g.category}</p>
            <ul style={{ ...body, listStyle: 'none', margin: 0, padding: '0 0 0 0.6em', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2em 1.2em' }}>
              {g.items.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.5em' }}>
                  <span style={{ flexShrink: 0, color: t.ink }}>{MARKERS.disc}</span>
                  <span style={{ wordBreak: 'break-word' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : t.skills === 'labelled' ? (
          <div key={gi} style={{ ...body, display: 'flex', gap: '0.55em', paddingLeft: '0.6em' }}>
            <span style={{ flexShrink: 0, color: t.ink }}>{MARKERS.disc}</span>
            <span>
              <b style={{ color: t.ink }}>{g.category}: </b>
              {g.items.join(', ')}
            </span>
          </div>
        ) : (
          <p key={gi} style={{ ...body, margin: 0 }}>
            <b style={{ color: t.ink }}>{g.category}: </b>
            {g.items.join(', ')}
          </p>
        )
      )}
    </div>
  )
  const skillsSec = <Sec t={t} title={t.labels.skills || 'Skills'}>{skillsBody}</Sec>

  const blocks = { summary, experience: exp, projects: projectsSec, education: edu, skills: skillsSec }

  return (
    <div style={{ containerType: 'inline-size', fontFamily: t.font, background: '#fff', overflow: thumb ? 'hidden' : 'visible', aspectRatio: thumb ? `1 / ${ps.ratio}` : undefined }}>
      <div style={{ fontSize: t.size, minHeight: `calc(${(ps.ratio * 100).toFixed(2)}cqw - 1px)`, padding: '6cqw', color: t.body }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95em' }}>
          {header}
          {t.order.map((k) => <Fragment key={k}>{blocks[k]}</Fragment>)}
        </div>
      </div>
    </div>
  )
}