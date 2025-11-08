import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, List, Plus, Search, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgendaCalendar } from "@/components/agenda/AgendaCalendar";
import { AgendaList } from "@/components/agenda/AgendaList";
import { NovoAgendamentoDialog } from "@/components/agenda/NovoAgendamentoDialog";
import { GerenciarEmpresaDialog } from "@/components/agenda/GerenciarEmpresaDialog";
import { FiltrosAgenda, FiltrosAgendaData } from "@/components/agenda/FiltrosAgenda";
import { Settings } from "lucide-react";

export default function Agenda() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [empresaDialogOpen, setEmpresaDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState<FiltrosAgendaData>({});

  const handleAgendamentoCriado = () => {
    setRefreshKey(prev => prev + 1);
    setDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Agenda
              </h1>
              <p className="text-muted-foreground">
                Gerencie agendamentos, clientes e profissionais
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEmpresaDialogOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Empresa
              </Button>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Button>
            </div>
          </div>

          {/* Busca Global */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, profissional, serviço ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filtros */}
          <FiltrosAgenda onFiltrosChange={setFiltros} />

          {/* Tabs */}
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                Lista
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <AgendaCalendar 
                key={`calendar-${refreshKey}`} 
                searchTerm={searchTerm} 
                filtros={filtros}
              />
            </TabsContent>

            <TabsContent value="list">
              <AgendaList 
                key={`list-${refreshKey}`} 
                searchTerm={searchTerm}
                filtros={filtros}
              />
            </TabsContent>
          </Tabs>
        </div>

        <NovoAgendamentoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleAgendamentoCriado}
        />

        <GerenciarEmpresaDialog
          open={empresaDialogOpen}
          onOpenChange={setEmpresaDialogOpen}
        />
      </main>
    </div>
  );
}
