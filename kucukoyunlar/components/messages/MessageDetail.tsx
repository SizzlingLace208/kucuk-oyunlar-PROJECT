'use client';

import { useState, useEffect, useRef } from 'react';
import { getConversation, sendMessage, Message } from '@/lib/services/message-service';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/context/AuthContext';

interface MessageDetailProps {
  friendId: string;
  friendName?: string;
}

export default function MessageDetail({ friendId, friendName }: MessageDetailProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);
        const data = await getConversation(friendId);
        setMessages(data);
      } catch (err) {
        setError('Mesajlar yüklenirken bir hata oluştu.');
        console.error('Mesajlar yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadMessages();
    
    // 5 saniyede bir yenile
    const interval = setInterval(loadMessages, 5000);
    
    return () => clearInterval(interval);
  }, [friendId]);
  
  // Mesajlar yüklendiğinde veya yeni mesaj geldiğinde aşağı kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }
    
    try {
      setSending(true);
      const success = await sendMessage(friendId, newMessage);
      
      if (success) {
        // Mesaj gönderildikten sonra input'u temizle
        setNewMessage('');
        
        // Mesajları yenile
        const updatedMessages = await getConversation(friendId);
        setMessages(updatedMessages);
      } else {
        setError('Mesaj gönderilirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Mesaj gönderilirken bir hata oluştu.');
      console.error('Mesaj gönderilirken hata:', err);
    } finally {
      setSending(false);
    }
  }
  
  if (loading) {
    return <MessageDetailSkeleton />;
  }
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col h-[600px]">
      <div className="border-b border-border pb-4 mb-4">
        <h2 className="text-xl font-semibold">{friendName || 'Mesajlar'}</h2>
      </div>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Henüz mesaj yok. Bir mesaj göndererek sohbete başlayın.</p>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === user?.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isOwnMessage 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-secondary/20 text-foreground rounded-tl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {message.createdAt}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="mt-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 p-2 border border-border rounded-md bg-background"
            disabled={sending}
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
            disabled={sending || !newMessage.trim()}
          >
            {sending ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageDetailSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col h-[600px]">
      <div className="border-b border-border pb-4 mb-4">
        <Skeleton className="h-7 w-32" />
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
          >
            <Skeleton 
              className={`h-20 ${i % 2 === 0 ? 'w-[60%]' : 'w-[50%]'} rounded-lg`} 
            />
          </div>
        ))}
      </div>
      
      <div className="mt-auto">
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
} 