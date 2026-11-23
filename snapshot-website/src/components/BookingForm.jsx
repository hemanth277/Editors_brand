import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Loader, Send } from 'lucide-react'
import { usePricing } from '../hooks/usePricing'
import { supabase } from '../lib/supabase'

const contentTypes = [
  'Instagram Reels & YouTube Shorts',
  'Brand Promotional Videos',
  'Business / Corporate Video Content',
  'Video Editing & Post-Production',
  'Digital Invitations & Motion Teasers',
  'Product Showcase & Commercial Shoots',
  'Full Agency Monthly Retainer',
  'Other / Custom Project',
]

const budgetRanges = [
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000+',
  'Flexible / Open to Consultation',
]

const defaultForm = {
  fullName: '',
  email: '',
  phone: '',
  brandName: '',
  contentType: '',
  package: '',
  budget: '',
  preferredDate: '',
  description: '',
}

export default function BookingForm({ selectedPackage, onClose, inline = false }) {
  const [form, setForm]         = useState({ ...defaultForm, package: selectedPackage?.name || '' })
  const [errors, setErrors]     = useState({})
  const [status, setStatus]     = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const { packages }            = usePricing()

  useEffect(() => {
    if (selectedPackage) setForm(f => ({ ...f, package: selectedPackage.name }))
  }, [selectedPackage])

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())   e.fullName    = 'Full name is required'
    if (!form.email.trim())      e.email       = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid business email'
    if (!form.phone.trim())      e.phone       = 'Phone / WhatsApp number is required'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'
    if (!form.contentType)       e.contentType = 'Please select content type'
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
      // 1. Upsert customer in existing 'customers' table
      const { data: customer, error: custErr } = await supabase
        .from('customers')
        .upsert(
          { full_name: form.fullName, phone: form.phone, email: form.email },
          { onConflict: 'email', ignoreDuplicates: false }
        )
        .select('id')
        .single()

      if (custErr) throw custErr

      // Format description and metadata for requirements / notes
      const structuredRequirements = [
        form.brandName ? `Brand: ${form.brandName}` : '',
        form.budget ? `Budget: ${form.budget}` : '',
        form.preferredDate ? `Target Date: ${form.preferredDate}` : '',
        form.description ? `Project Scope: ${form.description}` : '',
      ].filter(Boolean).join(' | ')

      // 2. Insert into existing 'bookings' table (safe compatibility)
      const bookingPayload = {
        customer_id:  customer?.id ?? null,
        full_name:    form.fullName,
        phone:        form.phone,
        email:        form.email,
        event_type:   form.contentType, // maps content type
        event_date:   form.preferredDate || new Date().toISOString().split('T')[0],
        location:     form.brandName || 'Digital / Remote Project',
        package_name: form.package || 'Custom Content Package',
        requirements: structuredRequirements || null,
        status:       'pending',
      }

      const { data: booking, error: bookErr } = await supabase
        .from('bookings')
        .insert(bookingPayload)
        .select()
        .single()

      if (bookErr) throw bookErr

      // Optional edge function notification
      supabase.functions
        .invoke('booking-confirmation', { body: { booking } })
        .catch(err => console.warn('Email notification status:', err))

      setStatus('success')
      setForm(defaultForm)
    } catch (err) {
      console.error('Project inquiry error:', err)
      setStatus('error')
      setErrorMsg(
        err?.message ||
        'Submission failed. Please email us directly at hello@snapshotagency.in or message us on WhatsApp.'
      )
    }
  }

  const content = (
    <div
      style={{
        background: '#0F0F0F',
        width: '100%',
        maxWidth: inline ? '100%' : '720px',
        maxHeight: inline ? 'none' : '90vh',
        overflowY: 'auto',
        borderRadius: inline ? '4px' : '6px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: inline ? 'none' : '0 20px 60px rgba(0,0,0,0.8)',
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
            <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FF351F', marginBottom: '4px' }}>
              Project Inquiry
            </p>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
              Start a Creative Project with SNAPSHOT
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>
      )}

      <div style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
        {/* Success */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <CheckCircle size={56} style={{ color: '#FF351F' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
                Inquiry Received!
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#A0A0A0', lineHeight: 1.7, maxWidth: '440px' }}>
                Thank you for reaching out to SNAPSHOT Studio. Our creative director will review your brief and contact you within 24 hours with an actionable roadmap.
              </p>
              <button onClick={() => { setStatus('idle'); if (onClose) onClose() }} className="btn-primary" style={{ marginTop: '8px' }}>
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error banner */}
        {status === 'error' && (
          <div style={{ background: 'rgba(255,53,31,0.1)', border: '1px solid rgba(255,53,31,0.3)', borderRadius: '4px', padding: '14px 16px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertCircle size={18} style={{ color: '#FF351F', flexShrink: 0 }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#FF351F' }}>{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-grid">
              <Field label="Full Name *" error={errors.fullName}>
                <input className="form-input" type="text" placeholder="Alex Morgan" value={form.fullName} onChange={handleChange('fullName')} autoComplete="name" />
              </Field>

              <Field label="Business / Brand Name" error={errors.brandName}>
                <input className="form-input" type="text" placeholder="e.g. Acme Lifestyle / Personal Brand" value={form.brandName} onChange={handleChange('brandName')} />
              </Field>

              <Field label="Email Address *" error={errors.email}>
                <input className="form-input" type="email" placeholder="alex@brand.com" value={form.email} onChange={handleChange('email')} autoComplete="email" />
              </Field>

              <Field label="Phone / WhatsApp *" error={errors.phone}>
                <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange('phone')} autoComplete="tel" />
              </Field>

              <Field label="Type of Content Required *" error={errors.contentType}>
                <select className="form-input" value={form.contentType} onChange={handleChange('contentType')}>
                  <option value="">Select service format</option>
                  {contentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="Pricing Package (Optional)">
                <select className="form-input" value={form.package} onChange={handleChange('package')}>
                  <option value="">Select a package or Custom</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.name}>{p.name} (₹{Number(p.price).toLocaleString('en-IN')})</option>
                  ))}
                  <option value="Custom Content Package">Custom Content Package (Bespoke)</option>
                </select>
              </Field>

              <Field label="Preferred Budget">
                <select className="form-input" value={form.budget} onChange={handleChange('budget')}>
                  <option value="">Select budget range</option>
                  {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>

              <Field label="Preferred Project / Launch Date">
                <input className="form-input" type="date" value={form.preferredDate} onChange={handleChange('preferredDate')} min={new Date().toISOString().split('T')[0]} style={{ colorScheme: 'dark' }} />
              </Field>

              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Project Description & Creative Goals">
                  <textarea className="form-input" placeholder="Tell us about your brand, campaign goals, target platforms, or reference styles..." value={form.description} onChange={handleChange('description')} rows={4} style={{ resize: 'vertical', minHeight: '100px' }} />
                </Field>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={status === 'loading'}
                style={{ width: '100%', justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1, gap: '10px' }}
              >
                {status === 'loading' ? (
                  <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting Brief...</>
                ) : (
                  <><Send size={16} /> Submit Project Inquiry</>
                )}
              </button>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#A0A0A0', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>
                Strict confidentiality. Our team responds with creative suggestions within 24 hours.
              </p>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
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
        style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
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
