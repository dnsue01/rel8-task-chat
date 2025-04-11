
// This file handles Google API authentication using Google Identity Services
// Required for Google Calendar, Tasks, Gmail, and Contacts integration

// Define a global type for the window object to include google identity services
declare global {
  interface Window {
    google: any;
    gapi: any; // Keep for backward compatibility during migration
  }
}

// Define TokenResponse interface
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  error?: string;
}

/**
 * Loads the Google Identity Services library for OAuth
 */
export const loadGoogleIdentityScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Skip if the script is already loaded
    if (window.google?.accounts) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services script"));
    
    document.body.appendChild(script);
  });
};

/**
 * Loads the Google API client library (gapi, still needed for some API calls)
 */
export const loadGapiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Skip if the script is already loaded
    if (window.gapi) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Initialize gapi client
      window.gapi.load('client', resolve);
    };
    script.onerror = () => reject(new Error("Failed to load Google API script"));
    
    document.body.appendChild(script);
  });
};

/**
 * Authenticate with Google and get access token using Google Identity Services
 */
export const loginWithGoogleCalendarAndTasks = async (clientId: string): Promise<string> => {
  try {
    // Load the Google Identity Services library
    await loadGoogleIdentityScript();
    
    // For API calls, we still need to load gapi but not auth2
    await loadGapiScript();

    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error("Google Identity Services not loaded"));
        return;
      }

      // Define scopes needed for our application
      const scope = [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/contacts.readonly",
        "email",
        "profile",
        "openid"
      ].join(" ");

      // Initialize token client
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scope,
        callback: (response: TokenResponse) => {
          if (response.error) {
            console.error("Error during Google authentication:", response.error);
            localStorage.setItem('google_auth_error', `Error de autenticación: ${response.error}`);
            reject(new Error(`Authentication error: ${response.error}`));
            return;
          }
          
          if (response.access_token) {
            // Store auth data in localStorage for persistence
            localStorage.setItem('google_auth_token', response.access_token);
            localStorage.setItem('google_auth_expiry', (Date.now() + response.expires_in * 1000).toString());
            resolve(response.access_token);
          } else {
            reject(new Error("No access token received"));
          }
        },
        error_callback: (error: any) => {
          console.error("Error during Google authentication:", error);
          localStorage.setItem('google_auth_error', 'Error durante la autenticación de Google');
          reject(error);
        }
      });

      // Request the access token
      client.requestAccessToken();
    });
  } catch (error) {
    console.error("Error in loginWithGoogleCalendarAndTasks:", error);
    localStorage.setItem('google_auth_error', 'Error al cargar la biblioteca de Google Identity Services');
    throw error;
  }
};

/**
 * Initialize Google One Tap for authentication
 */
export const initGoogleOneTap = async (clientId: string, callback: (response: any) => void): Promise<void> => {
  await loadGoogleIdentityScript();

  if (!window.google?.accounts) {
    throw new Error("Google Identity Services not loaded");
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  window.google.accounts.id.prompt();
};

/**
 * Render a Google Sign In button in the provided element
 */
export const renderGoogleSignInButton = async (
  elementId: string,
  callback: (response: any) => void
): Promise<void> => {
  await loadGoogleIdentityScript();

  if (!window.google?.accounts) {
    throw new Error("Google Identity Services not loaded");
  }

  window.google.accounts.id.initialize({
    client_id: "179854550183-6bf7ghpsunb8noibvshi2vsna54dle91.apps.googleusercontent.com",
    callback,
  });

  window.google.accounts.id.renderButton(
    document.getElementById(elementId) as HTMLElement,
    { 
      theme: "outline", 
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "center",
      width: 280
    }
  );
};

/**
 * Check if the user is currently authenticated with Google
 */
export const isGoogleAuthenticated = (): boolean => {
  const token = localStorage.getItem('google_auth_token');
  const expiry = localStorage.getItem('google_auth_expiry');
  
  if (!token || !expiry) return false;
  
  // Check if token is expired
  if (Date.now() > parseInt(expiry, 10)) {
    localStorage.removeItem('google_auth_token');
    localStorage.removeItem('google_auth_expiry');
    return false;
  }
  
  return true;
};

/**
 * Sign out from Google
 */
export const logoutFromGoogle = async (): Promise<void> => {
  try {
    // For GIS, we don't need to call a signOut method,
    // we just need to remove the token
    if (window.google?.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  } catch (error) {
    console.error("Error during Google sign out:", error);
  } finally {
    // Always clean up local storage
    localStorage.removeItem('google_auth_token');
    localStorage.removeItem('google_auth_expiry');
    localStorage.removeItem('google_auth_error');
    
    // Also remove any cached data
    localStorage.removeItem('google_calendar_events');
    localStorage.removeItem('google_emails');
    localStorage.removeItem('google_tasks');
    localStorage.removeItem('google_task_lists');
    localStorage.removeItem('google_contacts');
    localStorage.removeItem('google_connected');
  }
};

/**
 * Get the current access token if available
 */
export const getGoogleAccessToken = (): string | null => {
  if (!isGoogleAuthenticated()) return null;
  return localStorage.getItem('google_auth_token');
};
