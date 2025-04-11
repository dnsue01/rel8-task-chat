
import { supabase } from "../supabase/client";
import { getGoogleAccessToken } from "./googleAuth";
import { CalendarEvent, Email, Task, TaskList } from "@/types/integrations";
import { parseISO } from "date-fns";

/**
 * Function to fetch calendar events from Google Calendar API
 * @returns Promise with calendar events
 */
export const fetchCalendarEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const accessToken = getGoogleAccessToken();
    if (!accessToken) {
      throw new Error("No Google access token available");
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: accessToken,
        endpoint: "calendar",
      },
    });

    if (response.error) {
      console.error("Error fetching calendar events:", response.error);
      throw new Error(`Error fetching calendar events: ${response.error.message}`);
    }

    // Transform Google Calendar API response to our CalendarEvent format
    if (response.data && response.data.items) {
      const events: CalendarEvent[] = response.data.items
        .filter((item: any) => item.status !== 'cancelled')
        .map((item: any) => ({
          id: item.id,
          title: item.summary || 'No title',
          description: item.description || '',
          startTime: item.start?.dateTime ? new Date(item.start.dateTime) : new Date(item.start.date),
          endTime: item.end?.dateTime ? new Date(item.end.dateTime) : new Date(item.end.date),
          location: item.location || '',
          attendees: item.attendees ? item.attendees.map((a: any) => a.email) : [],
        }));
      return events;
    }
    
    return [];
  } catch (error) {
    console.error("Error in fetchCalendarEvents:", error);
    throw error;
  }
};

/**
 * Function to fetch task lists from Google Tasks API
 * @returns Promise with task lists
 */
export const fetchTaskLists = async (): Promise<TaskList[]> => {
  try {
    const accessToken = getGoogleAccessToken();
    if (!accessToken) {
      throw new Error("No Google access token available");
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: accessToken,
        endpoint: "tasks/lists",
      },
    });

    if (response.error) {
      console.error("Error fetching task lists:", response.error);
      throw new Error(`Error fetching task lists: ${response.error.message}`);
    }

    // Transform Google Tasks API response to our TaskList format
    if (response.data && response.data.items) {
      const taskLists: TaskList[] = response.data.items.map((item: any) => ({
        id: item.id,
        title: item.title || 'Unnamed List',
      }));
      return taskLists;
    }
    
    return [];
  } catch (error) {
    console.error("Error in fetchTaskLists:", error);
    throw error;
  }
};

/**
 * Function to fetch tasks from a specific task list
 * @param listId The ID of the task list
 * @returns Promise with tasks
 */
export const fetchTasks = async (listId: string): Promise<Task[]> => {
  try {
    const accessToken = getGoogleAccessToken();
    if (!accessToken) {
      throw new Error("No Google access token available");
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: accessToken,
        endpoint: "tasks",
        task_list_id: listId,
      },
    });

    if (response.error) {
      console.error("Error fetching tasks:", response.error);
      throw new Error(`Error fetching tasks: ${response.error.message}`);
    }

    // Transform Google Tasks API response to our Task format
    if (response.data && response.data.items) {
      const tasks: Task[] = response.data.items.map((item: any) => ({
        id: item.id,
        title: item.title || 'Unnamed Task',
        notes: item.notes || '',
        due: item.due ? new Date(item.due) : undefined,
        status: item.status || 'needsAction',
        completed: item.status === 'completed',
      }));
      return tasks;
    }
    
    return [];
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    throw error;
  }
};

/**
 * Function to fetch emails from Gmail API
 * @returns Promise with emails
 */
export const fetchEmails = async (): Promise<Email[]> => {
  try {
    const accessToken = getGoogleAccessToken();
    if (!accessToken) {
      throw new Error("No Google access token available");
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: accessToken,
        endpoint: "gmail",
      },
    });

    if (response.error) {
      console.error("Error fetching emails:", response.error);
      throw new Error(`Error fetching emails: ${response.error.message}`);
    }

    // We need to fetch details for each message to get the full email content
    const emails: Email[] = [];
    
    if (response.data && response.data.messages) {
      // For each message ID, fetch the full message details
      for (const message of response.data.messages) {
        try {
          const detailsResponse = await supabase.functions.invoke("google-oauth", {
            body: {
              access_token: accessToken,
              endpoint: "gmail/message",
              message_id: message.id,
            },
          });
          
          if (!detailsResponse.error && detailsResponse.data) {
            const email = parseGmailMessage(detailsResponse.data);
            if (email) {
              emails.push(email);
            }
          }
        } catch (error) {
          console.error(`Error fetching details for email ${message.id}:`, error);
          // Continue with other messages even if one fails
        }
      }
    }
    
    return emails;
  } catch (error) {
    console.error("Error in fetchEmails:", error);
    throw error;
  }
};

/**
 * Function to fetch a specific email by ID
 * @param messageId The Gmail message ID
 * @returns Promise with email details
 */
export const fetchEmailDetails = async (messageId: string): Promise<Email | null> => {
  try {
    const accessToken = getGoogleAccessToken();
    if (!accessToken) {
      throw new Error("No Google access token available");
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: accessToken,
        endpoint: "gmail/message",
        message_id: messageId,
      },
    });

    if (response.error) {
      console.error("Error fetching email details:", response.error);
      throw new Error(`Error fetching email details: ${response.error.message}`);
    }

    return parseGmailMessage(response.data);
  } catch (error) {
    console.error("Error in fetchEmailDetails:", error);
    throw error;
  }
};

/**
 * Helper function to parse Gmail message into our Email format
 */
const parseGmailMessage = (message: any): Email | null => {
  try {
    if (!message || !message.payload) {
      return null;
    }

    const headers = message.payload.headers || [];
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
    const sender = headers.find((h: any) => h.name === 'From')?.value || '';
    const to = headers.find((h: any) => h.name === 'To')?.value || '';
    
    // Extract recipients from To field
    const recipients = to.split(',').map((email: string) => email.trim());
    
    // Parse internal date (timestamp) to Date
    const internalDate = message.internalDate ? parseInt(message.internalDate, 10) : Date.now();
    const receivedAt = new Date(internalDate);
    
    // Extract content from the message body
    let content = '';
    
    // Try to get plain text part first
    const extractTextFromParts = (parts: any[]): string => {
      let text = '';
      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          text += Buffer.from(part.body.data, 'base64').toString('utf8');
        } else if (part.parts) {
          text += extractTextFromParts(part.parts);
        }
      }
      return text;
    };
    
    if (message.payload.body?.data) {
      // Message body is directly in the payload
      content = Buffer.from(message.payload.body.data, 'base64').toString('utf8');
    } else if (message.payload.parts) {
      // Message body is in parts
      content = extractTextFromParts(message.payload.parts);
    }
    
    return {
      id: message.id,
      subject,
      sender,
      recipients,
      content,
      receivedAt,
    };
  } catch (error) {
    console.error('Error parsing Gmail message:', error);
    return null;
  }
};

/**
 * Function to set the access token and expiration
 * @param token The access token
 * @param expiresIn Time until token expiration in seconds
 */
export const setAccessToken = (token: string, expiresIn: number) => {
  // This implementation is not needed anymore as we're using the token from localStorage directly
};

/**
 * Function to clear the token cache
 */
export const clearTokenCache = () => {
  // This implementation is not needed anymore as we're using the token from localStorage directly
};

/**
 * Function to refresh the access token
 * @returns Promise<string | null> with new access token or null if failed
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  // We don't have implementation for token refresh yet
  // In a real app, you would use the refresh token to get a new access token
  return null;
};
