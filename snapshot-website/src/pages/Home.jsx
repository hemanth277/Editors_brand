import { useState } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import EventTicker from '../components/EventTicker'
import WhySnapshot from '../components/WhySnapshot'
import Services from '../components/Services'
import VideoGallery from '../components/VideoGallery'
import HowItWorks from '../components/HowItWorks'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import BookingForm from '../components/BookingForm'
import FAQ from '../components/FAQ'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState(null)

  const handleBookPackage = (pkg) => {
    setSelectedPackage(pkg)
    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })
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
      <WhySnapshot />
      <Services />
      <VideoGallery />
      <HowItWorks />
      <Pricing onBookPackage={handleBookPackage} />
      <Testimonials />

      {/* Project Inquiry Section */}
      <section id="inquiry" style={{ background: '#151515', padding: 'clamp(60px, 8vh, 100px) 0' }}>
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
              Start a Project
              <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
            </p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3.8rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
            }}>
              Ready to make your brand
              <br />
              <em style={{ fontStyle: 'italic', color: '#FF351F' }}>stand out?</em>
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              color: '#A0A0A0',
              marginTop: '16px',
              maxWidth: '560px',
              margin: '16px auto 0',
            }}>
              Tell us about your brand, content requirements, or campaign brief. We will get back to you with custom concepts and timelines within 24 hours.
            </p>
          </div>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <BookingForm
              selectedPackage={selectedPackage}
              inline={true}
            />
          </div>
        </div>
      </section>

      <FAQ />
    </motion.main>
  )
}
