import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase is not configured. Please provide SUPABASE_URL and SUPABASE_ANON_KEY environment variables. Auth features will be disabled.");
    
    const notConfiguredError = { name: 'NotConfiguredError', message: "Supabase is not configured on the server." };

    // Provide a comprehensive mock object so the app doesn't crash on undefined method calls.
    supabase = {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
                // Immediately call back with a null session to reflect the unauthenticated state.
                callback('INITIAL_SESSION', null);
                return { data: { subscription: { unsubscribe: () => {} } } };
            },
            signUp: async () => ({ data: { user: null, session: null }, error: notConfiguredError }),
            signInWithPassword: async () => ({ data: { user: null, session: null }, error: notConfiguredError }),
            signOut: async () => ({ error: null }),
            resetPasswordForEmail: async () => ({ data: {}, error: notConfiguredError }),
            updateUser: async () => ({ data: { user: null }, error: notConfiguredError })
        },
        storage: {
            from: (_bucket: string) => ({
                upload: async () => ({ data: null, error: notConfiguredError }),
                getPublicUrl: (_path: string) => ({ data: { publicUrl: '' } })
            })
        }
    } as unknown as SupabaseClient;
}

export { supabase };