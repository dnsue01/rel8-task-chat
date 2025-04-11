
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ChatInterface from "./ChatInterface";
import { MessageSquare, Calendar, CheckSquare } from "lucide-react";
import { fetchCalendarEvents } from '@/integrations/google/googleApi';
import { fetchTaskLists, fetchTasks } from '@/integrations/google/googleApi';
import { useEffect } from 'react';

const AIAssistantComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("chat");
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
      icon: <MessageSquare className="w-5 h-5 mr-2" />,
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

  // Estado para almacenar los eventos del calendario, las tareas y las listas de tareas
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [tasks, setTasks] = useState({});

  // Cargar datos cuando se monta el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Intentar cargar eventos del calendario
        const events = await fetchCalendarEvents();
        setCalendarEvents(events);
        
        // Intentar cargar listas de tareas
        const lists = await fetchTaskLists();
        setTaskLists(lists);
        
        // Para cada lista de tareas, cargar sus tareas
        const tasksData = {};
        for (const list of lists) {
          try {
            const listTasks = await fetchTasks(list.id);
            tasksData[list.id] = listTasks;
          } catch (error) {
            console.error(`Error fetching tasks for list ${list.id}:`, error);
          }
        }
        setTasks(tasksData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex items-center mb-8">
        <div className="bg-purple-600 text-white p-2 rounded-md mr-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Asistente IA</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <ChatInterface />
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <div key={template.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-lg font-medium mb-2">{template.title}</h3>
                <p className="text-gray-500 mb-4">{template.description}</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActiveTab("chat");
                    // Aquí podríamos pasar el prompt preseleccionado a ChatInterface
                  }}
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
