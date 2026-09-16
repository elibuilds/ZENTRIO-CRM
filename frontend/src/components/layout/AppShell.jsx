import { NavLink } from 'react-router-dom'
import './AppShell.css'

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/deals', label: 'Deals' },
  { to: '/pipeline', label: 'Pipeline' },
  { to: '/contacts', label: 'Contacts' },
]

function AppShell({ children, onLogout }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <NavLink className="app-brand" to="/dashboard">Zentrio<span>CRM</span></NavLink>
        <nav aria-label="Primary navigation" className="app-navigation">
          {navigationItems.map((item) => (
            <NavLink className={({ isActive }) => `app-nav-link${isActive ? ' app-nav-link-active' : ''}`} key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-sidebar-footer">
          <div className="app-user"><span>AM</span><div><strong>Alex Morgan</strong><small>Sales manager</small></div></div>
          <button onClick={onLogout} type="button">Sign out</button>
        </div>
      </aside>
      <div className="app-content">{children}</div>
    </div>
  )
}

export default AppShell
