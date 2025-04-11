import React, { createContext, useContext, useState, useEffect } from "react";
import { CalendarEvent, Email, GoogleAuthConfig, IntegrationSyncState, MatchResult } from "../types/integrations";
import { useCrm } from "./CrmContext";
import { toast } from "@/components/ui/use-toast";
import { parseISO } from "date-fns";

type IntegrationsContextType = {
  // Auth state
  isGoogleConnected: boolean;
  googleConfig: GoogleAuthConfig | null;
  
  // Data
  calendarEvents: CalendarEvent[];
  emails: Email[];
  syncState: IntegrationSyncState;
  
  // Actions
  connectGoogleCalendar: () => Promise<void>;
  disconnectGoogleCalendar: () => void;
  syncCalendarEvents: () => Promise<void>;
  syncEmails: () => Promise<void>;
  
  // Linking
  linkNoteToEvent: (noteId: string, eventId: string) => void;
  linkEmailToNote: (emailId: string, noteId: string) => void;
  linkEmailToEvent: (emailId: string, eventId: string) => void;
  
  // Helpers
  getEventById: (id: string) => CalendarEvent | undefined;
  getEmailById: (id: string) => Email | undefined;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEmailsForDate: (date: Date) => Email[];
  findMatchesForNote: (noteId: string) => MatchResult[];
  findMatchesForEmail: (emailId: string) => MatchResult[];
};

const IntegrationsContext = createContext<IntegrationsContextType | undefined>(undefined);

