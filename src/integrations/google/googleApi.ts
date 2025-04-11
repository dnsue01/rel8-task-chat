
import { CalendarEvent, Email } from "../../types/integrations";
import { getGoogleAccessToken } from "./googleAuth";

/**
 * Fetch events from Google Calendar using Supabase Edge Function
 */
export const fetchGoogleCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const accessToken = getGoogleAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated with Google");
  }
  
  try {
    // Use Supabase Edge Function to securely call Google Calendar API
    const { data, error } = await window.supabase.functions.invoke('google-oauth', {
      body: { 
        access_token: accessToken,
        endpoint: "calendar" 
      }
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Failed to fetch calendar events: ${error.message}`);
    }
    
    console.log("Calendar data from edge function:", data);
    
    if (!data || !data.items) {
      return [];
    }
    
    // Transform Google Calendar events to our app's format
    return data.items.map((event: any) => ({
      id: event.id,
      title: event.summary || "Sin título",
      description: event.description || "",
      startTime: new Date(event.start?.dateTime || event.start?.date || Date.now()),
      endTime: new Date(event.end?.dateTime || event.end?.date || Date.now()),
      location: event.location || "",
      attendees: event.attendees?.map((a: any) => a.email) || []
    }));
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    // For demo purposes, return mock data if the API call fails
    const today = new Date();
    return [
      {
        id: "mock-event-1",
        title: "Evento de demostración",
        description: "Este es un evento de demostración porque la API falló",
        startTime: new Date(today.setHours(today.getHours() + 1)),
        endTime: new Date(today.setHours(today.getHours() + 2)),
        location: "Ubicación virtual",
        attendees: ["usuario@ejemplo.com"]
      }
    ];
  }
};

/**
 * Fetch emails from Gmail using Supabase Edge Function
 */
export const fetchGmailMessages = async (): Promise<Email[]> => {
  const accessToken = getGoogleAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated with Google");
  }
  
  try {
    // Use Supabase Edge Function to securely call Gmail API
    const { data, error } = await window.supabase.functions.invoke('google-oauth', {
      body: { 
        access_token: accessToken,
        endpoint: "gmail" 
      }
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Failed to fetch emails: ${error.message}`);
    }
    
    console.log("Gmail data from edge function:", data);
    
    if (!data || !data.messages) {
      return [];
    }

    // Process email data
    // Note: This requires an additional call for each message to get details
    // In a real app, you might want to batch these or implement pagination
    const emailPromises = data.messages.slice(0, 5).map(async (message: any) => {
      try {
        const { data: messageData, error: messageError } = await window.supabase.functions.invoke('google-oauth', {
          body: { 
            access_token: accessToken,
            endpoint: "gmail/message",
            message_id: message.id
          }
        });
        
        if (messageError) {
          console.error("Failed to fetch message details:", messageError);
          return null;
        }
        
        // Extract email subject, sender, etc. from headers
        const headers = messageData.payload?.headers || [];
        const subject = headers.find((h: any) => h.name === "Subject")?.value || "Sin asunto";
        const from = headers.find((h: any) => h.name === "From")?.value || "";
        const to = headers.find((h: any) => h.name === "To")?.value?.split(",") || [];
        
        // Extract email body
        let content = "";
        if (messageData.payload?.body?.data) {
          // Base64 encoded content
          content = atob(messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (messageData.payload?.parts) {
          // Multipart message
          const textPart = messageData.payload.parts.find((part: any) => 
            part.mimeType === "text/plain" && part.body?.data
          );
          if (textPart) {
            content = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
        }
        
        return {
          id: message.id,
          subject,
          sender: from,
          recipients: to,
          content: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
          receivedAt: new Date(parseInt(message.internalDate)),
        };
      } catch (err) {
        console.error("Error processing email message:", err);
        return null;
      }
    });

    const emails = await Promise.all(emailPromises);
    return emails.filter(email => email !== null) as Email[];
  } catch (error) {
    console.error("Error fetching Gmail messages:", error);
    // For demo purposes, return mock data if the API call fails
    return [
      {
        id: "mock-email-1",
        subject: "Email de demostración",
        sender: "ejemplo@gmail.com",
        recipients: ["tu@ejemplo.com"],
        content: "Este es un email de demostración porque la API falló",
        receivedAt: new Date(),
      }
    ];
  }
};

/**
 * Fetch tasks from Google Tasks
 * Note: This is kept for reference but not actively used
 */
export const fetchGoogleTasks = async (): Promise<any[]> => {
  const accessToken = getGoogleAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated with Google");
  }
  
  try {
    const { data, error } = await window.supabase.functions.invoke('google-oauth', {
      body: { 
        access_token: accessToken,
        endpoint: "tasks" 
      }
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
    
    return data.items || [];
  } catch (error) {
    console.error("Error fetching Google Tasks:", error);
    return [];
  }
};
