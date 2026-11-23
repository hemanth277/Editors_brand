import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Package, Image, Video,
  LogOut, Search, ChevronDown, X, Check, Loader,
  Upload, Trash2, Users, RefreshCw, AlertCircle, Briefcase, Plus, FileText,
  Edit2, Eye, EyeOff, ArrowUpDown, Film
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CONTENT_CATEGORIES, STATIC_VIDEOS } from '../../hooks/usePortfolioVideos'

// ─── Sidebar tabs ─────────────────────────────────────────────
const TABS = [
  { id: 'inquiries', label: 'Project Inquiries', icon: Briefcase },
  { id: 'customers', label: 'Clients & Brands',  icon: Users },
  { id: 'pricing',   label: 'Pricing Packages',  icon: Package },
  { id: 'videos',    label: 'Reel Video Gallery', icon: Video },
  { id: 'portfolio', label: 'Storage Media',     icon: Image },
]

const STATUS_COLORS = {
  new:         { bg: 'rgba(255,200,0,0.1)',   text: '#ffc800', border: 'rgba(255,200,0,0.3)'   },
  contacted:   { bg: 'rgba(0,180,255,0.1)',   text: '#00b4ff', border: 'rgba(0,180,255,0.3)'   },
  'in progress': { bg: 'rgba(180,100,255,0.1)', text: '#b464ff', border: 'rgba(180,100,255,0.3)' },
  completed:   { bg: 'rgba(0,200,100,0.1)',   text: '#00c864', border: 'rgba(0,200,100,0.3)'   },
  cancelled:   { bg: 'rgba(255,53,31,0.1)',   text: '#FF351F', border: 'rgba(255,53,31,0.3)'   },
}

// ─── Shared styles ────────────────────────────────────────────
const S = {
  card: {
    background: '#151515',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '4px',
    padding: '24px',
  },
  input: {
    width: '100%',
    background: '#0A0A0A',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '2px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
    outline: 'none',
  },
  select: {
    width: '100%',
    background: '#0A0A0A',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '2px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
    outline: 'none',
  },
  badge: (bg, text, border) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    background: bg,
    color: text,
    border: `1px solid ${border}`,
    textTransform: 'capitalize',
  }),
  btn: {
    background: '#FF351F',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '2px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.82rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '2px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.82rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}

export default function AdminDashboard() {
  const [activeTab,   setActiveTab]   = useState('inquiries')
  const [sidebarOpen, setSidebar]     = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A', color: '#fff' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: '260px',
        flexShrink: 0,
        background: '#111',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 16px',
      }}>
        <div>
          {/* Logo */}
          <div style={{ padding: '0 8px 32px' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.1em' }}>
              SNAP<span style={{ color: '#FF351F' }}>SHOT</span>
            </span>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: '#FF351F', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '3px' }}>
              Admin Panel
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: active ? '#FF351F' : 'transparent',
                    color: active ? '#fff' : '#A0A0A0',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: active ? 600 : 400,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0A0A0' } }}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* User + Sign out */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', paddingLeft: '8px', paddingRight: '8px' }}>
          <div style={{ fontSize: '0.78rem', color: '#A0A0A0', fontFamily: 'Inter, sans-serif', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email || 'admin@snapshot.in'}
          </div>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#FF351F',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8rem',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          height: '64px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          background: '#0e0e0e',
        }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: '#fff', flex: 1 }}>
            {TABS.find(t => t.id === activeTab)?.label}
          </h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {activeTab === 'inquiries' && <InquiriesTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'pricing'   && <PricingTab />}
          {activeTab === 'videos'    && <VideoGalleryManagerTab />}
          {activeTab === 'portfolio' && <MediaTab bucket="portfolio-images" mediaType="image" />}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  VIDEO GALLERY MANAGER TAB (Supabase portfolio table + Storage)
