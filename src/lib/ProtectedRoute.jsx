import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-slate-500">Loading…</div>
  }
  if (!user) return <Navigate to="/signin" replace />

  return children
}