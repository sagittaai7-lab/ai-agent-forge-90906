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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          cliente_id: string
          created_at: string | null
          data: string
          empresa_id: string
          hora_fim: string
          hora_inicio: string
          id: string
          observacoes: string | null
          profissional_id: string
          servico_id: string
          status: Database["public"]["Enums"]["status_agendamento"] | null
          updated_at: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          data: string
          empresa_id: string
          hora_fim: string
          hora_inicio: string
          id?: string
          observacoes?: string | null
          profissional_id: string
          servico_id: string
          status?: Database["public"]["Enums"]["status_agendamento"] | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          data?: string
          empresa_id?: string
          hora_fim?: string
          hora_inicio?: string
          id?: string
          observacoes?: string | null
          profissional_id?: string
          servico_id?: string
          status?: Database["public"]["Enums"]["status_agendamento"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string | null
          email: string | null
          empresa_id: string
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          empresa_id: string
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          ativo: boolean | null
          cidade: string | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          logo_url: string | null
          nome_fantasia: string
          razao_social: string | null
          telefone: string | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          ativo?: boolean | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome_fantasia: string
          razao_social?: string | null
          telefone?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          ativo?: boolean | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome_fantasia?: string
          razao_social?: string | null
          telefone?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      outbox_events: {
        Row: {
          created_at: string | null
          empresa_id: string
          event_type: Database["public"]["Enums"]["tipo_evento"]
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          event_type: Database["public"]["Enums"]["tipo_evento"]
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          event_type?: Database["public"]["Enums"]["tipo_evento"]
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbox_events_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      profissionais: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string | null
          empresa_id: string
          funcao: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          empresa_id: string
          funcao?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string
          funcao?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profissionais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      profissional_servico: {
        Row: {
          id: string
          profissional_id: string
          servico_id: string
        }
        Insert: {
          id?: string
          profissional_id: string
          servico_id: string
        }
        Update: {
          id?: string
          profissional_id?: string
          servico_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profissional_servico_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profissional_servico_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          duracao_minutos: number
          empresa_id: string
          id: string
          nome: string
          preco: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          duracao_minutos: number
          empresa_id: string
          id?: string
          nome: string
          preco?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          duracao_minutos?: number
          empresa_id?: string
          id?: string
          nome?: string
          preco?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
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
      status_agendamento: "pendente" | "confirmado" | "cancelado" | "concluido"
      tipo_evento:
        | "agendamento_criado"
        | "agendamento_atualizado"
        | "agendamento_cancelado"
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
      status_agendamento: ["pendente", "confirmado", "cancelado", "concluido"],
      tipo_evento: [
        "agendamento_criado",
        "agendamento_atualizado",
        "agendamento_cancelado",
      ],
    },
  },
} as const
