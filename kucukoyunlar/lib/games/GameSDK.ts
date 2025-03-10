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
  multiplayer?: boolean;
  sessionId?: string;
}

export interface MultiplayerEvent {
  type: string;
  senderId: string;
  data: any;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  status: 'waiting' | 'ready' | 'playing' | 'disconnected';
  score?: number;
  metadata?: Record<string, any>;
}

export class GameSDK {
  private gameId: string;
  private userId: string | null = null;
  private isAuthenticated: boolean = false;
  private config: GameConfig;
  private eventListeners: Record<string, Function[]> = {};
  private sessionId: string | null = null;
  private players: Player[] = [];
  private isMultiplayer: boolean = false;

  constructor(config: GameConfig) {
    this.gameId = config.gameId;
    this.config = config;
    this.isMultiplayer = !!config.multiplayer;
    this.sessionId = config.sessionId || null;
    this.init();
  }

  /**
   * SDK'yı başlatır ve platform ile iletişim kurar
   */
  private async init(): Promise<void> {
    // Platform ile iletişim kurma
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // Platform'a hazır olduğumuzu bildir
    this.postMessageToPlatform('GAME_READY', { 
      gameId: this.gameId,
      isMultiplayer: this.isMultiplayer,
      sessionId: this.sessionId
    });
    
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

    // Çok oyunculu mod ise oyuncu listesini al
    if (this.isMultiplayer && this.sessionId) {
      try {
        await this.getSessionPlayers();
      } catch (error) {
        console.error('Oyuncu listesi alınamadı:', error);
      }
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
      case 'SESSION_PLAYERS':
        this.players = data.players;
        this.emit('playersUpdated', this.players);
        break;
      case 'PLAYER_JOINED':
        this.addPlayer(data.player);
        break;
      case 'PLAYER_LEFT':
        this.removePlayer(data.playerId);
        break;
      case 'PLAYER_STATUS_CHANGED':
        this.updatePlayerStatus(data.playerId, data.status, data.score);
        break;
      case 'MULTIPLAYER_EVENT':
        this.handleMultiplayerEvent(data);
        break;
    }
  }

  /**
   * Çok oyunculu oyun olayını işler
   */
  private handleMultiplayerEvent(event: MultiplayerEvent): void {
    // Kendi gönderdiğimiz olayları işleme
    if (event.senderId === this.userId) return;
    
    // Olayı ilgili dinleyicilere ilet
    this.emit(`multiplayer:${event.type}`, {
      senderId: event.senderId,
      data: event.data,
      timestamp: event.timestamp
    });
  }

  /**
   * Oyuncu ekler
   */
  private addPlayer(player: Player): void {
    const existingPlayerIndex = this.players.findIndex(p => p.id === player.id);
    if (existingPlayerIndex >= 0) {
      this.players[existingPlayerIndex] = player;
    } else {
      this.players.push(player);
    }
    this.emit('playerJoined', player);
    this.emit('playersUpdated', this.players);
  }

  /**
   * Oyuncu çıkarır
   */
  private removePlayer(playerId: string): void {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex >= 0) {
      const player = this.players[playerIndex];
      this.players.splice(playerIndex, 1);
      this.emit('playerLeft', player);
      this.emit('playersUpdated', this.players);
    }
  }

  /**
   * Oyuncu durumunu günceller
   */
  private updatePlayerStatus(playerId: string, status: string, score?: number): void {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex >= 0) {
      const player = this.players[playerIndex];
      player.status = status as Player['status'];
      if (score !== undefined) {
        player.score = score;
      }
      this.emit('playerStatusChanged', player);
      this.emit('playersUpdated', this.players);
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
   * Oturumdaki oyuncuları alır
   */
  public async getSessionPlayers(): Promise<Player[]> {
    if (!this.isMultiplayer || !this.sessionId) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Oyuncu listesi alınamadı: Zaman aşımı'));
      }, 5000);
      
      this.on('SESSION_PLAYERS', (data: any) => {
        clearTimeout(timeout);
        this.players = data.players;
        resolve(this.players);
      });
      
      this.postMessageToPlatform('GET_SESSION_PLAYERS', { 
        gameId: this.gameId,
        sessionId: this.sessionId
      });
    });
  }

  /**
   * Oyuncu durumunu günceller
   */
  public updateStatus(status: Player['status'], score?: number): void {
    if (!this.isMultiplayer || !this.sessionId || !this.userId) {
      return;
    }

    this.postMessageToPlatform('UPDATE_PLAYER_STATUS', {
      gameId: this.gameId,
      sessionId: this.sessionId,
      playerId: this.userId,
      status,
      score
    });

    // Kendi durumumuzu da güncelle
    this.updatePlayerStatus(this.userId, status, score);
  }

  /**
   * Çok oyunculu oyun olayı gönderir
   */
  public sendMultiplayerEvent(eventType: string, eventData: any): void {
    if (!this.isMultiplayer || !this.sessionId || !this.userId) {
      console.warn('Çok oyunculu olay gönderilemedi: Çok oyunculu mod aktif değil veya oturum yok');
      return;
    }

    const event: MultiplayerEvent = {
      type: eventType,
      senderId: this.userId,
      data: eventData,
      timestamp: Date.now()
    };

    this.postMessageToPlatform('SEND_MULTIPLAYER_EVENT', {
      gameId: this.gameId,
      sessionId: this.sessionId,
      event
    });

    // Kendi olayımızı da işleyelim
    this.emit(`multiplayer:${eventType}`, {
      senderId: this.userId,
      data: eventData,
      timestamp: event.timestamp
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

    // Çok oyunculu modda oyuncu skorunu da güncelle
    if (this.isMultiplayer && this.sessionId) {
      this.updateStatus('playing', score);
    }
    
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
    
    // Çok oyunculu modda durumu güncelle
    if (this.isMultiplayer && this.sessionId) {
      this.updateStatus('waiting');
    }
  }

  /**
   * Oyunu devam ettirir
   */
  public resumeGame(): void {
    this.emit('resume', {});
    
    // Çok oyunculu modda durumu güncelle
    if (this.isMultiplayer && this.sessionId) {
      this.updateStatus('playing');
    }
  }

  /**
   * Oyunu bitirir
   */
  public endGame(finalScore: number, metadata?: Record<string, any>): void {
    this.saveScore(finalScore, metadata);
    this.postMessageToPlatform('GAME_OVER', { score: finalScore, metadata });
    
    // Çok oyunculu modda durumu güncelle
    if (this.isMultiplayer && this.sessionId) {
      this.updateStatus('ready', finalScore);
    }
  }

  /**
   * Mevcut oyuncuları döndürür
   */
  public getPlayers(): Player[] {
    return [...this.players];
  }

  /**
   * Oyuncuyu ID'ye göre bulur
   */
  public getPlayerById(playerId: string): Player | undefined {
    return this.players.find(p => p.id === playerId);
  }

  /**
   * Çok oyunculu mod aktif mi?
   */
  public isMultiplayerMode(): boolean {
    return this.isMultiplayer && !!this.sessionId;
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