export const IntegrationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, notes } = useCrm();
  
  // States
  const [googleConfig, setGoogleConfig] = useState<GoogleAuthConfig | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [syncState, setSyncState] = useState<IntegrationSyncState>({});
  
  // Load saved integrations data from localStorage when available
  useEffect(() => {
    if (!currentUser) return;
    
    try {
      const savedGoogleConfig = localStorage.getItem(`crm_google_config_${currentUser.id}`);
      const savedCalendarEvents = localStorage.getItem(`crm_calendar_events_${currentUser.id}`);
      const savedEmails = localStorage.getItem(`crm_emails_${currentUser.id}`);
      const savedSyncState = localStorage.getItem(`crm_sync_state_${currentUser.id}`);
      
      if (savedGoogleConfig) setGoogleConfig(JSON.parse(savedGoogleConfig));
      if (savedCalendarEvents) {
        const parsedEvents = JSON.parse(savedCalendarEvents) as CalendarEvent[];
        setCalendarEvents(parsedEvents.map(event => ({
          ...event,
          startTime: parseISO(event.startTime as unknown as string),
          endTime: parseISO(event.endTime as unknown as string)
        })));
      }
      if (savedEmails) {
        const parsedEmails = JSON.parse(savedEmails) as Email[];
        setEmails(parsedEmails.map(email => ({
          ...email,
          receivedAt: parseISO(email.receivedAt as unknown as string)
        })));
      }
      if (savedSyncState) {
        const parsedSyncState = JSON.parse(savedSyncState) as IntegrationSyncState;
        setSyncState({
          ...parsedSyncState,
          lastCalendarSync: parsedSyncState.lastCalendarSync ? parseISO(parsedSyncState.lastCalendarSync as unknown as string) : undefined,
          lastEmailSync: parsedSyncState.lastEmailSync ? parseISO(parsedSyncState.lastEmailSync as unknown as string) : undefined,
        });
      }
    } catch (error) {
      console.error("Error loading integration data:", error);
    }
  }, [currentUser]);
  
  // Save integration data to localStorage when it changes
  useEffect(() => {
    if (!currentUser) return;
    
    if (googleConfig) {
      localStorage.setItem(`crm_google_config_${currentUser.id}`, JSON.stringify(googleConfig));
    }
    localStorage.setItem(`crm_calendar_events_${currentUser.id}`, JSON.stringify(calendarEvents));
    localStorage.setItem(`crm_emails_${currentUser.id}`, JSON.stringify(emails));
    localStorage.setItem(`crm_sync_state_${currentUser.id}`, JSON.stringify(syncState));
  }, [currentUser, googleConfig, calendarEvents, emails, syncState]);
  
  const connectGoogleCalendar = async () => {
    // En una implementación real, esto redirigiría al flujo OAuth de Google
    // Para fines de demostración, simularemos una conexión exitosa con datos de ejemplo
    try {
      // Simulación de retraso de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockGoogleConfig: GoogleAuthConfig = {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        expiresAt: Date.now() + 3600000, // 1 hora a partir de ahora
        scope: "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly"
      };
      
      setGoogleConfig(mockGoogleConfig);
      setSyncState({
        ...syncState,
        lastCalendarSync: undefined,
        lastEmailSync: undefined
      });
      
      toast({
        title: "Cuenta de Google conectada",
        description: "Tu cuenta de Google ha sido conectada exitosamente (simulación)."
      });
      
      // Sincronizar datos automáticamente después de conectar
      await syncCalendarEvents();
      await syncEmails();
    } catch (error) {
      console.error("Error al conectar con Google:", error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con Google. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    }
  };
  
  const disconnectGoogleCalendar = () => {
    // En una aplicación real, esto revocaría los tokens en Google
    setGoogleConfig(null);
    // Limpiar eventos y correos al desconectar
    setCalendarEvents([]);
    setEmails([]);
    setSyncState({});
    
    toast({
      title: "Cuenta de Google desconectada",
      description: "Tu cuenta de Google ha sido desconectada exitosamente."
    });
  };
  
  const syncCalendarEvents = async () => {
    if (!googleConfig) {
      toast({
        title: "No conectado",
        description: "Conecta tu cuenta de Google primero.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Simulación de retraso de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar eventos de calendario de ejemplo para hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const mockEvents: CalendarEvent[] = [
        {
          id: "event-1",
          title: "Reunión con el equipo",
          description: "Discutir el progreso del proyecto CRM",
          startTime: new Date(today.getTime() + 10 * 3600 * 1000), // 10 AM
          endTime: new Date(today.getTime() + 11 * 3600 * 1000), // 11 AM
          location: "Sala de conferencias",
          attendees: ["juan@example.com", "ana@example.com"]
        },
        {
          id: "event-2",
          title: "Llamada con cliente",
          description: "Presentación de la nueva propuesta",
          startTime: new Date(today.getTime() + 14 * 3600 * 1000), // 2 PM
          endTime: new Date(today.getTime() + 15 * 3600 * 1000), // 3 PM
          attendees: ["cliente@empresa.com"]
        },
        {
          id: "event-3",
          title: "Revisión de tareas",
          startTime: new Date(today.getTime() + 16 * 3600 * 1000), // 4 PM
          endTime: new Date(today.getTime() + 17 * 3600 * 1000) // 5 PM
        }
      ];
      
      setCalendarEvents(mockEvents);
      setSyncState({
        ...syncState,
        lastCalendarSync: new Date()
      });
      
      // Auto-vincular eventos con notas basándose en el título
      notes.forEach(note => {
        mockEvents.forEach(event => {
          if (note.content.toLowerCase().includes(event.title.toLowerCase())) {
            linkNoteToEvent(note.id, event.id);
          }
        });
      });
      
      toast({
        title: "Calendario sincronizado",
        description: `Se han sincronizado ${mockEvents.length} eventos del calendario.`
      });
    } catch (error) {
      console.error("Error al sincronizar eventos del calendario:", error);
      toast({
        title: "Error de sincronización",
        description: "No se pudieron sincronizar los eventos del calendario.",
        variant: "destructive"
      });
    }
  };
  
  const syncEmails = async () => {
    if (!googleConfig) {
      toast({
        title: "No conectado",
        description: "Conecta tu cuenta de Google primero.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Simulación de retraso de API
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generar correos de ejemplo para hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const mockEmails: Email[] = [
        {
          id: "email-1",
          subject: "Re: Reunión con el equipo",
          sender: "juan@example.com",
          recipients: ["tu@empresa.com"],
          content: "Confirmo mi asistencia a la reunión de hoy a las 10 AM. Tengo algunas ideas para mejorar el flujo de trabajo.",
          receivedAt: new Date(today.getTime() + 8.5 * 3600 * 1000) // 8:30 AM
        },
        {
          id: "email-2",
          subject: "Propuesta actualizada para cliente",
          sender: "ana@example.com",
          recipients: ["tu@empresa.com", "jefe@empresa.com"],
          content: "Adjunto la propuesta actualizada para la llamada con el cliente hoy a las 2 PM. Revisé los puntos que discutimos ayer.",
          receivedAt: new Date(today.getTime() + 12 * 3600 * 1000) // 12 PM
        },
        {
          id: "email-3",
          subject: "Recordatorio: Revisión de tareas",
          sender: "sistema@empresa.com",
          recipients: ["tu@empresa.com"],
          content: "Este es un recordatorio automático para la revisión de tareas programada para hoy a las 4 PM.",
          receivedAt: new Date(today.getTime() + 15 * 3600 * 1000) // 3 PM
        }
      ];
      
      setEmails(mockEmails);
      setSyncState({
        ...syncState,
        lastEmailSync: new Date()
      });
      
      // Auto-vincular correos con eventos del calendario basándose en el asunto
      mockEmails.forEach(email => {
        calendarEvents.forEach(event => {
          if (email.subject.toLowerCase().includes(event.title.toLowerCase()) || 
              (event.description && email.content.toLowerCase().includes(event.description.toLowerCase()))) {
            linkEmailToEvent(email.id, event.id);
          }
        });
      });
      
      toast({
        title: "Correos sincronizados",
        description: `Se han sincronizado ${mockEmails.length} correos electrónicos.`
      });
    } catch (error) {
      console.error("Error al sincronizar correos:", error);
      toast({
        title: "Error de sincronización",
        description: "No se pudieron sincronizar los correos electrónicos.",
        variant: "destructive"
      });
    }
  };
  
  const linkNoteToEvent = (noteId: string, eventId: string) => {
    setCalendarEvents(
      calendarEvents.map(event => 
        event.id === eventId ? { ...event, linkedNoteId: noteId } : event
      )
    );
    
    toast({
      title: "Nota vinculada",
      description: "La nota ha sido vinculada al evento del calendario."
    });
  };
  
  const linkEmailToNote = (emailId: string, noteId: string) => {
    setEmails(
      emails.map(email => 
        email.id === emailId ? { ...email, linkedNoteId: noteId } : email
      )
    );
    
    toast({
      title: "Correo vinculado",
      description: "El correo ha sido vinculado a la nota."
    });
  };
  
  const linkEmailToEvent = (emailId: string, eventId: string) => {
    setEmails(
      emails.map(email => 
        email.id === emailId ? { ...email, linkedEventId: eventId } : email
      )
    );
    
    toast({
      title: "Correo vinculado",
      description: "El correo ha sido vinculado al evento del calendario."
    });
  };
  
  const getEventById = (id: string) => {
    return calendarEvents.find(event => event.id === id);
  };
  
  const getEmailById = (id: string) => {
    return emails.find(email => email.id === id);
  };
  
  const getEventsForDate = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return calendarEvents.filter(
      event => event.startTime >= startOfDay && event.startTime <= endOfDay
    );
  };
  
  const getEmailsForDate = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return emails.filter(
      email => email.receivedAt >= startOfDay && email.receivedAt <= endOfDay
    );
  };
  
  // Función de utilidad para encontrar posibles coincidencias para una nota
  const findMatchesForNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return [];
    
    const results: MatchResult[] = [];
    
    // Comprobar coincidencias con eventos del calendario
    calendarEvents.forEach(event => {
      let confidence = 0;
      let matchedOn: MatchResult["matchedOn"] = 'title';
      
      // Coincidencia por título/contenido
      if (event.title.toLowerCase().includes(note.content.toLowerCase()) || 
          note.content.toLowerCase().includes(event.title.toLowerCase())) {
        confidence += 60;
        matchedOn = 'title';
      } else if (event.description && 
                (event.description.toLowerCase().includes(note.content.toLowerCase()) || 
                 note.content.toLowerCase().includes(event.description.toLowerCase()))) {
        confidence += 50;
        matchedOn = 'content';
      }
      
      // Solo añadir si hay una coincidencia razonable
      if (confidence > 40) {
        results.push({
          eventId: event.id,
          confidence,
          matchedOn
        });
      }
    });
    
    return results;
  };
  
  // Función de utilidad para encontrar posibles coincidencias para un correo
  const findMatchesForEmail = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (!email) return [];
    
    const results: MatchResult[] = [];
    
    // Comprobar coincidencias con notas
    notes.forEach(note => {
      let confidence = 0;
      let matchedOn: MatchResult["matchedOn"] = 'content';
      
      // Coincidencia por contenido
      if (note.content.toLowerCase().includes(email.subject.toLowerCase()) || 
          email.content.toLowerCase().includes(note.content.toLowerCase())) {
        confidence += 50;
        matchedOn = 'content';
      }
      
      // Solo añadir si hay una coincidencia razonable
      if (confidence > 40) {
        results.push({
          noteId: note.id,
          confidence,
          matchedOn
        });
      }
    });
    
    // Comprobar coincidencias con eventos del calendario
    calendarEvents.forEach(event => {
      let confidence = 0;
      let matchedOn: MatchResult["matchedOn"] = 'title';
      
      // Coincidencia por título
      if (event.title.toLowerCase().includes(email.subject.toLowerCase()) || 
          email.subject.toLowerCase().includes(event.title.toLowerCase())) {
        confidence += 70;
        matchedOn = 'title';
      }
      // Coincidencia por asistentes
      else if (event.attendees && 
              event.attendees.includes(email.sender)) {
        confidence += 60;
        matchedOn = 'contacts';
      }
      // Coincidencia por contenido
      else if (event.description && 
              event.description.toLowerCase().includes(email.content.toLowerCase())) {
        confidence += 40;
        matchedOn = 'content';
      }
      
      // Solo añadir si hay una coincidencia razonable
      if (confidence > 40) {
        results.push({
          eventId: event.id,
          confidence,
          matchedOn
        });
      }
    });
    
    return results;
  };
  
  const value: IntegrationsContextType = {
    isGoogleConnected: !!googleConfig,
    googleConfig,
    calendarEvents,
    emails,
    syncState,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    syncCalendarEvents,
    syncEmails,
    linkNoteToEvent,
    linkEmailToNote,
    linkEmailToEvent,
    getEventById,
    getEmailById,
    getEventsForDate,
    getEmailsForDate,
    findMatchesForNote,
    findMatchesForEmail
  };

  return <IntegrationsContext.Provider value={value}>{children}</IntegrationsContext.Provider>;
};

export const useIntegrations = () => {
  const context = useContext(IntegrationsContext);
  if (context === undefined) {
    throw new Error("useIntegrations debe usarse dentro de un IntegrationsProvider");
  }
  return context;
};
