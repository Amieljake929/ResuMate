import { useId, useState } from 'react'
import { Link } from 'react-router-dom'

/* ---------- Design tokens (same palette + type as the ResuMate landing page) ---------- */
const DISPLAY = "font-['Outfit','Jost',sans-serif]"

const COPY = {
  signin: {
    lines: ['Pick up right where', 'you left off.'],
    body: 'Your drafts, templates and saved edits are waiting for you.',
    switchText: 'New to ResuMate?',
    switchLabel: 'Create account',
    switchTo: '/signup',
  },
  signup: {
    lines: ['Your next resume', 'starts here.'],
    body: 'Choose a template, add your story, and download a polished resume in minutes.',
    switchText: 'Already have an account?',
    switchLabel: 'Sign in',
    switchTo: '/signin',
  },
}

const STATS = [
  { stat: '5 min', text: 'to a first draft' },
  { stat: 'ATS-ready', text: 'plain, readable layouts' },
  { stat: 'Free', text: 'to start and preview' },
]

/* ---------- Shared class strings (exported so pages can reuse them) ---------- */
export const primaryBtn =
  "inline-flex w-full cursor-pointer items-center justify-center rounded bg-[#0b1f3a] px-6 py-[clamp(0.65rem,1.7vh,0.9rem)] text-sm font-bold tracking-wide text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#17335c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]"

export const outlineBtn =
  'inline-flex cursor-pointer items-center justify-center rounded border border-[#0b1f3a] px-4 py-2 text-sm font-bold text-[#0b1f3a] transition duration-300 hover:bg-[#0b1f3a] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

const inputCls =
  'w-full rounded-[3px] border border-[#dde8f3] bg-[#f1f7fd] py-[clamp(0.55rem,1.5vh,0.8rem)] pr-3.5 text-base font-normal text-[#111] transition placeholder:text-[#8da0b6] focus:border-[#5b9bd5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5b9bd5]/20'

/* ---------- Icons ---------- */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const ICONS = {
  mail: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  ),
}

function EyeIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  )
}

