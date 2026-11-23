import { Link } from 'react-router-dom'
import { Instagram, Youtube, Linkedin, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

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

const servicesList = [
  'Instagram Reels & YouTube Shorts',
  'Brand Promotional Films',
  'Corporate Video Editing',
  'Commercial Product Shoots',
  'Digital Invitations & Motion Teasers',
  'Monthly Content Retainers',
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/snapshotagency' },
  { icon: Youtube,   label: 'YouTube',   href: 'https://youtube.com/@snapshotagency' },
  { icon: Linkedin,  label: 'LinkedIn',  href: 'https://linkedin.com/company/snapshotagency' },
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
          SNAPSHOT
        </div>

        <div className="container-snap" style={{ position: 'relative' }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '16px',
          }}>
            Ready To Amplify Your Brand?
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '32px',
          }}>
            Start Your Content Project
          </h2>
          <a
            href="#inquiry"
            onClick={(e) => handleHashLink(e, '#inquiry')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#0A0A0A',
              color: '#fff',
              padding: '14px 36px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '2px',
              transition: 'background 0.2s',
            }}
          >
            Inquire Now <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container-snap" style={{ padding: 'clamp(48px, 6vw, 80px) 0 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1.2fr 1.2fr',
          gap: 'clamp(32px, 4vw, 60px)',
          marginBottom: '56px',
        }}
        className="footer-grid">
          {/* Col 1: Brand */}
          <div>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.6rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#fff',
              marginBottom: '16px',
            }}>
              SNAP<span style={{ color: '#FF351F' }}>SHOT</span>
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#A0A0A0',
              lineHeight: 1.7,
              marginBottom: '24px',
              maxWidth: '300px',
            }}>
              A premium Content Creation Studio & Digital Agency. We help brands, businesses, and creators produce scroll-stopping digital content.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '2px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A0A0A0',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#FF351F'
                    e.currentTarget.style.color = '#FF351F'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = '#A0A0A0'
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FF351F',
              marginBottom: '20px',
            }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => handleHashLink(e, link.to)}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      color: '#A0A0A0',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FF351F',
              marginBottom: '20px',
            }}>
              Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {servicesList.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      color: '#A0A0A0',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FF351F',
              marginBottom: '20px',
            }}>
              Contact Us
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Mail size={16} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                <a
                  href="mailto:hello@snapshotagency.in"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#A0A0A0', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
                >
                  hello@snapshotagency.in
                </a>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Phone size={16} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                <a
                  href="tel:+919876543210"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#A0A0A0', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
                >
                  +91 98765 43210
                </a>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#A0A0A0', lineHeight: 1.5 }}>
                  Studio & On-Location Shoots Across Major Hubs in India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#666' }}>
            © {new Date().getFullYear()} SNAPSHOT Content Creation Agency. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/admin" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#444', textDecoration: 'none' }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
