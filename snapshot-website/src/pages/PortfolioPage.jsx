import { motion } from 'framer-motion'
import VideoGallery from '../components/VideoGallery'
import EventGallery from '../components/EventGallery'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

export default function PortfolioPage() {
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
            Portfolio
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            color: '#fff',
            maxWidth: '700px',
          }}>
            Stories we've
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>already told.</em>
          </h1>
        </div>
      </div>
      <EventGallery />
      <VideoGallery />
    </motion.main>
  )
}
