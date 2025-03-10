import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/supabase/auth';

export interface GameSession {
  id: string;
  game_id: string;
  host_id: string;
  status: 'waiting' | 'playing' | 'completed';
  max_players: number;
  current_players: number;
  created_at: string;
  updated_at: string | null;
  metadata?: Record<string, unknown>;
  host?: {
    name: string;
    avatar_url: string;
  };
}

export interface GamePlayer {
  id: string;
  session_id: string;
  user_id: string;
  status: 'waiting' | 'ready' | 'playing' | 'disconnected';
  joined_at: string;
  score: number | null;
  metadata?: Record<string, unknown>;
  user?: {
    name: string;
    avatar_url: string;
  };
}

export interface GameSessionFilter {
  game_id?: string;
  status?: 'waiting' | 'playing' | 'completed';
  host_id?: string;
  sort_by?: 'created_at' | 'current_players';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Yeni bir oyun oturumu oluşturur
 */
export async function createGameSession(
  gameId: string,
  maxPlayers: number = 2,
  metadata: Record<string, unknown> = {}
): Promise<{ data: GameSession | null; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: { message: 'Kullanıcı giriş yapmamış', details: '', hint: '', code: '403' } as PostgrestError };
    }

    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        game_id: gameId,
        host_id: user.id,
        status: 'waiting',
        max_players: maxPlayers,
        current_players: 1,
        metadata
      })
      .select('*')
      .single();

    if (!error) {
      // Oturum oluşturulduğunda, ev sahibini oyuncu olarak ekle
      await joinGameSession(data.id);
    }

    return { data: data as GameSession, error };
  } catch (err) {
    console.error('Oyun oturumu oluşturulurken hata oluştu:', err);
    return { data: null, error: { message: 'Oyun oturumu oluşturulurken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Bir oyun oturumuna katılır
 */
export async function joinGameSession(
  sessionId: string,
  metadata: Record<string, unknown> = {}
): Promise<{ data: GamePlayer | null; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: { message: 'Kullanıcı giriş yapmamış', details: '', hint: '', code: '403' } as PostgrestError };
    }

    // Önce oturumu kontrol et
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      return { data: null, error: sessionError };
    }

    if (session.status !== 'waiting') {
      return { data: null, error: { message: 'Bu oyun oturumuna artık katılamazsınız', details: '', hint: '', code: '400' } as PostgrestError };
    }

    if (session.current_players >= session.max_players) {
      return { data: null, error: { message: 'Bu oyun oturumu dolu', details: '', hint: '', code: '400' } as PostgrestError };
    }

    // Kullanıcının zaten oturumda olup olmadığını kontrol et
    const { data: existingPlayer } = await supabase
      .from('game_players')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingPlayer) {
      // Kullanıcı zaten oturumda, durumunu güncelle
      const { data: updatedPlayer, error: updateError } = await supabase
        .from('game_players')
        .update({
          status: 'waiting',
          metadata
        })
        .eq('id', existingPlayer.id)
        .select('*')
        .single();

      return { data: updatedPlayer as GamePlayer, error: updateError };
    }

    // Yeni oyuncu ekle
    const { data: player, error: playerError } = await supabase
      .from('game_players')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        status: 'waiting',
        metadata
      })
      .select('*')
      .single();

    if (!playerError) {
      // Oturumdaki oyuncu sayısını güncelle
      await supabase
        .from('game_sessions')
        .update({
          current_players: session.current_players + 1
        })
        .eq('id', sessionId);
    }

    return { data: player as GamePlayer, error: playerError };
  } catch (err) {
    console.error('Oyun oturumuna katılırken hata oluştu:', err);
    return { data: null, error: { message: 'Oyun oturumuna katılırken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Bir oyun oturumundan ayrılır
 */
export async function leaveGameSession(
  sessionId: string
): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: { message: 'Kullanıcı giriş yapmamış', details: '', hint: '', code: '403' } as PostgrestError };
    }

    // Önce oyuncuyu bul
    const { data: player, error: playerError } = await supabase
      .from('game_players')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (playerError) {
      return { success: false, error: playerError };
    }

    // Oyuncuyu sil
    const { error: deleteError } = await supabase
      .from('game_players')
      .delete()
      .eq('id', player.id);

    if (deleteError) {
      return { success: false, error: deleteError };
    }

    // Oturumu kontrol et
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      return { success: false, error: sessionError };
    }

    // Ev sahibi ayrılıyorsa oturumu kapat
    if (session.host_id === user.id) {
      await supabase
        .from('game_sessions')
        .update({
          status: 'completed'
        })
        .eq('id', sessionId);
    } else {
      // Değilse oyuncu sayısını güncelle
      await supabase
        .from('game_sessions')
        .update({
          current_players: Math.max(0, session.current_players - 1)
        })
        .eq('id', sessionId);
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Oyun oturumundan ayrılırken hata oluştu:', err);
    return { success: false, error: { message: 'Oyun oturumundan ayrılırken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Oyun oturumunun durumunu günceller
 */
export async function updateGameSessionStatus(
  sessionId: string,
  status: 'waiting' | 'playing' | 'completed'
): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: { message: 'Kullanıcı giriş yapmamış', details: '', hint: '', code: '403' } as PostgrestError };
    }

    // Oturumu kontrol et
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      return { success: false, error: sessionError };
    }

    // Sadece ev sahibi durumu güncelleyebilir
    if (session.host_id !== user.id) {
      return { success: false, error: { message: 'Sadece ev sahibi oyun durumunu güncelleyebilir', details: '', hint: '', code: '403' } as PostgrestError };
    }

    // Durumu güncelle
    const { error } = await supabase
      .from('game_sessions')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    return { success: !error, error };
  } catch (err) {
    console.error('Oyun oturumu durumu güncellenirken hata oluştu:', err);
    return { success: false, error: { message: 'Oyun oturumu durumu güncellenirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Oyuncu durumunu günceller
 */
export async function updatePlayerStatus(
  sessionId: string,
  status: 'waiting' | 'ready' | 'playing' | 'disconnected',
  score?: number
): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: { message: 'Kullanıcı giriş yapmamış', details: '', hint: '', code: '403' } as PostgrestError };
    }

    // Oyuncuyu bul
    const { data: player, error: playerError } = await supabase
      .from('game_players')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (playerError) {
      return { success: false, error: playerError };
    }

    // Durumu güncelle
    const updateData: { status: string; score?: number } = { status };
    if (score !== undefined) {
      updateData.score = score;
    }

    const { error } = await supabase
      .from('game_players')
      .update(updateData)
      .eq('id', player.id);

    return { success: !error, error };
  } catch (err) {
    console.error('Oyuncu durumu güncellenirken hata oluştu:', err);
    return { success: false, error: { message: 'Oyuncu durumu güncellenirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Aktif oyun oturumlarını getirir
 */
export async function getGameSessions(
  filter: Partial<GameSessionFilter> = {}
): Promise<{ data: GameSession[] | null; error: PostgrestError | null }> {
  try {
    let query = supabase
      .from('game_sessions')
      .select(`
        *,
        host:host_id (
          name,
          avatar_url
        )
      `);

    // Filtreler
    if (filter.game_id) {
      query = query.eq('game_id', filter.game_id);
    }
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    if (filter.host_id) {
      query = query.eq('host_id', filter.host_id);
    }

    // Sıralama
    const sortBy = filter.sort_by || 'created_at';
    const sortOrder = filter.sort_order || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Limit ve offset
    if (filter.limit) {
      query = query.limit(filter.limit);
    }
    if (filter.offset) {
      query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
    }

    const { data, error } = await query;
    return { data: data as GameSession[] | null, error };
  } catch (err) {
    console.error('Oyun oturumları getirilirken hata oluştu:', err);
    return { data: null, error: { message: 'Oyun oturumları getirilirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Belirli bir oyun oturumunu getirir
 */
export async function getGameSession(
  sessionId: string
): Promise<{ data: GameSession | null; error: PostgrestError | null }> {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .select(`
        *,
        host:host_id (
          name,
          avatar_url
        )
      `)
      .eq('id', sessionId)
      .single();

    return { data: data as GameSession | null, error };
  } catch (err) {
    console.error('Oyun oturumu getirilirken hata oluştu:', err);
    return { data: null, error: { message: 'Oyun oturumu getirilirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Bir oyun oturumundaki oyuncuları getirir
 */
export async function getSessionPlayers(
  sessionId: string
): Promise<{ data: GamePlayer[] | null; error: PostgrestError | null }> {
  try {
    const { data, error } = await supabase
      .from('game_players')
      .select(`
        *,
        user:user_id (
          name,
          avatar_url
        )
      `)
      .eq('session_id', sessionId);

    return { data: data as GamePlayer[] | null, error };
  } catch (err) {
    console.error('Oyun oturumu oyuncuları getirilirken hata oluştu:', err);
    return { data: null, error: { message: 'Oyun oturumu oyuncuları getirilirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Gerçek zamanlı oyun oturumu güncellemelerini dinler
 */
export function subscribeToGameSession(
  sessionId: string,
  callback: (session: GameSession) => void
): { unsubscribe: () => void } {
  const subscription = supabase
    .channel(`game_session:${sessionId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'game_sessions',
      filter: `id=eq.${sessionId}`
    }, (payload) => {
      callback(payload.new as GameSession);
    })
    .subscribe();

  return {
    unsubscribe: () => {
      subscription.unsubscribe();
    }
  };
}

/**
 * Gerçek zamanlı oyuncu güncellemelerini dinler
 */
export function subscribeToSessionPlayers(
  sessionId: string,
  callback: (players: GamePlayer[]) => void
): { unsubscribe: () => void } {
  const subscription = supabase
    .channel(`game_players:${sessionId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'game_players',
      filter: `session_id=eq.${sessionId}`
    }, async () => {
      // Oyuncu değişikliği olduğunda tüm oyuncuları getir
      const { data } = await getSessionPlayers(sessionId);
      if (data) {
        callback(data);
      }
    })
    .subscribe();

  return {
    unsubscribe: () => {
      subscription.unsubscribe();
    }
  };
} 