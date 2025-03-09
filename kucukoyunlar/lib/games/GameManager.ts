/**
 * KüçükOyunlar Platformu - Oyun Yöneticisi
 * 
 * Bu sınıf, platform ile oyunlar arasındaki iletişimi yönetir.
 * Oyunların yüklenmesi, skor kaydedilmesi gibi işlemleri gerçekleştirir.
 */

import supabase from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/supabase/auth';
import { GameScore } from './GameSDK';

export interface GameManagerConfig {
  gameId: string;
  containerId: string;
  width?: number;
  height?: number;
  allowFullscreen?: boolean;
  onScoreSaved?: (score: GameScore) => void;
  onGameReady?: () => void;
  onGameOver?: (score: number, metadata?: Record<string, any>) => void;
}

export class GameManager {
  private gameId: string;
  private containerId: string;
  private container: HTMLElement | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private config: GameManagerConfig;
  private isGameReady: boolean = false;
  private userId: string | null = null;

  constructor(config: GameManagerConfig) {
    this.gameId = config.gameId;
    this.containerId = config.containerId;
    this.config = config;
    
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
    this.iframe.src = `/games/embed/${this.gameId}`;
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
    this.sendMessageToGame('RESTART_GAME', {});
  }

  /**
   * Oyunu kaldırır
   */
  public destroy(): void {
    window.removeEventListener('message', this.handleGameMessage.bind(this));
    
    if (this.iframe && this.container) {
      this.container.removeChild(this.iframe);
      this.iframe = null;
    }
  }
}

export default GameManager; 