import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ResuMate from './website/ResuMate'
import SignIn from './signin/SignIn'
import SignUp from './signup/SignUp'
import ResumeTemplates from './editing/ResumeTemplates'
import ResumeEditing from './editing/ResumeEditing'
import './App.css'

// Temporary placeholder until your dashboard page is built
const Placeholder = ({ title }) => (
  <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>This page is coming soon.</p>
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
        <Route path="/templates" element={<ResumeTemplates />} />
        <Route path="/editing" element={<ResumeEditing />} />
        <Route path="/editing/:templateId" element={<ResumeEditing />} />
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App