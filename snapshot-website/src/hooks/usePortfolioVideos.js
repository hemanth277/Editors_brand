import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Static fallback for portfolio/videos
const STATIC_VIDEOS = [
  { id: 1, title: 'Wedding Highlights', category: 'Wedding', thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', public_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, title: 'Couple Entry',       category: 'Wedding', thumbnail_url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80', public_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 3, title: 'Haldi Moments',      category: 'Haldi',   thumbnail_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80', public_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 4, title: 'Dance Performance',  category: 'Sangeet', thumbnail_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80', public_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 5, title: 'Candid Celebrations',category: 'Wedding', thumbnail_url: 'https://images.unsplash.com/photo-1511795409834-432f7b1728b2?w=400&q=80', public_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 6, title: 'Birthday Party',     category: 'Birthday',thumbnail_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80', public_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
]

export function usePortfolioVideos() {
  const [videos,  setVideos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchVideos = async () => {
    try {
      const { data, error: err } = await supabase
        .from('portfolio')
        .select('*')
        .eq('media_type', 'video')
        .order('sort_order', { ascending: true })

      if (err) throw err
      setVideos(data?.length ? data : STATIC_VIDEOS)
      setError(null)
    } catch (err) {
      console.error('[usePortfolioVideos] Supabase fetch error:', err.message)
      setVideos(STATIC_VIDEOS)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()

    const channel = supabase
      .channel('public:portfolio_videos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio' }, () => fetchVideos())
      .subscribe()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchVideos()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { videos, loading, error }
}
