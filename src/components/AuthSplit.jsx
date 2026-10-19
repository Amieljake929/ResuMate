import { useId, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

/* ---------- Design tokens (same palette + type as the ResuMate landing page) ---------- */
const DISPLAY = "font-['Outfit','Jost',sans-serif]"

const SWITCH = {
  signin: { text: "Don't have an account?", label: 'Create account', to: '/signup' },
  signup: { text: 'Already have an account?', label: 'Sign in', to: '/signin' },
}

/* ---------- Shared class strings (exported so pages can reuse them) ---------- */
export const primaryBtn =
  'inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#0b1f3a] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-[0_8px_20px_rgba(11,31,58,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17335c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

export const outlineBtn =
  'inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-[#dde8f3] bg-white px-6 py-3 text-sm font-bold text-[#0b1f3a] shadow-[0_6px_16px_rgba(11,31,58,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0b1f3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

const textLink =
  'font-bold text-[#0b1f3a] underline decoration-[#5b9bd5]/50 underline-offset-2 transition hover:decoration-[#0b1f3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

/* ---------- Icons ---------- */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const ICONS = {
  mail: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  ),
}

function EyeIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  )
}

/* ---------- Form building blocks ---------- */

// One rounded panel that holds all the fields, stacked with thin dividers.
export function FieldGroup({ children }) {
  return (
    <div className="divide-y divide-[#dde8f3] overflow-hidden rounded-xl border border-[#dde8f3] bg-white shadow-[0_10px_30px_rgba(11,31,58,0.06)]">
      {children}
    </div>
  )
}

// A single row: icon on the left, small label on top, value underneath.
export function Field({ label, hint, icon, type = 'text', ...props }) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="flex items-center gap-4 px-5 py-[clamp(0.55rem,1.6vh,0.85rem)] transition-colors focus-within:bg-[#f1f7fd]">
      {icon && <span className="shrink-0 text-[#7d90a8]">{ICONS[icon]}</span>}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={id} className="text-xs text-[#6b7f97]">{label}</label>
          {hint && <span className="text-xs text-[#8da0b6]">{hint}</span>}
        </div>
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          className="mt-0.5 block w-full border-0 bg-transparent p-0 text-base text-[#0b1f3a] placeholder:text-[#a3b3c6] focus:outline-none focus:ring-0"
          {...props}
        />
      </div>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="shrink-0 text-[#7d90a8] transition hover:text-[#0b1f3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]"
        >
          <EyeIcon off={show} />
        </button>
      )}
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

/* ---------- Password strength indicator ---------- */
const LEVELS = [
  { label: 'Weak', bar: 'bg-red-500', text: 'text-red-600' },
  { label: 'Fair', bar: 'bg-orange-400', text: 'text-orange-600' },
  { label: 'Good', bar: 'bg-yellow-400', text: 'text-yellow-700' },
  { label: 'Strong', bar: 'bg-green-500', text: 'text-green-700' },
]

function checkPassword(pw) {
  const long = pw.length >= 8
  const veryLong = pw.length >= 12
  const mixedCase = /[a-z]/.test(pw) && /[A-Z]/.test(pw)
  const digit = /\d/.test(pw)
  const symbol = /[^A-Za-z0-9]/.test(pw)
  const points = [long, veryLong, mixedCase, digit, symbol].filter(Boolean).length

  let level = 0 // index into LEVELS
  if (long) level = points >= 5 ? 3 : points === 4 ? 2 : points === 3 ? 1 : 0

  let tip = 'Great password!'
  if (!long) tip = 'Use at least 8 characters.'
  else if (!mixedCase) tip = 'Mix uppercase and lowercase letters.'
  else if (!digit) tip = 'Add a number.'
  else if (!symbol) tip = 'Add a symbol like ! or #.'
  else if (!veryLong) tip = 'Make it 12 or more characters.'

  return { level, tip }
}

