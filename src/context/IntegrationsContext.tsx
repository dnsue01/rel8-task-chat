import React, { createContext, useContext, useState, useEffect } from "react";
import { CalendarEvent, Email, GoogleAuthConfig, IntegrationSyncState, MatchResult, Task, TaskList, Contact } from "../types/integrations";
import { useCrm } from "./CrmContext";
import { googleClient } from "../integrations/google/googleClient";
import { parseISO } from "date-fns";
import { fetchCalendarEvents, fetchContacts, fetchEmails, fetchTaskLists, fetchTasks, fetchClassifiedCalendarEvents } from "../integrations/google/googleApi";

interface IntegrationsContextType {
  // Google
  isGoogleConnected: boolean;
  connectGoogleCalendar: () => Promise<void>;
  disconnectGoogleCalendar: () => Promise<void>;
  
  // Calendar
  calendarEvents: CalendarEvent[];
  syncCalendarEvents: () => Promise<void>;
  getEventsForDate: (date: Date) => CalendarEvent[];
  linkNoteToEvent: (noteId: string, eventId: string) => void;
  
  // Contacts
  contacts: Contact[];
  syncContacts: () => Promise<void>;
  
  // Tasks
  tasks: Task[];
  taskLists: TaskList[];
  syncTasks: () => Promise<void>;
  linkNoteToTask: (noteId: string, taskId: string) => void;
  
  // Email
  emails: Email[];
  syncEmails: () => Promise<void>;
  getEmailsForDate: (date: Date) => Email[];
  linkEmailToNote: (noteId: string, emailId: string) => void;
  
  // Matching
  findMatchesForNote: (noteId: string) => MatchResult[];
  findMatchesForEmail: (emailId: string) => MatchResult[];
  
  // Sync state
  syncState: IntegrationSyncState;
  
  // Classified calendar functionality
  classifiedEvents: any[];
  fetchClassifiedEvents: () => Promise<void>;
}

const IntegrationsContext = createContext<IntegrationsContextType>({} as IntegrationsContextType);

