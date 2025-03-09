'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import MessageList from '@/components/messages/MessageList';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
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
        
        <div className="md:col-span-2 hidden md:block">
          <div className="bg-card border border-border rounded-lg p-6 h-[600px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Mesajlaşmak için sol taraftan bir kişi seçin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 