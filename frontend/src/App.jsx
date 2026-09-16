import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthContext from './components/context/AuthProvider'
import Login_register from './components/Login-register/login_register'
import NavBar from './components/NavBar'
import ContactsPage from './pages/Contacts'
import LeadsPage from './pages/leads/LeadsPage'
import PipelinePage from './pages/pipeline/PipelinePage'
import DashboardPage from './pages/dashboard/DashboardPage'

function App() {
  const { auth } = useContext(AuthContext)

  if (!auth) {
    return (
      <div>
        <Login_register onSuccess={() => {}} />
      </div>
    )
  }

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<ContactsPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
