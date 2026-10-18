import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ResuMate from './website/ResuMate'
import SignIn from './signin/SignIn'
import SignUp from './signup/SignUp'
import ResumeTemplates from './editing/ResumeTemplates'
import ResumeEditing from './editing/ResumeEditing'
import ProtectedRoute from './lib/ProtectedRoute'
import DashboardLayout from './dashboard/DashboardLayout'
import DashboardHome from './dashboard/DashboardHome'
import DashboardTemplates from './dashboard/DashboardTemplates'
import DashboardResumeEditing from './dashboard/ResumeEditing'
import Placeholder from './dashboard/Placeholder'
import './App.css'

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
      <Routes>
        <Route path="/" element={<ResuMate />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
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
          <Route path="resumes" element={<Placeholder title="My Resumes" description="Your saved resumes will appear here." />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App