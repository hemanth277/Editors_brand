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
  brandName: '',
  email: '',
  phone: '',
  contentType: '',
  budget: '',
  preferredDate: '',
  package: '',
  description: '',
}

const darkFieldStyle = {
  backgroundColor: '#121212',
  background: '#121212',
  color: '#FFFFFF',
  border: '1px solid rgba(255, 255, 255, 0.14)',
  borderRadius: '4px',
  colorScheme: 'dark',
}

const darkSelectStyle = {
  ...darkFieldStyle,
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%23A0A0A0' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  paddingRight: '42px',
  cursor: 'pointer',
}

const darkTextareaStyle = {
  ...darkFieldStyle,
  resize: 'vertical',
  minHeight: '110px',
  WebkitAppearance: 'none',
  appearance: 'none',
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
    if (!form.email.trim())      e.email       = 'Business email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid business email'
    if (!form.phone.trim())      e.phone       = 'Phone / WhatsApp number is required'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'
    if (!form.contentType)       e.contentType = 'Please select type of content required'
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
      // 1. Insert customer record in customers table (fire-and-forget for client linking)
      try {
        await supabase
          .from('customers')
          .insert([{
            full_name: form.fullName.trim(),
            phone: form.phone.trim(),
            email: form.email.trim().toLowerCase(),
          }])
      } catch (custErr) {
        console.warn('[BookingForm] Customer insert note:', custErr)
      }

      // 2. Format structured project requirements with all 10 fields preserved
      const structuredRequirements = [
        form.brandName?.trim() ? `Brand Name: ${form.brandName.trim()}` : '',
        form.budget ? `Budget: ${form.budget}` : '',
        form.preferredDate ? `Target Date: ${form.preferredDate}` : '',
        form.package?.trim() ? `Package: ${form.package.trim()}` : '',
        form.description?.trim() ? `Brief: ${form.description.trim()}` : '',
      ].filter(Boolean).join(' | ')

      // 3. Insert into Supabase 'bookings' table
      const bookingPayload = {
        full_name:    form.fullName.trim(),
        phone:        form.phone.trim(),
        email:        form.email.trim().toLowerCase(),
        event_type:   form.contentType,
        event_date:   form.preferredDate || new Date().toISOString().split('T')[0],
        location:     form.brandName?.trim() || 'Direct Project',
        package_name: form.package?.trim() || 'Custom Content Package',
        requirements: structuredRequirements || (form.description?.trim() || null),
        status:       'pending', // matches database check constraint ('pending','confirmed','completed','cancelled')
      }

      const { error: bookErr } = await supabase
        .from('bookings')
        .insert([bookingPayload])

      if (bookErr) throw bookErr

      setStatus('success')
      setForm(defaultForm)
    } catch (err) {
      console.error('[BookingForm] Submission error:', err)
      setStatus('error')
      setErrorMsg(
        err?.message ||
        'Unable to submit your inquiry at this moment. Please email us directly at hello@snapshotagency.in or call +91 98765 43210.'
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
        borderRadius: inline ? '6px' : '8px',
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
              borderRadius: '4px',
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
                Thank you for choosing SNAPSHOT. Your enquiry has been registered and our team has been notified. We will review your brief and contact you shortly.
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
          borderRadius: '4px',
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
      <form onSubmit={handleSubmit} noValidate className="project-enquiry-form">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
        className="booking-form-grid project-enquiry-grid">

          {/* 1. Full Name */}
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={form.fullName}
              onChange={handleChange('fullName')}
              className="form-input project-enquiry-input"
              style={{
                ...darkFieldStyle,
                borderColor: errors.fullName ? '#FF351F' : 'rgba(255,255,255,0.14)',
              }}
            />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>

          {/* 2. Business / Brand Name */}
          <div>
            <label className="form-label">Business / Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Apex Apparel / Creator Studio"
              value={form.brandName}
              onChange={handleChange('brandName')}
              className="form-input project-enquiry-input"
              style={darkFieldStyle}
            />
          </div>

          {/* 3. Business Email */}
          <div>
            <label className="form-label">Business Email *</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange('email')}
              className="form-input project-enquiry-input"
              style={{
                ...darkFieldStyle,
                borderColor: errors.email ? '#FF351F' : 'rgba(255,255,255,0.14)',
              }}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* 4. Phone / WhatsApp Number */}
          <div>
            <label className="form-label">Phone / WhatsApp Number *</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange('phone')}
              className="form-input project-enquiry-input"
              style={{
                ...darkFieldStyle,
                borderColor: errors.phone ? '#FF351F' : 'rgba(255,255,255,0.14)',
              }}
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          {/* 5. Type of Content Required */}
          <div>
            <label className="form-label">Type of Content Required *</label>
            <select
              value={form.contentType}
              onChange={handleChange('contentType')}
              className="form-select project-enquiry-select"
              style={{
                ...darkSelectStyle,
                borderColor: errors.contentType ? '#FF351F' : 'rgba(255,255,255,0.14)',
              }}
            >
              <option value="" style={{ backgroundColor: '#121212', color: '#FFFFFF' }}>Select content type...</option>
              {CONTENT_TYPES.map(type => (
                <option key={type} value={type} style={{ backgroundColor: '#121212', color: '#FFFFFF' }}>{type}</option>
              ))}
            </select>
            {errors.contentType && <p className="form-error">{errors.contentType}</p>}
          </div>

          {/* 6. Preferred Budget Range */}
          <div>
            <label className="form-label">Preferred Budget Range</label>
            <select
              value={form.budget}
              onChange={handleChange('budget')}
              className="form-select project-enquiry-select"
              style={darkSelectStyle}
            >
              <option value="" style={{ backgroundColor: '#121212', color: '#FFFFFF' }}>Select budget range...</option>
              {BUDGET_RANGES.map(b => (
                <option key={b} value={b} style={{ backgroundColor: '#121212', color: '#FFFFFF' }}>{b}</option>
              ))}
            </select>
          </div>

          {/* 7. Target Completion / Shoot Date */}
          <div>
            <label className="form-label">Target Completion / Shoot Date</label>
            <input
              type="date"
              value={form.preferredDate}
              onChange={handleChange('preferredDate')}
              min={new Date().toISOString().split('T')[0]}
              className="form-input project-enquiry-input"
              style={darkFieldStyle}
            />
          </div>

          {/* 8. Selected Package */}
          <div>
            <label className="form-label">Selected Package (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Professional Content Package"
              value={form.package}
              onChange={handleChange('package')}
              className="form-input project-enquiry-input"
              style={darkFieldStyle}
            />
          </div>

          {/* 9. Project Brief & Details */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Project Brief & Details</label>
            <textarea
              rows={4}
              placeholder="Tell us about your brand vision, target audience, specific deliverables, or references..."
              value={form.description}
              onChange={handleChange('description')}
              className="form-textarea project-enquiry-textarea"
              style={darkTextareaStyle}
            />
          </div>
        </div>

        {/* 10. Submit button */}
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

        /* Direct High-Specificity Styling to eliminate ANY white backgrounds */
        .project-enquiry-form input,
        .project-enquiry-form select,
        .project-enquiry-form textarea,
        .project-enquiry-form .form-input,
        .project-enquiry-form .form-select,
        .project-enquiry-form .form-textarea {
          background-color: #121212 !important;
          background: #121212 !important;
          color: #FFFFFF !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          border-radius: 4px !important;
          color-scheme: dark !important;
        }

        .project-enquiry-form select,
        .project-enquiry-form .form-select {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%23A0A0A0' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 16px center !important;
          padding-right: 42px !important;
          cursor: pointer !important;
        }

        .project-enquiry-form select::-ms-expand,
        select.form-select::-ms-expand {
          display: none !important;
        }

        .project-enquiry-form select option {
          background-color: #121212 !important;
          background: #121212 !important;
          color: #FFFFFF !important;
        }

        .project-enquiry-form textarea,
        .project-enquiry-form .form-textarea {
          -webkit-appearance: none !important;
          appearance: none !important;
          resize: vertical !important;
        }

        .project-enquiry-form input::placeholder,
        .project-enquiry-form textarea::placeholder {
          color: #777777 !important;
          opacity: 1 !important;
        }

        .project-enquiry-form input:focus,
        .project-enquiry-form select:focus,
        .project-enquiry-form textarea:focus {
          background-color: #161616 !important;
          background: #161616 !important;
          color: #FFFFFF !important;
          outline: none !important;
          border-color: #FF351F !important;
          box-shadow: 0 0 0 1px rgba(255, 53, 31, 0.4) !important;
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
