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
import { Save } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  agendamento: any;
}

export function EditarAgendamentoDialog({ open, onOpenChange, onSuccess, agendamento }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    profissional_id: '',
    servico_id: '',
    data: '',
    hora: '',
    status: 'pendente' as 'pendente' | 'confirmado' | 'cancelado' | 'concluido',
    observacoes: ''
  });

  useEffect(() => {
    if (open && agendamento) {
      const horaInicio = new Date(agendamento.hora_inicio);
      setFormData({
        profissional_id: agendamento.profissional_id || '',
        servico_id: agendamento.servico_id || '',
        data: agendamento.data || '',
        hora: horaInicio.toTimeString().slice(0, 5),
        status: agendamento.status || 'pendente',
        observacoes: agendamento.observacoes || ''
      });
      
      if (agendamento.empresa_id) {
        loadProfissionais(agendamento.empresa_id);
        loadServicos(agendamento.empresa_id);
      }
    }
  }, [open, agendamento]);

  const loadProfissionais = async (empresaId: string) => {
    const { data } = await supabase
      .from('profissionais')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('ativo', true);
    setProfissionais(data || []);
  };

  const loadServicos = async (empresaId: string) => {
    const { data } = await supabase
      .from('servicos')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('ativo', true);
    setServicos(data || []);
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

      const { error } = await supabase
        .from('agendamentos')
        .update({
          profissional_id: formData.profissional_id,
          servico_id: formData.servico_id,
          data: formData.data,
          hora_inicio: horaInicio.toISOString(),
          hora_fim: horaFim.toISOString(),
          status: formData.status,
          observacoes: formData.observacoes
        })
        .eq('id', agendamento.id);

      if (error) throw error;

      toast({
        title: "Agendamento atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar agendamento",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!agendamento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Cliente (não editável)</Label>
              <Input
                value={agendamento.cliente?.nome || 'Carregando...'}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select
                value={formData.profissional_id}
                onValueChange={(value) => setFormData({ ...formData, profissional_id: value })}
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

            <div className="space-y-2 col-span-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
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
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
