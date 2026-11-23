import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STATIC_FALLBACK = [
  {
    id: 1,
    code: 'PACKAGE 01',
    name: 'Starter Content Package',
    price: 9999,
    duration: 'Monthly / Per Campaign',
    badge: null,
    features: [
      '4 High-Retention Reels / Shorts',
      'Concept Ideation & Script Hook Assistance',
      'Dynamic Captions & Motion Graphics',
      'Professional Sound Design & Color Grade',
      '2 Revision Rounds & 48-Hour Delivery',
    ],
  },
  {
    id: 2,
    code: 'PACKAGE 02',
    name: 'Professional Content Package',
    price: 19999,
    duration: 'Bi-Weekly / Growth Plan',
    badge: 'Most Popular',
    features: [
      '10 Cinematic Reels / YouTube Shorts',
      'Complete Visual Hook & Script Guidance',
      '1 Half-Day Production Shoot or Raw Asset Ingest',
      'Trend-Jacked Audio & Premium Transitions',
      'Priority Turnaround & Story Cutdowns',
    ],
  },
  {
    id: 3,
    code: 'PACKAGE 03',
    name: 'Premium Brand Package',
    price: 34999,
    duration: 'Full Creative Suite',
    badge: 'Best Value',
    features: [
      '20 Multi-Platform Visual Deliverables',
      '1 Full-Day Commercial & On-Site Shoot',
      'Dedicated Creative Director & Video Editor',
      '4K Master Files & Formatted Cutdowns',
      'End-to-End Campaign Strategy & Fast Turnaround',
    ],
  },
  {
    id: 4,
    code: 'PACKAGE 04',
    name: 'Custom Content Package',
    price: 49999,
    duration: 'Tailored Production',
    badge: 'Enterprise',
    features: [
      'Tailored Corporate & Commercial Shoots',
      'Motion Graphics, 3D Mockups & Invitations',
      'Brand Documentaries & Executive Interviews',
      'Omnichannel Multi-Asset Deliverables',
      'Dedicated Creative Squad & Unlimited Revisions',
    ],
  },
]

export function usePricing() {
  const [packages, setPackages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetchPackages = async () => {
    try {
      const { data, error: err } = await supabase
        .from('pricing_packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (err) throw err
      setPackages(data?.length ? data : STATIC_FALLBACK)
      setError(null)
    } catch (err) {
      console.error('[usePricing] Supabase fetch error:', err.message)
      setPackages(STATIC_FALLBACK)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()

    const channel = supabase
      .channel('public:pricing_packages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pricing_packages' },
        () => { fetchPackages() }
      )
      .subscribe()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchPackages()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { packages, loading, error }
}
