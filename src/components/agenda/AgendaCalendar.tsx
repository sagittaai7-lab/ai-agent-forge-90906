import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Agendamento {
  id: string;
  hora_inicio: string;
  hora_fim: string;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
  cliente: { nome: string };
  profissional: { nome: string };
  servico: { nome: string };
}

const statusColors = {
  pendente: 'bg-blue-500',
  confirmado: 'bg-green-500',
  cancelado: 'bg-red-500',
  concluido: 'bg-gray-500'
};

const statusLabels = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído'
};

interface Props {
  searchTerm?: string;
}

export function AgendaCalendar({ searchTerm = '' }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgendamentos();
  }, [selectedDate]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      const weekStart = startOfWeek(selectedDate, { locale: ptBR });
      const weekEnd = endOfWeek(selectedDate, { locale: ptBR });

      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          cliente:clientes(nome),
          profissional:profissionais(nome),
          servico:servicos(nome)
        `)
        .gte('data', format(weekStart, 'yyyy-MM-dd'))
        .lte('data', format(weekEnd, 'yyyy-MM-dd'))
        .order('hora_inicio');

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { locale: ptBR }),
    end: endOfWeek(selectedDate, { locale: ptBR })
  });

  const getAgendamentosForDay = (day: Date) => {
    const dayAgendamentos = agendamentos.filter(ag => 
      isSameDay(new Date(ag.hora_inicio), day)
    );
    
    if (!searchTerm) return dayAgendamentos;
    
    const search = searchTerm.toLowerCase();
    return dayAgendamentos.filter((ag) =>
      ag.cliente.nome.toLowerCase().includes(search) ||
      ag.profissional.nome.toLowerCase().includes(search) ||
      ag.servico.nome.toLowerCase().includes(search)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={ptBR}
            className="pointer-events-auto"
          />
        </Card>

        <div className="flex-1">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayAgendamentos = getAgendamentosForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <Card 
                  key={day.toString()} 
                  className={`p-3 ${isToday ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="font-semibold text-sm mb-2">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className="text-2xl font-bold mb-3">
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-2">
                    {dayAgendamentos.length === 0 ? (
                      <div className="text-xs text-muted-foreground">
                        Sem agendamentos
                      </div>
                    ) : (
                      dayAgendamentos.map((ag) => (
                        <div
                          key={ag.id}
                          className={`text-xs p-2 rounded ${statusColors[ag.status]} bg-opacity-10 border-l-2 border-${statusColors[ag.status].split('-')[1]}-500`}
                        >
                          <div className="font-medium">
                            {format(new Date(ag.hora_inicio), 'HH:mm')}
                          </div>
                          <div className="truncate">{ag.cliente.nome}</div>
                          <div className="text-[10px] opacity-80 truncate">
                            {ag.servico.nome}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center text-sm">
        <span className="font-medium">Legenda:</span>
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span>{statusLabels[status as keyof typeof statusLabels]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
