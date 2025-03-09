import { supabase } from './client';
import { User } from '@supabase/supabase-js';

// Kullanıcı oturum açma
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Kullanıcı kaydı
export async function signUp(email: string, password: string, userData: { name: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: userData.name,
      },
    },
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Kullanıcı oturumu kapatma
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
}

// Mevcut kullanıcıyı alma
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Oturum durumunu dinleme
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user || null);
  });
}

// Şifre sıfırlama e-postası gönderme
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) {
    throw error;
  }
  
  return true;
}

// Şifre güncelleme
export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return true;
}

// Kullanıcı profili güncelleme
export async function updateProfile(profile: { name?: string; avatar_url?: string }) {
  const { error } = await supabase.auth.updateUser({
    data: profile,
  });
  
  if (error) {
    throw error;
  }
  
  return true;
}

// Google ile oturum açma
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    throw error;
  }
  
  return data;
} 