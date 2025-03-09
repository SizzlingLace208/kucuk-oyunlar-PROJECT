import { SupabaseClient } from '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  import { Database } from './database';

  export interface SupabaseClient<T = any> {
    from<Table extends keyof Database['public']['Tables']>(
      table: Table
    ): {
      select: (columns?: string) => Promise<{ data: Database['public']['Tables'][Table]['Row'][]; error: Error | null }>;
      insert: (values: Database['public']['Tables'][Table]['Insert']) => Promise<{ data: any; error: Error | null }>;
      update: (values: Database['public']['Tables'][Table]['Update']) => Promise<{ data: any; error: Error | null }>;
      delete: () => Promise<{ data: any; error: Error | null }>;
      eq: (column: string, value: any) => any;
      neq: (column: string, value: any) => any;
      gt: (column: string, value: any) => any;
      lt: (column: string, value: any) => any;
      gte: (column: string, value: any) => any;
      lte: (column: string, value: any) => any;
      order: (column: string, options?: { ascending?: boolean }) => any;
      limit: (count: number) => any;
    };
    auth: {
      signIn: (options: { email: string; password: string }) => Promise<{ data: any; error: Error | null }>;
      signUp: (options: { email: string; password: string }) => Promise<{ data: any; error: Error | null }>;
      signOut: () => Promise<{ error: Error | null }>;
      session: () => Promise<{ data: { session: any }; error: Error | null }>;
    };
    storage: {
      from: (bucket: string) => {
        upload: (path: string, file: File) => Promise<{ data: any; error: Error | null }>;
        download: (path: string) => Promise<{ data: any; error: Error | null }>;
        getPublicUrl: (path: string) => { publicURL: string };
      };
    };
    channel: (channel: string) => {
      on: (event: string, callback: (payload: any) => void) => any;
      subscribe: () => { unsubscribe: () => void };
    };
    removeChannel: (channel: any) => void;
  }

  export function createClient<T = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): SupabaseClient<T>;

  export interface User {
    id: string;
    app_metadata: {
      provider?: string;
      [key: string]: any;
    };
    user_metadata: {
      name?: string;
      avatar_url?: string;
      [key: string]: any;
    };
    aud: string;
    email?: string;
    phone?: string;
    created_at: string;
    confirmed_at?: string;
    last_sign_in_at?: string;
    role?: string;
    updated_at?: string;
  }

  export interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at?: number;
    token_type: string;
    user: User;
  }

  export interface AuthChangeEvent {
    SIGNED_IN: 'SIGNED_IN';
    SIGNED_OUT: 'SIGNED_OUT';
    USER_UPDATED: 'USER_UPDATED';
    PASSWORD_RECOVERY: 'PASSWORD_RECOVERY';
    TOKEN_REFRESHED: 'TOKEN_REFRESHED';
    USER_DELETED: 'USER_DELETED';
  }

  export interface GotrueError {
    message: string;
    status: number;
  }

  export interface AuthResponse {
    data: {
      user: User | null;
      session: Session | null;
    };
    error: GotrueError | null;
  }
} 