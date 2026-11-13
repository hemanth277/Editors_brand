import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Static fallback - used if Supabase is unavailable
const STATIC_SERVICES = [
  { id: 1, title: 'Wedding Reel Making', description: 'Every glance, every tear, every laugh — captured in cinematic vertical reels that tell your love story forever.', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80' },
  { id: 2, title: 'Engagement Coverage', description: 'The beginning of forever deserves stunning visuals. We document the magic of your engagement in breathtaking reels.', image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80' },
  { id: 3, title: 'Haldi & Mehendi', description: 'The vibrant colors, the laughter, the traditions — our Reel Makers capture every joyful moment of your pre-wedding celebrations.', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80' },
  { id: 4, title: 'Sangeet & Reception', description: 'From the first dance to the last performance, we craft stunning highlight reels of your most memorable celebrations.', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80' },
  { id: 5, title: 'Birthday Celebrations', description: "Whether it's a milestone birthday or an intimate gathering, we create reels that capture the joy and energy of your celebration.", image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80' },
  { id: 6, title: 'Corporate Events', description: "Professional coverage for conferences, launches, and corporate celebrations that reflect your brand's story.", image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
]

export function useServices() {
  const [services, setServices] = useState([])
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
      setServices(data?.length ? data : STATIC_SERVICES)
      setError(null)
    } catch (err) {
      console.error('[useServices] Supabase fetch error:', err.message)
      setServices(STATIC_SERVICES)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()

    const channel = supabase
      .channel('public:services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => fetchServices())
      .subscribe()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchServices()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { services, loading, error }
}
