// AuthCard shares the same design as AuthSplit. Same exports as before.
import {
  AuthFrame,
  AuthSplit,
  SocialRow,
  Divider,
  Field,
  FieldGroup,
  primaryBtn,
  outlineBtn,
} from './AuthSplit'

export { Divider, primaryBtn, outlineBtn }

// Standalone page (use this only if the page is NOT nested under <AuthLayout />)
export function AuthShell({ title, subtitle, children }) {
  return (
    <AuthFrame>
      <AuthSplit title={title} subtitle={subtitle}>
        {children}
      </AuthSplit>
    </AuthFrame>
  )
}

/* Placeholders only: no sign-in logic is connected yet. */
export function SocialButtons(props) {
  return <SocialRow {...props} />
}

export function Input({ label, ...props }) {
  return (
    <FieldGroup>
      <Field label={label} {...props} />
    </FieldGroup>
  )
}