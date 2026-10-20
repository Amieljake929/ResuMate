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

/* ---------- Blank / sample data ---------- */
export const blankExperience = () => ({ role: '', company: '', period: '', details: '', format: { mode: 'bullets', style: 'disc' } })
export const blankEducation = () => ({ school: '', degree: '', period: '' })
export const blankProject = () => ({ name: '', tech: '', link: '', period: '', details: '', format: { mode: 'bullets', style: 'disc' } })
export const blankLink = () => ({ type: 'LinkedIn', url: '' })

export const EMPTY = {
  name: '', title: '', email: '', phone: '', location: '', photo: '', summary: '',
  summaryFormat: { mode: 'paragraph', style: 'disc' },
  links: [],
  experience: [blankExperience()],
  projects: [],
  education: [blankEducation()],
  skills: '',
  skillsTitle: 'Skills',
}

export const SAMPLE = {
  name: 'Amelia Reyes', title: 'Marketing Manager', email: 'amelia.reyes@email.com',
  phone: '+63 912 345 6789', location: 'Quezon City', photo: '',
  summary: 'Marketing manager with 8 years of experience leading campaigns that grow revenue and brand reach.',
  summaryFormat: { mode: 'paragraph', style: 'disc' },
  links: [{ type: 'LinkedIn', url: 'linkedin.com/in/ameliareyes' }],
  experience: [{
    role: 'Senior Marketing Manager', company: 'Northwind Co.', period: '2021 to now',
    details: 'Led a team of six and raised qualified leads by 42%.\nLaunched three campaigns that doubled social engagement.',
    format: { mode: 'bullets', style: 'disc' },
  }],
  projects: [],
  education: [{ school: 'University of the Philippines', degree: 'BS Business Administration', period: '2014 to 2018' }],
  skills: 'Strategy, Analytics, SEO, Copywriting',
  skillsTitle: 'Skills',
}

const T = (id, name, layout, font, ink, accent, tint, tags, photo = false) => ({ id, name, layout, font, ink, accent, tint, tags, photo })
export const TEMPLATES = [
  T('classic', 'Classic', 'single', "'Lora', Georgia, serif", '#0b1f3a', '#2f6fa8', '#eef5fb', ['ats', 'single']),
  T('docs-plain', 'Docs Plain', 'docs', 'Arial, sans-serif', '#202124', '#1a73e8', '#e8f0fe', ['gdocs', 'ats', 'single']),
  T('docs-modern', 'Docs Modern', 'docs', "'DM Sans', Arial, sans-serif", '#202124', '#188038', '#e6f4ea', ['gdocs', 'single']),
  T('executive', 'Executive', 'two', "'Playfair Display', Georgia, serif", '#1b3a34', '#2f6f62', '#edf5f2', ['two', 'profile'], true),
  T('atlas', 'Atlas', 'two', "'DM Sans', sans-serif", '#26262b', '#a07a3c', '#f6f1e7', ['two', 'ats']),
  T('modern', 'Modern', 'banner', "'Montserrat', sans-serif", '#3a1620', '#7a2e3a', '#f8eeef', ['single', 'profile'], true),
  T('compact', 'Compact', 'single', "'Raleway', sans-serif", '#0b3a4a', '#0f5c70', '#e8f3f6', ['single', 'ats']),
  T('horizon', 'Horizon', 'two', "'Jost', sans-serif", '#0b1f3a', '#5b9bd5', '#f1f7fd', ['two', 'profile'], true),
  T('minimal', 'Minimal', 'single', "'Outfit', sans-serif", '#111111', '#555555', '#f2f2f2', ['single', 'more']),
  T('elegant', 'Elegant', 'banner', "'Libre Baskerville', Georgia, serif", '#14213d', '#14213d', '#eef1f7', ['single', 'profile', 'more'], true),
  T('creative', 'Creative', 'two', "'Cormorant Garamond', Georgia, serif", '#2e2447', '#5b4a8a', '#f1eef8', ['two', 'more']),
  T('academic', 'Academic', 'docs', "'Lora', Georgia, serif", '#1f2937', '#374151', '#f3f4f6', ['single', 'ats', 'more']),
]

