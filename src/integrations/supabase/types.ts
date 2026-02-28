export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      cod_orders: {
        Row: {
          assigned_at: string | null;
          city: string;
          confirmation_token: string | null;
          created_at: string;
          customer_email: string | null;
          customer_lat: number | null;
          customer_lng: number | null;
          customer_name: string;
          customer_phone: string;
          delivered_at: string | null;
          delivery_address: string;
          delivery_notes: string | null;
          driver_id: string | null;
          id: string;
          items: Json;
          notes: string | null;
          order_number: string;
          shipping_cost: number;
          status: string;
          subtotal: number;
          total: number;
          updated_at: string;
        };
        Insert: {
          assigned_at?: string | null;
          city: string;
          confirmation_token?: string | null;
          created_at?: string;
          customer_email?: string | null;
          customer_lat?: number | null;
          customer_lng?: number | null;
          customer_name: string;
          customer_phone: string;
          delivered_at?: string | null;
          delivery_address: string;
          delivery_notes?: string | null;
          driver_id?: string | null;
          id?: string;
          items: Json;
          notes?: string | null;
          order_number: string;
          shipping_cost?: number;
          status?: string;
          subtotal: number;
          total: number;
          updated_at?: string;
        };
        Update: {
          assigned_at?: string | null;
          city?: string;
          confirmation_token?: string | null;
          created_at?: string;
          customer_email?: string | null;
          customer_lat?: number | null;
          customer_lng?: number | null;
          customer_name?: string;
          customer_phone?: string;
          delivered_at?: string | null;
          delivery_address?: string;
          delivery_notes?: string | null;
          driver_id?: string | null;
          id?: string;
          items?: Json;
          notes?: string | null;
          order_number?: string;
          shipping_cost?: number;
          status?: string;
          subtotal?: number;
          total?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: number;
          metadata: Json | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          metadata?: Json | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      driver_access_logs: {
        Row: {
          accessed_fields: string[] | null;
          action_type: string;
          created_at: string;
          driver_id: string;
          id: string;
          ip_address: string | null;
          metadata: Json | null;
          order_id: string | null;
          user_agent: string | null;
        };
        Insert: {
          accessed_fields?: string[] | null;
          action_type: string;
          created_at?: string;
          driver_id: string;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          order_id?: string | null;
          user_agent?: string | null;
        };
        Update: {
          accessed_fields?: string[] | null;
          action_type?: string;
          created_at?: string;
          driver_id?: string;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          order_id?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "driver_access_logs_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "cod_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          brand: string | null;
          category: string;
          created_at: string;
          description: string | null;
          discount_percent: number | null;
          id: string;
          image_url: string | null;
          is_on_sale: boolean | null;
          original_price: number | null;
          price: number;
          scent: string | null;
          skin_concerns: string[] | null;
          source_url: string | null;
          subcategory: string | null;
          tags: string[] | null;
          texture: string | null;
          title: string;
          updated_at: string;
          volume_ml: string | null;
        };
        Insert: {
          brand?: string | null;
          category?: string;
          created_at?: string;
          description?: string | null;
          discount_percent?: number | null;
          id?: string;
          image_url?: string | null;
          is_on_sale?: boolean | null;
          original_price?: number | null;
          price: number;
          scent?: string | null;
          skin_concerns?: string[] | null;
          source_url?: string | null;
          subcategory?: string | null;
          tags?: string[] | null;
          texture?: string | null;
          title: string;
          updated_at?: string;
          volume_ml?: string | null;
        };
        Update: {
          brand?: string | null;
          category?: string;
          created_at?: string;
          description?: string | null;
          discount_percent?: number | null;
          id?: string;
          image_url?: string | null;
          is_on_sale?: boolean | null;
          original_price?: number | null;
          price?: number;
          scent?: string | null;
          skin_concerns?: string[] | null;
          source_url?: string | null;
          subcategory?: string | null;
          tags?: string[] | null;
          texture?: string | null;
          title?: string;
          updated_at?: string;
          volume_ml?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          mfa_enabled: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          mfa_enabled?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          mfa_enabled?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      match_documents: {
        Args: {
          match_count: number;
          match_threshold: number;
          query_embedding: string;
        };
        Returns: {
          content: string;
          id: number;
          metadata: Json;
          similarity: number;
        }[];
      };
    };
    Enums: {
      app_role: "admin" | "user" | "driver";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema =
  DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  } ? keyof (
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
        "Tables"
      ]
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
        "Views"
      ]
    )
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
} ? (
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
      "Tables"
    ]
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
      "Views"
    ]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (
    & DefaultSchema["Tables"]
    & DefaultSchema["Views"]
  ) ? (
      & DefaultSchema["Tables"]
      & DefaultSchema["Views"]
    )[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  } ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
      "Tables"
    ]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
    "Tables"
  ][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  } ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
      "Tables"
    ]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
    "Tables"
  ][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  } ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]][
      "Enums"
    ]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][
    EnumName
  ]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  } ? keyof DatabaseWithoutInternals[
      PublicCompositeTypeNameOrOptions["schema"]
    ]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]][
    "CompositeTypes"
  ][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "driver"],
    },
  },
} as const;
