import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/our-work' },
  { label: 'Process', to: '/#process' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'Reviews', to: '/#testimonials' },
  { label: 'Contact', to: '/contact' },
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
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
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
                fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: '#fff',
              }}
            >
              SNAP<span style={{ color: '#FF351F' }}>SHOT</span>
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}
               className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink key={link.label} link={link} onHashClick={handleHashLink} />
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="#inquiry"
              onClick={(e) => handleHashLink(e, '#inquiry')}
              className="btn-primary desktop-cta"
              style={{ padding: '10px 22px', fontSize: '0.75rem' }}
            >
              Start a Project
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
                padding: '8px',
              }}
            >
              <X size={28} />
            </button>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <MobileNavLink link={link} onHashClick={handleHashLink} />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ marginTop: '16px' }}
              >
                <a
                  href="#inquiry"
                  onClick={(e) => handleHashLink(e, '#inquiry')}
                  className="btn-primary"
                  style={{ padding: '12px 32px' }}
                >
                  Start a Project
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav, .desktop-cta { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}

function NavLink({ link, onHashClick }) {
  const location = useLocation()
  const isHash = link.to.includes('#')
  const isActive = !isHash && location.pathname === link.to

  if (isHash) {
    return (
      <a
        href={link.to}
        onClick={(e) => onHashClick(e, link.to)}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.8rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#A0A0A0',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
      >
        {link.label}
      </a>
    )
  }

  return (
    <Link
      to={link.to}
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.8rem',
        fontWeight: isActive ? 600 : 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: isActive ? '#FF351F' : '#A0A0A0',
        textDecoration: 'none',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = isActive ? '#FF351F' : '#A0A0A0'}
    >
      {link.label}
    </Link>
  )
}

function MobileNavLink({ link, onHashClick }) {
  const isHash = link.to.includes('#')

  if (isHash) {
    return (
      <a
        href={link.to}
        onClick={(e) => onHashClick(e, link.to)}
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.6rem',
          color: '#fff',
          textDecoration: 'none',
        }}
      >
        {link.label}
      </a>
    )
  }

  return (
    <Link
      to={link.to}
      style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.6rem',
        color: '#fff',
        textDecoration: 'none',
      }}
    >
      {link.label}
    </Link>
  )
}
