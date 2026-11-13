const TICKER_ITEMS = [
  'ENGAGEMENTS', 'HALDI', 'SANGEET', 'BIRTHDAYS',
  'WEDDINGS', 'CORPORATE EVENTS', 'RECEPTIONS', 'PRE-WEDDING',
]

export default function EventTicker() {
  // Duplicate for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div
      style={{
        background: '#FF351F',
        overflow: 'hidden',
        padding: '14px 0',
        position: 'relative',
        zIndex: 2,
      }}
      aria-label="Event types ticker"
    >
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#fff',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              paddingLeft: '24px',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
