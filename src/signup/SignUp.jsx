import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthSplit, SocialRow, Divider, Field, primaryBtn } from '../components/AuthSplit'
import { supabase } from '../lib/supabase'

export default function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const name = form.get('name')?.toString().trim()
    const email = form.get('email')?.toString().trim()
    const password = form.get('password')?.toString()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }, // saved to your profiles table by the trigger
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // If email confirmation is ON, there is no session yet
    if (!data.session) {
      setInfo('Account created! Please check your email to confirm your account, then sign in.')
      return
    }

    navigate('/signin')
  }

  return (
    <AuthSplit mode="signup" title="Create your account" subtitle="Start building a professional resume in minutes.">
      <SocialRow />
      <Divider>or sign up with your email</Divider>
      <form onSubmit={handleSubmit} className="grid gap-[clamp(0.6rem,1.7vh,1rem)]">
        <Field label="Full name" type="text" name="name" icon="user" placeholder="Your full name" autoComplete="name" required />
        <Field label="Email" type="email" name="email" icon="mail" placeholder="you@example.com" autoComplete="email" required />
        <Field label="Password" hint="At least 8 characters" type="password" name="password" icon="lock" placeholder="Create a password" autoComplete="new-password" minLength={8} required />

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {info && (
          <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{info}</p>
        )}

        <button type="submit" disabled={loading} className={`${primaryBtn} mt-1 disabled:opacity-60`}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthSplit>
  )
}