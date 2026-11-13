import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { faqs } from '../data/faqs'

export default function FAQ() {
  const [openId, setOpenId] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const toggle = (id) => setOpenId(openId === id ? null : id)

  return (
    <section
      id="faqs"
      style={{
        background: '#151515',
        padding: 'clamp(60px, 8vh, 100px) 0',
      }}
    >
      <div className="container-snap">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: 'clamp(32px, 6vw, 80px)',
            alignItems: 'flex-start',
          }}
          className="faq-layout"
          ref={ref}
        >
          {/* Left heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            style={{ position: 'sticky', top: '100px' }}
            className="faq-sticky"
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
              FAQs
            </p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#fff',
              marginBottom: '24px',
            }}>
              Questions,
              <br />
              <em style={{ fontStyle: 'italic', color: '#FF351F' }}>answered.</em>
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
              color: '#A0A0A0',
              lineHeight: 1.7,
            }}>
              Can't find the answer? Reach out and we'll be happy to help.
            </p>
            <div style={{ marginTop: '28px' }}>
              <a
                href="mailto:hello@editorsbrand.in"
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '12px 24px' }}
              >
                Contact Us
              </a>
            </div>
          </motion.div>

          {/* Right accordion */}
          <div>
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="faq-item"
              >
                <button
                  className="faq-question"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={openId === faq.id}
                >
                  <span style={{ flex: 1, paddingRight: '16px', lineHeight: 1.4 }}>
                    {faq.question}
                  </span>
                  <span style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: `1px solid ${openId === faq.id ? '#FF351F' : 'rgba(255,255,255,0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: openId === faq.id ? '#FF351F' : '#A0A0A0',
                    transition: 'all 0.2s',
                  }}>
                    {openId === faq.id ? <Minus size={12} /> : <Plus size={12} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9rem',
                        color: '#A0A0A0',
                        lineHeight: 1.75,
                        paddingBottom: '24px',
                        paddingRight: '44px',
                      }}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .faq-layout { grid-template-columns: 1fr !important; }
          .faq-sticky { position: static !important; }
        }
      `}</style>
    </section>
  )
}
