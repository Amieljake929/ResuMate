import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import { listActivities, removeActivity } from '../lib/activityStore'
import { TEMPLATES, ResumePreview } from '../editing/templateData'
import { PlusIcon, CheckIcon, FolderIcon, ArrowRightIcon } from './icons'

const EASE = [0.2, 0.7, 0.2, 1]
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5]'

const fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export default function MyActivities() {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const location = useLocation()
  const navigate = useNavigate()

  const [items, setItems] = useState(() => listActivities(userId))
  const [confirmId, setConfirmId] = useState(null)
  // Success message passed from the editor. Read once, then clear it from history.
  const [banner, setBanner] = useState(() => location.state?.added ? { title: location.state.added, updated: !!location.state.updated } : null)
  useEffect(() => {
    if (location.state?.added) navigate(location.pathname, { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const remove = (id) => {
    removeActivity(userId, id)
    setItems((l) => l.filter((a) => a.id !== id))
    setConfirmId(null)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AnimatePresence>
        {banner && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mb-5 flex items-start gap-3 rounded-2xl border border-[#bfe8d3] bg-[#eaf8f1] p-4 text-sm text-[#0f6b40]"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#169b5b] text-white">
              <CheckIcon className="h-3 w-3" />
            </span>
            <p className="flex-1">
              <span className="font-semibold">{banner.updated ? 'Resume updated.' : 'Resume added.'}</span>{' '}
              “{banner.title}” was successfully {banner.updated ? 'updated in' : 'added to'} My Activities.
            </p>
            <button
              type="button"
              onClick={() => setBanner(null)}
              aria-label="Dismiss message"
              className={`cursor-pointer rounded px-1 text-lg leading-none text-[#0f6b40] hover:text-black ${FOCUS}`}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-[#e3ebf4] bg-white p-5 shadow-sm sm:p-7"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0b1f3a] md:text-3xl">My Activities</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600">
            Resumes you saved. Open one to keep editing or download it again.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="rounded-full bg-[#eef4fa] px-3 py-1 text-sm font-semibold text-[#0b1f3a]">
            {items.length} {items.length === 1 ? 'resume' : 'resumes'}
          </p>
          <Link
            to="/dashboard/templates"
            className={`inline-flex items-center gap-2 rounded-lg bg-[#0b1f3a] px-4 py-2 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#17335c] ${FOCUS}`}
          >
            <PlusIcon className="h-4 w-4" /> New resume
          </Link>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
          className="mt-8 rounded-3xl border border-dashed border-[#c9d8e8] bg-white px-6 py-16 text-center"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4fa] text-[#0b1f3a]">
            <FolderIcon className="h-6 w-6" />
          </span>
          <p className="mt-4 text-lg font-semibold text-slate-900">No saved resumes yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
            Finish a resume and choose “Add to My Activities” on the last step. It will show up here.
          </p>
          <Link
            to="/dashboard/templates"
            className={`mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0b1f3a] px-5 py-2.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 ${FOCUS}`}
          >
            Browse resume templates <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        <motion.div layout className="mt-8 grid grid-cols-1 gap-5 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((a) => {
              const t = TEMPLATES.find((x) => x.id === a.templateId) || TEMPLATES[0]
              const editTo = `/dashboard/editor/${t.id}?activity=${a.id}`
              return (
                <motion.article
                  key={a.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="group flex flex-col rounded-2xl border border-[#e3ebf4] bg-white p-3 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <Link to={editTo} aria-label={`Open ${a.title}`} className={`block overflow-hidden rounded-xl border border-[#dde8f3] ${FOCUS}`}>
                    <ResumePreview t={t} data={a.data} thumb />
                  </Link>

                  <div className="mt-3 flex-1 px-1">
                    <p className="truncate font-semibold text-slate-900" title={a.title}>{a.title}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.accent }} />
                      {t.name} · Saved {fmtDate(a.updatedAt)}
                    </p>
                    {typeof a.score === 'number' && (
                      <p className="mt-2 inline-block rounded-full bg-[#eef4fa] px-2.5 py-0.5 text-[11px] font-bold text-[#0b1f3a]">
                        Score {a.score}%
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2 px-1 pb-1">
                    {confirmId === a.id ? (
                      <>
                        <button type="button" onClick={() => remove(a.id)} className={`flex-1 cursor-pointer rounded-lg bg-[#c0392b] py-2 text-sm font-bold text-white transition hover:bg-[#a93226] ${FOCUS}`}>
                          Delete
                        </button>
                        <button type="button" onClick={() => setConfirmId(null)} className={`flex-1 cursor-pointer rounded-lg border border-[#dde8f3] py-2 text-sm font-bold text-[#0b1f3a] transition hover:bg-slate-50 ${FOCUS}`}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to={editTo} className={`flex-1 rounded-lg bg-[#0b1f3a] py-2 text-center text-sm font-bold text-white transition hover:bg-[#17335c] ${FOCUS}`}>
                          Open
                        </Link>
                        <button type="button" onClick={() => setConfirmId(a.id)} className={`cursor-pointer rounded-lg border border-[#dde8f3] px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-[#e8b4ae] hover:bg-red-50 hover:text-red-600 ${FOCUS}`}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}