'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold">E-posta Doğrulama</h1>
          <p className="mt-2 text-muted-foreground">
            Hesabınızı aktifleştirmek için e-postanızı doğrulayın
          </p>
        </div>

        <div className="bg-secondary/10 p-4 rounded-md">
          <p className="font-medium">E-posta doğrulama bağlantısı gönderildi!</p>
          <p className="mt-2">
            E-posta adresinize bir doğrulama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin ve hesabınızı aktifleştirmek için bağlantıya tıklayın.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            E-posta birkaç dakika içinde gelmezse, spam klasörünüzü kontrol edin veya farklı bir e-posta adresi ile tekrar kayıt olmayı deneyin.
          </p>
        </div>

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