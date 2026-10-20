/* Saved resumes ("My Activities"), kept in this browser's localStorage, one list per user.
   To sync across devices later, replace the bodies of these functions with Supabase calls. */

const key = (uid) => `resumate:activities:${uid || 'guest'}`

const read = (uid) => {
  try {
    const v = JSON.parse(localStorage.getItem(key(uid)) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export const newActivityId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/* Newest first. */
export const listActivities = (uid) => read(uid).sort((a, b) => b.updatedAt - a.updatedAt)

export const getActivity = (uid, id) => read(uid).find((a) => a.id === id) || null

/* Adds a new resume, or updates it when the id already exists. */
export function saveActivity(uid, item) {
  const list = read(uid)
  const now = Date.now()
  const i = list.findIndex((a) => a.id === item.id)
  const record = { ...item, createdAt: i >= 0 ? list[i].createdAt : now, updatedAt: now }
  if (i >= 0) list[i] = record
  else list.push(record)
  try {
    localStorage.setItem(key(uid), JSON.stringify(list))
    return { ok: true }
  } catch {
    return { ok: false, error: 'We could not save your resume. Your browser storage may be full or blocked.' }
  }
}

export function removeActivity(uid, id) {
  try {
    localStorage.setItem(key(uid), JSON.stringify(read(uid).filter((a) => a.id !== id)))
  } catch {
    /* nothing to do */
  }
}