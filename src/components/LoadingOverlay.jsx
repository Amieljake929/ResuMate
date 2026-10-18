import { useEffect, useState } from 'react'

// Full-screen overlay: solid white, ResuMate logo with a horizontal progress bar.
// Fades in smoothly when it appears.
// status="loading" -> logo + filling bar + message
// status="success" -> logo + full green bar + check + successMessage
// Logo is served from /public/logo/resumate.png
export default function LoadingOverlay({
  status = 'loading',
  message = 'Loading…',
  successMessage = 'Success!',
  duration = 1500, // ms the bar takes to fill
}) {
  const isSuccess = status === 'success'
  const [mounted, setMounted] = useState(false)

  // Start hidden, then flip on the next frame so the CSS transitions run (fade-in + bar fill)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-white px-6 transition-opacity duration-500 ease-out ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* logo + bar + text rise gently into place while the overlay fades in */}
      <div
        className={`flex flex-col items-center gap-8 transition-all duration-700 ease-out ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <img
          src="/logo/resumate.png"
          alt="ResuMate"
          className="h-auto w-48 max-w-[60vw] select-none"
          draggable="false"
        />

        {/* horizontal loading indicator */}
        <div className="h-1.5 w-64 max-w-[70vw] overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-[width,background-color] ease-out ${
              isSuccess ? 'bg-green-500' : 'bg-gray-900'
            }`}
            style={{
              width: mounted || isSuccess ? '100%' : '0%',
              transitionDuration: `${isSuccess ? 300 : duration}ms`,
            }}
          />
        </div>

        <p className="flex items-center gap-2 text-center text-base font-semibold text-gray-900">
          {isSuccess && (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isSuccess ? successMessage : message}
        </p>
      </div>
    </div>
  )
}