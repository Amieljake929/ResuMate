import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LetterIcon } from './icons'

const EASE = [0.2, 0.7, 0.2, 1]

const TEMPLATES = [
  {
    title: 'Formal',
    type: 'General purpose',
    description: 'Traditional business letter',
    tone: 'Confident and polished',
    style: 'formal',
    opening: 'Dear Hiring Manager,',
    preview: [
      'I am excited to apply for the Marketing Manager role at Northwind Co. I have led campaigns that raised qualified leads by 42%.',
      'I would welcome the chance to bring the same results to your team.',
    ],
    paragraphs: [
      'I am excited to apply for the [Job Title] position at [Company]. With experience in [relevant area] and a record of [relevant achievement], I can contribute to the goals of your team.',
      'In my recent role at [Previous Company], I [describe a relevant accomplishment and its impact]. This experience strengthened my ability to [relevant skill], while working collaboratively to deliver reliable results.',
      'I would welcome the opportunity to bring my experience in [skill or specialty] to [Company]. Thank you for your time and consideration. I look forward to discussing how I can support your team.',
    ],
    closing: 'Sincerely,\n[Your Name]',
  },
  {
    title: 'Modern',
    type: 'Career transition',
    description: 'Bold header for a new direction',
    tone: 'Adaptable and forward-looking',
    style: 'modern',
    opening: 'Dear Hiring Team,',
    preview: [
      'I am excited to apply for the Product Designer role at Northwind Co. I am bringing a fresh perspective and transferable experience from marketing.',
      'My recent UX projects helped me turn customer insights into clear, useful experiences.',
    ],
    paragraphs: [
      'I am writing to apply for the [Job Title] role at [Company]. I am making a deliberate transition from [Current Field] to [Target Field], bringing strengths in [transferable skill] and a strong commitment to learning the work.',
      'As a [Current or Previous Role], I [achievement that demonstrates a transferable skill]. I have also developed my knowledge of [target-field skill or tool] through [project, course, or practical experience], preparing me to contribute from day one.',
      'I am especially interested in [Company] because of [specific reason]. I would appreciate the opportunity to discuss how my perspective and transferable experience could benefit your team.',
    ],
    closing: 'Best regards,\n[Your Name]',
  },
  {
    title: 'Simple',
    type: 'Entry level',
    description: 'Short, direct, and easy to scan',
    tone: 'Enthusiastic and capable',
    style: 'simple',
    opening: 'Dear Hiring Manager,',
    preview: [
      'I am applying for the Marketing Assistant role at Northwind Co. As a recent business graduate, I am ready to put my research and communication skills to work.',
      'My capstone project gave me hands-on experience turning audience research into a practical campaign.',
    ],
    paragraphs: [
      'I am pleased to apply for the [Job Title] opening at [Company]. As a recent [Degree] graduate, I am eager to put my experience in [relevant subject or skill] to work on projects that support your team.',
      'During [internship, capstone, or campus project], I [describe a specific contribution]. I learned to [relevant skill] and collaborated with others to [result], experience that I am ready to build on in a professional setting.',
      'I admire [Company] for [specific reason], and I would be excited to contribute my curiosity, care, and willingness to learn. Thank you for considering my application.',
    ],
    closing: 'Kind regards,\n[Your Name]',
  },
  {
    title: 'Executive',
    type: 'Management',
    description: 'Polished layout for senior roles',
    tone: 'Strategic and results-focused',
    style: 'executive',
    opening: 'Dear [Hiring Manager Name],',
    preview: [
      'I am interested in the Marketing Director opportunity at Northwind Co. I bring a track record of building teams and connecting strategy to measurable growth.',
      'At my current company, I led a cross-functional team that increased qualified leads by 42%.',
    ],
    paragraphs: [
      'I am interested in the [Leadership Job Title] opportunity at [Company]. I bring [number] years of experience leading [function or team] and aligning day-to-day execution with wider business priorities.',
      'At [Previous Company], I led [team or initiative] to [measurable outcome]. My approach combines clear goals, thoughtful coaching, and cross-functional partnership so teams can make progress while maintaining high standards.',
      'The opportunity to help [Company] achieve [specific goal or initiative] is particularly compelling. I would welcome a conversation about the needs of the role and the results I could help your team deliver.',
    ],
    closing: 'Sincerely,\n[Your Name]',
  },
  {
    title: 'Creative',
    type: 'Creative industries',
    description: 'Warm accent for creative applications',
    tone: 'Distinctive and personable',
    style: 'creative',
    opening: 'Hello [Hiring Manager Name],',
    preview: [
      'I am excited to share my work for the Brand Designer position at Northwind Co. I create thoughtful visual stories that help people connect with a brand.',
      'My recent campaign brought a new product identity to life across web, social, and print.',
    ],
    paragraphs: [
      'I am excited to share my work for the [Job Title] position at [Company]. I create [type of work] that helps [audience or business goal], combining a strong point of view with a practical understanding of the brief.',
      'Most recently, I [describe a relevant project]. I partnered with [team or client] to [your contribution], resulting in [outcome]. My portfolio at [Portfolio URL] includes this project and other examples of my process.',
      'I am drawn to [Company] because of [specific project, product, or value]. I would love to bring my experience in [specialty] to your team and explore what we could create together.',
    ],
    closing: 'Warmly,\n[Your Name]',
  },
]

