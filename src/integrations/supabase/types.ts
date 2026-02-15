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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_message_audit: {
        Row: {
          completion_tokens: number | null
          created_at: string
          force_persona: string | null
          id: number
          inventory_guard: string | null
          persona: string
          prompt_tokens: number | null
          request_snippet: string | null
          triggers: string[]
          user_id: string | null
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string
          force_persona?: string | null
          id?: number
          inventory_guard?: string | null
          persona: string
          prompt_tokens?: number | null
          request_snippet?: string | null
          triggers?: string[]
          user_id?: string | null
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string
          force_persona?: string | null
          id?: number
          inventory_guard?: string | null
          persona?: string
          prompt_tokens?: number | null
          request_snippet?: string | null
          triggers?: string[]
          user_id?: string | null
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string
          persona_used: string
          recommended_skus: Json | null
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          persona_used: string
          recommended_skus?: Json | null
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          persona_used?: string
          recommended_skus?: Json | null
          response?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      concierge_profiles: {
        Row: {
          created_at: string
          id: string
          recommended_routine: Json
          skin_concern: string
          skin_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recommended_routine?: Json
          skin_concern: string
          skin_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recommended_routine?: Json
          skin_concern?: string
          skin_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      digital_tray_products: {
        Row: {
          bestseller_rank: number | null
          created_at: string
          id: string
          inventory_total: number
          is_bestseller: boolean
          is_hero: boolean
          primary_concern: Database["public"]["Enums"]["skin_concern"]
          regimen_step: Database["public"]["Enums"]["regimen_step"]
          title: string
          updated_at: string
        }
        Insert: {
          bestseller_rank?: number | null
          created_at?: string
          id: string
          inventory_total?: number
          is_bestseller?: boolean
          is_hero?: boolean
          primary_concern: Database["public"]["Enums"]["skin_concern"]
          regimen_step: Database["public"]["Enums"]["regimen_step"]
          title: string
          updated_at?: string
        }
        Update: {
          bestseller_rank?: number | null
          created_at?: string
          id?: string
          inventory_total?: number
          is_bestseller?: boolean
          is_hero?: boolean
          primary_concern?: Database["public"]["Enums"]["skin_concern"]
          regimen_step?: Database["public"]["Enums"]["regimen_step"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      Lovabke: {
        Row: {
          created_at: string
          id: number
          shopify: Database["public"]["Enums"]["shopify"]
        }
        Insert: {
          created_at?: string
          id?: number
          shopify: Database["public"]["Enums"]["shopify"]
        }
        Update: {
          created_at?: string
          id?: number
          shopify?: Database["public"]["Enums"]["shopify"]
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: number
          title: string
        }
        Insert: {
          id?: never
          title: string
        }
        Update: {
          id?: never
          title?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          ai_persona_lead: Database["public"]["Enums"]["persona_type"] | null
          availability_status: string | null
          bestseller_rank: number | null
          brand: string | null
          clinical_badge: string | null
          condition: string | null
          created_at: string
          gold_stitch_tier: boolean
          gtin: string | null
          handle: string
          hex_swatch: string | null
          id: string
          image_url: string | null
          inventory_total: number
          is_hero: boolean
          key_ingredients: string[] | null
          mpn: string | null
          pharmacist_note: string | null
          price: number | null
          primary_concern: Database["public"]["Enums"]["skin_concern"]
          product_highlights: string[] | null
          regimen_step: Database["public"]["Enums"]["regimen_step"]
          tags: string[] | null
          texture_profile: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_persona_lead?: Database["public"]["Enums"]["persona_type"] | null
          availability_status?: string | null
          bestseller_rank?: number | null
          brand?: string | null
          clinical_badge?: string | null
          condition?: string | null
          created_at?: string
          gold_stitch_tier?: boolean
          gtin?: string | null
          handle: string
          hex_swatch?: string | null
          id?: string
          image_url?: string | null
          inventory_total?: number
          is_hero?: boolean
          key_ingredients?: string[] | null
          mpn?: string | null
          pharmacist_note?: string | null
          price?: number | null
          primary_concern: Database["public"]["Enums"]["skin_concern"]
          product_highlights?: string[] | null
          regimen_step: Database["public"]["Enums"]["regimen_step"]
          tags?: string[] | null
          texture_profile?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_persona_lead?: Database["public"]["Enums"]["persona_type"] | null
          availability_status?: string | null
          bestseller_rank?: number | null
          brand?: string | null
          clinical_badge?: string | null
          condition?: string | null
          created_at?: string
          gold_stitch_tier?: boolean
          gtin?: string | null
          handle?: string
          hex_swatch?: string | null
          id?: string
          image_url?: string | null
          inventory_total?: number
          is_hero?: boolean
          key_ingredients?: string[] | null
          mpn?: string | null
          pharmacist_note?: string | null
          price?: number | null
          primary_concern?: Database["public"]["Enums"]["skin_concern"]
          product_highlights?: string[] | null
          regimen_step?: Database["public"]["Enums"]["regimen_step"]
          tags?: string[] | null
          texture_profile?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      prompt_audit_logs: {
        Row: {
          created_at: string
          experiment_key: string | null
          id: number
          locale: Database["public"]["Enums"]["locale_code"]
          notes: Json | null
          persona: Database["public"]["Enums"]["persona_type"]
          prompt_id: string | null
          session_id: string | null
          user_id: string | null
          variant: string | null
        }
        Insert: {
          created_at?: string
          experiment_key?: string | null
          id?: number
          locale: Database["public"]["Enums"]["locale_code"]
          notes?: Json | null
          persona: Database["public"]["Enums"]["persona_type"]
          prompt_id?: string | null
          session_id?: string | null
          user_id?: string | null
          variant?: string | null
        }
        Update: {
          created_at?: string
          experiment_key?: string | null
          id?: number
          locale?: Database["public"]["Enums"]["locale_code"]
          notes?: Json | null
          persona?: Database["public"]["Enums"]["persona_type"]
          prompt_id?: string | null
          session_id?: string | null
          user_id?: string | null
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_audit_logs_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_experiments: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key: string
          locale: Database["public"]["Enums"]["locale_code"]
          persona: Database["public"]["Enums"]["persona_type"]
          split_a: number
          variant_a_prompt_id: string | null
          variant_b_prompt_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          locale?: Database["public"]["Enums"]["locale_code"]
          persona: Database["public"]["Enums"]["persona_type"]
          split_a?: number
          variant_a_prompt_id?: string | null
          variant_b_prompt_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          locale?: Database["public"]["Enums"]["locale_code"]
          persona?: Database["public"]["Enums"]["persona_type"]
          split_a?: number
          variant_a_prompt_id?: string | null
          variant_b_prompt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_experiments_variant_a_prompt_id_fkey"
            columns: ["variant_a_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_experiments_variant_b_prompt_id_fkey"
            columns: ["variant_b_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          locale: Database["public"]["Enums"]["locale_code"]
          persona: Database["public"]["Enums"]["persona_type"]
          title: string
          version: number
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          locale?: Database["public"]["Enums"]["locale_code"]
          persona: Database["public"]["Enums"]["persona_type"]
          title: string
          version: number
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          locale?: Database["public"]["Enums"]["locale_code"]
          persona?: Database["public"]["Enums"]["persona_type"]
          title?: string
          version?: number
        }
        Relationships: []
      }
      "Shopify pub": {
        Row: {
          created_at: string | null
          id: string
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      telemetry_events: {
        Row: {
          correlation_id: string | null
          event: string
          id: number
          occurred_at: string
          payload: Json
          source: string
          user_id: string | null
        }
        Insert: {
          correlation_id?: string | null
          event: string
          id?: number
          occurred_at?: string
          payload?: Json
          source: string
          user_id?: string | null
        }
        Update: {
          correlation_id?: string | null
          event?: string
          id?: number
          occurred_at?: string
          payload?: Json
          source?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tenants: {
        Row: {
          tenant_id: string
          user_id: string
        }
        Insert: {
          tenant_id: string
          user_id: string
        }
        Update: {
          tenant_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_prescription: { Args: { payload: Json }; Returns: Json }
      get_tray_by_concern: {
        Args: { p_concern: Database["public"]["Enums"]["skin_concern"] }
        Returns: {
          bestseller_rank: number
          id: string
          inventory_total: number
          is_bestseller: boolean
          is_hero: boolean
          regimen_step: Database["public"]["Enums"]["regimen_step"]
          title: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      sync_tray_product: {
        Args: {
          p_bestseller_rank: number
          p_concern: Database["public"]["Enums"]["skin_concern"]
          p_id: string
          p_inventory: number
          p_is_bestseller: boolean
          p_is_hero: boolean
          p_step: Database["public"]["Enums"]["regimen_step"]
          p_title: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      locale_code: "en" | "ar"
      persona_type: "dr_sami" | "ms_zain"
      regimen_step: "Step_1_Cleanser" | "Step_2_Treatment" | "Step_3_Protection"
      shopify: "public"
      skin_concern:
        | "Concern_Acne"
        | "Concern_Hydration"
        | "Concern_Aging"
        | "Concern_Sensitivity"
        | "Concern_Pigmentation"
        | "Concern_Redness"
        | "Concern_Oiliness"
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
      app_role: ["admin", "editor"],
      locale_code: ["en", "ar"],
      persona_type: ["dr_sami", "ms_zain"],
      regimen_step: [
        "Step_1_Cleanser",
        "Step_2_Treatment",
        "Step_3_Protection",
      ],
      shopify: ["public"],
      skin_concern: [
        "Concern_Acne",
        "Concern_Hydration",
        "Concern_Aging",
        "Concern_Sensitivity",
        "Concern_Pigmentation",
        "Concern_Redness",
        "Concern_Oiliness",
      ],
    },
  },
} as const
