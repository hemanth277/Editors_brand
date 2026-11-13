import { motion } from 'framer-motion'
import BookingForm from '../components/BookingForm'

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
            Get In Touch
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            color: '#fff',
            maxWidth: '700px',
          }}>
            Let's make something
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>beautiful together.</em>
          </h1>
        </div>
      </div>

      <section style={{ background: '#151515', padding: 'clamp(60px, 8vh, 100px) 0' }}>
        <div className="container-snap">
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <BookingForm inline={true} />
          </div>
        </div>
      </section>
    </motion.main>
  )
}
