/**
 * KüçükOyunlar Platformu - Oyun Yöneticisi
 * 
 * Bu sınıf, platform ile oyunlar arasındaki iletişimi yönetir.
 * Oyunların yüklenmesi, skor kaydedilmesi gibi işlemleri gerçekleştirir.
 */

import supabase from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/supabase/auth';
import { GameScore, Player } from './GameSDK';
import { 
  createGameSession, 
  joinGameSession, 
  leaveGameSession, 
  updateGameSessionStatus, 
  getSessionPlayers 
} from '@/lib/services/multiplayer-service';

export interface GameManagerConfig {
  gameId: string;
  containerId: string;
  width?: number;
  height?: number;
  allowFullscreen?: boolean;
  onScoreSaved?: (score: GameScore) => void;
  onGameReady?: () => void;
  onGameOver?: (score: number, metadata?: Record<string, any>) => void;
  multiplayer?: boolean;
  sessionId?: string;
  onPlayersUpdated?: (players: Player[]) => void;
  onPlayerJoined?: (player: Player) => void;
  onPlayerLeft?: (player: Player) => void;
  onMultiplayerEvent?: (event: { type: string, senderId: string, data: any }) => void;
}

export class GameManager {
  private gameId: string;
  private containerId: string;
  private container: HTMLElement | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private config: GameManagerConfig;
  private isGameReady: boolean = false;
  private userId: string | null = null;
  private isMultiplayer: boolean = false;
  private sessionId: string | null = null;
  private players: Player[] = [];

