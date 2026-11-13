import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Package, Image, Video,
  LogOut, Search, ChevronDown, X, Check, Loader,
  Upload, Trash2, Users, RefreshCw, AlertCircle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// ─── Sidebar tabs ─────────────────────────────────────────────
const TABS = [
  { id: 'bookings',  label: 'Bookings',   icon: Calendar },
  { id: 'customers', label: 'Customers',  icon: Users },
  { id: 'pricing',   label: 'Pricing',    icon: Package },
  { id: 'portfolio', label: 'Portfolio',  icon: Image },
  { id: 'videos',    label: 'Videos',     icon: Video },
]

const STATUS_COLORS = {
  pending:   { bg: 'rgba(255,200,0,0.1)',   text: '#ffc800', border: 'rgba(255,200,0,0.3)'   },
  confirmed: { bg: 'rgba(0,200,100,0.1)',   text: '#00c864', border: 'rgba(0,200,100,0.3)'   },
  completed: { bg: 'rgba(100,100,255,0.1)', text: '#8080ff', border: 'rgba(100,100,255,0.3)' },
  cancelled: { bg: 'rgba(255,53,31,0.1)',   text: '#FF351F', border: 'rgba(255,53,31,0.3)'   },
}

// ─── Shared styles ────────────────────────────────────────────
const S = {
  card: {
    background: '#151515',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '4px',
    padding: '24px',
  },
  th: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#A0A0A0',
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    whiteSpace: 'nowrap',
  },
  td: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
    color: '#fff',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'top',
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    padding: '10px 14px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    borderRadius: '2px',
    outline: 'none',
    width: '100%',
  },
  label: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#A0A0A0',
    display: 'block',
    marginBottom: '8px',
  },
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab]   = useState('bookings')
  const [sidebarOpen, setSidebar]   = useState(false)
  const { signOut, user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  // Show loader while auth state is initializing
  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size={24} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/admin', { replace: true })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #151515; }
        ::-webkit-scrollbar-thumb { background: #FF351F; border-radius: 2px; }
        input:focus, select:focus, textarea:focus { border-color: #FF351F !important; outline: none; }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); position: fixed !important; z-index: 999; transition: transform 0.3s; }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>

      {/* ── Sidebar ── */}
      <aside
        className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}
        style={{
          width: '240px',
          background: '#0D0D0D',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.08em', color: '#fff' }}>
            EDITORS <span style={{ color: '#FF351F' }}>BRAND</span>
          </div>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A0A0A0', marginTop: '4px' }}>Admin</p>
        </div>

        {/* Nav tabs */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebar(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px',
                  background: active ? 'rgba(255,53,31,0.12)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(255,53,31,0.3)' : 'transparent'}`,
                  borderRadius: '4px',
                  color: active ? '#FF351F' : '#A0A0A0',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  width: '100%',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '0.75rem', color: '#A0A0A0', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#FF351F', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', padding: 0 }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main className="admin-main" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px', background: '#0D0D0D', position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => setSidebar(v => !v)} style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer', display: 'none' }} className="sidebar-toggle">
            <LayoutDashboard size={20} />
          </button>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: '#fff', flex: 1 }}>
            {TABS.find(t => t.id === activeTab)?.label}
          </h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {activeTab === 'bookings'  && <BookingsTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'pricing'   && <PricingTab />}
          {activeTab === 'portfolio' && <MediaTab bucket="portfolio-images" mediaType="image" />}
          {activeTab === 'videos'    && <MediaTab bucket="event-videos" mediaType="video" />}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  BOOKINGS TAB
// ══════════════════════════════════════════════════════════════
function BookingsTab() {
  const [bookings, setBookings]   = useState([])
  const [loading,  setLoading]    = useState(true)
  const [search,   setSearch]     = useState('')
  const [dateFrom, setDateFrom]   = useState('')
  const [dateTo,   setDateTo]     = useState('')
  const [selected, setSelected]   = useState(null)
  const [updating, setUpdating]   = useState(false)

  const load = async () => {
    setLoading(true)
    let q = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (dateFrom) q = q.gte('event_date', dateFrom)
    if (dateTo)   q = q.lte('event_date', dateTo)

    const { data, error } = await q
    if (!error) setBookings(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [dateFrom, dateTo])

  const filtered = bookings.filter(b =>
    !search || [b.full_name, b.email, b.phone, b.event_type, b.location, b.package_name]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  const updateStatus = async (id, status) => {
    setUpdating(true)
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (!error) {
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b))
      if (selected?.id === id) setSelected(s => ({ ...s, status }))
    }
    setUpdating(false)
  }

  const updateNotes = async (id, notes) => {
    await supabase.from('bookings').update({ admin_notes: notes }).eq('id', id)
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 220px' }}>
          <label style={S.label}>Search</label>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0A0A0' }} />
            <input style={{ ...S.input, paddingLeft: '36px' }} placeholder="Name, email, phone, event…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ flex: '0 0 160px' }}>
          <label style={S.label}>Date From</label>
          <input type="date" style={{ ...S.input, colorScheme: 'dark' }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div style={{ flex: '0 0 160px' }}>
          <label style={S.label}>Date To</label>
          <input type="date" style={{ ...S.input, colorScheme: 'dark' }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
        <button onClick={load} style={{ ...S.input, width: 'auto', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 16px', flexShrink: 0 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        {Object.entries(STATUS_COLORS).map(([status, colors]) => {
          const count = bookings.filter(b => b.status === status).length
          return (
            <div key={status} style={{ ...S.card, padding: '16px 20px', flex: '1 1 100px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: colors.text }}>{count}</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A0A0A0', marginTop: '4px' }}>{status}</div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ ...S.card, padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}><Loader size={24} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} /></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#A0A0A0', fontSize: '0.9rem' }}>No bookings found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr>
                {['Name', 'Event', 'Date', 'Package', 'Status', 'Created', ''].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending
                return (
                  <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(b)}>
                    <td style={S.td}>
                      <div style={{ fontWeight: 500 }}>{b.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#A0A0A0' }}>{b.email}</div>
                    </td>
                    <td style={S.td}>{b.event_type}</td>
                    <td style={S.td}>{b.event_date}</td>
                    <td style={S.td}>{b.package_name}</td>
                    <td style={S.td}>
                      <span style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ ...S.td, fontSize: '0.75rem', color: '#A0A0A0' }}>{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={S.td}><ChevronDown size={14} style={{ color: '#A0A0A0' }} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <BookingDetail
            booking={selected}
            onClose={() => setSelected(null)}
            onStatusChange={updateStatus}
            onNotesChange={updateNotes}
            updating={updating}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function BookingDetail({ booking, onClose, onStatusChange, onNotesChange, updating }) {
  const [notes, setNotes] = useState(booking.admin_notes || '')
  const sc = STATUS_COLORS[booking.status] || STATUS_COLORS.pending

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '480px', height: '100vh', background: '#151515', borderLeft: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', padding: '28px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Booking Detail</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Fields */}
        {[
          ['Name',       booking.full_name],
          ['Phone',      booking.phone],
          ['Email',      booking.email],
          ['Event Type', booking.event_type],
          ['Event Date', booking.event_date],
          ['Location',   booking.location],
          ['Package',    booking.package_name],
          ['Requirements', booking.requirements || '—'],
        ].map(([k, v]) => (
          <div key={k} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A0A0A0', marginBottom: '4px' }}>{k}</div>
            <div style={{ fontSize: '0.9rem', color: '#fff' }}>{v}</div>
          </div>
        ))}

        {/* Status */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A0A0A0', display: 'block', marginBottom: '8px' }}>Update Status</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.keys(STATUS_COLORS).map(s => {
              const c = STATUS_COLORS[s]
              const active = booking.status === s
              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(booking.id, s)}
                  disabled={updating || active}
                  style={{
                    padding: '7px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', cursor: active ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif',
                    background: active ? c.bg : 'transparent',
                    color: active ? c.text : '#A0A0A0',
                    border: `1px solid ${active ? c.border : 'rgba(255,255,255,0.1)'}`,
                    opacity: updating ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  {active && <Check size={12} />}{s}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A0A0A0', display: 'block', marginBottom: '8px' }}>Admin Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={() => onNotesChange(booking.id, notes)}
            style={{ ...S.input, minHeight: '100px', resize: 'vertical' }}
            placeholder="Internal notes..."
          />
          <p style={{ fontSize: '0.7rem', color: '#A0A0A0', marginTop: '4px' }}>Auto-saved on blur</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════
//  CUSTOMERS TAB
// ══════════════════════════════════════════════════════════════
function CustomersTab() {
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    supabase.from('customers').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setCustomers(data || []); setLoading(false) })
  }, [])

  const filtered = customers.filter(c =>
    !search || [c.full_name, c.email, c.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={S.label}>Search Customers</label>
        <div style={{ position: 'relative', maxWidth: '360px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0A0A0' }} />
          <input style={{ ...S.input, paddingLeft: '36px' }} placeholder="Name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div style={{ ...S.card, padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}><Loader size={24} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} /></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead><tr>{['Name', 'Email', 'Phone', 'Joined'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ ...S.td, fontWeight: 500 }}>{c.full_name}</td>
                  <td style={S.td}>{c.email}</td>
                  <td style={S.td}>{c.phone}</td>
                  <td style={{ ...S.td, fontSize: '0.75rem', color: '#A0A0A0' }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  PRICING TAB
// ══════════════════════════════════════════════════════════════
function PricingTab() {
  const [packages, setPackages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState('')

  const load = () => {
    setLoading(true)
    supabase.from('pricing_packages').select('*').order('sort_order')
      .then(({ data }) => { setPackages(data || []); setLoading(false) })
  }
  useEffect(load, [])

  const save = async (pkg) => {
    setSaving(true)
    setMsg('')
    const { error } = await supabase.from('pricing_packages').update({
      name: pkg.name, price: Number(pkg.price), duration: pkg.duration,
      features: pkg.features, badge: pkg.badge || null, is_active: pkg.is_active,
    }).eq('id', pkg.id)
    setSaving(false)
    if (error) { setMsg('Error: ' + error.message) }
    else { setMsg('Saved!'); setEditing(null); load() }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '48px' }}><Loader size={24} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} /></div>

  return (
    <div>
      {msg && <div style={{ background: msg.startsWith('Error') ? 'rgba(255,53,31,0.1)' : 'rgba(0,200,100,0.1)', border: `1px solid ${msg.startsWith('Error') ? 'rgba(255,53,31,0.3)' : 'rgba(0,200,100,0.3)'}`, borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', color: msg.startsWith('Error') ? '#FF351F' : '#00c864', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>{msg}</div>}
      <div style={{ display: 'grid', gap: '20px' }}>
        {packages.map(pkg => (
          <div key={pkg.id} style={S.card}>
            {editing?.id === pkg.id ? (
              <PricingEditor pkg={editing} onChange={setEditing} onSave={() => save(editing)} onCancel={() => setEditing(null)} saving={saving} />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF351F', fontWeight: 700 }}>{pkg.code}</span>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#fff', margin: '4px 0 2px' }}>{pkg.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>{pkg.duration}</p>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#fff', fontWeight: 700, marginTop: '8px' }}>₹{Number(pkg.price).toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => setEditing({ ...pkg })} style={{ background: 'rgba(255,53,31,0.1)', border: '1px solid rgba(255,53,31,0.3)', color: '#FF351F', padding: '8px 20px', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600 }}>
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PricingEditor({ pkg, onChange, onSave, onCancel, saving }) {
  const setField = (k, v) => onChange(p => ({ ...p, [k]: v }))
  const setFeature = (i, v) => {
    const f = [...pkg.features]; f[i] = v; setField('features', f)
  }
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div><label style={S.label}>Name</label><input style={S.input} value={pkg.name} onChange={e => setField('name', e.target.value)} /></div>
        <div><label style={S.label}>Price (₹)</label><input style={S.input} type="number" value={pkg.price} onChange={e => setField('price', e.target.value)} /></div>
        <div><label style={S.label}>Duration</label><input style={S.input} value={pkg.duration} onChange={e => setField('duration', e.target.value)} /></div>
        <div><label style={S.label}>Badge (optional)</label><input style={S.input} value={pkg.badge || ''} onChange={e => setField('badge', e.target.value)} placeholder="e.g. Most Popular" /></div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={S.label}>Features</label>
        {pkg.features.map((f, i) => (
          <input key={i} style={{ ...S.input, marginBottom: '8px' }} value={f} onChange={e => setFeature(i, e.target.value)} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onSave} disabled={saving} style={{ background: '#FF351F', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Check size={14} /> Save</>}
        </button>
        <button onClick={onCancel} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#A0A0A0', padding: '10px 20px', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  MEDIA TAB (portfolio-images / event-videos)
// ══════════════════════════════════════════════════════════════
function MediaTab({ bucket, mediaType }) {
  const [items,     setItems]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')
  const [deleting,  setDeleting]  = useState(null)
  const fileRef = useRef(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from(bucket).list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
    if (!error) setItems(data?.filter(f => f.name !== '.emptyFolderPlaceholder') || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [bucket])

  const upload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')
    for (const file of files) {
      const ext  = file.name.split('.').pop()
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
      if (error) { setError('Upload failed: ' + error.message); break }
    }
    setUploading(false)
    fileRef.current.value = ''
    load()
  }

  const remove = async (name) => {
    setDeleting(name)
    const { error } = await supabase.storage.from(bucket).remove([name])
    if (error) setError('Delete failed: ' + error.message)
    setDeleting(null)
    load()
  }

  const getUrl = (name) => supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl

  return (
    <div>
      {/* Upload */}
      <div style={{ ...S.card, marginBottom: '24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            Upload {mediaType === 'image' ? 'Images' : 'Videos'}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>
            {mediaType === 'image' ? 'JPG, PNG, WebP — max 50 MB each' : 'MP4, MOV, WebM — max 500 MB each'}
          </p>
        </div>
        <input ref={fileRef} type="file" accept={mediaType === 'image' ? 'image/*' : 'video/*'} multiple onChange={upload} style={{ display: 'none' }} />
        <button
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          style={{ background: '#FF351F', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...</> : <><Upload size={14} /> Upload Files</>}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,53,31,0.1)', border: '1px solid rgba(255,53,31,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <AlertCircle size={16} style={{ color: '#FF351F' }} />
          <p style={{ fontSize: '0.85rem', color: '#FF351F', fontFamily: 'Inter, sans-serif' }}>{error}</p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}><Loader size={24} style={{ color: '#FF351F', animation: 'spin 1s linear infinite' }} /></div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: '#A0A0A0', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
          No {mediaType === 'image' ? 'images' : 'videos'} uploaded yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {items.map(item => (
            <div key={item.name} style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#151515', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: mediaType === 'image' ? '1' : '9/16' }}>
              {mediaType === 'image' ? (
                <img src={getUrl(item.name)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              ) : (
                <video src={getUrl(item.name)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} muted />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <button
                  onClick={() => remove(item.name)}
                  disabled={deleting === item.name}
                  style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#FF351F', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {deleting === item.name ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                </button>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', fontSize: '0.65rem', color: '#A0A0A0', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
