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
      article_games: {
        Row: {
          article_id: string
          game_id: string
        }
        Insert: {
          article_id: string
          game_id: string
        }
        Update: {
          article_id?: string
          game_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_games_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      article_players: {
        Row: {
          article_id: string
          player_id: string
        }
        Insert: {
          article_id: string
          player_id: string
        }
        Update: {
          article_id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_players_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      article_revisions: {
        Row: {
          article_id: string
          created_at: string
          created_by: string | null
          id: string
          reason: string
          snapshot: Json
        }
        Insert: {
          article_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          reason: string
          snapshot: Json
        }
        Update: {
          article_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "article_revisions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_sources: {
        Row: {
          article_id: string
          checked_at: string
          created_at: string
          editorial_note: string | null
          id: string
          source_name: string
          source_type: Database["public"]["Enums"]["article_source_type"]
          source_url: string
        }
        Insert: {
          article_id: string
          checked_at?: string
          created_at?: string
          editorial_note?: string | null
          id?: string
          source_name: string
          source_type?: Database["public"]["Enums"]["article_source_type"]
          source_url: string
        }
        Update: {
          article_id?: string
          checked_at?: string
          created_at?: string
          editorial_note?: string | null
          id?: string
          source_name?: string
          source_type?: Database["public"]["Enums"]["article_source_type"]
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_sources_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tournaments: {
        Row: {
          article_id: string
          tournament_id: string
        }
        Insert: {
          article_id: string
          tournament_id: string
        }
        Update: {
          article_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tournaments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tournaments_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      article_videos: {
        Row: {
          article_id: string
          video_id: string
        }
        Insert: {
          article_id: string
          video_id: string
        }
        Update: {
          article_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_videos_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          body_markdown: string
          canonical_url: string | null
          created_at: string
          id: string
          published_at: string | null
          reviewed_by: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body_markdown?: string
          canonical_url?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          reviewed_by?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body_markdown?: string
          canonical_url?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          reviewed_by?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          channel_url: string
          created_at: string
          description: string | null
          display_name: string
          external_channel_id: string
          id: string
          is_eligible: boolean
          last_imported_at: string | null
          platform: Database["public"]["Enums"]["video_platform"]
          slug: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          channel_url: string
          created_at?: string
          description?: string | null
          display_name: string
          external_channel_id: string
          id?: string
          is_eligible?: boolean
          last_imported_at?: string | null
          platform?: Database["public"]["Enums"]["video_platform"]
          slug: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          channel_url?: string
          created_at?: string
          description?: string | null
          display_name?: string
          external_channel_id?: string
          id?: string
          is_eligible?: boolean
          last_imported_at?: string | null
          platform?: Database["public"]["Enums"]["video_platform"]
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      editorial_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          article_id: string
          created_at: string
          from_status: Database["public"]["Enums"]["article_status"] | null
          id: number
          to_status: Database["public"]["Enums"]["article_status"] | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          article_id: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["article_status"] | null
          id?: never
          to_status?: Database["public"]["Enums"]["article_status"] | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          article_id?: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["article_status"] | null
          id?: never
          to_status?: Database["public"]["Enums"]["article_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "editorial_audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_audit_log_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          black_player_id: string | null
          created_at: string
          external_id: string | null
          id: string
          license_name: string | null
          license_url: string | null
          opening_id: string | null
          pgn: string | null
          played_at: string | null
          result: Database["public"]["Enums"]["game_result"]
          round_label: string | null
          source_checked_at: string | null
          source_name: string | null
          source_url: string | null
          tournament_id: string | null
          updated_at: string
          white_player_id: string | null
        }
        Insert: {
          black_player_id?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          license_name?: string | null
          license_url?: string | null
          opening_id?: string | null
          pgn?: string | null
          played_at?: string | null
          result?: Database["public"]["Enums"]["game_result"]
          round_label?: string | null
          source_checked_at?: string | null
          source_name?: string | null
          source_url?: string | null
          tournament_id?: string | null
          updated_at?: string
          white_player_id?: string | null
        }
        Update: {
          black_player_id?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          license_name?: string | null
          license_url?: string | null
          opening_id?: string | null
          pgn?: string | null
          played_at?: string | null
          result?: Database["public"]["Enums"]["game_result"]
          round_label?: string | null
          source_checked_at?: string | null
          source_name?: string | null
          source_url?: string | null
          tournament_id?: string | null
          updated_at?: string
          white_player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_black_player_id_fkey"
            columns: ["black_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_white_player_id_fkey"
            columns: ["white_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_editions: {
        Row: {
          author_id: string | null
          body_markdown: string
          created_at: string
          edition_number: number
          id: string
          mailjet_campaign_id: string | null
          preheader: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["newsletter_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body_markdown?: string
          created_at?: string
          edition_number: number
          id?: string
          mailjet_campaign_id?: string | null
          preheader?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["newsletter_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body_markdown?: string
          created_at?: string
          edition_number?: number
          id?: string
          mailjet_campaign_id?: string | null
          preheader?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["newsletter_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_editions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      openings: {
        Row: {
          created_at: string
          eco_code: string
          id: string
          moves_san: string | null
          name: string
          updated_at: string
          variation: string | null
        }
        Insert: {
          created_at?: string
          eco_code: string
          id?: string
          moves_san?: string | null
          name: string
          updated_at?: string
          variation?: string | null
        }
        Update: {
          created_at?: string
          eco_code?: string
          id?: string
          moves_san?: string | null
          name?: string
          updated_at?: string
          variation?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          bio_markdown: string | null
          birth_date: string | null
          city: string | null
          country_code: string
          created_at: string
          fide_id: number | null
          full_name: string
          id: string
          image_url: string | null
          official_url: string | null
          short_name: string | null
          slug: string
          state: string | null
          titles: string[]
          updated_at: string
        }
        Insert: {
          bio_markdown?: string | null
          birth_date?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          fide_id?: number | null
          full_name: string
          id?: string
          image_url?: string | null
          official_url?: string | null
          short_name?: string | null
          slug: string
          state?: string | null
          titles?: string[]
          updated_at?: string
        }
        Update: {
          bio_markdown?: string | null
          birth_date?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          fide_id?: number | null
          full_name?: string
          id?: string
          image_url?: string | null
          official_url?: string | null
          short_name?: string | null
          slug?: string
          state?: string | null
          titles?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          invited_at: string | null
          role: Database["public"]["Enums"]["editorial_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
          invited_at?: string | null
          role?: Database["public"]["Enums"]["editorial_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          invited_at?: string | null
          role?: Database["public"]["Enums"]["editorial_role"]
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          city: string | null
          country_code: string
          created_at: string
          description_markdown: string | null
          ends_on: string | null
          id: string
          name: string
          official_url: string | null
          organizer_name: string | null
          slug: string
          source_checked_at: string | null
          source_url: string | null
          starts_on: string | null
          state: string | null
          status: Database["public"]["Enums"]["tournament_status"]
          updated_at: string
          venue: string | null
        }
        Insert: {
          city?: string | null
          country_code?: string
          created_at?: string
          description_markdown?: string | null
          ends_on?: string | null
          id?: string
          name: string
          official_url?: string | null
          organizer_name?: string | null
          slug: string
          source_checked_at?: string | null
          source_url?: string | null
          starts_on?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
          venue?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string
          created_at?: string
          description_markdown?: string | null
          ends_on?: string | null
          id?: string
          name?: string
          official_url?: string | null
          organizer_name?: string | null
          slug?: string
          source_checked_at?: string | null
          source_url?: string | null
          starts_on?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      video_openings: {
        Row: {
          opening_id: string
          video_id: string
        }
        Insert: {
          opening_id: string
          video_id: string
        }
        Update: {
          opening_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_openings_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_openings_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_players: {
        Row: {
          player_id: string
          video_id: string
        }
        Insert: {
          player_id: string
          video_id: string
        }
        Update: {
          player_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_players_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_tags: {
        Row: {
          tag_id: string
          video_id: string
        }
        Insert: {
          tag_id: string
          video_id: string
        }
        Update: {
          tag_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_tags_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_tournaments: {
        Row: {
          tournament_id: string
          video_id: string
        }
        Insert: {
          tournament_id: string
          video_id: string
        }
        Update: {
          tournament_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_tournaments_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_tournaments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          channel_id: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          external_video_id: string
          id: string
          imported_at: string
          is_available: boolean
          is_embeddable: boolean
          playlist_external_id: string | null
          playlist_title: string | null
          published_at: string | null
          raw_metadata: Json
          source_url: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          external_video_id: string
          id?: string
          imported_at?: string
          is_available?: boolean
          is_embeddable?: boolean
          playlist_external_id?: string | null
          playlist_title?: string | null
          published_at?: string | null
          raw_metadata?: Json
          source_url: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          external_video_id?: string
          id?: string
          imported_at?: string
          is_available?: boolean
          is_embeddable?: boolean
          playlist_external_id?: string | null
          playlist_title?: string | null
          published_at?: string | null
          raw_metadata?: Json
          source_url?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_article: {
        Args: { target_article_id: string }
        Returns: boolean
      }
      can_view_article: {
        Args: { target_article_id: string }
        Returns: boolean
      }
      is_editor: { Args: never; Returns: boolean }
    }
    Enums: {
      article_source_type:
        | "primary"
        | "involved_party"
        | "journalism"
        | "social"
        | "other"
      article_status:
        | "draft"
        | "in_review"
        | "changes_requested"
        | "approved"
        | "scheduled"
        | "published"
        | "archived"
      editorial_role: "admin" | "editor" | "contributor"
      game_result: "white_win" | "black_win" | "draw" | "unfinished"
      newsletter_status:
        | "draft"
        | "approved"
        | "scheduled"
        | "sent"
        | "archived"
      tournament_status: "upcoming" | "in_progress" | "completed" | "cancelled"
      video_platform: "youtube"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      article_source_type: [
        "primary",
        "involved_party",
        "journalism",
        "social",
        "other",
      ],
      article_status: [
        "draft",
        "in_review",
        "changes_requested",
        "approved",
        "scheduled",
        "published",
        "archived",
      ],
      editorial_role: ["admin", "editor", "contributor"],
      game_result: ["white_win", "black_win", "draw", "unfinished"],
      newsletter_status: ["draft", "approved", "scheduled", "sent", "archived"],
      tournament_status: ["upcoming", "in_progress", "completed", "cancelled"],
      video_platform: ["youtube"],
    },
  },
} as const
