import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Loader,
  Sparkles,
} from 'lucide-react'
import { usePortfolioVideos, CONTENT_CATEGORIES } from '../hooks/usePortfolioVideos'

export default function VideoGallery() {
  const { videos, loading } = usePortfolioVideos()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeModalVideo, setActiveModalVideo] = useState(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [centerIndex, setCenterIndex] = useState(0)

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: false, margin: '-40px' })
  const sliderRef = useRef(null)
  const resumeTimerRef = useRef(null)

  // Drag tracking state
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const hasMovedRef = useRef(false)

  // Filter items
  const filteredVideos = (selectedCategory === 'All'
    ? videos
    : videos.filter((v) => v.category === selectedCategory)
  ).map((v) => ({
    ...v,
    videoUrl: v.public_url || v.videoUrl || '',
    thumbnail: v.thumbnail_url || v.thumbnail || '',
  }))

  // Auto-scroll loop
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider || !inView || isInteracting || filteredVideos.length <= 1) return

    let animationFrameId
    const step = () => {
      if (!slider) return
      // Slow, cinematic drift
      slider.scrollLeft += 0.65

      // Seamless infinite looping without jumps
      const maxScroll = slider.scrollWidth - slider.clientWidth
      if (slider.scrollLeft >= maxScroll - 4) {
        slider.scrollLeft = 0
      }
      animationFrameId = requestAnimationFrame(step)
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [inView, isInteracting, filteredVideos.length])

  // Track the most centered card for visual prominence
  const updateCenterCard = useCallback(() => {
    const slider = sliderRef.current
    if (!slider) return
    const cards = slider.querySelectorAll('.snap-video-card')
    if (!cards.length) return

    const containerRect = slider.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    let closestDist = Infinity
    let closestIdx = 0

    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const dist = Math.abs(containerCenter - cardCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = idx
      }
    })

    setCenterIndex(closestIdx)
  }, [])

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return
    slider.addEventListener('scroll', updateCenterCard, { passive: true })
    window.addEventListener('resize', updateCenterCard)
    updateCenterCard()
    return () => {
      slider.removeEventListener('scroll', updateCenterCard)
      window.removeEventListener('resize', updateCenterCard)
    }
  }, [updateCenterCard, filteredVideos.length])

  // Interaction handlers to pause auto-scroll gracefully
  const handleUserInteractionStart = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    setIsInteracting(true)
  }

  const handleUserInteractionEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 2400) // Resume slow drift 2.4s after user stops
  }

  // Mouse drag logic
  const handleMouseDown = (e) => {
    const slider = sliderRef.current
    if (!slider) return
    isDownRef.current = true
    hasMovedRef.current = false
    startXRef.current = e.pageX - slider.offsetLeft
    scrollLeftRef.current = slider.scrollLeft
    handleUserInteractionStart()
  }

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return
    e.preventDefault()
    const slider = sliderRef.current
    if (!slider) return
    const x = e.pageX - slider.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true
    }
    slider.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUp = () => {
    isDownRef.current = false
    handleUserInteractionEnd()
  }

  // Wheel interaction (horizontal conversion on shiftless trackpad/wheel)
  const handleWheel = (e) => {
    const slider = sliderRef.current
    if (!slider) return
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      handleUserInteractionStart()
      handleUserInteractionEnd()
      return
    }
    // If vertical delta is significant, scroll horizontally inside gallery
    if (Math.abs(e.deltaY) > 20) {
      handleUserInteractionStart()
      slider.scrollLeft += e.deltaY * 0.9
      handleUserInteractionEnd()
    }
  }

  // Nav arrow click
  const scrollNav = (direction) => {
    const slider = sliderRef.current
    if (!slider) return
    handleUserInteractionStart()
    const cardWidth = slider.querySelector('.snap-video-card')?.clientWidth || 300
    const scrollAmount = (cardWidth + 24) * (direction === 'left' ? -1 : 1)
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    handleUserInteractionEnd()
  }

  return (
    <section
      id="our-work"
      ref={sectionRef}
      style={{
        background: '#0A0A0A',
        padding: 'clamp(60px, 8vh, 100px) 0 clamp(40px, 6vh, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(255,53,31,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
        }}
      />

      <div className="container-snap" style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#FF351F',
              marginBottom: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ width: '28px', height: '1px', background: '#FF351F' }} />
            Cinematic Reel Showcase
            <span style={{ width: '28px', height: '1px', background: '#FF351F' }} />
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: '16px',
            }}
          >
            Crafted for attention.{' '}
            <span
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(90deg, #fff 10%, #FF351F 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Engineered to perform.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
              color: '#A0A0A0',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Swipe, drag, or tap any vertical film to preview in high-definition full screen.
          </motion.p>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {['All', ...CONTENT_CATEGORIES].map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  handleUserInteractionStart()
                  handleUserInteractionEnd()
                }}
                style={{
                  background: isSelected ? '#FF351F' : 'rgba(255,255,255,0.04)',
                  border: isSelected ? '1px solid #FF351F' : '1px solid rgba(255,255,255,0.1)',
                  color: isSelected ? '#fff' : '#A0A0A0',
                  padding: '8px 18px',
                  borderRadius: '24px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.color = '#A0A0A0'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          padding: '20px 0 30px',
        }}
      >
        {/* Navigation Arrow Left */}
        <button
          onClick={() => scrollNav('left')}
          aria-label="Previous reel"
          className="gallery-nav-btn prev"
          style={{
            position: 'absolute',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(15,15,15,0.85)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FF351F'
            e.currentTarget.style.borderColor = '#FF351F'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15,15,15,0.85)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={() => scrollNav('right')}
          aria-label="Next reel"
          className="gallery-nav-btn next"
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(15,15,15,0.85)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FF351F'
            e.currentTarget.style.borderColor = '#FF351F'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15,15,15,0.85)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Side gradient feathering */}
        <div
          className="edge-fade edge-fade-left"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 'clamp(40px, 8vw, 120px)',
            background: 'linear-gradient(to right, #0A0A0A 20%, transparent 100%)',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        />
        <div
          className="edge-fade edge-fade-right"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 'clamp(40px, 8vw, 120px)',
            background: 'linear-gradient(to left, #0A0A0A 20%, transparent 100%)',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        />

        {/* Scrollable Track */}
        <div
          ref={sliderRef}
          className="gallery-scroll-track"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleUserInteractionStart}
          onTouchEnd={handleUserInteractionEnd}
          onWheel={handleWheel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            overflowX: 'auto',
            paddingLeft: 'max(24px, calc(50vw - 140px))',
            paddingRight: 'max(24px, calc(50vw - 140px))',
            paddingTop: '20px',
            paddingBottom: '20px',
            cursor: 'grab',
            userSelect: 'none',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {loading ? (
            <div style={{ padding: '80px', margin: '0 auto', color: '#FF351F' }}>
              <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div style={{ padding: '60px', color: '#A0A0A0', fontFamily: 'Inter, sans-serif' }}>
              No videos in this category yet.
            </div>
          ) : (
            filteredVideos.map((video, idx) => {
              const isCenter = idx === centerIndex
              return (
                <VideoCard
                  key={video.id || idx}
                  video={video}
                  isCenter={isCenter}
                  inSectionView={inView}
                  onClick={() => {
                    if (!hasMovedRef.current) {
                      setActiveModalVideo(video)
                    }
                  }}
                />
              )
            })
          )}
        </div>
      </div>

      {/* Expanded Modal Player */}
      <AnimatePresence>
        {activeModalVideo && (
          <ExpandedVideoPlayer
            video={activeModalVideo}
            onClose={() => setActiveModalVideo(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .gallery-scroll-track::-webkit-scrollbar {
          display: none;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .gallery-nav-btn {
            display: none !important;
          }
          .edge-fade {
            width: 32px !important;
          }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  PORTRAIT 9:16 VIDEO CARD COMPONENT
// ══════════════════════════════════════════════════════════════════════════
function VideoCard({ video, isCenter, inSectionView, onClick }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef(null)
  const cardRef = useRef(null)

  // Autoplay video preview only when visible in section and either centered or hovered
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    // Avoid playing every video simultaneously: play only if section is inView AND (isCenter OR isHovered)
    const shouldPlay = inSectionView && (isCenter || isHovered)

    if (shouldPlay) {
      const playPromise = videoEl.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay may be restricted by browser until user gesture
            setIsPlaying(false)
          })
      }
    } else {
      videoEl.pause()
      setIsPlaying(false)
    }
  }, [inSectionView, isCenter, isHovered])

  return (
    <div
      ref={cardRef}
      className="snap-video-card"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        flex: '0 0 auto',
        width: isCenter ? '290px' : '260px',
        height: isCenter ? '515px' : '462px', // 9:16 aspect ratio
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#141414',
        border: isCenter
          ? '1.5px solid rgba(255,53,31,0.6)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isCenter
          ? '0 24px 60px rgba(0,0,0,0.9), 0 0 40px rgba(255,53,31,0.22)'
          : '0 12px 30px rgba(0,0,0,0.6)',
        transform: isCenter ? 'scale(1.02)' : 'scale(0.96)',
        opacity: isCenter ? 1 : 0.72,
        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s, border-color 0.4s, box-shadow 0.4s, width 0.4s, height 0.4s',
        cursor: 'pointer',
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnail}
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

      {/* Cinematic Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.2) 40%, rgba(10,10,10,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Center play icon badge */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isCenter ? '54px' : '46px',
          height: isCenter ? '54px' : '46px',
          borderRadius: '50%',
          background: isPlaying ? 'rgba(0,0,0,0.45)' : 'rgba(255,53,31,0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
          opacity: isPlaying && !isHovered ? 0 : 1,
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          pointerEvents: 'none',
        }}
      >
        <Play size={isCenter ? 20 : 18} fill="#fff" color="#fff" style={{ marginLeft: '2px' }} />
      </div>

      {/* Live Badge for currently active/playing card */}
      {isPlaying && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(0,0,0,0.65)',
            border: '1px solid rgba(255,53,31,0.5)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            padding: '4px 10px',
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
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#fff',
            }}
          >
            Preview
          </span>
        </div>
      )}

      {/* Expand Icon hint */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(6px)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          opacity: isHovered || isCenter ? 1 : 0,
          transition: 'opacity 0.25s',
          zIndex: 10,
        }}
      >
        <Maximize2 size={13} />
      </div>

      {/* Bottom Info Box */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 18px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#FF351F',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={11} />
          {video.category}
        </div>
        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isCenter ? '1.15rem' : '1.02rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.25,
            margin: 0,
            transition: 'font-size 0.3s',
          }}
        >
          {video.title}
        </h3>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  FULL-FEATURED EXPANDED VIDEO PLAYER MODAL
