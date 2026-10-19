import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import {
  Icon,
  HomeIcon,
  TemplateIcon,
  FolderIcon,
  LogoutIcon,
  MenuIcon,
  BellIcon,
  UserIcon,
  SettingsIcon,
  HelpIcon,
  ChevronDownIcon,
} from './icons'

const SidebarToggleIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </Icon>
)

// Settings moved to the profile dropdown.
const links = [
  { to: '/dashboard', label: 'Overview', icon: HomeIcon, end: true },
  { to: '/dashboard/templates', label: 'Templates', icon: TemplateIcon, alsoActiveOnEditor: true },
  { to: '/dashboard/resumes', label: 'My Resumes', icon: FolderIcon },
]

const MENU = [
  { to: '/dashboard/profile', label: 'Profile', icon: UserIcon },
  { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
  { to: '/dashboard/help', label: 'Help Center', icon: HelpIcon },
]

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'
const EASE = 'duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]'
const SPRING = { type: 'spring', stiffness: 520, damping: 38 }

// Closes a popover on outside click / tap and on Escape.
function useDismiss(open, close, ref) {
  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && close()
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, ref])
}

const popover = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.97 },
  transition: { duration: 0.16, ease: [0.2, 0.7, 0.2, 1] },
}

function NotificationButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = () => setOpen(false)
  useDismiss(open, close, ref)

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className={`relative grid h-10 w-10 cursor-pointer place-items-center rounded-full text-black transition-colors duration-200 hover:bg-slate-100 ${FOCUS}`}
      >
        <BellIcon className="h-5 w-5" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#e5484d] ring-2 ring-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...popover}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[#e3ebf4] bg-white p-2 shadow-[0_18px_40px_rgba(11,31,58,0.14)]"
          >
            <p className="px-3 pb-2 pt-2 text-sm font-semibold text-[#0b1f3a]">Notifications</p>
            <div className="rounded-lg bg-[#f6faff] px-3 py-6 text-center">
              <p className="text-sm font-medium text-slate-800">You're all caught up</p>
              <p className="mt-0.5 text-xs text-slate-500">New updates will show up here.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProfileMenu({ name, email, initials, onSignOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = () => setOpen(false)
  useDismiss(open, close, ref)

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex cursor-pointer items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors duration-200 hover:bg-slate-100 sm:pr-3 ${
          open ? 'bg-slate-100' : ''
        } ${FOCUS}`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[180px] truncate text-sm font-semibold text-slate-900 sm:block">{name}</span>
        <ChevronDownIcon
          className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...popover}
            role="menu"
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[#e3ebf4] bg-white p-1.5 shadow-[0_18px_40px_rgba(11,31,58,0.14)]"
          >
            <div className="px-3 pb-2.5 pt-2">
              <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
              <p className="truncate text-xs text-slate-500">{email}</p>
            </div>
            <div className="mx-1 border-t border-[#e3ebf4]" />
            <div className="py-1.5">
              {MENU.map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  role="menuitem"
                  onClick={close}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-[#eef4fa] hover:text-[#0b1f3a] ${FOCUS}`}
                >
                  <m.icon className="h-[18px] w-[18px] text-black" />
                  {m.label}
                </Link>
              ))}
            </div>
            <div className="mx-1 border-t border-[#e3ebf4]" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close()
                onSignOut()
              }}
              className={`mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 ${FOCUS}`}
            >
              <LogoutIcon className="h-[18px] w-[18px]" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false) // mobile drawer
  const [pref, setPref] = useState(null) // desktop: null = automatic, true = collapsed, false = expanded
  const editor = useMatch('/dashboard/editor/:templateId')
  const editorOpen = !!editor

  // Automatic by default: collapsed while editing, expanded elsewhere.
  // Going in or out of the editor resets any manual choice.
  useEffect(() => { setPref(null) }, [editorOpen])
  const collapsed = pref ?? editorOpen

  // Close the mobile drawer with the Escape key.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggleSidebar = () => {
    if (window.matchMedia('(min-width: 768px)').matches) setPref(!collapsed)
    else setOpen(false)
  }

  const name = user?.user_metadata?.full_name || user?.email || ''
  const initials =
    name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'U'

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin')
  }

  // Text fades out first when closing, and fades in slightly after the width opens.
  const fade = `transition-opacity duration-200 ${collapsed ? 'md:opacity-0' : 'delay-100'}`

  const linkClass = (l) => ({ isActive }) => {
    const active = isActive || (l.alsoActiveOnEditor && editorOpen)
    return `relative flex items-center overflow-hidden rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${FOCUS} ${
      active ? 'text-[#0b1f3a]' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0b1f3a]'
    }`
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-[100dvh] overflow-hidden bg-[#f4f7fb] font-['Jost',sans-serif] text-slate-900">
        {/* Mobile overlay */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="overlay"
              aria-hidden="true"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-30 bg-[#0b1f3a]/50 backdrop-blur-sm md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 flex h-[100dvh] w-64 flex-col overflow-hidden border-r border-[#e3ebf4] bg-white px-3 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 transition-[transform,translate,width,box-shadow] ${EASE} md:static md:h-auto md:translate-x-0 md:pb-5 md:shadow-none ${
            collapsed ? 'md:w-[76px]' : ''
          } ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}`}
        >
          {/* Brand + toggle */}
          <div className="relative mb-6 h-14 shrink-0">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className={`absolute left-1 top-1/2 -translate-y-1/2 rounded ${FOCUS} ${fade} ${collapsed ? 'md:pointer-events-none' : ''}`}
              tabIndex={collapsed ? -1 : 0}
            >
              <img src="/logo/resumate.png" alt="Resumate" className="h-14 w-auto max-w-[170px] object-contain" />
            </Link>
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={`absolute top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-black transition-[left,background-color] ${EASE} left-[196px] hover:bg-slate-100 ${
                collapsed ? 'md:left-[8px]' : ''
              } ${FOCUS}`}
            >
              <SidebarToggleIcon className="h-5 w-5" />
            </button>
          </div>

          <p className={`mb-2 overflow-hidden whitespace-nowrap px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${fade}`}>Menu</p>
          <nav className="flex min-h-0 flex-col gap-1 overflow-y-auto">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                title={collapsed ? l.label : undefined}
                className={linkClass(l)}
                onClick={() => setOpen(false)}
              >
                {({ isActive }) => {
                  const active = isActive || (l.alsoActiveOnEditor && editorOpen)
                  return (
                    <>
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          transition={SPRING}
                          className="absolute inset-0 rounded-lg bg-[#eef4fa]"
                        />
                      )}
                      <l.icon className="relative h-5 w-5 shrink-0 text-black" />
                      <span className={`relative ml-3 whitespace-nowrap ${fade}`}>{l.label}</span>
                    </>
                  )
                }}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar: mobile shows menu + logo, both sizes show notifications | profile on the right */}
          <header className="relative z-20 flex h-16 shrink-0 items-center gap-2 border-b border-[#e3ebf4] bg-white/90 px-3 backdrop-blur md:px-8">
            <button
              onClick={() => setOpen(true)}
              className={`grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-black transition hover:bg-slate-100 md:hidden ${FOCUS}`}
              aria-label="Open menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <img src="/logo/resumate.png" alt="Resumate" className="h-11 w-auto md:hidden" />

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
              <NotificationButton />
              <span aria-hidden="true" className="h-6 w-px bg-[#dbe5f0]" />
              <ProfileMenu name={name} email={user?.email} initials={initials} onSignOut={handleSignOut} />
            </div>
          </header>

          <main
            className={
              editorOpen
                ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
                : 'min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-10 md:py-8'
            }
          >
            {/* Re-keyed per route so each page eases in */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              className={editorOpen ? 'flex min-h-0 flex-1 flex-col' : ''}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </MotionConfig>
  )
}