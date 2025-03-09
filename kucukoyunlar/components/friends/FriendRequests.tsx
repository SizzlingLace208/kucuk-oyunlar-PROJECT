'use client';

import { useState, useEffect } from 'react';
import { getPendingFriendRequests, acceptFriendRequest, rejectFriendRequest, type FriendRequest } from '@/lib/services/friend-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadFriendRequests() {
      try {
        setLoading(true);
        const pendingRequests = await getPendingFriendRequests();
        setRequests(pendingRequests);
      } catch (err) {
        setError('Arkadaşlık istekleri yüklenirken bir hata oluştu.');
        console.error('Arkadaşlık istekleri yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadFriendRequests();
  }, []);
  
  async function handleAccept(requestId: string) {
    try {
      const success = await acceptFriendRequest(requestId);
      if (success) {
        // İsteği listeden kaldır
        setRequests(requests.filter(request => request.id !== requestId));
      } else {
        setError('İstek kabul edilirken bir hata oluştu.');
      }
    } catch (err) {
      setError('İstek kabul edilirken bir hata oluştu.');
      console.error('İstek kabul edilirken hata:', err);
    }
  }
  
  async function handleReject(requestId: string) {
    try {
      const success = await rejectFriendRequest(requestId);
      if (success) {
        // İsteği listeden kaldır
        setRequests(requests.filter(request => request.id !== requestId));
      } else {
        setError('İstek reddedilirken bir hata oluştu.');
      }
    } catch (err) {
      setError('İstek reddedilirken bir hata oluştu.');
      console.error('İstek reddedilirken hata:', err);
    }
  }
  
  if (loading) {
    return <FriendRequestsSkeleton />;
  }
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Arkadaşlık İstekleri</h2>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {requests.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Bekleyen arkadaşlık isteği yok</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                  {request.avatarUrl ? (
                    <img 
                      src={request.avatarUrl} 
                      alt={request.username || 'Kullanıcı'} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-bold">{request.username?.charAt(0) || '?'}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{request.username || 'Kullanıcı'}</h3>
                  <p className="text-sm text-muted-foreground">{request.createdAt}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleAccept(request.id)}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90"
                >
                  Kabul Et
                </button>
                <button 
                  onClick={() => handleReject(request.id)}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm hover:bg-secondary/90"
                >
                  Reddet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FriendRequestsSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <Skeleton className="h-7 w-48 mb-6" />
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 