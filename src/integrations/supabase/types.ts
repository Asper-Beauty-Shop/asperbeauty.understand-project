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
      access_links: {
        Row: {
          id: string
          token: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          token: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          token?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          hero_image_url: string | null
          image_url: string | null
          logo_image_path: string | null
          description: string | null
          is_elite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          hero_image_url?: string | null
          image_url?: string | null
          logo_image_path?: string | null
          description?: string | null
          is_elite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          hero_image_url?: string | null
          image_url?: string | null
          logo_image_path?: string | null
          description?: string | null
          is_elite?: boolean
          created_at?: string
        }
        Relationships: []
      }
      cod_orders: {
        Row: {
          id: string
          order_number: string | null
          driver_id: string | null
          status: string
          items: Json
          assigned_at: string | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          total_amount: number | null
        }
        Insert: {
          id?: string
          order_number?: string | null
          driver_id?: string | null
          status?: string
          items?: Json
          assigned_at?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          total_amount?: number | null
        }
        Update: {
          id?: string
          order_number?: string | null
          driver_id?: string | null
          status?: string
          items?: Json
          assigned_at?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          total_amount?: number | null
        }
        Relationships: []
      }
      concierge_profiles: {
        Row: {
          user_id: string
          skin_type: string | null
          skin_concern: string | null
          recommended_routine: Json | null
          updated_at: string
        }
        Insert: {
          user_id: string
          skin_type?: string | null
          skin_concern?: string | null
          recommended_routine?: Json | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          skin_type?: string | null
          skin_concern?: string | null
          recommended_routine?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      consultations: {
        Row: {
          id: string
          user_id: string
          channel: string | null
          regimen: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          channel?: string | null
          regimen?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          channel?: string | null
          regimen?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          body: string | null
          skin_type: string | null
          primary_concern: string | null
          age_range: string | null
          verified_purchase: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          body?: string | null
          skin_type?: string | null
          primary_concern?: string | null
          age_range?: string | null
          verified_purchase?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          body?: string | null
          skin_type?: string | null
          primary_concern?: string | null
          age_range?: string | null
          verified_purchase?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          title: string
          brand: string | null
          price: number | null
          handle: string | null
          image_url: string | null
          ai_persona_lead: string | null
          primary_concern: string | null
          regimen_step: string | null
          inventory_total: number | null
          key_benefit: string | null
          asper_category: string | null
          availability_status: string | null
          key_ingredients: string[] | null
          texture_profile: string | null
          hex_swatch: string | null
          is_bestseller: boolean | null
          gold_stitch_tier: boolean | null
          product_highlights: string[] | null
          clinical_badge: string | null
          condition: string | null
          gtin: string | null
          mpn: string | null
          pharmacist_note: string | null
          tags: string[] | null
          bestseller_rank: number | null
          is_hero: boolean | null
          volume_ml: string | null
          is_on_sale: boolean | null
          original_price: number | null
          discount_percent: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          brand?: string | null
          price?: number | null
          handle?: string | null
          image_url?: string | null
          ai_persona_lead?: string | null
          primary_concern?: string | null
          regimen_step?: string | null
          inventory_total?: number | null
          key_benefit?: string | null
          asper_category?: string | null
          availability_status?: string | null
          key_ingredients?: string[] | null
          texture_profile?: string | null
          hex_swatch?: string | null
          is_bestseller?: boolean | null
          gold_stitch_tier?: boolean | null
          product_highlights?: string[] | null
          clinical_badge?: string | null
          condition?: string | null
          gtin?: string | null
          mpn?: string | null
          pharmacist_note?: string | null
          tags?: string[] | null
          bestseller_rank?: number | null
          is_hero?: boolean | null
          volume_ml?: string | null
          is_on_sale?: boolean | null
          original_price?: number | null
          discount_percent?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          brand?: string | null
          price?: number | null
          handle?: string | null
          image_url?: string | null
          ai_persona_lead?: string | null
          primary_concern?: string | null
          regimen_step?: string | null
          inventory_total?: number | null
          key_benefit?: string | null
          asper_category?: string | null
          availability_status?: string | null
          key_ingredients?: string[] | null
          texture_profile?: string | null
          hex_swatch?: string | null
          is_bestseller?: boolean | null
          gold_stitch_tier?: boolean | null
          product_highlights?: string[] | null
          clinical_badge?: string | null
          condition?: string | null
          gtin?: string | null
          mpn?: string | null
          pharmacist_note?: string | null
          tags?: string[] | null
          bestseller_rank?: number | null
          is_hero?: boolean | null
          volume_ml?: string | null
          is_on_sale?: boolean | null
          original_price?: number | null
          discount_percent?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          user_id: string
          display_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          display_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_funnel_events: {
        Row: {
          id: string
          step: string | null
          metadata: Json | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          step?: string | null
          metadata?: Json | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          step?: string | null
          metadata?: Json | null
          user_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      regimen_plans: {
        Row: {
          id: string
          user_id: string | null
          title: string | null
          concern: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title?: string | null
          concern?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string | null
          concern?: string | null
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      regimen_steps: {
        Row: {
          id: string
          plan_id: string
          step_number: number | null
          product_id: string | null
          instruction: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          step_number?: number | null
          product_id?: string | null
          instruction?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          step_number?: number | null
          product_id?: string | null
          instruction?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "regimen_steps_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "regimen_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      telemetry_events: {
        Row: {
          id: string
          event: string
          source: string | null
          payload: Json | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event: string
          source?: string | null
          payload?: Json | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event?: string
          source?: string | null
          payload?: Json | null
          user_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      product_reviews_public: {
        Row: {
          id: string
          product_id: string
          rating: number
          title: string | null
          body: string | null
          skin_type: string | null
          primary_concern: string | null
          age_range: string | null
          verified_purchase: boolean
          helpful_count: number
          created_at: string
        }
        Relationships: []
      }
    }
    Functions: {
      bulk_delete_purged: {
        Args: { p_ids: string[] }
        Returns: number
      }
      bulk_restore_purged: {
        Args: { p_ids: string[] }
        Returns: number
      }
      get_tray_by_concern: {
        Args: { concern_tag: string }
        Returns: Json
      }
      get_product_reviews: {
        Args: { p_product_id: string }
        Returns: {
          id: string
          product_id: string
          rating: number
          title: string | null
          body: string | null
          skin_type: string | null
          primary_concern: string | null
          age_range: string | null
          verified_purchase: boolean
          helpful_count: number
          created_at: string
        }[]
      }
      has_role: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
      upsert_concierge_profile: {
        Args: {
          p_user_id: string
          p_skin_type: string
          p_skin_concern: string
          p_recommended_routine: Json
        }
        Returns: undefined
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
