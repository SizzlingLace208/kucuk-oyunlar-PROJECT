'use client';

import { useEffect, useState } from 'react';
import { GameSDK } from '@/lib/games/GameSDK';

// Örnek oyun verileri
const games: Record<string, { title: string, gameComponent: React.FC<{ sdk: GameSDK }> }> = {
  '1': {
    title: 'Uzay Macerası',
    gameComponent: SpaceAdventureGame
  },
  '2': {
    title: 'Bulmaca Ustası',
    gameComponent: PuzzleMasterGame
  },
  '3': {
    title: 'Hızlı Yarış',
    gameComponent: RacingGame
  }
};

export default function GameEmbedPage({ params }: { params: { id: string } }) {
  const [sdk, setSDK] = useState<GameSDK | null>(null);
  const gameId = params.id;
  const game = games[gameId];
  
  useEffect(() => {
    // SDK'yı başlat
    if (typeof window !== 'undefined') {
      const gameSDK = new GameSDK({
        gameId,
        width: 800,
        height: 600,
        allowFullscreen: true,
        saveScores: true
      });
      
      setSDK(gameSDK);
    }
    
    // Temizlik fonksiyonu
    return () => {
      // Gerekirse SDK temizliği yapılabilir
    };
  }, [gameId]);
  
  if (!game) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Oyun Bulunamadı</h1>
          <p className="text-muted-foreground">Bu oyun mevcut değil veya kaldırılmış olabilir.</p>
        </div>
      </div>
    );
  }
  
  const GameComponent = game.gameComponent;
  
  return (
    <div className="game-embed">
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
          background-color: #000;
        }
        
        .game-embed {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .game-container {
          width: 100%;
          height: 100%;
          max-width: 800px;
          max-height: 600px;
          position: relative;
          overflow: hidden;
        }
      `}</style>
      
      <div className="game-container">
        {sdk ? (
          <GameComponent sdk={sdk} />
        ) : (
          <div className="flex items-center justify-center h-full bg-background text-foreground">
            <div className="text-center">
              <div className="spinner mb-4"></div>
              <p>Oyun yükleniyor...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Uzay Macerası Oyunu
function SpaceAdventureGame({ sdk }: { sdk: GameSDK }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  useEffect(() => {
    // Oyun başladığında
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      // Basit bir oyun kontrolü
      if (e.key === 'ArrowUp') {
        setScore(prev => prev + 10);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Oyun duraklatıldığında
    sdk.on('pause', () => {
      console.log('Oyun duraklatıldı');
    });
    
    // Oyun devam ettirildiğinde
    sdk.on('resume', () => {
      console.log('Oyun devam ediyor');
    });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sdk, gameOver]);
  
  const handleEndGame = () => {
    setGameOver(true);
    sdk.endGame(score, { playTime: 120, level: Math.floor(score / 100) + 1 });
  };
  
  return (
    <div className="w-full h-full bg-black text-white p-4 flex flex-col">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Uzay Macerası</h1>
        <div>Skor: {score}</div>
      </div>
      
      <div className="flex-1 bg-gray-900 relative">
        {/* Oyun alanı */}
        <div className="absolute inset-0 flex items-center justify-center">
          {gameOver ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Oyun Bitti!</h2>
              <p className="mb-4">Skorunuz: {score}</p>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
                onClick={() => {
                  setScore(0);
                  setGameOver(false);
                }}
              >
                Tekrar Oyna
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">Yukarı ok tuşuna basarak puan kazanın!</p>
              <div className="text-6xl mb-4">🚀</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <button 
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          onClick={() => sdk.pauseGame()}
        >
          Duraklat
        </button>
        
        <button 
          className="px-4 py-2 bg-accent text-accent-foreground rounded"
          onClick={handleEndGame}
        >
          Oyunu Bitir
        </button>
      </div>
    </div>
  );
}

// Bulmaca Ustası Oyunu
function PuzzleMasterGame({ sdk }: { sdk: GameSDK }) {
  const [score, setScore] = useState(0);
  const [puzzle, setPuzzle] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [gameOver, setGameOver] = useState(false);
  
  useEffect(() => {
    // Oyun başladığında bulmacayı karıştır
    shufflePuzzle();
    
    // Oyun duraklatıldığında
    sdk.on('pause', () => {
      console.log('Oyun duraklatıldı');
    });
    
    // Oyun devam ettirildiğinde
    sdk.on('resume', () => {
      console.log('Oyun devam ediyor');
    });
  }, [sdk]);
  
  const shufflePuzzle = () => {
    const newPuzzle = [...puzzle];
    for (let i = newPuzzle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPuzzle[i], newPuzzle[j]] = [newPuzzle[j], newPuzzle[i]];
    }
    setPuzzle(newPuzzle);
  };
  
  const handleTileClick = (index: number) => {
    if (gameOver) return;
    
    const zeroIndex = puzzle.indexOf(0);
    
    // Komşu kareler kontrol edilir
    if (
      (index === zeroIndex - 1 && zeroIndex % 3 !== 0) || // Sol
      (index === zeroIndex + 1 && zeroIndex % 3 !== 2) || // Sağ
      index === zeroIndex - 3 || // Üst
      index === zeroIndex + 3    // Alt
    ) {
      const newPuzzle = [...puzzle];
      [newPuzzle[index], newPuzzle[zeroIndex]] = [newPuzzle[zeroIndex], newPuzzle[index]];
      setPuzzle(newPuzzle);
      setScore(prev => prev + 5);
      
      // Bulmaca tamamlandı mı kontrol et
      if (newPuzzle.join('') === '123456780') {
        setGameOver(true);
        sdk.endGame(score + 100, { moves: score / 5 });
      }
    }
  };
  
  const handleEndGame = () => {
    setGameOver(true);
    sdk.endGame(score, { moves: score / 5 });
  };
  
  return (
    <div className="w-full h-full bg-gray-100 text-gray-900 p-4 flex flex-col">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Bulmaca Ustası</h1>
        <div>Skor: {score}</div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        {gameOver ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Oyun Bitti!</h2>
            <p className="mb-4">Skorunuz: {score}</p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
              onClick={() => {
                setScore(0);
                shufflePuzzle();
                setGameOver(false);
              }}
            >
              Tekrar Oyna
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 w-64 h-64">
            {puzzle.map((tile, index) => (
              <div
                key={index}
                className={`flex items-center justify-center text-2xl font-bold rounded cursor-pointer ${
                  tile === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white'
                }`}
                onClick={() => handleTileClick(index)}
              >
                {tile !== 0 && tile}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between">
        <button 
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          onClick={() => sdk.pauseGame()}
        >
          Duraklat
        </button>
        
        <button 
          className="px-4 py-2 bg-accent text-accent-foreground rounded"
          onClick={handleEndGame}
        >
          Oyunu Bitir
        </button>
      </div>
    </div>
  );
}

// Hızlı Yarış Oyunu
function RacingGame({ sdk }: { sdk: GameSDK }) {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  
  useEffect(() => {
    // Oyun başladığında
    const interval = setInterval(() => {
      if (!gameOver) {
        setScore(prev => prev + 1);
      }
    }, 100);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      if (e.key === 'ArrowLeft') {
        setPosition(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setPosition(prev => Math.min(2, prev + 1));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Oyun duraklatıldığında
    sdk.on('pause', () => {
      clearInterval(interval);
    });
    
    // Oyun devam ettirildiğinde
    sdk.on('resume', () => {
      // Yeni interval başlat
    });
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sdk, gameOver]);
  
  const handleEndGame = () => {
    setGameOver(true);
    sdk.endGame(score, { distance: score * 10, position });
  };
  
  return (
    <div className="w-full h-full bg-gray-800 text-white p-4 flex flex-col">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Hızlı Yarış</h1>
        <div>Skor: {score}</div>
      </div>
      
      <div className="flex-1 bg-gray-900 relative">
        {/* Oyun alanı */}
        <div className="absolute inset-0">
          {gameOver ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Yarış Bitti!</h2>
                <p className="mb-4">Skorunuz: {score}</p>
                <button 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded"
                  onClick={() => {
                    setScore(0);
                    setPosition(1);
                    setGameOver(false);
                  }}
                >
                  Tekrar Oyna
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 flex">
                <div className="flex-1 border-r border-gray-700 flex items-end justify-center pb-4">
                  {position === 0 && <div className="text-4xl">🏎️</div>}
                </div>
                <div className="flex-1 border-r border-gray-700 flex items-end justify-center pb-4">
                  {position === 1 && <div className="text-4xl">🏎️</div>}
                </div>
                <div className="flex-1 flex items-end justify-center pb-4">
                  {position === 2 && <div className="text-4xl">🏎️</div>}
                </div>
              </div>
              <div className="h-16 bg-gray-700 flex items-center justify-center">
                <p>Sol ve sağ ok tuşlarıyla aracı hareket ettirin!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <button 
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          onClick={() => sdk.pauseGame()}
        >
          Duraklat
        </button>
        
        <button 
          className="px-4 py-2 bg-accent text-accent-foreground rounded"
          onClick={handleEndGame}
        >
          Yarışı Bitir
        </button>
      </div>
    </div>
  );
} 