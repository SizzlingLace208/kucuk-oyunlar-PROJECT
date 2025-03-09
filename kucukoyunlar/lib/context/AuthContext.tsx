'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { 
  getCurrentUser, 
  onAuthStateChange, 
  signIn as authSignIn, 
  signUp as authSignUp, 
  signOut as authSignOut,
  resetPassword as authResetPassword,
  updatePassword as authUpdatePassword,
  updateProfile as authUpdateProfile,
  signInWithGoogle as authSignInWithGoogle
} from '@/lib/supabase/auth';

// AuthContext tipi
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

// AuthContext oluştur
const AuthContext = createContext<AuthContextType | null>(null);

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
        console.error('Kullanıcı bilgileri alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Auth durumu değişikliklerini dinle
    const { data: authListener } = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      // Temizlik fonksiyonu
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    loading,
    signIn: authSignIn,
    signUp: authSignUp,
    signOut: authSignOut,
    resetPassword: authResetPassword,
    updatePassword: authUpdatePassword,
    updateProfile: authUpdateProfile,
    signInWithGoogle: authSignInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 