export const IntegrationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [googleConfig, setGoogleConfig] = useState<GoogleAuthConfig | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [syncState, setSyncState] = useState<IntegrationSyncState>({});
  const [classifiedEvents, setClassifiedEvents] = useState<any[]>([]);
  
  const { notes } = useCrm();
  
  useEffect(() => {
    const savedGoogleConfig = localStorage.getItem('google_auth_config');
    const savedCalendarEvents = localStorage.getItem('google_calendar_events');
    const savedContacts = localStorage.getItem('google_contacts');
    const savedEmails = localStorage.getItem('google_emails');
    const savedTasks = localStorage.getItem('google_tasks');
    const savedTaskLists = localStorage.getItem('google_task_lists');
    const savedSyncState = localStorage.getItem('integration_sync_state');
    
    if (savedGoogleConfig) setGoogleConfig(JSON.parse(savedGoogleConfig));
    if (savedCalendarEvents) {
      const parsedEvents = JSON.parse(savedCalendarEvents) as CalendarEvent[];
      setCalendarEvents(parsedEvents.map(event => ({
        ...event,
        startTime: parseISO(event.startTime as unknown as string),
        endTime: parseISO(event.endTime as unknown as string),
      })));
    }
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
    if (savedEmails) {
      const parsedEmails = JSON.parse(savedEmails) as Email[];
      setEmails(parsedEmails.map(email => ({
        ...email,
        receivedAt: parseISO(email.receivedAt as unknown as string),
      })));
    }
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks) as Task[];
      setTasks(parsedTasks.map(task => ({
        ...task,
        due: task.due ? parseISO(task.due as unknown as string) : undefined,
      })));
    }
    if (savedTaskLists) {
      setTaskLists(JSON.parse(savedTaskLists));
    }
    if (savedSyncState) {
      const parsedSyncState = JSON.parse(savedSyncState);
      setSyncState({
        ...parsedSyncState,
        lastCalendarSync: parsedSyncState.lastCalendarSync ? new Date(parsedSyncState.lastCalendarSync) : undefined,
        lastEmailSync: parsedSyncState.lastEmailSync ? new Date(parsedSyncState.lastEmailSync) : undefined,
        lastTasksSync: parsedSyncState.lastTasksSync ? new Date(parsedSyncState.lastTasksSync) : undefined,
        lastContactsSync: parsedSyncState.lastContactsSync ? new Date(parsedSyncState.lastContactsSync) : undefined,
      });
    }
  }, []);
  
  useEffect(() => {
    const isConnected = googleClient.isConnected();
    setIsGoogleConnected(isConnected);
  }, [googleConfig]);
  
  const connectGoogleCalendar = async (): Promise<void> => {
    try {
      const result = await googleClient.initiateGoogleAuth();
      if (result.success && result.data) {
        const newConfig = {
          accessToken: result.data.accessToken,
          refreshToken: 'not_implemented',
          expiresAt: Date.now() + 3600 * 1000,
          scope: 'calendar tasks email contacts',
        };
        
        setGoogleConfig(newConfig);
        localStorage.setItem('google_auth_config', JSON.stringify(newConfig));
        
        localStorage.setItem('google_connected', 'true');
        setIsGoogleConnected(true);
        
        await Promise.all([
          syncCalendarEvents(),
          syncEmails(),
          syncTasks(),
          syncContacts()
        ]);
      }
    } catch (error) {
      console.error('Error connecting to Google:', error);
      throw error;
    }
  };
  
  const disconnectGoogleCalendar = async (): Promise<void> => {
    try {
      await googleClient.disconnectGoogle();
      
      localStorage.removeItem('google_auth_config');
      localStorage.removeItem('google_auth_token');
      localStorage.removeItem('google_calendar_events');
      localStorage.removeItem('google_emails');
      localStorage.removeItem('google_tasks');
      localStorage.removeItem('google_task_lists');
      localStorage.removeItem('google_connected');
      localStorage.removeItem('google_auth_expiry');
      localStorage.removeItem('google_contacts');
      
      setGoogleConfig(null);
      setCalendarEvents([]);
      setEmails([]);
      setTasks([]);
      setTaskLists([]);
      setContacts([]);
      setIsGoogleConnected(false);
    } catch (error) {
      console.error('Error disconnecting from Google:', error);
      throw error;
    }
  };
  
  const syncCalendarEvents = async (): Promise<void> => {
    try {
      const events = await fetchCalendarEvents();
      
      setCalendarEvents(events);
      localStorage.setItem('google_calendar_events', JSON.stringify(events));
      
      const newSyncState = { ...syncState, lastCalendarSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing calendar events:', error);
      throw error;
    }
  };

  const syncContacts = async (): Promise<void> => {
    try {
      const googleContacts = await fetchContacts();
      
      setContacts(googleContacts);
      localStorage.setItem('google_contacts', JSON.stringify(googleContacts));
      
      const newSyncState = { ...syncState, lastContactsSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing contacts:', error);
      throw error;
    }
  };

  const syncTasks = async (): Promise<void> => {
    try {
      const taskListsResult = await fetchTaskLists();
      
      setTaskLists(taskListsResult);
      localStorage.setItem('google_task_lists', JSON.stringify(taskListsResult));
      
      const allTasks: Task[] = [];
      
      for (const list of taskListsResult) {
        try {
          const listTasks = await fetchTasks(list.id);
          allTasks.push(...listTasks);
        } catch (err) {
          console.error(`Error fetching tasks for list ${list.id}:`, err);
        }
      }
      
      setTasks(allTasks);
      localStorage.setItem('google_tasks', JSON.stringify(allTasks));
      
      const newSyncState = { ...syncState, lastTasksSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing tasks:', error);
      throw error;
    }
  };
  
  const syncEmails = async (): Promise<void> => {
    try {
      const emailList = await fetchEmails();
      
      setEmails(emailList);
      localStorage.setItem('google_emails', JSON.stringify(emailList));
      
      const newSyncState = { ...syncState, lastEmailSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing emails:', error);
      throw error;
    }
  };
  
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };
  
  const getEmailsForDate = (date: Date): Email[] => {
    return emails.filter(email => {
      const emailDate = new Date(email.receivedAt);
      return emailDate.getDate() === date.getDate() &&
             emailDate.getMonth() === date.getMonth() &&
             emailDate.getFullYear() === date.getFullYear();
    });
  };
  
  const linkNoteToEvent = (noteId: string, eventId: string): void => {
    const updatedEvents = calendarEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, linkedNoteId: noteId };
      }
      return event;
    });
    
    setCalendarEvents(updatedEvents);
    localStorage.setItem('google_calendar_events', JSON.stringify(updatedEvents));
  };
  
  const linkNoteToTask = (noteId: string, taskId: string): void => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, linkedNoteId: noteId };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('google_tasks', JSON.stringify(updatedTasks));
  };
  
  const linkEmailToNote = (noteId: string, emailId: string): void => {
    const updatedEmails = emails.map(email => {
      if (email.id === emailId) {
        return { ...email, linkedNoteId: noteId };
      }
      return email;
    });
    
    setEmails(updatedEmails);
    localStorage.setItem('google_emails', JSON.stringify(updatedEmails));
  };
  
  const findMatchesForNote = (noteId: string): MatchResult[] => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return [];
    
    const matches: MatchResult[] = [];
    
    calendarEvents.forEach(event => {
      let confidence = 0;
      
      if (event.title && note.content.includes(event.title)) {
        confidence += 40;
      }
      if (event.description && note.content.includes(event.description)) {
        confidence += 30;
      }
      
      if (confidence > 20) {
        matches.push({
          eventId: event.id,
          confidence,
          matchedOn: 'content',
        });
      }
    });
    
    tasks.forEach(task => {
      let confidence = 0;
      
      if (task.title && note.content.includes(task.title)) {
        confidence += 40;
      }
      if (task.notes && note.content.includes(task.notes)) {
        confidence += 30;
      }
      
      if (confidence > 20) {
        matches.push({
          taskId: task.id,
          confidence,
          matchedOn: 'content',
        });
      }
    });
    
    return matches.sort((a, b) => b.confidence - a.confidence);
  };
  
  const findMatchesForEmail = (emailId: string): MatchResult[] => {
    const email = emails.find(e => e.id === emailId);
    if (!email) return [];
    
    const matches: MatchResult[] = [];
    
    notes.forEach(note => {
      let confidence = 0;
      
      if (note.content.includes(email.subject)) {
        confidence += 40;
      }
      
      if (confidence > 20) {
        matches.push({
          noteId: note.id,
          confidence,
          matchedOn: 'content',
        });
      }
    });
    
    calendarEvents.forEach(event => {
      let confidence = 0;
      
      if (event.title && event.title.includes(email.subject)) {
        confidence += 30;
      }
      
      const emailTime = new Date(email.receivedAt).getTime();
      const eventTime = new Date(event.startTime).getTime();
      const timeDiff = Math.abs(emailTime - eventTime);
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        confidence += 20;
      }
      
      if (confidence > 20) {
        matches.push({
          eventId: event.id,
          confidence,
          matchedOn: 'title',
        });
      }
    });
    
    return matches.sort((a, b) => b.confidence - a.confidence);
  };
  
  const fetchClassifiedEvents = async (): Promise<void> => {
    try {
      const events = await fetchClassifiedCalendarEvents(contacts);
      
      setClassifiedEvents(events);
      
      localStorage.setItem('google_classified_events', JSON.stringify(events));
      
      const newSyncState = { ...syncState, lastCalendarSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing classified calendar events:', error);
      throw error;
    }
  };
  
  return (
    <IntegrationsContext.Provider value={{
      isGoogleConnected,
      connectGoogleCalendar,
      disconnectGoogleCalendar,
      calendarEvents,
      syncCalendarEvents,
      getEventsForDate,
      linkNoteToEvent,
      contacts,
      syncContacts,
      tasks,
      taskLists,
      syncTasks,
      linkNoteToTask,
      emails,
      syncEmails,
      getEmailsForDate,
      linkEmailToNote,
      findMatchesForNote,
      findMatchesForEmail,
      syncState,
      classifiedEvents,
      fetchClassifiedEvents,
    }}>
      {children}
    </IntegrationsContext.Provider>
  );
};

export const useIntegrations = () => useContext(IntegrationsContext);
