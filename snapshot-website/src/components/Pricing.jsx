import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Plus, Loader, AlertCircle } from 'lucide-react'
import { usePricing } from '../hooks/usePricing'

export default function Pricing({ onBookPackage }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { packages, loading, error } = usePricing()

  const addOns = [
    { id: 1, name: 'Extra Motion Graphic Reel', price: 2500, unit: 'per deliverable' },
    { id: 2, name: 'Additional Studio / Location Hour', price: 3500, unit: 'per hour' },
    { id: 3, name: 'Bespoke Video Invitation Suite', price: 5000, unit: 'custom design' },
    { id: 4, name: '24-Hour Rush Turnaround', price: null, unit: 'priority rate' },
  ]

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
            Packages & Pricing
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
          </motion.p>
          <motion.h2
            className="heading-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{ color: '#fff' }}
          >
            Predictable pricing.
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>High-yield creative return.</em>
          </motion.h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error banner */}
        {error && !loading && (
          <div style={{
            background: 'rgba(255,53,31,0.08)',
            border: '1px solid rgba(255,53,31,0.2)',
            borderRadius: '4px',
            padding: '12px 16px',
            marginBottom: '32px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}>
            <AlertCircle size={16} style={{ color: '#FF351F', flexShrink: 0 }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#FF351F' }}>
              Showing standard pricing packages. Real-time updates active.
            </p>
          </div>
        )}

        {/* Package cards grid - 4 column responsive */}
        {!loading && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`pricing-card ${pkg.badge === 'Most Popular' ? 'featured' : ''}`}
                  style={{
                    background: pkg.badge === 'Most Popular' ? '#151515' : 'rgba(255,255,255,0.02)',
                    padding: 'clamp(28px, 3.5vw, 42px)',
                    position: 'relative',
                    borderRadius: '4px',
                    border: `1px solid ${pkg.badge === 'Most Popular' ? 'rgba(255,53,31,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Badge */}
                    {pkg.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '-1px',
                        right: '20px',
                        background: '#FF351F',
                        color: '#fff',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '6px 14px',
                        borderRadius: '0 0 4px 4px',
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
                      fontSize: 'clamp(1.2rem, 2vw, 1.55rem)',
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
                      marginBottom: '24px',
                    }}>
                      {pkg.duration}
                    </p>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

                    {/* Price */}
                    <div style={{ marginBottom: '28px' }}>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9rem',
                        color: '#A0A0A0',
                        verticalAlign: 'top',
                        lineHeight: 1.6,
                      }}>₹</span>
                      <span style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '-0.02em',
                      }}>
                        {Number(pkg.price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Features */}
                    <ul style={{ listStyle: 'none', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(pkg.features || []).map((f, fi) => (
                        <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <Check size={14} style={{ color: '#FF351F', flexShrink: 0, marginTop: '3px' }} />
                          <span style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.85rem',
                            color: '#A0A0A0',
                            lineHeight: 1.5,
                          }}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => onBookPackage(pkg)}
                    className={pkg.badge === 'Most Popular' ? 'btn-primary' : 'btn-outline'}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Select Package
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Add-ons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                padding: 'clamp(24px, 4vw, 40px)',
                borderRadius: '4px',
                background: '#0D0D0D',
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
                Production Add-Ons & Enhancements
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
              }}>
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
                      fontSize: '1.15rem',
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
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  )
}
