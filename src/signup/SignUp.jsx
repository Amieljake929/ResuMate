import { useNavigate } from 'react-router-dom'
import { AuthSplit, SocialRow, Divider, Field, primaryBtn } from '../components/AuthSplit'

export default function SignUp() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: call your sign-up API here
    navigate('/templates')
  }

  return (
    <AuthSplit mode="signup" title="Create your account" subtitle="Start building a professional resume in minutes.">
      <SocialRow />
      <Divider>or sign up with your email</Divider>
      <form onSubmit={handleSubmit} className="grid gap-[clamp(0.6rem,1.7vh,1rem)]">
        <Field label="Full name" type="text" name="name" icon="user" placeholder="Your full name" autoComplete="name" required />
        <Field label="Email" type="email" name="email" icon="mail" placeholder="you@example.com" autoComplete="email" required />
        <Field label="Password" hint="At least 8 characters" type="password" name="password" icon="lock" placeholder="Create a password" autoComplete="new-password" minLength={8} required />
        <button type="submit" className={`${primaryBtn} mt-1`}>Create account</button>
      </form>
    </AuthSplit>
  )
}