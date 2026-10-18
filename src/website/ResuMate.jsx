import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Resume Templates', href: '#templates' },
  { label: 'Cover Letters', href: '#cover-letter' },
  { label: 'Features', href: '#features' },
  { label: 'Why ResuMate', href: '#why' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]
const th = (font, ink, accent, tint) => ({ font, ink, accent, tint })
const RESUME_TEMPLATES = [
  { name: 'Classic', note: 'Single column, timeless', layout: 'single', theme: th("'Lora', Georgia, serif", '#0b1f3a', '#2f6fa8', '#eef5fb') },
  { name: 'Executive', note: 'Sidebar with key skills', layout: 'side', theme: th("'Playfair Display', Georgia, serif", '#1b3a34', '#2f6f62', '#edf5f2') },
  { name: 'Modern', note: 'Bold header, clean spacing', layout: 'header', theme: th("'Montserrat', sans-serif", '#3a1620', '#7a2e3a', '#f8eeef') },
  { name: 'Compact', note: 'Fits a full career on one page', layout: 'single', theme: th("'DM Sans', sans-serif", '#26262b', '#a07a3c', '#f6f1e7') },
]
const COVER_LETTERS = [
  { name: 'Formal', note: 'Traditional business letter', layout: 'single', theme: th("'Libre Baskerville', Georgia, serif", '#14213d', '#14213d', '#eef1f7') },
  { name: 'Modern', note: 'Bold header that matches your resume', layout: 'header', theme: th("'Raleway', sans-serif", '#0b3a4a', '#0f5c70', '#e8f3f6') },
  { name: 'Simple', note: 'Short, direct, and one page', layout: 'side', theme: th("'Cormorant Garamond', Georgia, serif", '#2e2447', '#5b4a8a', '#f1eef8') },
]
const FEATURES = [
  { title: 'Live preview', text: 'See every edit on the page as you type, exactly as it will print.' },
  { title: 'Guided writing', text: 'Prompts for each section help you describe your work clearly.' },
  { title: 'One-click export', text: 'Download a clean PDF that reads well in applicant tracking systems.' },
  { title: 'Easy restyling', text: 'Switch templates, colors, and fonts without retyping anything.' },
  { title: 'Multiple versions', text: 'Keep a tailored resume for every role you apply to.' },
  { title: 'Private by default', text: 'Your documents stay in your account until you choose to share them.' },
]
const FAQS = [
  { q: 'Is ResuMate free to use?', a: 'You can create and preview your resume for free before you decide on anything else.' },
  { q: 'Will my resume work with applicant tracking systems?', a: 'Yes. Our templates use a plain, clear structure with real text, so tracking software can read every section.' },
  { q: 'Can I change my template after I start?', a: 'Yes. Your content stays as you typed it, so you can switch templates, colors, and fonts at any time.' },
  { q: 'What file format can I download?', a: 'You can download your resume as a clean PDF that is ready to send or print.' },
  { q: 'Do you offer cover letter templates?', a: 'Yes. Choose a cover letter design that pairs with your resume so both documents look like a set.' },
  { q: 'Can I keep more than one resume?', a: 'Yes. Save a separate version for each role you apply to.' },
  { q: 'Is my information private?', a: 'Your documents stay in your account until you choose to share them.' },
]
const REASONS = [
  { stat: '5 min', text: 'to a finished first draft, using guided sections.' },
  { stat: 'ATS-ready', text: 'layouts built with plain structure that scanners can read.' },
  { stat: 'Free to start', text: 'create and preview your resume before you decide on anything.' },
]

/* Shared class strings */
const DISPLAY = "font-['Outfit','Jost',sans-serif] font-medium"
const H2 = `${DISPLAY} text-[clamp(2rem,4vw,2.9rem)] leading-[1.1] text-[#0b1f3a]`
const H3 = `${DISPLAY} text-[1.45rem] leading-tight text-[#0b1f3a]`
const WRAP = 'mx-auto w-[min(1160px,100%-3rem)]'
const SECTION = 'scroll-mt-[88px] py-[clamp(4.5rem,9vw,7.5rem)]'
const BTN = 'inline-flex items-center justify-center rounded px-6 py-3 text-sm font-bold tracking-wide transition duration-300 cursor-pointer'
const BTN_PRIMARY = `${BTN} bg-[#0b1f3a] text-white hover:-translate-y-0.5 hover:bg-[#17335c]`
const BTN_GHOST = `${BTN} border border-[#0b1f3a] text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white`

/* Fade in when scrolled into view */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), io.disconnect()),
      { threshold: 0.15 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}

