export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_bot: boolean | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      exercise_results: {
        Row: {
          completed_at: string | null
          details: Json | null
          exercise_id: string
          exercise_type: string
          grade: number | null
          id: string
          max_score: number
          points_earned: number
          score: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          details?: Json | null
          exercise_id: string
          exercise_type: string
          grade?: number | null
          id?: string
          max_score: number
          points_earned: number
          score: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          details?: Json | null
          exercise_id?: string
          exercise_type?: string
          grade?: number | null
          id?: string
          max_score?: number
          points_earned?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      exercise_suggestions: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          reason: string
          user_id: string
          viewed: boolean | null
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          reason: string
          user_id: string
          viewed?: boolean | null
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          reason?: string
          user_id?: string
          viewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_suggestions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          content: Json
          created_at: string | null
          description: string | null
          difficulty: string
          id: string
          title: string
          type: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          description?: string | null
          difficulty: string
          id?: string
          title: string
          type: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string | null
          difficulty?: string
          id?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          daily_streak: number | null
          id: string
          last_active: string | null
          last_streak_update: string | null
          points: number | null
          time_spent: number | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          daily_streak?: number | null
          id: string
          last_active?: string | null
          last_streak_update?: string | null
          points?: number | null
          time_spent?: number | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          daily_streak?: number | null
          id?: string
          last_active?: string | null
          last_streak_update?: string | null
          points?: number | null
          time_spent?: number | null
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          avatar: string
          comment: string
          created_at: string | null
          id: string
          name: string
          rating: number
          user_id: string | null
        }
        Insert: {
          avatar: string
          comment: string
          created_at?: string | null
          id?: string
          name: string
          rating: number
          user_id?: string | null
        }
        Update: {
          avatar?: string
          comment?: string
          created_at?: string | null
          id?: string
          name?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      test_results: {
        Row: {
          areas: Json
          date: string | null
          id: string
          recommendation: Json
          user_id: string | null
        }
        Insert: {
          areas: Json
          date?: string | null
          id?: string
          recommendation: Json
          user_id?: string | null
        }
        Update: {
          areas?: Json
          date?: string | null
          id?: string
          recommendation?: Json
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_points: {
        Args: { user_uuid: string; points_to_add: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
