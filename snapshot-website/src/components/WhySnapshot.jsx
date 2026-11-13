import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Sparkles, Users, Zap, Film, Heart, Share2,
} from 'lucide-react'

const reasons = [
  {
    icon: Sparkles,
    title: 'Creative Storytelling',
    description: 'Every reel tells a unique story. We approach each event with fresh creative vision, not templated shoots.',
  },
  {
    icon: Users,
    title: 'Professional Reel Makers',
    description: 'Trained videographers who specialize in social-first content — not just photographers who shoot video.',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Standard delivery in 5–7 days. Express delivery available. No waiting weeks for your memories.',
  },
  {
    icon: Film,
    title: 'High-Quality Production',
    description: 'Shot on premium equipment with professional color grading and cinematic editing techniques.',
  },
  {
    icon: Heart,
    title: 'Personalized Experience',
    description: 'We work closely with you to understand your style, preferences, and vision before the event.',
  },
  {
    icon: Share2,
    title: 'Social Media Ready',
    description: 'Vertical 9:16 format, optimized for Instagram Reels, YouTube Shorts, and all major platforms.',
  },
]

export default function WhySnapshot() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      style={{
        background: '#F4F1EC',
        padding: 'clamp(60px, 8vh, 100px) 0',
        color: '#111',
      }}
    >
      <div className="container-snap">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(32px, 6vw, 80px)',
            alignItems: 'flex-start',
          }}
          className="why-layout"
          ref={ref}
        >
          {/* Left – sticky heading */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ position: 'sticky', top: '100px' }}
            className="why-sticky"
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
              Why Us
            </p>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#111',
                marginBottom: '24px',
              }}
            >
              Moments fade.
              <br />
              <em style={{ color: '#FF351F', fontStyle: 'italic' }}>Stories stay.</em>
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              color: '#555',
              lineHeight: 1.75,
              maxWidth: '400px',
            }}>
              We built EDITORS BRAND because we believe every celebration deserves
              a story worth telling — and retelling. Here's why over 500
              families trust us with their most precious moments.
            </p>

            {/* Numbers */}
            <div style={{
              marginTop: '40px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}>
              {[
                { n: '500+', l: 'Events Covered' },
                { n: '1200+', l: 'Reels Delivered' },
                { n: '5+', l: 'Years Experience' },
                { n: '98%', l: 'Client Satisfaction' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#111',
                    lineHeight: 1,
                  }}>{s.n}</div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#888',
                    marginTop: '4px',
                  }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {reasons.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    padding: '28px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(255,53,31,0.1)',
                    border: '1px solid rgba(255,53,31,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={18} style={{ color: '#FF351F' }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#111',
                      marginBottom: '6px',
                    }}>
                      {r.title}
                    </h3>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#666',
                      lineHeight: 1.65,
                    }}>
                      {r.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-layout { grid-template-columns: 1fr !important; }
          .why-sticky { position: static !important; }
        }
      `}</style>
    </section>
  )
}
