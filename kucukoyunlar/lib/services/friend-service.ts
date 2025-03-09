import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Friend } from './user-service';

export type FriendRequest = {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export async function sendFriendRequest(friendId: string): Promise<boolean> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcının kendi ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }
    
    // Arkadaşlık isteği zaten var mı kontrol et
    const { data: existingRequest, error: checkError } = await supabase
      .from('friendships')
      .select('*')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Arkadaşlık isteği kontrolünde hata:', checkError);
      return false;
    }
    
    if (existingRequest) {
      throw new Error('Bu kullanıcıyla zaten bir arkadaşlık ilişkiniz var');
    }
    
    // Arkadaşlık isteği gönder
    const { error } = await supabase
      .from('friendships')
      .insert({
        user_id: user.id,
        friend_id: friendId,
        status: 'pending',
      });
    
    if (error) {
      console.error('Arkadaşlık isteği gönderilirken hata:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Arkadaşlık isteği gönderilirken hata:', error);
    return false;
  }
}

export async function acceptFriendRequest(requestId: string): Promise<boolean> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Arkadaşlık isteğini kabul et
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId);
    
    if (error) {
      console.error('Arkadaşlık isteği kabul edilirken hata:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Arkadaşlık isteği kabul edilirken hata:', error);
    return false;
  }
}

export async function rejectFriendRequest(requestId: string): Promise<boolean> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Arkadaşlık isteğini reddet
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', requestId);
    
    if (error) {
      console.error('Arkadaşlık isteği reddedilirken hata:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Arkadaşlık isteği reddedilirken hata:', error);
    return false;
  }
}

export async function removeFriend(friendId: string): Promise<boolean> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcının kendi ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }
    
    // Arkadaşlık ilişkisini sil
    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
    
    if (error) {
      console.error('Arkadaş silinirken hata:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Arkadaş silinirken hata:', error);
    return false;
  }
}

export async function getPendingFriendRequests(): Promise<FriendRequest[]> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcının kendi ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }
    
    // Bekleyen arkadaşlık isteklerini al
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        created_at,
        user_id,
        profiles!friendships_user_id_fkey (
          username,
          avatar_url
        )
      `)
      .eq('friend_id', user.id)
      .eq('status', 'pending');
    
    if (error) {
      console.error('Arkadaşlık istekleri alınırken hata:', error);
      return [];
    }
    
    if (!data) return [];
    
    return data.map((request: any) => ({
      id: request.id,
      username: request.profiles.username,
      avatarUrl: request.profiles.avatar_url,
      createdAt: new Date(request.created_at).toLocaleDateString('tr-TR')
    }));
  } catch (error) {
    console.error('Arkadaşlık istekleri alınırken hata:', error);
    return [];
  }
}

export async function searchUsers(query: string): Promise<Friend[]> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcının kendi ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }
    
    // Kullanıcıları ara
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, last_seen')
      .neq('id', user.id)
      .ilike('username', `%${query}%`)
      .limit(10);
    
    if (error) {
      console.error('Kullanıcılar aranırken hata:', error);
      return [];
    }
    
    if (!data) return [];
    
    const now = new Date();
    
    return data.map((profile: any) => {
      const lastSeen = profile.last_seen ? new Date(profile.last_seen) : null;
      const isOnline = lastSeen ? (now.getTime() - lastSeen.getTime() < 5 * 60 * 1000) : false;
      
      return {
        id: profile.id,
        username: profile.username || 'Kullanıcı',
        status: isOnline ? 'online' : 'offline',
        avatarUrl: profile.avatar_url
      };
    });
  } catch (error) {
    console.error('Kullanıcılar aranırken hata:', error);
    return [];
  }
} 