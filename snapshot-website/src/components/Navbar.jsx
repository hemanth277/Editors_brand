import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'About', to: '/#about' },
  { label: 'FAQs', to: '/#faqs' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Scroll to hash after navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      // Small delay to wait for DOM to render
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [location])

  const handleHashLink = (e, to) => {
    if (to.includes('#')) {
      e.preventDefault()
      setMobileOpen(false)
      const hash = to.split('#')[1]
      const basePath = to.split('#')[0] || '/'

      if (location.pathname === basePath || (basePath === '/' && location.pathname === '/')) {
        // Same page: just scroll
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // Different page: navigate with hash
        navigate(basePath + '#' + hash)
      }
    }
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
          background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <motion.span
              whileHover={{ scale: 1.02 }}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1rem, 2.2vw, 1.4rem)',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#fff',
              }}
            >
              EDITORS <span style={{ color: '#FF351F' }}>BRAND</span>
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '36px', alignItems: 'center' }}
               className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink key={link.label} link={link} onHashClick={handleHashLink} />
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="#booking"
              onClick={(e) => handleHashLink(e, '#booking')}
              className="btn-primary desktop-cta"
              style={{ padding: '10px 22px', fontSize: '0.75rem' }}
            >
              Book a Reel Maker
            </a>

            {/* Hamburger – mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="hamburger-btn"
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'none',
                padding: '8px',
              }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-overlay"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Close */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <X size={28} />
            </button>

            {/* Mobile logo */}
            <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
              <span style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.2rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#fff',
              }}>
                EDITORS <span style={{ color: '#FF351F' }}>BRAND</span>
              </span>
            </div>

            {/* Mobile links */}
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
              width: '100%',
              padding: '0 24px',
            }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  <Link
                    to={link.to}
                    onClick={(e) => {
                      handleHashLink(e, link.to)
                      if (!link.to.includes('#')) setMobileOpen(false)
                    }}
                    style={{
                      display: 'block',
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 'clamp(2rem, 7vw, 2.8rem)',
                      fontWeight: 700,
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '10px 0',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#FF351F'}
                    onMouseLeave={e => e.target.style.color = '#fff'}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ marginTop: '24px' }}
              >
                <a
                  href="#booking"
                  onClick={(e) => handleHashLink(e, '#booking')}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Book a Reel Maker
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (max-width: 640px) {
          .desktop-cta { display: none !important; }
        }
      `}</style>
    </>
  )
}

function NavLink({ link, onHashClick }) {
  const location = useLocation()
  const isActive = location.pathname === link.to ||
    (link.to === '/' && location.pathname === '/')

  return (
    <Link
      to={link.to}
      onClick={(e) => onHashClick(e, link.to)}
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.8rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isActive ? '#FF351F' : '#fff',
        textDecoration: 'none',
        transition: 'color 0.25s',
        position: 'relative',
        paddingBottom: '4px',
      }}
      onMouseEnter={e => e.target.style.color = '#FF351F'}
      onMouseLeave={e => e.target.style.color = isActive ? '#FF351F' : '#fff'}
    >
      {link.label}
    </Link>
  )
}
