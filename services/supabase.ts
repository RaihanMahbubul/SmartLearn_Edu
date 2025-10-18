import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';

// Extend the Window interface to include our new config object for TypeScript
declare global {
  interface Window {
    APP_CONFIG: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      API_KEY: string;
    }
  }
}

const supabaseUrl = window.APP_CONFIG?.SUPABASE_URL;
const supabaseAnonKey = window.APP_CONFIG?.SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

// Check if the keys are the placeholder values
const isConfigured = supabaseUrl && supabaseAnonKey && 
                   !supabaseUrl.startsWith('PASTE_YOUR_') && 
                   !supabaseAnonKey.startsWith('PASTE_YOUR_');


if (isConfigured) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase is not configured. Please paste your keys into the APP_CONFIG object in index.html. Auth features will be disabled.");
    
    const notConfiguredError = { name: 'NotConfiguredError', message: "Supabase is not configured. Please check index.html." };

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