  constructor(config: GameManagerConfig) {
    this.gameId = config.gameId;
    this.containerId = config.containerId;
    this.config = config;
    this.isMultiplayer = !!config.multiplayer;
    this.sessionId = config.sessionId || null;
    
    // Mesaj dinleyicisini ekle
    window.addEventListener('message', this.handleGameMessage.bind(this));
    
    // DOM yüklendikten sonra başlat
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.init.bind(this));
      } else {
        this.init();
      }
    }
  }

  /**
   * Oyun yöneticisini başlatır
   */
  private init(): void {
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) {
      console.error(`Oyun konteyneri bulunamadı: #${this.containerId}`);
      return;
    }
    
    // Kullanıcı bilgilerini al
    this.getUserInfo();
    
    // Oyunu yükle
    this.loadGame();
  }

  /**
   * Kullanıcı bilgilerini alır
   */
  private async getUserInfo(): Promise<void> {
    try {
      const user = await getCurrentUser();
      
      if (user) {
        this.userId = user.id;
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
    }
  }

  /**
   * Oyunu yükler
   */
  private loadGame(): void {
    if (!this.container) return;
    
    // Konteyner boyutlarını ayarla
    this.container.style.width = `${this.config.width || 800}px`;
    this.container.style.height = `${this.config.height || 600}px`;
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    
    // iframe oluştur
    this.iframe = document.createElement('iframe');
    
    // Çok oyunculu mod için URL parametresi ekle
    let gameUrl = `/games/embed/${this.gameId}`;
    if (this.isMultiplayer && this.sessionId) {
      gameUrl += `?multiplayer=true&sessionId=${this.sessionId}`;
    }
    
    this.iframe.src = gameUrl;
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    this.iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    this.iframe.setAttribute('allowfullscreen', String(this.config.allowFullscreen || false));
    
    // iframe'i konteynere ekle
    this.container.appendChild(this.iframe);
    
    // Yükleniyor göstergesi ekle
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'game-loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Oyun yükleniyor...</p>';
    loadingIndicator.style.position = 'absolute';
    loadingIndicator.style.top = '0';
    loadingIndicator.style.left = '0';
    loadingIndicator.style.width = '100%';
    loadingIndicator.style.height = '100%';
    loadingIndicator.style.display = 'flex';
    loadingIndicator.style.flexDirection = 'column';
    loadingIndicator.style.alignItems = 'center';
    loadingIndicator.style.justifyContent = 'center';
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingIndicator.style.color = 'white';
    loadingIndicator.style.zIndex = '10';
    
    this.container.appendChild(loadingIndicator);
  }

  /**
   * Oyundan gelen mesajları işler
   */
  private handleGameMessage(event: MessageEvent): void {
    // Sadece iframe'den gelen mesajları işle
    if (event.source !== this.iframe?.contentWindow) return;
    
    const { type, data } = event.data;
    
    if (!type) return;
    
    switch (type) {
      case 'GAME_READY':
        this.handleGameReady();
        break;
      case 'GET_USER_INFO':
        this.sendUserInfoToGame();
        break;
      case 'SAVE_SCORE':
        this.saveScore(data);
        break;
      case 'GAME_OVER':
        this.handleGameOver(data);
        break;
      case 'GET_SESSION_PLAYERS':
        this.sendSessionPlayersToGame();
        break;
      case 'UPDATE_PLAYER_STATUS':
        this.updatePlayerStatus(data);
        break;
      case 'SEND_MULTIPLAYER_EVENT':
        this.handleMultiplayerEvent(data);
        break;
    }
  }

  /**
   * Oyun hazır olduğunda çağrılır
   */
  private handleGameReady(): void {
    this.isGameReady = true;
    
    // Yükleniyor göstergesini kaldır
    if (this.container) {
      const loadingIndicator = this.container.querySelector('.game-loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
    }
    
    // Callback'i çağır
    if (this.config.onGameReady) {
      this.config.onGameReady();
    }
  }

  /**
   * Kullanıcı bilgilerini oyuna gönderir
   */
  private sendUserInfoToGame(): void {
    if (!this.iframe?.contentWindow) return;
    
    const userInfo = this.userId ? {
      id: this.userId,
      isAuthenticated: true
    } : {
      id: null,
      isAuthenticated: false
    };
    
    this.iframe.contentWindow.postMessage({
      type: 'USER_INFO',
      data: userInfo
    }, '*');
  }

  /**
   * Oturumdaki oyuncuları oyuna gönderir
   */
  private async sendSessionPlayersToGame(): Promise<void> {
    if (!this.iframe?.contentWindow || !this.isMultiplayer || !this.sessionId) return;
    
    try {
      // Oyuncuları getir
      const { data: players, error } = await getSessionPlayers(this.sessionId);
      
      if (error) {
        throw error;
      }
      
      this.players = players || [];
      
      // Oyuna gönder
      this.iframe.contentWindow.postMessage({
        type: 'SESSION_PLAYERS',
        data: { players: this.players }
      }, '*');
      
      // Callback'i çağır
      if (this.config.onPlayersUpdated) {
        this.config.onPlayersUpdated(this.players);
      }
    } catch (error) {
      console.error('Oyuncular getirilemedi:', error);
    }
  }

  /**
   * Oyuncu durumunu günceller
   */
  private async updatePlayerStatus(data: { playerId: string, status: string, score?: number }): Promise<void> {
    if (!this.isMultiplayer || !this.sessionId) return;
    
    try {
      // Oyuncu durumunu güncelle
      await updatePlayerStatus(this.sessionId, data.status as any, data.score);
      
      // Oyuncuları yeniden getir
      await this.sendSessionPlayersToGame();
    } catch (error) {
      console.error('Oyuncu durumu güncellenemedi:', error);
    }
  }

  /**
   * Çok oyunculu oyun olayını işler
   */
  private async handleMultiplayerEvent(data: { event: { type: string, senderId: string, data: any, timestamp: number } }): Promise<void> {
    if (!this.isMultiplayer || !this.sessionId) return;
    
    try {
      // Olayı diğer oyunculara ilet
      // Burada normalde bir WebSocket veya Supabase Realtime kullanılabilir
      // Şimdilik sadece callback'i çağıralım
      if (this.config.onMultiplayerEvent) {
        this.config.onMultiplayerEvent({
          type: data.event.type,
          senderId: data.event.senderId,
          data: data.event.data
        });
      }
      
      // Olayı oyuna gönder
      if (this.iframe?.contentWindow) {
        this.iframe.contentWindow.postMessage({
          type: 'MULTIPLAYER_EVENT',
          data: data.event
        }, '*');
      }
    } catch (error) {
      console.error('Çok oyunculu olay işlenemedi:', error);
    }
  }

  /**
   * Skoru kaydeder
   */
  private async saveScore(scoreData: GameScore): Promise<void> {
    if (!this.userId) {
      this.sendMessageToGame('SCORE_ERROR', { error: 'Kullanıcı giriş yapmamış' });
      return;
    }
    
    try {
      // Supabase'e skoru kaydet
      const { error } = await supabase
        .from('scores')
        .insert({
          user_id: this.userId,
          game_id: this.gameId,
          score: scoreData.score,
          metadata: scoreData.metadata || {}
        });
      
      if (error) {
        throw error;
      }
      
      // Başarılı mesajı gönder
      this.sendMessageToGame('SCORE_SAVED', { success: true });
      
      // Callback'i çağır
      if (this.config.onScoreSaved) {
        this.config.onScoreSaved(scoreData);
      }
    } catch (error) {
      console.error('Skor kaydedilemedi:', error);
      this.sendMessageToGame('SCORE_ERROR', { error: 'Skor kaydedilemedi' });
    }
  }

  /**
   * Oyun bittiğinde çağrılır
   */
  private handleGameOver(data: { score: number, metadata?: Record<string, any> }): void {
    if (this.config.onGameOver) {
      this.config.onGameOver(data.score, data.metadata);
    }
  }

  /**
   * Oyuna mesaj gönderir
   */
  private sendMessageToGame(type: string, data: any): void {
    if (!this.iframe?.contentWindow) return;
    
    this.iframe.contentWindow.postMessage({ type, data }, '*');
  }

  /**
   * Oyunu duraklatır
   */
  public pauseGame(): void {
    this.sendMessageToGame('PAUSE_GAME', {});
  }

  /**
   * Oyunu devam ettirir
   */
  public resumeGame(): void {
    this.sendMessageToGame('RESUME_GAME', {});
  }

  /**
   * Oyunu yeniden başlatır
   */
  public restartGame(): void {
    this.loadGame();
  }

  /**
   * Oyun yöneticisini temizler
   */
  public destroy(): void {
    window.removeEventListener('message', this.handleGameMessage.bind(this));
    
    if (this.iframe && this.container) {
      this.container.removeChild(this.iframe);
    }
    
    this.iframe = null;
  }

  /**
   * Çok oyunculu oyun oturumu oluşturur
   */
  public async createMultiplayerSession(maxPlayers: number = 2): Promise<string | null> {
    if (!this.userId) {
      console.error('Oturum oluşturulamadı: Kullanıcı giriş yapmamış');
      return null;
    }
    
    try {
      const { data, error } = await createGameSession(this.gameId, maxPlayers);
      
      if (error) {
        throw error;
      }
      
      this.isMultiplayer = true;
      this.sessionId = data!.id;
      
      return data!.id;
    } catch (error) {
      console.error('Oturum oluşturulamadı:', error);
      return null;
    }
  }

  /**
   * Çok oyunculu oyun oturumuna katılır
   */
  public async joinMultiplayerSession(sessionId: string): Promise<boolean> {
    if (!this.userId) {
      console.error('Oturuma katılınamadı: Kullanıcı giriş yapmamış');
      return false;
    }
    
    try {
      const { data, error } = await joinGameSession(sessionId);
      
      if (error) {
        throw error;
      }
      
      this.isMultiplayer = true;
      this.sessionId = sessionId;
      
      return true;
    } catch (error) {
      console.error('Oturuma katılınamadı:', error);
      return false;
    }
  }

  /**
   * Çok oyunculu oyun oturumundan ayrılır
   */
  public async leaveMultiplayerSession(): Promise<boolean> {
    if (!this.isMultiplayer || !this.sessionId) {
      return false;
    }
    
    try {
      const { success, error } = await leaveGameSession(this.sessionId);
      
      if (error) {
        throw error;
      }
      
      this.isMultiplayer = false;
      this.sessionId = null;
      this.players = [];
      
      return success;
    } catch (error) {
      console.error('Oturumdan ayrılınamadı:', error);
      return false;
    }
  }

  /**
   * Çok oyunculu oyunu başlatır
   */
  public async startMultiplayerGame(): Promise<boolean> {
    if (!this.isMultiplayer || !this.sessionId) {
      return false;
    }
    
    try {
      const { success, error } = await updateGameSessionStatus(this.sessionId, 'playing');
      
      if (error) {
        throw error;
      }
      
      return success;
    } catch (error) {
      console.error('Oyun başlatılamadı:', error);
      return false;
    }
  }

  /**
   * Oturumdaki oyuncuları getirir
   */
  public async getPlayers(): Promise<Player[]> {
    if (!this.isMultiplayer || !this.sessionId) {
      return [];
    }
    
    try {
      const { data, error } = await getSessionPlayers(this.sessionId);
      
      if (error) {
        throw error;
      }
      
      this.players = data || [];
      
      return this.players;
    } catch (error) {
      console.error('Oyuncular getirilemedi:', error);
      return [];
    }
  }

  /**
   * Çok oyunculu mod aktif mi?
   */
  public isMultiplayerMode(): boolean {
    return this.isMultiplayer && !!this.sessionId;
  }

  /**
   * Oturum ID'sini döndürür
   */
  public getSessionId(): string | null {
    return this.sessionId;
  }
}

export default GameManager; 