// ══════════════════════════════════════════════════════════════
function VideoGalleryManagerTab() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [saving, setSaving] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: CONTENT_CATEGORIES[0],
    public_url: '',
    thumbnail_url: '',
    sort_order: 1,
    is_active: true,
  })

  // File upload states
  const [videoFile, setVideoFile] = useState(null)
  const [posterFile, setPosterFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState('')

  const videoFileInputRef = useRef(null)
  const posterFileInputRef = useRef(null)

  const fetchVideos = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase
        .from('portfolio')
        .select('*')
        .eq('media_type', 'video')
        .order('sort_order', { ascending: true })

      if (err) throw err
      if (data && data.length > 0) {
        setVideos(data)
      } else {
        // Fallback to static videos list
        setVideos(STATIC_VIDEOS)
      }
    } catch (err) {
      console.warn('Could not fetch portfolio videos:', err.message)
      setVideos(STATIC_VIDEOS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const openAddModal = () => {
    setEditingVideo(null)
    setFormData({
      title: '',
      category: CONTENT_CATEGORIES[0],
      public_url: '',
      thumbnail_url: '',
      sort_order: (videos.length + 1) * 1,
      is_active: true,
    })
    setVideoFile(null)
    setPosterFile(null)
    setUploadProgress('')
    setIsModalOpen(true)
  }

  const openEditModal = (v) => {
    setEditingVideo(v)
    setFormData({
      title: v.title || '',
      category: v.category || CONTENT_CATEGORIES[0],
      public_url: v.public_url || v.videoUrl || '',
      thumbnail_url: v.thumbnail_url || v.thumbnail || '',
      sort_order: v.sort_order ?? 1,
      is_active: v.is_active !== false,
    })
    setVideoFile(null)
    setPosterFile(null)
    setUploadProgress('')
    setIsModalOpen(true)
  }

  // Upload helper for Supabase Storage
  const uploadToStorage = async (file, bucket) => {
    const ext = file.name.split('.').pop()
    const filePath = `reels_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: false })
    if (upErr) throw upErr
    const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return { path: filePath, url: pubData.publicUrl }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    setUploadProgress('Processing files...')

    try {
      let finalVideoUrl = formData.public_url
      let finalPosterUrl = formData.thumbnail_url
      let storagePath = editingVideo?.storage_path || 'external'

      // Upload video file if selected
      if (videoFile) {
        setUploadProgress('Uploading 9:16 Video file to Supabase Storage (event-videos)...')
        const vidResult = await uploadToStorage(videoFile, 'event-videos')
        finalVideoUrl = vidResult.url
        storagePath = vidResult.path
      }

      // Upload poster image if selected
      if (posterFile) {
        setUploadProgress('Uploading Poster Image to Supabase Storage (portfolio-images)...')
        const posterResult = await uploadToStorage(posterFile, 'portfolio-images')
        finalPosterUrl = posterResult.url
      }

      if (!finalVideoUrl) {
        throw new Error('Please provide a Video URL or upload an MP4/WebM video file.')
      }

      const payload = {
        title: formData.title || 'Untitled Reel',
        category: formData.category,
        media_type: 'video',
        storage_path: storagePath,
        public_url: finalVideoUrl,
        thumbnail_url: finalPosterUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
        sort_order: Number(formData.sort_order) || 1,
        is_active: formData.is_active,
      }

      if (editingVideo?.id && !String(editingVideo.id).startsWith('sample-')) {
        // Update database record
        const { error: updateErr } = await supabase
          .from('portfolio')
          .update(payload)
          .eq('id', editingVideo.id)
        if (updateErr) throw updateErr
        setSuccess('Video updated successfully in database!')
      } else {
        // Insert new record into database
        const { error: insertErr } = await supabase
          .from('portfolio')
          .insert([payload])
        if (insertErr) throw insertErr
        setSuccess('New video added to gallery successfully!')
      }

      setIsModalOpen(false)
      fetchVideos()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error saving video')
    } finally {
      setSaving(false)
      setUploadProgress('')
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" from the gallery?`)) return
    try {
      if (String(id).startsWith('sample-')) {
        setVideos(prev => prev.filter(v => v.id !== id))
        return
      }
      const { error: delErr } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id)
      if (delErr) throw delErr
      fetchVideos()
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const toggleActive = async (v) => {
    const newActive = !(v.is_active !== false)
    if (String(v.id).startsWith('sample-')) {
      setVideos(prev => prev.map(item => item.id === v.id ? { ...item, is_active: newActive } : item))
      return
    }
    try {
      const { error: updErr } = await supabase
        .from('portfolio')
        .update({ is_active: newActive })
        .eq('id', v.id)
      if (updErr) throw updErr
      setVideos(prev => prev.map(item => item.id === v.id ? { ...item, is_active: newActive } : item))
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  return (
    <div>
      {/* Top Banner and Actions */}
      <div style={{ ...S.card, marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            Cinematic Horizontal Video Gallery
          </div>
          <p style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>
            Manage the 9:16 portrait video cards, upload videos & posters, adjust sort order, and toggle visibility.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={fetchVideos} style={S.btnSecondary}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button onClick={openAddModal} style={S.btn}>
            <Plus size={16} /> Add Video Reel
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,53,31,0.1)', border: '1px solid rgba(255,53,31,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <AlertCircle size={16} style={{ color: '#FF351F' }} />
          <p style={{ fontSize: '0.85rem', color: '#FF351F' }}>{error}</p>
        </div>
      )}

      {success && (
        <div style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Check size={16} style={{ color: '#00c864' }} />
          <p style={{ fontSize: '0.85rem', color: '#00c864' }}>{success}</p>
        </div>
      )}

      {/* Videos List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: '#A0A0A0' }}>
          No gallery videos found. Click "Add Video Reel" to create one.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {videos.map((v) => {
            const isActive = v.is_active !== false
            const videoSrc = v.public_url || v.videoUrl || ''
            const posterSrc = v.thumbnail_url || v.thumbnail || ''

            return (
              <div
                key={v.id}
                style={{
                  background: '#151515',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {/* 9:16 Video preview */}
                <div style={{ position: 'relative', width: '100%', height: '240px', background: '#000', overflow: 'hidden' }}>
                  <video
                    src={videoSrc}
                    poster={posterSrc}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.target.play().catch(() => {})}
                    onMouseLeave={(e) => e.target.pause()}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    <span style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: '#FF351F', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {v.category}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem' }}>
                      Order: {v.sort_order ?? 1}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                      {v.title}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#888', wordBreak: 'break-all', marginBottom: '14px' }}>
                      {videoSrc ? 'Video source ready' : 'No video source provided'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    <button
                      onClick={() => toggleActive(v)}
                      title={isActive ? 'Disable video' : 'Enable video'}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isActive ? '#00c864' : '#666',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                      }}
                    >
                      {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      {isActive ? 'Active' : 'Hidden'}
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(v)}
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: 'none',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.id, v.title)}
                        style={{
                          background: 'rgba(255,53,31,0.15)',
                          border: '1px solid rgba(255,53,31,0.3)',
                          color: '#FF351F',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            background: '#151515',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '540px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                {editingVideo ? 'Edit Reel Video' : 'Add New Reel Video'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0A0', marginBottom: '6px' }}>
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kinetic Brand Commercial"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={S.input}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0A0', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={S.select}
                >
                  {CONTENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload or URL for video */}
              <div style={{ background: '#0e0e0e', padding: '14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                  Video File / Source (Portrait 9:16)
                </label>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current.click()}
                    style={S.btnSecondary}
                  >
                    <Upload size={14} /> {videoFile ? 'Change File' : 'Upload Video File'}
                  </button>
                  {videoFile && (
                    <span style={{ fontSize: '0.75rem', color: '#FF351F', display: 'flex', alignItems: 'center' }}>
                      {videoFile.name}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#777', marginBottom: '6px' }}>Or enter direct public URL:</div>
                <input
                  type="url"
                  placeholder="https://...mp4"
                  value={formData.public_url}
                  onChange={(e) => setFormData({ ...formData, public_url: e.target.value })}
                  style={S.input}
                />
              </div>

              {/* Poster image */}
              <div style={{ background: '#0e0e0e', padding: '14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                  Poster / Thumbnail Image
                </label>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    ref={posterFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPosterFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => posterFileInputRef.current.click()}
                    style={S.btnSecondary}
                  >
                    <Upload size={14} /> {posterFile ? 'Change Image' : 'Upload Poster Image'}
                  </button>
                  {posterFile && (
                    <span style={{ fontSize: '0.75rem', color: '#00c864', display: 'flex', alignItems: 'center' }}>
                      {posterFile.name}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#777', marginBottom: '6px' }}>Or enter image URL:</div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  style={S.input}
                />
              </div>

              {/* Order & Active */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0A0', marginBottom: '6px' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                    style={S.input}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0A0', marginBottom: '6px' }}>
                    Visibility
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ accentColor: '#FF351F', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>Enable on website</span>
                  </label>
                </div>
              </div>

              {uploadProgress && (
                <div style={{ fontSize: '0.8rem', color: '#FF351F', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  {uploadProgress}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={S.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ ...S.btn, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Saving...' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  PROJECT INQUIRIES TAB (Compatible with 'bookings' table)
// ══════════════════════════════════════════════════════════════
function InquiriesTab() {
  const [inquiries,  setInquiries]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatus]   = useState('all')
  const [selected,   setSelected]   = useState(null)
  const [updating,   setUpdating]   = useState(false)
  const [adminNotes, setNotes]      = useState('')

  const load = async () => {
    setLoading(true)
    let q = supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    const { data } = await q
    setInquiries(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [statusFilter])

  const updateStatus = async (id, status) => {
    setUpdating(true)
    await supabase.from('bookings').update({ status, admin_notes: adminNotes }).eq('id', id)
    setUpdating(false)
    if (selected?.id === id) setSelected(prev => ({ ...prev, status, admin_notes: adminNotes }))
    load()
  }

  const filtered = inquiries.filter(b =>
    b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase()) ||
    b.phone?.includes(search) ||
    b.event_type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            placeholder="Search by client, brand, email or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...S.input, paddingLeft: '36px' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
          style={{ ...S.select, width: 'auto', minWidth: '160px' }}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={load} style={S.btnSecondary} title="Refresh">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px' }}><Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} /></div>
      ) : filtered.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', color: '#A0A0A0', padding: '64px' }}>
          No inquiries found.
        </div>
      ) : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
                {['Client / Brand', 'Contact', 'Content Type', 'Project Date', 'Package', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#A0A0A0', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const sc = STATUS_COLORS[b.status?.toLowerCase()] || STATUS_COLORS.new
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff' }}>{b.full_name}</td>
                    <td style={{ padding: '14px 16px', color: '#A0A0A0' }}>
                      <div>{b.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>{b.phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#FF351F', fontWeight: 500 }}>{b.event_type}</td>
                    <td style={{ padding: '14px 16px', color: '#A0A0A0' }}>{b.event_date ? new Date(b.event_date).toLocaleDateString('en-IN') : '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#A0A0A0' }}>{b.package_name}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={S.badge(sc.bg, sc.text, sc.border)}>{b.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => { setSelected(b); setNotes(b.admin_notes || '') }}
                        style={{ ...S.btnSecondary, padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ ...S.card, width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700 }}>Inquiry Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '0.83rem', fontFamily: 'Inter, sans-serif' }}>
              <div><span style={{ color: '#666', display: 'block', fontSize: '0.72rem' }}>CLIENT / BRAND</span><strong>{selected.full_name}</strong></div>
              <div><span style={{ color: '#666', display: 'block', fontSize: '0.72rem' }}>PHONE</span>{selected.phone}</div>
              <div><span style={{ color: '#666', display: 'block', fontSize: '0.72rem' }}>EMAIL</span>{selected.email}</div>
              <div><span style={{ color: '#666', display: 'block', fontSize: '0.72rem' }}>CONTENT TYPE</span><span style={{ color: '#FF351F' }}>{selected.event_type}</span></div>
              <div><span style={{ color: '#666', display: 'block', fontSize: '0.72rem' }}>PROJECT DATE</span>{selected.event_date ? new Date(selected.event_date).toLocaleDateString('en-IN') : '—'}</div>
              <div><span style={{ color: '#666', display: 'block', fontSize: '0.72rem' }}>LOCATION / HUB</span>{selected.location}</div>
              <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#666', display: 'block', fontSize: '0.72rem' }}>PACKAGE</span>{selected.package_name}</div>
              {selected.requirements && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#666', display: 'block', fontSize: '0.72rem' }}>PROJECT BRIEF / REQUIREMENTS</span>
                  <div style={{ background: '#0A0A0A', padding: '10px 14px', borderRadius: '4px', marginTop: '4px', color: '#ccc', lineHeight: 1.5 }}>
                    {selected.requirements}
                  </div>
                </div>
              )}
            </div>

            {/* Status change */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', color: '#A0A0A0', display: 'block', marginBottom: '6px' }}>UPDATE STATUS</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['new', 'contacted', 'in progress', 'completed', 'cancelled'].map(s => (
                  <button
                    key={s}
                    disabled={updating}
                    onClick={() => updateStatus(selected.id, s)}
                    style={{
                      ...S.btnSecondary,
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      background: selected.status === s ? '#FF351F' : 'rgba(255,255,255,0.05)',
                      borderColor: selected.status === s ? '#FF351F' : 'rgba(255,255,255,0.1)',
                      color: selected.status === s ? '#fff' : '#A0A0A0',
                      textTransform: 'capitalize',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', color: '#A0A0A0', display: 'block', marginBottom: '6px' }}>ADMIN NOTES</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Internal notes on client discussions, deliverables, budget..."
                style={{ ...S.input, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelected(null)} style={S.btnSecondary}>Close</button>
              <button onClick={() => updateStatus(selected.id, selected.status)} disabled={updating} style={S.btn}>
                {updating ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  CUSTOMERS TAB
// ══════════════════════════════════════════════════════════════
function CustomersTab() {
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
    setCustomers(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...S.input, paddingLeft: '36px' }}
          />
        </div>
        <button onClick={load} style={S.btnSecondary}><RefreshCw size={14} /> Refresh</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px' }}><Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} /></div>
      ) : filtered.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', color: '#A0A0A0', padding: '64px' }}>No clients found.</div>
      ) : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
                {['Name', 'Email', 'Phone', 'First Inquired'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#A0A0A0', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff' }}>{c.full_name}</td>
                  <td style={{ padding: '14px 16px', color: '#A0A0A0' }}>{c.email}</td>
                  <td style={{ padding: '14px 16px', color: '#A0A0A0' }}>{c.phone}</td>
                  <td style={{ padding: '14px 16px', color: '#666' }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  PRICING PACKAGES TAB
// ══════════════════════════════════════════════════════════════
function PricingTab() {
  const [packages, setPackages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [message,  setMessage]  = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('pricing_packages').select('*').order('sort_order', { ascending: true })
    setPackages(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async (pkg) => {
    setSaving(true)
    setMessage('')
    const { error } = await supabase.from('pricing_packages').update({
      name: pkg.name,
      price: parseInt(pkg.price, 10),
      duration: pkg.duration,
      badge: pkg.badge || null,
      is_active: pkg.is_active,
    }).eq('id', pkg.id)
    setSaving(false)
    if (error) setMessage('Error saving: ' + error.message)
    else { setMessage('Package updated successfully!'); setEditing(null); load() }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '0.85rem', color: '#A0A0A0' }}>
          Updates to package prices and durations reflect instantly on the public website.
        </p>
        <button onClick={load} style={S.btnSecondary}><RefreshCw size={14} /> Refresh</button>
      </div>

      {message && (
        <div style={{ background: 'rgba(255,53,31,0.1)', border: '1px solid rgba(255,53,31,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', color: '#FF351F', fontSize: '0.85rem' }}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px' }}><Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {packages.map(pkg => {
            const isEd = editing?.id === pkg.id
            const item = isEd ? editing : pkg
            return (
              <div key={pkg.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#FF351F', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      {pkg.code}
                    </span>
                    {item.badge && (
                      <span style={{ background: '#FF351F', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '2px' }}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {isEd ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A0A0A0' }}>PACKAGE NAME</label>
                        <input value={item.name} onChange={e => setEditing({ ...editing, name: e.target.value })} style={S.input} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A0A0A0' }}>PRICE (₹)</label>
                        <input type="number" value={item.price} onChange={e => setEditing({ ...editing, price: e.target.value })} style={S.input} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A0A0A0' }}>DURATION / SCOPE</label>
                        <input value={item.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })} style={S.input} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A0A0A0' }}>BADGE (OPTIONAL)</label>
                        <input value={item.badge || ''} onChange={e => setEditing({ ...editing, badge: e.target.value })} style={S.input} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                        {pkg.name}
                      </h3>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 900, color: '#FF351F', marginBottom: '4px' }}>
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#A0A0A0', marginBottom: '16px' }}>{pkg.duration}</div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                        {pkg.features?.map(f => (
                          <li key={f} style={{ fontSize: '0.78rem', color: '#888', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Check size={12} style={{ color: '#FF351F', flexShrink: 0 }} /> {f}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {isEd ? (
                    <>
                      <button onClick={() => setEditing(null)} style={S.btnSecondary}>Cancel</button>
                      <button onClick={() => save(editing)} disabled={saving} style={S.btn}>
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditing(pkg)} style={S.btnSecondary}>Edit Package</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  MEDIA TAB (Storage Media)
// ══════════════════════════════════════════════════════════════
function MediaTab({ bucket, mediaType }) {
  const [items,     setItems]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')
  const [deleting,  setDeleting]  = useState(null)
  const fileRef = useRef(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from(bucket).list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
    if (!error) setItems(data?.filter(f => f.name !== '.emptyFolderPlaceholder') || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [bucket])

  const upload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')
    for (const file of files) {
      const ext  = file.name.split('.').pop()
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
      if (error) { setError('Upload failed: ' + error.message); break }
    }
    setUploading(false)
    fileRef.current.value = ''
    load()
  }

  const remove = async (name) => {
    setDeleting(name)
    const { error } = await supabase.storage.from(bucket).remove([name])
    if (error) setError('Delete failed: ' + error.message)
    setDeleting(null)
    load()
  }

  const getUrl = (name) => supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl

  return (
    <div>
      {/* Upload */}
      <div style={{ ...S.card, marginBottom: '24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            Upload Storage {mediaType === 'image' ? 'Images' : 'Videos'}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>
            {mediaType === 'image' ? 'JPG, PNG, WebP — max 50 MB each' : 'MP4, MOV, WebM vertical reels — max 500 MB each'}
          </p>
        </div>
        <input ref={fileRef} type="file" accept={mediaType === 'image' ? 'image/*' : 'video/*'} multiple onChange={upload} style={{ display: 'none' }} />
        <button
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          style={{ background: '#FF351F', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...</> : <><Upload size={14} /> Upload Files</>}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,53,31,0.1)', border: '1px solid rgba(255,53,31,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <AlertCircle size={16} style={{ color: '#FF351F' }} />
          <p style={{ fontSize: '0.85rem', color: '#FF351F', fontFamily: 'Inter, sans-serif' }}>{error}</p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}><Loader size={24} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} /></div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: '#A0A0A0', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
          No {mediaType === 'image' ? 'images' : 'videos'} uploaded yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {items.map(item => (
            <div key={item.name} style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#151515', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: mediaType === 'image' ? '1' : '9/16' }}>
              {mediaType === 'image' ? (
                <img src={getUrl(item.name)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              ) : (
                <video src={getUrl(item.name)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} muted />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <button
                  onClick={() => remove(item.name)}
                  disabled={deleting === item.name}
                  style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#FF351F', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {deleting === item.name ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                </button>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', fontSize: '0.65rem', color: '#A0A0A0', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
