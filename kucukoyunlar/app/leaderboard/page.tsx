'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  getGlobalLeaderboard, 
  getUserLeaderboard, 
  LeaderboardEntry, 
  LeaderboardFilter 
} from '@/lib/services/leaderboard-service';
import { getAllGames, Game } from '@/lib/services/game-service';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import LeaderboardFilterComponent from '@/components/leaderboard/LeaderboardFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'global' | 'user'>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [filter, setFilter] = useState<LeaderboardFilter>({
    timeFrame: 'all',
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Oyunları yükle
  useEffect(() => {
    async function loadGames() {
      try {
        const { data, error } = await getAllGames();
        if (error) throw new Error(error.message);
        setGames(data || []);
      } catch (err) {
        console.error('Oyunlar yüklenirken hata oluştu:', err);
      }
    }

    loadGames();
  }, []);

  // Liderlik tablosunu yükle
  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      setError(null);
      
      try {
        if (activeTab === 'global') {
          const { data, error } = await getGlobalLeaderboard(filter);
          if (error) throw new Error(error.message);
          setEntries(data || []);
        } else if (activeTab === 'user' && user) {
          const { data, error } = await getUserLeaderboard(user.id, filter);
          if (error) throw new Error(error.message);
          setEntries(data || []);
        }
      } catch (err) {
        console.error('Liderlik tablosu yüklenirken hata oluştu:', err);
        setError('Liderlik tablosu yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadLeaderboard();
    }
  }, [activeTab, filter, user, authLoading]);

  // Filtre değişikliği
  const handleFilterChange = (newFilter: LeaderboardFilter) => {
    setFilter(newFilter);
  };

  // Tab değişikliği
  const handleTabChange = (tab: 'global' | 'user') => {
    setActiveTab(tab);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Liderlik Tablosu</h1>
        <div className="flex justify-center">
          <Skeleton className="h-64 w-full max-w-3xl rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Liderlik Tablosu</h1>
      
      {/* Filtreler */}
      <LeaderboardFilterComponent 
        games={games} 
        onFilterChange={handleFilterChange} 
        initialFilter={filter} 
      />
      
      {/* Tablar */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'global'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('global')}
        >
          Genel Sıralama
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'user'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            if (!user) {
              router.push('/login?redirect=/leaderboard');
              return;
            }
            handleTabChange('user');
          }}
        >
          Kişisel Skorlarım
        </button>
      </div>
      
      {/* Hata mesajı */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Liderlik tablosu */}
      <LeaderboardTable 
        entries={entries} 
        isLoading={loading} 
        showGameTitle={activeTab === 'global' || !filter.gameId} 
      />
    </div>
  );
} 