export function PasswordStrength({ password = '' }) {
  if (!password) return null
  const { level, tip } = checkPassword(password)
  const current = LEVELS[level]

  return (
    <div role="status" aria-live="polite" className="-mt-1">
      <div className="flex gap-1.5" aria-hidden="true">
        {LEVELS.map((l, i) => (
          <span
            key={l.label}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= level ? current.bar : 'bg-[#dde8f3]'}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-[#4a5a70]">
        Password strength: <span className={`font-bold ${current.text}`}>{current.label}</span>
        <span className="text-[#6b7f97]"> · {tip}</span>
      </p>
    </div>
  )
}

/* ---------- Terms & privacy ---------- */
const termsLinks = (
  <>
    <Link to="/terms" target="_blank" rel="noreferrer" className={textLink}>Terms of Service</Link>
    {' and '}
    <Link to="/privacy" target="_blank" rel="noreferrer" className={textLink}>Privacy Policy</Link>
  </>
)

// Sign up: a required checkbox
export function TermsCheckbox() {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-[#4a5a70]">
      <input
        type="checkbox"
        name="terms"
        required
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#0b1f3a]"
      />
      <span>I agree to the {termsLinks}.</span>
    </label>
  )
}

// Sign in: a small note
export function TermsNote() {
  return (
    <p className="mt-[clamp(0.9rem,2.4vh,1.5rem)] text-center text-xs leading-relaxed text-[#6b7f97]">
      By signing in, you agree to our {termsLinks}.
    </p>
  )
}

/* ---------- "Don't have an account? [Create account]" ---------- */
export function SwitchLink({ mode = 'signin' }) {
  const s = SWITCH[mode] ?? SWITCH.signin
  return (
    <p className="mt-[clamp(0.9rem,2.4vh,1.25rem)] text-center text-sm text-[#4a5a70]">
      {s.text}{' '}
      <Link
        to={s.to}
        className="font-bold text-[#0b1f3a] transition hover:underline hover:decoration-[#5b9bd5] hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]"
      >
        {s.label}
      </Link>
    </p>
  )
}

/* ---------- Social ---------- */
const socialBtn =
  'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#dde8f3] bg-white shadow-[0_6px_16px_rgba(11,31,58,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-[#5b9bd5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

export function SocialRow({ onFacebook, onLinkedIn, label = 'Or you can join with' }) {
  // TODO: hook these up to your OAuth flow
  return (
    <div className="mt-[clamp(1rem,3.2vh,2rem)] text-center">
      <p className="text-sm text-[#4a5a70]">{label}</p>
      <div className="mt-3 flex justify-center gap-3">
        <button type="button" onClick={onFacebook} aria-label="Continue with Facebook" className={socialBtn}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1877f2" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
        <button type="button" onClick={onLinkedIn} aria-label="Continue with LinkedIn" className={socialBtn}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#0a66c2" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ---------- Page frame: stays mounted while you switch Sign in <-> Sign up ---------- */
export function AuthFrame({ children, formKey }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f7fafd] font-['Jost','Helvetica_Neue',Arial,sans-serif] text-[#111] antialiased">
      <style>{`
        @keyframes auth-rise { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
        @keyframes auth-fade { from { opacity: 0 } to { opacity: 1 } }
        .auth-rise { opacity: 0; animation: auth-rise .85s cubic-bezier(.2,.7,.2,1) forwards }
        .auth-fade { opacity: 0; animation: auth-fade .5s ease-out forwards }
        @media (prefers-reduced-motion: reduce) { .auth-rise, .auth-fade { opacity: 1; animation: none } }
      `}</style>

      {/* soft pale-blue backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[8%] top-[14%] hidden h-[62%] w-[52%] rounded-full bg-[#dcecfb] opacity-70 blur-3xl lg:block" />
        <div className="absolute bottom-[-10%] left-[22%] hidden h-[40%] w-[30%] rounded-full bg-[#e8f2fc] opacity-80 blur-3xl lg:block" />
        <div className="absolute inset-0 bg-[radial-gradient(#b9d4f0_1.2px,transparent_1.2px)] opacity-40 [background-size:26px_26px] [mask-image:radial-gradient(ellipse_60%_60%_at_75%_45%,black,transparent)]" />
      </div>

      <div className="relative grid flex-1 gap-6 py-6 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT: never remounts when the form switches */}
        <div className="hidden items-center justify-center px-6 lg:flex xl:px-12">
          <Link
            to="/"
            aria-label="ResuMate home"
            className="auth-rise block w-[min(34vw,560px)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#5b9bd5]"
          >
            <img
              src="/logo/resumate.png"
              alt="ResuMate – ATS-friendly resume builder"
              className="block h-auto w-full object-contain"
            />
          </Link>
        </div>

        {/* RIGHT: top-aligned so the heading sits in the same spot on Sign in and Sign up */}
        <div className="mx-auto w-full max-w-[520px] self-start px-6 pt-[clamp(0.5rem,4vh,2rem)] sm:px-10 lg:mx-0 lg:max-w-[580px] lg:px-0 lg:pr-[clamp(2rem,6vw,6rem)] lg:pt-[clamp(1rem,16vh,9rem)]">
          {/* small screens only: logo above the heading (left side is hidden there) */}
          <Link to="/" aria-label="ResuMate home" className="mx-auto mb-8 block w-fit lg:hidden">
            <img src="/logo/resumate.png" alt="ResuMate" className="block h-20 w-auto" />
          </Link>

          {/* only this part re-fades when the route changes */}
          <main key={formKey} className="auth-fade">
            {children}
          </main>
        </div>
      </div>

      <p className="relative shrink-0 pb-4 text-center text-xs text-[#4a5a70]">
        © {new Date().getFullYear()} ResuMate. All rights reserved.
      </p>
    </div>
  )
}

// Use this as a layout route in App.jsx so /signin and /signup share one frame
export function AuthLayout() {
  const { pathname } = useLocation()
  return (
    <AuthFrame formKey={pathname}>
      <Outlet />
    </AuthFrame>
  )
}

/* ---------- Heading + form content (rendered inside the frame's right side) ---------- */
export function AuthSplit({ title, subtitle, className = '', children }) {
  return (
    <div className={className}>
      <h1 className={`${DISPLAY} text-2xl font-light leading-tight tracking-tight text-[#0b1f3a] sm:text-[clamp(2rem,5.4vh,3.1rem)]`}>
        {title}
      </h1>
      {subtitle && (
        <p className="mb-[clamp(1.1rem,3.2vh,2rem)] mt-2 max-w-[440px] text-[1rem] leading-relaxed text-[#4a5a70]">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}

export default AuthSplit