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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string | null
          description: string | null
          hero_image_url: string | null
          id: string
          image_url: string | null
          is_elite: boolean
          logo_image_path: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hero_image_url?: string | null
          id?: string
          image_url?: string | null
          is_elite?: boolean
          logo_image_path?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hero_image_url?: string | null
          id?: string
          image_url?: string | null
          is_elite?: boolean
          logo_image_path?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_transcripts: {
        Row: {
          ai_reply: string
          channel: string
          created_at: string
          detected_concern: string | null
          id: string
          product_ids: string[] | null
          session_id: string | null
          user_message: string
        }
        Insert: {
          ai_reply: string
          channel?: string
          created_at?: string
          detected_concern?: string | null
          id?: string
          product_ids?: string[] | null
          session_id?: string | null
          user_message: string
        }
        Update: {
          ai_reply?: string
          channel?: string
          created_at?: string
          detected_concern?: string | null
          id?: string
          product_ids?: string[] | null
          session_id?: string | null
          user_message?: string
        }
        Relationships: []
      }
      cod_orders: {
        Row: {
          assigned_at: string | null
          city: string
          created_at: string
          customer_email: string | null
          customer_lat: number | null
          customer_lng: number | null
          customer_name: string
          customer_phone: string
          delivered_at: string | null
          delivery_address: string
          delivery_notes: string | null
          driver_id: string | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          shipping_cost: number
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          city: string
          created_at?: string
          customer_email?: string | null
          customer_lat?: number | null
          customer_lng?: number | null
          customer_name: string
          customer_phone: string
          delivered_at?: string | null
          delivery_address: string
          delivery_notes?: string | null
          driver_id?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number: string
          shipping_cost?: number
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          city?: string
          created_at?: string
          customer_email?: string | null
          customer_lat?: number | null
          customer_lng?: number | null
          customer_name?: string
          customer_phone?: string
          delivered_at?: string | null
          delivery_address?: string
          delivery_notes?: string | null
          driver_id?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          shipping_cost?: number
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      concierge_profiles: {
        Row: {
          created_at: string | null
          id: string
          recommended_routine: Json | null
          skin_concern: string | null
          skin_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recommended_routine?: Json | null
          skin_concern?: string | null
          skin_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recommended_routine?: Json | null
          skin_concern?: string | null
          skin_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      consultations: {
        Row: {
          ai_response: Json | null
          channel: string | null
          concern_type: string | null
          created_at: string
          id: string
          regimen: Json | null
          sensitivity_level: string | null
          skin_type: string | null
          user_id: string | null
        }
        Insert: {
          ai_response?: Json | null
          channel?: string | null
          concern_type?: string | null
          created_at?: string
          id?: string
          regimen?: Json | null
          sensitivity_level?: string | null
          skin_type?: string | null
          user_id?: string | null
        }
        Update: {
          ai_response?: Json | null
          channel?: string | null
          concern_type?: string | null
          created_at?: string
          id?: string
          regimen?: Json | null
          sensitivity_level?: string | null
          skin_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          age_range: string | null
          body: string | null
          created_at: string
          helpful_count: number
          id: string
          primary_concern: string | null
          product_id: string
          rating: number
          skin_type: string | null
          title: string | null
          user_id: string
          verified_purchase: boolean
        }
        Insert: {
          age_range?: string | null
          body?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          primary_concern?: string | null
          product_id: string
          rating?: number
          skin_type?: string | null
          title?: string | null
          user_id: string
          verified_purchase?: boolean
        }
        Update: {
          age_range?: string | null
          body?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          primary_concern?: string | null
          product_id?: string
          rating?: number
          skin_type?: string | null
          title?: string | null
          user_id?: string
          verified_purchase?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          ai_persona_lead: string | null
          asper_category: string | null
          availability_status: string | null
          bestseller_rank: number | null
          biomarker_target: string | null
          brand: string
          category: string
          clinical_badge: string | null
          condition: string | null
          contraindications: string | null
          created_at: string
          description: string
          discount_percent: number | null
          fts: unknown
          gold_stitch_tier: boolean | null
          gtin: string | null
          handle: string | null
          hex_swatch: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          inventory_total: number | null
          is_bestseller: boolean | null
          is_hero: boolean
          is_on_sale: boolean
          key_ingredients: string[] | null
          medical_tags: string[] | null
          mpn: string | null
          name: string
          original_price: number | null
          pharmacist_note: string | null
          price: number
          primary_concern: string | null
          product_highlights: string[] | null
          regimen_step: string | null
          tags: string[] | null
          texture_profile: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          ai_persona_lead?: string | null
          asper_category?: string | null
          availability_status?: string | null
          bestseller_rank?: number | null
          biomarker_target?: string | null
          brand: string
          category: string
          clinical_badge?: string | null
          condition?: string | null
          contraindications?: string | null
          created_at?: string
          description: string
          discount_percent?: number | null
          fts?: unknown
          gold_stitch_tier?: boolean | null
          gtin?: string | null
          handle?: string | null
          hex_swatch?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          inventory_total?: number | null
          is_bestseller?: boolean | null
          is_hero?: boolean
          is_on_sale?: boolean
          key_ingredients?: string[] | null
          medical_tags?: string[] | null
          mpn?: string | null
          name: string
          original_price?: number | null
          pharmacist_note?: string | null
          price: number
          primary_concern?: string | null
          product_highlights?: string[] | null
          regimen_step?: string | null
          tags?: string[] | null
          texture_profile?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          ai_persona_lead?: string | null
          asper_category?: string | null
          availability_status?: string | null
          bestseller_rank?: number | null
          biomarker_target?: string | null
          brand?: string
          category?: string
          clinical_badge?: string | null
          condition?: string | null
          contraindications?: string | null
          created_at?: string
          description?: string
          discount_percent?: number | null
          fts?: unknown
          gold_stitch_tier?: boolean | null
          gtin?: string | null
          handle?: string | null
          hex_swatch?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          inventory_total?: number | null
          is_bestseller?: boolean | null
          is_hero?: boolean
          is_on_sale?: boolean
          key_ingredients?: string[] | null
          medical_tags?: string[] | null
          mpn?: string | null
          name?: string
          original_price?: number | null
          pharmacist_note?: string | null
          price?: number
          primary_concern?: string | null
          product_highlights?: string[] | null
          regimen_step?: string | null
          tags?: string[] | null
          texture_profile?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      regimen_plans: {
        Row: {
          concern_tag: string | null
          created_at: string
          id: string
          persona: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          concern_tag?: string | null
          created_at?: string
          id?: string
          persona?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          concern_tag?: string | null
          created_at?: string
          id?: string
          persona?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      regimen_steps: {
        Row: {
          created_at: string
          id: string
          instruction: string | null
          plan_id: string
          product_id: string | null
          step_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          instruction?: string | null
          plan_id: string
          product_id?: string | null
          step_number: number
        }
        Update: {
          created_at?: string
          id?: string
          instruction?: string | null
          plan_id?: string
          product_id?: string | null
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "regimen_steps_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "regimen_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      telemetry_events: {
        Row: {
          created_at: string | null
          event: string
          id: string
          payload: Json | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: string
          payload?: Json | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: string
          payload?: Json | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bulk_delete_purged: { Args: { p_ids: string[] }; Returns: number }
      bulk_restore_purged: { Args: { p_ids: string[] }; Returns: number }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_product_reviews: {
        Args: { p_product_id: string }
        Returns: {
          age_range: string
          body: string
          created_at: string
          helpful_count: number
          id: string
          primary_concern: string
          rating: number
          skin_type: string
          title: string
          verified_purchase: boolean
        }[]
      }
      get_tray_by_concern: { Args: { concern_tag: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      search_products: {
        Args: { max_results?: number; search_query: string }
        Returns: {
          availability_status: string
          bestseller_rank: number
          brand: string
          category: string
          created_at: string
          description: string
          handle: string
          id: string
          image_url: string
          in_stock: boolean
          is_bestseller: boolean
          is_hero: boolean
          name: string
          price: number
          primary_concern: string
          rank: number
          regimen_step: string
          tags: string[]
          title: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      skin_concern:
        | "Concern_Hydration"
        | "Concern_Acne"
        | "Concern_AntiAging"
        | "Concern_Sensitivity"
        | "Concern_Pigmentation"
        | "Concern_Brightening"
        | "Concern_Dryness"
        | "Concern_SunProtection"
        | "Concern_DarkCircles"
        | "Concern_Redness"
        | "Concern_Oiliness"
        | "Concern_Aging"
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
      app_role: ["admin", "moderator", "user"],
      skin_concern: [
        "Concern_Hydration",
        "Concern_Acne",
        "Concern_AntiAging",
        "Concern_Sensitivity",
        "Concern_Pigmentation",
        "Concern_Brightening",
        "Concern_Dryness",
        "Concern_SunProtection",
        "Concern_DarkCircles",
        "Concern_Redness",
        "Concern_Oiliness",
        "Concern_Aging",
      ],
    },
  },
} as const
