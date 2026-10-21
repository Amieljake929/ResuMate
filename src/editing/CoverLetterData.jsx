import { pageOf } from './templateData'

/* Cover letter templates: data and the paper preview.
   Mirrors editing/templateData.jsx for resumes.

   preview     sample text shown inside the thumbnail (three short paragraphs so the sheet looks filled)
   paragraphs  the full letter with [bracketed] prompts, kept for the editor that comes later
   style       key into PREVIEW_STYLES                                                           */

/* ---------- Sample sender, used in every preview ---------- */
export const COVER_SAMPLE = {
  name: 'Amelia Reyes',
  title: 'Marketing Manager',
  email: 'amelia.reyes@email.com',
  phone: '+63 912 345 6789',
  date: '18 October 2026',
  recipient: ['Hiring Manager', 'Northwind Co.', 'Makati City'],
}

/* ---------- Templates ---------- */
export const COVER_LETTERS = [
  {
    id: 'formal',
    title: 'Formal',
    type: 'General purpose',
    description: 'Traditional business letter',
    tone: 'Confident and polished',
    style: 'formal',
    opening: 'Dear Hiring Manager,',
    preview: [
      'I am excited to apply for the Marketing Manager role at Northwind Co. Over eight years I have led campaigns that raised qualified leads by 42%.',
      'In my current role I manage a team of six and a monthly budget of PHP 1.2M, turning customer data into clear and measurable results.',
      'I would welcome the chance to bring the same results to your team. Thank you for your time and consideration.',
    ],
    paragraphs: [
      'I am excited to apply for the [Job Title] position at [Company]. With experience in [relevant area] and a record of [relevant achievement], I can contribute to the goals of your team.',
      'In my recent role at [Previous Company], I [describe a relevant accomplishment and its impact]. This experience strengthened my ability to [relevant skill], while working collaboratively to deliver reliable results.',
      'I would welcome the opportunity to bring my experience in [skill or specialty] to [Company]. Thank you for your time and consideration. I look forward to discussing how I can support your team.',
    ],
    closing: 'Sincerely,\n[Your Name]',
  },
  {
    id: 'modern',
    title: 'Modern',
    type: 'Career transition',
    description: 'Bold header for a new direction',
    tone: 'Adaptable and forward-looking',
    style: 'modern',
    opening: 'Dear Hiring Team,',
    preview: [
      'I am excited to apply for the Product Designer role at Northwind Co. I bring a fresh perspective and transferable experience from marketing.',
      'My recent UX projects helped me turn customer insights into clear, useful experiences, and I have completed a certificate in interaction design.',
      'I would appreciate the opportunity to discuss how my perspective could benefit your team. Thank you for your consideration.',
    ],
    paragraphs: [
      'I am writing to apply for the [Job Title] role at [Company]. I am making a deliberate transition from [Current Field] to [Target Field], bringing strengths in [transferable skill] and a strong commitment to learning the work.',
      'As a [Current or Previous Role], I [achievement that demonstrates a transferable skill]. I have also developed my knowledge of [target-field skill or tool] through [project, course, or practical experience], preparing me to contribute from day one.',
      'I am especially interested in [Company] because of [specific reason]. I would appreciate the opportunity to discuss how my perspective and transferable experience could benefit your team.',
    ],
    closing: 'Best regards,\n[Your Name]',
  },
  {
    id: 'simple',
    title: 'Simple',
    type: 'Entry level',
    description: 'Short, direct, and easy to scan',
    tone: 'Enthusiastic and capable',
    style: 'simple',
    opening: 'Dear Hiring Manager,',
    preview: [
      'I am applying for the Marketing Assistant role at Northwind Co. As a recent business graduate, I am ready to put my research and communication skills to work.',
      'My capstone project gave me hands-on experience turning audience research into a practical campaign, and I helped run two events as an intern.',
      'I admire Northwind Co. and would be excited to contribute my curiosity and care. Thank you for considering my application.',
    ],
    paragraphs: [
      'I am pleased to apply for the [Job Title] opening at [Company]. As a recent [Degree] graduate, I am eager to put my experience in [relevant subject or skill] to work on projects that support your team.',
      'During [internship, capstone, or campus project], I [describe a specific contribution]. I learned to [relevant skill] and collaborated with others to [result], experience that I am ready to build on in a professional setting.',
      'I admire [Company] for [specific reason], and I would be excited to contribute my curiosity, care, and willingness to learn. Thank you for considering my application.',
    ],
    closing: 'Kind regards,\n[Your Name]',
  },
  {
    id: 'executive',
    title: 'Executive',
    type: 'Management',
    description: 'Polished layout for senior roles',
    tone: 'Strategic and results-focused',
    style: 'executive',
    opening: 'Dear [Hiring Manager Name],',
    preview: [
      'I am interested in the Marketing Director opportunity at Northwind Co. I bring a track record of building teams and connecting strategy to measurable growth.',
      'At my current company, I led a cross-functional team that increased qualified leads by 42% while reducing cost per lead by 28%.',
      'I would welcome a conversation about the needs of the role and the results I could help your team deliver.',
    ],
    paragraphs: [
      'I am interested in the [Leadership Job Title] opportunity at [Company]. I bring [number] years of experience leading [function or team] and aligning day-to-day execution with wider business priorities.',
      'At [Previous Company], I led [team or initiative] to [measurable outcome]. My approach combines clear goals, thoughtful coaching, and cross-functional partnership so teams can make progress while maintaining high standards.',
      'The opportunity to help [Company] achieve [specific goal or initiative] is particularly compelling. I would welcome a conversation about the needs of the role and the results I could help your team deliver.',
    ],
    closing: 'Sincerely,\n[Your Name]',
  },
  {
    id: 'creative',
    title: 'Creative',
    type: 'Creative industries',
    description: 'Warm accent for creative applications',
    tone: 'Distinctive and personable',
    style: 'creative',
    opening: 'Hello [Hiring Manager Name],',
    preview: [
      'I am excited to share my work for the Brand Designer position at Northwind Co. I create thoughtful visual stories that help people connect with a brand.',
      'My recent campaign brought a new product identity to life across web, social, and print, and my portfolio shows the full process behind it.',
      'I would love to bring my experience to your team and explore what we could create together. Thank you for your time.',
    ],
    paragraphs: [
      'I am excited to share my work for the [Job Title] position at [Company]. I create [type of work] that helps [audience or business goal], combining a strong point of view with a practical understanding of the brief.',
      'Most recently, I [describe a relevant project]. I partnered with [team or client] to [your contribution], resulting in [outcome]. My portfolio at [Portfolio URL] includes this project and other examples of my process.',
      'I am drawn to [Company] because of [specific project, product, or value]. I would love to bring my experience in [specialty] to your team and explore what we could create together.',
    ],
    closing: 'Warmly,\n[Your Name]',
  },
]

