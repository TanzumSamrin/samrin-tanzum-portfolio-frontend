import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ui/ThemeToggle'

function Header() {
  const { isOwner, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <nav className="container-page py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-mono text-xl font-semibold text-[var(--text)] hover:text-accent transition-colors"
          >
            <span className="text-accent">~/</span>samrin
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md font-mono text-sm transition-colors ${
                  isActive(link.to)
                    ? 'text-accent bg-accent/10'
                    : 'text-[var(--text-muted)] hover:text-accent hover:bg-accent/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isOwner && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md font-mono text-sm transition-colors ${
                    location.pathname.startsWith('/dashboard')
                      ? 'text-accent bg-accent/10'
                      : 'text-[var(--text-muted)] hover:text-accent hover:bg-accent/5'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md font-mono text-sm text-[var(--text-muted)] hover:text-danger hover:bg-danger/10 transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-accent hover:bg-accent/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[var(--border)] space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md font-mono text-sm transition-colors ${
                  isActive(link.to)
                    ? 'text-accent bg-accent/10'
                    : 'text-[var(--text-muted)] hover:text-accent hover:bg-accent/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isOwner && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md font-mono text-sm text-[var(--text-muted)] hover:text-accent hover:bg-accent/5"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2.5 rounded-md font-mono text-sm text-[var(--text-muted)] hover:text-danger hover:bg-danger/10"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header