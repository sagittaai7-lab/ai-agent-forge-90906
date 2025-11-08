import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, Briefcase, UserPlus, FileJson } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportadorJsonDialog } from "./ImportadorJsonDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GerenciarEmpresaDialog({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [importadorOpen, setImportadorOpen] = useState(false);

  useEffect(() => {
    if (open) {
      loadEmpresas();
    }
  }, [open]);

  const loadEmpresas = async () => {
    const { data } = await supabase.from('empresas').select('*');
    setEmpresas(data || []);
    if (data && data.length > 0) {
      setEmpresaSelecionada(data[0].id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Gerenciar Empresa</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportadorOpen(true)}
            >
              <FileJson className="mr-2 h-4 w-4" />
              Importar/Exportar JSON
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            {empresas.map((emp) => (
              <Button
                key={emp.id}
                variant={empresaSelecionada === emp.id ? "default" : "outline"}
                onClick={() => setEmpresaSelecionada(emp.id)}
              >
                {emp.nome_fantasia}
              </Button>
            ))}
          </div>

          <Tabs defaultValue="profissionais" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profissionais">
                <Users className="mr-2 h-4 w-4" />
                Profissionais
              </TabsTrigger>
              <TabsTrigger value="servicos">
                <Briefcase className="mr-2 h-4 w-4" />
                Serviços
              </TabsTrigger>
              <TabsTrigger value="clientes">
                <UserPlus className="mr-2 h-4 w-4" />
                Clientes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profissionais">
              <GerenciarProfissionais empresaId={empresaSelecionada} />
            </TabsContent>

            <TabsContent value="servicos">
              <GerenciarServicos empresaId={empresaSelecionada} />
            </TabsContent>

            <TabsContent value="clientes">
              <GerenciarClientes empresaId={empresaSelecionada} />
            </TabsContent>
          </Tabs>
        </div>

        <ImportadorJsonDialog
          open={importadorOpen}
          onOpenChange={setImportadorOpen}
          onSuccess={() => {
            loadEmpresas();
            toast({
              title: "Dados atualizados!",
              description: "A lista foi recarregada com os novos dados.",
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function GerenciarProfissionais({ empresaId }: { empresaId: string }) {
  const { toast } = useToast();
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');

  useEffect(() => {
    if (empresaId) loadProfissionais();
  }, [empresaId]);

  const loadProfissionais = async () => {
    const { data } = await supabase
      .from('profissionais')
      .select('*')
      .eq('empresa_id', empresaId);
    setProfissionais(data || []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('profissionais').insert({
      empresa_id: empresaId,
      nome,
      funcao
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profissional adicionado!" });
      setNome('');
      setFuncao('');
      loadProfissionais();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          placeholder="Função"
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
          required
        />
        <Button type="submit">Adicionar</Button>
      </form>

      <div className="space-y-2">
        {profissionais.map((prof) => (
          <Card key={prof.id}>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{prof.nome}</div>
                  <div className="text-sm text-muted-foreground">{prof.funcao}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GerenciarServicos({ empresaId }: { empresaId: string }) {
  const { toast } = useToast();
  const [servicos, setServicos] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');
  const [preco, setPreco] = useState('');

  useEffect(() => {
    if (empresaId) loadServicos();
  }, [empresaId]);

  const loadServicos = async () => {
    const { data } = await supabase
      .from('servicos')
      .select('*')
      .eq('empresa_id', empresaId);
    setServicos(data || []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('servicos').insert({
      empresa_id: empresaId,
      nome,
      duracao_minutos: parseInt(duracao),
      preco: parseFloat(preco)
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Serviço adicionado!" });
      setNome('');
      setDuracao('');
      setPreco('');
      loadServicos();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="Nome do serviço"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Duração (min)"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
        <Button type="submit">Adicionar</Button>
      </form>

      <div className="space-y-2">
        {servicos.map((serv) => (
          <Card key={serv.id}>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{serv.nome}</div>
                  <div className="text-sm text-muted-foreground">
                    {serv.duracao_minutos} min · R$ {serv.preco?.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GerenciarClientes({ empresaId }: { empresaId: string }) {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    if (empresaId) loadClientes();
  }, [empresaId]);

  const loadClientes = async () => {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('empresa_id', empresaId);
    setClientes(data || []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('clientes').insert({
      empresa_id: empresaId,
      nome,
      telefone
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Cliente adicionado!" });
      setNome('');
      setTelefone('');
      loadClientes();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="Nome do cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <Button type="submit">Adicionar</Button>
      </form>

      <div className="space-y-2">
        {clientes.map((cli) => (
          <Card key={cli.id}>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{cli.nome}</div>
                  <div className="text-sm text-muted-foreground">{cli.telefone}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
