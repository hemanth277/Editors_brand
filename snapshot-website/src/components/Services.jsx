import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Loader } from 'lucide-react'
import { useServices } from '../hooks/useServices'

export default function Services() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { services, loading } = useServices()

  return (
    <section
      id="services"
      style={{
        background: '#151515',
        padding: 'clamp(60px, 8vh, 100px) 0',
      }}
    >
      <div className="container-snap">
        {/* Heading */}
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'flex-end',
            marginBottom: '64px',
          }}
          className="services-header"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
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
              What We Do
            </p>
            <h2 className="heading-lg" style={{ color: '#fff' }}>
              Your event.
              <br />
              <em style={{ fontStyle: 'italic', color: '#fff' }}>Our Reel Makers.</em>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              color: '#A0A0A0',
              lineHeight: 1.75,
            }}
          >
            From the first emotion to the final celebration, our creative team
            captures every moment that deserves to be remembered.
          </motion.p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Service cards grid */}
        {!loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
            className="services-grid"
          >
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} inView={inView} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .services-header { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function ServiceCard({ service, index, inView }) {
  // Support both Supabase column (image_url) and static fallback (image)
  const imageSrc = service.image_url || service.image || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="hover-zoom"
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '360px',
        cursor: 'pointer',
        borderRadius: '2px',
      }}
    >
      <img
        src={imageSrc}
        alt={service.title}
        loading="lazy"
        className="zoom-target"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '28px',
      }}>
        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '8px',
          lineHeight: 1.2,
        }}>
          {service.title}
        </h3>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}>
          {service.description}
        </p>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#FF351F',
        }}>
          Explore <ArrowUpRight size={14} />
        </span>
      </div>
    </motion.div>
  )
}
