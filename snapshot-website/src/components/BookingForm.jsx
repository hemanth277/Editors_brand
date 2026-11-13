import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { packages } from '../data/pricing'
import { supabase } from '../lib/supabase'

const eventTypes = [
  'Wedding', 'Engagement', 'Haldi & Mehendi', 'Sangeet',
  'Reception', 'Birthday', 'Pre-Wedding', 'Corporate Event', 'Other',
]

const defaultForm = {
  fullName: '',
  phone: '',
  email: '',
  eventType: '',
  eventDate: '',
  location: '',
  package: '',
  requirements: '',
}

export default function BookingForm({ selectedPackage, onClose, inline = false }) {
  const [form, setForm]       = useState({ ...defaultForm, package: selectedPackage?.name || '' })
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState('idle')   // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (selectedPackage) setForm(f => ({ ...f, package: selectedPackage.name }))
  }, [selectedPackage])

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())  e.fullName  = 'Full name is required'
    if (!form.phone.trim())     e.phone     = 'Phone number is required'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'
    if (!form.email.trim())     e.email     = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.eventType)        e.eventType = 'Please select an event type'
    if (!form.eventDate)        e.eventDate = 'Event date is required'
    if (!form.location.trim())  e.location  = 'Event location is required'
    if (!form.package)          e.package   = 'Please select a package'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setStatus('loading')
    try {
      // 1. Upsert customer (by email)
      const { data: customer, error: custErr } = await supabase
        .from('customers')
        .upsert(
          { full_name: form.fullName, phone: form.phone, email: form.email },
          { onConflict: 'email', ignoreDuplicates: false }
        )
        .select('id')
        .single()

      if (custErr) throw custErr

      // 2. Insert booking
      const bookingPayload = {
        customer_id:  customer?.id ?? null,
        full_name:    form.fullName,
        phone:        form.phone,
        email:        form.email,
        event_type:   form.eventType,
        event_date:   form.eventDate,
        location:     form.location,
        package_name: form.package,
        requirements: form.requirements || null,
        status:       'pending',
      }

      const { data: booking, error: bookErr } = await supabase
        .from('bookings')
        .insert(bookingPayload)
        .select()
        .single()

      if (bookErr) throw bookErr

      // 3. Trigger Edge Function for confirmation emails (non-blocking)
      supabase.functions
        .invoke('booking-confirmation', { body: { booking } })
        .catch(err => console.warn('Email notification error:', err))

      setStatus('success')
      setForm(defaultForm)
    } catch (err) {
      console.error('Booking submission error:', err)
      setStatus('error')
      setErrorMsg(
        err?.message ||
        'Submission failed. Please email us directly at hello@editorsbrand.in or call us.'
      )
    }
  }

  const content = (
    <div
      style={{
        background: '#0F0F0F',
        width: '100%',
        maxWidth: inline ? '100%' : '680px',
        maxHeight: inline ? 'none' : '90vh',
        overflowY: 'auto',
        borderRadius: inline ? 0 : '4px',
        border: inline ? 'none' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Header (modal only) */}
      {!inline && (
        <div style={{
          padding: '28px 32px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: '#0F0F0F',
          zIndex: 2,
        }}>
          <div>
            <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FF351F', marginBottom: '4px' }}>Booking Enquiry</p>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Book Your Reel Maker</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>
      )}

      <div style={{ padding: inline ? '0' : '32px' }}>
        {/* Success */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <CheckCircle size={56} style={{ color: '#FF351F' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Booking Received!</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#A0A0A0', lineHeight: 1.7, maxWidth: '400px' }}>
                Thank you! Our team will review your enquiry and contact you within 24 hours.
                A confirmation email has been sent to your inbox.
              </p>
              <button onClick={() => { setStatus('idle'); if (onClose) onClose() }} className="btn-primary" style={{ marginTop: '8px' }}>
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error banner */}
        {status === 'error' && (
          <div style={{ background: 'rgba(255,53,31,0.1)', border: '1px solid rgba(255,53,31,0.3)', borderRadius: '2px', padding: '14px 16px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertCircle size={18} style={{ color: '#FF351F', flexShrink: 0 }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#FF351F' }}>{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-grid">
              <Field label="Full Name *" error={errors.fullName}>
                <input className="form-input" type="text" placeholder="Your full name" value={form.fullName} onChange={handleChange('fullName')} autoComplete="name" />
              </Field>
              <Field label="Phone Number *" error={errors.phone}>
                <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange('phone')} autoComplete="tel" />
              </Field>
              <Field label="Email Address *" error={errors.email}>
                <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange('email')} autoComplete="email" />
              </Field>
              <Field label="Event Type *" error={errors.eventType}>
                <select className="form-input" value={form.eventType} onChange={handleChange('eventType')}>
                  <option value="">Select event type</option>
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Event Date *" error={errors.eventDate}>
                <input className="form-input" type="date" value={form.eventDate} onChange={handleChange('eventDate')} min={new Date().toISOString().split('T')[0]} style={{ colorScheme: 'dark' }} />
              </Field>
              <Field label="Event Location *" error={errors.location}>
                <input className="form-input" type="text" placeholder="City, Venue" value={form.location} onChange={handleChange('location')} />
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Selected Package *" error={errors.package}>
                  <select className="form-input" value={form.package} onChange={handleChange('package')}>
                    <option value="">Select a package</option>
                    {packages.map(p => (
                      <option key={p.id} value={p.name}>{p.code} – {p.name} (₹{p.price.toLocaleString('en-IN')})</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Additional Requirements">
                  <textarea className="form-input" placeholder="Tell us anything specific about your event..." value={form.requirements} onChange={handleChange('requirements')} rows={4} style={{ resize: 'vertical', minHeight: '100px' }} />
                </Field>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button type="submit" className="btn-primary" disabled={status === 'loading'}
                style={{ width: '100%', justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1, gap: '10px' }}>
                {status === 'loading' ? (
                  <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                ) : 'Book Your Reel Maker'}
              </button>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#A0A0A0', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>
                By submitting, you agree to our terms. We'll contact you within 24 hours.
              </p>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @media (max-width: 540px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )

  if (inline) return content

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {content}
      </motion.div>
    </motion.div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
