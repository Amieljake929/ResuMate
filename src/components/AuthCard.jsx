import { Link } from 'react-router-dom'

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-b from-white to-[#f1f7fd] px-4 py-10 font-['Jost',sans-serif] text-[#111]">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(#b9d4f0_1.2px,transparent_1.2px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_45%,black,transparent)]" />
      <div className="relative w-full max-w-[440px] animate-[rm-fade_0.7s_forwards] opacity-0">
        <Link to="/" className="mb-6 flex justify-center"><img src="/logo/resumate.png" alt="ResuMate" className="h-14 w-auto md:h-16" /></Link>
        <div className="rounded-2xl border border-[#dde8f3] bg-white p-7 shadow-[0_24px_60px_rgba(11,31,58,0.08)] md:p-9">
          <h1 className="font-['Outfit','Jost',sans-serif] text-[1.9rem] font-medium leading-tight text-[#0b1f3a]">{title}</h1>
          <p className="mb-6 mt-1.5 text-[#4a5a70]">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

const social = 'flex w-full cursor-pointer items-center justify-center gap-3 rounded border border-[#dde8f3] bg-white px-4 py-3 text-sm font-bold text-[#0b1f3a] transition duration-300 hover:-translate-y-0.5 hover:border-[#0b1f3a]'

/* Placeholders only: no sign-in logic is connected yet. */
export function SocialButtons() {
  return (
    <div className="grid gap-3">
      <button type="button" className={social}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0b1f3a" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.500 6 8.500-6" /></svg>
        Continue with Email
      </button>
      <button type="button" className={social}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2" aria-hidden="true"><path d="M13.500 21v-7.500h2.500l.4-3h-2.900V8.600c0-.9.3-1.500 1.500-1.500h1.500V4.400c-.3 0-1.200-.1-2.200-.1-2.200 0-3.700 1.300-3.700 3.800v2.200H8v3h2.600V21z" /></svg>
        Continue with Facebook
      </button>
      <button type="button" className={social}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a66c2" aria-hidden="true"><path d="M6.900 8.800H3.800V20h3.100zM5.300 4a1.800 1.800 0 100 3.600A1.800 1.800 0 005.300 4zM20 13.600c0-3.100-1.600-4.900-4.200-4.900-1.200 0-2.100.6-2.600 1.400V8.800h-3.100V20h3.100v-6c0-1.500.7-2.500 2-2.500s1.800.9 1.800 2.500V20H20z" /></svg>
        Continue with LinkedIn
      </button>
    </div>
  )
}

export function Divider({ children }) {
  return (
    <div className="my-6 flex items-center gap-4 text-xs text-[#4a5a70]">
      <span className="h-px flex-1 bg-[#dde8f3]" />{children}<span className="h-px flex-1 bg-[#dde8f3]" />
    </div>
  )
}

export function Input({ label, ...props }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-[#0b1f3a]">
      {label}
      <input {...props} className="rounded border border-[#dde8f3] bg-[#f1f7fd] px-3.5 py-3 text-base font-normal text-[#111] transition focus:border-[#5b9bd5] focus:bg-white focus:outline-none" />
    </label>
  )
}

export const primaryBtn = 'w-full cursor-pointer rounded bg-[#0b1f3a] px-6 py-3.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#17335c]'
export const outlineBtn = 'block w-full rounded border border-[#0b1f3a] px-6 py-3.5 text-center text-sm font-bold text-[#0b1f3a] transition duration-300 hover:bg-[#0b1f3a] hover:text-white'