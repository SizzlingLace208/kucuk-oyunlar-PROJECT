'use client';

import { useState, useEffect } from 'react';
import { getConversations } from '@/lib/services/message-service';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

type Conversation = {
  friendId: string;
  friendName: string | null;
  friendAvatar: string | null;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
};

export default function MessageList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadConversations() {
      try {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);
      } catch (err) {
        setError('Mesajlar yüklenirken bir hata oluştu.');
        console.error('Mesajlar yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadConversations();
    
    // 30 saniyede bir yenile
    const interval = setInterval(loadConversations, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return <MessageListSkeleton />;
  }
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Mesajlar</h2>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {conversations.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">Henüz mesajınız yok</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div key={conversation.friendId} className="block">
              <a href={`/messages/${conversation.friendId}`} className="block">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/5 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mr-3 relative">
                      {conversation.friendAvatar ? (
                        <img 
                          src={conversation.friendAvatar} 
                          alt={conversation.friendName || 'Kullanıcı'} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-bold">{conversation.friendName?.charAt(0) || '?'}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{conversation.friendName || 'Kullanıcı'}</h3>
                        <span className="text-xs text-muted-foreground ml-2">{conversation.lastMessageDate}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageListSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <Skeleton className="h-7 w-32 mb-6" />
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-3" />
              <div>
                <div className="flex items-center mb-1">
                  <Skeleton className="h-5 w-24 mr-2" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 