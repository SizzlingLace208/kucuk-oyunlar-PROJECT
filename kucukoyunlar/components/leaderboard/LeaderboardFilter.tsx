'use client';

import { useState, useEffect } from 'react';
import { LeaderboardFilter } from '@/lib/services/leaderboard-service';
import { Game } from '@/lib/services/game-service';

interface LeaderboardFilterProps {
  games: Game[];
  onFilterChange: (filter: LeaderboardFilter) => void;
  initialFilter?: LeaderboardFilter;
}

export default function LeaderboardFilterComponent({ games, onFilterChange, initialFilter }: LeaderboardFilterProps) {
  const [filter, setFilter] = useState<LeaderboardFilter>(initialFilter || {
    timeFrame: 'all',
    limit: 10
  });

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gameId = e.target.value === 'all' ? undefined : e.target.value;
    setFilter(prev => ({ ...prev, gameId }));
  };

  const handleTimeFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timeFrame = e.target.value as 'all' | 'day' | 'week' | 'month';
    setFilter(prev => ({ ...prev, timeFrame }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value, 10);
    setFilter(prev => ({ ...prev, limit }));
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Liderlik Tablosu Filtreleri</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Oyun filtresi */}
        <div>
          <label htmlFor="game" className="block text-sm font-medium mb-1">
            Oyun
          </label>
          <select
            id="game"
            value={filter.gameId || 'all'}
            onChange={handleGameChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tüm Oyunlar</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </select>
        </div>
        
        {/* Zaman aralığı filtresi */}
        <div>
          <label htmlFor="timeFrame" className="block text-sm font-medium mb-1">
            Zaman Aralığı
          </label>
          <select
            id="timeFrame"
            value={filter.timeFrame || 'all'}
            onChange={handleTimeFrameChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="day">Son 24 Saat</option>
            <option value="week">Son 7 Gün</option>
            <option value="month">Son 30 Gün</option>
          </select>
        </div>
        
        {/* Limit filtresi */}
        <div>
          <label htmlFor="limit" className="block text-sm font-medium mb-1">
            Gösterilecek Kayıt Sayısı
          </label>
          <select
            id="limit"
            value={filter.limit || 10}
            onChange={handleLimitChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  );
} 