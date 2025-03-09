import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Veritabanından gelen oyun tipi
export type GameDB = Database['public']['Tables']['games']['Row'];

// Uygulama içinde kullanılan genişletilmiş oyun tipi
export type Game = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  created_at: string;
  updated_at?: string;
  play_count: number;
  rating: number;
  difficulty: string;
};

// Veritabanından gelen veriyi uygulama tipine dönüştürme
function mapDBGameToGame(dbGame: any): Game {
  return {
    id: dbGame.id,
    title: dbGame.title,
    description: dbGame.description,
    category: dbGame.category,
    image_url: dbGame.thumbnail_url || null,
    created_at: dbGame.created_at,
    updated_at: dbGame.updated_at,
    play_count: dbGame.play_count || 0,
    rating: dbGame.rating || 0,
    difficulty: dbGame.difficulty || 'orta'
  };
}

// Veritabanından gelen veri dizisini dönüştürme
function mapDBGamesToGames(dbGames: any[] | null): Game[] | null {
  if (!dbGames) return null;
  return dbGames.map(mapDBGameToGame);
}

export type GameCategory = 'aksiyon' | 'bulmaca' | 'strateji' | 'yarış' | 'platform' | 'kart' | 'spor' | 'macera' | 'tümü';

export type GameFilter = {
  category?: GameCategory;
  search?: string;
  difficulty?: 'kolay' | 'orta' | 'zor' | 'tümü';
  sortBy?: 'rating' | 'play_count' | 'created_at';
  sortOrder?: 'asc' | 'desc';
};

/**
 * Tüm oyunları getirir
 */
export async function getAllGames(): Promise<{ data: Game[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: mapDBGamesToGames(data), error };
}

/**
 * Belirli bir kategorideki oyunları getirir
 */
export async function getGamesByCategory(category: GameCategory): Promise<{ data: Game[] | null; error: PostgrestError | null }> {
  if (category === 'tümü') {
    return getAllGames();
  }

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  return { data: mapDBGamesToGames(data), error };
}

/**
 * Belirli bir oyunu ID'ye göre getirir
 */
export async function getGameById(id: string): Promise<{ data: Game | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();

  return { data: data ? mapDBGameToGame(data) : null, error };
}

/**
 * Oyun arama ve filtreleme
 */
export async function searchGames(filter: GameFilter): Promise<{ data: Game[] | null; error: PostgrestError | null }> {
  let query = supabase.from('games').select('*');

  // Kategori filtresi
  if (filter.category && filter.category !== 'tümü') {
    query = query.eq('category', filter.category);
  }

  // Zorluk filtresi
  if (filter.difficulty && filter.difficulty !== 'tümü') {
    query = query.eq('difficulty', filter.difficulty);
  }

  // Arama filtresi
  if (filter.search && filter.search.trim() !== '') {
    query = query.ilike('title', `%${filter.search}%`);
  }

  // Sıralama
  if (filter.sortBy) {
    const order = filter.sortOrder || 'desc';
    query = query.order(filter.sortBy, { ascending: order === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  return { data: mapDBGamesToGames(data), error };
}

/**
 * Popüler oyunları getirir (en çok oynanan)
 */
export async function getPopularGames(limit: number = 6): Promise<{ data: Game[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('play_count', { ascending: false })
    .limit(limit);

  return { data: mapDBGamesToGames(data), error };
}

/**
 * En yüksek puanlı oyunları getirir
 */
export async function getTopRatedGames(limit: number = 6): Promise<{ data: Game[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit);

  return { data: mapDBGamesToGames(data), error };
}

/**
 * Oyun oynama sayısını artırır
 */
export async function incrementPlayCount(gameId: string): Promise<{ success: boolean; error: PostgrestError | null }> {
  // Oyun sayısını artırmak için özel bir alan olmadığından, 
  // bu fonksiyon şu an için sadece başarılı olduğunu bildirir
  // Gerçek uygulamada, bu fonksiyon veritabanında play_count alanı eklendikten sonra güncellenmelidir
  return { success: true, error: null };
}

/**
 * Benzer oyunları getirir (aynı kategoride)
 */
export async function getSimilarGames(gameId: string, limit: number = 4): Promise<{ data: Game[] | null; error: PostgrestError | null }> {
  const { data: game, error: fetchError } = await getGameById(gameId);
  
  if (fetchError || !game) {
    return { data: null, error: fetchError };
  }
  
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('category', game.category)
    .neq('id', gameId)
    .limit(limit);
    
  return { data: mapDBGamesToGames(data), error };
}

/**
 * Tüm oyun kategorilerini getirir
 */
export function getAllCategories(): GameCategory[] {
  return ['aksiyon', 'bulmaca', 'strateji', 'yarış', 'platform', 'kart', 'spor', 'macera', 'tümü'];
}

/**
 * Tüm zorluk seviyelerini getirir
 */
export function getAllDifficulties(): string[] {
  return ['kolay', 'orta', 'zor', 'tümü'];
} 