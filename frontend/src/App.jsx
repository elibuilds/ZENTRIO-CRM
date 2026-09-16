import { Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import LoginRegister from './components/Login-register/login_register'
import AppShell from './components/layout/AppShell'
import ContactsPage from './pages/Contacts'
import DashboardPage from './pages/dashboard/DashboardPage'
import LeadsPage from './pages/leads/LeadsPage'
import PipelinePage from './pages/pipeline/PipelinePage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <LoginRegister onSuccess={() => setIsLoggedIn(true)} />
  }

  return (
    <AppShell onLogout={() => setIsLoggedIn(false)}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/deals" element={<LeadsPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    </AppShell>
  )
}

export default App
