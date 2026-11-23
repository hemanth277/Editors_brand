import { motion } from 'framer-motion'
import BookingForm from '../components/BookingForm'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

export default function ContactPage() {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={{
        background: '#0A0A0A',
        paddingTop: '140px',
        paddingBottom: '64px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container-snap">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#FF351F',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
            Start a Project
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            color: '#fff',
            maxWidth: '800px',
          }}>
            Let's create content that{' '}
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>leads your market.</em>
          </h1>
        </div>
      </div>

      <section style={{ background: '#151515', padding: 'clamp(60px, 8vh, 100px) 0' }}>
        <div className="container-snap">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'flex-start',
          }}
          className="contact-grid">
            {/* Inquiry Form */}
            <div>
              <BookingForm inline={true} />
            </div>

            {/* Quick Contact Info */}
            <div style={{
              background: '#0D0D0D',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              padding: 'clamp(28px, 4vw, 40px)',
            }}>
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '16px',
              }}>
                SNAPSHOT Studio
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                color: '#A0A0A0',
                lineHeight: 1.7,
                marginBottom: '32px',
              }}>
                Have questions about ongoing monthly content retainers, custom commercial shoots, or raw video editing? Reach out directly to our team.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Mail size={18} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666', letterSpacing: '0.1em' }}>Email</p>
                    <a href="mailto:hello@snapshotagency.in" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }}>
                      hello@snapshotagency.in
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Phone size={18} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666', letterSpacing: '0.1em' }}>Phone / WhatsApp</p>
                    <a href="tel:+919876543210" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }}>
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Clock size={18} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666', letterSpacing: '0.1em' }}>Turnaround</p>
                    <p style={{ color: '#fff', fontSize: '0.9rem', margin: 0 }}>
                      Responses within 24 hours. Edits delivered in 48–72h.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <MapPin size={18} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666', letterSpacing: '0.1em' }}>Locations</p>
                    <p style={{ color: '#fff', fontSize: '0.9rem', margin: 0 }}>
                      Studio & Field Shoots across Mumbai, Bengaluru, Delhi NCR, Hyderabad & Pan-India.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.main>
  )
}
