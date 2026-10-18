import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useMatch, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Icon, HomeIcon, TemplateIcon, FolderIcon, SettingsIcon, LogoutIcon, MenuIcon } from './icons'

const SidebarToggleIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </Icon>
)

const links = [
  { to: '/dashboard', label: 'Overview', icon: HomeIcon, end: true },
  { to: '/dashboard/templates', label: 'Templates', icon: TemplateIcon, alsoActiveOnEditor: true },
  { to: '/dashboard/resumes', label: 'My Resumes', icon: FolderIcon },
  { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
]

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'
const EASE = 'duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]'

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
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
    return `flex items-center overflow-hidden rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${FOCUS} ${
      active ? 'bg-[#eef4fa] text-[#0b1f3a]' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0b1f3a]'
    }`
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#f4f7fb] font-['Jost',sans-serif] text-slate-900">
      {/* Mobile overlay: always mounted so it can fade in and out */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-[#0b1f3a]/50 backdrop-blur-sm transition-opacity ${EASE} md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

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
              <l.icon className="h-5 w-5 shrink-0 text-black" />
              <span className={`ml-3 whitespace-nowrap ${fade}`}>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="mt-auto shrink-0 border-t border-[#e3ebf4] pt-4">
          <div className="flex items-center overflow-hidden px-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-xs font-semibold text-white">{initials}</span>
            <div className={`ml-3 min-w-0 whitespace-nowrap ${fade}`}>
              <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className={`mt-3 flex w-full cursor-pointer items-center overflow-hidden rounded-lg border border-[#e3ebf4] px-[15px] py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 ${FOCUS}`}
          >
            <LogoutIcon className="h-5 w-5 shrink-0 text-black" />
            <span className={`ml-3 whitespace-nowrap ${fade}`}>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b border-[#e3ebf4] bg-white px-3 py-2.5 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className={`grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-black transition hover:bg-slate-100 ${FOCUS}`}
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <img src="/logo/resumate.png" alt="Resumate" className="h-11 w-auto" />
        </header>

        <main
          className={
            editorOpen
              ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
              : 'min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-10 md:py-8'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}