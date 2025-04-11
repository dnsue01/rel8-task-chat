
import React, { createContext, useContext, useState, useEffect } from "react";
import { CalendarEvent, Email, GoogleAuthConfig, IntegrationSyncState, MatchResult, Task, TaskList, Contact } from "../types/integrations";
import { useCrm } from "./CrmContext";
import { googleClient } from "../integrations/google/googleClient";
import { parseISO } from "date-fns";
import { fetchCalendarEvents, fetchContacts, fetchEmails, fetchTaskLists, fetchTasks } from "../integrations/google/googleApi";

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
  
  const { notes } = useCrm();
  
  // Load integration data from localStorage when the app starts
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
  
  // Check Google connection status
  useEffect(() => {
    const isConnected = googleClient.isConnected();
    setIsGoogleConnected(isConnected);
  }, [googleConfig]);
  
  // Connect to Google Calendar
  const connectGoogleCalendar = async (): Promise<void> => {
    try {
      const result = await googleClient.initiateGoogleAuth();
      if (result.success && result.data) {
        // Real auth config from Google
        const newConfig = {
          accessToken: result.data.accessToken,
          refreshToken: 'not_implemented',
          expiresAt: Date.now() + 3600 * 1000,
          scope: 'calendar tasks email contacts',
        };
        
        setGoogleConfig(newConfig);
        localStorage.setItem('google_auth_config', JSON.stringify(newConfig));
        
        // Also store a flag to indicate connection status
        localStorage.setItem('google_connected', 'true');
        setIsGoogleConnected(true);
        
        // After connecting, sync data
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
  
  // Disconnect from Google
  const disconnectGoogleCalendar = async (): Promise<void> => {
    try {
      await googleClient.disconnectGoogle();
      
      // Clear saved data
      localStorage.removeItem('google_auth_config');
      localStorage.removeItem('google_auth_token');
      localStorage.removeItem('google_calendar_events');
      localStorage.removeItem('google_emails');
      localStorage.removeItem('google_tasks');
      localStorage.removeItem('google_task_lists');
      localStorage.removeItem('google_connected');
      localStorage.removeItem('google_auth_expiry');
      localStorage.removeItem('google_contacts');
      
      // Reset state
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
  
  // Sync calendar events
  const syncCalendarEvents = async (): Promise<void> => {
    try {
      const events = await fetchCalendarEvents();
      
      // Set the events
      setCalendarEvents(events);
      
      // Save to localStorage
      localStorage.setItem('google_calendar_events', JSON.stringify(events));
      
      // Update sync state
      const newSyncState = { ...syncState, lastCalendarSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing calendar events:', error);
      throw error;
    }
  };

  // Sync contacts
  const syncContacts = async (): Promise<void> => {
    try {
      const googleContacts = await fetchContacts();
      
      // Set the contacts
      setContacts(googleContacts);
      
      // Save to localStorage
      localStorage.setItem('google_contacts', JSON.stringify(googleContacts));
      
      // Update sync state
      const newSyncState = { ...syncState, lastContactsSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing contacts:', error);
      throw error;
    }
  };

  // Sync tasks
  const syncTasks = async (): Promise<void> => {
    try {
      // First fetch task lists
      const taskListsResult = await fetchTaskLists();
      
      // Save task lists
      setTaskLists(taskListsResult);
      localStorage.setItem('google_task_lists', JSON.stringify(taskListsResult));
      
      // Now fetch tasks for each list
      const allTasks: Task[] = [];
      
      for (const list of taskListsResult) {
        try {
          const listTasks = await fetchTasks(list.id);
          allTasks.push(...listTasks);
        } catch (err) {
          console.error(`Error fetching tasks for list ${list.id}:`, err);
          // Continue with other lists even if one fails
        }
      }
      
      // Save all tasks
      setTasks(allTasks);
      localStorage.setItem('google_tasks', JSON.stringify(allTasks));
      
      // Update sync state
      const newSyncState = { ...syncState, lastTasksSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing tasks:', error);
      throw error;
    }
  };
  
  // Sync emails
  const syncEmails = async (): Promise<void> => {
    try {
      const emailList = await fetchEmails();
      
      // Set the emails
      setEmails(emailList);
      
      // Save to localStorage
      localStorage.setItem('google_emails', JSON.stringify(emailList));
      
      // Update sync state
      const newSyncState = { ...syncState, lastEmailSync: new Date() };
      setSyncState(newSyncState);
      localStorage.setItem('integration_sync_state', JSON.stringify(newSyncState));
    } catch (error) {
      console.error('Error syncing emails:', error);
      throw error;
    }
  };
  
  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Get emails for a specific date
  const getEmailsForDate = (date: Date): Email[] => {
    return emails.filter(email => {
      const emailDate = new Date(email.receivedAt);
      return emailDate.getDate() === date.getDate() &&
             emailDate.getMonth() === date.getMonth() &&
             emailDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Link a note to an event
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
  
  // Link a note to a task
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
  
  // Link an email to a note
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
  
  // Find potential matches between notes and events/emails
  const findMatchesForNote = (noteId: string): MatchResult[] => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return [];
    
    const matches: MatchResult[] = [];
    
    // Look for matches in events
    calendarEvents.forEach(event => {
      let confidence = 0;
      
      // Simple matching logic (in a real app, this would be more sophisticated)
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
    
    // Look for matches in tasks
    tasks.forEach(task => {
      let confidence = 0;
      
      // Simple matching logic
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
    
    // Sort by confidence
    return matches.sort((a, b) => b.confidence - a.confidence);
  };
  
  // Find potential matches for an email
  const findMatchesForEmail = (emailId: string): MatchResult[] => {
    const email = emails.find(e => e.id === emailId);
    if (!email) return [];
    
    const matches: MatchResult[] = [];
    
    // Look for matches in notes
    notes.forEach(note => {
      let confidence = 0;
      
      // Simple matching logic
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
    
    // Look for matches in events
    calendarEvents.forEach(event => {
      let confidence = 0;
      
      // Simple matching logic
      if (event.title && event.title.includes(email.subject)) {
        confidence += 30;
      }
      
      // Check if email was received close to event time
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
    
    // Sort by confidence
    return matches.sort((a, b) => b.confidence - a.confidence);
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
    }}>
      {children}
    </IntegrationsContext.Provider>
  );
};

export const useIntegrations = () => useContext(IntegrationsContext);
