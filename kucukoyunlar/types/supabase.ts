export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string | null
          email: string | null
          avatar_url: string | null
          xp: number
          last_seen: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          xp?: number
          last_seen?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          xp?: number
          last_seen?: string | null
        }
      }
      game_stats: {
        Row: {
          id: string
          user_id: string
          total_games_played: number
          favorite_category: string | null
        }
        Insert: {
          id?: string
          user_id: string
          total_games_played?: number
          favorite_category?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          total_games_played?: number
          favorite_category?: string | null
        }
      }
      achievements: {
        Row: {
          id: number
          name: string
          description: string
          icon: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          icon: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          icon?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: number
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: number
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: number
          unlocked_at?: string
        }
      }
      games: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          image_url: string | null
          created_at: string
          updated_at?: string
          play_count: number
          rating: number
          difficulty: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          play_count?: number
          rating?: number
          difficulty?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          play_count?: number
          rating?: number
          difficulty?: string
        }
      }
      game_history: {
        Row: {
          id: string
          user_id: string
          game_id: string
          score: number
          played_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          score: number
          played_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          score?: number
          played_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          created_at?: string
          is_read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 