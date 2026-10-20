import emailjs from '@emailjs/browser'

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

const APP_NAME = 'Resumate' // shown in the email — change to your app's name

/**
 * Sends the "Verify Your Email" message.
 * The variables below must match the {{placeholders}} in your EmailJS template.
 */
export async function sendVerificationEmail({ name, email, token }) {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    throw new Error('Email service is not configured. Check your EmailJS environment variables.')
  }

  const verify_link = `${window.location.origin}/verify?token=${token}`

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_name: name,
      to_email: email,
      verify_link,
      app_name: APP_NAME,
    },
    { publicKey: PUBLIC_KEY },
  )
}