
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
    const { access_token, endpoint } = body;

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
        url = "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&timeMin=" + 
              new Date().toISOString();
        break;
      case "tasks":
        url = "https://tasks.googleapis.com/tasks/v1/users/@me/lists";
        break;
      case "gmail":
        url = "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10";
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid endpoint specified" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log(`Calling Google API ${endpoint} endpoint...`);
    
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
          details: data 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

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
