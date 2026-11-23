import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Compass, PenTool, Video, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: Compass,
    title: 'Understand Your Brand',
    description: 'We dive deep into your target audience, core brand messaging, platform goals, and hook strategy.',
  },
  {
    num: '02',
    icon: PenTool,
    title: 'Plan the Content',
    description: 'We write hook-driven scripts, plan production moodboards, shot-lists, and set aesthetic directions.',
  },
  {
    num: '03',
    icon: Video,
    title: 'Shoot and Create',
    description: 'Studio setups or on-location commercial shoots using high-tier camera rigs, lighting, and audio gear.',
  },
  {
    num: '04',
    icon: CheckCircle2,
    title: 'Edit and Deliver',
    description: 'High-energy editing with sound design, color grading, kinetic typography, and multi-format exports.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="process"
      style={{
        background: '#151515',
        padding: 'clamp(60px, 8vh, 100px) 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Background oversized text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(5rem, 18vw, 16rem)',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.015)',
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
            Our Process
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
          </motion.p>
          <motion.h2
            className="heading-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ color: '#fff' }}
          >
            How we bring your
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>content to life.</em>
          </motion.h2>
        </div>

        {/* 4 Steps grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            position: 'relative',
          }}
          className="steps-grid"
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  position: 'relative',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '4px',
                  padding: 'clamp(24px, 3vw, 36px) clamp(20px, 2.5vw, 28px)',
                  transition: 'border-color 0.3s, transform 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,53,31,0.4)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Step number badge */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px',
                }}>
                  <span style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#FF351F',
                    opacity: 0.9,
                    letterSpacing: '-0.02em',
                  }}>
                    {step.num}
                  </span>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(255,53,31,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={18} style={{ color: '#FF351F' }} />
                  </div>
                </div>

                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '12px',
                  lineHeight: 1.25,
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.85rem',
                  color: '#A0A0A0',
                  lineHeight: 1.65,
                }}>
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
        }
        @media (max-width: 600px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
