export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_number_masked: string | null
          action_lane: string | null
          balance: number | null
          bureaus: Json
          closed_at: string | null
          created_at: string
          credit_limit: number | null
          creditor: string
          id: string
          is_negative: boolean
          notes: string | null
          opened_at: string | null
          payment_status: string | null
          report_id: string | null
          status: string | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number_masked?: string | null
          action_lane?: string | null
          balance?: number | null
          bureaus?: Json
          closed_at?: string | null
          created_at?: string
          credit_limit?: number | null
          creditor: string
          id?: string
          is_negative?: boolean
          notes?: string | null
          opened_at?: string | null
          payment_status?: string | null
          report_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number_masked?: string | null
          action_lane?: string | null
          balance?: number | null
          bureaus?: Json
          closed_at?: string | null
          created_at?: string
          credit_limit?: number | null
          creditor?: string
          id?: string
          is_negative?: boolean
          notes?: string | null
          opened_at?: string | null
          payment_status?: string | null
          report_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "credit_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_reports: {
        Row: {
          created_at: string
          id: string
          pulled_at: string
          raw_file_path: string | null
          source: string
          summary: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pulled_at?: string
          raw_file_path?: string | null
          source: string
          summary?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pulled_at?: string
          raw_file_path?: string | null
          source?: string
          summary?: Json
          user_id?: string
        }
        Relationships: []
      }
      credit_scores: {
        Row: {
          bureau: string
          created_at: string
          id: string
          pulled_at: string
          report_id: string | null
          score: number
          user_id: string
        }
        Insert: {
          bureau: string
          created_at?: string
          id?: string
          pulled_at?: string
          report_id?: string | null
          score: number
          user_id: string
        }
        Update: {
          bureau?: string
          created_at?: string
          id?: string
          pulled_at?: string
          report_id?: string | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_scores_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "credit_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          account_id: string | null
          created_at: string
          current_phase: number | null
          current_round: number
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          current_phase?: number | null
          current_round?: number
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          current_phase?: number | null
          current_round?: number
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      letter_responses: {
        Row: {
          attachment_path: string | null
          created_at: string
          id: string
          letter_id: string | null
          notes: string | null
          outcome: string
          received_at: string
          user_id: string
        }
        Insert: {
          attachment_path?: string | null
          created_at?: string
          id?: string
          letter_id?: string | null
          notes?: string | null
          outcome: string
          received_at?: string
          user_id: string
        }
        Update: {
          attachment_path?: string | null
          created_at?: string
          id?: string
          letter_id?: string | null
          notes?: string | null
          outcome?: string
          received_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "letter_responses_letter_id_fkey"
            columns: ["letter_id"]
            isOneToOne: false
            referencedRelation: "letters_sent"
            referencedColumns: ["id"]
          },
        ]
      }
      letters_sent: {
        Row: {
          bureau_or_furnisher: string
          created_at: string
          dispute_id: string | null
          id: string
          letter_template_id: string | null
          notes: string | null
          response_due_at: string | null
          sent_at: string
          tracking_number: string | null
          user_id: string
        }
        Insert: {
          bureau_or_furnisher: string
          created_at?: string
          dispute_id?: string | null
          id?: string
          letter_template_id?: string | null
          notes?: string | null
          response_due_at?: string | null
          sent_at?: string
          tracking_number?: string | null
          user_id: string
        }
        Update: {
          bureau_or_furnisher?: string
          created_at?: string
          dispute_id?: string | null
          id?: string
          letter_template_id?: string | null
          notes?: string | null
          response_due_at?: string | null
          sent_at?: string
          tracking_number?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "letters_sent_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
        ]
      }
      phase_badges: {
        Row: {
          earned_at: string
          id: string
          phase_id: string
          phase_name: string
          phase_number: number
          user_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          phase_id: string
          phase_name: string
          phase_number: number
          user_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          phase_id?: string
          phase_name?: string
          phase_number?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          question: string
          status: string
          topic: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          question: string
          status?: string
          topic: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          question?: string
          status?: string
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          kind: string
          points: number
          ref_id: string | null
          ref_table: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          kind: string
          points: number
          ref_id?: string | null
          ref_table?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          points?: number
          ref_id?: string | null
          ref_table?: string | null
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
