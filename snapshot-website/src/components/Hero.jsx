import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Play } from 'lucide-react'

const heroImage =
  'https://images.unsplash.com/photo-1511795409834-432f7b1728b2?w=1920&q=85'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const handleScrollDown = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  }
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Background with parallax */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-15%',
          left: 0,
          right: 0,
          bottom: '-15%',
          y: bgY,
        }}
      >
        <img
          src={heroImage}
          alt="Premium event photography"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.2) 100%)',
      }} />

      {/* Orange accent line – top left */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: 'absolute',
          top: '72px',
          left: 0,
          width: '80px',
          height: '2px',
          background: '#FF351F',
          transformOrigin: 'left',
        }}
      />

      {/* Content */}
      <motion.div
        style={{ position: 'relative', zIndex: 2, opacity, width: '100%' }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="container-snap" style={{ paddingBottom: 'clamp(60px, 10vh, 120px)' }}>

          {/* Eyebrow */}
          <motion.p
            variants={item}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#FF351F',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ display: 'inline-block', width: '32px', height: '1px', background: '#FF351F' }} />
            Premium Reel Maker Booking
          </motion.p>

          {/* Main headline */}
          <motion.h1
            variants={item}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '28px',
              maxWidth: '900px',
            }}
          >
            Real moments.
            <br />
            <em style={{ fontStyle: 'italic', color: '#fff' }}>Edited.</em>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={item}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '540px',
              lineHeight: 1.7,
              marginBottom: '48px',
            }}
          >
            Your celebrations deserve more than memories.
            We capture, create and deliver stories worth sharing.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={item}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          >
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-primary"
            >
              Book Your Reel Maker
            </a>
            <a
              href="#our-work"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('our-work')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-outline"
            >
              <Play size={14} />
              Explore Our Work
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={handleScrollDown}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '24px',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 3,
        }}
      >
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.button>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{
          position: 'absolute',
          top: '50%',
          right: 'clamp(16px, 3vw, 48px)',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          zIndex: 3,
        }}
        className="hero-stats"
      >
        {[
          { num: '500+', label: 'Events Covered' },
          { num: '1200+', label: 'Reels Created' },
          { num: '98%', label: 'Happy Clients' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
            }}>{s.num}</div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '4px',
            }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-stats { display: none !important; }
        }
      `}</style>
    </section>
  )
}
