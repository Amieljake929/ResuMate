import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthSplit, SwitchLink, FieldGroup, Field, primaryBtn } from '../components/AuthSplit'
import LoadingOverlay from '../components/LoadingOverlay'
import { supabase } from '../lib/supabase'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [overlay, setOverlay] = useState(null) // null | 'loading' | 'success'
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email')?.toString().trim()
    const password = form.get('password')?.toString()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    // Success: loading animation -> confirmation message -> dashboard
    setOverlay('loading')
    await sleep(1500)
    setOverlay('success')
    await sleep(1500)
    navigate('/dashboard')
  }

  return (
    <>
      {overlay && (
        <LoadingOverlay
          status={overlay}
          message="Signing you in…"
          successMessage="You logged in successfully!"
        />
      )}

      {/* the Sign in form is shorter than Sign up, so nudge it down on desktop to sit level with the logo */}
      <AuthSplit
        title="Log in to continue"
        subtitle="Sign in to continue building your resume."
        className="lg:mt-[clamp(0px,7vh,4rem)]"
      >
        <form onSubmit={handleSubmit} className="grid gap-[clamp(0.9rem,2.4vh,1.5rem)]">
          <FieldGroup>
            <Field label="Email address" type="email" name="email" icon="mail" placeholder="you@example.com" autoComplete="email" required />
            <Field label="Password" type="password" name="password" icon="lock" placeholder="Enter your password" autoComplete="current-password" required />
          </FieldGroup>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button type="submit" disabled={loading} className={`${primaryBtn} max-w-[300px] justify-self-center disabled:cursor-not-allowed disabled:opacity-60`}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <SwitchLink mode="signin" />
      </AuthSplit>
    </>
  )
}