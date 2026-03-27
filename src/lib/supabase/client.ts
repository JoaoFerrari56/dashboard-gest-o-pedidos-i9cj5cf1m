import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Ensure we have fallbacks to prevent runtime crashes if env vars are temporarily unavailable.
// The actual variables MUST be set in .env for real connectivity.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.dummy'

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error(
    '⚠️ VITE_SUPABASE_URL is missing. Please check your environment variables to ensure proper authentication functionality.',
  )
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
