
// This file handles Google API authentication
// Required for Google Calendar and Tasks integration

// Define a global type for the window object to include gapi
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

/**
 * Loads the Google API client library
 */
export const loadGoogleApiScript = (): Promise<void> => {
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
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google API script"));
    
    document.body.appendChild(script);
  });
};

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
 * Authenticate with Google and get access token for Calendar and Tasks
 */
export const loginWithGoogleCalendarAndTasks = async (clientId: string): Promise<string> => {
  try {
    // Load the API client library if not already loaded
    await loadGoogleApiScript();

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

    return new Promise((resolve, reject) => {
      window.gapi.load("client:auth2", async () => {
        try {
          await window.gapi.client.init({
            clientId,
            scope,
          });

          const authInstance = window.gapi.auth2.getAuthInstance();
          
          if (authInstance.isSignedIn.get()) {
            // User is already signed in
            const currentUser = authInstance.currentUser.get();
            const authResponse = currentUser.getAuthResponse();
            
            // Store auth data in localStorage for persistence
            localStorage.setItem('google_auth_token', authResponse.access_token);
            localStorage.setItem('google_auth_expiry', (Date.now() + authResponse.expires_in * 1000).toString());
            
            resolve(authResponse.access_token);
          } else {
            // User needs to sign in
            try {
              const user = await authInstance.signIn({
                scope,
                prompt: 'consent'  // Force re-consent to ensure we get all permissions
              });
              const authResponse = user.getAuthResponse();
              
              // Store auth data in localStorage for persistence
              localStorage.setItem('google_auth_token', authResponse.access_token);
              localStorage.setItem('google_auth_expiry', (Date.now() + authResponse.expires_in * 1000).toString());
              
              resolve(authResponse.access_token);
            } catch (error) {
              console.error("Error during Google signIn:", error);
              // User closed the popup or denied access
              localStorage.setItem('google_auth_error', 'El usuario canceló la autenticación o denegó el acceso');
              reject(new Error('El usuario canceló la autenticación o denegó el acceso'));
            }
          }
        } catch (error) {
          console.error("Error initializing Google client:", error);
          localStorage.setItem('google_auth_error', 'Error al inicializar el cliente de Google');
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error in loginWithGoogleCalendarAndTasks:", error);
    localStorage.setItem('google_auth_error', 'Error al cargar la biblioteca de Google API');
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
  clientId: string, 
  elementId: string,
  callback: (response: any) => void
): Promise<void> => {
  await loadGoogleIdentityScript();

  if (!window.google?.accounts) {
    throw new Error("Google Identity Services not loaded");
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
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
    if (window.gapi?.auth2) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) await authInstance.signOut();
    }
    
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
