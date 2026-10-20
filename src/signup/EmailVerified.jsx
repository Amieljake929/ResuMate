import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthSplit, primaryBtn } from '../components/AuthSplit'
import { supabase } from '../lib/supabase'
import { hashToken, decryptPassword } from '../lib/pendingSignup'

// verifying | success | exists | invalid | error
export default function EmailVerified() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('verifying')
  const ran = useRef(false) // React StrictMode runs effects twice in dev

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const run = async () => {
      if (!token) return setStatus('invalid')

      try {
        const tokenHash = await hashToken(token)

        // 1. Look up the pending signup (valid for 24 hours)
        const { data: rows, error: getError } = await supabase.rpc('get_pending_signup', {
          p_token_hash: tokenHash,
        })
        if (getError) throw getError

        const pending = rows?.[0]
        if (!pending) return setStatus('invalid')

        // 2. Decrypt the password with the token from the link
        const password = await decryptPassword(pending.payload, token)

        // 3. NOW the account is actually created
        const { error: signUpError } = await supabase.auth.signUp({
          email: pending.email,
          password,
          options: { data: { full_name: pending.full_name } }, // saved to profiles by your trigger
        })

        if (signUpError) {
          if (/already registered/i.test(signUpError.message)) {
            await supabase.rpc('delete_pending_signup', { p_token_hash: tokenHash })
            return setStatus('exists')
          }
          throw signUpError
        }

        // 4. Don't leave them logged in — they go to the Sign in page next
        await supabase.auth.signOut()
        await supabase.rpc('delete_pending_signup', { p_token_hash: tokenHash })
        setStatus('success')
      } catch (err) {
        console.error(err)
        setStatus('error')
      }
    }

    run()
  }, [token])

  const content = {
    verifying: {
      title: 'Verifying your email…',
      subtitle: 'Hang tight, this only takes a moment.',
    },
    success: {
      title: 'Email verified',
      subtitle: 'Your account is ready. You can sign in now.',
    },
    exists: {
      title: 'Account already exists',
      subtitle: 'This email is already registered. Sign in to continue.',
    },
    invalid: {
      title: 'Link is not valid',
      subtitle: 'This link has expired or was already used. If you already verified, sign in. Otherwise, sign up again.',
    },
    error: {
      title: 'Something went wrong',
      subtitle: 'We couldn’t verify your email. Please try the link again in a moment.',
    },
  }[status]

  return (
    <AuthSplit title={content.title} subtitle={content.subtitle}>
      <div className="grid justify-items-center gap-6">
        {status === 'verifying' && (
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" role="status" aria-label="Verifying" />
        )}

        {status === 'success' && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </div>
        )}

        {status === 'success' && (
          <p className="text-center text-sm text-gray-600">
            You’ve successfully verified your account.
          </p>
        )}

        {(status === 'success' || status === 'exists' || status === 'invalid') && (
          <button type="button" onClick={() => navigate('/signin')} className={`${primaryBtn} w-full max-w-[300px]`}>
            Go to the Sign in page
          </button>
        )}

        {(status === 'invalid' || status === 'error') && (
          <button type="button" onClick={() => navigate('/signup')} className="text-sm font-medium text-blue-600 hover:underline">
            Back to Sign up
          </button>
        )}
      </div>
    </AuthSplit>
  )
}