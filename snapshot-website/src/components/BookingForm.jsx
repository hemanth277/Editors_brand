import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle, Loader, X, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CONTENT_TYPES = [
  'Instagram Reels & YouTube Shorts',
  'Brand Promotional Videos',
  'Business & Corporate Video Editing',
  'Video Editing & Post-Production',
  'Digital Invitations',
  'Monthly Content Retainer',
  'Full Brand Campaign',
]

const BUDGET_RANGES = [
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹2,50,000',
  '₹2,50,000+',
  'Custom Enterprise Scope',
]

const defaultForm = {
  fullName: '',
  email: '',
  phone: '',
  brandName: '',
  contentType: '',
  package: '',
  preferredDate: '',
  budget: '',
  description: '',
}

export default function BookingForm({ selectedPackage = null, onClose = null, inline = true }) {
  const [form, setForm] = useState(defaultForm)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errors, setErrors] = useState({})
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (selectedPackage) {
      setForm(f => ({
        ...f,
        package: selectedPackage.name,
      }))
    }
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
    setErrorMsg('')

    try {
      let customerId = null

      // Safe customer lookup or insert without failing on ON CONFLICT constraint
      try {
        const { data: existingCustomers } = await supabase
          .from('customers')
          .select('id')
          .eq('email', form.email.trim().toLowerCase())
          .limit(1)

        if (existingCustomers && existingCustomers.length > 0) {
          customerId = existingCustomers[0].id
        } else {
          const { data: newCust, error: insertCustErr } = await supabase
            .from('customers')
            .insert({
              full_name: form.fullName.trim(),
              phone: form.phone.trim(),
              email: form.email.trim().toLowerCase(),
            })
            .select('id')
            .single()

          if (!insertCustErr && newCust) {
            customerId = newCust.id
          }
        }
      } catch (custErr) {
        console.warn('Customer record note (continuing booking creation):', custErr)
      }

      // Format description and metadata for requirements / notes
      const structuredRequirements = [
        form.brandName ? `Brand: ${form.brandName.trim()}` : '',
        form.budget ? `Budget: ${form.budget}` : '',
        form.preferredDate ? `Target Date: ${form.preferredDate}` : '',
        form.description ? `Project Scope: ${form.description.trim()}` : '',
      ].filter(Boolean).join(' | ')

      // Insert into 'bookings' table
      const bookingPayload = {
        customer_id:  customerId,
        full_name:    form.fullName.trim(),
        phone:        form.phone.trim(),
        email:        form.email.trim().toLowerCase(),
        event_type:   form.contentType, // maps content type
        event_date:   form.preferredDate || new Date().toISOString().split('T')[0],
        location:     form.brandName?.trim() || 'Digital / Remote Project',
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

      // Optional edge function notification if deployed
      try {
        supabase.functions
          .invoke('booking-confirmation', { body: { booking } })
          .catch(err => console.warn('Email notification status:', err))
      } catch {
        // ignore edge function invocation error
      }

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
        padding: 'clamp(28px, 5vw, 48px)',
        position: 'relative',
      }}
    >
      {/* Close button for modal */}
      {!inline && onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#A0A0A0',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#FF351F',
          marginBottom: '8px',
        }}>
          Direct Project Inquiry
        </p>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.15,
        }}>
          Tell Us About Your Vision.
        </h2>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          color: '#A0A0A0',
          marginTop: '8px',
        }}>
          Our creative directors will evaluate your requirements and reach out within 24 hours.
        </p>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'rgba(0, 200, 100, 0.08)',
              border: '1px solid rgba(0, 200, 100, 0.3)',
              borderRadius: '2px',
              padding: '24px',
              marginBottom: '32px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(0,200,100,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Check size={20} style={{ color: '#00c864' }} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#fff', marginBottom: '4px' }}>
                Inquiry Received Successfully!
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#A0A0A0', lineHeight: 1.6 }}>
                Thank you for choosing SNAPSHOT. A dedicated creative director will review your brief and contact you shortly with concept plans and pricing proposals.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error banner */}
      {status === 'error' && (
        <div style={{
          background: 'rgba(255, 53, 31, 0.08)',
          border: '1px solid rgba(255, 53, 31, 0.3)',
          borderRadius: '2px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <AlertCircle size={18} style={{ color: '#FF351F', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#FF351F', margin: 0 }}>
            {errorMsg}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
        className="booking-form-grid">

          {/* Full Name */}
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={form.fullName}
              onChange={handleChange('fullName')}
              className="form-input"
              style={{ borderColor: errors.fullName ? '#FF351F' : undefined }}
            />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>

          {/* Business / Brand Name */}
          <div>
            <label className="form-label">Business / Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Apex Apparel / Creator Channel"
              value={form.brandName}
              onChange={handleChange('brandName')}
              className="form-input"
            />
          </div>

          {/* Email */}
          <div>
            <label className="form-label">Business Email *</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange('email')}
              className="form-input"
              style={{ borderColor: errors.email ? '#FF351F' : undefined }}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="form-label">Phone / WhatsApp Number *</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange('phone')}
              className="form-input"
              style={{ borderColor: errors.phone ? '#FF351F' : undefined }}
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          {/* Type of Content Required */}
          <div>
            <label className="form-label">Type of Content Required *</label>
            <select
              value={form.contentType}
              onChange={handleChange('contentType')}
              className="form-select"
              style={{ borderColor: errors.contentType ? '#FF351F' : undefined }}
            >
              <option value="">Select content type...</option>
              {CONTENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.contentType && <p className="form-error">{errors.contentType}</p>}
          </div>

          {/* Preferred Budget */}
          <div>
            <label className="form-label">Preferred Budget Range</label>
            <select
              value={form.budget}
              onChange={handleChange('budget')}
              className="form-select"
            >
              <option value="">Select budget range...</option>
              {BUDGET_RANGES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Preferred Project Date */}
          <div>
            <label className="form-label">Target Completion / Shoot Date</label>
            <input
              type="date"
              value={form.preferredDate}
              onChange={handleChange('preferredDate')}
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
            />
          </div>

          {/* Package Selection */}
          <div>
            <label className="form-label">Selected Package (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Professional Content Package"
              value={form.package}
              onChange={handleChange('package')}
              className="form-input"
            />
          </div>

          {/* Project Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Project Brief & Details</label>
            <textarea
              rows={4}
              placeholder="Tell us about your brand vision, target audience, specific deliverables, or references..."
              value={form.description}
              onChange={handleChange('description')}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Submit button */}
        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary"
            style={{
              padding: '14px 40px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            {status === 'loading' ? (
              <>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Submitting Brief...
              </>
            ) : (
              <>
                <Send size={15} />
                Submit Project Inquiry
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .booking-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )

  if (inline) return content

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      {content}
    </div>
  )
}
