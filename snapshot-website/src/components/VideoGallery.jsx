import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Play, X, Volume2, VolumeX, Loader } from 'lucide-react'
import { usePortfolioVideos } from '../hooks/usePortfolioVideos'

export default function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState(null)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { videos, loading } = usePortfolioVideos()

  const normalised = videos.map(v => ({
    ...v,
    videoUrl:  v.public_url   || v.videoUrl  || '',
    thumbnail: v.thumbnail_url || v.thumbnail || '',
  }))

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
            Featured Work
            <span style={{ width: '32px', height: '1px', background: '#FF351F', display: 'inline-block' }} />
          </motion.p>
          <motion.h2
            className="heading-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ color: '#fff' }}
          >
            Crafted for attention.
            <br />
            <em style={{ fontStyle: 'italic', color: '#FF351F' }}>Produced to perform.</em>
          </motion.h2>
        </div>

        {/* Video grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '12px',
            }}
            className="video-grid"
          >
            {normalised.map((video, i) => (
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
                  borderRadius: '6px',
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
                  background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)',
                }} />
                {/* Play button */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(255,53,31,0.92)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 20px rgba(255,53,31,0.4)',
                }}>
                  <Play size={17} fill="#fff" color="#fff" />
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
                    lineHeight: 1.2,
                  }}>
                    {video.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
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
