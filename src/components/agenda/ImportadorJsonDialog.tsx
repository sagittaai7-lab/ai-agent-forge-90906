import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileJson, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EXEMPLO_JSON = {
  empresas: [
    {
      id: "uuid-opcional",
      nome_fantasia: "Salão Beleza Pura",
      razao_social: "Beleza Pura LTDA",
      cnpj: "12.345.678/0001-90",
      email: "contato@belezapura.com",
      telefone: "(11) 98888-8888",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      webhook_url: "https://exemplo.com/webhook",
      ativo: true
    }
  ],
  profissionais: [
    {
      id: "uuid-opcional",
      empresa_id: "uuid-da-empresa",
      nome: "Maria Silva",
      email: "maria@belezapura.com",
      telefone: "(11) 97777-7777",
      funcao: "Cabeleireira",
      ativo: true
    },
    {
      id: "uuid-opcional",
      empresa_id: "uuid-da-empresa",
      nome: "João Santos",
      email: "joao@belezapura.com",
      telefone: "(11) 96666-6666",
      funcao: "Manicure",
      ativo: true
    }
  ],
  servicos: [
    {
      id: "uuid-opcional",
      empresa_id: "uuid-da-empresa",
      nome: "Corte Feminino",
      descricao: "Corte de cabelo feminino com finalização",
      duracao_minutos: 60,
      preco: 80.00,
      ativo: true
    },
    {
      id: "uuid-opcional",
      empresa_id: "uuid-da-empresa",
      nome: "Manicure Completa",
      descricao: "Manicure com esmaltação",
      duracao_minutos: 45,
      preco: 35.00,
      ativo: true
    }
  ],
  clientes: [
    {
      id: "uuid-opcional",
      empresa_id: "uuid-da-empresa",
      nome: "Ana Costa",
      telefone: "(11) 95555-5555",
      email: "ana@email.com",
      observacoes: "Cliente VIP"
    },
    {
      id: "uuid-opcional",
      empresa_id: "uuid-da-empresa",
      nome: "Pedro Oliveira",
      telefone: "(11) 94444-4444",
      email: "pedro@email.com",
      observacoes: null
    }
  ],
  vinculos_profissional_servico: [
    {
      profissional_id: "uuid-do-profissional",
      servico_id: "uuid-do-servico"
    }
  ]
};

