import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const CONTENT_CATEGORIES = [
  'Instagram Reels & YouTube Shorts',
  'Brand Promotional Videos',
  'Business & Corporate Video Editing',
  'Video Editing & Post-Production',
  'Invitations',
]

// Professional curated 9:16 vertical samples for content creation agency
export const STATIC_VIDEOS = [
  {
    id: 'sample-1',
    title: 'Kinetic Fashion Reel',
    category: 'Instagram Reels & YouTube Shorts',
    thumbnail_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=720&q=80',
    public_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-fashion-model-in-the-studio-41716-large.mp4',
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'sample-2',
    title: 'Brand Commercial Shoot',
    category: 'Brand Promotional Videos',
    thumbnail_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=720&q=80',
    public_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-posing-for-camera-in-a-park-vertical-41738-large.mp4',
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'sample-3',
    title: 'Executive Brand Story',
    category: 'Business & Corporate Video Editing',
    thumbnail_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=720&q=80',
    public_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-woman-in-an-office-using-a-laptop-42999-large.mp4',
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'sample-4',
    title: 'Dynamic Cut & Color Grade',
    category: 'Video Editing & Post-Production',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=720&q=80',
    public_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-photographer-taking-pictures-in-a-studio-41717-large.mp4',
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'sample-5',
    title: 'Luxury Motion Invitation',
    category: 'Invitations',
    thumbnail_url: 'https://images.unsplash.com/photo-1511795409834-432f7b1728b2?w=720&q=80',
    public_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-toast-with-champagne-glasses-42994-large.mp4',
    is_active: true,
    sort_order: 5,
  },
  {
    id: 'sample-6',
    title: 'High-Retention Food & Beverage Reel',
    category: 'Instagram Reels & YouTube Shorts',
    thumbnail_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=720&q=80',
    public_url: 'https://assets.mixkit.co/videos/preview/mixkit-barista-making-latte-art-vertical-41737-large.mp4',
    is_active: true,
    sort_order: 6,
  },
  {
    id: 'sample-7',
    title: 'Premium Product Showcase',
    category: 'Brand Promotional Videos',
    thumbnail_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=720&q=80',
    public_url: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-for-a-commercial-vertical-41724-large.mp4',
    is_active: true,
    sort_order: 7,
  },
]

export function usePortfolioVideos() {
  const [videos,  setVideos]  = useState(STATIC_VIDEOS)
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
      if (data && data.length > 0) {
        // filter active videos for public gallery if is_active exists
        const activeOnly = data.filter(v => v.is_active !== false)
        setVideos(activeOnly.length > 0 ? activeOnly : data)
      } else {
        setVideos(STATIC_VIDEOS)
      }
      setError(null)
    } catch (err) {
      console.warn('[usePortfolioVideos] Supabase note, using fallback:', err.message)
      setVideos(STATIC_VIDEOS)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()

    const channelName = `portfolio_videos_${Math.random().toString(36).slice(2, 9)}`
    let channel = null

    try {
      channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio' }, () => fetchVideos())
      channel.subscribe()
    } catch (realtimeErr) {
      console.warn('[usePortfolioVideos] Realtime subscription fallback:', realtimeErr)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchVideos()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (channel) {
        try { supabase.removeChannel(channel) } catch { /* ignore */ }
      }
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { videos, loading, error, refetch: fetchVideos }
}