/* ---------- Look of each design ----------
   ink     headings and the sender name
   text    body copy
   muted   date, contact line, secondary text
   accent  the one brand colour of the design (also used for the dot on the card)
   dark    a deeper shade of the accent (modern only)
   font    typeface of the whole letter                                                   */
const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'

export const PREVIEW_STYLES = {
  formal: { ink: '#0f2747', text: '#243447', muted: '#5f6f84', accent: '#0f2747', font: SERIF },
  modern: { ink: '#ffffff', text: '#263241', muted: '#64748b', accent: '#126274', dark: '#0c4552', font: SANS },
  simple: { ink: '#1e293b', text: '#334155', muted: '#6b7a90', accent: '#695293', font: SANS },
  executive: { ink: '#172b4d', text: '#2b3a52', muted: '#6b7688', accent: '#b18b4c', font: SERIF },
  creative: { ink: '#3b2a24', text: '#4a3b35', muted: '#85726a', accent: '#d46b50', font: SANS },
}

/* ---------- Letterheads ----------
   Each design has its own header so the five sheets look clearly different.
   All sizes use cqw (1% of the sheet width) so everything scales with the preview. */
function Letterhead({ kind, s, data }) {
  const initials = data.name
    .split(' ')
    .map((w) => w[0])
    .join('')

  if (kind === 'formal') {
    return (
      <div style={{ padding: '8cqw 8cqw 0' }}>
        <div className="flex items-end justify-between" style={{ gap: '3cqw' }}>
          <div>
            <p style={{ fontSize: '5.6cqw', fontWeight: 700, lineHeight: 1.05, color: s.ink, letterSpacing: '0.01em' }}>
              {data.name}
            </p>
            <p style={{ marginTop: '1.4cqw', fontSize: '2.9cqw', fontStyle: 'italic', color: s.muted }}>
              {data.title}
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '2.2cqw', lineHeight: 1.55, color: s.muted }}>
            <p>{data.email}</p>
            <p>{data.phone}</p>
          </div>
        </div>
        {/* Double rule, a classic letterhead detail */}
        <div style={{ marginTop: '3.4cqw', height: '0.5cqw', backgroundColor: s.accent }} />
        <div style={{ marginTop: '0.6cqw', height: '0.15cqw', backgroundColor: s.accent }} />
      </div>
    )
  }

  if (kind === 'modern') {
    return (
      <div>
        <div
          className="flex items-center justify-between"
          style={{ backgroundColor: s.accent, padding: '8cqw 8cqw 7cqw', gap: '3cqw' }}
        >
          <div>
            <p style={{ fontSize: '6cqw', fontWeight: 700, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.01em' }}>
              {data.name}
            </p>
            <p style={{ marginTop: '1.6cqw', fontSize: '2.9cqw', color: '#c9e6ec' }}>{data.title}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '2.2cqw', lineHeight: 1.55, color: '#e2f2f5' }}>
            <p>{data.email}</p>
            <p>{data.phone}</p>
          </div>
        </div>
        <div style={{ height: '1.2cqw', backgroundColor: s.dark }} />
      </div>
    )
  }

  if (kind === 'simple') {
    return (
      <div style={{ padding: '10cqw 9cqw 0' }}>
        <div style={{ width: '7cqw', height: '0.9cqw', backgroundColor: s.accent, marginBottom: '3.2cqw' }} />
        <p style={{ fontSize: '6cqw', fontWeight: 700, lineHeight: 1.05, color: s.ink, letterSpacing: '-0.01em' }}>
          {data.name}
        </p>
        <p style={{ marginTop: '1.6cqw', fontSize: '2.9cqw', fontWeight: 600, color: s.accent }}>{data.title}</p>
        <p style={{ marginTop: '1.6cqw', fontSize: '2.2cqw', color: s.muted }}>
          {data.email} &nbsp;&#8226;&nbsp; {data.phone}
        </p>
      </div>
    )
  }

  if (kind === 'executive') {
    return (
      <div style={{ padding: '9cqw 8cqw 0', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '5.2cqw',
            fontWeight: 600,
            lineHeight: 1.1,
            color: s.ink,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          {data.name}
        </p>
        <p style={{ marginTop: '2cqw', fontSize: '2.6cqw', fontStyle: 'italic', color: s.accent }}>{data.title}</p>
        <div style={{ margin: '3.4cqw auto 2.2cqw', height: '0.25cqw', backgroundColor: s.accent }} />
        <p style={{ fontSize: '2.2cqw', color: s.muted }}>
          {data.email} &nbsp;|&nbsp; {data.phone}
        </p>
      </div>
    )
  }

  /* creative */
  return (
    <div style={{ padding: '9cqw 8cqw 0 12cqw' }}>
      <div className="flex items-center" style={{ gap: '3.2cqw' }}>
        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            width: '11.5cqw',
            height: '11.5cqw',
            borderRadius: '50%',
            backgroundColor: s.accent,
            color: '#ffffff',
            fontSize: '4.2cqw',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </div>
        <div>
          <p style={{ fontSize: '5.6cqw', fontWeight: 700, lineHeight: 1.05, color: s.ink, letterSpacing: '-0.01em' }}>
            {data.name}
          </p>
          <p style={{ marginTop: '1.4cqw', fontSize: '2.9cqw', color: s.accent, fontWeight: 600 }}>{data.title}</p>
        </div>
      </div>
      <p style={{ marginTop: '3.4cqw', fontSize: '2.2cqw', color: s.muted }}>
        {data.email} &nbsp;&#8226;&nbsp; {data.phone}
      </p>
    </div>
  )
}

/* ---------- Paper preview ----------
   Square corners, like a real sheet of bond paper. `size` is letter, a4 or long (see PAGE_SIZES).
   Sizes use cqw, so it scales with its container. No border on the sheet itself:
   the card around it already provides the edge. */
export function CoverLetterPreview({ template, data = COVER_SAMPLE, size = 'letter' }) {
  const s = PREVIEW_STYLES[template.style]
  const ps = pageOf(size)
  const kind = template.style
  const gap = { marginBottom: '2.6cqw' }
  const bodyPadding = kind === 'creative' ? '0 8cqw 0 12cqw' : kind === 'simple' ? '0 9cqw' : '0 8cqw'

  return (
    <div
      aria-label={`${template.title} cover letter preview`}
      className="relative overflow-hidden bg-white"
      style={{
        aspectRatio: `1 / ${ps.ratio}`,
        containerType: 'inline-size',
        fontFamily: s.font,
        color: s.text,
      }}
    >
      {/* Creative: slim colour bar down the left edge */}
      {kind === 'creative' && (
        <div className="absolute inset-y-0 left-0" style={{ width: '3cqw', backgroundColor: s.accent }} />
      )}

      <Letterhead kind={kind} s={s} data={data} />

      <div style={{ padding: bodyPadding, marginTop: kind === 'modern' ? '6cqw' : '6.5cqw', fontSize: '2.45cqw', lineHeight: 1.55 }}>
        <p style={{ ...gap, color: s.muted }}>{data.date}</p>
        <div style={gap}>
          {data.recipient.map((line, i) => (
            <p key={line} style={i === 0 ? { fontWeight: 700, color: kind === 'modern' ? '#111827' : s.ink === '#ffffff' ? s.text : s.ink } : undefined}>
              {line}
            </p>
          ))}
        </div>
        <p style={gap}>{template.opening}</p>
        {template.preview.map((paragraph) => (
          <p key={paragraph} style={gap}>
            {paragraph}
          </p>
        ))}
        <p style={{ marginBottom: '5cqw' }}>{template.closing.split('\n')[0]}</p>
        <p style={{ fontWeight: 700, color: kind === 'modern' || kind === 'creative' || kind === 'simple' ? s.accent : s.ink }}>
          {data.name}
        </p>
      </div>
    </div>
  )
}