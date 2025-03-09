/**
 * KüçükOyunlar Platformu - Oyun SDK
 * 
 * Bu SDK, oyunların platform ile iletişim kurmasını sağlar.
 * Oyunlar bu SDK'yı kullanarak skor kaydetme, kullanıcı bilgilerini alma gibi işlemleri gerçekleştirebilir.
 */

export interface GameScore {
  score: number;
  gameId: string;
  userId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface GameConfig {
  gameId: string;
  width: number;
  height: number;
  allowFullscreen?: boolean;
  saveScores?: boolean;
}

export class GameSDK {
  private gameId: string;
  private userId: string | null = null;
  private isAuthenticated: boolean = false;
  private config: GameConfig;
  private eventListeners: Record<string, Function[]> = {};

  constructor(config: GameConfig) {
    this.gameId = config.gameId;
    this.config = config;
    this.init();
  }

  /**
   * SDK'yı başlatır ve platform ile iletişim kurar
   */
  private async init(): Promise<void> {
    // Platform ile iletişim kurma
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // Platform'a hazır olduğumuzu bildir
    this.postMessageToPlatform('GAME_READY', { gameId: this.gameId });
    
    // Kullanıcı bilgilerini al
    try {
      const userInfo = await this.getUserInfo();
      if (userInfo) {
        this.userId = userInfo.id;
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
    }
  }

  /**
   * Platform'dan gelen mesajları işler
   */
  private handleMessage(event: MessageEvent): void {
    const { type, data } = event.data;
    
    if (!type) return;
    
    // Event listener'ları çağır
    if (this.eventListeners[type]) {
      this.eventListeners[type].forEach(listener => listener(data));
    }
    
    // Özel mesaj işlemleri
    switch (type) {
      case 'USER_INFO':
        this.userId = data.id;
        this.isAuthenticated = true;
        break;
      case 'PAUSE_GAME':
        this.emit('pause', {});
        break;
      case 'RESUME_GAME':
        this.emit('resume', {});
        break;
    }
  }

  /**
   * Platform'a mesaj gönderir
   */
  private postMessageToPlatform(type: string, data: any): void {
    window.parent.postMessage({ type, data }, '*');
  }

  /**
   * Event listener ekler
   */
  public on(event: string, callback: Function): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Event tetikler
   */
  public emit(event: string, data: any): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(listener => listener(data));
    }
  }

  /**
   * Kullanıcı bilgilerini alır
   */
  public async getUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Kullanıcı bilgileri alınamadı: Zaman aşımı'));
      }, 5000);
      
      this.on('USER_INFO', (data: any) => {
        clearTimeout(timeout);
        resolve(data);
      });
      
      this.postMessageToPlatform('GET_USER_INFO', { gameId: this.gameId });
    });
  }

  /**
   * Skor kaydeder
   */
  public async saveScore(score: number, metadata?: Record<string, any>): Promise<boolean> {
    if (!this.isAuthenticated) {
      console.warn('Skor kaydedilemedi: Kullanıcı giriş yapmamış');
      return false;
    }
    
    const scoreData: GameScore = {
      score,
      gameId: this.gameId,
      userId: this.userId!,
      metadata,
      createdAt: new Date()
    };
    
    this.postMessageToPlatform('SAVE_SCORE', scoreData);
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000);
      
      this.on('SCORE_SAVED', () => {
        clearTimeout(timeout);
        resolve(true);
      });
      
      this.on('SCORE_ERROR', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    });
  }

  /**
   * Oyunu duraklatır
   */
  public pauseGame(): void {
    this.emit('pause', {});
  }

  /**
   * Oyunu devam ettirir
   */
  public resumeGame(): void {
    this.emit('resume', {});
  }

  /**
   * Oyunu bitirir
   */
  public endGame(finalScore: number, metadata?: Record<string, any>): void {
    this.saveScore(finalScore, metadata);
    this.postMessageToPlatform('GAME_OVER', { score: finalScore, metadata });
  }
}

// SDK'yı global olarak tanımla
declare global {
  interface Window {
    GameSDK: typeof GameSDK;
  }
}

// Global olarak erişilebilir yap
if (typeof window !== 'undefined') {
  window.GameSDK = GameSDK;
}

export default GameSDK; 