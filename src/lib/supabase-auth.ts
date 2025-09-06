import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Custom hook for authenticated Supabase client
export function useSupabaseClient() {
  const { getToken } = useAuth();
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        const token = await getToken({ template: 'supabase' });
        
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        
        return fetch(url, options);
      },
    },
  });

  return supabase;
}
