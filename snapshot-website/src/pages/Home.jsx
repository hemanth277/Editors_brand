import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from '../components/Hero'
import EventTicker from '../components/EventTicker'
import EventGallery from '../components/EventGallery'
import Services from '../components/Services'
import VideoGallery from '../components/VideoGallery'
import HowItWorks from '../components/HowItWorks'
import Pricing from '../components/Pricing'
import BookingForm from '../components/BookingForm'
import WhySnapshot from '../components/WhySnapshot'
import FAQ from '../components/FAQ'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)

  const handleBookPackage = (pkg) => {
    setSelectedPackage(pkg)
    setBookingOpen(true)
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Hero />
      <EventTicker />
      <EventGallery />
      <Services />
      <VideoGallery />
      <HowItWorks />
      <Pricing onBookPackage={handleBookPackage} />

      {/* Inline booking section */}
      <section id="booking" style={{ background: '#151515', padding: 'clamp(60px, 8vh, 100px) 0' }}>
        <div className="container-snap">
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
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
              justifyContent: 'center',
              gap: '12px',
            }}>
              <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
              Book Now
              <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
            </p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
            }}>
              Ready to capture
              <br />
              <em style={{ fontStyle: 'italic', color: '#FF351F' }}>your story?</em>
            </h2>
          </div>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <BookingForm
              selectedPackage={selectedPackage}
              inline={true}
            />
          </div>
        </div>
      </section>

      <WhySnapshot />
      <FAQ />

      {/* Floating booking modal (triggered from pricing) */}
      <AnimatePresence>
        {bookingOpen && (
          <BookingForm
            selectedPackage={selectedPackage}
            onClose={() => setBookingOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.main>
  )
}