export function ImportadorJsonDialog({ open, onOpenChange, onSuccess }: Props) {
  const { toast } = useToast();
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<string[]>([]);

  const handleImportar = async () => {
    setLoading(true);
    setErros([]);
    
    try {
      const dados = JSON.parse(jsonText);
      const novosErros: string[] = [];

      // Validar estrutura básica
      if (!dados.empresas || !Array.isArray(dados.empresas)) {
        novosErros.push("Campo 'empresas' é obrigatório e deve ser um array");
      }

      if (novosErros.length > 0) {
        setErros(novosErros);
        return;
      }

      // Importar empresas
      const empresasMap = new Map<string, string>();
      
      for (const empresa of dados.empresas) {
        const oldId = empresa.id;
        delete empresa.id; // Remove ID para criar novo
        
        const { data: novaEmpresa, error } = await supabase
          .from('empresas')
          .insert(empresa)
          .select()
          .single();

        if (error) {
          novosErros.push(`Erro ao importar empresa ${empresa.nome_fantasia}: ${error.message}`);
          continue;
        }

        if (oldId && novaEmpresa) {
          empresasMap.set(oldId, novaEmpresa.id);
        }
      }

      // Importar profissionais
      const profissionaisMap = new Map<string, string>();
      
      if (dados.profissionais && Array.isArray(dados.profissionais)) {
        for (const prof of dados.profissionais) {
          const oldId = prof.id;
          delete prof.id;
          
          // Atualizar empresa_id se houver mapeamento
          if (prof.empresa_id && empresasMap.has(prof.empresa_id)) {
            prof.empresa_id = empresasMap.get(prof.empresa_id);
          }

          const { data: novoProfissional, error } = await supabase
            .from('profissionais')
            .insert(prof)
            .select()
            .single();

          if (error) {
            novosErros.push(`Erro ao importar profissional ${prof.nome}: ${error.message}`);
            continue;
          }

          if (oldId && novoProfissional) {
            profissionaisMap.set(oldId, novoProfissional.id);
          }
        }
      }

      // Importar serviços
      const servicosMap = new Map<string, string>();
      
      if (dados.servicos && Array.isArray(dados.servicos)) {
        for (const servico of dados.servicos) {
          const oldId = servico.id;
          delete servico.id;
          
          // Atualizar empresa_id se houver mapeamento
          if (servico.empresa_id && empresasMap.has(servico.empresa_id)) {
            servico.empresa_id = empresasMap.get(servico.empresa_id);
          }

          const { data: novoServico, error } = await supabase
            .from('servicos')
            .insert(servico)
            .select()
            .single();

          if (error) {
            novosErros.push(`Erro ao importar serviço ${servico.nome}: ${error.message}`);
            continue;
          }

          if (oldId && novoServico) {
            servicosMap.set(oldId, novoServico.id);
          }
        }
      }

      // Importar clientes
      if (dados.clientes && Array.isArray(dados.clientes)) {
        for (const cliente of dados.clientes) {
          delete cliente.id;
          
          // Atualizar empresa_id se houver mapeamento
          if (cliente.empresa_id && empresasMap.has(cliente.empresa_id)) {
            cliente.empresa_id = empresasMap.get(cliente.empresa_id);
          }

          const { error } = await supabase
            .from('clientes')
            .insert(cliente);

          if (error) {
            novosErros.push(`Erro ao importar cliente ${cliente.nome}: ${error.message}`);
          }
        }
      }

      // Importar vínculos profissional-serviço
      if (dados.vinculos_profissional_servico && Array.isArray(dados.vinculos_profissional_servico)) {
        for (const vinculo of dados.vinculos_profissional_servico) {
          // Atualizar IDs se houver mapeamento
          if (vinculo.profissional_id && profissionaisMap.has(vinculo.profissional_id)) {
            vinculo.profissional_id = profissionaisMap.get(vinculo.profissional_id);
          }
          if (vinculo.servico_id && servicosMap.has(vinculo.servico_id)) {
            vinculo.servico_id = servicosMap.get(vinculo.servico_id);
          }

          const { error } = await supabase
            .from('profissional_servico')
            .insert(vinculo);

          if (error && !error.message.includes('duplicate')) {
            novosErros.push(`Erro ao criar vínculo: ${error.message}`);
          }
        }
      }

      if (novosErros.length > 0) {
        setErros(novosErros);
        toast({
          title: "Importação parcial",
          description: `${novosErros.length} erros encontrados. Verifique os detalhes.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Importação concluída!",
          description: "Todos os dados foram importados com sucesso.",
        });
        onSuccess();
        setJsonText("");
        onOpenChange(false);
      }

    } catch (error: any) {
      setErros([`Erro ao processar JSON: ${error.message}`]);
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = async () => {
    try {
      // Buscar todos os dados
      const { data: empresas } = await supabase.from('empresas').select('*');
      const { data: profissionais } = await supabase.from('profissionais').select('*');
      const { data: servicos } = await supabase.from('servicos').select('*');
      const { data: clientes } = await supabase.from('clientes').select('*');
      const { data: vinculos } = await supabase.from('profissional_servico').select('*');

      const exportData = {
        empresas: empresas || [],
        profissionais: profissionais || [],
        servicos: servicos || [],
        clientes: clientes || [],
        vinculos_profissional_servico: vinculos || []
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agenda-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída!",
        description: "Arquivo JSON baixado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro na exportação",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const copiarExemplo = () => {
    const exemplo = JSON.stringify(EXEMPLO_JSON, null, 2);
    navigator.clipboard.writeText(exemplo);
    toast({
      title: "Exemplo copiado!",
      description: "Cole no campo ao lado para começar a editar.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Importar/Exportar Dados JSON
          </DialogTitle>
          <DialogDescription>
            Importe ou exporte todos os dados do sistema em formato JSON
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="importar" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="importar">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </TabsTrigger>
            <TabsTrigger value="exemplo">
              <FileJson className="h-4 w-4 mr-2" />
              Exemplo
            </TabsTrigger>
            <TabsTrigger value="exportar">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="importar" className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Cole aqui o JSON com os dados para importar..."
                className="min-h-[400px] font-mono text-sm"
              />
            </div>

            {erros.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Erros encontrados:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {erros.map((erro, i) => (
                      <li key={i}>{erro}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={handleImportar} 
                disabled={loading || !jsonText.trim()}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                {loading ? "Importando..." : "Importar Dados"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="exemplo" className="flex-1 flex flex-col gap-4 overflow-hidden">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Você pode omitir os campos "id" - eles serão gerados automaticamente</li>
                  <li>O campo "empresa_id" deve referenciar uma empresa existente ou usar o ID temporário</li>
                  <li>Campos opcionais podem ser null ou omitidos</li>
                  <li>Use o botão "Copiar Exemplo" para começar rapidamente</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex-1 overflow-auto">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(EXEMPLO_JSON, null, 2)}
              </pre>
            </div>

            <Button onClick={copiarExemplo}>
              <FileJson className="mr-2 h-4 w-4" />
              Copiar Exemplo
            </Button>
          </TabsContent>

          <TabsContent value="exportar" className="flex-1 flex flex-col gap-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Exportar dados atuais</strong>
                <p className="mt-2 text-sm">
                  Esta opção irá baixar um arquivo JSON com todos os dados atualmente cadastrados no sistema:
                  empresas, profissionais, serviços, clientes e vínculos.
                </p>
                <p className="mt-2 text-sm">
                  Você pode usar este arquivo como backup ou para editar e reimportar os dados.
                </p>
              </AlertDescription>
            </Alert>

            <Button onClick={handleExportar} size="lg">
              <Download className="mr-2 h-4 w-4" />
              Baixar JSON com Dados Atuais
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
