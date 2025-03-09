'use client';

import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  gameId: string;
  initialState?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

export default function FavoriteButton({
  gameId,
  initialState = false,
  onToggle,
  className = '',
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialState);
  const [isAnimating, setIsAnimating] = useState(false);

  // Favori durumunu localStorage'dan yükle
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(gameId));
  }, [gameId]);

  const toggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    setIsAnimating(true);
    
    // localStorage'a kaydet
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (newState) {
      newFavorites = [...favorites, gameId];
    } else {
      newFavorites = favorites.filter((id: string) => id !== gameId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // Callback'i çağır
    if (onToggle) {
      onToggle(newState);
    }
    
    // Animasyon için timeout
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`relative flex items-center justify-center transition-transform ${
        isAnimating ? 'scale-125' : 'scale-100'
      } ${className}`}
      aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-6 h-6 ${
          isFavorite ? 'text-accent' : 'text-muted-foreground'
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
} 