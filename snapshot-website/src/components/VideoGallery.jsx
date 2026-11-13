import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Play, X, Volume2, VolumeX } from 'lucide-react'

// Sample vertical video items (replace with real assets)
const videos = [
  {
    id: 1,
    title: 'Wedding Highlights',
    category: 'Wedding',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    title: 'Couple Entry',
    category: 'Wedding',
    thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 3,
    title: 'Haldi Moments',
    category: 'Haldi',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 4,
    title: 'Dance Performance',
    category: 'Sangeet',
    thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 5,
    title: 'Candid Celebrations',
    category: 'Wedding',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-432f7b1728b2?w=400&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 6,
    title: 'Birthday Party',
    category: 'Birthday',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
]

export default function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="our-work"
      style={{ background: '#0A0A0A', padding: 'clamp(60px, 8vh, 100px) 0' }}
    >
      <div className="container-snap">
        {/* Heading */}
        <div
          ref={ref}
          style={{ marginBottom: '56px', textAlign: 'center' }}
        >
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
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
            Our Work
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
          </motion.p>
          <motion.h2
            className="heading-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ color: '#fff' }}
          >
            Shot vertical.
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>Made for the feed.</em>
          </motion.h2>
        </div>

        {/* Video grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px',
          }}
          className="video-grid"
        >
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setActiveVideo(video)}
              className="hover-zoom"
              style={{
                position: 'relative',
                aspectRatio: '9/16',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
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
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)',
              }} />
              {/* Play button */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255,53,31,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}>
                <Play size={18} fill="#fff" color="#fff" />
              </div>
              {/* Category tag */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
              }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#FF351F',
                  marginBottom: '2px',
                }}>
                  {video.category}
                </div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#fff',
                }}>
                  {video.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1200px) {
          .video-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .video-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .video-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

function VideoModal({ video, onClose }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) videoRef.current.pause()
      else videoRef.current.play()
      setPlaying(!playing)
    }
  }
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  return (
    <motion.div
      className="video-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#000',
          margin: '16px',
        }}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          autoPlay
          playsInline
          style={{ width: '100%', display: 'block', aspectRatio: '9/16', objectFit: 'cover' }}
        />

        {/* Controls */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '8px',
        }}>
          <button onClick={toggleMute} style={{
            background: 'rgba(0,0,0,0.6)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button onClick={onClose} style={{
            background: 'rgba(0,0,0,0.6)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Play/Pause overlay */}
        <button
          onClick={togglePlay}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: playing ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Play size={24} fill="#fff" />
        </button>

        {/* Title */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#FF351F',
          }}>{video.category}</p>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#fff',
          }}>{video.title}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