const PREVIEW_STYLES = {
  formal: {
    ink: '#102b50',
    accent: '#102b50',
    font: 'Georgia, "Times New Roman", serif',
    border: '1px solid #dbe5f0',
  },
  modern: {
    ink: '#ffffff',
    accent: '#126274',
    font: 'Arial, sans-serif',
    border: '1px solid #dbe5f0',
  },
  simple: {
    ink: '#29314a',
    accent: '#695293',
    font: 'Georgia, "Times New Roman", serif',
    border: '4px solid #695293',
  },
  executive: {
    ink: '#172b4d',
    accent: '#b18b4c',
    font: 'Georgia, "Times New Roman", serif',
    border: '1px solid #dbe5f0',
  },
  creative: {
    ink: '#49372f',
    accent: '#d46b50',
    font: 'Arial, sans-serif',
    border: '1px solid #eaded8',
  },
}

function CoverLetterPreview({ template }) {
  const style = PREVIEW_STYLES[template.style]
  const modern = template.style === 'modern'

  return (
    <div
      aria-label={`${template.title} cover letter preview`}
      className="relative overflow-hidden rounded-t-xl bg-white"
      style={{ aspectRatio: '8.5 / 11', containerType: 'inline-size', border: style.border }}
    >
      {modern && (
        <div
          className="absolute inset-x-0 top-0 h-[24%]"
          style={{ backgroundColor: style.accent }}
        />
      )}
      {template.style === 'creative' && (
        <div className="absolute inset-x-0 top-0 h-[1.4%]" style={{ backgroundColor: style.accent }} />
      )}
      <div
        className="relative h-full"
        style={{
          padding: '7%',
          paddingLeft: template.style === 'simple' ? '8%' : '7%',
          color: style.ink,
          fontFamily: style.font,
        }}
      >
        <div style={{ color: modern ? '#ffffff' : style.ink }}>
          <p style={{ fontSize: '6.1cqw', fontWeight: 700, lineHeight: 1.05 }}>Amelia Reyes</p>
          <p style={{ marginTop: '1.4cqw', fontSize: '3.2cqw', lineHeight: 1.2 }}>Marketing Manager</p>
          <p
            style={{
              marginTop: '1.6cqw',
              color: modern ? '#e2f2f5' : '#66758a',
              fontSize: '2.35cqw',
              lineHeight: 1.3,
            }}
          >
            amelia.reyes@email.com | +63 912 345 6789
          </p>
        </div>
        <div
          className="my-[4.5%] h-px w-full"
          style={{ backgroundColor: modern ? 'rgba(255,255,255,0.35)' : '#e5eaf0' }}
        />
        <div style={{ color: style.ink, fontSize: '2.65cqw', lineHeight: 1.4 }}>
          <p style={{ marginBottom: '4%', color: '#536b87' }}>18 October 2026</p>
          <p style={{ marginBottom: '3.5%', fontWeight: 700 }}>{template.opening}</p>
          {template.preview.map((paragraph) => (
            <p key={paragraph} style={{ marginBottom: '3.5%' }}>{paragraph}</p>
          ))}
          <p style={{ marginBottom: '2.5%' }}>{template.closing.split('\n')[0]}</p>
          <p style={{ fontWeight: 700 }}>Amelia Reyes</p>
        </div>
      </div>
    </div>
  )
}

export default function CoverLetter() {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-[#e3ebf4] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef4fa] text-[#0b1f3a]">
            <LetterIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#2f6fa8]">Cover letter library</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0b1f3a] md:text-3xl">
              Cover letter templates
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Preview each design and open a template to see the full letter. Replace the bracketed prompts with your
              own details before sending.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#eef4fa] px-3 py-1.5 text-sm font-semibold text-[#0b1f3a]">
          {TEMPLATES.length} templates
        </span>
      </header>

      <div className="mt-6 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 md:grid-cols-3">
        {TEMPLATES.map((template, index) => {
          const isExpanded = expanded === index
          return (
            <motion.article
              key={template.title}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: EASE, layout: { duration: 0.3, ease: EASE } }}
              className="min-w-0"
            >
              <motion.button
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Hide' : 'Show'} ${template.title} cover letter`}
                onClick={() => setExpanded(isExpanded ? null : index)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="group block w-full rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b9bd5]"
              >
                <div className="overflow-hidden rounded-xl bg-white shadow-[0_14px_35px_rgba(11,31,58,0.09)] transition-[box-shadow] duration-300 group-hover:shadow-[0_20px_42px_rgba(11,31,58,0.16)]">
                  <CoverLetterPreview template={template} />
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-[#0b1f3a]">{template.title}</h2>
                    <p className="mt-0.5 text-sm text-slate-600">{template.description}</p>
                  </div>
                  <span className="mt-1 shrink-0 rounded-full bg-[#eef4fa] px-2.5 py-1 text-[11px] font-semibold text-[#0b1f3a]">
                    {isExpanded ? 'Selected' : template.type}
                  </span>
                </div>
              </motion.button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="template-details"
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-2xl border border-[#e3ebf4] bg-white p-5 shadow-sm sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-[#2f6fa8]">{template.type}</p>
                          <p className="mt-1 text-sm text-slate-600">{template.tone}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpanded(null)}
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0b1f3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]"
                        >
                          Close
                        </button>
                      </div>
                      <div className="mt-4 space-y-3 border-t border-[#e3ebf4] pt-4 text-sm leading-relaxed text-slate-700">
                        <p className="font-medium text-[#0b1f3a]">{template.opening}</p>
                        {template.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        <p className="whitespace-pre-line font-medium text-[#0b1f3a]">{template.closing}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}