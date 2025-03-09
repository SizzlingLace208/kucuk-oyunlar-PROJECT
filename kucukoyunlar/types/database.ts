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
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string
          game_url: string
          category: string
          created_at: string
          is_featured: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url: string
          game_url: string
          category: string
          created_at?: string
          is_featured?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string
          game_url?: string
          category?: string
          created_at?: string
          is_featured?: boolean
        }
        Relationships: []
      }
      scores: {
        Row: {
          id: string
          user_id: string
          game_id: string
          score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          score: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          score?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scores_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
      }
      game_comments: {
        Row: {
          id: string
          user_id: string
          game_id: string
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          comment?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_comments_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          game_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
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