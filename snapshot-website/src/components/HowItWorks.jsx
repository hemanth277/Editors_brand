import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'BOOK',
    description: 'Choose your event date, location and preferred package. We confirm within 24 hours.',
  },
  {
    num: '02',
    title: 'SHOOT',
    description: 'Our professional Reel Maker arrives ready to capture your special moments.',
  },
  {
    num: '03',
    title: 'EDIT',
    description: 'We professionally edit your videos into engaging, shareable reels.',
  },
  {
    num: '04',
    title: 'POST',
    description: 'Receive your final videos, optimized and ready to share on social media.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: '#151515',
        padding: 'clamp(60px, 8vh, 100px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background oversized text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(5rem, 20vw, 18rem)',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.02)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none',
        letterSpacing: '-0.05em',
      }}>
        PROCESS
      </div>

      <div className="container-snap" style={{ position: 'relative' }}>
        {/* Heading */}
        <div
          ref={ref}
          style={{ marginBottom: '72px', textAlign: 'center' }}
        >
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
            How It Works
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
          </motion.p>
          <motion.h2
            className="heading-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{ color: '#fff' }}
          >
            Book. Shoot.
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>Edit. Post.</em>
          </motion.h2>
        </div>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
            position: 'relative',
          }}
          className="steps-grid"
        >
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            top: '32px',
            left: '12.5%',
            right: '12.5%',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
          }} className="steps-line" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                padding: '0 24px 0 0',
                position: 'relative',
                textAlign: 'left',
              }}
              className="step-item"
            >
              {/* Number */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: `2px solid ${i === 0 ? '#FF351F' : 'rgba(255,255,255,0.12)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                background: i === 0 ? 'rgba(255,53,31,0.1)' : 'transparent',
                position: 'relative',
                zIndex: 1,
              }}>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  color: i === 0 ? '#FF351F' : 'rgba(255,255,255,0.4)',
                }}>
                  {step.num}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#FF351F',
                marginBottom: '12px',
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                color: '#A0A0A0',
                lineHeight: 1.7,
              }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px 24px !important;
          }
          .steps-line { display: none !important; }
          .step-item { padding: 0 !important; }
        }
        @media (max-width: 480px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  )
}
