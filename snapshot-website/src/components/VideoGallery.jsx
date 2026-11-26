import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  Maximize2,
} from 'lucide-react'
import { usePortfolioVideos } from '../hooks/usePortfolioVideos'

// Curated high-impact vertical films & editorial content for the edge-to-edge reel band
const SHOWCASE_ITEMS = [
  {
    id: 'show-1',
    type: 'video',
    title: 'Kinetic Fashion Reel',
    category: 'Brand Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-fashion-model-in-the-studio-41716-large.mp4',
  },
  {
    id: 'show-2',
    type: 'video',
    title: 'Brand Promotional Motion',
    category: 'Brand Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-posing-for-camera-in-a-park-vertical-41738-large.mp4',
  },
  {
    id: 'show-3',
    type: 'video',
    title: 'Executive Vision & Story',
    category: 'Corporate Film',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-woman-in-an-office-using-a-laptop-42999-large.mp4',
  },
  {
    id: 'show-4',
    type: 'video',
    title: 'Color Grading & Studio Cut',
    category: 'Post-Production',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-photographer-taking-pictures-in-a-studio-41717-large.mp4',
  },
  {
    id: 'show-5',
    type: 'video',
    title: 'Luxury Motion Invitation',
    category: 'Digital Invitation',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-toast-with-champagne-glasses-42994-large.mp4',
  },
  {
    id: 'show-6',
    type: 'video',
    title: 'Commercial Product Motion',
    category: 'Product Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-for-a-commercial-vertical-41724-large.mp4',
  },
  {
    id: 'show-7',
    type: 'video',
    title: 'Food & Beverage Reel',
    category: 'Social Media Reel',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barista-making-latte-art-vertical-41737-large.mp4',
  },
]

