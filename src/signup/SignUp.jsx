import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AuthSplit,
  SwitchLink,
  PasswordStrength,
  TermsCheckbox,
  FieldGroup,
  Field,
  primaryBtn,
} from '../components/AuthSplit'
import LoadingOverlay from '../components/LoadingOverlay'
import { supabase } from '../lib/supabase'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [overlay, setOverlay] = useState(null) // null | 'loading' | 'success'
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [password, setPassword] = useState('') // drives the strength indicator

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

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    // Success: loading animation -> confirmation message
    setOverlay('loading')
    await sleep(1500)
    setOverlay('success')
    await sleep(1500)

    // If email confirmation is ON, there is no session yet
    if (!data.session) {
      setOverlay(null)
      setLoading(false)
      setInfo('Account created! Please check your email to confirm your account, then sign in.')
      return
    }

    navigate('/signin')
  }

  return (
    <>
      {overlay && (
        <LoadingOverlay
          status={overlay}
          message="Creating your account…"
          successMessage="Account created successfully!"
        />
      )}

      <AuthSplit title="Create your account" subtitle="Start building a professional resume in minutes.">
        <form onSubmit={handleSubmit} className="grid gap-[clamp(0.9rem,2.4vh,1.5rem)]">
          <FieldGroup>
            <Field label="Full name" type="text" name="name" icon="user" placeholder="Your full name" autoComplete="name" required />
            <Field label="Email address" type="email" name="email" icon="mail" placeholder="you@example.com" autoComplete="email" required />
            <Field
              label="Password"
              hint="At least 8 characters"
              type="password"
              name="password"
              icon="lock"
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </FieldGroup>

          <PasswordStrength password={password} />

          <TermsCheckbox />

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          {info && (
            <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{info}</p>
          )}

          <button type="submit" disabled={loading} className={`${primaryBtn} max-w-[300px] justify-self-center disabled:cursor-not-allowed disabled:opacity-60`}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <SwitchLink mode="signup" />
      </AuthSplit>
    </>
  )
}