'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game, GameFilter, searchGames } from '@/lib/services/game-service';
import GameSearch from './GameSearch';
import { Skeleton } from '@/components/ui/skeleton';

export default function GameList() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<GameFilter>({
    category: 'tümü',
    difficulty: 'tümü',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      try {
        const { data, error } = await searchGames(filter);
        if (error) {
          throw new Error(error.message);
        }
        setGames(data || []);
        setError(null);
      } catch (err) {
        console.error('Oyunlar yüklenirken hata oluştu:', err);
        setError('Oyunlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [filter]);

  const handleSearch = (newFilter: GameFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Oyunlar</h1>
      
      <GameSearch onSearch={handleSearch} initialFilter={filter} />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <GameListSkeleton />
      ) : games.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Oyun bulunamadı</h3>
          <p className="text-gray-500">Arama kriterlerinize uygun oyun bulunamadı. Lütfen filtreleri değiştirin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id}>
              <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-48">
                  {game.image_url ? (
                    <Image
                      src={game.image_url}
                      alt={game.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Resim yok</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    {game.category}
                  </div>
                  {game.difficulty && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {game.difficulty}
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-grow">
                  <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{game.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm">{game.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {game.play_count || 0} oynanma
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function GameListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md h-full flex flex-col">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 