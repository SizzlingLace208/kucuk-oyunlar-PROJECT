'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { 
  getUserProfile, 
  getUserAchievements, 
  getRecentGames, 
  getFriends,
  type UserProfile,
  type UserAchievement,
  type RecentGame,
  type Friend
} from '@/lib/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!user) {
      router.push('/login');
      return;
    }
    
    async function loadUserData() {
      setLoading(true);
      try {
        // Kullanıcı profili
        const userProfile = await getUserProfile(user.id);
        if (userProfile) {
          setProfile(userProfile);
        }
        
        // Başarılar
        const userAchievements = await getUserAchievements(user.id);
        setAchievements(userAchievements);
        
        // Son oyunlar
        const userRecentGames = await getRecentGames(user.id);
        setRecentGames(userRecentGames);
        
        // Arkadaşlar
        const userFriends = await getFriends(user.id);
        setFriends(userFriends);
      } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, [user, router]);
  
  // Yükleme durumu
  if (loading) {
    return <DashboardSkeleton />;
  }
  
  // Kullanıcı profili yoksa
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profil bulunamadı</h1>
        <p>Profil bilgileriniz yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hoş Geldin, {profile.username}!</h1>
      
      {/* Sekmeler */}
      <div className="border-b border-border mb-8">
        <div className="flex space-x-8">
          <button
            className={`pb-4 px-1 ${activeTab === 'overview' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('overview')}
          >
            Genel Bakış
          </button>
          <button
            className={`pb-4 px-1 ${activeTab === 'achievements' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('achievements')}
          >
            Başarılar
          </button>
          <button
            className={`pb-4 px-1 ${activeTab === 'friends' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('friends')}
          >
            Arkadaşlar
          </button>
          <button
            className={`pb-4 px-1 ${activeTab === 'settings' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('settings')}
          >
            Ayarlar
          </button>
        </div>
      </div>
      
      {/* Genel Bakış */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profil Kartı */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                {profile.username.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.username}</h2>
                <p className="text-muted-foreground">Üyelik: {profile.joinDate}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Seviye {profile.level}</span>
                  <span>{profile.xp} / {profile.nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-secondary/30 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${(profile.xp / profile.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-semibold">{profile.totalGamesPlayed}</div>
                  <div className="text-xs text-muted-foreground">Oyun</div>
                </div>
                <div className="bg-secondary/10 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold">{profile.favoriteCategory || 'Yok'}</div>
                  <div className="text-xs text-muted-foreground">Favori Kategori</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Son Oyunlar */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Son Oyunlar</h2>
            
            {recentGames.length > 0 ? (
              <div className="space-y-4">
                {recentGames.map((game) => (
                  <div key={game.id} className="flex items-center">
                    <div className="w-10 h-10 bg-secondary/20 rounded-md flex items-center justify-center mr-3">
                      <span className="font-bold">{game.title.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{game.title}</h3>
                        <span className="text-sm text-muted-foreground">{game.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{game.category}</span>
                        <span>Skor: {game.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">Henüz oyun oynamadınız</p>
            )}
            
            <div className="mt-6 text-center">
              <a href="/games" className="text-primary hover:underline text-sm">
                Daha Fazla Oyun Oyna
              </a>
            </div>
          </div>
          
          {/* Başarılar */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Son Başarılar</h2>
            
            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center mr-3 text-xl">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">Henüz başarı kazanmadınız</p>
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveTab('achievements')}
                className="text-primary hover:underline text-sm"
              >
                Tüm Başarıları Gör
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Başarılar */}
      {activeTab === 'achievements' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Başarılar</h2>
          
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start p-4 border border-border rounded-lg">
                  <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center mr-4 text-2xl">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-muted-foreground">{achievement.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">{achievement.date}</p>
                  </div>
                </div>
              ))}
              
              {/* Kilitli Başarılar */}
              <div className="flex items-start p-4 border border-border rounded-lg opacity-50">
                <div className="w-12 h-12 bg-secondary/20 rounded-md flex items-center justify-center mr-4 text-2xl">
                  🔒
                </div>
                <div>
                  <h3 className="font-semibold">Koleksiyoncu</h3>
                  <p className="text-muted-foreground">Her kategoriden en az bir oyun oyna</p>
                  <p className="text-sm text-muted-foreground mt-2">Kilitli</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border border-border rounded-lg opacity-50">
                <div className="w-12 h-12 bg-secondary/20 rounded-md flex items-center justify-center mr-4 text-2xl">
                  🔒
                </div>
                <div>
                  <h3 className="font-semibold">Sosyal Kelebek</h3>
                  <p className="text-muted-foreground">5 arkadaş ekle</p>
                  <p className="text-sm text-muted-foreground mt-2">Kilitli</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">Henüz başarı kazanmadınız</p>
          )}
        </div>
      )}
      
      {/* Arkadaşlar */}
      {activeTab === 'friends' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Arkadaşlar</h2>
            <button className="btn-secondary text-sm">Arkadaş Ekle</button>
          </div>
          
          {friends.length > 0 ? (
            <div className="space-y-4">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold">{friend.username.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{friend.username}</h3>
                      <div className="flex items-center text-sm">
                        <span className={`w-2 h-2 rounded-full mr-2 ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-muted-foreground">{friend.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-secondary/20 rounded-md">
                      💬
                    </button>
                    <button className="p-2 hover:bg-secondary/20 rounded-md">
                      🎮
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">Henüz arkadaşınız yok</p>
          )}
        </div>
      )}
      
      {/* Ayarlar */}
      {activeTab === 'settings' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Hesap Ayarları</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Profil Bilgileri</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-border rounded-md bg-background"
                    defaultValue={profile.username}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">E-posta</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border border-border rounded-md bg-background"
                    defaultValue={profile.email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">E-posta adresinizi değiştirmek için destek ekibiyle iletişime geçin.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Bildirim Ayarları</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="checkbox" id="email-notifications" className="mr-2" />
                  <label htmlFor="email-notifications">E-posta bildirimleri</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="friend-requests" className="mr-2" />
                  <label htmlFor="friend-requests">Arkadaşlık istekleri</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="game-updates" className="mr-2" />
                  <label htmlFor="game-updates">Oyun güncellemeleri</label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Yükleme durumu için iskelet bileşeni
function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-8" />
      
      <div className="border-b border-border mb-8">
        <div className="flex space-x-8">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="w-16 h-16 rounded-full mr-4" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 