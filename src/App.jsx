import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ResuMate from './website/ResuMate'
import SignIn from './signin/SignIn'
import SignUp from './signup/SignUp'
import CheckEmail from './signup/CheckEmail'
import EmailVerified from './signup/EmailVerified'
import ResumeTemplates from './editing/ResumeTemplates'
import ResumeEditing from './editing/ResumeEditing'
import ProtectedRoute from './lib/ProtectedRoute'
import LoadingOverlay from './components/LoadingOverlay'
import { AuthLayout } from './components/AuthSplit'
import Placeholder from './dashboard/Placeholder'
import './App.css'

// Dashboard pages are loaded on demand, so the loading animation
// shows while they load right after a successful login.
const DashboardLayout = lazy(() => import('./dashboard/DashboardLayout'))
const DashboardHome = lazy(() => import('./dashboard/DashboardHome'))
const DashboardTemplates = lazy(() => import('./dashboard/DashboardTemplates'))
const DashboardResumeEditing = lazy(() => import('./dashboard/ResumeEditing'))
const MyActivities = lazy(() => import('./dashboard/MyActivities'))
const CoverLetter = lazy(() => import('./dashboard/CoverLetter'))
const AtsChecker = lazy(() => import('./dashboard/AtsChecker'))
const JobTracker = lazy(() => import('./dashboard/JobTracker'))
const InterviewPrep = lazy(() => import('./dashboard/InterviewPrep'))

// Simple 404 page
const NotFound = () => (
  <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
    <h1>Page not found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/">Back to home</Link>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay message="Loading…" />}>
        <Routes>
          <Route path="/" element={<ResuMate />} />

          {/* Sign in / Sign up / email verification share one layout, so the left side never reloads when switching */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/verify" element={<EmailVerified />} />
          </Route>

          <Route path="/templates" element={<ProtectedRoute><ResumeTemplates /></ProtectedRoute>} />
          <Route path="/editing" element={<ResumeEditing />} />
          <Route path="/editing/:templateId" element={<ResumeEditing />} />

          {/* Protected dashboard: only logged-in users can open these */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="templates" element={<DashboardTemplates />} />
            <Route path="editor" element={<DashboardResumeEditing />} />
            <Route path="editor/:templateId" element={<DashboardResumeEditing />} />
            <Route path="resumes" element={<MyActivities />} />
            <Route path="cover-letters" element={<CoverLetter />} />
            <Route path="ats-checker" element={<AtsChecker />} />
            <Route path="job-tracker" element={<JobTracker />} />
            <Route path="interview-prep" element={<InterviewPrep />} />

            {/* Placeholder pages: reached from the profile menu and the "Visit Help Center" link */}
            <Route path="profile" element={<Placeholder title="Profile" />} />
            <Route path="settings" element={<Placeholder title="Settings" />} />
            <Route path="help" element={<Placeholder title="Help Center" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App