/* ---------- Form building blocks ---------- */
export function Field({ label, hint, icon, type = 'text', ...props }) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-bold text-[#0b1f3a]">{label}</label>
        {hint && <span className="text-xs text-[#4a5a70]">{hint}</span>}
      </div>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#7d90a8]">
            {ICONS[icon]}
          </span>
        )}
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          className={`${inputCls} ${icon ? 'pl-11' : 'pl-3.5'} ${isPassword ? 'pr-11' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#7d90a8] transition hover:text-[#0b1f3a]"
          >
            <EyeIcon off={show} />
          </button>
        )}
      </div>
    </div>
  )
}

export function Divider({ children }) {
  return (
    <div className="my-[clamp(0.8rem,2vh,1.25rem)] flex items-center gap-3 text-xs text-[#4a5a70]">
      <span className="h-px flex-1 bg-[#dde8f3]" />
      {children}
      <span className="h-px flex-1 bg-[#dde8f3]" />
    </div>
  )
}

const socialBtn =
  'flex cursor-pointer items-center justify-center gap-2.5 rounded-[3px] border border-[#dde8f3] bg-white py-[clamp(0.5rem,1.4vh,0.75rem)] text-sm font-bold text-[#0b1f3a] transition duration-300 hover:border-[#5b9bd5] hover:bg-[#f1f7fd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

export function SocialRow({ onFacebook, onLinkedIn }) {
  // TODO: hook these up to your OAuth flow
  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" onClick={onFacebook} className={socialBtn}>
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#1877f2" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </button>
      <button type="button" onClick={onLinkedIn} className={socialBtn}>
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#0a66c2" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </button>
    </div>
  )
}

/* ---------- Left side: brand showcase ---------- */
function Showcase() {
  return (
    <div className="relative w-full max-w-[560px]" style={{ height: 'clamp(200px, 44vh, 450px)' }}>
      {/* rings + layered, tilted panels (same language as the landing hero) */}
      <div aria-hidden="true" className="absolute inset-[2%] rounded-full border border-[#5b9bd5]/15" />
      <div aria-hidden="true" className="absolute inset-[12%] rounded-full border border-[#5b9bd5]/15" />
      <div aria-hidden="true" className="absolute inset-x-[10%] inset-y-[6%] -rotate-6 rounded-[2.25rem] bg-[#16335c]" />
      <div aria-hidden="true" className="absolute inset-x-[10%] inset-y-[6%] translate-x-3 translate-y-3 rotate-3 rounded-[2.25rem] border-2 border-[#5b9bd5]/70" />

      {/* resume sheet peeking out behind the logo card */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[5%] h-[62%] w-[42%] -translate-x-1/2 rotate-[-4deg] overflow-hidden rounded-[4px] bg-white p-[3.5%] shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center gap-2.5">
          <span className="h-8 w-8 shrink-0 rounded-full bg-[#5b9bd5]" />
          <div className="grid flex-1 gap-1.5">
            <span className="h-2 w-3/5 rounded-full bg-[#0b1f3a]" />
            <span className="h-1.5 w-2/5 rounded-full bg-[#cfe3f8]" />
          </div>
        </div>
        <div className="mt-4 grid gap-1.5">
          <span className="h-1.5 w-full rounded-full bg-[#e7eff8]" />
          <span className="h-1.5 w-11/12 rounded-full bg-[#e7eff8]" />
          <span className="h-1.5 w-3/5 rounded-full bg-[#e7eff8]" />
        </div>
        <div className="mt-4 border-t border-[#dde8f3] pt-3">
          <span className="block h-2 w-1/3 rounded-full bg-[#5b9bd5]" />
          <div className="mt-2.5 grid gap-1.5">
            <span className="h-1.5 w-full rounded-full bg-[#e7eff8]" />
            <span className="h-1.5 w-10/12 rounded-full bg-[#e7eff8]" />
          </div>
        </div>
      </div>

      {/* logo card */}
      <div className="absolute inset-x-[13%] bottom-[13%] z-10 rounded-2xl border border-[#dde8f3] bg-white px-[7%] py-[4%] shadow-[0_24px_50px_rgba(0,0,0,0.4)]">
        <img src="/logo/resumate.png" alt="ResuMate – ATS-friendly resume builder" className="block h-auto w-full" />
      </div>
    </div>
  )
}

/* ---------- Layout ---------- */
export function AuthSplit({ mode = 'signin', title, subtitle, children }) {
  const copy = COPY[mode] ?? COPY.signin

  return (
    <div
      style={{ height: '100dvh' }}
      className="grid h-screen grid-rows-[minmax(0,1fr)] overflow-hidden bg-white font-['Jost','Helvetica_Neue',Arial,sans-serif] text-[#111] antialiased lg:grid-cols-[1.05fr_1fr]"
    >
      <style>{`
        @keyframes auth-rise { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
        @keyframes auth-fade { from { opacity: 0 } to { opacity: 1 } }
        .auth-rise { opacity: 0; animation: auth-rise .85s cubic-bezier(.2,.7,.2,1) forwards }
        .auth-fade { opacity: 0; animation: auth-fade .9s ease-out forwards }
        @media (prefers-reduced-motion: reduce) { .auth-rise, .auth-fade { opacity: 1; animation: none } }
      `}</style>

      {/* LEFT — brand side */}
      <aside className="relative hidden min-h-0 flex-col justify-between overflow-hidden bg-[#0b1f3a] px-[clamp(2rem,5vw,4.5rem)] py-[clamp(1.25rem,4vh,3rem)] lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* base gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#10305a_0%,#0b1f3a_45%,#081629_100%)]" />

          {/* soft light pools */}
          <div className="absolute -right-28 -top-28 h-[480px] w-[480px] rounded-full bg-[#5b9bd5]/25 blur-[120px]" />
          <div className="absolute -bottom-36 -left-28 h-[440px] w-[440px] rounded-full bg-[#2f6fa8]/30 blur-[130px]" />

          {/* dot grid that fades toward the edges */}
          <div className="absolute inset-0 bg-[radial-gradient(#cfe3f8_1.2px,transparent_1.2px)] opacity-[0.14] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_75%_85%_at_50%_45%,black,transparent)]" />

          {/* concentric rings centred behind the logo */}
          <svg viewBox="0 0 800 800" fill="none" className="absolute left-1/2 top-[40%] h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2">
            <circle cx="400" cy="400" r="170" stroke="#5b9bd5" strokeOpacity="0.20" />
            <circle cx="400" cy="400" r="260" stroke="#5b9bd5" strokeOpacity="0.14" strokeDasharray="2 8" strokeLinecap="round" />
            <circle cx="400" cy="400" r="350" stroke="#5b9bd5" strokeOpacity="0.10" />
            <circle cx="400" cy="400" r="440" stroke="#5b9bd5" strokeOpacity="0.07" />
          </svg>

          {/* ghost resume pages in the corners */}
          <div className="absolute -left-14 top-[24%] hidden h-60 w-44 -rotate-12 rounded-md border border-[#cfe3f8]/15 bg-[#cfe3f8]/[0.04] p-4 xl:block">
            <span className="block h-2 w-1/2 rounded-full bg-[#cfe3f8]/20" />
            <span className="mt-3 block h-1.5 w-full rounded-full bg-[#cfe3f8]/10" />
            <span className="mt-2 block h-1.5 w-5/6 rounded-full bg-[#cfe3f8]/10" />
            <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-[#cfe3f8]/10" />
          </div>
          <div className="absolute -bottom-20 -right-12 hidden h-72 w-52 rotate-[14deg] rounded-md border border-[#cfe3f8]/15 bg-[#cfe3f8]/[0.04] p-4 xl:block">
            <span className="block h-2 w-1/2 rounded-full bg-[#cfe3f8]/20" />
            <span className="mt-3 block h-1.5 w-full rounded-full bg-[#cfe3f8]/10" />
            <span className="mt-2 block h-1.5 w-5/6 rounded-full bg-[#cfe3f8]/10" />
            <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-[#cfe3f8]/10" />
            <span className="mt-5 block h-2 w-1/3 rounded-full bg-[#5b9bd5]/30" />
            <span className="mt-3 block h-1.5 w-full rounded-full bg-[#cfe3f8]/10" />
          </div>

          {/* darken the bottom so the headline stays crisp */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#081629]/70 to-transparent" />
        </div>

        <Link
          to="/"
          className="relative inline-flex w-fit items-center gap-2 text-sm text-[#b9cde4] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b9bd5]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Back to home
        </Link>

        <div className="relative flex min-h-0 flex-1 items-center justify-center py-3">
          <Showcase />
        </div>

        <div className="relative max-w-[500px]">
          <h2 className={`${DISPLAY} text-[clamp(1.75rem,4.4vh,2.9rem)] font-normal leading-[1.1] tracking-tight text-white`}>
            {copy.lines.map((line, i) => (
              <span key={line} style={{ animationDelay: `${i * 140}ms` }} className="auth-rise block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-[clamp(0.5rem,1.5vh,1rem)] min-h-[3.25em] max-w-[440px] text-[clamp(0.95rem,1.9vh,1.1rem)] leading-relaxed text-[#b9cde4]">
            {copy.body}
          </p>

          <dl className="mt-[clamp(1rem,3vh,2rem)] grid grid-cols-3 border-t border-[#cfe3f8]/20 pt-[clamp(0.75rem,2.2vh,1.5rem)]">
            {STATS.map((s) => (
              <div key={s.stat} className="border-l border-[#cfe3f8]/20 pl-5 first:border-l-0 first:pl-0">
                <dt className={`${DISPLAY} text-[clamp(1.1rem,2.6vh,1.5rem)] font-medium text-[#cfe3f8]`}>{s.stat}</dt>
                <dd className="mt-0.5 text-[clamp(0.75rem,1.5vh,0.875rem)] text-[#b9cde4]">{s.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      {/* RIGHT — form side */}
      <main className="relative flex min-h-0 flex-col overflow-y-auto bg-gradient-to-b from-white to-[#f1f7fd]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#b9d4f0_1.2px,transparent_1.2px)] opacity-60 [background-size:26px_26px] [mask-image:radial-gradient(ellipse_70%_70%_at_70%_40%,black,transparent)]"
        />

        <header className="relative flex h-[clamp(64px,10vh,88px)] shrink-0 items-center justify-between px-6 sm:px-10">
          <Link to="/" aria-label="ResuMate home">
            <img src="/logo/resumate.png" alt="ResuMate" className="block h-12 w-auto md:h-14" />
          </Link>
          <p className="flex items-center gap-3 text-sm text-[#4a5a70]">
            <span className="hidden sm:inline">{copy.switchText}</span>
            <Link to={copy.switchTo} className={outlineBtn}>{copy.switchLabel}</Link>
          </p>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-6 py-3 sm:px-10">
          <div className="auth-fade w-full max-w-[440px] rounded border border-[#dde8f3] bg-white p-[clamp(1.25rem,3.4vh,2.25rem)] shadow-[0_10px_30px_rgba(11,31,58,0.07)]">
            <h1 className={`${DISPLAY} text-[clamp(1.6rem,3.8vh,2.1rem)] font-medium leading-tight text-[#0b1f3a]`}>{title}</h1>
            {subtitle && <p className="mb-[clamp(0.9rem,2.4vh,1.5rem)] mt-1.5 text-[0.98rem] text-[#4a5a70]">{subtitle}</p>}
            {children}
          </div>
        </div>

        <p className="relative shrink-0 pb-4 pt-1 text-center text-xs text-[#4a5a70]">
          © {new Date().getFullYear()} ResuMate. All rights reserved.
        </p>
      </main>
    </div>
  )
}

export default AuthSplit