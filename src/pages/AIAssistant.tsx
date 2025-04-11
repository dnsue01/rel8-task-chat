
import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Sparkles, Send, Loader2, User, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCrm } from "../context/CrmContext";
import { useIntegrations } from "../context/IntegrationsContext";
import { supabase } from "../integrations/supabase/client";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
};

const AIAssistant = () => {
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy? Tengo acceso a tus contactos, notas y tareas para darte una asistencia más personalizada.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const { toast } = useToast();
  
  // Get CRM data
  const { 
    contacts, 
    tasks, 
    notes, 
    currentUser 
  } = useCrm();
  
  // Get integrations data
  const { 
    calendarEvents, 
    emails,
  } = useIntegrations();

  // Prepare context for AI
  const [contextSummary, setContextSummary] = useState("");

  // Generate context summary for the AI
  useEffect(() => {
    if (contacts.length === 0 && notes.length === 0 && tasks.length === 0) {
      setContextSummary("");
      return;
    }

    let summary = "";
    
    if (contacts.length > 0) {
      summary += `Tienes ${contacts.length} contactos. `;
      summary += `Los últimos contactos son: ${contacts.slice(0, 3).map(c => c.name).join(", ")}. `;
    }
    
    if (tasks.length > 0) {
      const pendingTasks = tasks.filter(t => t.status !== "completed" && t.status !== "done");
      summary += `Tienes ${pendingTasks.length} tareas pendientes. `;
      if (pendingTasks.length > 0) {
        summary += `Las más urgentes son: ${pendingTasks.slice(0, 2).map(t => t.title).join(", ")}. `;
      }
    }
    
    if (notes.length > 0) {
      summary += `Has guardado ${notes.length} notas. `;
    }

    if (calendarEvents && calendarEvents.length > 0) {
      summary += `Tienes ${calendarEvents.length} eventos de calendario próximos. `;
    }

    if (emails && emails.length > 0) {
      summary += `Tienes ${emails.length} emails recientes. `;
    }

    setContextSummary(summary);
  }, [contacts, tasks, notes, calendarEvents, emails]);

  // Check if API key is stored in localStorage
  useEffect(() => {
    const storedKey = localStorage.getItem("openai_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsApiKeySet(true);
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 0) {
      localStorage.setItem("openai_api_key", apiKey);
      setIsApiKeySet(true);
      toast({
        title: "API Key configurada",
        description: "La API Key de ChatGPT ha sido configurada correctamente.",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === "") return;

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    setPrompt("");
    setIsLoading(true);

    try {
      // Call OpenAI API through our Supabase Edge Function
      const response = await supabase.functions.invoke("openai-chat", {
        body: {
          prompt: prompt,
          context: contextSummary,
          apiKey: apiKey,
          messages: messages.slice(-6) // Send the last 6 messages for context
        }
      });

      if (response.error) {
        throw new Error(`Error al procesar tu consulta: ${response.error.message}`);
      }

      // Add AI response to the chat
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        text: response.data.text || "Lo siento, no pude procesar tu consulta en este momento.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo conectar con la API de OpenAI. Verifica tu API Key y tu conexión.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideSidebar>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-md mr-3">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Asistente IA</h1>
        </div>

        {!isApiKeySet ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium">Configurar ChatGPT</h2>
                  <p className="text-sm text-gray-500">
                    Para utilizar el asistente IA, necesitas proporcionar tu API Key de OpenAI.
                  </p>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-400">
                    Tu API Key se almacena localmente y nunca se envía a nuestros servidores.
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" /> Activar Asistente IA
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {contextSummary && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-700">Contexto del CRM disponible</h3>
                  <p className="text-xs text-blue-600 mt-1">{contextSummary}</p>
                </div>
              </div>
            )}
            
            <Tabs defaultValue="chat">
              <TabsList className="mb-6">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="templates">Plantillas</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <div className="bg-white rounded-lg shadow border h-[60vh] flex flex-col">
                  <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            {message.sender === "user" ? (
                              <User className="h-4 w-4 mr-1" />
                            ) : (
                              <Sparkles className="h-4 w-4 mr-1" />
                            )}
                            <span className="text-xs opacity-70">
                              {message.sender === "user" ? "Tú" : "Asistente IA"}
                            </span>
                          </div>
                          <div>{message.text}</div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span>Pensando...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Textarea
                        placeholder="Escribe tu mensaje aquí... Puedes preguntarme sobre tus contactos, tareas o notas."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 resize-none h-11 py-3 min-h-11"
                      />
                      <Button type="submit" disabled={isLoading || prompt.trim() === ""}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        <span className="sr-only">Enviar</span>
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Resumir mis contactos",
                      description: "Obtén un resumen de tus contactos principales",
                      prompt: "Dame un resumen de mis contactos más importantes.",
                    },
                    {
                      title: "Tareas pendientes",
                      description: "Lista mis tareas pendientes más urgentes",
                      prompt: "¿Cuáles son mis tareas pendientes más urgentes?",
                    },
                    {
                      title: "Búsqueda en notas",
                      description: "Busca información en todas tus notas",
                      prompt: "Busca en mis notas información sobre [tema].",
                    },
                    {
                      title: "Próximos eventos",
                      description: "Muestra mis próximos eventos de calendario",
                      prompt: "¿Qué eventos tengo programados próximamente?",
                    },
                  ].map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:border-primary/50 transition-all">
                      <CardContent className="p-5">
                        <h3 className="font-medium mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt(template.prompt)}
                        >
                          Usar plantilla
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIAssistant;
