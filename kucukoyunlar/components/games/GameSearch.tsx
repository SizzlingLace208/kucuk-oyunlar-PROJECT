'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { 
  GameCategory, 
  GameFilter, 
  getAllCategories, 
  getAllDifficulties 
} from '@/lib/services/game-service';

interface GameSearchProps {
  onSearch: (filter: GameFilter) => void;
  initialFilter?: GameFilter;
}

export default function GameSearch({ onSearch, initialFilter }: GameSearchProps) {
  const [filter, setFilter] = useState<GameFilter>(initialFilter || {
    category: 'tümü',
    difficulty: 'tümü',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const categories = getAllCategories();
  const difficulties = getAllDifficulties();

  // Filtre değiştiğinde arama yap
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(filter);
    }, 300);

    return () => clearTimeout(timer);
  }, [filter, onSearch]);

  // Kategori değişikliği
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({ ...prev, category: e.target.value as GameCategory }));
  };

  // Zorluk değişikliği
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({ ...prev, difficulty: e.target.value as 'kolay' | 'orta' | 'zor' | 'tümü' }));
  };

  // Sıralama değişikliği
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({ ...prev, sortBy: e.target.value as 'rating' | 'play_count' | 'created_at' }));
  };

  // Sıralama yönü değişikliği
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }));
  };

  // Arama metni değişikliği
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: e.target.value }));
  };

  // Filtreleri sıfırla
  const handleReset = () => {
    setFilter({
      category: 'tümü',
      difficulty: 'tümü',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Oyun Ara</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Arama kutusu */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium mb-1">
            Arama
          </label>
          <Input
            id="search"
            type="text"
            placeholder="Oyun adı ara..."
            value={filter.search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        {/* Kategori filtresi */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Kategori
          </label>
          <Select
            id="category"
            value={filter.category}
            onChange={handleCategoryChange}
            className="w-full"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Select>
        </div>
        
        {/* Zorluk filtresi */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
            Zorluk
          </label>
          <Select
            id="difficulty"
            value={filter.difficulty}
            onChange={handleDifficultyChange}
            className="w-full"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </Select>
        </div>
        
        {/* Sıralama */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
            Sıralama
          </label>
          <div className="flex space-x-2">
            <Select
              id="sortBy"
              value={filter.sortBy}
              onChange={handleSortChange}
              className="w-full"
            >
              <option value="created_at">Tarih</option>
              <option value="rating">Puan</option>
              <option value="play_count">Popülerlik</option>
            </Select>
            <Select
              id="sortOrder"
              value={filter.sortOrder}
              onChange={handleSortOrderChange}
              className="w-20"
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="mr-2"
        >
          Sıfırla
        </Button>
      </div>
    </div>
  );
} 