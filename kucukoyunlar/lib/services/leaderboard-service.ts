import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export type LeaderboardEntry = {
  id: string;
  username: string;
  avatar_url: string | null;
  score: number;
  game_title: string;
  game_id: string;
  played_at: string;
};

export type LeaderboardFilter = {
  gameId?: string;
  timeFrame?: 'all' | 'day' | 'week' | 'month';
  limit?: number;
};

/**
 * Genel liderlik tablosunu getirir
 */
export async function getGlobalLeaderboard(filter: LeaderboardFilter = {}): Promise<{ data: LeaderboardEntry[] | null; error: PostgrestError | null }> {
  const { gameId, timeFrame = 'all', limit = 10 } = filter;
  
  let query = supabase
    .from('game_history')
    .select(`
      id,
      score,
      played_at,
      profiles:user_id (
        id,
        username,
        avatar_url
      ),
      games:game_id (
        id,
        title
      )
    `)
    .order('score', { ascending: false });
  
  // Oyun filtreleme
  if (gameId) {
    query = query.eq('game_id', gameId);
  }
  
  // Zaman aralığı filtreleme
  if (timeFrame !== 'all') {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeFrame) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    query = query.gte('played_at', startDate.toISOString());
  }
  
  // Limit uygulama
  query = query.limit(limit);
  
  const { data, error } = await query;
  
  if (error || !data) {
    return { data: null, error };
  }
  
  // Veriyi dönüştürme
  const leaderboardData: LeaderboardEntry[] = data.map(entry => ({
    id: entry.id,
    username: entry.profiles?.username || 'Anonim',
    avatar_url: entry.profiles?.avatar_url,
    score: entry.score,
    game_title: entry.games?.title || 'Bilinmeyen Oyun',
    game_id: entry.games?.id || '',
    played_at: entry.played_at
  }));
  
  return { data: leaderboardData, error: null };
}

/**
 * Kullanıcının liderlik tablosunu getirir
 */
export async function getUserLeaderboard(userId: string, filter: LeaderboardFilter = {}): Promise<{ data: LeaderboardEntry[] | null; error: PostgrestError | null }> {
  const { gameId, timeFrame = 'all', limit = 10 } = filter;
  
  let query = supabase
    .from('game_history')
    .select(`
      id,
      score,
      played_at,
      profiles:user_id (
        id,
        username,
        avatar_url
      ),
      games:game_id (
        id,
        title
      )
    `)
    .eq('user_id', userId)
    .order('score', { ascending: false });
  
  // Oyun filtreleme
  if (gameId) {
    query = query.eq('game_id', gameId);
  }
  
  // Zaman aralığı filtreleme
  if (timeFrame !== 'all') {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeFrame) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    query = query.gte('played_at', startDate.toISOString());
  }
  
  // Limit uygulama
  query = query.limit(limit);
  
  const { data, error } = await query;
  
  if (error || !data) {
    return { data: null, error };
  }
  
  // Veriyi dönüştürme
  const leaderboardData: LeaderboardEntry[] = data.map(entry => ({
    id: entry.id,
    username: entry.profiles?.username || 'Anonim',
    avatar_url: entry.profiles?.avatar_url,
    score: entry.score,
    game_title: entry.games?.title || 'Bilinmeyen Oyun',
    game_id: entry.games?.id || '',
    played_at: entry.played_at
  }));
  
  return { data: leaderboardData, error: null };
}

/**
 * Belirli bir oyunun liderlik tablosunu getirir
 */
export async function getGameLeaderboard(gameId: string, filter: LeaderboardFilter = {}): Promise<{ data: LeaderboardEntry[] | null; error: PostgrestError | null }> {
  return getGlobalLeaderboard({ ...filter, gameId });
}

/**
 * Kullanıcının belirli bir oyundaki sıralamasını getirir
 */
export async function getUserRank(userId: string, gameId: string): Promise<{ rank: number | null; error: PostgrestError | null }> {
  // Önce kullanıcının skorunu al
  const { data: userScore, error: userScoreError } = await supabase
    .from('game_history')
    .select('score')
    .eq('user_id', userId)
    .eq('game_id', gameId)
    .order('score', { ascending: false })
    .limit(1)
    .single();
  
  if (userScoreError || !userScore) {
    return { rank: null, error: userScoreError };
  }
  
  // Kullanıcının skorundan daha yüksek skorları say
  const { count, error: countError } = await supabase
    .from('game_history')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId)
    .gt('score', userScore.score);
  
  if (countError) {
    return { rank: null, error: countError };
  }
  
  // Sıralama = daha yüksek skor sayısı + 1
  return { rank: (count || 0) + 1, error: null };
} 