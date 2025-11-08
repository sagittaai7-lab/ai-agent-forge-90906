import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NovoAgendamentoDialog({ open, onOpenChange, onSuccess }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    empresa_id: '',
    cliente_id: '',
    profissional_id: '',
    servico_id: '',
    data: '',
    hora: '',
    observacoes: ''
  });

  useEffect(() => {
    if (open) {
      loadEmpresas();
    }
  }, [open]);

  useEffect(() => {
    if (formData.empresa_id) {
      loadProfissionais();
      loadServicos();
      loadClientes();
    }
  }, [formData.empresa_id]);

  const loadEmpresas = async () => {
    const { data } = await supabase.from('empresas').select('*').eq('ativo', true);
    setEmpresas(data || []);
  };

  const loadProfissionais = async () => {
    const { data } = await supabase
      .from('profissionais')
      .select('*')
      .eq('empresa_id', formData.empresa_id)
      .eq('ativo', true);
    setProfissionais(data || []);
  };

  const loadServicos = async () => {
    const { data } = await supabase
      .from('servicos')
      .select('*')
      .eq('empresa_id', formData.empresa_id)
      .eq('ativo', true);
    setServicos(data || []);
  };

  const loadClientes = async () => {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('empresa_id', formData.empresa_id);
    setClientes(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const horaInicio = new Date(`${formData.data}T${formData.hora}:00`);
      
      // Buscar duração do serviço
      const { data: servico } = await supabase
        .from('servicos')
        .select('duracao_minutos')
        .eq('id', formData.servico_id)
        .single();

      if (!servico) throw new Error('Serviço não encontrado');

      const horaFim = new Date(horaInicio.getTime() + servico.duracao_minutos * 60000);

      const { error } = await supabase.from('agendamentos').insert({
        empresa_id: formData.empresa_id,
        cliente_id: formData.cliente_id,
        profissional_id: formData.profissional_id,
        servico_id: formData.servico_id,
        data: formData.data,
        hora_inicio: horaInicio.toISOString(),
        hora_fim: horaFim.toISOString(),
        status: 'pendente',
        observacoes: formData.observacoes
      });

      if (error) throw error;

      toast({
        title: "Agendamento criado!",
        description: "O agendamento foi criado com sucesso.",
      });

      onSuccess();
      setFormData({
        empresa_id: '',
        cliente_id: '',
        profissional_id: '',
        servico_id: '',
        data: '',
        hora: '',
        observacoes: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select
                value={formData.empresa_id}
                onValueChange={(value) => setFormData({ ...formData, empresa_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.nome_fantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={formData.cliente_id}
                onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
                disabled={!formData.empresa_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cli) => (
                    <SelectItem key={cli.id} value={cli.id}>
                      {cli.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select
                value={formData.profissional_id}
                onValueChange={(value) => setFormData({ ...formData, profissional_id: value })}
                disabled={!formData.empresa_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {profissionais.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.nome} - {prof.funcao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select
                value={formData.servico_id}
                onValueChange={(value) => setFormData({ ...formData, servico_id: value })}
                disabled={!formData.empresa_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicos.map((serv) => (
                    <SelectItem key={serv.id} value={serv.id}>
                      {serv.nome} - {serv.duracao_minutos}min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Hora</Label>
              <Input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações sobre o agendamento..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Agendamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
