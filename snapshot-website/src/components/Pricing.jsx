import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { packages, addOns } from '../data/pricing'

export default function Pricing({ onBookPackage }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="pricing"
      style={{
        background: '#0A0A0A',
        padding: 'clamp(60px, 8vh, 100px) 0',
      }}
    >
      <div className="container-snap">
        {/* Heading */}
        <div ref={ref} style={{ marginBottom: '64px', textAlign: 'center' }}>
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
            Pricing
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
          </motion.p>
          <motion.h2
            className="heading-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{ color: '#fff' }}
          >
            Simple plans.
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>Unforgettable memories.</em>
          </motion.h2>
        </div>

        {/* Package cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '56px',
          }}
          className="pricing-grid"
        >
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`pricing-card ${pkg.badge === 'Most Popular' ? 'featured' : ''}`}
              style={{
                background: pkg.badge === 'Most Popular' ? '#151515' : 'rgba(255,255,255,0.02)',
                padding: 'clamp(28px, 4vw, 48px)',
                position: 'relative',
                borderRadius: '2px',
              }}
            >
              {/* Badge */}
              {pkg.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '24px',
                  background: '#FF351F',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                }}>
                  {pkg.badge}
                </div>
              )}

              {/* Package code */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#FF351F',
                marginBottom: '12px',
              }}>
                {pkg.code}
              </p>

              {/* Name */}
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '8px',
              }}>
                {pkg.name}
              </h3>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem',
                color: '#A0A0A0',
                marginBottom: '28px',
              }}>
                {pkg.duration}
              </p>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '28px' }} />

              {/* Price */}
              <div style={{ marginBottom: '32px' }}>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  color: '#A0A0A0',
                  verticalAlign: 'top',
                  lineHeight: 1.6,
                }}>₹</span>
                <span style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}>
                  {pkg.price.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pkg.features.map((f, fi) => (
                  <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Check size={14} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#A0A0A0',
                      lineHeight: 1.5,
                    }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => onBookPackage(pkg)}
                className={pkg.badge === 'Most Popular' ? 'btn-primary' : 'btn-outline'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Book This Package
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 'clamp(24px, 4vw, 40px)',
            borderRadius: '2px',
          }}
        >
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <Plus size={20} style={{ color: '#FF351F' }} />
            Add-Ons
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
          className="addons-grid">
            {addOns.map((addon) => (
              <div key={addon.id} style={{
                borderLeft: '2px solid #FF351F',
                paddingLeft: '16px',
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#fff',
                  marginBottom: '4px',
                }}>
                  {addon.name}
                </p>
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#FF351F',
                }}>
                  {addon.price ? `₹${addon.price.toLocaleString('en-IN')}` : 'Custom'}{' '}
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    color: '#A0A0A0',
                  }}>
                    {addon.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
          .addons-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .pricing-grid { max-width: 100%; }
          .addons-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
