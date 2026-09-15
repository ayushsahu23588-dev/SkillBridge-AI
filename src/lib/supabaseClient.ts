import { createClient, SupabaseClient, Session, User as SupabaseUser } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const url = metaEnv?.VITE_SUPABASE_URL || '';
  const anonKey = metaEnv?.VITE_SUPABASE_ANON_KEY || '';
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const url = metaEnv?.VITE_SUPABASE_URL || '';
  const anonKey = metaEnv?.VITE_SUPABASE_ANON_KEY || '';

  if (url && anonKey) {
    try {
      supabaseClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
    }
  }

  return supabaseClient;
}

export const supabase = {
  get client(): SupabaseClient | null {
    return getSupabase();
  },
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    const client = getSupabase();
    if (!client) {
      return { ok: false, message: 'Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) not configured.' };
    }
    try {
      const { error } = await client.from('opportunities').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        return { ok: false, message: `Connected to Supabase, but query failed: ${error.message}` };
      }
      return { ok: true, message: 'Successfully connected to Supabase backend!' };
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Network error connecting to Supabase' };
    }
  },
  auth: {
    async signUp(email: string, password: string, metadata?: Record<string, any>) {
      const client = getSupabase();
      if (!client) return { data: { user: null, session: null }, error: new Error('Supabase not configured') };
      return client.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
    },
    async signInWithPassword(email: string, password: string) {
      const client = getSupabase();
      if (!client) return { data: { user: null, session: null }, error: new Error('Supabase not configured') };
      return client.auth.signInWithPassword({
        email,
        password,
      });
    },
    async signOut() {
      const client = getSupabase();
      if (client) {
        try {
          await client.auth.signOut();
        } catch (err) {
          console.warn('Supabase auth.signOut error:', err);
        }
      }
    },
    async getSession(): Promise<Session | null> {
      const client = getSupabase();
      if (client) {
        try {
          const { data } = await client.auth.getSession();
          return data.session;
        } catch (err) {
          console.warn('Supabase getSession error:', err);
        }
      }
      return null;
    },
    async getUser(): Promise<SupabaseUser | null> {
      const client = getSupabase();
      if (client) {
        try {
          const { data } = await client.auth.getUser();
          return data.user;
        } catch (err) {
          console.warn('Supabase getUser error:', err);
        }
      }
      return null;
    },
    async resetPasswordForEmail(email: string) {
      const client = getSupabase();
      if (!client) return { data: {}, error: new Error('Supabase not configured') };
      return client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
    },
    async updateUser(attributes: { password?: string; data?: Record<string, any> }) {
      const client = getSupabase();
      if (!client) return { data: { user: null }, error: new Error('Supabase not configured') };
      return client.auth.updateUser(attributes);
    },
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
      const client = getSupabase();
      if (!client) return { data: { subscription: { unsubscribe: () => {} } } };
      return client.auth.onAuthStateChange(callback);
    },
  },
};

