import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Loader,
  Sparkles,
} from 'lucide-react'
import { usePortfolioVideos, CONTENT_CATEGORIES } from '../hooks/usePortfolioVideos'

// Curated luxury editorial showcase combining cinematic photos and vertical reels
const EDITORIAL_ITEMS = [
  {
    id: 'edit-1',
    type: 'video',
    title: 'Kinetic High-Fashion Story',
    category: 'Brand Commercial',
    aspect: 'tall', // 280px x 490px
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-fashion-model-in-the-studio-41716-large.mp4',
  },
  {
    id: 'edit-2',
    type: 'image',
    title: 'Editorial Ceremony & Light',
    category: 'Cinematic Visuals',
    aspect: 'medium', // 250px x 420px
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85',
  },
  {
    id: 'edit-3',
    type: 'video',
    title: 'Brand Promotional Motion',
    category: 'Brand Commercial',
    aspect: 'tall', // 290px x 510px
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-posing-for-camera-in-a-park-vertical-41738-large.mp4',
  },
  {
    id: 'edit-4',
    type: 'image',
    title: 'Timeless Silhouette & Mood',
    category: 'Editorial Photography',
    aspect: 'compact', // 240px x 380px
    thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=85',
  },
  {
    id: 'edit-5',
    type: 'video',
    title: 'Corporate Story & Vision',
    category: 'Corporate Film',
    aspect: 'tall', // 280px x 480px
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-woman-in-an-office-using-a-laptop-42999-large.mp4',
  },
  {
    id: 'edit-6',
    type: 'image',
    title: 'Vibrant Traditional Elegance',
    category: 'Luxury Celebrations',
    aspect: 'medium', // 260px x 430px
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85',
  },
  {
    id: 'edit-7',
    type: 'video',
    title: 'Color Grading & Studio Cut',
    category: 'Post-Production',
    aspect: 'tall', // 290px x 500px
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-photographer-taking-pictures-in-a-studio-41717-large.mp4',
  },
  {
    id: 'edit-8',
    type: 'image',
    title: 'Grand Architecture & Glamour',
    category: 'Editorial Shoot',
    aspect: 'compact', // 240px x 390px
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-432f7b1728b2?w=800&q=85',
  },
  {
    id: 'edit-9',
    type: 'video',
    title: 'Motion Invitation Suite',
    category: 'Digital Invitation',
    aspect: 'tall', // 280px x 480px
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-toast-with-champagne-glasses-42994-large.mp4',
  },
  {
    id: 'edit-10',
    type: 'image',
    title: 'Candid Euphoria & Energy',
    category: 'Luxury Storytelling',
    aspect: 'medium', // 250px x 420px
    thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=85',
  },
  {
    id: 'edit-11',
    type: 'video',
    title: 'Commercial Product Motion',
    category: 'Brand Commercial',
    aspect: 'tall', // 290px x 510px
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-for-a-commercial-vertical-41724-large.mp4',
  },
]

