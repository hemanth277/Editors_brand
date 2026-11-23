import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0A0A0A',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center'
        }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '16px' }}>
            SNAP<span style={{ color: '#FF351F' }}>SHOT</span>
          </h1>
          <p style={{ color: '#A0A0A0', marginBottom: '24px', maxWidth: '480px', lineHeight: 1.6 }}>
            Something went wrong while rendering the page. Click the button below to reload.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#FF351F',
              color: '#fff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.8rem'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
