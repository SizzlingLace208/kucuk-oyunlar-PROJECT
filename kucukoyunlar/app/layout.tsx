import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'KüçükOyunlar | Eğlenceli Oyunlar Platformu',
  description: 'Birbirinden eğlenceli küçük oyunlar oynayabileceğiniz, skorlarınızı kaydedebileceğiniz ve arkadaşlarınızla yarışabileceğiniz modern oyun platformu',
  keywords: 'oyunlar, küçük oyunlar, online oyunlar, ücretsiz oyunlar, HTML5 oyunlar, oyun platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow">{children}</main>
            
            <footer className="bg-background border-t border-border py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <a href="/" className="text-xl font-bold mb-4 block">
                      KüçükOyunlar
                    </a>
                    <p className="text-muted-foreground">
                      Eğlenceli oyunlar oynayın, skorlarınızı kaydedin ve arkadaşlarınızla yarışın!
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Bağlantılar</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="/games" className="text-muted-foreground hover:text-accent transition-colors">
                          Oyunlar
                        </a>
                      </li>
                      <li>
                        <a href="/leaderboard" className="text-muted-foreground hover:text-accent transition-colors">
                          Liderlik Tablosu
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
                  
                  <div>
                    <h3 className="font-semibold mb-4">Kategoriler</h3>
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
                  
                  <div>
                    <h3 className="font-semibold mb-4">Yasal</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                          Gizlilik Politikası
                        </a>
                      </li>
                      <li>
                        <a href="/terms" className="text-muted-foreground hover:text-accent transition-colors">
                          Kullanım Şartları
                        </a>
                      </li>
                      <li>
                        <a href="/cookies" className="text-muted-foreground hover:text-accent transition-colors">
                          Çerez Politikası
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
                  <p>&copy; {new Date().getFullYear()} KüçükOyunlar. Tüm hakları saklıdır.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 