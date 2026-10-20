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
import { generateToken, hashToken, encryptPassword } from '../lib/pendingSignup'
import { sendVerificationEmail } from '../lib/emailjs'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [overlay, setOverlay] = useState(null) // null | 'loading' | 'success'
  const [error, setError] = useState('')
  const [password, setPassword] = useState('') // drives the strength indicator

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const name = form.get('name')?.toString().trim()
    const email = form.get('email')?.toString().trim()
    const rawPassword = form.get('password')?.toString()

    try {
      setOverlay('loading')

      // 1. Create a one-time token and encrypt the password with it.
      const token = generateToken()
      const tokenHash = await hashToken(token)
      const payload = await encryptPassword(rawPassword, token)

      // 2. Save a *pending* signup. No account exists yet.
      const { error: pendingError } = await supabase.rpc('create_pending_signup', {
        p_token_hash: tokenHash,
        p_email: email,
        p_full_name: name,
        p_payload: payload,
      })
      if (pendingError) throw pendingError

      // 3. Email the verification link through EmailJS.
      await sendVerificationEmail({ name, email, token })

      // 4. Show success, then go to the "check your email" page.
      setOverlay('success')
      await sleep(1500)
      navigate('/check-email', { state: { email, name, token } })
    } catch (err) {
      console.error(err)
      setOverlay(null)
      setLoading(false)
      setError(err?.text || err?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      {overlay && (
        <LoadingOverlay
          status={overlay}
          message="Sending your verification email…"
          successMessage="Verification email sent!"
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

          <button type="submit" disabled={loading} className={`${primaryBtn} max-w-[300px] justify-self-center disabled:cursor-not-allowed disabled:opacity-60`}>
            {loading ? 'Sending verification…' : 'Create account'}
          </button>
        </form>

        <SwitchLink mode="signup" />
      </AuthSplit>
    </>
  )
}