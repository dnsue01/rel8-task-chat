
import { supabase } from "../supabase/client";

// Cache the tokens in memory for the session
let tokenCache: {
  access_token?: string;
  expires_at?: number;
} = {};

/**
 * Function to check if the current token is valid
 * @returns boolean indicating if the token is valid
 */
export const hasValidToken = (): boolean => {
  return !!tokenCache.access_token && !!tokenCache.expires_at && tokenCache.expires_at > Date.now();
};

/**
 * Function to fetch calendar events from Google Calendar API
 * @returns Promise<any> with calendar events
 */
export const fetchCalendarEvents = async (): Promise<any> => {
  try {
    if (!hasValidToken()) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error("Failed to refresh token");
      }
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: tokenCache.access_token,
        endpoint: "calendar",
      },
    });

    if (response.error) {
      throw new Error(`Error fetching calendar events: ${response.error.message}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error in fetchCalendarEvents:", error);
    throw error;
  }
};

/**
 * Function to fetch task lists from Google Tasks API
 * @returns Promise<any> with task lists
 */
export const fetchTaskLists = async (): Promise<any> => {
  try {
    if (!hasValidToken()) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error("Failed to refresh token");
      }
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: tokenCache.access_token,
        endpoint: "tasks/lists",
      },
    });

    if (response.error) {
      throw new Error(`Error fetching task lists: ${response.error.message}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error in fetchTaskLists:", error);
    throw error;
  }
};

/**
 * Function to fetch tasks from a specific task list
 * @param listId The ID of the task list
 * @returns Promise<any> with tasks
 */
export const fetchTasks = async (listId: string): Promise<any> => {
  try {
    if (!hasValidToken()) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error("Failed to refresh token");
      }
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: tokenCache.access_token,
        endpoint: "tasks",
        task_list_id: listId,
      },
    });

    if (response.error) {
      throw new Error(`Error fetching tasks: ${response.error.message}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    throw error;
  }
};

/**
 * Function to fetch emails from Gmail API
 * @returns Promise<any> with emails
 */
export const fetchEmails = async (): Promise<any> => {
  try {
    if (!hasValidToken()) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error("Failed to refresh token");
      }
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: tokenCache.access_token,
        endpoint: "gmail",
      },
    });

    if (response.error) {
      throw new Error(`Error fetching emails: ${response.error.message}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error in fetchEmails:", error);
    throw error;
  }
};

/**
 * Function to fetch a specific email by ID
 * @param messageId The Gmail message ID
 * @returns Promise<any> with email details
 */
export const fetchEmailDetails = async (messageId: string): Promise<any> => {
  try {
    if (!hasValidToken()) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error("Failed to refresh token");
      }
    }

    const response = await supabase.functions.invoke("google-oauth", {
      body: {
        access_token: tokenCache.access_token,
        endpoint: "gmail/message",
        message_id: messageId,
      },
    });

    if (response.error) {
      throw new Error(`Error fetching email details: ${response.error.message}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error in fetchEmailDetails:", error);
    throw error;
  }
};

/**
 * Function to set the access token and expiration
 * @param token The access token
 * @param expiresIn Time until token expiration in seconds
 */
export const setAccessToken = (token: string, expiresIn: number) => {
  tokenCache = {
    access_token: token,
    expires_at: Date.now() + expiresIn * 1000,
  };
};

/**
 * Function to clear the token cache
 */
export const clearTokenCache = () => {
  tokenCache = {};
};

/**
 * Function to refresh the access token
 * @returns Promise<string | null> with new access token or null if failed
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  // This is a placeholder. In a real app, you would use the refresh token to get a new access token
  // For this demo, we'll assume that if we need to refresh, the user needs to re-authenticate
  clearTokenCache();
  return null;
};