// ══════════════════════════════════════════════════════════════════════════
function ExpandedVideoPlayer({ video, onClose }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Keyboard shortcut to close (Escape)
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

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (v) {
      setCurrentTime(v.currentTime)
      setDuration(v.duration || 0)
    }
  }

  const handleSeek = (e) => {
    const v = videoRef.current
    if (v && duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newPct = clickX / rect.width
      v.currentTime = newPct * duration
      setCurrentTime(newPct * duration)
    }
  }

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

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
        background: 'rgba(5,5,5,0.92)',
        backdropFilter: 'blur(20px)',
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
        {/* The video element */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          autoPlay
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
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
              {video.category}
            </span>
            <div
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {video.title}
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

        {/* Center Play/Pause indicator on click */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(255,53,31,0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(255,53,31,0.5)',
              zIndex: 10,
            }}
          >
            <Play size={28} fill="#fff" style={{ marginLeft: '4px' }} />
          </div>
        )}

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
          }}
        >
          {/* Progress bar */}
          <div
            onClick={handleSeek}
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
              cursor: 'pointer',
              marginBottom: '14px',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: '#FF351F',
                borderRadius: '2px',
                position: 'relative',
                boxShadow: '0 0 10px #FF351F',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: '-5px',
                  top: '-4px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 0 8px rgba(0,0,0,0.6)',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={togglePlay}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="#fff" />}
              </button>

              <button
                onClick={toggleMute}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  color: '#A0A0A0',
                }}
              >
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
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
                padding: '6px 14px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Book Project
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
