import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export type Game = Database['public']['Tables']['games']['Row'];

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

  return { data, error };
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

  return { data, error };
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

  return { data, error };
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
  return { data, error };
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

  return { data, error };
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

  return { data, error };
}

/**
 * Oyun oynama sayısını artırır
 */
export async function incrementPlayCount(gameId: string): Promise<{ success: boolean; error: PostgrestError | null }> {
  const { data: game, error: fetchError } = await getGameById(gameId);
  
  if (fetchError || !game) {
    return { success: false, error: fetchError };
  }
  
  const currentCount = game.play_count || 0;
  
  const { error } = await supabase
    .from('games')
    .update({ play_count: currentCount + 1 })
    .eq('id', gameId);
    
  return { success: !error, error };
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
    
  return { data, error };
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