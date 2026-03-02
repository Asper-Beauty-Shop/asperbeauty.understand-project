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
      access_links: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          label: string
          meta: Json | null
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          label: string
          meta?: Json | null
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          label?: string
          meta?: Json | null
          url?: string
        }
        Relationships: []
      }
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
      audit_logs: {
        Row: {
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string | null
          table_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id?: string | null
          table_name: string
        }
        Update: {
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string | null
          table_name?: string
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
      cleanup_allowlist: {
        Row: {
          archive_table_name: string | null
          archive_table_schema: string | null
          table_name: string
          table_schema: string
          timestamp_column: string
        }
        Insert: {
          archive_table_name?: string | null
          archive_table_schema?: string | null
          table_name: string
          table_schema: string
          timestamp_column: string
        }
        Update: {
          archive_table_name?: string | null
          archive_table_schema?: string | null
          table_name?: string
          table_schema?: string
          timestamp_column?: string
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
        }
        Insert: {
          assigned_at?: string | null
          city?: string
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
        }
        Relationships: []
      }
      concierge_brain_rules: {
        Row: {
          action: Json
          brain_id: string
          created_at: string
          id: string
          is_active: boolean
          pattern: string | null
          rule_type: string
          weight: number
        }
        Insert: {
          action: Json
          brain_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          pattern?: string | null
          rule_type: string
          weight?: number
        }
        Update: {
          action?: Json
          brain_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          pattern?: string | null
          rule_type?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "concierge_brain_rules_brain_id_fkey"
            columns: ["brain_id"]
            isOneToOne: false
            referencedRelation: "concierge_brains"
            referencedColumns: ["id"]
          },
        ]
      }
      concierge_brains: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          priority: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
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
      consultations: {
        Row: {
          channel: string | null
          created_at: string
          id: string
          locale: string | null
          profile_id: string | null
          regimen: Json | null
          transcript: Json | null
          user_id: string
        }
        Insert: {
          channel?: string | null
          created_at?: string
          id?: string
          locale?: string | null
          profile_id?: string | null
          regimen?: Json | null
          transcript?: Json | null
          user_id: string
        }
        Update: {
          channel?: string | null
          created_at?: string
          id?: string
          locale?: string | null
          profile_id?: string | null
          regimen?: Json | null
          transcript?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "concierge_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      customer_leads: {
        Row: {
          chat_summary: string | null
          created_at: string | null
          email: string | null
          follow_up_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          order_value: number | null
          phone: string | null
          skin_concern: string | null
          source: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chat_summary?: string | null
          created_at?: string | null
          email?: string | null
          follow_up_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          order_value?: number | null
          phone?: string | null
          skin_concern?: string | null
          source?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chat_summary?: string | null
          created_at?: string | null
          email?: string | null
          follow_up_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          order_value?: number | null
          phone?: string | null
          skin_concern?: string | null
          source?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
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
      events: {
        Row: {
          event_type: string
          external_id: string | null
          id: string
          payload: Json
          provider: string
          raw_body: string
          received_at: string
          signature: string
          timestamp: number | null
          valid: boolean
        }
        Insert: {
          event_type: string
          external_id?: string | null
          id?: string
          payload: Json
          provider: string
          raw_body: string
          received_at?: string
          signature: string
          timestamp?: number | null
          valid?: boolean
        }
        Update: {
          event_type?: string
          external_id?: string | null
          id?: string
          payload?: Json
          provider?: string
          raw_body?: string
          received_at?: string
          signature?: string
          timestamp?: number | null
          valid?: boolean
        }
        Relationships: []
      }
      items: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          name: string
          price_cents: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          price_cents: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          price_cents?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
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
          is_bestseller: boolean
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
          is_bestseller?: boolean
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
          is_bestseller?: boolean
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
          auth_user_id: string | null
          created_at: string | null
          display_name: string | null
          phone: string | null
          tags: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          display_name?: string | null
          phone?: string | null
          tags?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          display_name?: string | null
          phone?: string | null
          tags?: Json | null
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
      site_config: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
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
      webhook_audit_logs: {
        Row: {
          concern_detected: string | null
          error_message: string | null
          event_type: string
          id: string
          provider: string
          received_at: string
          response_ms: number | null
          status: string
        }
        Insert: {
          concern_detected?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          provider: string
          received_at?: string
          response_ms?: number | null
          status: string
        }
        Update: {
          concern_detected?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          provider?: string
          received_at?: string
          response_ms?: number | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      digital_tray_products_v: {
        Row: {
          bestseller_rank: number | null
          created_at: string | null
          id: string | null
          inventory_total: number | null
          is_bestseller: boolean | null
          is_hero: boolean | null
          primary_concern: Database["public"]["Enums"]["skin_concern"] | null
          regimen_step: Database["public"]["Enums"]["regimen_step"] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          bestseller_rank?: number | null
          created_at?: string | null
          id?: string | null
          inventory_total?: number | null
          is_bestseller?: boolean | null
          is_hero?: boolean | null
          primary_concern?: Database["public"]["Enums"]["skin_concern"] | null
          regimen_step?: Database["public"]["Enums"]["regimen_step"] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          bestseller_rank?: number | null
          created_at?: string | null
          id?: string | null
          inventory_total?: number | null
          is_bestseller?: boolean | null
          is_hero?: boolean | null
          primary_concern?: Database["public"]["Enums"]["skin_concern"] | null
          regimen_step?: Database["public"]["Enums"]["regimen_step"] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_concierge_brain_rules: {
        Args: { in_brain_id: string; in_concern: string; in_context?: Json }
        Returns: Json
      }
      build_digital_tray: { Args: { in_concern: string }; Returns: Json }
      convert_lead: {
        Args: { lead_id: string; p_order_id: string; p_order_value: number }
        Returns: undefined
      }
      cron_cleanup: {
        Args: {
          action?: string
          archive_table?: string
          older_than_days: number
          src_table: string
          timestamp_column: string
        }
        Returns: Json
      }
      fq: { Args: { rel_name: string; rel_schema: string }; Returns: string }
      generate_prescription: { Args: { payload: Json }; Returns: Json }
      get_leads_for_followup: {
        Args: { limit_n?: number }
        Returns: {
          chat_summary: string | null
          created_at: string | null
          email: string | null
          follow_up_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          order_value: number | null
          phone: string | null
          skin_concern: string | null
          source: string
          status: string
          updated_at: string | null
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "customer_leads"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_tray_by_concern: {
        Args: { concern_tag: Database["public"]["Enums"]["skin_concern"] }
        Returns: Json
      }
      get_tray_for_user: { Args: { p_user_id: string }; Returns: Json }
      get_tray_with_concierge: {
        Args: { concierge_name: string; free_text: string; user_id?: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_lead_contacted: {
        Args: { lead_id: string; note?: string }
        Returns: undefined
      }
      normalize_concern: { Args: { input_text: string }; Returns: string }
      product_usage_hint: {
        Args: { regimen_step: string; title: string }
        Returns: Json
      }
      resolve_concierge_brain: {
        Args: { brain_name: string }
        Returns: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          priority: number
        }
        SetofOptions: {
          from: "*"
          to: "concierge_brains"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      suggest_addon_for_freeshipping: {
        Args: { cart_total: number; concern: string; target?: number }
        Returns: Json
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
      regimen_step:
        | "Step_1_Cleanser"
        | "Step_2_Treatment"
        | "Step_3_Protection"
        | "Step_1"
        | "Step_2"
        | "Step_3"
      shopify: "public"
      skin_concern:
        | "Concern_Acne"
        | "Concern_Hydration"
        | "Concern_Aging"
        | "Concern_Sensitivity"
        | "Concern_Pigmentation"
        | "Concern_Redness"
        | "Concern_Oiliness"
        | "Concern_Brightening"
        | "Concern_SunProtection"
        | "Concern_DarkCircles"
        | "Concern_AntiAging"
        | "Concern_Dryness"
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
        "Step_1",
        "Step_2",
        "Step_3",
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
        "Concern_Brightening",
        "Concern_SunProtection",
        "Concern_DarkCircles",
        "Concern_AntiAging",
        "Concern_Dryness",
      ],
    },
  },
} as const
