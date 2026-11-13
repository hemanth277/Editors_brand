import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader } from 'lucide-react'

export default function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader size={28} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!user)    return <Navigate to="/admin" replace />
  if (!isAdmin) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', color: '#FF351F', fontSize: '1rem' }}>Access denied — not an admin account.</p>
      <a href="/admin" style={{ color: '#A0A0A0', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}>← Back to login</a>
    </div>
  )

  return children
}
