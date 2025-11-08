import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  empresaId: string;
}

export const GerenciarVinculos = ({ empresaId }: Props) => {
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<string>("");
  const [vinculos, setVinculos] = useState<string[]>([]);
  const { toast } = useToast();

  const loadProfissionais = async () => {
    const { data } = await supabase
      .from("profissionais")
      .select("*")
      .eq("empresa_id", empresaId)
      .eq("ativo", true)
      .order("nome");
    if (data) setProfissionais(data);
  };

  const loadServicos = async () => {
    const { data } = await supabase
      .from("servicos")
      .select("*")
      .eq("empresa_id", empresaId)
      .eq("ativo", true)
      .order("nome");
    if (data) setServicos(data);
  };

  const loadVinculos = async (profissionalId: string) => {
    const { data } = await supabase
      .from("profissional_servico")
      .select("servico_id")
      .eq("profissional_id", profissionalId);
    
    if (data) {
      setVinculos(data.map(v => v.servico_id));
    }
  };

  useEffect(() => {
    loadProfissionais();
    loadServicos();
  }, [empresaId]);

  useEffect(() => {
    if (profissionalSelecionado) {
      loadVinculos(profissionalSelecionado);
    } else {
      setVinculos([]);
    }
  }, [profissionalSelecionado]);

  const handleToggleVinculo = async (servicoId: string, checked: boolean) => {
    if (!profissionalSelecionado) return;

    if (checked) {
      // Adicionar vínculo
      const { error } = await supabase
        .from("profissional_servico")
        .insert({ profissional_id: profissionalSelecionado, servico_id: servicoId });

      if (error) {
        toast({ title: "Erro ao vincular serviço", variant: "destructive" });
      } else {
        toast({ title: "Serviço vinculado com sucesso" });
        setVinculos([...vinculos, servicoId]);
      }
    } else {
      // Remover vínculo
      const { error } = await supabase
        .from("profissional_servico")
        .delete()
        .eq("profissional_id", profissionalSelecionado)
        .eq("servico_id", servicoId);

      if (error) {
        toast({ title: "Erro ao desvincular serviço", variant: "destructive" });
      } else {
        toast({ title: "Serviço desvinculado" });
        setVinculos(vinculos.filter(id => id !== servicoId));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Selecione o profissional</label>
        <Select value={profissionalSelecionado} onValueChange={setProfissionalSelecionado}>
          <SelectTrigger>
            <SelectValue placeholder="Escolha um profissional" />
          </SelectTrigger>
          <SelectContent>
            {profissionais.map((prof) => (
              <SelectItem key={prof.id} value={prof.id}>
                {prof.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {profissionalSelecionado ? (
        <>
          {servicos.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhum serviço ativo cadastrado. Adicione serviços na aba "Serviços".
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Selecione os serviços que este profissional pode executar:
              </div>
              <div className="space-y-3">
                {servicos.map((servico) => {
                  const isVinculado = vinculos.includes(servico.id);
                  return (
                    <div key={servico.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                      <Checkbox
                        id={`servico-${servico.id}`}
                        checked={isVinculado}
                        onCheckedChange={(checked) => handleToggleVinculo(servico.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`servico-${servico.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                        >
                          {servico.nome}
                          {isVinculado && <Badge variant="default">Vinculado</Badge>}
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {servico.duracao_minutos} min
                          {servico.preco && ` • R$ ${parseFloat(servico.preco).toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {vinculos.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Este profissional não possui serviços vinculados. Marque os serviços que ele pode executar.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Selecione um profissional acima para gerenciar seus serviços.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
