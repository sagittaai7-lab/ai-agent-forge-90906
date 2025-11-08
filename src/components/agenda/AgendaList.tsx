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

export function AgendaList() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          cliente:clientes(nome, telefone),
          profissional:profissionais(nome, funcao),
          servico:servicos(nome, preco)
        `)
        .order('data', { ascending: false })
        .order('hora_inicio', { ascending: false })
        .limit(50);

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
      loadAgendamentos();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    }
  };

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
          {agendamentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Nenhum agendamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            agendamentos.map((ag) => (
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
                    <Button variant="ghost" size="icon">
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
    </Card>
  );
}
