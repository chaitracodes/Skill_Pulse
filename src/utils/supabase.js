import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient;

try {
  if (supabaseUrl && supabaseUrl.startsWith('http')) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Fallback for missing or invalid keys to prevent app crash
    console.warn('Supabase URL is missing or invalid. Auth will be disabled/mocked.');
    supabaseClient = {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: { message: "Auth keys not configured." } }),
        signInWithOAuth: async () => ({ error: { message: "Social login requires Supabase keys to be configured in .env" } }),
        signUp: async () => ({ error: { message: "Auth keys not configured." } }),
        signOut: async () => ({ error: null }),
      }
    };
  }
} catch (e) {
  console.error("Supabase init error:", e);
  supabaseClient = { auth: {} };
}

export const supabase = supabaseClient;
