import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/supabase/auth';

export interface Comment {
  id: string;
  game_id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
  updated_at?: string | null;
  user?: {
    name: string;
    avatar_url: string;
  };
}

export interface CommentFilter {
  game_id?: string;
  user_id?: string;
  sort_by?: 'created_at' | 'rating';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Yorum ekler
 */
export async function addComment(
  gameId: string,
  content: string,
  rating: number
): Promise<{ data: Comment | null; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: { message: 'Kullanıcı giriş yapmamış', details: '', hint: '', code: '403' } as PostgrestError };
    }

    const { data, error } = await supabase
      .from('game_comments')
      .insert({
        game_id: gameId,
        user_id: user.id,
        content: content,
        rating: rating
      })
      .select('*')
      .single();

    // Oyunun ortalama puanını güncelle
    if (!error) {
      await updateGameAverageRating(gameId);
    }

    return { data: data as Comment, error };
  } catch (err) {
    console.error('Yorum eklenirken hata oluştu:', err);
    return { data: null, error: { message: 'Yorum eklenirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Yorumu günceller
 */
export async function updateComment(
  commentId: string,
  content: string,
  rating: number
): Promise<{ data: Comment | null; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: { message: 'Kullanıcı giriş yapmamış', details: '', hint: '', code: '403' } as PostgrestError };
    }

    // Önce yorumun kullanıcıya ait olup olmadığını kontrol et
    const { data: comment, error: fetchError } = await supabase
      .from('game_comments')
      .select('*')
      .eq('id', commentId)
      .single();

    if (fetchError) {
      return { data: null, error: fetchError };
    }

    if ((comment as Comment).user_id !== user.id) {
      return { data: null, error: { message: 'Bu yorumu düzenleme yetkiniz yok', details: '', hint: '', code: '403' } as PostgrestError };
    }

    const { data, error } = await supabase
      .from('game_comments')
      .update({
        content: content,
        rating: rating,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select('*')
      .single();

    // Oyunun ortalama puanını güncelle
    if (!error) {
      await updateGameAverageRating((comment as Comment).game_id);
    }

    return { data: data as Comment, error };
  } catch (err) {
    console.error('Yorum güncellenirken hata oluştu:', err);
    return { data: null, error: { message: 'Yorum güncellenirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Yorumu siler
 */
export async function deleteComment(
  commentId: string
): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: { message: 'Kullanıcı giriş yapmamış', details: '', hint: '', code: '403' } as PostgrestError };
    }

    // Önce yorumun kullanıcıya ait olup olmadığını kontrol et
    const { data: comment, error: fetchError } = await supabase
      .from('game_comments')
      .select('*')
      .eq('id', commentId)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError };
    }

    if ((comment as Comment).user_id !== user.id) {
      return { success: false, error: { message: 'Bu yorumu silme yetkiniz yok', details: '', hint: '', code: '403' } as PostgrestError };
    }

    const { error } = await supabase
      .from('game_comments')
      .delete()
      .eq('id', commentId);

    // Oyunun ortalama puanını güncelle
    if (!error) {
      await updateGameAverageRating((comment as Comment).game_id);
    }

    return { success: !error, error };
  } catch (err) {
    console.error('Yorum silinirken hata oluştu:', err);
    return { success: false, error: { message: 'Yorum silinirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Oyuna ait yorumları getirir
 */
export async function getGameComments(
  gameId: string,
  filter: Partial<CommentFilter> = {}
): Promise<{ data: Comment[] | null; error: PostgrestError | null }> {
  try {
    let query = supabase
      .from('game_comments')
      .select(`
        *,
        user:user_id (
          name,
          avatar_url
        )
      `)
      .eq('game_id', gameId);

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
    return { data: data as Comment[] | null, error };
  } catch (err) {
    console.error('Yorumlar getirilirken hata oluştu:', err);
    return { data: null, error: { message: 'Yorumlar getirilirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Kullanıcının yorumlarını getirir
 */
export async function getUserComments(
  userId: string,
  filter: Partial<CommentFilter> = {}
): Promise<{ data: Comment[] | null; error: PostgrestError | null }> {
  try {
    let query = supabase
      .from('game_comments')
      .select(`
        *,
        user:user_id (
          name,
          avatar_url
        )
      `)
      .eq('user_id', userId);

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
    return { data: data as Comment[] | null, error };
  } catch (err) {
    console.error('Kullanıcı yorumları getirilirken hata oluştu:', err);
    return { data: null, error: { message: 'Kullanıcı yorumları getirilirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Kullanıcının bir oyuna daha önce yorum yapıp yapmadığını kontrol eder
 */
export async function hasUserCommentedGame(
  gameId: string
): Promise<{ hasCommented: boolean; commentId: string | null; error: PostgrestError | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { hasCommented: false, commentId: null, error: null };
    }

    const { data, error } = await supabase
      .from('game_comments')
      .select('id')
      .eq('game_id', gameId)
      .eq('user_id', user.id)
      .maybeSingle();

    return { 
      hasCommented: !!data, 
      commentId: data?.id || null, 
      error 
    };
  } catch (err) {
    console.error('Kullanıcı yorumu kontrol edilirken hata oluştu:', err);
    return { hasCommented: false, commentId: null, error: { message: 'Kullanıcı yorumu kontrol edilirken bir hata oluştu', details: '', hint: '', code: '500' } as PostgrestError };
  }
}

/**
 * Oyunun ortalama puanını günceller
 */
async function updateGameAverageRating(gameId: string): Promise<void> {
  try {
    // Oyuna ait tüm yorumların ortalama puanını hesapla
    const { data, error } = await supabase
      .from('game_comments')
      .select('rating')
      .eq('game_id', gameId);

    if (error || !data || data.length === 0) {
      return;
    }

    const totalRating = data.reduce((sum, comment) => sum + (comment as any).rating, 0);
    const averageRating = totalRating / data.length;

    // Oyunun ortalama puanını güncelle
    await supabase
      .from('games')
      .update({ rating: averageRating })
      .eq('id', gameId);
  } catch (err) {
    console.error('Oyun puanı güncellenirken hata oluştu:', err);
  }
} 