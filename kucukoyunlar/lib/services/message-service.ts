import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export type Message = {
  id: string;
  senderId: string;
  senderName: string | null;
  senderAvatar: string | null;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
};

export async function sendMessage(receiverId: string, content: string): Promise<boolean> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcının kendi ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }
    
    // Mesajı gönder
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        is_read: false,
      });
    
    if (error) {
      console.error('Mesaj gönderilirken hata:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Mesaj gönderilirken hata:', error);
    return false;
  }
}

export async function getConversation(friendId: string): Promise<Message[]> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcının kendi ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }
    
    // İki yönlü mesajları al
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        is_read,
        sender_id,
        receiver_id,
        profiles!messages_sender_id_fkey (
          username,
          avatar_url
        )
      `)
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Mesajlar alınırken hata:', error);
      return [];
    }
    
    if (!data) return [];
    
    // Okunmamış mesajları okundu olarak işaretle
    const unreadMessages = data
      .filter((msg: any) => msg.receiver_id === user.id && !msg.is_read)
      .map((msg: any) => msg.id);
    
    if (unreadMessages.length > 0) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', unreadMessages);
    }
    
    return data.map((msg: any) => ({
      id: msg.id,
      senderId: msg.sender_id,
      senderName: msg.profiles.username,
      senderAvatar: msg.profiles.avatar_url,
      receiverId: msg.receiver_id,
      content: msg.content,
      createdAt: formatMessageDate(new Date(msg.created_at)),
      isRead: msg.is_read,
    }));
  } catch (error) {
    console.error('Mesajlar alınırken hata:', error);
    return [];
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcının kendi ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }
    
    // Okunmamış mesajları say
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);
    
    if (error) {
      console.error('Okunmamış mesaj sayısı alınırken hata:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Okunmamış mesaj sayısı alınırken hata:', error);
    return 0;
  }
}

export async function getConversations(): Promise<{ friendId: string; friendName: string | null; friendAvatar: string | null; lastMessage: string; lastMessageDate: string; unreadCount: number }[]> {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Kullanıcının kendi ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }
    
    // Tüm konuşmaları al
    const { data: sentMessages, error: sentError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        is_read,
        receiver_id,
        profiles!messages_receiver_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });
    
    if (sentError) {
      console.error('Gönderilen mesajlar alınırken hata:', sentError);
      return [];
    }
    
    const { data: receivedMessages, error: receivedError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        is_read,
        sender_id,
        profiles!messages_sender_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });
    
    if (receivedError) {
      console.error('Alınan mesajlar alınırken hata:', receivedError);
      return [];
    }
    
    // Konuşmaları birleştir ve grupla
    const conversations = new Map<string, { 
      friendId: string; 
      friendName: string | null; 
      friendAvatar: string | null; 
      lastMessage: string; 
      lastMessageDate: Date;
      unreadCount: number;
    }>();
    
    // Gönderilen mesajları ekle
    sentMessages?.forEach((msg: any) => {
      const friendId = msg.receiver_id;
      const lastMessageDate = new Date(msg.created_at);
      
      if (!conversations.has(friendId) || lastMessageDate > conversations.get(friendId)!.lastMessageDate) {
        conversations.set(friendId, {
          friendId,
          friendName: msg.profiles.username,
          friendAvatar: msg.profiles.avatar_url,
          lastMessage: msg.content,
          lastMessageDate,
          unreadCount: 0
        });
      }
    });
    
    // Alınan mesajları ekle
    receivedMessages?.forEach((msg: any) => {
      const friendId = msg.sender_id;
      const lastMessageDate = new Date(msg.created_at);
      
      if (!conversations.has(friendId) || lastMessageDate > conversations.get(friendId)!.lastMessageDate) {
        conversations.set(friendId, {
          friendId,
          friendName: msg.profiles.username,
          friendAvatar: msg.profiles.avatar_url,
          lastMessage: msg.content,
          lastMessageDate,
          unreadCount: msg.is_read ? 0 : 1
        });
      } else if (!msg.is_read) {
        // Okunmamış mesaj sayısını artır
        conversations.get(friendId)!.unreadCount += 1;
      }
    });
    
    // Tarihe göre sırala ve formatla
    return Array.from(conversations.values())
      .sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime())
      .map(conv => ({
        ...conv,
        lastMessageDate: formatMessageDate(conv.lastMessageDate)
      }));
  } catch (error) {
    console.error('Konuşmalar alınırken hata:', error);
    return [];
  }
}

// Yardımcı fonksiyonlar
function formatMessageDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Bugün
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Dün
    return 'Dün ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    // Bu hafta
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[date.getDay()];
  } else {
    // Daha eski
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' });
  }
} 