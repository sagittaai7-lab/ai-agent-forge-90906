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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, Briefcase, UserPlus, FileJson, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImportadorJsonDialog } from "./ImportadorJsonDialog";
import { GerenciarVinculos } from "./GerenciarVinculos";

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
            <TabsList className="grid w-full grid-cols-4">
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
              <TabsTrigger value="vinculos">
                <Link2 className="mr-2 h-4 w-4" />
                Vínculos
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

            <TabsContent value="vinculos">
              <GerenciarVinculos empresaId={empresaSelecionada} />
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
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    if (empresaId) loadProfissionais();
  }, [empresaId]);

  const loadProfissionais = async () => {
    const { data } = await supabase
      .from('profissionais')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nome');
    setProfissionais(data || []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('profissionais').insert({
      empresa_id: empresaId,
      nome,
      email,
      telefone
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profissional adicionado!" });
      setNome('');
      setEmail('');
      setTelefone('');
      loadProfissionais();
    }
  };

  const handleEditar = (prof: any) => {
    setEditandoId(prof.id);
    setNome(prof.nome);
    setEmail(prof.email || '');
    setTelefone(prof.telefone || '');
  };

  const handleSalvar = async () => {
    if (!editandoId) return;
    
    const { error } = await supabase
      .from('profissionais')
      .update({ nome, email, telefone })
      .eq('id', editandoId);

    if (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } else {
      toast({ title: "Profissional atualizado" });
      cancelarEdicao();
      loadProfissionais();
    }
  };

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    const { error } = await supabase
      .from('profissionais')
      .update({ ativo: !ativo })
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    } else {
      toast({ title: ativo ? "Profissional desativado" : "Profissional ativado" });
      loadProfissionais();
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNome('');
    setEmail('');
    setTelefone('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <div className="flex gap-2 md:col-span-3">
          {editandoId ? (
            <>
              <Button type="button" onClick={handleSalvar}>Salvar</Button>
              <Button type="button" variant="outline" onClick={cancelarEdicao}>Cancelar</Button>
            </>
          ) : (
            <Button type="submit">Adicionar Profissional</Button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {profissionais.map((prof) => (
          <Card key={prof.id} style={{ opacity: prof.ativo ? 1 : 0.5 }}>
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{prof.nome}</div>
                    {!prof.ativo && <Badge variant="secondary">Inativo</Badge>}
                  </div>
                  {prof.email && <div className="text-sm text-muted-foreground">{prof.email}</div>}
                  {prof.telefone && <div className="text-sm text-muted-foreground">{prof.telefone}</div>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditar(prof)}>
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant={prof.ativo ? "secondary" : "default"}
                    onClick={() => handleToggleAtivo(prof.id, prof.ativo)}
                  >
                    {prof.ativo ? "Desativar" : "Ativar"}
                  </Button>
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
  const [descricao, setDescricao] = useState('');
  const [duracao, setDuracao] = useState('');
  const [preco, setPreco] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    if (empresaId) loadServicos();
  }, [empresaId]);

  const loadServicos = async () => {
    const { data } = await supabase
      .from('servicos')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nome');
    setServicos(data || []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('servicos').insert({
      empresa_id: empresaId,
      nome,
      descricao,
      duracao_minutos: parseInt(duracao),
      preco: preco ? parseFloat(preco) : null
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Serviço adicionado!" });
      setNome('');
      setDescricao('');
      setDuracao('');
      setPreco('');
      loadServicos();
    }
  };

  const handleEditar = (serv: any) => {
    setEditandoId(serv.id);
    setNome(serv.nome);
    setDescricao(serv.descricao || '');
    setDuracao(serv.duracao_minutos.toString());
    setPreco(serv.preco ? serv.preco.toString() : '');
  };

  const handleSalvar = async () => {
    if (!editandoId) return;
    
    const { error } = await supabase
      .from('servicos')
      .update({ 
        nome, 
        descricao, 
        duracao_minutos: parseInt(duracao),
        preco: preco ? parseFloat(preco) : null 
      })
      .eq('id', editandoId);

    if (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } else {
      toast({ title: "Serviço atualizado" });
      cancelarEdicao();
      loadServicos();
    }
  };

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    const { error } = await supabase
      .from('servicos')
      .update({ ativo: !ativo })
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    } else {
      toast({ title: ativo ? "Serviço desativado" : "Serviço ativado" });
      loadServicos();
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNome('');
    setDescricao('');
    setDuracao('');
    setPreco('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        />
        <Input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className="flex gap-2 md:col-span-2">
          {editandoId ? (
            <>
              <Button type="button" onClick={handleSalvar}>Salvar</Button>
              <Button type="button" variant="outline" onClick={cancelarEdicao}>Cancelar</Button>
            </>
          ) : (
            <Button type="submit">Adicionar Serviço</Button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {servicos.map((serv) => (
          <Card key={serv.id} style={{ opacity: serv.ativo ? 1 : 0.5 }}>
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{serv.nome}</div>
                    {!serv.ativo && <Badge variant="secondary">Inativo</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {serv.duracao_minutos} min
                    {serv.preco && ` · R$ ${parseFloat(serv.preco).toFixed(2)}`}
                  </div>
                  {serv.descricao && <div className="text-sm text-muted-foreground">{serv.descricao}</div>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditar(serv)}>
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant={serv.ativo ? "secondary" : "default"}
                    onClick={() => handleToggleAtivo(serv.id, serv.ativo)}
                  >
                    {serv.ativo ? "Desativar" : "Ativar"}
                  </Button>
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
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    if (empresaId) loadClientes();
  }, [empresaId]);

  const loadClientes = async () => {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nome');
    setClientes(data || []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('clientes').insert({
      empresa_id: empresaId,
      nome,
      email,
      telefone
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Cliente adicionado!" });
      setNome('');
      setEmail('');
      setTelefone('');
      loadClientes();
    }
  };

  const handleEditar = (cli: any) => {
    setEditandoId(cli.id);
    setNome(cli.nome);
    setEmail(cli.email || '');
    setTelefone(cli.telefone || '');
  };

  const handleSalvar = async () => {
    if (!editandoId) return;
    
    const { error } = await supabase
      .from('clientes')
      .update({ nome, email, telefone })
      .eq('id', editandoId);

    if (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } else {
      toast({ title: "Cliente atualizado" });
      cancelarEdicao();
      loadClientes();
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNome('');
    setEmail('');
    setTelefone('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          placeholder="Nome do cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <div className="flex gap-2 md:col-span-3">
          {editandoId ? (
            <>
              <Button type="button" onClick={handleSalvar}>Salvar</Button>
              <Button type="button" variant="outline" onClick={cancelarEdicao}>Cancelar</Button>
            </>
          ) : (
            <Button type="submit">Adicionar Cliente</Button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {clientes.map((cli) => (
          <Card key={cli.id}>
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{cli.nome}</div>
                  {cli.email && <div className="text-sm text-muted-foreground">{cli.email}</div>}
                  {cli.telefone && <div className="text-sm text-muted-foreground">{cli.telefone}</div>}
                </div>
                <Button size="sm" variant="outline" onClick={() => handleEditar(cli)}>
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
