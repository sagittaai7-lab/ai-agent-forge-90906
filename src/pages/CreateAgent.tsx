import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { IconRobot, IconCheck, IconChevronRight, IconChevronLeft, IconFileText, IconBuilding, IconBrain, IconSettings, IconPalette, IconEye, IconCalendar, IconUpload } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const steps = [
  { id: 1, name: "Tipo", icon: IconRobot },
  { id: 2, name: "Básico", icon: IconFileText },
  { id: 3, name: "Empresa", icon: IconBuilding },
  { id: 4, name: "Conhecimento", icon: IconBrain },
  { id: 5, name: "Modelo IA", icon: IconSettings },
  { id: 6, name: "Funcionalidades", icon: IconCalendar },
  { id: 7, name: "Personalização", icon: IconPalette },
  { id: 8, name: "Revisão", icon: IconEye },
];

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    agentType: "",
    name: "",
    description: "",
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    companyPhone: "",
    companyEmail: "",
    companyAddress: "",
    knowledgeBase: "",
    faqs: "",
    policies: "",
    model: "gpt4",
    temperature: "0.7",
    instructions: "",
    maxTokens: "2000",
    enableWebSearch: false,
    enableCodeExecution: false,
    enableImageGeneration: false,
    enableMemory: true,
    enableScheduling: false,
    enableNotifications: false,
    enableMultiLanguage: false,
    languages: [],
    workingHours: "",
    timezone: "",
    greeting: "",
    tone: "professional",
    avatar: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Agente criado com sucesso!",
      description: "Seu agente de IA foi configurado e está pronto para uso",
    });
    navigate("/dashboard");
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AppSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Criar Novo Agente</h1>
              <p className="text-muted-foreground">Configure seu agente de IA com capacidades personalizadas</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center flex-1 relative">
                    <div className={`w-full h-1 absolute top-5 left-0 ${index === 0 ? 'opacity-0' : ''} ${step.id <= currentStep ? 'bg-primary' : 'bg-border'}`} style={{ width: '50%', left: '-50%' }} />
                    <div className={`w-full h-1 absolute top-5 right-0 ${index === steps.length - 1 ? 'opacity-0' : ''} ${step.id < currentStep ? 'bg-primary' : 'bg-border'}`} style={{ width: '50%', left: '50%' }} />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                      step.id === currentStep ? 'bg-primary text-primary-foreground scale-110' :
                      step.id < currentStep ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {step.id < currentStep ? <IconCheck className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-2 text-center ${step.id === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Tipo de Agente */}
                {currentStep === 1 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Tipo de Agente</CardTitle>
                      <CardDescription>Escolha o tipo de agente que deseja criar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { value: "secretary", label: "Secretária Virtual", desc: "Agendamentos, calendário e organização" },
                          { value: "support", label: "Suporte ao Cliente", desc: "Atendimento e resolução de dúvidas" },
                          { value: "sales", label: "Vendas", desc: "Qualificação de leads e vendas" },
                          { value: "hr", label: "Recursos Humanos", desc: "Recrutamento e gestão de funcionários" },
                          { value: "marketing", label: "Marketing", desc: "Conteúdo e campanhas de marketing" },
                          { value: "custom", label: "Personalizado", desc: "Configure do zero" },
                        ].map((type) => (
                          <div
                            key={type.value}
                            onClick={() => updateFormData("agentType", type.value)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                              formData.agentType === type.value ? "border-primary bg-primary/5" : "border-border"
                            }`}
                          >
                            <h3 className="font-semibold text-foreground mb-1">{type.label}</h3>
                            <p className="text-sm text-muted-foreground">{type.desc}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Informações Básicas */}
                {currentStep === 2 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Informações Básicas</CardTitle>
                      <CardDescription>Nome e descrição do agente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome do Agente</Label>
                        <Input 
                          id="name" 
                          placeholder="Ex: Maria - Secretária Virtual" 
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Descreva o propósito e principais funções deste agente..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => updateFormData("description", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="greeting">Mensagem de Boas-Vindas</Label>
                        <Textarea 
                          id="greeting" 
                          placeholder="Ex: Olá! Sou a Maria, sua assistente virtual. Como posso ajudá-lo hoje?"
                          rows={2}
                          value={formData.greeting}
                          onChange={(e) => updateFormData("greeting", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Informações da Empresa */}
                {currentStep === 3 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Informações da Empresa</CardTitle>
                      <CardDescription>Dados sobre sua organização que o agente deve conhecer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nome da Empresa</Label>
                        <Input 
                          id="companyName" 
                          placeholder="Sua Empresa Ltda." 
                          value={formData.companyName}
                          onChange={(e) => updateFormData("companyName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyDescription">Sobre a Empresa</Label>
                        <Textarea 
                          id="companyDescription" 
                          placeholder="Descreva sua empresa, produtos/serviços, missão e valores..."
                          rows={4}
                          value={formData.companyDescription}
                          onChange={(e) => updateFormData("companyDescription", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyWebsite">Website</Label>
                          <Input 
                            id="companyWebsite" 
                            placeholder="https://suaempresa.com.br" 
                            value={formData.companyWebsite}
                            onChange={(e) => updateFormData("companyWebsite", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyPhone">Telefone</Label>
                          <Input 
                            id="companyPhone" 
                            placeholder="(11) 99999-9999" 
                            value={formData.companyPhone}
                            onChange={(e) => updateFormData("companyPhone", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyEmail">Email de Contato</Label>
                          <Input 
                            id="companyEmail" 
                            placeholder="contato@suaempresa.com.br" 
                            value={formData.companyEmail}
                            onChange={(e) => updateFormData("companyEmail", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyAddress">Endereço</Label>
                          <Input 
                            id="companyAddress" 
                            placeholder="Rua Exemplo, 123 - São Paulo/SP" 
                            value={formData.companyAddress}
                            onChange={(e) => updateFormData("companyAddress", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workingHours">Horário de Funcionamento</Label>
                        <Input 
                          id="workingHours" 
                          placeholder="Ex: Segunda a Sexta, 9h às 18h" 
                          value={formData.workingHours}
                          onChange={(e) => updateFormData("workingHours", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 4: Base de Conhecimento */}
                {currentStep === 4 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Base de Conhecimento</CardTitle>
                      <CardDescription>Informações e documentos que o agente deve conhecer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="knowledgeBase">Conhecimento Geral</Label>
                        <Textarea 
                          id="knowledgeBase" 
                          placeholder="Cole aqui documentos, manuais, procedimentos ou qualquer informação relevante que o agente deve saber..."
                          rows={6}
                          value={formData.knowledgeBase}
                          onChange={(e) => updateFormData("knowledgeBase", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">O agente usará essas informações para responder perguntas</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="faqs">Perguntas Frequentes (FAQs)</Label>
                        <Textarea 
                          id="faqs" 
                          placeholder="Liste perguntas e respostas comuns. Ex:&#10;P: Qual o horário de atendimento?&#10;R: Atendemos de segunda a sexta, das 9h às 18h."
                          rows={6}
                          value={formData.faqs}
                          onChange={(e) => updateFormData("faqs", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="policies">Políticas e Procedimentos</Label>
                        <Textarea 
                          id="policies" 
                          placeholder="Políticas de privacidade, termos de uso, procedimentos de agendamento, cancelamento, etc..."
                          rows={6}
                          value={formData.policies}
                          onChange={(e) => updateFormData("policies", e.target.value)}
                        />
                      </div>

                      <div className="border border-border rounded-lg p-4 bg-muted/20">
                        <div className="flex items-center gap-2 mb-2">
                          <IconUpload className="w-5 h-5 text-muted-foreground" />
                          <Label>Upload de Documentos (em breve)</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">Em breve você poderá fazer upload de PDFs, Word, Excel e outros documentos</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 5: Configuração do Modelo IA */}
                {currentStep === 5 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Configuração do Modelo IA</CardTitle>
                      <CardDescription>Configure o comportamento e parâmetros do modelo de IA</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="model">Modelo de IA</Label>
                        <Select value={formData.model} onValueChange={(value) => updateFormData("model", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um modelo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt4">GPT-4 (Mais inteligente)</SelectItem>
                            <SelectItem value="gpt35">GPT-3.5 (Mais rápido)</SelectItem>
                            <SelectItem value="claude">Claude 3 (Analítico)</SelectItem>
                            <SelectItem value="gemini">Gemini Pro (Google)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instructions">Instruções do Sistema</Label>
                        <Textarea 
                          id="instructions" 
                          placeholder="Ex: Você é uma secretária virtual profissional e prestativa. Sempre confirme informações importantes e seja proativa ao sugerir horários de agendamento..."
                          rows={6}
                          value={formData.instructions}
                          onChange={(e) => updateFormData("instructions", e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Defina o comportamento, tom e personalidade do agente</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="temperature">Criatividade (Temperature)</Label>
                          <Input 
                            id="temperature" 
                            type="number" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            value={formData.temperature}
                            onChange={(e) => updateFormData("temperature", e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">0 = Mais preciso | 1 = Mais criativo</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="maxTokens">Tamanho Máximo da Resposta</Label>
                          <Select value={formData.maxTokens} onValueChange={(value) => updateFormData("maxTokens", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="500">Curta (500 tokens)</SelectItem>
                              <SelectItem value="1000">Média (1000 tokens)</SelectItem>
                              <SelectItem value="2000">Longa (2000 tokens)</SelectItem>
                              <SelectItem value="4000">Muito Longa (4000 tokens)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tone">Tom de Voz</Label>
                        <Select value={formData.tone} onValueChange={(value) => updateFormData("tone", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Profissional</SelectItem>
                            <SelectItem value="friendly">Amigável</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="enthusiastic">Entusiasmado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 6: Funcionalidades Específicas */}
                {currentStep === 6 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Funcionalidades</CardTitle>
                      <CardDescription>Habilite recursos específicos para seu agente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4 text-foreground">Capacidades Básicas</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="space-y-0.5">
                              <Label>Busca na Web</Label>
                              <p className="text-sm text-muted-foreground">Buscar informações atualizadas na internet</p>
                            </div>
                            <Switch 
                              checked={formData.enableWebSearch}
                              onCheckedChange={(checked) => updateFormData("enableWebSearch", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="space-y-0.5">
                              <Label>Execução de Código</Label>
                              <p className="text-sm text-muted-foreground">Executar código e análises complexas</p>
                            </div>
                            <Switch 
                              checked={formData.enableCodeExecution}
                              onCheckedChange={(checked) => updateFormData("enableCodeExecution", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="space-y-0.5">
                              <Label>Geração de Imagens</Label>
                              <p className="text-sm text-muted-foreground">Criar imagens a partir de descrições</p>
                            </div>
                            <Switch 
                              checked={formData.enableImageGeneration}
                              onCheckedChange={(checked) => updateFormData("enableImageGeneration", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="space-y-0.5">
                              <Label>Memória de Conversas</Label>
                              <p className="text-sm text-muted-foreground">Lembrar contexto de conversas anteriores</p>
                            </div>
                            <Switch 
                              checked={formData.enableMemory}
                              onCheckedChange={(checked) => updateFormData("enableMemory", checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4 text-foreground">Funcionalidades Especializadas</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-primary/5">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Label>Sistema de Agendamento</Label>
                                <Badge variant="secondary">Secretária</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Agendar compromissos, reuniões e eventos</p>
                            </div>
                            <Switch 
                              checked={formData.enableScheduling}
                              onCheckedChange={(checked) => updateFormData("enableScheduling", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="space-y-0.5">
                              <Label>Notificações e Lembretes</Label>
                              <p className="text-sm text-muted-foreground">Enviar emails e notificações automáticas</p>
                            </div>
                            <Switch 
                              checked={formData.enableNotifications}
                              onCheckedChange={(checked) => updateFormData("enableNotifications", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="space-y-0.5">
                              <Label>Suporte Multilíngue</Label>
                              <p className="text-sm text-muted-foreground">Conversar em múltiplos idiomas</p>
                            </div>
                            <Switch 
                              checked={formData.enableMultiLanguage}
                              onCheckedChange={(checked) => updateFormData("enableMultiLanguage", checked)}
                            />
                          </div>
                        </div>
                      </div>

                      {formData.enableScheduling && (
                        <div className="p-4 border border-primary rounded-lg bg-primary/5">
                          <h4 className="font-semibold mb-3 text-foreground">Configurações de Agendamento</h4>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="timezone">Fuso Horário</Label>
                              <Select value={formData.timezone} onValueChange={(value) => updateFormData("timezone", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o fuso horário" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                                  <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.enableMultiLanguage && (
                        <div className="p-4 border border-primary rounded-lg bg-primary/5">
                          <h4 className="font-semibold mb-3 text-foreground">Idiomas Suportados</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {["Português", "Inglês", "Espanhol", "Francês", "Alemão", "Italiano"].map((lang) => (
                              <div key={lang} className="flex items-center space-x-2">
                                <input type="checkbox" id={lang} className="rounded" />
                                <Label htmlFor={lang}>{lang}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Step 7: Personalização */}
                {currentStep === 7 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Personalização</CardTitle>
                      <CardDescription>Personalize a aparência e identidade do agente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar do Agente</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <IconRobot className="w-10 h-10 text-primary-foreground" />
                          </div>
                          <div>
                            <Button variant="outline" size="sm" className="mb-2">
                              <IconUpload className="w-4 h-4 mr-2" />
                              Fazer Upload
                            </Button>
                            <p className="text-xs text-muted-foreground">Recomendado: 200x200px, PNG ou JPG</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Cor Primária</Label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            className="w-12 h-12 rounded cursor-pointer"
                            defaultValue="#8B5CF6"
                          />
                          <Input placeholder="#8B5CF6" className="flex-1" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Personalidade do Avatar</Label>
                        <Select defaultValue="professional">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Profissional</SelectItem>
                            <SelectItem value="friendly">Amigável</SelectItem>
                            <SelectItem value="modern">Moderno</SelectItem>
                            <SelectItem value="classic">Clássico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-4 border border-border rounded-lg bg-muted/20">
                        <h4 className="font-semibold mb-3 text-foreground">Pré-visualização do Chat</h4>
                        <div className="bg-background rounded-lg p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                              <IconRobot className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                              <p className="text-sm">{formData.greeting || "Olá! Como posso ajudá-lo hoje?"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 justify-end">
                            <div className="bg-primary p-3 rounded-lg max-w-[80%]">
                              <p className="text-sm text-primary-foreground">Gostaria de agendar uma reunião</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 8: Revisão */}
                {currentStep === 8 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Revisão Final</CardTitle>
                      <CardDescription>Revise todas as configurações antes de criar o agente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-2 text-foreground">Informações Básicas</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Tipo:</span> <Badge>{formData.agentType || "Não selecionado"}</Badge></p>
                            <p><span className="text-muted-foreground">Nome:</span> {formData.name || "Não definido"}</p>
                            <p><span className="text-muted-foreground">Descrição:</span> {formData.description || "Não definida"}</p>
                          </div>
                        </div>

                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-2 text-foreground">Empresa</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Nome:</span> {formData.companyName || "Não definido"}</p>
                            <p><span className="text-muted-foreground">Telefone:</span> {formData.companyPhone || "Não definido"}</p>
                            <p><span className="text-muted-foreground">Email:</span> {formData.companyEmail || "Não definido"}</p>
                          </div>
                        </div>

                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-2 text-foreground">Modelo IA</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Modelo:</span> {formData.model}</p>
                            <p><span className="text-muted-foreground">Temperature:</span> {formData.temperature}</p>
                            <p><span className="text-muted-foreground">Tom:</span> {formData.tone}</p>
                          </div>
                        </div>

                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-2 text-foreground">Funcionalidades Habilitadas</h4>
                          <div className="flex flex-wrap gap-2">
                            {formData.enableMemory && <Badge>Memória</Badge>}
                            {formData.enableWebSearch && <Badge>Busca Web</Badge>}
                            {formData.enableScheduling && <Badge>Agendamento</Badge>}
                            {formData.enableNotifications && <Badge>Notificações</Badge>}
                            {formData.enableMultiLanguage && <Badge>Multilíngue</Badge>}
                            {formData.enableCodeExecution && <Badge>Código</Badge>}
                            {formData.enableImageGeneration && <Badge>Imagens</Badge>}
                          </div>
                        </div>

                        {formData.knowledgeBase && (
                          <div className="p-4 border border-border rounded-lg">
                            <h4 className="font-semibold mb-2 text-foreground">Base de Conhecimento</h4>
                            <p className="text-sm text-muted-foreground">
                              {formData.knowledgeBase.length} caracteres de conhecimento adicionados
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <IconCheck className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Pronto para criar!</h4>
                            <p className="text-sm text-muted-foreground">
                              Seu agente será criado com todas as configurações acima. Você poderá editá-las depois.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button 
                type="button" 
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <IconChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="text-sm text-muted-foreground">
                Etapa {currentStep} de {steps.length}
              </div>

              {currentStep < steps.length ? (
                <Button 
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  Próximo
                  <IconChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  <IconRobot className="h-4 w-4 mr-2" />
                  Criar Agente
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateAgent;
