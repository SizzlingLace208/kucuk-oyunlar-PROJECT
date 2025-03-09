'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import MessageList from '@/components/messages/MessageList';
import MessageDetail from '@/components/messages/MessageDetail';
import { Skeleton } from '@/components/ui/skeleton';

interface MessagePageProps {
  params: {
    id: string;
  };
}

export default function MessagePage({ params }: MessagePageProps) {
  const { id: friendId } = params;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [friendName, setFriendName] = useState<string | undefined>(undefined);
  const [loadingFriend, setLoadingFriend] = useState(true);
  
  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    async function loadFriendInfo() {
      try {
        setLoadingFriend(true);
        
        // Arkadaş bilgilerini Supabase'den çek
        const supabase = (await import('@/lib/supabase/client')).supabase;
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', friendId)
          .single();
        
        if (error) {
          console.error('Arkadaş bilgileri alınırken hata:', error);
        } else if (data) {
          setFriendName(data.username || undefined);
        }
      } catch (err) {
        console.error('Arkadaş bilgileri alınırken hata:', err);
      } finally {
        setLoadingFriend(false);
      }
    }
    
    if (friendId) {
      loadFriendInfo();
    }
  }, [friendId]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse h-8 w-48 bg-secondary/50 rounded-md mb-8"></div>
        <div className="animate-pulse h-[500px] w-full bg-secondary/50 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mesajlar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <MessageList />
        </div>
        
        <div className="md:col-span-2">
          {loadingFriend ? (
            <div className="bg-card border border-border rounded-lg p-6">
              <Skeleton className="h-7 w-32 mb-6" />
              <Skeleton className="h-[500px] w-full" />
            </div>
          ) : (
            <MessageDetail friendId={friendId} friendName={friendName} />
          )}
        </div>
      </div>
    </div>
  );
} 