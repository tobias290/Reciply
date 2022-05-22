import { createClient } from '@supabase/supabase-js'

// TODO: FIX
// TODO: Consider using netlify functions for fetch the data, that way we can use "process.env"
const supabaseUrl = __api.env.SVELTE_APP_SUPABASE_URL || "https://nrbsquegfdnrsjcfabyp.supabase.co"
const supabaseAnonKey = __api.env.SVELTE_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTc0NjI3OSwiZXhwIjoxOTU1MzIyMjc5fQ.xkXfbAvVwRsrcz0on2Uj9kstj3WE8h_c7bo121E_PJI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