export default function VideoGallery() {
  const { videos, loading } = usePortfolioVideos()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: false, margin: '-40px' })

  // Container refs for requestAnimationFrame scrolling
  const containerRef = useRef(null)
  const offsetRef = useRef(0)
  const rafIdRef = useRef(null)
  const lastTimeRef = useRef(null)

  // Drag interaction refs
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const hasMovedRef = useRef(false)
  const userInteractionTimeoutRef = useRef(null)

  // Merge database portfolio videos with editorial photography for rich layout
  const allItems = (() => {
    if (!videos || videos.length === 0) return EDITORIAL_ITEMS
    // Combine dynamic db videos with curated editorial visuals
    const dbFormatted = videos.map((v, i) => ({
      id: v.id || `db-${i}`,
      type: v.media_type || 'video',
      title: v.title || 'Cinematic Film',
      category: v.category || 'Content Creation',
      aspect: i % 3 === 0 ? 'tall' : i % 3 === 1 ? 'medium' : 'compact',
      thumbnail: v.thumbnail_url || v.thumbnail || EDITORIAL_ITEMS[i % EDITORIAL_ITEMS.length].thumbnail,
      videoUrl: v.public_url || v.videoUrl || '',
    }))

    // Interleave db items with photo elements to build high-end editorial feel
    const combined = []
    const maxLen = Math.max(dbFormatted.length, EDITORIAL_ITEMS.length)
    for (let i = 0; i < maxLen; i++) {
      if (dbFormatted[i]) combined.push(dbFormatted[i])
      if (EDITORIAL_ITEMS[i] && EDITORIAL_ITEMS[i].type === 'image') {
        combined.push(EDITORIAL_ITEMS[i])
      }
    }
    return combined
  })()

  // Filter items by category if selected
  const filteredItems = selectedCategory === 'All'
    ? allItems
    : allItems.filter(item => {
        const cat = item.category?.toLowerCase() || ''
        const sel = selectedCategory.toLowerCase()
        return cat.includes(sel) || sel.includes(cat)
      })

  // We duplicate the list so when offset reaches the width of one full set, it resets seamlessly
  const displayItems = filteredItems.length > 0 ? filteredItems : EDITORIAL_ITEMS

  // Track hover or touch interaction
  const pauseScroll = () => {
    setIsPaused(true)
    if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current)
  }

  const resumeScrollDelayed = (delayMs = 1200) => {
    if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current)
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, delayMs)
  }

  // Smooth marquee loop via requestAnimationFrame
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Speed in pixels per millisecond (~45px per second for a smooth, cinematic glide)
    const speed = 0.048

    const tick = (now) => {
      if (!lastTimeRef.current) lastTimeRef.current = now
      const delta = Math.min(now - lastTimeRef.current, 60) // cap max delta to avoid frame spikes
      lastTimeRef.current = now

      if (inView && !isPaused && !isDraggingRef.current && containerRef.current) {
        offsetRef.current += speed * delta

        const halfWidth = containerRef.current.scrollWidth / 2
        if (halfWidth > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth
        }

        // Apply GPU-accelerated 3D transform directly to bypass React render overhead
        containerRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current)
    }
  }, [inView, isPaused, displayItems.length])

  // Mouse Drag Interaction
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
    if (Math.abs(diff) > 5) {
      hasMovedRef.current = true
    }

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

  // Touch Gesture Interaction
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
    if (Math.abs(diff) > 5) {
      hasMovedRef.current = true
    }

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
      resumeScrollDelayed(2200)
    }
  }

  // Trackpad / Wheel handling
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
        background: '#0A0A0A',
        padding: 'clamp(64px, 9vh, 110px) 0 clamp(48px, 7vh, 90px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient editorial illumination */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '850px',
          height: '420px',
          background: 'radial-gradient(ellipse, rgba(255,53,31,0.065) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(90px)',
        }}
      />

      {/* Section Header */}
      <div className="container-snap" style={{ position: 'relative', zIndex: 10 }}>
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
            Cinematic Visual Gallery
            <span style={{ width: '28px', height: '1px', background: '#FF351F' }} />
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '16px',
            }}
          >
            Moments captured in{' '}
            <span
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(90deg, #fff 20%, #FF351F 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              timeless motion.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.92rem',
              color: '#A0A0A0',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A seamless infinite showcase of vertical films, commercial reels, and editorial portraiture. Hover or drag to explore at your own pace.
          </motion.p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '42px',
          }}
        >
          {['All', ...CONTENT_CATEGORIES].map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: isSelected ? '#FF351F' : 'rgba(255,255,255,0.04)',
                  border: isSelected ? '1px solid #FF351F' : '1px solid rgba(255,255,255,0.1)',
                  color: isSelected ? '#fff' : '#A0A0A0',
                  padding: '7px 18px',
                  borderRadius: '24px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.74rem',
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

      {/* Ultra-Smooth Continuous Marquee Track */}
      <div
        className="marquee-viewport"
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
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          overflow: 'hidden',
          cursor: isDraggingRef.current ? 'grabbing' : 'grab',
          userSelect: 'none',
          paddingTop: '20px',
          paddingBottom: '30px',
        }}
      >
        {/* Soft edge feathering vignettes */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 'clamp(50px, 10vw, 160px)',
            background: 'linear-gradient(to right, #0A0A0A 20%, transparent 100%)',
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
            width: 'clamp(50px, 10vw, 160px)',
            background: 'linear-gradient(to left, #0A0A0A 20%, transparent 100%)',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        />

        {/* Continuous moving track with 2 duplicated sets for seamless loop */}
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            width: 'max-content',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {/* First set */}
          {displayItems.map((item, idx) => (
            <EditorialCard
              key={`a-${item.id || idx}`}
              item={item}
              inSectionView={inView}
              onClick={() => {
                if (!hasMovedRef.current) {
                  setActiveModalItem(item)
                }
              }}
            />
          ))}

          {/* Duplicated second set for continuous seamless looping */}
          {displayItems.map((item, idx) => (
            <EditorialCard
              key={`b-${item.id || idx}`}
              item={item}
              inSectionView={inView}
              onClick={() => {
                if (!hasMovedRef.current) {
                  setActiveModalItem(item)
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal Lightbox Player */}
      <AnimatePresence>
        {activeModalItem && (
          <EditorialModal
            item={activeModalItem}
            onClose={() => setActiveModalItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  DYNAMIC EDITORIAL CARD (Supports Portrait Videos & Editorial Stills)
// ══════════════════════════════════════════════════════════════════════════
function EditorialCard({ item, inSectionView, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef(null)
  const isVideo = item.type === 'video' && item.videoUrl

  // Autoplay video preview when gallery is visible
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl || !isVideo) return

    if (inSectionView) {
      const p = videoEl.play()
      if (p !== undefined) {
        p.catch(() => {})
      }
    } else {
      videoEl.pause()
    }
  }, [inSectionView, isVideo])

  // Dynamic editorial sizes
  const dimensions = (() => {
    switch (item.aspect) {
      case 'compact':
        return { width: '240px', height: '390px' }
      case 'medium':
        return { width: '265px', height: '440px' }
      case 'tall':
      default:
        return { width: '290px', height: '495px' }
    }
  })()

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        flex: '0 0 auto',
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#131313',
        border: isHovered
          ? '1.5px solid rgba(255,53,31,0.6)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHovered
          ? '0 24px 60px rgba(0,0,0,0.9), 0 0 35px rgba(255,53,31,0.2)'
          : '0 12px 32px rgba(0,0,0,0.6)',
        transform: isHovered ? 'scale(1.03) translateY(-6px)' : 'scale(1)',
        transition: 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s, border-color 0.45s',
        cursor: 'pointer',
      }}
    >
      {/* Media: Video or High-res Photograph */}
      {isVideo ? (
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
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      ) : (
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      )}

      {/* Cinematic Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.15) 45%, rgba(8,8,8,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Video Indicator Badge */}
      {isVideo && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,53,31,0.4)',
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
            Reel
          </span>
        </div>
      )}

      {/* Center Play / View icon on hover */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: isVideo ? 'rgba(255,53,31,0.92)' : 'rgba(255,255,255,0.9)',
          color: isVideo ? '#fff' : '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          opacity: isHovered ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      >
        {isVideo ? (
          <Play size={20} fill="#fff" style={{ marginLeft: '3px' }} />
        ) : (
          <Maximize2 size={18} />
        )}
      </div>

      {/* Bottom Editorial Caption */}
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
          {item.category}
        </div>
        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.05rem',
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
//  FULL-SCREEN CINEMATIC LIGHTBOX / PLAYER MODAL
// ══════════════════════════════════════════════════════════════════════════
function EditorialModal({ item, onClose }) {
  const isVideo = item.type === 'video' && item.videoUrl
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  // Escape key listener
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
          maxWidth: isVideo ? '420px' : '650px',
          maxHeight: '90vh',
          aspectRatio: isVideo ? '9/16' : 'auto',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#000',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 50px rgba(255,53,31,0.25)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isVideo ? (
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
        ) : (
          <img
            src={item.thumbnail}
            alt={item.title}
            style={{
              width: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              display: 'block',
              background: '#050505',
            }}
          />
        )}

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

        {/* Video specific controls */}
        {isVideo && (
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
        )}
      </motion.div>
    </motion.div>
  )
}
