'use client';

import { useState } from 'react';
import { searchUsers, sendFriendRequest } from '@/lib/services/friend-service';
import { Friend } from '@/lib/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function FriendSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('Kullanıcı bulunamadı.');
      }
    } catch (err) {
      setError('Kullanıcılar aranırken bir hata oluştu.');
      console.error('Kullanıcılar aranırken hata:', err);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleSendRequest(friendId: string) {
    try {
      setError(null);
      setSuccess(null);
      
      // İsteği gönderiliyor olarak işaretle
      setPendingRequests(prev => new Set(prev).add(friendId));
      
      const success = await sendFriendRequest(friendId);
      
      if (success) {
        setSuccess('Arkadaşlık isteği başarıyla gönderildi.');
        // Kullanıcıyı sonuçlardan kaldır
        setSearchResults(searchResults.filter(user => user.id !== friendId));
      } else {
        setError('Arkadaşlık isteği gönderilirken bir hata oluştu.');
        // İsteği gönderiliyor işaretini kaldır
        setPendingRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(friendId);
          return newSet;
        });
      }
    } catch (err: any) {
      setError(err.message || 'Arkadaşlık isteği gönderilirken bir hata oluştu.');
      console.error('Arkadaşlık isteği gönderilirken hata:', err);
      
      // İsteği gönderiliyor işaretini kaldır
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    }
  }
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Arkadaş Ara</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kullanıcı adı ara..."
            className="flex-1 p-2 border border-border rounded-md bg-background"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 text-green-500 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <FriendSearchItemSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                      {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.username} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-bold">{user.username.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.username}</h3>
                      <div className="flex items-center text-sm">
                        <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-muted-foreground">{user.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendRequest(user.id)}
                    className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90 disabled:opacity-50"
                    disabled={pendingRequests.has(user.id)}
                  >
                    {pendingRequests.has(user.id) ? 'Gönderiliyor...' : 'Arkadaş Ekle'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FriendSearchItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div className="flex items-center">
        <Skeleton className="w-10 h-10 rounded-full mr-3" />
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
} 