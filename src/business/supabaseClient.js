import { createClient } from '@supabase/supabase-js'

// TODO: FIX
const supabaseUrl = __api.env.SVELTE_APP_SUPABASE_URL || process.env.SVELTE_APP_SUPABASE_URL
const supabaseAnonKey = __api.env.SVELTE_APP_SUPABASE_ANON_KEY || process.env.SVELTE_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