export default function VideoGallery() {
  const { videos } = usePortfolioVideos()
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: false, margin: '-20px' })

  // Transform offset & RAF animation refs
  const containerRef = useRef(null)
  const offsetRef = useRef(0)
  const rafIdRef = useRef(null)
  const lastTimeRef = useRef(null)

  // Drag & gesture refs
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const hasMovedRef = useRef(false)
  const interactionTimeoutRef = useRef(null)

  // Merge user's Supabase uploaded portfolio videos with default showcase
  const items = (() => {
    if (videos && videos.length > 0) {
      return videos.map((v, i) => ({
        id: v.id || `v-${i}`,
        type: 'video',
        title: v.title || 'Cinematic Film',
        category: v.category || 'Featured Work',
        thumbnail: v.thumbnail_url || v.thumbnail || SHOWCASE_ITEMS[i % SHOWCASE_ITEMS.length].thumbnail,
        videoUrl: v.public_url || v.videoUrl || SHOWCASE_ITEMS[i % SHOWCASE_ITEMS.length].videoUrl,
      }))
    }
    return SHOWCASE_ITEMS
  })()

  // Track hover or touch interaction
  const pauseScroll = () => {
    setIsPaused(true)
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current)
  }

  const resumeScrollDelayed = (delayMs = 1200) => {
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current)
    interactionTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, delayMs)
  }

  // Smooth marquee loop via requestAnimationFrame (GPU-accelerated translate3d)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Speed in px per ms (~50px/sec)
    const speed = 0.052

    const tick = (now) => {
      if (!lastTimeRef.current) lastTimeRef.current = now
      const delta = Math.min(now - lastTimeRef.current, 60)
      lastTimeRef.current = now

      if (inView && !isPaused && !isDraggingRef.current && containerRef.current) {
        offsetRef.current += speed * delta

        const halfWidth = containerRef.current.scrollWidth / 2
        if (halfWidth > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth
        }

        containerRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current)
    }
  }, [inView, isPaused, items.length])

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true
    hasMovedRef.current = false
    dragStartXRef.current = e.clientX
    dragStartOffsetRef.current = offsetRef.current
    pauseScroll()
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return
    const diff = dragStartXRef.current - e.clientX
    if (Math.abs(diff) > 5) hasMovedRef.current = true

    offsetRef.current = dragStartOffsetRef.current + diff

    if (containerRef.current) {
      const halfWidth = containerRef.current.scrollWidth / 2
      if (halfWidth > 0) {
        if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth
        if (offsetRef.current < 0) offsetRef.current += halfWidth
      }
      containerRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
    }
  }

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      resumeScrollDelayed(2000)
    }
  }

  // Touch Gesture Handlers
  const handleTouchStart = (e) => {
    isDraggingRef.current = true
    hasMovedRef.current = false
    dragStartXRef.current = e.touches[0].clientX
    dragStartOffsetRef.current = offsetRef.current
    pauseScroll()
  }

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return
    const diff = dragStartXRef.current - e.touches[0].clientX
    if (Math.abs(diff) > 5) hasMovedRef.current = true

    offsetRef.current = dragStartOffsetRef.current + diff

    if (containerRef.current) {
      const halfWidth = containerRef.current.scrollWidth / 2
      if (halfWidth > 0) {
        if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth
        if (offsetRef.current < 0) offsetRef.current += halfWidth
      }
      containerRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
    }
  }

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      resumeScrollDelayed(2000)
    }
  }

  // Wheel / Trackpad
  const handleWheel = (e) => {
    pauseScroll()
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY * 0.8
    offsetRef.current += delta

    if (containerRef.current) {
      const halfWidth = containerRef.current.scrollWidth / 2
      if (halfWidth > 0) {
        if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth
        if (offsetRef.current < 0) offsetRef.current += halfWidth
      }
      containerRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
    }
    resumeScrollDelayed(1800)
  }

  return (
    <section
      id="our-work"
      ref={sectionRef}
      style={{
        width: '100%',
        background: '#0A0A0A',
        borderTop: '1px solid rgba(255,53,31,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 0',
      }}
    >
      {/* Top subtle brand accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #FF351F 50%, transparent 100%)',
          opacity: 0.8,
        }}
      />

      {/* Edge gradient fade masks */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 'clamp(40px, 8vw, 120px)',
          background: 'linear-gradient(to right, #0A0A0A 15%, transparent 100%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 'clamp(40px, 8vw, 120px)',
          background: 'linear-gradient(to left, #0A0A0A 15%, transparent 100%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />

      {/* Marquee viewport container */}
      <div
        onMouseEnter={pauseScroll}
        onMouseLeave={() => resumeScrollDelayed(500)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{
          width: '100%',
          overflow: 'hidden',
          cursor: isDraggingRef.current ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        {/* Continuous track with duplicate set for zero-jump loop */}
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            width: 'max-content',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {/* First sequence */}
          {items.map((item, idx) => (
            <StripVideoCard
              key={`a-${item.id || idx}`}
              item={item}
              inSectionView={inView}
              onClick={() => {
                if (!hasMovedRef.current) setActiveModalItem(item)
              }}
            />
          ))}

          {/* Second sequence for infinite marquee */}
          {items.map((item, idx) => (
            <StripVideoCard
              key={`b-${item.id || idx}`}
              item={item}
              inSectionView={inView}
              onClick={() => {
                if (!hasMovedRef.current) setActiveModalItem(item)
              }}
            />
          ))}
        </div>
      </div>

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <VideoModal
            item={activeModalItem}
            onClose={() => setActiveModalItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  EDGE-TO-EDGE HORIZONTAL STRIP VIDEO CARD
// ══════════════════════════════════════════════════════════════════════════
function StripVideoCard({ item, inSectionView, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef(null)

  // Autoplay video muted & loop when section is visible
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (inSectionView) {
      const p = videoEl.play()
      if (p !== undefined) p.catch(() => {})
    } else {
      videoEl.pause()
    }
  }, [inSectionView])

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="strip-video-card"
      style={{
        position: 'relative',
        flex: '0 0 auto',
        width: 'clamp(200px, 22vw, 280px)',
        height: 'clamp(330px, 36vw, 460px)', // Precise 9:16 vertical ratio
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#141414',
        border: isHovered
          ? '1.5px solid rgba(255,53,31,0.8)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHovered
          ? '0 18px 45px rgba(0,0,0,0.9), 0 0 30px rgba(255,53,31,0.25)'
          : '0 10px 24px rgba(0,0,0,0.5)',
        transform: isHovered ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s, border-color 0.4s',
        cursor: 'pointer',
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={item.videoUrl}
        poster={item.thumbnail}
        loop
        muted
        playsInline
        preload="metadata"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.15) 50%, rgba(10,10,10,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Live Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(0,0,0,0.65)',
          border: '1px solid rgba(255,53,31,0.4)',
          backdropFilter: 'blur(8px)',
          borderRadius: '20px',
          padding: '3px 9px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#FF351F',
            boxShadow: '0 0 8px #FF351F',
          }}
        />
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
          }}
        >
          Reel
        </span>
      </div>

      {/* Center Play Button on hover */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(255,53,31,0.92)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
          opacity: isHovered ? 1 : 0,
          transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      >
        <Play size={18} fill="#fff" style={{ marginLeft: '2px' }} />
      </div>

      {/* Bottom Title Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 14px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#FF351F',
            marginBottom: '3px',
          }}
        >
          {item.category}
        </div>
        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {item.title}
        </h3>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  FULL-SCREEN PLAYER MODAL
// ══════════════════════════════════════════════════════════════════════════
function VideoModal({ item, onClose }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (isPlaying) {
      v.pause()
      setIsPlaying(false)
    } else {
      v.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5,5,5,0.94)',
        backdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          maxHeight: '90vh',
          aspectRatio: '9/16',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#000',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 50px rgba(255,53,31,0.25)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <video
          ref={videoRef}
          src={item.videoUrl}
          autoPlay
          playsInline
          loop
          onClick={togglePlay}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            cursor: 'pointer',
          }}
        />

        {/* Top Control Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
            zIndex: 10,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#FF351F',
              }}
            >
              {item.category}
            </span>
            <div
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {item.title}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#FF351F')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Bottom Playback Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 20px 20px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={togglePlay}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} fill="#fff" />}
            </button>
            <button
              onClick={toggleMute}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          <a
            href="#inquiry"
            onClick={() => {
              onClose()
              document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              background: '#FF351F',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '7px 16px',
              borderRadius: '4px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Start Project
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}
