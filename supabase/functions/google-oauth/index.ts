
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function to extract URL from text content if present
function extractUrlFromText(text) {
  if (!text) return undefined;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches ? matches[0] : undefined;
}

// Function to find potential contact matches in text
function findPotentialContactMatches(text, contacts) {
  if (!text || !contacts || contacts.length === 0) return [];
  
  const matches = [];
  const textLower = text.toLowerCase();
  
  // Check for each contact if their name or email appears in the text
  contacts.forEach(contact => {
    const name = contact.name?.toLowerCase();
    const email = contact.email?.toLowerCase();
    
    // Check for name match
    if (name && textLower.includes(name)) {
      matches.push(contact.name);
    }
    
    // Check for email match
    if (email && textLower.includes(email)) {
      if (!matches.includes(contact.name)) {
        matches.push(contact.name);
      }
    }
  });
  
  return matches;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { access_token, endpoint, contact_ids, crm_contacts } = await req.json();

    if (!access_token) {
      return new Response(
        JSON.stringify({ error: "Access token is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Handle different endpoints
    if (endpoint === "classified_calendar") {
      // Fetch and classify calendar events
      const calendarResponse = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=" +
          new Date().toISOString() +
          "&timeMax=" +
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() +
          "&singleEvents=true&orderBy=startTime",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!calendarResponse.ok) {
        throw new Error(`Google Calendar API error: ${calendarResponse.status}`);
      }

      const calendarData = await calendarResponse.json();
      
      // Process and classify events
      const events = calendarData.items.map((event) => {
        // Basic event classification logic
        let eventType = "meeting";
        let priority = "medium";
        
        const title = event.summary?.toLowerCase() || "";
        const description = event.description?.toLowerCase() || "";
        
        if (title.includes("urgent") || description.includes("urgent")) {
          priority = "high";
        }
        
        if (title.includes("call") || title.includes("chat") || description.includes("call")) {
          eventType = "call";
        } else if (title.includes("review") || description.includes("review")) {
          eventType = "review";
        }
        
        return {
          id: event.id,
          title: event.summary || "No title",
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          description: event.description || "",
          location: event.location || "",
          attendees: event.attendees || [],
          classification: {
            type: eventType,
            priority: priority,
          },
        };
      });

      return new Response(
        JSON.stringify({ events }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } 
    else if (endpoint === "integrated_calendar") {
      // Fetch calendar events
      const calendarResponse = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=" +
          new Date().toISOString() +
          "&timeMax=" +
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() +
          "&singleEvents=true&orderBy=startTime",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!calendarResponse.ok) {
        throw new Error(`Google Calendar API error: ${calendarResponse.status}`);
      }

      const calendarData = await calendarResponse.json();

      // Fetch Google contacts
      const contactsResponse = await fetch(
        "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations,photos",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!contactsResponse.ok) {
        throw new Error(`Google People API error: ${contactsResponse.status}`);
      }

      const contactsData = await contactsResponse.json();

      // Fetch tasks
      const tasksListResponse = await fetch(
        "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!tasksListResponse.ok) {
        throw new Error(`Google Tasks API error: ${tasksListResponse.status}`);
      }

      const tasksListData = await tasksListResponse.json();
      
      // Process Google contacts
      const googleContacts = contactsData.connections?.map((contact) => {
        const name = contact.names?.[0]?.displayName || "Sin nombre";
        const email = contact.emailAddresses?.[0]?.value || "";
        const phone = contact.phoneNumbers?.[0]?.value || "";
        const company = contact.organizations?.[0]?.name || "";
        const photoUrl = contact.photos?.[0]?.url || "";
        
        return {
          google_id: contact.resourceName,
          name,
          email,
          phone,
          company,
          photo_url: photoUrl,
          source: "google",
        };
      }) || [];

      // Get all tasks from all lists
      const allTasks = [];
      for (const list of tasksListData.items || []) {
        const tasksResponse = await fetch(
          `https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          if (tasksData.items) {
            // Process tasks with contact matching
            const processedTasks = tasksData.items.map(task => {
              // Extract link from title or notes if present
              const linkFromTitle = extractUrlFromText(task.title);
              const linkFromNotes = extractUrlFromText(task.notes);
              const link = linkFromNotes || linkFromTitle;
              
              // Find potential contact matches in task title or notes
              const titleMatches = findPotentialContactMatches(task.title, crm_contacts || []);
              const notesMatches = findPotentialContactMatches(task.notes, crm_contacts || []);
              
              // Combine unique matches
              const allMatches = [...new Set([...titleMatches, ...notesMatches])];
              
              // Create contact association options
              const contactAssociation = allMatches.length > 0 ? {
                options: [...allMatches, "Nuevo contacto"],
                selected: null
              } : undefined;
              
              return {
                ...task,
                listId: list.id,
                listTitle: list.title,
                link: link,
                contactAssociation: contactAssociation
              };
            });
            
            allTasks.push(...processedTasks);
          }
        }
      }

      // Process and integrate events with contacts
      const processedEvents = [];
      
      // Process calendar events
      for (const event of calendarData.items || []) {
        if (event.status === "cancelled") continue;
        
        const eventAttendees = event.attendees || [];
        let matchedContact = null;
        
        // Check if any attendee matches a CRM contact
        for (const attendee of eventAttendees) {
          const attendeeEmail = attendee.email?.toLowerCase();
          if (!attendeeEmail) continue;
          
          // Check against CRM contacts
          const crmMatch = crm_contacts?.find(
            contact => contact.email?.toLowerCase() === attendeeEmail
          );
          
          if (crmMatch) {
            matchedContact = {
              id: crmMatch.id,
              nombre: crmMatch.name,
              email: crmMatch.email,
              phone: crmMatch.phone,
              company: crmMatch.company,
              notes: crmMatch.notes,
            };
            break;
          }
          
          // Check against Google contacts if no CRM match
          const googleMatch = googleContacts.find(
            contact => contact.email?.toLowerCase() === attendeeEmail
          );
          
          if (googleMatch && !matchedContact) {
            matchedContact = {
              nombre: googleMatch.name,
              email: googleMatch.email,
              phone: googleMatch.phone,
              company: googleMatch.company,
              photo_url: googleMatch.photo_url,
              google_id: googleMatch.google_id,
            };
          }
        }
        
        // Determine action based on contact match
        let action = null;
        if (matchedContact) {
          action = matchedContact.id ? "vinculado" : "importado_al_crm";
        }
        
        // Determine event type
        let eventType = "Evento";
        const title = event.summary?.toLowerCase() || "";
        const description = event.description?.toLowerCase() || "";
        
        if (title.includes("cita") || title.includes("reunión") || title.includes("meeting")) {
          eventType = "Agenda de citas";
        }
        
        processedEvents.push({
          id: event.id,
          tipo: eventType,
          titulo: event.summary || "Sin título",
          fecha: event.start?.dateTime || event.start?.date,
          hora_fin: event.end?.dateTime || event.end?.date,
          participantes: eventAttendees.map(a => a.email || ""),
          descripcion: event.description || "",
          contacto_vinculado: matchedContact,
          accion: action,
          event_data: event,
        });
      }
      
      // Process tasks as events
      for (const task of allTasks) {
        if (task.status === "completed") continue;
        
        // Use due date if available, otherwise use current date
        const taskDate = task.due ? new Date(task.due) : new Date();
        
        processedEvents.push({
          id: task.id,
          tipo: "Tarea",
          titulo: task.title || "Sin título",
          fecha: taskDate.toISOString(),
          hora_fin: new Date(taskDate.getTime() + 30 * 60000).toISOString(), // Add 30 minutes
          participantes: [],
          descripcion: task.notes || "",
          contacto_vinculado: task.contactAssociation ? { 
            sugerencias: task.contactAssociation.options 
          } : null,
          accion: task.contactAssociation ? "asociar_a_contacto" : null,
          event_data: task,
          link: task.link
        });
      }
      
      // Sort events by date
      processedEvents.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

      return new Response(
        JSON.stringify({ 
          eventos: processedEvents,
          contactos_google: googleContacts
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    else {
      return new Response(
        JSON.stringify({ error: "Invalid endpoint" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
