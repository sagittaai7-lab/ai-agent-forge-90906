import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export interface FiltrosAgendaData {
  empresaId?: string;
  profissionalId?: string;
  status?: string[];
  dataInicio?: string;
  dataFim?: string;
}

interface Props {
  onFiltrosChange: (filtros: FiltrosAgendaData) => void;
}

export const FiltrosAgenda = ({ onFiltrosChange }: Props) => {
  const [expandido, setExpandido] = useState(false);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [filtros, setFiltros] = useState<FiltrosAgendaData>({});

  const statusOptions = [
    { value: "pendente", label: "Pendente" },
    { value: "confirmado", label: "Confirmado" },
    { value: "cancelado", label: "Cancelado" },
    { value: "concluido", label: "Concluído" },
  ];

  useEffect(() => {
    loadEmpresas();
  }, []);

  useEffect(() => {
    if (filtros.empresaId) {
      loadProfissionais(filtros.empresaId);
    } else {
      setProfissionais([]);
    }
  }, [filtros.empresaId]);

  const loadEmpresas = async () => {
    const { data } = await supabase
      .from("empresas")
      .select("*")
      .eq("ativo", true)
      .order("nome_fantasia");
    if (data) setEmpresas(data);
  };

  const loadProfissionais = async (empresaId: string) => {
    const { data } = await supabase
      .from("profissionais")
      .select("*")
      .eq("empresa_id", empresaId)
      .eq("ativo", true)
      .order("nome");
    if (data) setProfissionais(data);
  };

  const atualizarFiltro = (campo: keyof FiltrosAgendaData, valor: any) => {
    const novosFiltros = { ...filtros, [campo]: valor };
    
    // Se mudar empresa, limpar profissional
    if (campo === "empresaId" && filtros.empresaId !== valor) {
      novosFiltros.profissionalId = undefined;
    }
    
    setFiltros(novosFiltros);
    onFiltrosChange(novosFiltros);
  };

  const toggleStatus = (status: string) => {
    const statusAtuais = filtros.status || [];
    const novosStatus = statusAtuais.includes(status)
      ? statusAtuais.filter(s => s !== status)
      : [...statusAtuais, status];
    
    atualizarFiltro("status", novosStatus.length > 0 ? novosStatus : undefined);
  };

  const limparFiltros = () => {
    setFiltros({});
    onFiltrosChange({});
  };

  const contarFiltrosAtivos = () => {
    let count = 0;
    if (filtros.empresaId) count++;
    if (filtros.profissionalId) count++;
    if (filtros.status && filtros.status.length > 0) count++;
    if (filtros.dataInicio) count++;
    if (filtros.dataFim) count++;
    return count;
  };

  const filtrosAtivos = contarFiltrosAtivos();

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setExpandido(!expandido)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {filtrosAtivos > 0 && (
            <Badge variant="default">{filtrosAtivos}</Badge>
          )}
        </Button>
        {filtrosAtivos > 0 && (
          <Button
            variant="ghost"
            onClick={limparFiltros}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      {expandido && (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro Empresa */}
            <div>
              <label className="text-sm font-medium mb-2 block">Empresa</label>
              <Select 
                value={filtros.empresaId || ""} 
                onValueChange={(val) => atualizarFiltro("empresaId", val || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as empresas</SelectItem>
                  {empresas.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.nome_fantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Profissional */}
            <div>
              <label className="text-sm font-medium mb-2 block">Profissional</label>
              <Select 
                value={filtros.profissionalId || ""} 
                onValueChange={(val) => atualizarFiltro("profissionalId", val || undefined)}
                disabled={!filtros.empresaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={filtros.empresaId ? "Todos os profissionais" : "Selecione empresa primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os profissionais</SelectItem>
                  {profissionais.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Data Início */}
            <div>
              <label className="text-sm font-medium mb-2 block">Data Início</label>
              <Input
                type="date"
                value={filtros.dataInicio || ""}
                onChange={(e) => atualizarFiltro("dataInicio", e.target.value || undefined)}
              />
            </div>

            {/* Filtro Data Fim */}
            <div>
              <label className="text-sm font-medium mb-2 block">Data Fim</label>
              <Input
                type="date"
                value={filtros.dataFim || ""}
                onChange={(e) => atualizarFiltro("dataFim", e.target.value || undefined)}
              />
            </div>
          </div>

          {/* Filtro Status */}
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <div className="flex flex-wrap gap-3">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={filtros.status?.includes(option.value) || false}
                    onCheckedChange={() => toggleStatus(option.value)}
                  />
                  <label
                    htmlFor={`status-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
