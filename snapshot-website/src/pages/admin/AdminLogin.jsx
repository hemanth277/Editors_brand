import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader, AlertCircle, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { signIn, isAdmin, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect to target or /admin if already logged in as authorized admin
  useEffect(() => {
    if (user && isAdmin) {
      const from = location.state?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    }
  }, [user, isAdmin, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your admin email and password.')
      return
    }
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      const from = location.state?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    } catch (err) {
      console.error('[AdminLogin] Authentication error:', err)
      setError(err.message || 'Invalid email or password. Please try again.')
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
      position: 'relative',
    }}>
      {/* Return to public site link */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '28px',
          left: '28px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#A0A0A0',
          textDecoration: 'none',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.82rem',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#A0A0A0')}
      >
        <ArrowLeft size={16} /> Back to Website
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#151515',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '48px 40px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.7rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#fff',
            marginBottom: '8px',
          }}>
            SNAP<span style={{ color: '#FF351F' }}>SHOT</span>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#FF351F',
            fontWeight: 600,
          }}>
            <Lock size={12} /> Admin Authentication
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,53,31,0.1)',
            border: '1px solid rgba(255,53,31,0.3)',
            borderRadius: '4px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
          }}>
            <AlertCircle size={16} style={{ color: '#FF351F', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#FF351F', margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#A0A0A0',
                marginBottom: '8px',
              }}
            >
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@snapshotagency.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              style={{
                width: '100%',
                background: '#0A0A0A',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '4px',
                color: '#fff',
                padding: '12px 14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#FF351F')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.14)')}
            />
          </div>

          <div style={{ marginBottom: '28px', position: 'relative' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#A0A0A0',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              type={showPwd ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: '100%',
                background: '#0A0A0A',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '4px',
                color: '#fff',
                padding: '12px 44px 12px 14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#FF351F')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.14)')}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              style={{
                position: 'absolute',
                right: '14px',
                bottom: '12px',
                background: 'none',
                border: 'none',
                color: '#A0A0A0',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#FF351F',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              padding: '13px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
