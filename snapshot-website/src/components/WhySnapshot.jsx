import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Sparkles, Video, Zap, Layers, BarChart3, Film, CheckCircle2, ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Video,
    title: 'Short-Form Mastery',
    description: 'Hook-driven, high-retention 9:16 vertical videos crafted specifically for Instagram Reels, YouTube Shorts, and TikTok algorithms.',
  },
  {
    icon: Film,
    title: 'Cinematic Storytelling',
    description: 'We blend commercial cinematography with strategic brand messaging so your business doesn’t just make noise—it leaves an impression.',
  },
  {
    icon: Layers,
    title: 'End-to-End Post-Production',
    description: 'Dynamic typography, color grading, sound design, sound effects (SFX), and seamless pacing optimized for modern viewers.',
  },
  {
    icon: Zap,
    title: 'Agile & Fast Turnaround',
    description: 'Speed wins in social media. We deliver ready-to-post high-definition content within 48 to 72 hours of production.',
  },
  {
    icon: BarChart3,
    title: 'Performance & Growth Focus',
    description: 'Every reel, short, and commercial is architected with clear visual hooks and conversion CTAs to turn viewers into paying customers.',
  },
  {
    icon: Sparkles,
    title: 'Bespoke Invitations & Teasers',
    description: 'High-end motion invitation suites and luxury product teasers with tailored 3D typography and sound design.',
  },
]

export default function WhySnapshot() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      style={{
        background: '#0D0D0D',
        padding: 'clamp(60px, 8vh, 100px) 0',
        color: '#fff',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
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
          {/* Left – sticky intro */}
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
              About SNAPSHOT
            </p>

            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#fff',
              marginBottom: '24px',
            }}>
              A creative content studio built for{' '}
              <em style={{ color: '#FF351F', fontStyle: 'italic' }}>modern brands.</em>
            </h2>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              color: '#A0A0A0',
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              SNAPSHOT is a digital content creation agency and production studio. We partner with forward-thinking businesses, personal brands, founders, and creators to engineer compelling digital video content.
            </p>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              color: '#A0A0A0',
              lineHeight: 1.8,
              marginBottom: '36px',
            }}>
              From concept development and scripting to commercial shooting, elite video editing, and motion teasers—we craft high-converting visual stories that amplify your market presence.
            </p>

            <a
              href="#inquiry"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Start Your Project <ArrowRight size={16} />
            </a>
          </motion.div>

          {/* Right – feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    background: '#151515',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                    padding: 'clamp(20px, 3vw, 28px)',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    transition: 'border-color 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,53,31,0.4)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    background: 'rgba(255,53,31,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} style={{ color: '#FF351F' }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '8px',
                    }}>
                      {f.title}
                    </h3>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      color: '#A0A0A0',
                      lineHeight: 1.6,
                    }}>
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .why-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .why-sticky { position: static !important; }
        }
      `}</style>
    </section>
  )
}
