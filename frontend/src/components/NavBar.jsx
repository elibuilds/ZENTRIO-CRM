import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './context/AuthProvider'
import './NavBar.css'

function NavBar() {
  const { auth, logout } = useContext(AuthContext)

  return (
    <nav className="nav-bar">
      <div className="nav-brand">Zentrio CRM</div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Contacts</NavLink>
        <NavLink to="/leads" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Leads</NavLink>
        <NavLink to="/pipeline" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Pipeline</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Dashboard</NavLink>
      </div>
      <div className="nav-user">
        {auth?.username && <span className="nav-username">{auth.username}</span>}
        <button type="button" className="nav-logout" onClick={logout}>Log out</button>
      </div>
    </nav>
  )
}

export default NavBar
