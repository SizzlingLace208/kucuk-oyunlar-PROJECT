import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  totalGamesPlayed: number;
  favoriteCategory: string | null;
  level: number;
  xp: number;
  nextLevelXp: number;
  avatarUrl: string | null;
};

export type UserAchievement = {
  id: number;
  name: string;
  description: string;
  date: string;
  icon: string;
};

export type RecentGame = {
  id: string;
  title: string;
  date: string;
  score: number;
  category: string;
};

export type Friend = {
  id: string;
  username: string;
  status: 'online' | 'offline';
  avatarUrl: string | null;
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcı profilini çek
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Profil çekilirken hata oluştu:', error);
      return null;
    }
    
    if (!profile) return null;
    
    // Oyun istatistiklerini çek
    const { data: gameStats, error: gameStatsError } = await supabase
      .from('game_stats')
      .select('total_games_played, favorite_category')
      .eq('user_id', userId)
      .single();
    
    if (gameStatsError && gameStatsError.code !== 'PGRST116') {
      console.error('Oyun istatistikleri çekilirken hata oluştu:', gameStatsError);
    }
    
    // Seviye hesaplama
    const level = Math.floor(profile.xp / 1000) + 1;
    const nextLevelXp = level * 1000;
    
    // Üyelik tarihini formatla
    const joinDate = new Date(profile.created_at).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      id: profile.id,
      username: profile.username || 'Kullanıcı',
      email: profile.email || '',
      joinDate,
      totalGamesPlayed: gameStats?.total_games_played || 0,
      favoriteCategory: gameStats?.favorite_category || null,
      level,
      xp: profile.xp || 0,
      nextLevelXp,
      avatarUrl: profile.avatar_url
    };
  } catch (error) {
    console.error('Kullanıcı profili çekilirken hata oluştu:', error);
    return null;
  }
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        id,
        achievement_id,
        unlocked_at,
        achievements (
          name,
          description,
          icon
        )
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    
    if (error) {
      console.error('Başarılar çekilirken hata oluştu:', error);
      return [];
    }
    
    if (!data) return [];
    
    return data.map((item: any) => ({
      id: item.achievement_id,
      name: item.achievements.name,
      description: item.achievements.description,
      date: new Date(item.unlocked_at).toLocaleDateString('tr-TR'),
      icon: item.achievements.icon
    }));
  } catch (error) {
    console.error('Başarılar çekilirken hata oluştu:', error);
    return [];
  }
}

export async function getRecentGames(userId: string): Promise<RecentGame[]> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    const { data, error } = await supabase
      .from('game_history')
      .select(`
        id,
        game_id,
        score,
        played_at,
        games (
          title,
          category
        )
      `)
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('Son oyunlar çekilirken hata oluştu:', error);
      return [];
    }
    
    if (!data) return [];
    
    return data.map((item: any) => {
      // Tarih formatlaması
      const playedDate = new Date(item.played_at);
      const now = new Date();
      const diffMs = now.getTime() - playedDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      let dateStr = '';
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          dateStr = `${diffMinutes} dakika önce`;
        } else {
          dateStr = `${diffHours} saat önce`;
        }
      } else if (diffDays === 1) {
        dateStr = 'Dün';
      } else {
        dateStr = `${diffDays} gün önce`;
      }
      
      return {
        id: item.id,
        title: item.games.title,
        date: dateStr,
        score: item.score,
        category: item.games.category
      };
    });
  } catch (error) {
    console.error('Son oyunlar çekilirken hata oluştu:', error);
    return [];
  }
}

export async function getFriends(userId: string): Promise<Friend[]> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Arkadaşlık ilişkilerini çek
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select(`
        friend_id,
        profiles!friendships_friend_id_fkey (
          id,
          username,
          avatar_url,
          last_seen
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');
    
    if (error) {
      console.error('Arkadaşlar çekilirken hata oluştu:', error);
      return [];
    }
    
    if (!friendships) return [];
    
    const now = new Date();
    
    return friendships.map((friendship: any) => {
      const friend = friendship.profiles;
      const lastSeen = friend.last_seen ? new Date(friend.last_seen) : null;
      const isOnline = lastSeen ? (now.getTime() - lastSeen.getTime() < 5 * 60 * 1000) : false;
      
      return {
        id: friend.id,
        username: friend.username || 'Kullanıcı',
        status: isOnline ? 'online' : 'offline',
        avatarUrl: friend.avatar_url
      };
    });
  } catch (error) {
    console.error('Arkadaşlar çekilirken hata oluştu:', error);
    return [];
  }
} 