const ph = (v, p) => (v && v.trim() ? v : p)
const has = (v) => !!(v && String(v).trim())
const normUrl = (u) => (/^https?:\/\//i.test(u.trim()) ? u.trim() : `https://${u.trim()}`)
const showUrl = (u) => u.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '')
const BODY = { lineHeight: 1.5, color: '#44546a' }

function Sec({ t, title, children }) {
  return (
    <div>
      <p style={{ color: t.accent, fontWeight: 600, borderBottom: `1px solid ${t.layout === 'docs' ? '#dadce0' : t.tint}`, paddingBottom: '0.15em', marginBottom: '0.35em' }}>{title}</p>
      {children}
    </div>
  )
}

/* A clickable link in the full preview and exports. In thumbnails it is plain text,
   because thumbnails already sit inside a link. */
function Anchor({ url, plain }) {
  if (plain) return <span>{showUrl(url)}</span>
  return (
    <a href={normUrl(url)} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
      {showUrl(url)}
    </a>
  )
}

/* Paragraph, bullet or numbered text, depending on the chosen format. */
function RichText({ t, text, format, fallback }) {
  const f = format || { mode: 'paragraph', style: 'disc' }
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean)

  if (f.mode === 'paragraph' || !lines.length) {
    return <p style={{ ...BODY, whiteSpace: 'pre-line' }}>{lines.length ? lines.join('\n') : fallback}</p>
  }
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {lines.map((line, i) => (
        <li key={i} style={{ ...BODY, display: 'flex', gap: '0.55em', marginBottom: '0.15em' }}>
          <span style={{ flexShrink: 0, minWidth: '1.1em', color: t.accent, fontWeight: 600 }}>
            {f.mode === 'numbered' ? `${i + 1}.` : MARKERS[f.style] || MARKERS.disc}
          </span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

/* Letter-size resume. All sizes use cqw, so it scales from a thumbnail to a full preview. */
export function ResumePreview({ t, data: d, thumb = false }) {
  const banner = t.layout === 'banner'
  const two = t.layout === 'two'
  const contact = [d.email, d.phone, d.location].filter(Boolean).join('  |  ') || 'email@example.com | +00 000 000 000'
  const initials = (d.name || 'Your Name').split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const skills = (d.skills || '').split(',').map((x) => x.trim()).filter(Boolean)
  const links = (d.links || []).filter((l) => has(l.url))
  const projects = (d.projects || []).filter((p) => has(p.name))
  const expFilled = d.experience.some((e) => has(e.role) || has(e.company))
  // With no work experience but some projects, the projects stand in for experience.
  const showExp = expFilled || projects.length === 0

  const avatar = d.photo ? (
    <img
      src={d.photo}
      alt=""
      style={{ width: '6em', height: '6em', flexShrink: 0, borderRadius: '50%', objectFit: 'cover', border: banner ? '0.2em solid #fff' : 'none' }}
    />
  ) : (
    <div style={{ width: '6em', height: '6em', flexShrink: 0, borderRadius: '50%', background: banner ? '#fff' : t.accent, color: banner ? t.accent : '#fff', display: 'grid', placeItems: 'center', fontSize: '1.6em', fontWeight: 600 }}>
      {initials}
    </div>
  )
  const nameBlock = (
    <div>
      <p style={{ fontSize: '2.3em', lineHeight: 1.1, fontWeight: 600, color: banner ? '#fff' : t.ink }}>{ph(d.name, 'Your Name')}</p>
      <p style={{ color: banner ? 'rgba(255,255,255,0.85)' : t.accent, marginTop: '0.2em' }}>{ph(d.title, 'Job title')}</p>
      {!two && <p style={{ fontSize: '0.8em', marginTop: '0.3em', color: banner ? 'rgba(255,255,255,0.75)' : '#5b6b80' }}>{contact}</p>}
      {!two && links.length > 0 && (
        <p style={{ fontSize: '0.8em', marginTop: '0.15em', color: banner ? 'rgba(255,255,255,0.75)' : '#5b6b80' }}>
          {links.map((l, i) => (
            <span key={i}>
              {i > 0 && '  |  '}
              <Anchor url={l.url} plain={thumb} />
            </span>
          ))}
        </p>
      )}
    </div>
  )
  const summary = (
    <Sec t={t} title="Summary">
      <RichText t={t} text={d.summary} format={d.summaryFormat} fallback="Your short professional summary appears here." />
    </Sec>
  )
  const exp = showExp && (
    <Sec t={t} title="Experience">
      {d.experience.map((e, i) => (
        <div key={i} style={{ marginBottom: '0.6em' }}>
          <p style={{ ...BODY, color: t.ink, fontWeight: 600 }}>{ph(e.role, 'Job title')}{e.company ? `, ${e.company}` : ''}</p>
          {e.period && <p style={{ ...BODY, fontSize: '0.85em' }}>{e.period}</p>}
          <RichText t={t} text={e.details} format={e.format} fallback="Describe what you achieved." />
        </div>
      ))}
    </Sec>
  )
  const projectsSec = projects.length > 0 && (
    <Sec t={t} title="Projects">
      {projects.map((p, i) => (
        <div key={i} style={{ marginBottom: '0.6em' }}>
          <p style={{ ...BODY, color: t.ink, fontWeight: 600 }}>{p.name}{has(p.tech) ? `  |  ${p.tech}` : ''}</p>
          {(has(p.period) || has(p.link)) && (
            <p style={{ ...BODY, fontSize: '0.85em', wordBreak: 'break-word' }}>
              {has(p.period) && p.period}
              {has(p.period) && has(p.link) && '  |  '}
              {has(p.link) && <Anchor url={p.link} plain={thumb} />}
            </p>
          )}
          <RichText t={t} text={p.details} format={p.format} fallback="" />
        </div>
      ))}
    </Sec>
  )
  const edu = (
    <Sec t={t} title="Education">
      {d.education.map((e, i) => (
        <div key={i} style={{ marginBottom: '0.4em' }}>
          <p style={{ ...BODY, color: t.ink, fontWeight: 600 }}>{ph(e.degree, 'Degree')}</p>
          <p style={BODY}>{[e.school, e.period].filter(Boolean).join(', ') || 'School, years'}</p>
        </div>
      ))}
    </Sec>
  )
  const skillsSec = (
    <Sec t={t} title={d.skillsTitle || 'Skills'}>
      <p style={BODY}>{skills.length ? skills.join(', ') : 'Your key skills'}</p>
    </Sec>
  )

  return (
    <div style={{ containerType: 'inline-size', fontFamily: t.font, background: '#fff', overflow: thumb ? 'hidden' : 'visible', aspectRatio: thumb ? '8.5 / 11' : undefined }}>
      <div style={{ fontSize: '1.9cqw', minHeight: '129.4cqw', display: two ? 'flex' : 'block', padding: two ? 0 : '6cqw' }}>
        {two ? (
          <>
            <div style={{ width: '32%', background: t.tint, padding: '6cqw 3.5cqw', display: 'flex', flexDirection: 'column', gap: '1em' }}>
              {t.photo && avatar}
              <Sec t={t} title="Contact">
                <p style={{ ...BODY, wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{contact.split('  |  ').join('\n')}</p>
                {links.map((l, i) => (
                  <p key={i} style={{ ...BODY, wordBreak: 'break-word' }}>
                    <Anchor url={l.url} plain={thumb} />
                  </p>
                ))}
              </Sec>
              {skillsSec}
            </div>
            <div style={{ flex: 1, padding: '6cqw 5cqw', display: 'flex', flexDirection: 'column', gap: '1em' }}>
              {nameBlock}{summary}{exp}{projectsSec}{edu}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <div style={banner ? { background: t.accent, margin: '-6cqw -6cqw 0', padding: '6cqw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1em' } : { borderBottom: `1px solid ${t.layout === 'docs' ? '#dadce0' : t.tint}`, paddingBottom: '0.8em' }}>
              {nameBlock}
              {banner && t.photo && avatar}
            </div>
            {summary}{exp}{projectsSec}{edu}{skillsSec}
          </div>
        )}
      </div>
    </div>
  )
}