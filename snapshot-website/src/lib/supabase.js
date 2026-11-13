import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  console.warn(
    '[Supabase] Missing env vars VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.\n' +
    'Copy .env.example → .env and fill in your project credentials.'
  )
}

export const supabase = createClient(
  supabaseUrl  || '',
  supabaseAnon || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession:   true,
      detectSessionInUrl: true,
    },
  }
)

export default supabase
