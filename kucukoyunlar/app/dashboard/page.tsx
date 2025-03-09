'use client';

import { useState } from 'react';

// Örnek kullanıcı verileri
const userData = {
  username: 'OyuncuDemo',
  email: 'demo@example.com',
  joinDate: '15 Mayıs 2023',
  totalGamesPlayed: 47,
  favoriteCategory: 'Bulmaca',
  level: 8,
  xp: 3750,
  nextLevelXp: 5000,
  achievements: [
    { id: 1, name: 'İlk Oyun', description: 'İlk oyununu oynadın', date: '15 Mayıs 2023', icon: '🎮' },
    { id: 2, name: 'Bulmaca Ustası', description: '10 bulmaca oyunu tamamladın', date: '20 Mayıs 2023', icon: '🧩' },
    { id: 3, name: 'Hızlı Parmaklar', description: 'Bir oyunda 1000 puan topladın', date: '1 Haziran 2023', icon: '👆' },
  ],
  recentGames: [
    { id: '2', title: 'Bulmaca Ustası', date: '2 saat önce', score: 850, category: 'Bulmaca' },
    { id: '5', title: 'Kale Savunması', date: 'Dün', score: 1200, category: 'Strateji' },
    { id: '1', title: 'Uzay Macerası', date: '3 gün önce', score: 750, category: 'Arcade' },
  ],
  friends: [
    { id: 1, username: 'GamerKing', status: 'online', avatar: '' },
    { id: 2, username: 'PuzzleMaster', status: 'offline', avatar: '' },
    { id: 3, username: 'SpeedRacer', status: 'online', avatar: '' },
  ],
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hoş Geldin, {userData.username}!</h1>
      
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
                {userData.username.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userData.username}</h2>
                <p className="text-muted-foreground">Üyelik: {userData.joinDate}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Seviye {userData.level}</span>
                  <span>{userData.xp} / {userData.nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-secondary/30 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${(userData.xp / userData.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-semibold">{userData.totalGamesPlayed}</div>
                  <div className="text-xs text-muted-foreground">Oyun</div>
                </div>
                <div className="bg-secondary/10 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold">{userData.favoriteCategory}</div>
                  <div className="text-xs text-muted-foreground">Favori Kategori</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Son Oyunlar */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Son Oyunlar</h2>
            
            <div className="space-y-4">
              {userData.recentGames.map((game) => (
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
            
            <div className="mt-6 text-center">
              <a href="/games" className="text-primary hover:underline text-sm">
                Daha Fazla Oyun Oyna
              </a>
            </div>
          </div>
          
          {/* Başarılar */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Son Başarılar</h2>
            
            <div className="space-y-4">
              {userData.achievements.slice(0, 3).map((achievement) => (
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userData.achievements.map((achievement) => (
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
        </div>
      )}
      
      {/* Arkadaşlar */}
      {activeTab === 'friends' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Arkadaşlar</h2>
            <button className="btn-secondary text-sm">Arkadaş Ekle</button>
          </div>
          
          <div className="space-y-4">
            {userData.friends.map((friend) => (
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
          
          <div className="mt-6">
            <h3 className="font-medium mb-4">Arkadaş Önerileri</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">A</span>
                  </div>
                  <div>
                    <h3 className="font-medium">ArcadeMaster</h3>
                    <p className="text-sm text-muted-foreground">3 ortak arkadaş</p>
                  </div>
                </div>
                <button className="btn-primary text-sm">Ekle</button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">S</span>
                  </div>
                  <div>
                    <h3 className="font-medium">StrategyQueen</h3>
                    <p className="text-sm text-muted-foreground">1 ortak arkadaş</p>
                  </div>
                </div>
                <button className="btn-primary text-sm">Ekle</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Ayarlar */}
      {activeTab === 'settings' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Hesap Ayarları</h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                defaultValue={userData.username}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                defaultValue={userData.email}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Yeni Şifre
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Yeni şifrenizi girin"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </div>
            
            <div className="pt-4 border-t border-border">
              <h3 className="font-medium mb-4">Bildirim Ayarları</h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span>E-posta bildirimleri</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span>Yeni oyun bildirimleri</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span>Arkadaş etkinlikleri</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-border rounded-md hover:bg-secondary/10 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 