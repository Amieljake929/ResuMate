import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function DashboardHome() {
  const { user } = useAuth()
  const firstName = (user?.user_metadata?.full_name || '').split(' ')[0] || 'there'

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Welcome, {firstName} 👋</h1>
      <p className="mt-1 text-slate-600">Here's where you can manage your resumes.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link to="/templates" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <h2 className="font-semibold text-slate-900">Create a new resume</h2>
          <p className="mt-1 text-sm text-slate-600">Pick a template and start building.</p>
        </Link>
        <Link to="/dashboard/resumes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <h2 className="font-semibold text-slate-900">My resumes</h2>
          <p className="mt-1 text-sm text-slate-600">Open or continue editing a saved resume.</p>
        </Link>
      </div>
    </div>
  )
}