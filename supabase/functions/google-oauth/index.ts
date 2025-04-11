
// supabase/functions/google-oauth/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { access_token, endpoint, message_id, task_list_id, person_id, contact_ids } = body;

    if (!access_token) {
      return new Response(
        JSON.stringify({ error: "Access token is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let url = "";
    
    // Determine which Google API to call based on the endpoint parameter
    switch (endpoint) {
      case "calendar":
        // Get calendar events for the next 30 days
        const today = new Date();
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        url = "https://www.googleapis.com/calendar/v3/calendars/primary/events" + 
              "?maxResults=20" +
              "&timeMin=" + encodeURIComponent(today.toISOString()) + 
              "&timeMax=" + encodeURIComponent(thirtyDaysLater.toISOString()) +
              "&singleEvents=true" +
              "&orderBy=startTime";
        break;
      case "classified_calendar":
        // Get calendar events for the next 30 days (for classification)
        const currentDate = new Date();
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + 30);
        
        url = "https://www.googleapis.com/calendar/v3/calendars/primary/events" + 
              "?maxResults=50" +
              "&timeMin=" + encodeURIComponent(currentDate.toISOString()) + 
              "&timeMax=" + encodeURIComponent(endDate.toISOString()) +
              "&singleEvents=true" +
              "&orderBy=startTime";
        break;
      case "contacts":
        // Get user's contacts
        url = "https://people.googleapis.com/v1/people/me/connections" + 
              "?personFields=names,emailAddresses,phoneNumbers" +
              "&pageSize=50";
        break;
      case "person":
        if (!person_id) {
          return new Response(
            JSON.stringify({ error: "Person ID is required for person endpoint" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        url = `https://people.googleapis.com/v1/${person_id}?personFields=names,emailAddresses,phoneNumbers,organizations,addresses`;
        break;
      case "tasks/lists":
        url = "https://tasks.googleapis.com/tasks/v1/users/@me/lists";
        break;
      case "tasks":
        if (!task_list_id) {
          return new Response(
            JSON.stringify({ error: "Task list ID is required for tasks endpoint" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        url = `https://tasks.googleapis.com/tasks/v1/lists/${task_list_id}/tasks`;
        break;
      case "gmail":
        url = "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10";
        break;
      case "gmail/message":
        if (!message_id) {
          return new Response(
            JSON.stringify({ error: "Message ID is required for gmail/message endpoint" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message_id}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid endpoint specified" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log(`Calling Google API ${endpoint} endpoint: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    // Log some basic info about the response
    console.log(`Google API ${endpoint} response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`Error from Google API: ${JSON.stringify(data)}`);
      return new Response(
        JSON.stringify({ 
          error: "Error fetching data from Google API", 
          details: data,
          url: url // Include the URL for debugging
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // If this is a calendar request with classification, process the events
    if (endpoint === "classified_calendar" && contact_ids) {
      // Function to classify an event based on its title and description
      const classifyEvent = (title = "", description = "") => {
        title = title.toLowerCase();
        description = description ? description.toLowerCase() : "";
        const content = title + " " + description;
        
        // Event keywords
        if (content.match(/reunión|evento|cumpleaños|actividad|celebración|fiesta|conferencia|seminario|taller/i)) {
          return "Evento";
        }
        
        // Task keywords
        if (content.match(/hacer|pendiente|terminar|entregar|tarea|completar|finalizar|deadline/i)) {
          return "Tarea";
        }
        
        // Appointment keywords
        if (content.match(/cita|doctor|psicólogo|entrevista|consulta|médico|dental|dentista|terapia/i)) {
          return "Agenda de citas";
        }
        
        // Default classification
        return "Evento";
      };

      // Function to find a matching contact
      const findMatchingContact = (event, contacts) => {
        // Parse contacts from the provided JSON string
        const contactsList = typeof contacts === 'string' ? JSON.parse(contacts) : contacts;
        
        if (!contactsList || contactsList.length === 0) {
          return null;
        }
        
        // Extract event information
        const title = event.summary || "";
        const description = event.description || "";
        const attendees = event.attendees || [];
        const attendeeEmails = attendees.map(attendee => attendee.email);
        
        // Try to match by email
        for (const attendeeEmail of attendeeEmails) {
          const contactByEmail = contactsList.find(
            contact => contact.email && contact.email.toLowerCase() === attendeeEmail.toLowerCase()
          );
          
          if (contactByEmail) {
            return {
              id: contactByEmail.id,
              nombre: contactByEmail.name,
              email: contactByEmail.email,
              match_type: "email"
            };
          }
        }
        
        // Try to match by name in title
        for (const contact of contactsList) {
          if (contact.name && title.toLowerCase().includes(contact.name.toLowerCase())) {
            return {
              id: contact.id,
              nombre: contact.name,
              email: contact.email,
              match_type: "name"
            };
          }
        }
        
        // Try to match by phone number in description
        for (const contact of contactsList) {
          if (contact.phone && description.includes(contact.phone)) {
            return {
              id: contact.id,
              nombre: contact.name,
              email: contact.email,
              match_type: "phone"
            };
          }
        }
        
        return null;
      };

      // Process and classify the calendar events
      const classifiedEvents = data.items.map(event => {
        const eventType = classifyEvent(event.summary, event.description);
        const contactMatch = findMatchingContact(event, contact_ids);
        
        return {
          id: event.id,
          tipo: eventType,
          titulo: event.summary || "Sin título",
          fecha: event.start?.dateTime || event.start?.date,
          hora_fin: event.end?.dateTime || event.end?.date,
          participantes: (event.attendees || []).map(attendee => attendee.email),
          descripcion: event.description || "",
          contacto_vinculado: contactMatch,
          event_data: event // Include the full event data for reference
        };
      });
      
      return new Response(
        JSON.stringify({ events: classifiedEvents }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For standard requests, just return the data
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
