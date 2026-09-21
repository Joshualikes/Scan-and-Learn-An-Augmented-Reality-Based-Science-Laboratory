import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { homePathFor, normalizeRole } from '../lib/supabase'
import {
  IconBell,
  IconBox,
  IconClipboard,
  IconHome,
  IconLogout,
  IconReport,
  IconCube,
  IconScan,
  IconSearch,
  IconSettings,
  IconUser,
} from './Icons'

const adminLinks = [
  { to: '/', label: 'Home', icon: IconHome, end: true },
  { to: '/inventory', label: 'Equipment Inventory', icon: IconBox },
  { to: '/ar', label: 'AR Preview', icon: IconCube },
  { to: '/scan', label: 'Scan Equipment', icon: IconScan },
  { to: '/logs', label: 'Logs', icon: IconClipboard },
  { to: '/reports', label: 'Reports', icon: IconReport },
  { to: '/users', label: 'Users', icon: IconUser },
  { to: '/settings', label: 'Settings', icon: IconSettings },
]

const studentLinks = [
  { to: '/student', label: 'Student Home', icon: IconHome, end: true },
  { to: '/inventory', label: 'Equipment Inventory', icon: IconBox },
  { to: '/ar', label: 'AR Preview', icon: IconCube },
  { to: '/scan', label: 'Scan Equipment', icon: IconScan },
  { to: '/logs', label: 'Logs', icon: IconClipboard },
  { to: '/settings', label: 'Settings', icon: IconSettings },
]

export default function Layout() {
  const { currentUser, logout, authReady } = useApp()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const isAuthPage = pathname === '/login' || pathname === '/register'
  const role = normalizeRole(currentUser?.role)
  const links = role === 'Student' ? studentLinks : adminLinks
  const homePath = homePathFor(currentUser)

  if (isAuthPage) return <Outlet />
  if (!authReady) return <div className="auth-loading">Loading account…</div>
  if (!currentUser) return <Outlet />

  const search = (e) => {
    e.preventDefault()
    const q = encodeURIComponent(query.trim())
    if (pathname.startsWith('/ar')) navigate(`/ar?id=${query.trim()}`)
    else if (pathname.startsWith('/scan')) navigate(`/scan?id=${query.trim()}`)
    else navigate(`/inventory?q=${q}`)
  }

  const searchPlaceholder = pathname.startsWith('/ar')
    ? 'Search hospital equipment...'
    : pathname.startsWith('/scan')
      ? 'Search equipment, ID, or location...'
      : 'Search equipment, category...'

  return (
    <div className="dash">
      <div className="dash-frame">
        <aside className="sidebar">
          <NavLink to={homePath} className="side-brand">
            <img src="/logo.jpg" alt="" />
            <span>Scan-and-Learn</span>
          </NavLink>
          <nav className="side-nav">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end}>
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
          <p className="side-tagline">
            Scan
            <br />
            Learn
            <br />
            Explore
            <br />
            Science!
          </p>
        </aside>

        <div className="dash-body">
          <header className="topbar">
            <h1>CABCABEN ELEMENTARY SCHOOL</h1>
            <form className="top-search" onSubmit={search}>
              <IconSearch />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
              />
            </form>
            <div className="top-actions">
              <button type="button" className="icon-round" aria-label="Notifications">
                <IconBell />
              </button>
              {currentUser ? (
                <button type="button" className="user-chip" onClick={() => navigate('/settings')}>
                  <IconUser />
                  {currentUser.role}
                </button>
              ) : (
                <button type="button" className="user-chip" onClick={() => navigate('/login')}>
                  <IconUser />
                  Login
                </button>
              )}
              {currentUser && (
                <button type="button" className="icon-round" aria-label="Logout" onClick={logout}>
                  <IconLogout />
                </button>
              )}
            </div>
          </header>

          <main className={`workspace ${pathname.startsWith('/scan') ? 'workspace-scan' : ''}`}>
            <Outlet />
          </main>

          <footer className="dash-footer">© 2026 Cabcaben Elementary School | Scan-and-Learn System</footer>
        </div>
      </div>
    </div>
  )
}
