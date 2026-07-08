import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const { currentUser, isAdmin, isGuest, logout, profile } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/launches', label: 'All Launches' },
    { to: '/developers', label: 'Developers' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <Link to="/" aria-label="Reach The Launch home">
          <Logo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-mist">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-gold transition-colors">
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="hover:text-gold transition-colors text-teal">
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/contact"
            className="px-4 py-2 rounded-full text-sm font-semibold bg-gold text-ink hover:bg-gold2 transition-colors"
          >
            Contact Us
          </Link>
          {isGuest ? (
            <Link to="/login" className="px-4 py-2 rounded-full text-sm font-semibold border border-white/15 text-white hover:border-gold hover:text-gold transition-colors">
              Sign In
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-sm font-semibold border border-white/15 text-white hover:border-red-400 hover:text-red-400 transition-colors"
              title={profile?.name}
            >
              Log Out
            </button>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h20M3 13h20M3 19h20" /></svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-white/5">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-mist hover:text-gold py-1">
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="text-teal py-1">
              Admin Panel
            </Link>
          )}
          <Link to="/contact" onClick={() => setOpen(false)} className="text-gold py-1 font-semibold">
            Contact Us
          </Link>
          {isGuest ? (
            <Link to="/login" onClick={() => setOpen(false)} className="text-white py-1">
              Sign In
            </Link>
          ) : (
            <button onClick={handleLogout} className="text-left text-red-400 py-1">
              Log Out
            </button>
          )}
        </div>
      )}
    </header>
  )
}
