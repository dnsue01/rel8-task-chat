
import { CalendarEvent, Email } from "../../types/integrations";
import { getGoogleAccessToken } from "./googleAuth";
import { parseISO, format } from "date-fns";

/**
 * Fetch events from Google Calendar
 */
export const fetchGoogleCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const accessToken = getGoogleAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated with Google");
  }
  
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&timeMin=" + 
      new Date().toISOString(),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Google Calendar events to our app's format
    return data.items.map((event: any) => ({
      id: event.id,
      title: event.summary,
      description: event.description || "",
      startTime: new Date(event.start.dateTime || event.start.date),
      endTime: new Date(event.end.dateTime || event.end.date),
      location: event.location || "",
      attendees: event.attendees?.map((a: any) => a.email) || []
    }));
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    throw error;
  }
};

/**
 * Fetch tasks from Google Tasks
 */
export const fetchGoogleTasks = async (): Promise<any[]> => {
  const accessToken = getGoogleAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated with Google");
  }
  
  try {
    // First get the task lists
    const listsResponse = await fetch(
      "https://www.googleapis.com/tasks/v1/users/@me/lists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!listsResponse.ok) {
      throw new Error(`Failed to fetch task lists: ${listsResponse.statusText}`);
    }
    
    const listsData = await listsResponse.json();
    
    // No task lists found
    if (!listsData.items || listsData.items.length === 0) {
      return [];
    }
    
    // Use the first task list
    const defaultListId = listsData.items[0].id;
    
    // Fetch tasks from the default list
    const tasksResponse = await fetch(
      `https://www.googleapis.com/tasks/v1/lists/${defaultListId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!tasksResponse.ok) {
      throw new Error(`Failed to fetch tasks: ${tasksResponse.statusText}`);
    }
    
    const tasksData = await tasksResponse.json();
    
    return tasksData.items || [];
  } catch (error) {
    console.error("Error fetching Google Tasks:", error);
    throw error;
  }
};

/**
 * Fetch recent emails from Gmail
 * Note: This requires Gmail API scope which is not included in the current auth flow
 */
export const fetchGmailMessages = async (): Promise<Email[]> => {
  const accessToken = getGoogleAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated with Google");
  }
  
  try {
    // This is a placeholder and would need Gmail API scope to work
    console.log("Gmail API is not implemented in this demo");
    return [];
  } catch (error) {
    console.error("Error fetching Gmail messages:", error);
    throw error;
  }
};
