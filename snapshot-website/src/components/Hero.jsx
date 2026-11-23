import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'

// Premium high-end studio / content creator visual
const heroImage =
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=85'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const handleScrollDown = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }
  const item = {
    hidden: { opacity: 0, y: 35 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '650px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Background with subtle parallax */}
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
          alt="SNAPSHOT Content Creation Studio"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      {/* Cinematic dark gradients */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.65) 50%, rgba(10,10,10,0.4) 100%)',
      }} />

      {/* Subtle glowing orange grid element */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,53,31,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <motion.div
        style={{ position: 'relative', zIndex: 2, opacity, width: '100%' }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="container-snap" style={{ paddingBottom: 'clamp(60px, 9vh, 110px)' }}>

          {/* Eyebrow badge */}
          {/* Main headline */}
          <motion.h1
            variants={item}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.4rem, 6.5vw, 6rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '24px',
              maxWidth: '960px',
            }}
          >
            We Create Content That Makes Your{' '}
            <span style={{
              background: 'linear-gradient(90deg, #fff 0%, #FF351F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
            }}>
              Brand Stand Out.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '620px',
              lineHeight: 1.7,
              marginBottom: '40px',
            }}
          >
            From ideas to impactful visuals, we help brands and creators tell their stories.
            Specializing in high-retention Reels, Shorts, brand commercials, corporate content, and post-production.
          </motion.p>

          {/* Buttons: Our Work & Start a Project */}
          <motion.div
            variants={item}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <a
              href="#our-work"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('our-work')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Explore Reels <ArrowRight size={15} />
            </a>

            <a
              href="#inquiry"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-primary"
            >
              Start a Project
            </a>
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll down indicator */}
      <motion.button
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '28px',
          right: '32px',
          zIndex: 3,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.button>
    </section>
  )
}
