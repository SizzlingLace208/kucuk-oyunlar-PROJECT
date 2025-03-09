'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Sayfa yenilenmeyecek, AuthProvider otomatik olarak durumu güncelleyecek
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            KüçükOyunlar
          </Link>
          
          {/* Mobil menü butonu */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Masaüstü navigasyon */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/games" className="text-foreground hover:text-primary transition-colors">
              Oyunlar
            </Link>
            <Link href="/leaderboard" className="text-foreground hover:text-primary transition-colors">
              Liderlik Tablosu
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              İletişim
            </Link>
          </nav>
          
          {/* Kullanıcı menüsü */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
                    <span>{user.user_metadata?.name || 'Kullanıcı'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary/10">
                        Profil
                      </Link>
                      <Link href="/favorites" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary/10">
                        Favorilerim
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary/10"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-foreground hover:text-primary transition-colors">
                  Giriş
                </Link>
                <Link href="/auth/register" className="btn-accent">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobil menü */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/games"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Oyunlar
              </Link>
              <Link
                href="/leaderboard"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Liderlik Tablosu
              </Link>
              <Link
                href="/about"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link
                href="/contact"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </Link>
              
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link
                    href="/favorites"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Favorilerim
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giriş
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-accent hover:text-accent/80 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 