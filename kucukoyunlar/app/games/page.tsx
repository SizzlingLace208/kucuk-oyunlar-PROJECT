// Örnek oyun verileri
const games = [
  {
    id: '1',
    title: 'Uzay Macerası',
    description: 'Galaksiler arası bir maceraya atılın! Uzay gemisiyle gezegenleri keşfedin ve ödülleri toplayın.',
    thumbnailUrl: '',
    category: 'Arcade',
    playCount: 1250,
    rating: 4.5,
  },
  {
    id: '2',
    title: 'Bulmaca Ustası',
    description: 'Zekânızı zorlayacak bulmacalarla dolu bir oyun. Her seviye daha zorlu bulmacalarla sizi bekliyor.',
    thumbnailUrl: '',
    category: 'Bulmaca',
    playCount: 980,
    rating: 4.2,
  },
  {
    id: '3',
    title: 'Hızlı Yarış',
    description: 'Farklı araçlar ve pistlerle heyecanlı bir yarış deneyimi. Arkadaşlarınızla rekabet edin ve en iyi zamanı yapın!',
    thumbnailUrl: '',
    category: 'Yarış',
    playCount: 1560,
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Kelime Avcısı',
    description: 'Kelimeleri bul ve puanları topla! Kelime haznenizi genişletirken eğlenin.',
    thumbnailUrl: '',
    category: 'Bulmaca',
    playCount: 2100,
    rating: 4.3,
  },
  {
    id: '5',
    title: 'Kale Savunması',
    description: 'Kalenizi düşman saldırılarına karşı savunun. Stratejinizi geliştirin ve kalenizi güçlendirin.',
    thumbnailUrl: '',
    category: 'Strateji',
    playCount: 1800,
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Basket Atışı',
    description: 'Basketbol becerilerinizi test edin! Farklı zorluklarda atışlar yapın ve yüksek skor elde edin.',
    thumbnailUrl: '',
    category: 'Spor',
    playCount: 950,
    rating: 4.1,
  },
];

// Kategori listesi
const categories = ['Tümü', 'Arcade', 'Bulmaca', 'Strateji', 'Yarış', 'Spor'];

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Oyunlar</h1>
      
      {/* Filtreler */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <a
              key={category}
              href={category === 'Tümü' ? '/games' : `/games/category/${category.toLowerCase()}`}
              className="px-4 py-2 rounded-full bg-secondary/20 hover:bg-secondary/40 transition-colors"
            >
              {category}
            </a>
          ))}
        </div>
      </div>
      
      {/* Oyun Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="game-card border border-border rounded-lg overflow-hidden bg-card">
            <div className="relative w-full h-48 bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl font-bold">{game.title.charAt(0)}</div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{game.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {game.description}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  {game.category}
                </span>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-4">⭐ {game.rating}</span>
                  <span>🎮 {game.playCount}</span>
                </div>
              </div>
              
              <a
                href={`/games/${game.id}`}
                className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Oyna
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 