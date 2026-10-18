import { useNavigate } from 'react-router-dom'
import { AuthSplit, SocialRow, Divider, Field, primaryBtn } from '../components/AuthSplit'

export default function SignIn() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: call your sign-in API here
    navigate('/dashboard')
  }

  return (
    <AuthSplit mode="signin" title="Welcome back" subtitle="Sign in to continue building your resume.">
      <SocialRow />
      <Divider>or sign in with your email</Divider>
      <form onSubmit={handleSubmit} className="grid gap-[clamp(0.6rem,1.7vh,1rem)]">
        <Field label="Email" type="email" name="email" icon="mail" placeholder="you@example.com" autoComplete="email" required />
        <Field label="Password" type="password" name="password" icon="lock" placeholder="Enter your password" autoComplete="current-password" required />
        <button type="submit" className={`${primaryBtn} mt-1`}>Sign in</button>
      </form>
    </AuthSplit>
  )
}