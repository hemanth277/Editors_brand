import { Link, NavLink } from 'react-router-dom'
import { X, Menu, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { signOut } = useAuth()

  // Close mobile menu on navigation change
  useEffect(() => {
    setMobileOpen(false)
  }, [])

  const navLinks = [
    { label: 'Overview', to: '/admin/dashboard' },
    { label: 'Bookings', to: '/admin/bookings' },
    { label: 'Pricing', to: '/admin/pricing' },
    { label: 'Portfolio', to: '/admin/portfolio' },
    { label: 'Videos', to: '/admin/videos' },
    { label: 'Customers', to: '/admin/customers' },
    { label: 'Calendar', to: '/admin/calendar' },
  ]

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', background: '#0A0A0A' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: '260px', background: '#151515', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <Link to="/" className="logo" style={{ marginBottom: '32px', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
          EDITORS <span style={{ color: '#FF351F' }}>BRAND</span>
        </Link>
        <nav style={{ flexGrow: 1 }}>
          {navLinks.map(link => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'block',
                padding: '12px 0',
                color: '#A0A0A0',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={signOut}
          className="btn-logout"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FF351F',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: '24px', overflowY: 'auto' }}>
        {children}
      </main>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open admin menu"
        className="admin-hamburger"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          background: 'none',
          border: 'none',
          color: '#fff',
          zIndex: 1000,
          display: 'none',
        }}
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="admin-mobile-overlay"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#151515',
              zIndex: 999,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: '#fff' }}>
              <X size={24} />
            </button>
            <Link to="/" style={{ marginBottom: '32px', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
              EDITORS <span style={{ color: '#FF351F' }}>BRAND</span>
            </Link>
            <nav style={{ flexGrow: 1 }}>
              {navLinks.map(link => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'block',
                    padding: '12px 0',
                    color: '#A0A0A0',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <button onClick={signOut} style={{ color: '#FF351F', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
