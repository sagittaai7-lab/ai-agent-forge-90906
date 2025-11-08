-- Criar enum para status de agendamento
CREATE TYPE public.status_agendamento AS ENUM ('pendente', 'confirmado', 'cancelado', 'concluido');

-- Criar enum para tipo de evento
CREATE TYPE public.tipo_evento AS ENUM ('agendamento_criado', 'agendamento_atualizado', 'agendamento_cancelado');

-- Tabela de empresas
CREATE TABLE public.empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_fantasia TEXT NOT NULL,
  razao_social TEXT,
  cnpj TEXT,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  logo_url TEXT,
  webhook_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de profissionais
CREATE TABLE public.profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  funcao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de serviços
CREATE TABLE public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  duracao_minutos INTEGER NOT NULL,
  preco NUMERIC(10,2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela intermediária profissional_servico
CREATE TABLE public.profissional_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  UNIQUE(profissional_id, servico_id)
);

-- Tabela de clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de agendamentos
CREATE TABLE public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  hora_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  status public.status_agendamento DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de eventos para webhook
CREATE TABLE public.outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  event_type public.tipo_evento NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_profissionais_empresa ON public.profissionais(empresa_id);
CREATE INDEX idx_servicos_empresa ON public.servicos(empresa_id);
CREATE INDEX idx_clientes_empresa ON public.clientes(empresa_id);
CREATE INDEX idx_agendamentos_empresa ON public.agendamentos(empresa_id);
CREATE INDEX idx_agendamentos_profissional ON public.agendamentos(profissional_id);
CREATE INDEX idx_agendamentos_data ON public.agendamentos(data);
CREATE INDEX idx_agendamentos_status ON public.agendamentos(status);
CREATE INDEX idx_outbox_events_processed ON public.outbox_events(processed);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profissionais_updated_at BEFORE UPDATE ON public.profissionais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON public.servicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para validar sobreposição de horários
CREATE OR REPLACE FUNCTION public.validar_conflito_horario()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.agendamentos
    WHERE profissional_id = NEW.profissional_id
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND status NOT IN ('cancelado', 'concluido')
      AND (
        (NEW.hora_inicio >= hora_inicio AND NEW.hora_inicio < hora_fim) OR
        (NEW.hora_fim > hora_inicio AND NEW.hora_fim <= hora_fim) OR
        (NEW.hora_inicio <= hora_inicio AND NEW.hora_fim >= hora_fim)
      )
  ) THEN
    RAISE EXCEPTION 'Conflito de horário: o profissional já possui agendamento neste horário';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar conflitos
CREATE TRIGGER validar_conflito_agendamento BEFORE INSERT OR UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.validar_conflito_horario();

-- Função para criar evento de webhook
CREATE OR REPLACE FUNCTION public.criar_evento_webhook()
RETURNS TRIGGER AS $$
DECLARE
  event_type public.tipo_evento;
  payload_data JSONB;
BEGIN
  -- Determinar tipo de evento
  IF (TG_OP = 'INSERT') THEN
    event_type := 'agendamento_criado';
    payload_data := row_to_json(NEW)::jsonb;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF NEW.status = 'cancelado' AND OLD.status != 'cancelado' THEN
      event_type := 'agendamento_cancelado';
    ELSE
      event_type := 'agendamento_atualizado';
    END IF;
    payload_data := row_to_json(NEW)::jsonb;
  ELSE
    RETURN NULL;
  END IF;

  -- Inserir evento na outbox
  INSERT INTO public.outbox_events (empresa_id, event_type, payload)
  VALUES (NEW.empresa_id, event_type, payload_data);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar eventos de webhook
CREATE TRIGGER criar_evento_webhook_agendamento AFTER INSERT OR UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.criar_evento_webhook();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissional_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox_events ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitindo acesso total por enquanto, ajustar depois com auth)
CREATE POLICY "Permitir tudo em empresas" ON public.empresas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo em profissionais" ON public.profissionais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo em servicos" ON public.servicos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo em profissional_servico" ON public.profissional_servico FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo em clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo em agendamentos" ON public.agendamentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo em outbox_events" ON public.outbox_events FOR ALL USING (true) WITH CHECK (true);