import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { AuthSplit } from '../components/AuthSplit'
import { sendVerificationEmail } from '../lib/emailjs'

const COOLDOWN_SECONDS = 30

export default function CheckEmail() {
  const { state } = useLocation() // { email, name, token } from SignUp
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // Opened this page directly without signing up first
  if (!state?.email || !state?.token) return <Navigate to="/signup" replace />

  const handleResend = async () => {
    setError('')
    setMessage('')
    setSending(true)
    try {
      await sendVerificationEmail({ name: state.name, email: state.email, token: state.token })
      setMessage('We sent the email again.')
      setCooldown(COOLDOWN_SECONDS)
    } catch (err) {
      setError(err?.text || err?.message || 'Could not resend the email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthSplit title="Verify your email" subtitle="Your account will be created once you confirm your email address.">
      <div className="grid gap-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </div>

        <p className="text-sm leading-relaxed text-gray-600">
          We sent a verification link to <strong className="text-gray-900">{state.email}</strong>.
          Open the email and click <strong className="text-gray-900">Verify Your Email</strong> to finish creating your account.
          The link expires in 24 hours.
        </p>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {message && <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}

        <p className="text-sm text-gray-500">
          Didn’t get it? Check your spam folder, or{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={sending || cooldown > 0}
            className="font-medium text-blue-600 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
          >
            {sending ? 'sending…' : cooldown > 0 ? `resend in ${cooldown}s` : 'resend the email'}
          </button>
          .
        </p>

        <Link to="/signup" className="text-sm text-gray-500 hover:text-gray-700">
          Use a different email
        </Link>
      </div>
    </AuthSplit>
  )
}