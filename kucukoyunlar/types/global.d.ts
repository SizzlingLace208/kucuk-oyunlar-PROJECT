/**
 * Global tip tanımlamaları
 * Bu dosya, projedeki tüm dosyalarda kullanılabilecek global tip tanımlamalarını içerir.
 */

// JSX namespace tanımlaması
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Node.js global değişkenleri
declare var process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_JWT_SECRET: string;
    NEXT_PUBLIC_SUPABASE_PROJECT_ID: string;
    [key: string]: string | undefined;
  };
  [key: string]: any;
};

declare var __dirname: string;
declare var __filename: string;
declare function require(id: string): any;

// Global tip tanımlamaları
declare global {
  // Uygulama genelinde kullanılacak tipler
  interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
  }

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
    comments?: GameComment[];
  }

  interface GameComment {
    id: string;
    user: string;
    avatar?: string;
    date: string;
    rating: number;
    text: string;
  }

  interface Score {
    id: string;
    userId: string;
    gameId: string;
    score: number;
    date: string;
  }

  // Diğer global tipler buraya eklenebilir
}

export {}; 