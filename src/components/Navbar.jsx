import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { logoutUser } from '../lib/firebase'

const navLinks = [
  { href: '#features',     label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#addictions',   label: 'Addictions' },
  { href: '#roadmap',      label: 'Roadmap' },
]

export default function Navbar() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()
  const isLanding   = location.pathname === '/'

  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [dropOpen, setDropOpen]   = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  async function handleLogout() {
    await logoutUser()
    navigate('/')
  }

  return (
    <nav className={`navbar${scrolled || !isLanding ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-leaf">🌿</span>
          <span>QuitWise</span>
        </Link>

        {isLanding && (
          <ul className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
            {navLinks.map(link => (
              <li key={link.href}>
                <a href={link.href} className="navbar__link" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="navbar__right">
          {user ? (
            <div className="navbar__user" onClick={() => setDropOpen(d => !d)}>
              <div className="navbar__avatar">
                {user.photoURL
                  ? <img src={user.photoURL} alt="" />
                  : (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()
                }
              </div>
              <span className="navbar__user-name">
                {user.displayName?.split(' ')[0] || 'Account'}
              </span>
              {dropOpen && (
                <div className="navbar__dropdown">
                  <Link to="/dashboard" className="navbar__drop-item" onClick={() => setDropOpen(false)}>
                    🏠 Dashboard
                  </Link>
                  <button className="navbar__drop-item navbar__drop-item--danger" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/signup" className="btn btn--primary btn--sm" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}

          {isLanding && (
            <button
              className={`hamburger${menuOpen ? ' hamburger--open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
