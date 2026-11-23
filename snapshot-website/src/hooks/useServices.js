import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STATIC_SERVICES = [
  {
    id: 1,
    title: 'Instagram Reels & YouTube Shorts',
    description: 'High-retention, trend-aware vertical short-form videos designed to stop the scroll, explode organic reach, and convert viewers into loyal followers.',
    image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
  },
  {
    id: 2,
    title: 'Brand Promotional Videos',
    description: 'Cinematic product launches, lifestyle brand commercials, and founder stories engineered to build brand prestige and drive conversions.',
    image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
  },
  {
    id: 3,
    title: 'Business & Corporate Content',
    description: 'Polished company overviews, executive interviews, conference highlights, and internal culture reels that showcase industry leadership.',
    image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
  },
  {
    id: 4,
    title: 'Video Editing & Post-Production',
    description: 'Full-suite post-production: motion graphics, sound design, color grading, pacing optimization, and subtitle animation tailored for modern feeds.',
    image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
  },
  {
    id: 5,
    title: 'Digital Invitations & Motion Teasers',
    description: 'Bespoke digital video invitations, exclusive VIP event invites, and motion reveal teasers crafted with custom typography and motion design.',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  },
  {
    id: 6,
    title: 'Commercial Shoots & Product Content',
    description: 'Studio and location shoots with high-end camera rigs, studio lighting, and creative art direction for e-commerce and digital advertising.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
]

export function useServices() {
  const [services, setServices] = useState(STATIC_SERVICES)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetchServices = async () => {
    try {
      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (err) throw err
      if (data && data.length > 0) {
        setServices(data)
      }
      setError(null)
    } catch (err) {
      console.warn('[useServices] Supabase query note:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()

    const channelName = `services_${Math.random().toString(36).slice(2, 9)}`
    let channel = null

    try {
      channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => fetchServices())
      channel.subscribe()
    } catch (realtimeErr) {
      console.warn('[useServices] Realtime subscription fallback:', realtimeErr)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchServices()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { services, loading, error }
}
