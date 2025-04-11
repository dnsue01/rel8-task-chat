
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ChatInterface from "./ChatInterface";
import { MessageSquare, Calendar, CheckSquare, Search, FileText } from "lucide-react";
import { useIntegrations } from '@/context/IntegrationsContext';
import { useIsMobile } from '@/hooks/use-mobile';

const AIAssistantComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const { calendarEvents, tasks, emails, syncCalendarEvents, syncTasks, syncEmails } = useIntegrations();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [chatInterfaceKey, setChatInterfaceKey] = useState<number>(0);

  // Templates for the AI assistant
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: "Resumir mis contactos",
      description: "Obtén un resumen de tus contactos principales",
      icon: <MessageSquare className="w-5 h-5 mr-2" />,
      prompt: "Haz un resumen de mis contactos principales"
    },
    {
      id: 2,
      title: "Tareas pendientes",
      description: "Lista mis tareas pendientes más urgentes",
      icon: <CheckSquare className="w-5 h-5 mr-2" />,
      prompt: "Muestra mis tareas pendientes urgentes"
    },
    {
      id: 3,
      title: "Búsqueda en notas",
      description: "Busca información en todas tus notas",
      icon: <Search className="w-5 h-5 mr-2" />,
      prompt: "Busca información sobre reuniones en mis notas"
    },
    {
      id: 4,
      title: "Próximos eventos",
      description: "Muestra mis próximos eventos de calendario",
      icon: <Calendar className="w-5 h-5 mr-2" />,
      prompt: "Muestra mis próximos eventos de calendario"
    }
  ]);

  // Cargar datos cuando se monta el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load calendar events, tasks, and emails
        await Promise.all([
          syncCalendarEvents(),
          syncTasks(),
          syncEmails()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, [syncCalendarEvents, syncTasks, syncEmails]);

  // Handle template selection
  useEffect(() => {
    if (selectedPrompt) {
      setActiveTab("chat");
      // Force re-render of ChatInterface with the new prompt
      setChatInterfaceKey(prev => prev + 1);
    }
  }, [selectedPrompt]);

  return (
    <div className="container mx-auto py-3 sm:py-6 px-2 sm:px-4 max-w-6xl">
      <div className="flex items-center mb-3 sm:mb-6">
        <div className="bg-purple-600 text-white p-1.5 sm:p-2 rounded-md mr-2 sm:mr-3">
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Asistente IA</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-3 sm:mb-6 w-full">
          <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">Plantillas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="focus-visible:outline-none focus-visible:ring-0">
          <ChatInterface 
            key={chatInterfaceKey} 
            initialPrompt={selectedPrompt} 
            onPromptProcessed={() => setSelectedPrompt(null)}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {templates.map(template => (
              <div key={template.id} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm">
                <div className="flex items-center mb-2">
                  {template.icon}
                  <h3 className="text-sm sm:text-base font-medium">{template.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{template.description}</p>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPrompt(template.prompt);
                  }}
                  className="w-full sm:w-auto"
                >
                  Usar plantilla
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistantComponent;
