import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + Math.random() * 15
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ flexDirection: 'column', gap: '32px' }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: '#fff'
        }}>
          EDITORS <span style={{ color: '#FF351F' }}>BRAND</span>
        </span>
      </motion.div>

      {/* Progress bar */}
      <div style={{
        width: '200px',
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            background: '#FF351F',
            width: `${Math.min(progress, 100)}%`,
          }}
          transition={{ ease: 'easeOut' }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#A0A0A0'
        }}
      >
        Loading Experience
      </motion.p>
    </motion.div>
  )
}
