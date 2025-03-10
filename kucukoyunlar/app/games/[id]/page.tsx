'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameManager } from '@/lib/games/GameManager';
import FavoriteButton from '@/components/ui/FavoriteButton';
import ShareButton from '@/components/ui/ShareButton';
import { getGameById, getSimilarGames, Game as GameType } from '@/lib/services/game-service';
import { getGameLeaderboard, LeaderboardEntry } from '@/lib/services/leaderboard-service';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { Skeleton } from '@/components/ui/skeleton';
import CommentList from '@/components/games/CommentList';

// Örnek oyun verileri
const games: Record<string, GameType> = {
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

export default function GamePage({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<GameType | null>(null);
  const [similarGames, setSimilarGames] = useState<GameType[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'comments'>('overview');
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestScore, setLatestScore] = useState<number | null>(null);
  const gameManagerRef = useRef<GameManager | null>(null);

  useEffect(() => {
    async function loadGame() {
      setLoading(true);
      try {
        // Oyun verilerini getir
        const { data: gameData, error: gameError } = await getGameById(params.id);
        if (gameError) throw new Error(gameError.message);
        if (!gameData) throw new Error('Oyun bulunamadı');
        
        setGame(gameData);
        
        // Benzer oyunları getir
        const { data: similarData, error: similarError } = await getSimilarGames(params.id);
        if (!similarError) {
          setSimilarGames(similarData || []);
        }
        
        // Liderlik tablosunu getir
        loadLeaderboard();
      } catch (err) {
        console.error('Oyun yüklenirken hata oluştu:', err);
        setErrorMessage('Oyun yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    }
    
    loadGame();
  }, [params.id]);
  
  async function loadLeaderboard() {
    setLeaderboardLoading(true);
    try {
      const { data, error } = await getGameLeaderboard(params.id, { limit: 10 });
      if (error) throw new Error(error.message);
      setLeaderboard(data || []);
    } catch (err) {
      console.error('Liderlik tablosu yüklenirken hata oluştu:', err);
    } finally {
      setLeaderboardLoading(false);
    }
  }

  useEffect(() => {
    // Oyun yöneticisini oluştur
    if (game && !gameManagerRef.current) {
      gameManagerRef.current = new GameManager({
        gameId: params.id,
        containerId: 'game-container',
        width: 800,
        height: 600,
        allowFullscreen: true,
        onScoreSaved: (score) => {
          setLatestScore(score.score);
          loadLeaderboard();
        },
        onGameReady: () => {
          console.log('Oyun hazır');
        },
        onGameOver: (score) => {
          setLatestScore(score);
          loadLeaderboard();
        }
      });
    }

    return () => {
      // Temizlik işlemleri
      if (gameManagerRef.current) {
        // Gerekirse temizlik işlemleri yapılabilir
      }
    };
  }, [params.id, game]);

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
  
  // Oyun kontrol butonları için işlevler
  const handlePauseGame = () => {
    if (gameManagerRef.current) {
      gameManagerRef.current.pauseGame();
    }
  };

  const handleResumeGame = () => {
    if (gameManagerRef.current) {
      gameManagerRef.current.resumeGame();
    }
  };

  const handleRestartGame = () => {
    if (gameManagerRef.current) {
      gameManagerRef.current.restartGame();
    }
  };

  // Oyun detay sayfasındaki tip tanımlamaları
  interface GameTag {
    name: string;
    color?: string;
  }

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
          <div id="game-container" className="container-game bg-muted rounded-lg overflow-hidden">
            {!loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="spinner mb-4"></div>
                  <p>Oyun yükleniyor...</p>
                </div>
              </div>
            )}
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
              <div className="flex space-x-4">
                <button
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  onClick={handlePauseGame}
                >
                  Duraklat
                </button>
                
                <button
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  onClick={handleResumeGame}
                >
                  Devam Et
                </button>
                
                <button
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  onClick={handleRestartGame}
                >
                  Yeniden Başlat
                </button>
              </div>
              
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
            
            {latestScore !== null && (
              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Son Skorunuz</h3>
                <p className="text-2xl font-bold">{latestScore} puan</p>
              </div>
            )}
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
          
          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>
            
            <div className="space-y-6">
              {game.comments.map((comment) => (
                <div key={comment.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-2">
                        <span className="font-bold text-sm">{comment.user.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{comment.user}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{comment.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{comment.date}</p>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tablar */}
      <div className="flex border-b border-gray-200 mb-6 mt-8">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'overview'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Genel Bakış
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'leaderboard'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Liderlik Tablosu
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'comments'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('comments')}
        >
          Yorumlar
        </button>
      </div>
      
      {/* Tab içeriği */}
      {activeTab === 'overview' && (
        <div>
          {/* Oyun açıklaması */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Oyun Hakkında</h2>
            <p className="text-gray-700">{game?.description}</p>
          </div>
          
          {/* Oyun bilgileri */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Oyun Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Kategori</h3>
                <p>{game?.category}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Oynanma Sayısı</h3>
                <p>{game?.play_count?.toLocaleString() || 0}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Puan</h3>
                <p>{game?.rating?.toFixed(1) || 'N/A'} / 5.0</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Zorluk</h3>
                <p>{game?.difficulty || 'Orta'}</p>
              </div>
            </div>
          </div>
          
          {/* Kontroller */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Kontroller</h2>
            <p className="text-gray-700">Yön tuşları ile hareket edin, Boşluk tuşu ile ateş edin</p>
          </div>
        </div>
      )}
      
      {activeTab === 'leaderboard' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Liderlik Tablosu</h2>
          <LeaderboardTable 
            entries={leaderboard} 
            isLoading={leaderboardLoading} 
            showGameTitle={false} 
          />
          <div className="mt-4 text-center">
            <a 
              href={`/leaderboard?gameId=${params.id}`} 
              className="text-primary hover:underline"
            >
              Tüm liderlik tablosunu görüntüle
            </a>
          </div>
        </div>
      )}
      
      {activeTab === 'comments' && (
        <div className="mt-6">
          <CommentList gameId={params.id} />
        </div>
      )}
      
      {/* Benzer oyunlar */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Benzer Oyunlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarGames.map((similarGame) => (
            <a 
              key={similarGame.id} 
              href={`/games/${similarGame.id}`} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-40">
                {similarGame.image_url ? (
                  <img 
                    src={similarGame.image_url} 
                    alt={similarGame.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Resim yok</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{similarGame.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{similarGame.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// Game tipi
interface Game {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  playCount: number;
  rating: number;
  releaseDate: string;
  developer: string;
  controls: string;
  tags: string[];
  comments: GameComment[];
}

interface GameComment {
  id: string;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
} 