import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient>;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase is not configured. Please provide SUPABASE_URL and SUPABASE_ANON_KEY environment variables. Auth features will be disabled.");
    // Provide a mock object so the app doesn't crash
    supabase = {} as ReturnType<typeof createClient>;
}

export { supabase };