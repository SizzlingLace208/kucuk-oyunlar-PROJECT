'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCw, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { 
  GameSession, 
  GamePlayer, 
  createGameSession, 
  joinGameSession, 
  leaveGameSession,
  updateGameSessionStatus,
  updatePlayerStatus,
  getGameSessions,
  getSessionPlayers,
  subscribeToGameSession,
  subscribeToSessionPlayers,
  getGameSession
} from '@/lib/services/multiplayer-service';

interface MultiplayerLobbyProps {
  gameId: string;
  onGameStart?: (sessionId: string, players: GamePlayer[]) => void;
}

export default function MultiplayerLobby({ gameId, onGameStart }: MultiplayerLobbyProps) {
  const [availableSessions, setAvailableSessions] = useState<GameSession[]>([]);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [sessionPlayers, setSessionPlayers] = useState<GamePlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Mevcut oturumları yükle
  const loadSessions = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await getGameSessions({
        game_id: gameId,
        status: 'waiting',
        limit: 10
      });

      if (error) {
        toast.error('Oyun oturumları yüklenirken bir hata oluştu');
        console.error('Oyun oturumları yüklenirken hata:', error);
        return;
      }

      setAvailableSessions(data || []);
    } catch (err) {
      console.error('Oturumlar yüklenirken hata:', err);
      toast.error('Oyun oturumları yüklenirken bir hata oluştu');
    } finally {
      setRefreshing(false);
    }
  };

  // Oturum oyuncularını yükle
  const loadSessionPlayers = async (sessionId: string) => {
    try {
      const { data, error } = await getSessionPlayers(sessionId);
      if (error) {
        toast.error('Oyuncular yüklenirken bir hata oluştu');
        console.error('Oyuncular yüklenirken hata:', error);
        return;
      }

      setSessionPlayers(data || []);
    } catch (err) {
      console.error('Oyuncular yüklenirken hata:', err);
      toast.error('Oyuncular yüklenirken bir hata oluştu');
    }
  };

  // Yeni oyun oturumu oluştur
  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const { data, error } = await createGameSession(gameId, 2);
      if (error) {
        toast.error('Oyun oturumu oluşturulurken bir hata oluştu');
        console.error('Oyun oturumu oluşturulurken hata:', error);
        return;
      }

      setCurrentSession(data);
      setIsHost(true);
      await loadSessionPlayers(data!.id);
      toast.success('Oyun oturumu oluşturuldu');
    } catch (err) {
      console.error('Oturum oluşturulurken hata:', err);
      toast.error('Oyun oturumu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Oyun oturumuna katıl
  const handleJoinSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const { data, error } = await joinGameSession(sessionId);
      if (error) {
        toast.error('Oyun oturumuna katılırken bir hata oluştu');
        console.error('Oyun oturumuna katılırken hata:', error);
        return;
      }

      // Oturum bilgilerini getir
      const sessionResponse = await getGameSession(sessionId);
      if (sessionResponse.error) {
        toast.error('Oyun oturumu bilgileri alınırken bir hata oluştu');
        return;
      }

      setCurrentSession(sessionResponse.data);
      setIsHost(sessionResponse.data?.host_id === data?.user_id);
      await loadSessionPlayers(sessionId);
      toast.success('Oyun oturumuna katıldınız');
    } catch (err) {
      console.error('Oturuma katılırken hata:', err);
      toast.error('Oyun oturumuna katılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Oyun oturumundan ayrıl
  const handleLeaveSession = async () => {
    if (!currentSession) return;
    
    setLoading(true);
    try {
      const { error } = await leaveGameSession(currentSession.id);
      if (error) {
        toast.error('Oyun oturumundan ayrılırken bir hata oluştu');
        console.error('Oyun oturumundan ayrılırken hata:', error);
        return;
      }

      setCurrentSession(null);
      setSessionPlayers([]);
      setIsHost(false);
      toast.success('Oyun oturumundan ayrıldınız');
      await loadSessions();
    } catch (err) {
      console.error('Oturumdan ayrılırken hata:', err);
      toast.error('Oyun oturumundan ayrılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Oyunu başlat
  const handleStartGame = async () => {
    if (!currentSession || !isHost) return;
    
    setLoading(true);
    try {
      const { error } = await updateGameSessionStatus(currentSession.id, 'playing');
      if (error) {
        toast.error('Oyun başlatılırken bir hata oluştu');
        console.error('Oyun başlatılırken hata:', error);
        return;
      }

      // Tüm oyuncuların durumunu güncelle
      await Promise.all(
        sessionPlayers.map(p => 
          updatePlayerStatus(currentSession.id, 'playing')
        )
      );

      toast.success('Oyun başlatıldı');
      
      // Oyun başlatma callback'ini çağır
      if (onGameStart) {
        onGameStart(currentSession.id, sessionPlayers);
      }
    } catch (err) {
      console.error('Oyun başlatılırken hata:', err);
      toast.error('Oyun başlatılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Hazır durumunu güncelle
  const handleToggleReady = async () => {
    if (!currentSession) return;
    
    setLoading(true);
    try {
      const currentPlayer = sessionPlayers.find(p => p.user_id === getCurrentUserId());
      if (!currentPlayer) return;
      
      const newStatus = currentPlayer.status === 'ready' ? 'waiting' : 'ready';
      const { error } = await updatePlayerStatus(currentSession.id, newStatus);
      
      if (error) {
        toast.error('Hazır durumu güncellenirken bir hata oluştu');
        console.error('Hazır durumu güncellenirken hata:', error);
        return;
      }

      toast.success(newStatus === 'ready' ? 'Hazır durumuna geçtiniz' : 'Bekleme durumuna geçtiniz');
    } catch (err) {
      console.error('Hazır durumu güncellenirken hata:', err);
      toast.error('Hazır durumu güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı ID'sini al (geçici)
  const getCurrentUserId = () => {
    // Bu fonksiyon normalde auth servisinden kullanıcı ID'sini almalı
    // Şimdilik basit bir şekilde mevcut oyunculardan birini döndürelim
    return sessionPlayers[0]?.user_id || '';
  };

  // Oturum ve oyuncu güncellemelerini dinle
  useEffect(() => {
    if (!currentSession) return;

    // Oturum güncellemelerini dinle
    const sessionSubscription = subscribeToGameSession(
      currentSession.id,
      (updatedSession) => {
        setCurrentSession(updatedSession);
        
        // Eğer oturum 'playing' durumuna geçtiyse ve callback tanımlıysa çağır
        if (updatedSession.status === 'playing' && onGameStart) {
          onGameStart(updatedSession.id, sessionPlayers);
        }
      }
    );

    // Oyuncu güncellemelerini dinle
    const playersSubscription = subscribeToSessionPlayers(
      currentSession.id,
      (updatedPlayers) => {
        setSessionPlayers(updatedPlayers);
      }
    );

    return () => {
      sessionSubscription.unsubscribe();
      playersSubscription.unsubscribe();
    };
  }, [currentSession, onGameStart]);

  // Sayfa yüklendiğinde oturumları getir
  useEffect(() => {
    loadSessions();
  }, [gameId]);

  // Oturum yoksa lobi listesini göster
  if (!currentSession) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Çok Oyunculu Lobi</CardTitle>
          <CardDescription>Mevcut bir oyuna katılın veya yeni bir oyun oluşturun</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Mevcut Oyunlar</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadSessions} 
              disabled={refreshing}
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          
          {availableSessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Mevcut oyun bulunamadı</p>
          ) : (
            <div className="space-y-2">
              {availableSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{session.host?.name || 'Bilinmeyen Ev Sahibi'}</div>
                    <div className="text-sm text-muted-foreground">
                      {session.current_players}/{session.max_players} Oyuncu
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleJoinSession(session.id)} 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Katıl'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleCreateSession} 
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Yeni Oyun Oluştur
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Oturumdaysa oyuncu listesini göster
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Oyun Lobisi</CardTitle>
            <CardDescription>
              {isHost ? 'Siz ev sahibisiniz' : 'Oyun başlamasını bekleyin'}
            </CardDescription>
          </div>
          <Badge variant={isHost ? "default" : "outline"}>
            {isHost ? 'Ev Sahibi' : 'Misafir'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Oyuncular ({sessionPlayers.length}/{currentSession.max_players})
            </h3>
            <div className="space-y-2">
              {sessionPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={player.user?.avatar_url} />
                      <AvatarFallback>{player.user?.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{player.user?.name || 'Bilinmeyen Oyuncu'}</div>
                    </div>
                  </div>
                  <Badge variant={player.status === 'ready' ? "success" : "outline"}>
                    {player.status === 'ready' ? 'Hazır' : 'Bekliyor'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleToggleReady} 
              disabled={loading || isHost}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hazır Durumunu Değiştir'}
            </Button>
            
            {isHost && (
              <Button 
                onClick={handleStartGame} 
                disabled={loading || sessionPlayers.length < 2 || sessionPlayers.some(p => p.status !== 'ready')}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Oyunu Başlat'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleLeaveSession} 
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lobiden Ayrıl'}
        </Button>
      </CardFooter>
    </Card>
  );
} 