import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ─── Centralized hook: fetches pricing_packages from Supabase ──
// Falls back to static data if Supabase is unavailable.
// Subscribes to Realtime so price changes are reflected immediately.

const STATIC_FALLBACK = [
  {
    id: 1, code: 'PACKAGE 01', name: 'Half Day Plan', price: 4999,
    duration: 'Up to 4 Hours', badge: null,
    features: ['Up to 4 hours of coverage', 'One professional Reel Maker', 'Vertical video shooting', 'Edited highlight reels', 'Digital delivery'],
  },
  {
    id: 2, code: 'PACKAGE 02', name: 'Full Day Plan', price: 8999,
    duration: 'Up to 8 Hours', badge: 'Most Popular',
    features: ['Up to 8 hours of coverage', 'Professional event coverage', 'Multiple edited reels', 'Candid moments', 'Digital delivery'],
  },
  {
    id: 3, code: 'PACKAGE 03', name: 'Premium Plan', price: 14999,
    duration: 'Full Day', badge: 'Best Value',
    features: ['Full-day event coverage', 'Premium creative coverage', 'Multiple highlight reels', 'Priority editing', 'Customized deliverables'],
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

    // ── Realtime subscription ──────────────────────────────────
    const channel = supabase
      .channel('public:pricing_packages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pricing_packages' },
        () => { fetchPackages() }
      )
      .subscribe()

    // ── Refetch when tab becomes visible again ─────────────────
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
