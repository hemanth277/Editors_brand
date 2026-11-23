import { createClient } from '@supabase/supabase-js'

// Safe default fallback to project's Supabase credentials if Vercel env vars are not set
const DEFAULT_SUPABASE_URL = 'https://gjvcwcfkjpvdkzyqkleu.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_uj1xYQgK5wDa5FSJOP6gPg_yvthhZkj'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseAnon,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

export default supabase
