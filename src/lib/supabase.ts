import { createClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

const env = (import.meta as ImportMeta & {
  env: {
    VITE_SUPABASE_URL?: string
    VITE_SUPABASE_PUBLISHABLE_KEY?: string
    VITE_SUPABASE_ANON_KEY?: string
  }
}).env

const supabaseUrl = env.VITE_SUPABASE_URL ?? ''
const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

export function hasSupabaseConfig() {
  return Boolean(env.VITE_SUPABASE_URL && (env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY))
}