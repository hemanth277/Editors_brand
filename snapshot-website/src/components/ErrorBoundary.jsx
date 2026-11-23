import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo)
    this.setState({ errorInfo })
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
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', marginBottom: '16px' }}>
            SNAP<span style={{ color: '#FF351F' }}>SHOT</span>
          </h1>
          <p style={{ color: '#A0A0A0', marginBottom: '20px', maxWidth: '520px', lineHeight: 1.6 }}>
            Something went wrong while rendering the page.
          </p>

          {/* Diagnostic details box */}
          <div style={{
            background: '#151515',
            border: '1px solid rgba(255,53,31,0.3)',
            borderRadius: '4px',
            padding: '16px 20px',
            maxWidth: '680px',
            width: '100%',
            textAlign: 'left',
            marginBottom: '24px',
            fontSize: '0.85rem',
            color: '#FF351F',
            fontFamily: 'monospace',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            <strong>Error Details:</strong>
            <br />
            {this.state.error ? this.state.error.toString() : 'Unknown error'}
            {this.state.error?.stack && (
              <div style={{ color: '#888', marginTop: '10px', fontSize: '0.75rem', maxHeight: '180px', overflowY: 'auto' }}>
                {this.state.error.stack}
              </div>
            )}
          </div>

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
