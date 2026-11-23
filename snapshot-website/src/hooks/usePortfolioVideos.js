import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STATIC_VIDEOS = [
  {
    id: 1,
    title: 'Brand Growth Campaign',
    category: 'Brand Commercial',
    thumbnail_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
    public_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    title: 'High-Retention Reel',
    category: 'Instagram Reel',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80',
    public_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 3,
    title: 'Corporate Storytelling',
    category: 'Corporate Film',
    thumbnail_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
    public_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 4,
    title: 'Product In-Motion',
    category: 'Product Shoot',
    thumbnail_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    public_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 5,
    title: 'Luxury Event Invitation',
    category: 'Digital Invitation',
    thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    public_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 6,
    title: 'Creator YouTube Short',
    category: 'YouTube Short',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
    public_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
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
