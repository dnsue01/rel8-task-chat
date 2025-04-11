
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Sparkles, Send, Loader2, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
      text: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const { toast } = useToast();

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 0) {
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

    // Simulate AI response (in a real app, this would call the actual API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        text: "Esta es una respuesta simulada del asistente IA. En la implementación real, aquí se mostraría la respuesta de ChatGPT basada en tu mensaje.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
                        placeholder="Escribe tu mensaje aquí..."
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
                      title: "Generar correo electrónico",
                      description: "Crea un email profesional basado en tu contexto",
                      prompt: "Redacta un email profesional para un cliente...",
                    },
                    {
                      title: "Resumir información",
                      description: "Genera un resumen conciso de tu texto",
                      prompt: "Resume el siguiente texto...",
                    },
                    {
                      title: "Mejora texto",
                      description: "Mejora la redacción de cualquier texto",
                      prompt: "Mejora la redacción del siguiente texto...",
                    },
                    {
                      title: "Preguntas para reuniones",
                      description: "Genera preguntas relevantes para una reunión",
                      prompt: "Genera 5 preguntas relevantes para una reunión con...",
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
