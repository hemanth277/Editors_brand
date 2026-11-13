import { Link } from 'react-router-dom'
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/contact' },
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/editorsbrand' },
  { icon: Youtube,   label: 'YouTube',   href: 'https://youtube.com/@editorsbrand' },
  { icon: Facebook,  label: 'Facebook',  href: 'https://facebook.com/editorsbrand' },
]

export default function Footer() {
  const handleHashLink = (e, to) => {
    if (to.includes('#')) {
      e.preventDefault()
      const hash = to.split('#')[1]
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.location.href = to
    }
  }

  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* CTA Strip */}
      <div style={{
        background: '#FF351F',
        padding: 'clamp(40px, 6vw, 80px) 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background oversized text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(4rem, 15vw, 14rem)',
          fontWeight: 900,
          color: 'rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.03em',
        }}>
          EDITORS BRAND
        </div>

        <div style={{ position: 'relative' }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '16px',
          }}>
            Start Your Story
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 5vw, 5rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.05,
            marginBottom: '36px',
          }}>
            Book a Reel Maker
          </h2>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fff',
              color: '#FF351F',
              padding: '16px 40px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderRadius: '1px',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            Get Started <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Footer body */}
      <div className="container-snap" style={{ padding: 'clamp(48px, 6vw, 80px) 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
            gap: 'clamp(32px, 5vw, 60px)',
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            {/* Oversized wordmark */}
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '0.08em',
              color: '#fff',
              lineHeight: 1,
              marginBottom: '20px',
            }}>
              EDITORS <span style={{ color: '#FF351F' }}>BRAND</span>
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#A0A0A0',
              lineHeight: 1.75,
              maxWidth: '300px',
              marginBottom: '28px',
            }}>
              Premium Reel Maker booking for weddings, engagements, birthdays and
              all the moments that deserve to be remembered.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map(s => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#A0A0A0',
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#FF351F'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.background = '#FF351F'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                      e.currentTarget.style.color = '#A0A0A0'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#fff',
              marginBottom: '20px',
            }}>
              Navigate
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {navLinks.map(l => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    onClick={(e) => handleHashLink(e, l.to)}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#A0A0A0',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#FF351F'}
                    onMouseLeave={e => e.target.style.color = '#A0A0A0'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#fff',
              marginBottom: '20px',
            }}>
              Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Wedding Reels', 'Engagement', 'Haldi & Mehendi', 'Sangeet', 'Birthday', 'Corporate'].map(s => (
                <li key={s}>
                  <Link
                    to="/services"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#A0A0A0',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#FF351F'}
                    onMouseLeave={e => e.target.style.color = '#A0A0A0'}
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#fff',
              marginBottom: '20px',
            }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: Mail, text: 'hello@editorsbrand.in', href: 'mailto:hello@editorsbrand.in' },
                { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: MapPin, text: 'Mumbai, India\n(Pan-India coverage)', href: null },
              ].map((c) => {
                const Icon = c.icon
                const inner = (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Icon size={15} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#A0A0A0',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                    }}>
                      {c.text}
                    </span>
                  </div>
                )
                return c.href ? (
                  <a key={c.text} href={c.href} style={{ textDecoration: 'none', color: 'inherit' }}
                     onMouseEnter={e => e.currentTarget.querySelector('span').style.color = '#fff'}
                     onMouseLeave={e => e.currentTarget.querySelector('span').style.color = '#A0A0A0'}>
                    {inner}
                  </a>
                ) : (
                  <div key={c.text}>{inner}</div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem',
            color: '#555',
          }}>
            © 2026 EDITORS BRAND. All Rights Reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem',
                color: '#555',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#FF351F'}
              onMouseLeave={e => e.target.style.color = '#555'}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