/* Template thumbnail. Text is sized in cqw so it scales with the card. */
const BODY = { lineHeight: 1.5, color: '#44546a' }

function Block({ title, theme, children }) {
  return (
    <div>
      <p style={{ color: theme.accent, borderBottom: `1px solid ${theme.tint}`, fontWeight: 600, fontSize: '0.95em', marginBottom: '0.25em', paddingBottom: '0.15em' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function ResumeBody({ layout, theme }) {
  const main = (
    <div className="flex flex-1 flex-col gap-[0.9em]">
      <Block title="Summary" theme={theme}>
        <p style={BODY}>Marketing manager with 8 years of experience leading campaigns that grow revenue.</p>
      </Block>
      <Block title="Experience" theme={theme}>
        <p style={{ ...BODY, color: theme.ink, fontWeight: 600 }}>Senior Marketing Manager</p>
        <p style={BODY}>Northwind Co., 2021 to now. Raised qualified leads by 42%.</p>
      </Block>
      <Block title="Education" theme={theme}>
        <p style={BODY}>BS Business Administration, University of the Philippines</p>
      </Block>
      {layout !== 'side' && (
        <Block title="Skills" theme={theme}><p style={BODY}>Strategy, Analytics, SEO, Copywriting</p></Block>
      )}
    </div>
  )
  if (layout !== 'side') return main
  return (
    <>
      <div className="flex w-[34%] flex-col gap-[0.9em] p-[0.6em]" style={{ background: theme.tint }}>
        <Block title="Contact" theme={theme}><p style={BODY}>amelia.reyes@email.com Quezon City</p></Block>
        <Block title="Skills" theme={theme}><p style={BODY}>Strategy, Analytics, SEO</p></Block>
      </div>
      {main}
    </>
  )
}

function LetterBody({ theme }) {
  return (
    <div className="flex flex-1 flex-col gap-[0.8em]">
      <p style={BODY}>18 October 2026</p>
      <p style={{ ...BODY, color: theme.ink, fontWeight: 600 }}>Dear Hiring Manager,</p>
      <p style={BODY}>I am excited to apply for the Marketing Manager role at Northwind Co. I have led campaigns that raised qualified leads by 42%.</p>
      <p style={BODY}>I would welcome the chance to bring the same results to your team.</p>
      <p style={BODY}>Sincerely,</p>
      <p style={{ ...BODY, color: theme.ink, fontWeight: 600 }}>Amelia Reyes</p>
    </div>
  )
}

function Paper({ layout, kind, theme }) {
  const header = layout === 'header'
  const letter = kind === 'letter'
  return (
    <div
      aria-hidden="true"
      style={{
        containerType: 'inline-size',
        fontFamily: theme.font,
        ...(letter && layout === 'side' ? { borderLeftWidth: '5px', borderLeftColor: theme.accent } : {}),
      }}
      className="aspect-[3/4] overflow-hidden rounded-[3px] border border-[#dde8f3] bg-white shadow-[0_10px_30px_rgba(11,31,58,0.07)] transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_40px_rgba(11,31,58,0.12)]"
    >
      <div className="flex flex-col gap-[1.1em]" style={{ fontSize: letter ? '2.9cqw' : '2.6cqw', padding: '5cqw' }}>
        <div
          style={
            header
              ? { background: theme.accent, margin: '-5cqw -5cqw 0', padding: '5cqw' }
              : { borderBottom: `1px solid ${theme.tint}`, paddingBottom: '0.8em' }
          }
        >
          <p style={{ fontSize: '2em', lineHeight: 1.1, fontWeight: 600, color: header ? '#fff' : theme.ink }}>Amelia Reyes</p>
          <p style={{ color: header ? 'rgba(255,255,255,0.85)' : theme.accent, marginTop: '0.2em' }}>Marketing Manager</p>
          <p style={{ fontSize: '0.8em', marginTop: '0.3em', color: header ? 'rgba(255,255,255,0.75)' : '#5b6b80' }}>
            amelia.reyes@email.com | +63 912 345 6789
          </p>
        </div>
        <div className="flex gap-[1em]">
          {letter ? <LetterBody theme={theme} /> : <ResumeBody layout={layout} theme={theme} />}
        </div>
      </div>
    </div>
  )
}

function TemplateGrid({ items, type, kind }) {
  const track = useRef(null)
  const [active, setActive] = useState(0)

  const step = () => (track.current?.children[0]?.offsetWidth || 0) + 16
  const onScroll = (e) => setActive(Math.round(e.currentTarget.scrollLeft / step()))
  const goTo = (i) => track.current?.scrollTo({ left: i * step(), behavior: 'smooth' })

  return (
    <>
      <div
        ref={track}
        onScroll={onScroll}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-6 pt-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-[repeat(auto-fit,minmax(210px,1fr))] md:gap-8 md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 90} className="w-[76vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
            <Link to="/templates" className="group block" aria-label={`Use the ${t.name} ${type} template`}>
              <Paper layout={t.layout} kind={kind} theme={t.theme} />
              <h3 className={`${H3} mt-4`}>{t.name}</h3>
              <p className="mt-0.5 text-[0.95rem] text-[#4a5a70]">{t.note}</p>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="flex justify-center gap-2 md:hidden">
        {items.map((t, i) => (
          <button
            key={t.name}
            aria-label={`Go to ${t.name}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${active === i ? 'w-6 bg-[#0b1f3a]' : 'w-2 bg-[#b9d4f0]'}`}
          />
        ))}
      </div>
    </>
  )
}

function SectionHead({ title, text }) {
  return (
    <Reveal className="mb-12 max-w-[560px]">
      <h2 className={H2}>{title}</h2>
      <p className="mt-3.5 text-[1.05rem] text-[#4a5a70]">{text}</p>
    </Reveal>
  )
}

function FaqItem({ q, a, open, onToggle, id }) {
  return (
    <div className="border-b border-[#dde8f3]">
      <h3>
        <button
          aria-expanded={open}
          aria-controls={`faq-${id}`}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
        >
          <span className={`${DISPLAY} text-[1.1rem] text-[#0b1f3a]`}>{q}</span>
          <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
            <span className="absolute left-0 top-1/2 h-px w-4 bg-[#0b1f3a]" />
            <span className={`absolute left-0 top-1/2 h-px w-4 bg-[#0b1f3a] transition duration-300 ${open ? 'rotate-0' : 'rotate-90'}`} />
          </span>
        </button>
      </h3>
      <div
        id={`faq-${id}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pr-10 text-[#4a5a70]">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function ResuMate() {
  const [openFaq, setOpenFaq] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const handleContact = (e) => {
    e.preventDefault()
    // TODO: connect to your backend, e.g. fetch('/api/contact', ...)
    setSent(true)
    e.target.reset()
  }

  const inputCls =
    'rounded-[3px] border border-[#dde8f3] bg-[#f1f7fd] px-3.5 py-3 text-base font-normal text-[#111] transition focus:border-[#5b9bd5] focus:bg-white focus:outline-none'

  return (
    <div className="font-['Jost','Helvetica_Neue',Arial,sans-serif] leading-relaxed text-[#111] antialiased">
      {/* NAVBAR */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[#0b1f3a]/30 backdrop-blur-[3px] transition-opacity duration-500 xl:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <header
        className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur transition duration-300 ${
          scrolled ? 'border-[#dde8f3] shadow-[0_6px_24px_rgba(11,31,58,0.05)]' : 'border-transparent'
        }`}
      >
        <div className={`${WRAP} flex h-[88px] items-center justify-between gap-4`}>
          <a href="#top" onClick={closeMenu}>
            <img src="/logo/resumate.png" alt="ResuMate" className="block h-14 w-auto md:h-[68px]" />
          </a>

          <button
            className="relative h-10 w-10 xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`absolute left-2 top-[13px] h-0.5 w-6 bg-[#0b1f3a] transition duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`absolute left-2 top-5 h-0.5 w-6 bg-[#0b1f3a] transition duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute left-2 top-[27px] h-0.5 w-6 bg-[#0b1f3a] transition duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>

          <nav
            className={`absolute inset-x-0 top-full flex flex-col items-start gap-5 rounded-b-3xl border-b border-[#dde8f3] bg-white px-6 pb-7 pt-2 shadow-[0_24px_40px_rgba(11,31,58,0.12)] transition-[clip-path,opacity,visibility] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] xl:static xl:visible xl:flex-row xl:items-center xl:gap-6 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:opacity-100 xl:shadow-none xl:[clip-path:none] ${
              menuOpen ? 'visible opacity-100 [clip-path:inset(0_0_-40px_0)]' : 'invisible opacity-0 [clip-path:inset(0_0_100%_0)]'
            }`}
          >
            <ul className="flex w-full flex-col xl:w-auto xl:flex-row xl:gap-5">
              {NAV_LINKS.map((l, i) => (
                <li
                  key={l.href}
                  style={{ transitionDelay: menuOpen ? `${150 + i * 55}ms` : '0ms' }}
                  className={`transition duration-500 xl:translate-y-0 xl:opacity-100 ${
                    menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
                  }`}
                >
                  <a
                    href={l.href}
                    onClick={closeMenu}
                    className="relative block py-3.5 text-base text-[#111] xl:inline-block xl:py-1 xl:text-sm xl:after:absolute xl:after:bottom-0 xl:after:left-0 xl:after:h-px xl:after:w-full xl:after:origin-left xl:after:scale-x-0 xl:after:bg-[#5b9bd5] xl:after:transition xl:after:duration-300 xl:hover:after:scale-x-100"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div
              style={{ transitionDelay: menuOpen ? `${150 + NAV_LINKS.length * 55}ms` : '0ms' }}
              className={`flex w-full items-center gap-5 transition duration-500 xl:w-auto xl:translate-y-0 xl:border-l xl:border-[#c9d9ea] xl:pl-6 xl:opacity-100 ${
                menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
              }`}
            >
              <Link to="/signin" onClick={closeMenu} className="text-sm font-bold text-[#0b1f3a] hover:text-[#5b9bd5]">
                Sign in
              </Link>
              <Link to="/templates" onClick={closeMenu} className={`${BTN_PRIMARY} max-xl:flex-1`}>
                Create resume
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#f1f7fd] pb-[clamp(3rem,6vw,5rem)] pt-[clamp(1.5rem,3vw,2.5rem)]">
          {/* Background: faint dot grid that fades toward the edges */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(#b9d4f0_1.2px,transparent_1.2px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_75%_85%_at_60%_45%,black,transparent)]"
          />
          <div className={`${WRAP} relative grid items-center gap-12 md:grid-cols-2`}>
            <div>
              <h1 className={`font-['Outfit','Jost',sans-serif] font-normal text-[clamp(2.9rem,6vw,5rem)] leading-[1.08] tracking-tight text-[#0b1f3a]`}>
                {['A resume that', 'speaks for you', 'before you do.'].map((line, i) => (
                  <span
                    key={line}
                    style={{ animationDelay: `${i * 140}ms` }}
                    className="block translate-y-7 animate-[rm-rise_0.9s_cubic-bezier(0.2,0.7,0.2,1)_forwards] opacity-0"
                  >
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-10 max-w-[480px] animate-[rm-fade_0.9s_0.6s_forwards] text-[1.12rem] text-[#4a5a70] opacity-0">
                Build a polished, professional resume and cover letter in minutes. Choose a template, add your
                story, and download it ready to send.
              </p>
              <div className="mt-9 flex animate-[rm-fade_0.9s_0.8s_forwards] flex-wrap gap-3.5 opacity-0">
                <Link to="/templates" className={`${BTN_PRIMARY} !px-8 !py-4 !text-base`}>Create your resume</Link>
                <a href="#templates" className={`${BTN_GHOST} !px-8 !py-4 !text-base`}>Browse templates</a>
              </div>
            </div>

            {/* Desktop only: static image on layered, tilted panels */}
            <div className="relative hidden animate-[rm-fade_1.2s_0.5s_forwards] place-items-center py-8 opacity-0 md:grid">
              <div aria-hidden="true" className="absolute inset-x-[4%] inset-y-[10%] -rotate-6 rounded-[2.5rem] bg-[#dcebfa]" />
              <div aria-hidden="true" className="absolute inset-x-[4%] inset-y-[10%] translate-x-4 translate-y-4 rotate-3 rounded-[2.5rem] border-2 border-[#0b1f3a]" />
              <div aria-hidden="true" className="absolute bottom-[4%] right-0 h-24 w-24 rounded-full border-2 border-[#5b9bd5]" />
              <img
                src="/transparents/hero-right-image.png"
                alt="A ResuMate resume preview"
                className="relative h-auto w-full max-w-[600px] drop-shadow-[0_22px_24px_rgba(11,31,58,0.18)]"
              />
            </div>
          </div>
        </section>

        {/* RESUME TEMPLATES */}
        <section id="templates" className={`${SECTION} bg-[#f1f7fd]`}>
          <div className={WRAP}>
            <SectionHead title="Resume templates" text="Clean, recruiter-friendly layouts. Pick one now and change it any time." />
            <TemplateGrid items={RESUME_TEMPLATES} type="resume" kind="resume" />
          </div>
        </section>

        {/* COVER LETTER TEMPLATES */}
        <section id="cover-letter" className={SECTION}>
          <div className={WRAP}>
            <SectionHead title="Cover letter templates" text="Pair your resume with a letter that introduces you and explains why you fit the role." />
            <TemplateGrid items={COVER_LETTERS} type="cover letter" kind="letter" />
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className={`${SECTION} bg-[#f1f7fd]`}>
          <div className={WRAP}>
            <SectionHead title="Everything you need to apply with confidence" text="Simple tools that keep you writing, not formatting." />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] border-t border-[#dde8f3]">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 90} className="border-b border-[#dde8f3] py-8 pr-8">
                  <h3 className={`${H3} mb-2.5`}>{f.title}</h3>
                  <p className="text-[#4a5a70]">{f.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY */}
        <section id="why" className={`${SECTION} bg-[#0b1f3a]`}>
          <div className={`${WRAP} grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16`}>
            <Reveal>
              <h2 className={`${H2} !text-white`}>Why ResuMate</h2>
              <p className="mt-4 max-w-[440px] text-[1.05rem] text-[#b9cde4]">
                Hiring managers skim. ResuMate gives your experience a clear structure so the right
                details are seen first.
              </p>
            </Reveal>
            <div>
              {REASONS.map((r, i) => (
                <Reveal
                  key={r.stat}
                  delay={i * 100}
                  className="flex flex-col gap-1 border-b border-[#cfe3f8]/20 py-6 first:pt-0"
                >
                  <strong className={`${DISPLAY} text-4xl text-[#cfe3f8]`}>{r.stat}</strong>
                  <span className="text-[#b9cde4]">{r.text}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className={SECTION}>
          <div className={`${WRAP} grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16`}>
            <Reveal><h2 className={H2}>About ResuMate</h2></Reveal>
            <Reveal delay={100} className="grid gap-5 text-[1.08rem] text-[#4a5a70]">
              <p>
                ResuMate started with a simple belief: a good career deserves a good first
                impression. Too many strong candidates are overlooked because of cluttered or
                inconsistent documents.
              </p>
              <p>
                We built ResuMate to handle the layout, so you can focus on what you have achieved
                and where you want to go next.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className={`${SECTION} bg-[#f1f7fd]`}>
          <div className={`${WRAP} grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16`}>
            <Reveal>
              <h2 className={H2}>Frequently asked questions</h2>
              <p className="mt-4 max-w-[380px] text-[#4a5a70]">
                Can't find your answer? Send us a message and we will help.
              </p>
            </Reveal>
            <Reveal delay={100} className="border-t border-[#dde8f3]">
              {FAQS.map((f, i) => (
                <FaqItem
                  key={f.q}
                  id={i}
                  q={f.q}
                  a={f.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className={SECTION}>
          <div className={`${WRAP} grid items-start gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16`}>
            <Reveal>
              <h2 className={H2}>Contact us</h2>
              <p className="my-4 max-w-[380px] text-[#4a5a70]">
                Questions about templates or your account? Send a message and we will reply by email.
              </p>
              <a href="mailto:support@resumate.com" className="border-b border-[#5b9bd5] font-bold text-[#0b1f3a]">
                support@resumate.com
              </a>
            </Reveal>

            <Reveal delay={100}>
              <form onSubmit={handleContact} className="grid gap-4 rounded border border-[#dde8f3] bg-white p-8">
                <label className="grid gap-1.5 text-sm font-bold text-[#0b1f3a]">
                  Name
                  <input type="text" name="name" required autoComplete="name" className={inputCls} />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-[#0b1f3a]">
                  Email
                  <input type="email" name="email" required autoComplete="email" className={inputCls} />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-[#0b1f3a]">
                  Message
                  <textarea name="message" rows="4" required className={`${inputCls} resize-y`} />
                </label>
                <button type="submit" className={`${BTN_PRIMARY} justify-self-start`}>Send message</button>
                {sent && (
                  <p role="status" className="text-sm font-bold text-[#0b1f3a]">
                    Message sent. We will be in touch soon.
                  </p>
                )}
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#dde8f3] bg-white pt-14">
        <div className={`${WRAP} flex flex-wrap justify-between gap-4`}>
          <div>
            <img src="/logo/resumate.png" alt="ResuMate" className="mb-3 block h-[72px] w-auto" />
            <p className="text-[0.95rem] text-[#4a5a70]">Professional resumes and cover letters, made simple.</p>
          </div>
          <ul className="grid grid-cols-2 content-start gap-x-12 gap-y-2 text-[0.92rem]">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition hover:text-[#5b9bd5]">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${WRAP} mt-12 border-t border-[#dde8f3] py-5 text-sm text-[#4a5a70]`}>
          © {new Date().getFullYear()} ResuMate. All rights reserved.
        </div>
      </footer>
    </div>
  )
}