
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useIntegrations } from '@/context/IntegrationsContext';
import { useCrm } from '@/context/CrmContext';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { calendarEvents, tasks, emails, taskLists } = useIntegrations();
  const { contacts, tasks: crmTasks, notes } = useCrm();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to prepare comprehensive context for the AI
  const prepareContextForAI = () => {
    let context = '';
    
    // Add calendar events context
    if (calendarEvents && calendarEvents.length > 0) {
      context += 'Tus próximos eventos de calendario:\n';
      calendarEvents.slice(0, 5).forEach(event => {
        const startDate = new Date(event.startTime).toLocaleString();
        context += `- "${event.title}" el ${startDate}\n`;
      });
      context += '\n';
    }
    
    // Add Google tasks context
    if (tasks && tasks.length > 0) {
      context += 'Tus tareas de Google:\n';
      const pendingTasks = tasks.filter(task => task.status === 'needsAction');
      pendingTasks.slice(0, 5).forEach(task => {
        context += `- ${task.title}\n`;
      });
      context += '\n';
    }
    
    // Add task lists if available
    if (taskLists && taskLists.length > 0) {
      context += 'Tus listas de tareas en Google:\n';
      taskLists.slice(0, 3).forEach(list => {
        context += `- ${list.title}\n`;
      });
      context += '\n';
    }
    
    // Add emails context
    if (emails && emails.length > 0) {
      context += 'Tus correos recientes:\n';
      emails.slice(0, 3).forEach(email => {
        const date = new Date(email.receivedAt).toLocaleDateString();
        context += `- De: ${email.sender}, Asunto: "${email.subject}" (${date})\n`;
      });
      context += '\n';
    }
    
    // Add CRM contacts context
    if (contacts && contacts.length > 0) {
      context += 'Tus contactos en el CRM:\n';
      contacts.slice(0, 5).forEach(contact => {
        context += `- ${contact.name} (${contact.status})`;
        if (contact.company) context += ` en ${contact.company}`;
        context += '\n';
      });
      context += '\n';
    }
    
    // Add CRM tasks context with detailed date information
    if (crmTasks && crmTasks.length > 0) {
      context += 'Tus tareas en el CRM:\n';
      const pendingCrmTasks = crmTasks.filter(task => !task.completed);
      pendingCrmTasks.slice(0, 5).forEach(task => {
        const contactName = contacts.find(c => c.id === task.contactId)?.name || 'Sin contacto';
        context += `- ${task.title} (${task.priority}, para ${contactName})`;
        
        // Add detailed date information
        if (task.dueDate) {
          context += `, vence ${format(task.dueDate, 'dd/MM/yyyy')}`;
        }
        
        context += `\n`;
      });
      context += '\n';
    }
    
    // Add notes context
    if (notes && notes.length > 0) {
      context += 'Tus notas recientes:\n';
      notes.slice(0, 5).forEach(note => {
        const contactName = contacts.find(c => c.id === note.contactId)?.name || 'Sin contacto';
        const shortContent = note.content.length > 50 ? note.content.substring(0, 50) + '...' : note.content;
        const noteDate = format(note.createdAt, 'dd/MM/yyyy');
        context += `- Nota para ${contactName} (${noteDate}): ${shortContent}\n`;
      });
    }
    
    return context;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare comprehensive context
      const context = prepareContextForAI();
      
      // Call the Edge Function of Supabase to process the message
      const response = await supabase.functions.invoke('openai-chat', {
        body: {
          prompt: input,
          messages: messages,
          context: context, // Pass the prepared context to the API
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error al procesar la solicitud');
      }

      // Add the assistant's response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: response.data.text || 'Lo siento, no pude procesar tu solicitud.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Add an error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-230px)] sm:h-[70vh] border rounded-lg bg-white shadow-sm">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="mb-2">¿En qué puedo ayudarte hoy?</p>
              <p className="text-sm">Puedes preguntarme sobre tus contactos, tareas o eventos.</p>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[75%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
        className="border-t p-3 flex gap-2"
      >
        <Input
          className="flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={!input.trim() || isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
