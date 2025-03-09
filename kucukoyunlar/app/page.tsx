import Link from 'next/link';

// Örnek oyun verileri
const featuredGames = [
  {
    id: '1',
    title: 'Uzay Macerası',
    description: 'Galaksiler arası bir maceraya atılın! Uzay gemisiyle gezegenleri keşfedin ve ödülleri toplayın.',
    thumbnailUrl: '',
    category: 'Arcade',
  },
  {
    id: '2',
    title: 'Bulmaca Ustası',
    description: 'Zekânızı zorlayacak bulmacalarla dolu bir oyun. Her seviye daha zorlu bulmacalarla sizi bekliyor.',
    thumbnailUrl: '',
    category: 'Bulmaca',
  },
  {
    id: '3',
    title: 'Hızlı Yarış',
    description: 'Farklı araçlar ve pistlerle heyecanlı bir yarış deneyimi. Arkadaşlarınızla rekabet edin ve en iyi zamanı yapın!',
    thumbnailUrl: '',
    category: 'Yarış',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Küçük Oyunlar, <span className="text-accent">Büyük Eğlence</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            En sevdiğiniz oyunları ücretsiz oynayın, skorlarınızı kaydedin ve arkadaşlarınızla yarışın!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/games" className="btn-primary text-lg px-8 py-3">
              Hemen Oyna
            </a>
            <a href="/auth/register" className="btn-secondary text-lg px-8 py-3">
              Kayıt Ol
            </a>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Öne Çıkan Oyunlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.map((game) => (
              <div key={game.id} className="game-card">
                <div className="relative w-full h-48 bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xl font-bold">{game.title.charAt(0)}</div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{game.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {game.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                      {game.category}
                    </span>
                    <a href={`/games/${game.id}`} className="btn-accent">
                      Oyna
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="/games" className="btn-secondary">
              Tüm Oyunları Gör
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Arcade', 'Bulmaca', 'Strateji', 'Spor'].map((category) => (
              <a
                key={category}
                href={`/games/category/${category.toLowerCase()}`}
                className="bg-card p-6 rounded-lg text-center hover:bg-primary/10 transition-colors"
              >
                <div className="text-xl font-semibold">{category}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hazır mısınız?</h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Hemen üye olun ve eğlenceli oyunları oynamaya başlayın. Arkadaşlarınızla rekabet edin ve liderlik tablosunda yerinizi alın!
          </p>
          <a href="/auth/register" className="btn-primary text-lg px-8 py-3">
            Hemen Başla
          </a>
        </div>
      </section>
    </div>
  );
} 