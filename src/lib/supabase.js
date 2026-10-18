import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_RESUMATE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_RESUMATE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env variables. Check .env.local / Vercel settings.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)