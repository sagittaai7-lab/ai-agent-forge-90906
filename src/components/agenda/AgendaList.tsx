import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EditarAgendamentoDialog } from "./EditarAgendamentoDialog";
import { useToast } from "@/hooks/use-toast";
import { FiltrosAgendaData } from "./FiltrosAgenda";

interface Agendamento {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
  observacoes?: string;
  cliente: { nome: string; telefone?: string };
  profissional: { nome: string; funcao?: string };
  servico: { nome: string; preco?: number };
}

const statusVariants = {
  pendente: 'default',
  confirmado: 'default',
  cancelado: 'destructive',
  concluido: 'secondary'
} as const;

const statusLabels = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído'
};

interface Props {
  searchTerm?: string;
  filtros?: FiltrosAgendaData;
}

export function AgendaList({ searchTerm = '', filtros = {} }: Props) {
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState<{ open: boolean; agendamento: any }>({
    open: false,
    agendamento: null
  });

  useEffect(() => {
    loadAgendamentos();
  }, [filtros]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('agendamentos')
        .select(`
          *,
          cliente:clientes(nome, telefone),
          profissional:profissionais(nome, funcao),
          servico:servicos(nome, preco)
        `)
        .order('data', { ascending: false })
        .order('hora_inicio', { ascending: false });

      if (filtros.empresaId) {
        query = query.eq('empresa_id', filtros.empresaId);
      }
      if (filtros.profissionalId) {
        query = query.eq('profissional_id', filtros.profissionalId);
      }
      if (filtros.status && filtros.status.length > 0) {
        query = query.in('status', filtros.status as any);
      }
      if (filtros.dataInicio) {
        query = query.gte('data', filtros.dataInicio);
      }
      if (filtros.dataFim) {
        query = query.lte('data', filtros.dataFim);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: 'cancelado' })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Agendamento cancelado",
        description: "O agendamento foi cancelado com sucesso.",
      });
      
      loadAgendamentos();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast({
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar o agendamento.",
        variant: "destructive"
      });
    }
  };

  const filteredAgendamentos = agendamentos.filter((ag) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      ag.cliente.nome.toLowerCase().includes(search) ||
      ag.profissional.nome.toLowerCase().includes(search) ||
      ag.servico.nome.toLowerCase().includes(search) ||
      ag.cliente.telefone?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAgendamentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum agendamento encontrado'}
              </TableCell>
            </TableRow>
          ) : (
            filteredAgendamentos.map((ag) => (
              <TableRow key={ag.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {format(new Date(ag.data), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(ag.hora_inicio), 'HH:mm')} - {format(new Date(ag.hora_fim), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{ag.cliente.nome}</div>
                    {ag.cliente.telefone && (
                      <div className="text-sm text-muted-foreground">{ag.cliente.telefone}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{ag.profissional.nome}</div>
                    {ag.profissional.funcao && (
                      <div className="text-sm text-muted-foreground">{ag.profissional.funcao}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{ag.servico.nome}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[ag.status]}>
                    {statusLabels[ag.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ag.servico.preco ? `R$ ${ag.servico.preco.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEditDialog({ open: true, agendamento: ag })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleCancelar(ag.id)}
                      disabled={ag.status === 'cancelado'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <EditarAgendamentoDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, agendamento: null })}
        onSuccess={loadAgendamentos}
        agendamento={editDialog.agendamento}
      />
    </Card>
  );
}
