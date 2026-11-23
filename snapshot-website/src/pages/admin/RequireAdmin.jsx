import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader } from 'lucide-react'

export default function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // If not logged in, redirect to /admin/login preserving return URL
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // If logged in but not admin
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#FF351F', fontSize: '1rem' }}>Access denied — unauthorized account.</p>
        <a href="/admin/login" style={{ color: '#A0A0A0', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}>← Back to login</a>
      </div>
    )
  }

  return children
}
