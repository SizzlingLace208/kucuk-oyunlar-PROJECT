import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-secondary mt-12">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="md:col-span-2">
            <a href="/" className="text-xl font-bold mb-4 block">
              KüçükOyunlar
            </a>
            <p className="text-muted-foreground mb-4">
              KüçükOyunlar, eğlenceli HTML5 oyunları oynayabileceğiniz, skorlarınızı kaydedebileceğiniz ve arkadaşlarınızla rekabet edebileceğiniz modern bir oyun platformudur.
            </p>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <a href="/games" className="text-muted-foreground hover:text-accent transition-colors">
                  Tüm Oyunlar
                </a>
              </li>
              <li>
                <a href="/leaderboard" className="text-muted-foreground hover:text-accent transition-colors">
                  Skor Tablosu
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-accent transition-colors">
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              <li>
                <a href="/games/category/arcade" className="text-muted-foreground hover:text-accent transition-colors">
                  Arcade
                </a>
              </li>
              <li>
                <a href="/games/category/bulmaca" className="text-muted-foreground hover:text-accent transition-colors">
                  Bulmaca
                </a>
              </li>
              <li>
                <a href="/games/category/strateji" className="text-muted-foreground hover:text-accent transition-colors">
                  Strateji
                </a>
              </li>
              <li>
                <a href="/games/category/spor" className="text-muted-foreground hover:text-accent transition-colors">
                  Spor
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Footer */}
        <div className="border-t border-secondary pt-6 mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KüçükOyunlar. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 