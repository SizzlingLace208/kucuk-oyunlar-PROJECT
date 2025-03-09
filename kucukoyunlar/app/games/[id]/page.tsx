'use client';

// Örnek oyun verileri
const games: Record<string, Game> = {
  '1': {
    id: '1',
    title: 'Uzay Macerası',
    description: 'Galaksiler arası bir maceraya atılın! Uzay gemisiyle gezegenleri keşfedin ve ödülleri toplayın. Bu heyecan dolu uzay oyununda, farklı gezegenleri keşfedecek, uzaylılarla karşılaşacak ve değerli kaynakları toplayacaksınız. Geminizdeki yakıtı ve oksijeni dikkatli kullanın, yoksa uzayın derinliklerinde kaybolabilirsiniz!',
    thumbnailUrl: '',
    category: 'Arcade',
    playCount: 1250,
    rating: 4.5,
    releaseDate: '2023-05-15',
    developer: 'Uzay Oyunları',
    controls: 'Yön tuşları ile hareket edin, Boşluk tuşu ile ateş edin',
    tags: ['Uzay', 'Macera', 'Aksiyon', 'Keşif'],
    comments: [
      {
        id: '1',
        user: 'SpaceExplorer',
        avatar: '',
        date: '2023-06-10',
        rating: 5,
        text: 'Harika bir oyun! Uzay atmosferi çok iyi yansıtılmış. Kontroller akıcı ve oynanış çok eğlenceli. Kesinlikle tavsiye ederim!'
      },
      {
        id: '2',
        user: 'GamerX',
        avatar: '',
        date: '2023-06-15',
        rating: 4,
        text: 'Grafikleri biraz daha iyi olabilirdi ama oynanış olarak çok başarılı. Özellikle farklı gezegenlerdeki görevler çok eğlenceli.'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Bulmaca Ustası',
    description: 'Zekânızı zorlayacak bulmacalarla dolu bir oyun. Her seviye daha zorlu bulmacalarla sizi bekliyor. Mantık, matematik ve görsel algı becerilerinizi test eden bu oyunda, her seviyeyi tamamladıkça daha zorlu bulmacalarla karşılaşacaksınız. Zamanla yarışın ve en yüksek puanı almak için stratejinizi geliştirin!',
    thumbnailUrl: '',
    category: 'Bulmaca',
    playCount: 980,
    rating: 4.2,
    releaseDate: '2023-06-22',
    developer: 'Zeka Oyunları',
    controls: 'Fare ile tıklayın ve sürükleyin',
    tags: ['Bulmaca', 'Zeka', 'Strateji', 'Mantık'],
    comments: [
      {
        id: '1',
        user: 'PuzzleLover',
        avatar: '',
        date: '2023-07-05',
        rating: 5,
        text: 'Bulmacalar çok iyi tasarlanmış, her seviye bir öncekinden daha zorlayıcı. Saatlerce oynayabiliyorum!'
      },
      {
        id: '2',
        user: 'BrainTeaser',
        avatar: '',
        date: '2023-07-10',
        rating: 4,
        text: 'Bazı bulmacalar çok zor ama ipucu sistemi iyi düşünülmüş. Zeka geliştirmek için harika bir oyun.'
      },
      {
        id: '3',
        user: 'LogicMaster',
        avatar: '',
        date: '2023-07-15',
        rating: 3,
        text: 'İyi bir bulmaca oyunu ama bazen çok tekrara düşüyor. Biraz daha çeşitlilik olabilirdi.'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Hızlı Yarış',
    description: 'Farklı araçlar ve pistlerle heyecanlı bir yarış deneyimi. Arkadaşlarınızla rekabet edin ve en iyi zamanı yapın! Çeşitli hava koşullarında ve zorlu pistlerde yarışacağınız bu oyunda, arabanızı yükseltebilir ve özelleştirebilirsiniz. Drift yaparak, nitro kullanarak ve rakiplerinizi geçerek birinci olmaya çalışın!',
    thumbnailUrl: '',
    category: 'Yarış',
    playCount: 1560,
    rating: 4.7,
    releaseDate: '2023-04-10',
    developer: 'Yarış Oyunları',
    controls: 'Yön tuşları ile sürün, X tuşu ile nitro kullanın',
    tags: ['Yarış', 'Araba', 'Hız', 'Rekabet'],
    comments: [
      {
        id: '1',
        user: 'SpeedDemon',
        avatar: '',
        date: '2023-05-01',
        rating: 5,
        text: 'En iyi yarış oyunlarından biri! Araç fizikleri çok gerçekçi ve pistler çok iyi tasarlanmış.'
      },
      {
        id: '2',
        user: 'RacingFan',
        avatar: '',
        date: '2023-05-12',
        rating: 5,
        text: 'Arkadaşlarımla çok eğleniyoruz. Çok akıcı ve grafikleri harika. Kesinlikle tavsiye ederim!'
      }
    ]
  },
};

import { useState } from 'react';
import FavoriteButton from '@/components/ui/FavoriteButton';
import ShareButton from '@/components/ui/ShareButton';

export default function GamePage({ params }: { params: { id: string } }) {
  const gameId = params.id;
  const game = games[gameId as keyof typeof games];
  
  if (!game) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Oyun Bulunamadı</h1>
        <p className="text-muted-foreground mb-8">Aradığınız oyun bulunamadı veya kaldırılmış olabilir.</p>
        <a href="/games" className="btn-primary">
          Tüm Oyunlara Dön
        </a>
      </div>
    );
  }
  
  const handleFavoriteToggle = (isFavorite: boolean) => {
    // Burada favori durumu değiştiğinde yapılacak işlemler
    console.log(`${game.title} ${isFavorite ? 'favorilere eklendi' : 'favorilerden çıkarıldı'}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <a href="/games" className="text-muted-foreground hover:text-foreground transition-colors">
          &larr; Tüm Oyunlara Dön
        </a>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Oyun Önizleme */}
        <div className="lg:col-span-2">
          <div className="bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-4xl font-bold">{game.title.charAt(0)}</div>
          </div>
          
          <div className="mt-6 bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{game.title}</h1>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full">
                {game.category}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <span className="mr-4">⭐ {game.rating}</span>
              <span className="mr-4">🎮 {game.playCount} oynanma</span>
              <span>📅 {game.releaseDate}</span>
            </div>
            
            <p className="mb-6">{game.description}</p>
            
            <div className="flex items-center justify-between">
              <a
                href="#"
                className="flex-1 text-center py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-lg font-medium mr-4"
                onClick={(e) => e.preventDefault()}
              >
                Şimdi Oyna
              </a>
              
              <div className="flex space-x-2">
                <FavoriteButton 
                  gameId={game.id} 
                  onToggle={handleFavoriteToggle}
                  className="h-12 w-12 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                />
                
                <ShareButton 
                  title={game.title}
                  className="h-12 w-12"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Oyun Bilgileri */}
        <div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Oyun Bilgileri</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Geliştirici</h3>
                <p>{game.developer}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Kategori</h3>
                <p>{game.category}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Yayın Tarihi</h3>
                <p>{game.releaseDate}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Kontroller</h3>
                <p>{game.controls}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Etiketler</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {game.tags.map((tag) => (
                    <span key={tag} className="bg-secondary/20 px-2 py-1 rounded-md text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Benzer Oyunlar</h2>
            
            <div className="space-y-4">
              {Object.values(games)
                .filter((g) => g.id !== game.id)
                .slice(0, 2)
                .map((similarGame) => (
                  <a
                    key={similarGame.id}
                    href={`/games/${similarGame.id}`}
                    className="block p-4 border border-border rounded-lg hover:bg-secondary/10 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center mr-4">
                        <span className="font-bold">{similarGame.title.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{similarGame.title}</h3>
                        <p className="text-sm text-muted-foreground">{similarGame.category}</p>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Yorumlar Bölümü */}
      <div className="mt-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Yorumlar</h2>
            <button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Yorum Yap
            </button>
          </div>
          
          {game.comments && game.comments.length > 0 ? (
            <div className="space-y-6">
              {game.comments.map((comment) => (
                <div key={comment.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
                        <span className="font-medium">{comment.user.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{comment.user}</h3>
                        <p className="text-sm text-muted-foreground">{comment.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < comment.rating ? "text-accent" : "text-muted"}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Bu oyun için henüz yorum yapılmamış.</p>
              <button 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                İlk Yorumu Sen Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 