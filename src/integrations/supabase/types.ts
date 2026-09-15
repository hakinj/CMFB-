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
          account_number: string
          balance: number
          created_at: string
          currency: string
          id: string
          kind: string
          name: string
          routing_number: string
          user_id: string
        }
        Insert: {
          account_number: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          name: string
          routing_number?: string
          user_id: string
        }
        Update: {
          account_number?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          name?: string
          routing_number?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          detail: string
          id: string
          severity: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          detail?: string
          id?: string
          severity?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          detail?: string
          id?: string
          severity?: string
          user_id?: string | null
        }
        Relationships: []
      }
      beneficiaries: {
        Row: {
          account_number: string
          bank_name: string
          created_at: string
          id: string
          name: string
          nickname: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          name: string
          nickname?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          name?: string
          nickname?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          account_id: string | null
          brand: string
          card_type: string
          created_at: string
          exp_month: number
          exp_year: number
          frozen: boolean
          id: string
          label: string
          last4: string
          monthly_limit: number
          user_id: string
        }
        Insert: {
          account_id?: string | null
          brand?: string
          card_type?: string
          created_at?: string
          exp_month: number
          exp_year: number
          frozen?: boolean
          id?: string
          label: string
          last4: string
          monthly_limit?: number
          user_id: string
        }
        Update: {
          account_id?: string | null
          brand?: string
          card_type?: string
          created_at?: string
          exp_month?: number
          exp_year?: number
          frozen?: boolean
          id?: string
          label?: string
          last4?: string
          monthly_limit?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          status: Database["public"]["Enums"]["account_status"]
          two_factor_enabled: boolean
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          phone?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          two_factor_enabled?: boolean
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          two_factor_enabled?: boolean
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          balance_after: number
          category: string
          counterparty: string | null
          created_at: string
          description: string
          direction: Database["public"]["Enums"]["txn_direction"]
          id: string
          reference: string
          state: Database["public"]["Enums"]["txn_state"]
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          balance_after?: number
          category?: string
          counterparty?: string | null
          created_at?: string
          description: string
          direction: Database["public"]["Enums"]["txn_direction"]
          id?: string
          reference?: string
          state?: Database["public"]["Enums"]["txn_state"]
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          balance_after?: number
          category?: string
          counterparty?: string | null
          created_at?: string
          description?: string
          direction?: Database["public"]["Enums"]["txn_direction"]
          id?: string
          reference?: string
          state?: Database["public"]["Enums"]["txn_state"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
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
      admin_set_status: {
        Args: {
          _status: Database["public"]["Enums"]["account_status"]
          _user_id: string
        }
        Returns: undefined
      }
      claim_admin: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_transfer: {
        Args: {
          _amount: number
          _from_account: string
          _memo: string
          _to_account: string
          _to_name: string
        }
        Returns: Json
      }
      provision_demo: { Args: never; Returns: undefined }
    }
    Enums: {
      account_status: "PENDING" | "RESTRICTED" | "ACTIVE"
      app_role: "admin" | "customer"
      txn_direction: "credit" | "debit"
      txn_state: "pending" | "completed" | "failed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      account_status: ["PENDING", "RESTRICTED", "ACTIVE"],
      app_role: ["admin", "customer"],
      txn_direction: ["credit", "debit"],
      txn_state: ["pending", "completed", "failed"],
    },
  },
} as const
