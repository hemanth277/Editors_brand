// Supabase Edge Function – booking-confirmation
// Deploy: supabase functions deploy booking-confirmation
//
// This function is called after a booking is inserted.
// It sends a confirmation email to the customer and a
// notification email to the admin using Resend (free tier).
// Replace RESEND_API_KEY in Supabase Secrets.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { booking } = await req.json()

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const ADMIN_EMAIL    = Deno.env.get('ADMIN_EMAIL') || 'hello@editorsbrand.in'
    const FROM_EMAIL     = Deno.env.get('FROM_EMAIL')  || 'noreply@editorsbrand.in'

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set in Supabase Secrets')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Customer confirmation email ──────────────────────────
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `EDITORS BRAND <${FROM_EMAIL}>`,
        to:   [booking.email],
        subject: '✅ Booking Received – EDITORS BRAND',
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#fff;padding:40px;border-radius:8px;">
            <h1 style="font-family:Georgia,serif;color:#FF351F;font-size:2rem;margin-bottom:8px;">EDITORS BRAND</h1>
            <p style="color:#A0A0A0;font-size:0.85rem;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px;">
              Premium Reel Maker Booking
            </p>
            <h2 style="color:#fff;font-family:Georgia,serif;font-size:1.5rem;margin-bottom:16px;">
              Booking Received!
            </h2>
            <p style="color:#A0A0A0;line-height:1.7;margin-bottom:32px;">
              Hi <strong style="color:#fff">${booking.full_name}</strong>, thank you for choosing EDITORS BRAND!
              We've received your booking enquiry and will confirm within <strong style="color:#fff">24 hours</strong>.
            </p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
              <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A0A0A0;font-size:0.85rem;">Event Type</td>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;text-align:right;">${booking.event_type}</td></tr>
              <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A0A0A0;font-size:0.85rem;">Event Date</td>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;text-align:right;">${booking.event_date}</td></tr>
              <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A0A0A0;font-size:0.85rem;">Location</td>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;text-align:right;">${booking.location}</td></tr>
              <tr><td style="padding:12px 0;color:#A0A0A0;font-size:0.85rem;">Package</td>
                  <td style="padding:12px 0;color:#FF351F;text-align:right;font-weight:600;">${booking.package_name}</td></tr>
            </table>
            <p style="color:#A0A0A0;font-size:0.8rem;line-height:1.6;">
              For any queries, reach us at <a href="mailto:${ADMIN_EMAIL}" style="color:#FF351F;">${ADMIN_EMAIL}</a>
            </p>
            <p style="color:rgba(255,255,255,0.2);font-size:0.75rem;margin-top:32px;">
              © 2026 EDITORS BRAND. All Rights Reserved.
            </p>
          </div>
        `,
      }),
    })

    // ── Admin notification email ─────────────────────────────
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `EDITORS BRAND System <${FROM_EMAIL}>`,
        to:   [ADMIN_EMAIL],
        subject: `🔔 New Booking: ${booking.full_name} – ${booking.event_type}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
            <h2 style="color:#FF351F;">New Booking Received</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#666;">Name</td>      <td style="padding:8px 0;font-weight:600;">${booking.full_name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Phone</td>     <td style="padding:8px 0;">${booking.phone}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Email</td>     <td style="padding:8px 0;">${booking.email}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Event</td>     <td style="padding:8px 0;">${booking.event_type}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Date</td>      <td style="padding:8px 0;">${booking.event_date}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Location</td>  <td style="padding:8px 0;">${booking.location}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Package</td>   <td style="padding:8px 0;color:#FF351F;font-weight:600;">${booking.package_name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Notes</td>     <td style="padding:8px 0;">${booking.requirements || '—'}</td></tr>
            </table>
          </div>
        `,
      }),
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
