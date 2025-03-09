'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  getCurrentUser, 
  onAuthStateChange, 
  signIn, 
  signOut, 
  signUp, 
  resetPassword,
  updatePassword,
  updateProfile,
  signInWithGoogle
} from '@/lib/supabase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: { name: string }) => Promise<any>;
  signOut: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  updateProfile: (profile: { name?: string; avatar_url?: string }) => Promise<boolean>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut kullanıcıyı kontrol et
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Kullanıcı kontrolü sırasında hata:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Auth durumu değişikliklerini dinle
    const { data: authListener } = onAuthStateChange((user) => {
      setUser(user);
    });

    // Temizleme fonksiyonu
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 