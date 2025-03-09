'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      console.error('Şifre sıfırlama hatası:', error);
      setError(error.message || 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Şifre Sıfırlama</h1>
          <p className="mt-2 text-muted-foreground">
            Şifrenizi sıfırlamak için e-posta adresinizi girin
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-md">
            <p className="font-medium">Şifre sıfırlama bağlantısı gönderildi!</p>
            <p className="mt-2">
              E-posta adresinize bir şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin.
            </p>
            <div className="mt-4">
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/80"
              >
                Giriş sayfasına dön
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ornek@mail.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-primary hover:text-primary/80">
              Giriş sayfasına dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 