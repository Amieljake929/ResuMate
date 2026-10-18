import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthSplit, SocialRow, Divider, Field, primaryBtn } from '../components/AuthSplit'
import { supabase } from '../lib/supabase'

export default function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email')?.toString().trim()
    const password = form.get('password')?.toString()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/dashboard')
  }

  return (
    <AuthSplit mode="signin" title="Welcome back" subtitle="Sign in to continue building your resume.">
      <SocialRow />
      <Divider>or sign in with your email</Divider>
      <form onSubmit={handleSubmit} className="grid gap-[clamp(0.6rem,1.7vh,1rem)]">
        <Field label="Email" type="email" name="email" icon="mail" placeholder="you@example.com" autoComplete="email" required />
        <Field label="Password" type="password" name="password" icon="lock" placeholder="Enter your password" autoComplete="current-password" required />

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button type="submit" disabled={loading} className={`${primaryBtn} mt-1 disabled:opacity-60`}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthSplit>
  )
}