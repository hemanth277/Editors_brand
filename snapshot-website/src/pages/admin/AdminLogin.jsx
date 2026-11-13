import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { signIn, isAdmin, user } = useAuth()
  const navigate = useNavigate()

  // Already logged in as admin → redirect
  if (user && isAdmin) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Enter your email and password.'); return }
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#151515',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '4px',
          padding: '48px 40px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.6rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#fff',
            marginBottom: '8px',
          }}>
            EDITORS <span style={{ color: '#FF351F' }}>BRAND</span>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0A0A0' }}>
            Admin Dashboard
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,53,31,0.1)', border: '1px solid rgba(255,53,31,0.3)', borderRadius: '2px', padding: '12px 16px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertCircle size={16} style={{ color: '#FF351F', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#FF351F' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="admin@editorsbrand.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>
          <div style={{ marginBottom: '32px', position: 'relative' }}>
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              style={{ position: 'absolute', right: '14px', bottom: '14px', background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer', padding: 0 }}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
