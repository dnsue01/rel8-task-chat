
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get OpenAI API key from environment variables or request body
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
    const { prompt, context, apiKey, messages } = await req.json();
    
    // Get the API key either from environment or from request
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || apiKey;
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ 
          error: "API key is required. Please provide an OpenAI API key." 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare messages for OpenAI
    const systemMessage = context 
      ? `Eres un asistente de IA para un CRM. Aquí está el contexto del usuario: ${context}`
      : "Eres un asistente de IA para un CRM. Proporciona respuestas útiles y concisas.";
    
    // Format previous messages for OpenAI context
    const formattedMessages = [
      { role: "system", content: systemMessage },
    ];
    
    // Add conversation history
    if (messages && Array.isArray(messages)) {
      messages.forEach((msg: any) => {
        if (msg.sender === "user") {
          formattedMessages.push({ role: "user", content: msg.text });
        } else if (msg.sender === "ai") {
          formattedMessages.push({ role: "assistant", content: msg.text });
        }
      });
    }
    
    // Add the current prompt
    formattedMessages.push({ role: "user", content: prompt });
    
    console.log("Sending request to OpenAI with context:", { 
      systemMessage, 
      messagesCount: formattedMessages.length 
    });

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using a more affordable model, can be upgraded to gpt-4o
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Invalid response from OpenAI API");
    }

    // Return the AI response
    return new Response(
      JSON.stringify({ 
        text: data.choices[0].message.content,
        usage: data.usage,
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while processing your request" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
