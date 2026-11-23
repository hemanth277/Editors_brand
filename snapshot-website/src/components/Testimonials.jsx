import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Rohan Malhotra',
    role: 'Founder & CEO',
    company: 'Aura Lifestyle',
    quote:
      'SNAPSHOT scaled our organic Instagram engagement by over 340% in just two months. The quality of their vertical reels, hook scripts, and pacing is unmatched in the Indian agency landscape.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priyanka Sen',
    role: 'Head of Brand Marketing',
    company: 'Zenith Apparel',
    quote:
      'From product shoots to animated reels and digital video teasers, SNAPSHOT acts as an extension of our in-house creative team. Fast turnarounds, top-tier audio design, and zero hassle.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Vikramaditya Roy',
    role: 'Creator & Tech Entrepreneur',
    company: 'NextGen Ventures',
    quote:
      'Their post-production editing team is world-class. I shoot raw b-roll and speaking clips, and SNAPSHOT transforms them into viral YouTube Shorts that consistently gain 100K+ views.',
    rating: 5,
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="testimonials"
      style={{
        background: '#0D0D0D',
        padding: 'clamp(60px, 8vh, 100px) 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="container-snap">
        {/* Header */}
        <div ref={ref} style={{ marginBottom: '56px', textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#FF351F',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
            Client Reviews
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
          </motion.p>
          <motion.h2
            className="heading-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{ color: '#fff' }}
          >
            Trusted by creators
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>and category-defining brands.</em>
          </motion.h2>
        </div>

        {/* Testimonials cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
          className="testimonials-grid"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{
                background: '#151515',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                padding: 'clamp(28px, 3.5vw, 36px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <Quote
                size={32}
                style={{
                  color: 'rgba(255,53,31,0.2)',
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                }}
              />

              <div>
                {/* Rating stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={15} fill="#FF351F" color="#FF351F" />
                  ))}
                </div>

                {/* Quote */}
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.925rem',
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.7,
                  marginBottom: '28px',
                }}>
                  "{t.quote}"
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '18px' }}>
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '2px',
                }}>
                  {t.name}
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.78rem',
                  color: '#A0A0A0',
                }}>
                  {t.role} · <span style={{ color: '#FF351F' }}>{t.company}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
