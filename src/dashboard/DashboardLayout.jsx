import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const links = [
  { to: '/dashboard', label: 'Overview', icon: '🏠', end: true },
  { to: '/templates', label: 'Templates', icon: '📄' },
  { to: '/dashboard/resumes', label: 'My Resumes', icon: '🗂️' },
  { to: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const name = user?.user_metadata?.full_name || user?.email

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white p-4 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 px-2 text-xl font-bold text-indigo-600">Resumate</div>

        <nav className="grid gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-4">
          <p className="truncate px-2 text-sm font-medium text-slate-800">{name}</p>
          <p className="truncate px-2 text-xs text-slate-500">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg border border-slate-200 px-3 py-1 text-lg" aria-label="Open menu">
            ☰
          </button>
          <span className="font-semibold text-indigo-600">Resumate</span>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}