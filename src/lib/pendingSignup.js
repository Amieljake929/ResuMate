// Helpers for the "verify email before the account is created" flow.
//
// The password is encrypted in the browser (AES-GCM) with a random token.
// Only a SHA-256 hash of that token is saved in the database; the token itself
// only exists inside the email link. So a database leak never exposes passwords.

const enc = new TextEncoder()
const dec = new TextDecoder()

const toHex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const fromB64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0))

/** Random 256-bit token (64 hex chars) that goes into the email link. */
export function generateToken() {
  return toHex(crypto.getRandomValues(new Uint8Array(32)))
}

/** What we store in the database to look the pending signup up later. */
export async function hashToken(token) {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(token)))
}

async function getKey(token) {
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(`enc:${token}`))
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

export async function encryptPassword(password, token) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await getKey(token)
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(password))
  return `${toB64(iv)}.${toB64(cipher)}`
}

export async function decryptPassword(payload, token) {
  const [iv, data] = payload.split('.')
  const key = await getKey(token)
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(iv) }, key, fromB64(data))
  return dec.decode(plain)
}