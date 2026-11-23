import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { eventCategories } from '../data/events'

export default function EventGallery() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section
      id="portfolio-categories"
      style={{ background: '#0A0A0A', padding: 'clamp(60px, 8vh, 100px) 0' }}
    >
      <div className="container-snap">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '56px' }}
        >
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
            Content Showcase
          </p>
          <h2 className="heading-lg" style={{ color: '#fff', maxWidth: '700px' }}>
            Formats engineered for{' '}
            <em style={{ color: '#FF351F', fontStyle: 'italic' }}>maximum impact.</em>
          </h2>
        </motion.div>

        {/* Grid – responsive agency grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
          }}
          className="event-grid"
        >
          {eventCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              variants={item}
              className={`hover-zoom event-card ${i === 0 ? 'event-card-tall' : ''}`}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.06)',
                gridRow: i === 0 ? 'span 2' : 'span 1',
                aspectRatio: i === 0 ? 'auto' : '4/5',
                minHeight: i === 0 ? '420px' : '230px',
              }}
              onClick={() => {
                document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="zoom-target"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              />
              {/* Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.2) 60%)',
                transition: 'opacity 0.3s',
              }} />
              {/* Text */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '22px',
              }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#FF351F',
                  marginBottom: '6px',
                }}>
                  {cat.count}
                </div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
                  fontWeight: 700,
                  color: '#fff',
                }}>
                  {cat.name}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .event-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .event-card-tall { grid-row: span 1 !important; }
        }
        @media (max-width: 768px) {
          .event-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .event-card,
          .event-card-tall {
            grid-row: span 1 !important;
            min-height: 190px !important;
            aspect-ratio: 3/4 !important;
          }
        }
        @media (max-width: 420px) {
          .event-grid {
            grid-template-columns: 1fr !important;
          }
          .event-card,
          .event-card-tall {
            min-height: 220px !important;
            aspect-ratio: 16/9 !important;
          }
        }
      `}</style>
    </section>
  )
}
