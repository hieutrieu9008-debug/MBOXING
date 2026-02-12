import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://nwxktguteksrnkxqkgjc.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eGt0Z3V0ZWtzcm5reHFrZ2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjU1NzAsImV4cCI6MjA4NTY0MTU3MH0.EOJHsREzQs--UuD4py-nBthSIh6EVNRiZC9QlWAkNGI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
