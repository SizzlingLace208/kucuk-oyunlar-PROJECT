'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL'den auth bilgilerini al
        const code = searchParams.get('code');
        
        if (code) {
          // Supabase'in OAuth callback'ini işle
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            throw error;
          }
        }
        
        // Oturum durumunu kontrol et
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (data.session) {
          // Başarılı giriş, dashboard'a yönlendir
          router.push('/dashboard');
        } else {
          // Oturum yoksa login sayfasına yönlendir
          router.push('/auth/login');
        }
      } catch (error: any) {
        console.error('Auth callback hatası:', error);
        setError(error.message || 'Kimlik doğrulama sırasında bir hata oluştu.');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Yönlendiriliyor...</h1>
          <p className="mt-2 text-muted-foreground">
            Lütfen bekleyin, kimlik doğrulama işlemi tamamlanıyor.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
} 